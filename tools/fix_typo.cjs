const fs=require('fs'),path=require('path');
const R=process.argv[2];
const sd=JSON.parse(fs.readFileSync(path.join(R,'encyclopedia/skills/srp-common-skills.json'),'utf8')).skills.map(s=>s.id);
const f=path.join(R,'encyclopedia/pokedex/_designs/crux_incomplete.json');
const d=JSON.parse(fs.readFileSync(f,'utf8'));
for(const c of d.common){ if(!sd.includes(c.id)){
  const guess=sd.find(x=>x.startsWith(c.id.slice(0,8)));
  console.log('fixing',c.id,'->',guess);
  if(guess) c.id=guess;
} }
fs.writeFileSync(f, JSON.stringify(d,null,2)+'\n');
console.log('common:', d.common.map(c=>c.id).join(', '));