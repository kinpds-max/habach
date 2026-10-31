#!/usr/bin/env python3
"""Refresh verified BT and BT Sharing Festival YouTube playlist entries."""
import json,subprocess
from pathlib import Path
sources={"sermon-member-6":"https://www.youtube.com/playlist?list=PLmD7ZicLdWIo789op9oY2lBV5GepGgjCP","sermon-member-7":"https://www.youtube.com/playlist?list=PLmD7ZicLdWIqG1Hn-kmTOXVzmtKv6LW9h"}
target=Path("assets/bt-playlist-videos.json")
saved=json.loads(target.read_text()) if target.exists() else {}
for route,url in sources.items():
 try:
  proc=subprocess.run(["yt-dlp","--flat-playlist","--skip-download","--dump-single-json","--no-warnings",url],capture_output=True,text=True,timeout=180)
  if proc.returncode:raise RuntimeError(proc.stderr[-400:])
  items=json.loads(proc.stdout).get("entries") or []
  seen=set();entries=[]
  for item in items:
   if not isinstance(item,dict):continue
   v=item.get("id");title=str(item.get("title") or "").strip()
   if not isinstance(v,str) or len(v)!=11 or v in seen or not title or title in ("[Deleted video]","[Private video]"):continue
   seen.add(v);entries.append({"id":v,"title":title})
  if entries:saved[route]=entries;print(route,len(entries))
  else:print(route,"no entries, keep last good data")
 except Exception as e:print(route,str(e)[:300])
if saved:target.write_text(json.dumps(saved,ensure_ascii=False,indent=2)+"\n")
