const { execSync } = require('child_process');
const token = execSync('gh auth token',{encoding:'utf8'}).trim();
const OWNER='YMRwithNoworry', REPO='csrpmon';
(async()=>{
  const path='src/main/resources/data/csrpmon/moves/parasiticcontact.js';
  const r=await fetch('https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/'+path+'?ref=master',{headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','User-Agent':'p'}});
  const j=await r.json();
  if(!j.content){ console.log('FETCH FAILED:',JSON.stringify(j).slice(0,200)); return; }
  const text=Buffer.from(j.content,'base64').toString('utf8');
  console.log('remote parasiticcontact.js bytes:',text.length);
  console.log('volatileStatus present:', /volatileStatus/.test(text));
  console.log('condition block present:', /condition: /.test(text));
  console.log('onResidual present:', /onResidual/.test(text));
  console.log('tryTrap present:', /tryTrap/.test(text));
  console.log('--- excerpt ---');
  console.log(text.split(String.fromCharCode(10)).slice(6,16).join(String.fromCharCode(10)));
})();