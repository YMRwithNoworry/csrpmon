const fs=require('fs'),path=require('path');
const f=path.join(process.argv[2],'encyclopedia/pokedex/_designs/carrier_flying.json');
const d=JSON.parse(fs.readFileSync(f,'utf8'));
d.common=d.common.filter(c=>c.id!=='waterambush');
d.common.push({id:'rendingpursuit',why:'证据：FlyingCombatGoal 说明它有空中追击行为，俯冲撕咬是其战斗方式'});
fs.writeFileSync(f, JSON.stringify(d,null,2)+'\n');
console.log('carrier_flying common:', d.common.map(c=>c.id).join(', '));