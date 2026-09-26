const fs=require('fs'),path=require('path');
const R=process.argv[2];
// 1. widen the adaptation skills to the tiers that CONTAIN an adapting creature, and gate them by species
const sf=path.join(R,'encyclopedia/skills/srp-common-skills.json');
const db=JSON.parse(fs.readFileSync(sf,'utf8'));
for(const s of db.skills){
  if(!s.cat.startsWith('B.')) continue;
  for(const t of ['INBORN','CRUDE']) if(!s.tiers.includes(t)) s.tiers.unshift(t);
  s.speciesGate='只有 supportsAdaptation == true 的生物可以学习（依据：实体类是否覆盖 supportsDamageAdaptation() 并返回 true）。校验器强制此规则。';
}
db.permissionModel=db.permissionModel+' 另外，B. 适应系的全部技能受 speciesGate 约束：只有源码中 supportsDamageAdaptation() 返回 true 的生物可学——这是 Species Restriction 的机器化实现。';
fs.writeFileSync(sf, JSON.stringify(db,null,2)+'\n');
console.log('adaptation skills widened and gated:', db.skills.filter(s=>s.cat.startsWith('B.')).map(s=>s.id).join(', '));
// 2. validator rule
const gf=path.join(R,'tools/build_pokedex.cjs');
let g=fs.readFileSync(gf,'utf8');
const anchor="    if(c.stage < (sk.minStage||1)) problems.push(file+': '+cs.id+' needs stage '+sk.minStage+' but '+c.id+' is stage '+c.stage);";
if(!g.includes(anchor)) throw new Error('anchor missing');
const rule=anchor+"\n    if(sk.speciesGate && !c.supportsAdaptation) problems.push(file+': '+cs.id+' requires adaptation, but '+c.id+' has supportsDamageAdaptation() == false in the source');";
g=g.replace(anchor, rule);
fs.writeFileSync(gf,g);
console.log('validator now enforces the adaptation species gate');