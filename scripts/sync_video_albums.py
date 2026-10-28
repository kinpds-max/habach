#!/usr/bin/env python3
"""Publish public Supabase posts into existing HTML; no visitor-time YouTube reads."""
import argparse
import html
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VIEWS = re.compile(r'(const views\s*=\s*)(\{[\s\S]*?\})(;)')
VIDEO_ID = re.compile(r'[A-Za-z0-9_-]{11}')
# Other sections have curated submenus and are intentionally left intact.
SECTIONS = ('sermon-1', 'sermon-8', 'sermon-2', 'sermon-7', 'sermon-4', 'sermon-6', 'sermon-10')
GRID = re.compile(r'(<div class="hb-static-sermon-grid">)(.*?)(</div></section>)', re.S)
CARD = re.compile(r'<a\b[^>]*\bdata-video="([A-Za-z0-9_-]{11})"[^>]*>.*?</a>', re.S)


def read_posts():
    config = (ROOT / 'config.js').read_text()
    base = re.search(r"supabaseUrl:'([^']+)'", config)[1]
    key = re.search(r"supabasePublishableKey:'([^']+)'", config)[1]
    if base != 'https://veghdecosrimscedkrdo.supabase.co':
        raise ValueError('Unexpected Supabase project')
    posts = []
    for offset in range(0, 100000, 500):
        query = urllib.parse.urlencode({
            'select': 'id,section_key,title,youtube_id,published_at,created_at',
            'published': 'eq.true', 'youtube_id': 'not.is.null',
            'section_key': 'in.(' + ','.join(SECTIONS) + ')',
            'order': 'published_at.desc.nullslast,id.asc', 'limit': 500, 'offset': offset,
        })
        request = urllib.request.Request(base + '/rest/v1/church_posts?' + query,
                                         headers={'apikey': key})
        with urllib.request.urlopen(request, timeout=40) as response:
            batch = json.load(response)
        if not isinstance(batch, list):
            raise ValueError('Invalid posts response')
        posts.extend(batch)
        if len(batch) < 500:
            return posts
    raise ValueError('Post pagination limit reached')


def post_date(post):
    # Prefer dates explicitly in sermon titles over historical import timestamps.
    if post['section_key'] in ('sermon-1', 'sermon-8', 'sermon-2', 'sermon-7'):
        found = re.search(r'(20\d{2})\s*[.년/-]\s*(\d{1,2})\s*[.월/-]\s*(\d{1,2})', post['title'])
        if found:
            from datetime import date
            try:
                return date(*map(int, found.groups())).isoformat()
            except ValueError:
                pass
    return (post.get('published_at') or '')[:10]


def render_card(post, home=False):
    vid = post['youtube_id']
    title = html.escape(post['title'], quote=True)
    day = post_date(post)
    date = f'<time datetime="{day}">{day}</time>' if day and not home else ''
    classes = 'sermon-album-card ' + ('home-six-card' if home else 'static-sermon-card')
    return (f'<a href="https://www.youtube.com/watch?v={vid}" target="_blank" '
            f'rel="noopener noreferrer" class="{classes}" data-video="{vid}" data-title="{title}">'
            f'<span class="sermon-album-thumb"><img loading="lazy" '
            f'src="https://i.ytimg.com/vi/{vid}/hqdefault.jpg" alt="{title} 미리보기">'
            '<i aria-hidden="true">▶</i></span><span class="sermon-album-copy">'
            f'<strong>{title}</strong>{date}</span></a>')


def synchronize(source, posts):
    match = VIEWS.search(source)
    if not match:
        raise ValueError('Cannot locate JSON views')
    views = json.loads(match[2])
    home_updates = []
    summary = {}
    for key in SECTIONS:
        by_id = {}
        for post in posts:
            if post.get('section_key') != key:
                continue
            vid, title = post.get('youtube_id', ''), post.get('title', '')
            if not VIDEO_ID.fullmatch(vid) or not isinstance(title, str) or not title.strip():
                raise ValueError(f'Invalid video post in {key}')
            by_id.setdefault(vid, post)
        if not by_id:
            continue  # An empty or restricted API response must never erase an album.
        page = views.get(key, '')
        grid = GRID.search(page)
        if not grid:
            if key == 'sermon-10':
                continue  # This board uses a different member-sharing layout.
            raise ValueError(f'Missing existing static grid for {key}')
        existing = {m[1]: m[0] for m in CARD.finditer(grid[2])}
        # Keep curated static-only videos even if they have not yet been imported to DB.
        preserved = [markup for vid, markup in existing.items() if vid not in by_id]
        ordered = sorted(by_id.values(), key=lambda p: (post_date(p), p.get('published_at') or '', p['youtube_id']), reverse=True)
        cards = ''.join(render_card(p) for p in ordered) + ''.join(preserved)
        page = page[:grid.start(2)] + cards + page[grid.end(2):]
        count = len(by_id) + len(preserved)
        page = re.sub(r'(게시영상\s*)\d+(개)', lambda m: m[1] + str(count) + m[2], page)
        views[key] = page
        summary[key] = {'posts': len(by_id), 'static': count, 'new': len(set(by_id) - set(existing))}
        if key != 'sermon-6':  # Keep the church introduction as the curated home feature.
            pattern = re.compile(r'(<div class="home-six-item"><div class="home-six-label">'
                                 r'<strong>[^<]*</strong><a href="#/' + re.escape(key) + r'">.*?</a></div>)'
                                 r'<a\b[^>]*data-video="[^"]+".*?</a>(</div>)', re.S)
            replacement = lambda m: m[1] + render_card(ordered[0], True) + m[2]
            views['index'] = pattern.sub(replacement, views['index'], count=1)
            home_updates.append((pattern, ordered[0]))
    encoded = json.dumps(views, ensure_ascii=False, separators=(',', ':')).replace('</script', '<\\/script')
    updated = source[:match.start(2)] + encoded + source[match.end(2):]
    for pattern, post in home_updates:
        updated = pattern.sub(lambda m: m[1] + render_card(post, True) + m[2], updated, count=1)
    parsed = json.loads(VIEWS.search(updated)[2])
    if set(parsed) != set(views):
        raise ValueError('View keys changed unexpectedly')
    return updated, summary


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--posts', type=Path, help='Use a local verified public-post fixture')
    parser.add_argument('--check', action='store_true', help='Fail if the album needs updating')
    args = parser.parse_args()
    posts = json.loads(args.posts.read_text()) if args.posts else read_posts()
    target = ROOT / 'index.html'
    source = target.read_text()
    updated, summary = synchronize(source, posts)
    print(json.dumps({'changed': source != updated, 'albums': summary}, ensure_ascii=False))
    if args.check and source != updated:
        raise SystemExit(1)
    if updated != source:
        temporary = target.with_suffix('.html.tmp')
        temporary.write_text(updated)
        temporary.replace(target)

if __name__ == '__main__':
    main()
