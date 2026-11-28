// Proxy only official Naver blog thumbnails to avoid third-party hotlink restrictions.
// No arbitrary remote URL fetching is permitted.
module.exports=async function handler(req,res){
 if(req.method!=='GET'){res.status(405).end('Method not allowed');return;}
 const input=typeof req.query.url==='string'?req.query.url:'';
 let url;
 try{url=new URL(input)}catch{res.status(400).end('Invalid image URL');return;}
 if(url.protocol!=='https:'||url.hostname!=='blogthumb.pstatic.net'||url.username||url.password||input.length>1800){
  res.status(400).end('Unsupported image source');return;
 }
 try{
  const upstream=await fetch(url.href,{headers:{'Accept':'image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8','User-Agent':'Mozilla/5.0 (compatible; HabachChurchBlogPreview/1.0)','Referer':'https://blog.naver.com/'},redirect:'error',signal:AbortSignal.timeout(9000)});
  if(!upstream.ok){res.status(502).end('Blog thumbnail unavailable');return;}
  const type=(upstream.headers.get('content-type')||'').split(';')[0].toLowerCase();
  if(!['image/jpeg','image/png','image/webp','image/gif','image/avif'].includes(type)){res.status(502).end('Invalid thumbnail data');return;}
  const length=Number(upstream.headers.get('content-length')||0);
  if(length>5*1024*1024){res.status(413).end('Image too large');return;}
  const bytes=Buffer.from(await upstream.arrayBuffer());
  if(bytes.length>5*1024*1024){res.status(413).end('Image too large');return;}
  res.setHeader('Content-Type',type);
  res.setHeader('Cache-Control','public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400');
  res.status(200).end(bytes);
 }catch(e){res.status(502).end('Thumbnail retrieval failed')}
};