const fs=require('fs'),path=require('path');
const ROOT=process.argv[2];
const canon=JSON.parse(fs.readFileSync(path.join(ROOT,'encyclopedia/canon/srp-creatures.json'),'utf8'));
const pdir=path.join(ROOT,'encyclopedia/pokedex');
const done=new Set(fs.readdirSync(pdir).filter(f=>f.endsWith('.md')&&f!=='README.md').map(f=>f.replace('.md','')));
const byTier={}; for(const c of canon.creatures){const t=c.tier||'UNTIERED';(byTier[t]=byTier[t]||[]).push(c);}
const order=['INBORN','CRUDE','PRIMITIVE','ADAPTED','ASSIMILATED','WALKING_HEAD','ASSIMARA','HIJACKED','FERAL','NEXUS','DETERRENT','PURE','PREEMINENT','DERIVED','ANCIENT','ABOMINATION','UNTIERED'];
const L=['# Parasite Pokedex - design progress','',
'Every entry below is a **real** CSRP entity from the canon database. A creature is only designed',
'once its existence and tier are proven; anything unproven stays 【待核实】.','',
'**Designed: '+done.size+' / '+canon.creatures.length+'**','',
'`Stage` is derived from the proven growth chains: 1 = base form, 2 = mid, 3 = final, 4 = nexus stage IV.','',
'| Tier | Designed | Total |','|---|---|---|'];
for(const t of order){const l=byTier[t]; if(!l) continue; L.push('| '+t+' | '+l.filter(c=>done.has(c.id)).length+' | '+l.length+' |');}
L.push('');
for(const t of order){
  const l=byTier[t]; if(!l) continue;
  L.push('## '+t+' ('+l.length+')'); L.push('');
  L.push('| Stage | Source ID | Name | SRP class | Status |');
  L.push('|---|---|---|---|---|');
  for(const c of l){
    L.push('| '+c.stage+' | `'+c.sourceId+'` | '+(c.nameZh||'-')+' / '+(c.nameEn||'-')+' | '+((c.srpOriginalClass||[]).join(', ')||'-')+' | '+(done.has(c.id)?'[designed]('+c.id+'.md)':'pending')+' |');
  }
  L.push('');
}
fs.writeFileSync(path.join(pdir,'README.md'), L.join('\n')+'\n');
console.log('index regenerated, designed:',done.size,'/',canon.creatures.length);