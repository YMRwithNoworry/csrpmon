const fs=require('fs'),path=require('path');
const R=process.argv[2], tier=process.argv[3];
const s=JSON.parse(fs.readFileSync(path.join(R,'encyclopedia/skills/srp-common-skills.json'),'utf8')).skills;
const ok=s.filter(x=>x.tiers.includes(tier)&&(x.minStage||1)<=2);
console.log(tier+' permitted (stage<=2, '+ok.length+'):');
for(const x of ok) console.log('  '+x.id.padEnd(24)+x.zh);