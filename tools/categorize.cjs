const fs=require('fs'),path=require('path');
const R=process.argv[2];
const common=JSON.parse(fs.readFileSync(path.join(R,'encyclopedia/skills/srp-common-skills.json'),'utf8')).skills;
const sig=[];
for(const f of fs.readdirSync(path.join(R,'encyclopedia/pokedex/_designs'))){
  const d=JSON.parse(fs.readFileSync(path.join(R,'encyclopedia/pokedex/_designs',f),'utf8'));
  for(const s of (d.signature||[])) sig.push(s);
}
const all=[...common.map(s=>({id:s.id,eff:String(s.effect||''),cls:s.cls,pow:s.pow})),...sig.map(s=>({id:s.moveId,eff:String(s.effect||''),cls:s.cls,pow:s.pow}))];
const FAM={
  infection:['感染','层】','层数','叠层'],
  heal:['回复','吸取','吸血','回复造成'],
  multi:['连续','多段','次数'],
  statdrop:['下降','降低'],
  statup:['提升','提高'],
  field:['场地','领域','全场','周围'],
  summon:['召唤','释放','投送','召回'],
  adapt:['适应','记录','抗性'],
  damage_over_time:['每回合','回合结束','持续'],
  switchblock:['无法被替换','禁止替换','替换'],
  priority:['先制','优先'],
  recoil:['反伤','损失自身','自伤'],
  cost:['消耗','自身被击倒','代价'],
  status:['麻痹','灼伤','中毒','畏缩','睡眠','冻结'],
  conditional:['若','则','当'],
  charge:['蓄力','准备'],
};
const counts={};
for(const k of Object.keys(FAM)) counts[k]=all.filter(m=>FAM[k].some(w=>m.eff.includes(w))).length;
console.log('total moves:',all.length);
console.log(Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+'='+v).join('  '));
// how many mention at least one distinct mechanic beyond plain damage?
const mech=all.filter(m=>Object.keys(FAM).some(k=>FAM[k].some(w=>m.eff.includes(w))));
console.log('moves with at least one mechanic family:',mech.length);
console.log('plain damage/status only:',all.length-mech.length);
fs.writeFileSync(path.join(R,'tools/mech-input.json'),JSON.stringify(all,null,1));