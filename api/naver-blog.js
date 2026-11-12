// Public Naver Blog RSS preview, with each article's own representative image.
const FEED='https://rss.blog.naver.com/habachurch.xml';
function decode(s=''){
 return String(s).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1')
 .replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)))
 .replace(/&#([0-9]+);/g,(_,n)=>String.fromCodePoint(parseInt(n,10)))
 .replace(/&(amp|lt|gt|quot|apos|nbsp);/gi,(_,n)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '}[n.toLowerCase()]||' '));
}
function field(xml,name){
 const m=xml.match(new RegExp('<'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+name+'>','i'));
 return m?decode(m[1]).trim():'';
}
function clean(s){return decode(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()}
function attr(tag,name){
 const m=tag.match(new RegExp('(?:^|\\s)'+name+'\\s*=\\s*(["\\x27])([\\s\\S]*?)\\1','i'));
 return m?decode(m[2]):'';
}
function validImage(link){
 const value=decode(link||'').replace(/\\\//g,'/').replace(/^http:/i,'https:').trim();
 try{
  const u=new URL(value);
  if(u.protocol!=='https:'||!u.hostname||u.username||u.password)return null;
  if(!/(^|\.)pstatic\.net$/.test(u.hostname)&&u.hostname!=='i.ytimg.com'&&u.hostname!=='img.youtube.com')return null;
  return u.href;
 }catch{return null}
}
function imageInMarkup(markup){
 const source=decode(markup||'');
 for(const tag of source.match(/<meta\b[^>]*>/gi)||[]){
  const key=(attr(tag,'property')||attr(tag,'name')).toLowerCase();
  if(key==='og:image'||key==='twitter:image'||key==='twitter:image:src'){
   const src=validImage(attr(tag,'content'));if(src)return src;
  }
 }
 for(const tag of source.match(/<(?:media:thumbnail|media:content|enclosure)\b[^>]*>/gi)||[]){
  const src=validImage(attr(tag,'url'));if(src)return src;
 }
 for(const tag of source.match(/<img\b[^>]*>/gi)||[]){
  const src=validImage(attr(tag,'data-lazy-src')||attr(tag,'data-src')||attr(tag,'src'));if(src)return src;
 }
 const yt=source.match(/(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([-_A-Za-z0-9]{11})/i);
 return yt?'https://i.ytimg.com/vi/'+yt[1]+'/hqdefault.jpg':null;
}
async function fetchLimited(url,ms){
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),ms);
 try{return await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (compatible; HabachChurchPreview/1.0)','Accept':'text/html,application/rss+xml,application/xml;q=0.9,*/*;q=0.8'},signal:ctrl.signal})}
 finally{clearTimeout(timer)}
}
async function enrich(post){
 if(post.image)return post;
 const id=post.url.match(/^https:\/\/blog\.naver\.com\/habachurch\/(\d+)/)?.[1];
 if(!id)return post;
 try{const response=await fetchLimited('https://m.blog.naver.com/habachurch/'+id,5000);if(response.ok)post.image=imageInMarkup(await response.text())}
 catch(e){/* Keep the post and fallback if public content is unavailable. */}
 return post;
}
module.exports=async function handler(req,res){
 res.setHeader('Content-Type','application/json; charset=utf-8');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).end()}
 try{
  const response=await fetchLimited(FEED,8500);
  if(!response.ok)throw Error('RSS HTTP '+response.status);
  const xml=await response.text(),items=xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi)||[];
  const posts=items.slice(0,12).map(item=>{
   const url=field(item,'link');
   if(!/^https:\/\/blog\.naver\.com\/habachurch\/\d+/.test(url))return null;
   const desc=field(item,'description'),published=field(item,'pubDate'),timestamp=Date.parse(published);
   return {title:clean(field(item,'title')).slice(0,160),url,
    excerpt:clean(desc).slice(0,230),image:imageInMarkup(item),
    date:Number.isFinite(timestamp)?new Date(timestamp).toLocaleDateString('ko-KR',{timeZone:'Asia/Seoul'}):''};
  }).filter(Boolean).slice(0,8);
  if(!posts.length)throw Error('RSS returned no posts');
  await Promise.all(posts.map(enrich));
  res.setHeader('Cache-Control','public, s-maxage=900, stale-while-revalidate=3600');
  return res.status(200).end(JSON.stringify({source:FEED,posts}));
 }catch(e){
  res.setHeader('Cache-Control','public, s-maxage=60');
  return res.status(502).end(JSON.stringify({posts:[],message:'Public Naver RSS temporarily unavailable'}));
 }
};
