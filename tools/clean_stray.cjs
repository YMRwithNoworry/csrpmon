const fs=require('fs'),path=require('path');
const R=process.argv[2];
let n=0;
for(const f of fs.readdirSync(path.join(R,'encyclopedia/pokedex/_designs'))){
  const p=path.join(R,'encyclopedia/pokedex/_designs',f);
  const d=JSON.parse(fs.readFileSync(p,'utf8'));
  if('deltas' in d && d.deltas===null){ delete d.deltas; fs.writeFileSync(p, JSON.stringify(d,null,2)+'\n'); n++; }
}
console.log('stray deltas fields removed:',n);