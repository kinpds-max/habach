#!/usr/bin/env python3
"""Refresh official Naver blog previews while preserving known thumbnails on feed failures."""
import html
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

DEST = Path("assets/habach-naver-blog.json")
FEED = "https://rss.blog.naver.com/habachurch.xml"
existing = {}
if DEST.exists():
    try:
        existing = {p["url"].split("?")[0]: p for p in json.loads(DEST.read_text(encoding="utf-8")).get("posts", [])}
    except (ValueError, KeyError, TypeError):
        pass
req = urllib.request.Request(FEED, headers={"User-Agent": "Mozilla/5.0 (compatible; HabachChurchPreview/1.0)"})
with urllib.request.urlopen(req, timeout=25) as response:
    root = ET.fromstring(response.read())
posts = []
for item in root.findall(".//channel/item")[:12]:
    def field(key):
        return (item.findtext(key) or "").strip()
    title = html.unescape(re.sub(r"<[^>]*>", "", field("title")))
    url = html.unescape(field("link"))
    if not url.startswith("https://blog.naver.com/habachurch/"):
        continue
    description = html.unescape(field("description"))
    excerpt = re.sub(r"\s+", " ", re.sub(r"<[^>]*>", " ", description)).strip()[:180]
    previous = existing.get(url.split("?")[0], {})
    image = previous.get("image", "")
    if not image:
        match = re.search(r'<img[^>]+src=["\']([^"\']+)', description, re.I)
        if match:
            image = html.unescape(match.group(1))
    post = {"title": title, "url": url, "date": field("pubDate"), "excerpt": excerpt}
    if image.startswith("https://"):
        post["image"] = image
    posts.append(post)
if not posts:
    raise RuntimeError("No public RSS posts; existing data left unchanged")
DEST.parent.mkdir(parents=True, exist_ok=True)
DEST.write_text(json.dumps({"source": FEED, "posts": posts}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Synced {len(posts)} official blog posts")
