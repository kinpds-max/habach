#!/usr/bin/env python3
"""Copy approved press images from an external media CDN into this website's static assets."""
import json
import pathlib
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
DATA = ROOT / "assets" / "church-press.json"
OUT = ROOT / "assets" / "press"
ALLOWED_HOST = "d2ol7oe51mr4n9.cloudfront.net"
ARTICLE_MATCH = "number=25709"
MAX_SIZE = 12_000_000


def download(url, filename):
    parsed = urllib.parse.urlsplit(url)
    if parsed.scheme != "https" or parsed.hostname != ALLOWED_HOST:
        raise ValueError("Only the approved media CDN is allowed")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; HabachPressImporter/1.0)", "Accept": "image/avif,image/webp,image/png,image/jpeg,*/*"})
    with urllib.request.urlopen(req, timeout=35) as response:
        data = response.read(MAX_SIZE + 1)
    if len(data) > MAX_SIZE:
        raise ValueError("Image too large")
    if not (data.startswith(b"\x89PNG\r\n\x1a\n") or data.startswith(b"\xff\xd8\xff") or data.startswith(b"RIFF")):
        raise ValueError("Downloaded response is not a supported image")
    filename.write_bytes(data)
    return len(data)


def main():
    records = json.loads(DATA.read_text(encoding="utf-8"))
    post = next((p for p in records if ARTICLE_MATCH in p.get("url", "")), None)
    if post is None:
        raise RuntimeError("MOU press article was not found")
    OUT.mkdir(parents=True, exist_ok=True)
    urls = list(post.get("images") or [])
    new_urls = []
    success = 0
    for i, url in enumerate(urls, 1):
        ext = pathlib.Path(urllib.parse.urlsplit(url).path).suffix.lower()
        if ext not in (".png", ".jpg", ".jpeg", ".webp"):
            print("Unsupported file extension for image", i)
            new_urls.append(url)
            continue
        filename = OUT / ("mou-2025-" + str(i).zfill(2) + ext)
        local_url = "/assets/press/" + filename.name
        if url.startswith("/assets/press/") or filename.exists():
            if filename.exists():
                new_urls.append(local_url)
                continue
            new_urls.append(url)
            continue
        try:
            size = download(url, filename)
            print(f"Imported image {i}: {size} bytes to {local_url}")
            success += 1
            new_urls.append(local_url)
        except Exception as error:
            print(f"Could not import image {i}: {type(error).__name__}: {error}")
            new_urls.append(url)
    post["images"] = new_urls
    if new_urls and new_urls[0].startswith("/assets/press/"):
        post["image"] = new_urls[0]
    DATA.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {success} images, {len(new_urls)} total")
    if not any(u.startswith("/assets/press/") for u in new_urls):
        raise RuntimeError("No images were imported to static assets")


if __name__ == "__main__":
    main()
