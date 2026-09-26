const { execSync } = require('child_process');
const fs=require('fs'), path=require('path');
const ROOT=process.argv[2], LOCALBASE=process.argv[3];
const OWNER='YMRwithNoworry', REPO='csrpmon', BRANCH='master';
const token=execSync('gh auth token',{encoding:'utf8'}).trim();
async function api(p,o={}){const r=await fetch('https://api.github.com'+p,{...o,headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','User-Agent':'p','Content-Type':'application/json',...(o.headers||{})}});const t=await r.text();if(!r.ok)throw new Error(p+' -> '+r.status+' '+t.slice(0,300));return t?JSON.parse(t):null;}
(async()=>{
  const ref=await api('/repos/'+OWNER+'/'+REPO+'/git/ref/heads/'+BRANCH);
  const baseSha=ref.object.sha; const base=await api('/repos/'+OWNER+'/'+REPO+'/git/commits/'+baseSha);
  const diff=execSync('git diff --name-status '+LOCALBASE+' HEAD',{cwd:ROOT,encoding:'utf8'}).trim().split('\n').filter(Boolean);
  console.log('remote',baseSha.slice(0,8),'| files:',diff.length);
  const entries=[];
  for(const line of diff){ const [st,...rest]=line.split('\t'); const file=rest[rest.length-1];
    if(st==='D'){entries.push({path:file,mode:'100644',type:'blob',sha:null});continue;}
    const buf=fs.readFileSync(path.join(ROOT,file));
    const blob=await api('/repos/'+OWNER+'/'+REPO+'/git/blobs',{method:'POST',body:JSON.stringify({content:buf.toString('base64'),encoding:'base64'})});
    entries.push({path:file,mode:'100644',type:'blob',sha:blob.sha}); }
  const tree=await api('/repos/'+OWNER+'/'+REPO+'/git/trees',{method:'POST',body:JSON.stringify({base_tree:base.tree.sha,tree:entries})});
  const message=execSync('git log -1 --pretty=%B HEAD',{cwd:ROOT,encoding:'utf8'});
  const commit=await api('/repos/'+OWNER+'/'+REPO+'/git/commits',{method:'POST',body:JSON.stringify({message,tree:tree.sha,parents:[baseSha]})});
  await api('/repos/'+OWNER+'/'+REPO+'/git/refs/heads/'+BRANCH,{method:'PATCH',body:JSON.stringify({sha:commit.sha,force:false})});
  console.log('pushed',commit.sha.slice(0,8));
})();