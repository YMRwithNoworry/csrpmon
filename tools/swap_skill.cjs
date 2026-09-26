const fs=require('fs'),path=require('path');
const R=process.argv[2];
const f=path.join(R,'encyclopedia/pokedex/_designs/dredge.json');
const d=JSON.parse(fs.readFileSync(f,'utf8'));
d.common=d.common.filter(c=>c.id!=='hunteraura');
d.common.push({id:'rendingpursuit',why:'证据：PULLING 状态与 TARGET_ENTITY 说明它会持续追猎被锁定的目标，换人时仍会结算'});
fs.writeFileSync(f, JSON.stringify(d,null,2)+'\n');
console.log('dredge common:', d.common.map(c=>c.id).join(', '));