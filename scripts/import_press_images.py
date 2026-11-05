#!/usr/bin/env python3
"""Copy approved press images from an external media CDN into this website's static assets."""
import json
import hashlib
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
    OUT.mkdir(parents=True, exist_ok=True)
    success = 0
    local_count = 0
    for post in records:
        images = list(post.get("images") or ([post["image"]] if post.get("image") else []))
        results = []
        for url in images:
            if url.startswith("/assets/press/"):
                results.append(url)
                local_count += 1
                continue
            parts = urllib.parse.urlsplit(url)
            if parts.hostname != ALLOWED_HOST or parts.scheme != "https":
                results.append(url)
                continue
            ext = pathlib.Path(parts.path).suffix.lower()
            if ext not in (".jpg", ".jpeg", ".png", ".webp"):
                results.append(url)
                continue
            name = "press-" + hashlib.sha256(url.encode("utf-8")).hexdigest()[:16] + ext
            filename = OUT / name
            local_url = "/assets/press/" + name
            try:
                if not filename.exists():
                    size = download(url, filename)
                    print(f"Imported {size} bytes: {local_url}")
                    success += 1
                results.append(local_url)
                local_count += 1
            except Exception as exc:
                print(f"Could not import {url}: {type(exc).__name__}: {exc}")
                results.append(url)
        if results:
            post["images"] = results
            post["image"] = results[0]
    DATA.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\\n", encoding="utf-8")
    print(f"Newly imported {success}; local article images referenced: {local_count}")
    if local_count == 0:
        raise RuntimeError("No local press images available")


if __name__ == "__main__":
    main()
