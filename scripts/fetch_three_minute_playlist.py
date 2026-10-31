#!/usr/bin/env python3
import json,subprocess
from pathlib import Path
playlist='https://www.youtube.com/playlist?list=PLmD7ZicLdWIqYlRu54fXWc82k0mGBZMnv'
out=Path('assets/three-minute-sermon-videos.json')
p=subprocess.run(['yt-dlp','--flat-playlist','--skip-download','--dump-single-json','--no-warnings',playlist],capture_output=True,text=True,timeout=120)
if p.returncode: 
 print('Playlist retrieval failed; retain existing links:',p.stderr[:600])
 raise SystemExit(0)
try: entries=json.loads(p.stdout).get('entries') or []
except Exception as exc:
 print('Invalid playlist:',exc);raise SystemExit(0)
items=[];seen=set()
for e in entries:
 if not isinstance(e,dict):continue
 v=e.get('id');title=e.get('title') or '3분설교'
 if isinstance(v,str) and len(v)==11 and v not in seen:
  seen.add(v);items.append({'id':v,'title':title})
if len(items)>=2:
 out.write_text(json.dumps(items,ensure_ascii=False,indent=2)+'\n')
 print('Saved videos:',len(items))
else:print('Too few videos; retained old list')
