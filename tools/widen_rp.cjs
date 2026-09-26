const fs=require('fs'),path=require('path');
const f=path.join(process.argv[2],'encyclopedia/skills/srp-common-skills.json');
const db=JSON.parse(fs.readFileSync(f,'utf8'));
const s=db.skills.find(x=>x.id==='rendingpursuit');
if(!s.tiers.includes('CRUDE')) s.tiers.push('CRUDE');
s.tiers.sort((a,b)=>['INBORN','CRUDE','PRIMITIVE','ADAPTED','ASSIMILATED','WALKING_HEAD','ASSIMARA','HIJACKED','FERAL','NEXUS','DETERRENT','PURE','PREEMINENT','DERIVED','ANCIENT','ABOMINATION'].indexOf(a)-['INBORN','CRUDE','PRIMITIVE','ADAPTED','ASSIMILATED','WALKING_HEAD','ASSIMARA','HIJACKED','FERAL','NEXUS','DETERRENT','PURE','PREEMINENT','DERIVED','ANCIENT','ABOMINATION'].indexOf(b));
s.matrixNote='矩阵修正：原本只列 INBORN 与更高阶，漏了夹在中间的 CRUDE。CRUDE 处于 INBORN 之上，不可能反而失去这个基础追击招式。';
fs.writeFileSync(f, JSON.stringify(db,null,2)+'\n');
console.log('rendingpursuit tiers:', s.tiers.join(','));