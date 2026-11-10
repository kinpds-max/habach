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
# Worship broadcasts live under /streams, independently of ordinary /videos.
def parse_channel_page(html):
 match=re.search(r'var ytInitialData\s*=\s*(\{.*?\});',html,re.S)
 if not match:raise ValueError('YouTube channel data missing')
 data=json.loads(match.group(1));items=[];seen=set()
 def walk(node):
  if isinstance(node,dict):
   video=node.get('videoRenderer')
   modern=node.get('lockupViewModel')
   if video:
    vid=video.get('videoId');title=''.join(x.get('text','') for x in video.get('title',{}).get('runs',[]))
   elif modern:
    vid=modern.get('contentId');title=modern.get('metadata',{}).get('lockupMetadataViewModel',{}).get('title',{}).get('content','')
   else:vid=None;title=''
   if vid and re.fullmatch(r'[A-Za-z0-9_-]{11}',vid) and title and vid not in seen:
    # Scheduled or currently live entries must not displace completed recordings.
    info=json.dumps(video or modern,ensure_ascii=False)
    if not re.search(r'"(?:isLiveNow|isUpcoming)": true|BADGE_STYLE_TYPE_LIVE_NOW|UPCOMING|BADGE_STYLE_LIVE_NOW',info):
     seen.add(vid);items.append({'id':vid,'title':title})
   for child in node.values():walk(child)
  elif isinstance(node,list):
   for child in node:walk(child)
 walk(data);return items

def recent_channel_services():
 from urllib.request import Request,urlopen
 items=[];seen=set()
 for tab in ['streams','videos']:
  try:
   req=Request('https://www.youtube.com/@Gimpo_HBC/'+tab+'?hl=ko',headers={'Accept-Language':'ko-KR,ko;q=0.9'})
   with urlopen(req,timeout=45) as response:html=response.read().decode('utf-8')
   for item in parse_channel_page(html):
    if item['id'] not in seen:seen.add(item['id']);items.append(item)
  except Exception as e:print('channel lookup failed:',tab,str(e)[:160])
 if not items:raise RuntimeError('Official channel lookup failed; keeping saved albums')
 return items

channel_items=recent_channel_services()
def recent_channel_dawn():
 return [{'id':v['id'],'title':korean_dawn_title(v['title'])} for v in channel_items
  if re.search(r'새벽|Dawn|Early Morning',v['title'],re.I) and dawn_date(v['title'])]

def recent_special_services():
 found={'friday-evening':[],'david-worship':[],'sermon-1':[]}
 for item in channel_items:
  title=item['title']
  if re.search(r'금요|Friday (?:Service|Worship)',title,re.I) and not re.search(r'새벽|Dawn',title,re.I):key='friday-evening'
  elif re.search(r'다윗의\s*예배|주일(?:예배|설교)',title):key='sermon-1'
  else:continue
  found[key].append(item)
 found['david-worship']=list(found['sermon-1'])
 return found

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
old=previous.get('sermon-8',[])
merged={v['id']:v for v in old if isinstance(v,dict) and v.get('id')}
for video in channel_dawn:merged[video['id']]=video
previous['sermon-8']=sorted(merged.values(),key=lambda v:dawn_date(v.get('title','')) or datetime.date.min,reverse=True)
for key in ['sermon-1','david-worship','friday-evening']:
 previous[key]=sorted(previous.get(key,[]),key=lambda v:dawn_date(v.get('title','')) or datetime.date.min,reverse=True)
out.write_text(json.dumps(previous,ensure_ascii=False,indent=2)+'\n')
print({k:len(v) for k,v in previous.items()})

# Publish the same verified worship entries to static home and album HTML.
from sync_video_albums import synchronize
posts=[]
for category in ['sermon-1','sermon-8','friday-evening']:
 for video in previous.get(category,[]):
  date=dawn_date(video.get('title',''))
  if not date:continue
  posts.append({'section_key':'sermon-7' if category=='friday-evening' else category,
   'youtube_id':video['id'],'title':video['title'],'published_at':date.isoformat()+'T00:00:00Z'})
source=Path('index.html')
updated,_=synchronize(source.read_text(),posts)
source.write_text(updated)
