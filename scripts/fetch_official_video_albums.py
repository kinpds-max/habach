#!/usr/bin/env python3
import json,subprocess
from pathlib import Path
lists={
'sermon-8':'PLmD7ZicLdWIpZeJVlgfXuYYaOSHjwuG6R',
'sermon-member-1':'PLmD7ZicLdWIqhiIi5ZfjOzIx1uiJI8f0c',
'sermon-member-2':'PLmD7ZicLdWIqmp13mlhv_6a_qVi59Fjkm',
'sermon-member-3':'PLmD7ZicLdWIpFunENSvRQ9OM-LkHr_-07',
'sermon-member-4':'PLmD7ZicLdWIr3-kWBB-H1-hD9D4NokQyU',
'sermon-member-5':'PLmD7ZicLdWIqfKtJXSTyp8e1Qb2DIQ5tr'}
out=Path('assets/official-video-albums.json')
previous=json.loads(out.read_text()) if out.exists() else {}
for key,playlist in lists.items():
 try:
  p=subprocess.run(['yt-dlp','--flat-playlist','--skip-download','--dump-single-json','--no-warnings','https://www.youtube.com/playlist?list='+playlist],capture_output=True,text=True,timeout=100)
  if p.returncode:continue
  videos=[];seen=set()
  for item in (json.loads(p.stdout).get('entries') or []):
   vid=item.get('id');title=item.get('title') or ''
   if isinstance(vid,str) and len(vid)==11 and vid not in seen:
    seen.add(vid);videos.append({'id':vid,'title':title})
  if videos:previous[key]=videos[:30]
 except Exception as e:print(key,str(e)[:160])
out.write_text(json.dumps(previous,ensure_ascii=False,indent=2)+'\n')
print({k:len(v) for k,v in previous.items()})
