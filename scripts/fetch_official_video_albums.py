#!/usr/bin/env python3
import json,subprocess,re,datetime
from pathlib import Path

MONTHS={'jan':1,'feb':2,'mar':3,'apr':4,'may':5,'jun':6,'jul':7,'aug':8,'sep':9,'oct':10,'nov':11,'dec':12}
WEEKDAYS=['월요일','화요일','수요일','목요일','금요일','토요일','일요일']

def dawn_date(title):
 title=str(title or '')
 m=re.search(r'(20\d{2})\s*[.\-/년]\s*(\d{1,2})\s*[.\-/월]\s*(\d{1,2})',title)
 if m: year,month,day=map(int,m.groups())
 else:
  m=re.search(r'(\d{1,2})\s*[/\.]\s*(\d{1,2})\s*[/\.]\s*(20\d{2})',title)
  if m: month,day,year=map(int,m.groups())
  else:
   m=re.search(r'(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+(\d{1,2}),?\s*(20\d{2})',title,re.I)
   if not m:return None
   month=MONTHS[m.group(1)[:3].lower()];day=int(m.group(2));year=int(m.group(3))
 try:return datetime.date(year,month,day)
 except ValueError:return None

def korean_dawn_title(title):
 if re.search(r'[가-힣]',title):return title
 d=dawn_date(title)
 if not d:return title
 return f'[새벽예배] - {WEEKDAYS[d.weekday()]} - {d.year}. {d.month}. {d.day}. 하늘바람교회'

lists={
'sermon-8':'PLmD7ZicLdWIpZeJVlgfXuYYaOSHjwuG6R',
'sermon-event-1':'PLmD7ZicLdWIr2ZEuTbox3JN1HtmZPL4G-',
'sermon-event-2':'PLmD7ZicLdWIogu1FRwzVeQEl5u65ergLO',
'sermon-member-1':'PLmD7ZicLdWIqhiIi5ZfjOzIx1uiJI8f0c',
'sermon-member-2':'PLmD7ZicLdWIqmp13mlhv_6a_qVi59Fjkm',
'sermon-member-3':'PLmD7ZicLdWIpFunENSvRQ9OM-LkHr_-07',
'sermon-member-4':'PLmD7ZicLdWIr3-kWBB-H1-hD9D4NokQyU',
'sermon-member-5':'PLmD7ZicLdWIqfKtJXSTyp8e1Qb2DIQ5tr'}
out=Path('assets/official-video-albums.json')
previous=json.loads(out.read_text()) if out.exists() else {}
# Include recent public uploads from the official channel, not only playlist additions.
def recent_channel_dawn():
 try:
  cmd=['yt-dlp','--flat-playlist','--skip-download','--playlist-end','35',
       '--dump-single-json','--no-warnings',
       'https://www.youtube.com/@Gimpo_HBC/videos']
  result=subprocess.run(cmd,capture_output=True,text=True,timeout=110)
  if result.returncode:return []
  raw=json.loads(result.stdout)
  out=[]
  for video in raw.get('entries') or []:
   vid=video.get('id');title=str(video.get('title') or '')
   if not isinstance(vid,str) or len(vid)!=11:continue
   if not (re.search(r'새벽(?:예배|기도|설교)',title) or re.search(r'\b(?:Dawn|Early Morning|Morning (?:Service|Worship))\b',title,re.I)):continue
   if not dawn_date(title):continue
   out.append({'id':vid,'title':korean_dawn_title(title)})
  return out
 except Exception as e:
  print('channel dawn lookup failed:',str(e)[:160]);return []

# Fetch recent official uploads for independent Friday evening and Sunday services.
def recent_special_services():
 try:
  p=subprocess.run(['yt-dlp','--flat-playlist','--skip-download','--playlist-end','65',
   '--dump-single-json','--no-warnings','https://www.youtube.com/@Gimpo_HBC/videos'],
   capture_output=True,text=True,timeout=110)
  if p.returncode:return {}
  found={'friday-evening':[],'david-worship':[]}
  for item in (json.loads(p.stdout).get('entries') or []):
   vid=item.get('id');title=str(item.get('title') or '')
   if not isinstance(vid,str) or len(vid)!=11:continue
   if re.search(r'금요(?:예배|설교|철야|기도)|금요일\\s*(?:저녁|예배)|Friday (?:Service|Worship)',title,re.I):key='friday-evening'
   elif re.search(r'다윗의\\s*예배',title):key='david-worship'
   else:continue
   found[key].append({'id':vid,'title':title,'url':'https://www.youtube.com/watch?v='+vid})
  return found
 except Exception as e:
  print('special service lookup failed:',str(e)[:160]);return {}

special_services=recent_special_services()
for category,items in special_services.items():
 if items:
  old=previous.get(category,[])
  seen={x['id'] for x in items}
  previous[category]=items+[x for x in old if isinstance(x,dict) and x.get('id') not in seen][:30]

channel_dawn=recent_channel_dawn()
for key,playlist in lists.items():
 try:
  p=subprocess.run(['yt-dlp','--flat-playlist','--skip-download','--dump-single-json','--no-warnings','https://www.youtube.com/playlist?list='+playlist],capture_output=True,text=True,timeout=100)
  if p.returncode:continue
  videos=[];seen=set()
  for item in (json.loads(p.stdout).get('entries') or []):
   vid=item.get('id');title=item.get('title') or ''
   if isinstance(vid,str) and len(vid)==11 and vid not in seen:
    seen.add(vid);videos.append({'id':vid,'title':title})
  if videos:
   if key=='sermon-8':
    old={x.get('id'):x for x in previous.get(key,[]) if isinstance(x,dict)}
    refreshed=[]
    for v in videos:
     original=old.get(v['id'],{}).get('title','')
     # Prefer already-known Korean title to a machine-translated YouTube title.
     title=original if re.search(r'[가-힣]',original) else v['title']
     if '[Deleted video]' in title or re.search(r'3-Minute Sermon',title,re.I):continue
     refreshed.append({'id':v['id'],'title':korean_dawn_title(title)})
    seen={v['id'] for v in refreshed}
    for v in channel_dawn:
     if v['id'] not in seen:
      refreshed.append(v);seen.add(v['id'])
    newest=max((dawn_date(v['title']) for v in refreshed if dawn_date(v['title'])),default=None)
    # Keep a manually verified latest video until it appears in YouTube's playlist.
    for v in old.values():
     date=dawn_date(v.get('title',''))
     if v.get('id') not in seen and date and (not newest or date>newest):
      refreshed.append({'id':v['id'],'title':korean_dawn_title(v['title'])})
    refreshed.sort(key=lambda v:dawn_date(v['title']) or datetime.date.min,reverse=True)
    videos=refreshed
   previous[key]=videos
 except Exception as e:print(key,str(e)[:160])
out.write_text(json.dumps(previous,ensure_ascii=False,indent=2)+'\n')
print({k:len(v) for k,v in previous.items()})
