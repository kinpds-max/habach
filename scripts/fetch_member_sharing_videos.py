#!/usr/bin/env python3
import json,subprocess
from pathlib import Path
path=Path("assets/member-sharing-videos.json")
queries=["ytsearch80:성도나눔 김포 하늘바람교회","ytsearch80:성도 간증 하늘바람교회"]
videos=[];seen=set()
for q in queries:
 try:
  p=subprocess.run(["yt-dlp","--flat-playlist","--skip-download","--dump-single-json","--no-warnings",q],capture_output=True,text=True,timeout=120)
  if p.returncode!=0:continue
  entries=json.loads(p.stdout).get("entries") or []
  for e in entries:
   if not isinstance(e,dict):continue
   vid=e.get("id");title=str(e.get("title") or "");channel=str(e.get("channel") or e.get("uploader") or "")
   cid=str(e.get("channel_id") or "")
   if not isinstance(vid,str) or len(vid)!=11 or vid in seen:continue
   if cid!="UCzQ6kPUzNNbU3EtJI5X1mhQ" and not any(k in channel for k in ["하늘바람교회","김포하늘바람교회"]):continue
   if not any(k in title for k in ["성도","간증","나눔"]):continue
   seen.add(vid);videos.append({"id":vid,"title":title})
 except Exception as ex:print(type(ex).__name__,str(ex)[:150])
if videos:
 path.write_text(json.dumps(videos,ensure_ascii=False,indent=2)+"\n")
 print("Saved verified member sharing videos:",len(videos))
else:print("No verifiable channel-specific member sharing videos: retaining existing list")
