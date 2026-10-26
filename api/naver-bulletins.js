// Public Naver Cafe bulletin metadata sync. No login bypass or private content access.
const CAFE_ID="31371644", MENU_ID="28";
const ENDPOINT="https://apis.naver.com/cafe-web/cafe-boardlist-api/v1/cafes/"+CAFE_ID+"/menus/"+MENU_ID+"/articles?page=1&pageSize=20";
const json=(res,status,body)=>{res.status(status).setHeader("Content-Type","application/json; charset=utf-8").end(JSON.stringify(body))};
const arrAt=(obj)=>{
  if(Array.isArray(obj))return obj;
  for(const path of ["message.result.articleList","message.result.articles","message.result.list","message.result.items","result.articleList","result.articles","result.list","result.items","articleList","articles","items","list"]){
    const value=path.split(".").reduce((o,k)=>o?.[k],obj);
    if(Array.isArray(value))return value;
  }
  return null;
};
module.exports=async function handler(req,res){
  if(req.method!=="GET")return json(res,405,{error:"GET required"});
  const secret=process.env.CRON_SECRET||"";
  if(!secret||req.headers.authorization!=="Bearer "+secret)return json(res,401,{error:"Unauthorized"});
  const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_PUBLISHABLE_KEY, token=process.env.SUPABASE_SYNC_TOKEN;
  if(!url||!key||!token)return json(res,503,{error:"Sync environment missing"});
  let response,raw;
  try{
    response=await fetch(ENDPOINT,{headers:{"Accept":"application/json","User-Agent":"Mozilla/5.0 (compatible; HaneulBaramBulletinSync/1.0)","Referer":"https://cafe.naver.com/"},signal:AbortSignal.timeout(12000)});
    raw=await response.text();
  }catch(e){return json(res,502,{error:"Naver public feed request failed",reason:String(e.message||e).slice(0,120)})}
  if(!response.ok)return json(res,502,{error:"Naver public list unavailable",status:response.status});
  let data;
  try{data=JSON.parse(raw)}catch{return json(res,502,{error:"Naver returned non-JSON content, possibly login-protected"})}
  const list=arrAt(data);
  if(!list)return json(res,502,{error:"Unrecognized public cafe list format. Sync did not change any posts."});
  let inserted=0,duplicates=0,failed=0;
  for(const item of list.slice(0,20)){
    const id=String(item.articleId??item.articleNo??item.id??item.article?.articleId??"");
    const title=String(item.subject??item.title??item.article?.subject??"").trim();
    const menu=String(item.menuId??item.menu?.menuId??MENU_ID);
    if(!/^\d{1,18}$/.test(id)||!title||menu!==MENU_ID)continue;
    const excerpt=String(item.summary??item.contentSummary??item.previewText??item.article?.summary??"").replace(/<[^>]+>/g," ").trim().slice(0,1800);
    let millis=Number(item.writeDateTimestamp??item.writeTime??item.writeDate??item.createdAt??0);
    if(millis>1e9&&millis<1e11)millis*=1000;
    const body={sync_token:token,article_id:id,article_title:title.slice(0,300),article_excerpt:excerpt,published_ms:Number.isFinite(millis)&&millis>946684800000?Math.floor(millis):null};
    try{
      const saving=await fetch(url+"/rest/v1/rpc/ingest_public_cafe_bulletin",{method:"POST",headers:{"apikey":key,"Content-Type":"application/json"},body:JSON.stringify(body),signal:AbortSignal.timeout(10000)});
      if(!saving.ok){failed++;continue;}
      (await saving.json())===true?inserted++:duplicates++;
    }catch{failed++}
  }
  return json(res,failed?207:200,{checked:list.length,inserted,duplicates,failed,source:"navercafe:31371644:28"});
};