// Bible source proxy: supplied files are CP949/EUC-KR, 31,102 lines each.
// Source licensing must be verified by the church before public distribution.
const SOURCES={
 revised:'https://d2ol7oe51mr4n9.cloudfront.net/user_38vbAv9qgw2UH7cP3nl562ZKIOp/0e84bc77-74bf-4bb6-93b1-dd32e408e124.txt',
 modern:'https://d2ol7oe51mr4n9.cloudfront.net/user_38vbAv9qgw2UH7cP3nl562ZKIOp/8fb5c23a-907b-4218-9833-8420af9e1569.txt'
};
export default async function handler(req,res){
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).end('Method not allowed');}
 const type=String(req.query.version||'revised');
 if(!Object.prototype.hasOwnProperty.call(SOURCES,type))return res.status(400).json({error:'Invalid Bible version'});
 try{
  const response=await fetch(SOURCES[type],{signal:AbortSignal.timeout(14000)});
  if(!response.ok)throw new Error('Source status '+response.status);
  const bytes=await response.arrayBuffer();
  const text=new TextDecoder('euc-kr').decode(bytes);
  const verses=text.replace(/\r/g,'').split('\n').map(x=>x.trim()).filter(Boolean);
  if(verses.length!==31102)throw new Error('Unexpected verse count '+verses.length);
  res.setHeader('Cache-Control','public, s-maxage=86400, stale-while-revalidate=604800');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  return res.status(200).json({version:type,count:verses.length,verses});
 }catch(e){return res.status(502).json({error:'말씀 파일을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'});}
}
