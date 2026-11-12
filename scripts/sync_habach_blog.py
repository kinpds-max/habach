"""Sync the public church blog RSS, including each article's representative image."""
import html
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

FEED = "https://rss.blog.naver.com/habachurch.xml"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; HabachChurchPreview/1.0)"}
PAGE_ID = re.compile(r"^https://blog\.naver\.com/habachurch/(\d+)")


def safe_image(url):
    url = html.unescape(str(url or "")).replace("\\/", "/").strip()
    if url.startswith("http://"):
        url = "https://" + url[7:]
    try:
        parsed = urlparse(url)
        host = (parsed.hostname or "").lower()
        if parsed.scheme != "https" or not host:
            return None
        if not (host.endswith(".pstatic.net") or host in ("i.ytimg.com", "img.youtube.com")):
            return None
        return url
    except ValueError:
        return None


class ImageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.representative = None
        self.first_image = None

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == "meta" and (attrs.get("property") or attrs.get("name") or "").lower() in (
            "og:image", "twitter:image", "twitter:image:src"
        ):
            self.representative = self.representative or safe_image(attrs.get("content"))
        elif tag == "img":
            source = attrs.get("data-lazy-src") or attrs.get("data-src") or attrs.get("src")
            self.first_image = self.first_image or safe_image(source)


def extract_image(content):
    parser = ImageParser()
    content = html.unescape(content or "")
    try:
        parser.feed(content)
    except Exception:
        pass
    if parser.representative or parser.first_image:
        return parser.representative or parser.first_image
    vid = re.search(r"(?:youtube(?:-nocookie)?\.com/(?:embed/|watch\?v=)|youtu\.be/)([-_A-Za-z0-9]{11})", content)
    if vid:
        return "https://i.ytimg.com/vi/" + vid.group(1) + "/hqdefault.jpg"
    return None


def load_page_image(post):
    if post["image"]:
        return post
    match = PAGE_ID.match(post["url"])
    if not match:
        return post
    url = "https://m.blog.naver.com/habachurch/" + match.group(1)
    try:
        request = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(request, timeout=7) as response:
            markup = response.read(2 * 1024 * 1024).decode("utf-8", errors="replace")
        post["image"] = extract_image(markup)
    except Exception:
        pass  # Some public posts block bot requests; keep existing posts.
    return post


request = urllib.request.Request(FEED, headers=HEADERS)
with urllib.request.urlopen(request, timeout=25) as response:
    raw = response.read()

root = ET.fromstring(raw)
posts = []
for item in root.findall(".//channel/item")[:8]:
    def field(name):
        return (item.findtext(name) or "").strip()

    title = html.unescape(re.sub(r"<[^>]*>", "", field("title")))
    link = field("link")
    if not PAGE_ID.match(link):
        continue

    description_markup = html.unescape(field("description"))
    description = re.sub(r"<[^>]*>", " ", description_markup)
    description = re.sub(r"\s+", " ", description).strip()[:180]

    # Prefer the attached RSS image; otherwise check that exact public post.
    image = extract_image(description_markup)
    if not image:
        for child in item.iter():
            image = safe_image(child.attrib.get("url"))
            if image:
                break
    posts.append({
        "title": title,
        "url": link,
        "date": field("pubDate"),
        "excerpt": description,
        "image": image,
    })

if not posts:
    raise RuntimeError("RSS returned no posts; preserving existing preview")

with ThreadPoolExecutor(max_workers=4) as executor:
    posts = list(executor.map(load_page_image, posts))

output = Path("assets/habach-naver-blog.json")
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(
    json.dumps({"source": FEED, "posts": posts}, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
