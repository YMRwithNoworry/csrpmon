const fs=require('fs'),path=require('path');
const R=process.argv[2];
const sd=JSON.parse(fs.readFileSync(path.join(R,'encyclopedia/skills/srp-common-skills.json'),'utf8')).skills.map(s=>s.id);
let fixed=0;
for(const file of fs.readdirSync(path.join(R,'encyclopedia/pokedex/_designs'))){
  const f=path.join(R,'encyclopedia/pokedex/_designs',file);
  const d=JSON.parse(fs.readFileSync(f,'utf8'));
  let changed=false;
  for(const c of d.common||[]){
    if(sd.includes(c.id)) continue;
    // levenshtein-ish: closest known id
    const dist=(a,b)=>{const m=[];for(let i=0;i<=a.length;i++)m.push([i]);for(let j=0;j<=b.length;j++)m[0][j]=j;
      for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return m[a.length][b.length];};
    const best=sd.slice().sort((x,y)=>dist(x,c.id)-dist(y,c.id))[0];
    console.log(file+': '+c.id+' -> '+best);
    c.id=best; changed=true; fixed++;
  }
  if(changed) fs.writeFileSync(f, JSON.stringify(d,null,2)+'\n');
}
console.log('fixed',fixed);