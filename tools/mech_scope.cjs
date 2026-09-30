const fs=require('fs'),path=require('path');
const R=process.argv[2];
const common=JSON.parse(fs.readFileSync(path.join(R,'encyclopedia/skills/srp-common-skills.json'),'utf8')).skills;
const sig=[];
for(const f of fs.readdirSync(path.join(R,'encyclopedia/pokedex/_designs'))){
  const d=JSON.parse(fs.readFileSync(path.join(R,'encyclopedia/pokedex/_designs',f),'utf8'));
  for(const s of (d.signature||[])) sig.push(s);
}
console.log('common:',common.length,'| signature:',sig.length);
// How many effects describe a mechanic beyond damage + a simple status?
const MECH=/叠|层|回合结束时|每回合|记录|适应|免疫|按|若|则|回复|召唤|替换|禁止|无法|冷却|蓄力|连续|先制|转移|消耗|队伍|场地|复制|交换|平分|反射|反弹|叠加|累计/;
const cMech=common.filter(s=>MECH.test(String(s.effect))).length;
const sMech=sig.filter(s=>MECH.test(String(s.effect))).length;
console.log('common with a described mechanic:',cMech);
console.log('signature with a described mechanic:',sMech);
console.log('--- sample common effects ---');
for(const s of common.slice(0,4)) console.log(' ',s.id,'::',String(s.effect).slice(0,150));
console.log('--- sample signature effects ---');
for(const s of sig.slice(0,4)) console.log(' ',s.moveId,'::',String(s.effect).slice(0,150));