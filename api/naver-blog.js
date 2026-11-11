// Server-side Naver RSS preview for the public church homepage.
// Runs on Vercel; never exposes private blog credentials to the browser.
const FEED = 'https://rss.blog.naver.com/habachurch.xml';
function decode(s='') {
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
module.exports = async function handler(req,res) {
 res.setHeader('Content-Type','application/json; charset=utf-8');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).end()}
 try {
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),8000);
  let response;try{response=await fetch(FEED,{headers:{'User-Agent':'Mozilla/5.0 (compatible; HabachChurchPreview/1.0)','Accept':'application/rss+xml,application/xml,text/xml;q=0.9,*/*;q=0.8'},signal:controller.signal})}finally{clearTimeout(timeout)}
  if(!response.ok)throw new Error('RSS HTTP '+response.status);
  const xml=await response.text();
  const items=xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi)||[];
  const posts=items.slice(0,12).map(item=>{
    const url=field(item,'link');
    if(!/^https:\/\/blog\.naver\.com\/habachurch(?:\/|$)/.test(url))return null;
    const description=field(item,'description');
    const imageMatch=description.match(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i);
    const pub=field(item,'pubDate');
    const stamp=Date.parse(pub);
    return {title:clean(field(item,'title')).slice(0,160),url,
      excerpt:clean(description).slice(0,230),
      image:imageMatch&&/^https?:\/\//.test(imageMatch[1])?imageMatch[1].replace(/^http:/,'https:'):null,
      date:Number.isFinite(stamp)?new Date(stamp).toLocaleDateString('ko-KR',{timeZone:'Asia/Seoul'}):''};
  }).filter(Boolean).slice(0,8);
  if(!posts.length)throw new Error('No public RSS entries');
  res.setHeader('Cache-Control','public, s-maxage=900, stale-while-revalidate=3600');
  return res.status(200).end(JSON.stringify({source:FEED,posts}));
 } catch(e){
  res.setHeader('Cache-Control','public, s-maxage=60');
  return res.status(502).end(JSON.stringify({posts:[],message:'Public RSS feed temporarily unavailable'}));
 }
};
