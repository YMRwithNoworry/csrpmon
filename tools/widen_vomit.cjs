const fs=require('fs'),path=require('path');
const f=path.join(process.argv[2],'encyclopedia/skills/srp-common-skills.json');
const db=JSON.parse(fs.readFileSync(f,'utf8'));
const v=db.skills.find(s=>s.id==='vomit');
if(!v.tiers.includes('INBORN')) v.tiers.unshift('INBORN');
v.matrixNote='载虫的 spawnLingeringCloud() 就是吐出体内生物质形成毒云，与呕吐同源，因此放开 INBORN。';
fs.writeFileSync(f, JSON.stringify(db,null,2)+'\n');
console.log('vomit tiers:', v.tiers.join(','));