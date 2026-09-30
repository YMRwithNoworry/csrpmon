const { execSync } = require('child_process');
const token = execSync('gh auth token',{encoding:'utf8'}).trim();
const OWNER='YMRwithNoworry', REPO='csrpmon';
(async()=>{
  const path='src/main/resources/assets/csrpmon/lang/zh_cn.json';
  const r=await fetch('https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/'+path+'?ref=master',{headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','User-Agent':'p'}});
  const j=await r.json();
  const text=Buffer.from(j.content,'base64').toString('utf8');
  const obj=JSON.parse(text);
  console.log('remote zh_cn.json fetched, bytes:',text.length);
  ['huntersaura','hivecommandbite','headlongcharge','armourdissolve'].forEach(function(id){
    console.log('  cobblemon.move.'+id+' ZH =', obj['cobblemon.move.'+id]);
  });
  ['csrpmon.species.stageiidispatcher.name','csrpmon.species.stageiiidispatcher.name'].forEach(function(k){
    console.log('  '+k+' =', obj[k]);
  });
  console.log('  orphan hunteraura present?', obj['cobblemon.move.hunteraura']===undefined ? 'no (good)' : 'YES (bad)');
})();