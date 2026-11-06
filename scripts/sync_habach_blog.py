import json, re, urllib.request, xml.etree.ElementTree as ET, html
from pathlib import Path
url="https://rss.blog.naver.com/habachurch.xml"
req=urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0 (compatible; HabachChurchPreview/1.0)"})
with urllib.request.urlopen(req,timeout=25) as res: data=res.read()
root=ET.fromstring(data)
posts=[]
for item in root.findall(".//channel/item")[:8]:
 def field(k): return (item.findtext(k) or "").strip()
 title=html.unescape(re.sub("<[^>]*>","",field("title")))
 link=field("link")
 desc=html.unescape(field("description"))
 desc=re.sub("<[^>]*>"," ",desc)
 desc=re.sub(r"\\s+"," ",desc).strip()[:180]
 if not link.startswith("https://blog.naver.com/"): continue
 posts.append({"title":title,"url":link,"date":field("pubDate"),"excerpt":desc})
if not posts: raise RuntimeError("RSS returned no posts; preserving existing preview")
p=Path("assets/habach-naver-blog.json")
p.parent.mkdir(parents=True,exist_ok=True)
p.write_text(json.dumps({"source":url,"posts":posts},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
