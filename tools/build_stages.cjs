const fs=require('fs'),path=require('path');
const ROOT=process.argv[2];
const cf=path.join(ROOT,'encyclopedia/canon/srp-creatures.json');
const canon=JSON.parse(fs.readFileSync(cf,'utf8'));
const rels=JSON.parse(fs.readFileSync(path.join(ROOT,'encyclopedia/canon/relationships.json'),'utf8')).relations;
const stage=new Map(canon.creatures.map(c=>[c.id,1]));
for(const c of canon.creatures){ const m=/^(beckon|dispatcher|rooter)_(si|sii|siii|siv)$/.exec(c.id); if(m) stage.set(c.id,{si:1,sii:2,siii:3,siv:4}[m[2]]); }
const UP=['evolves-into','evolves-into-random','nexus-stage-up'];
const edges=rels.filter(r=>UP.includes(r.kind));
for(let pass=0;pass<8;pass++){
  let changed=false;
  for(const r of edges){
    const a=r.from.replace('csrp:',''), b=r.to.replace('csrp:','');
    if(!stage.has(a)||!stage.has(b)) continue;
    const want=stage.get(a)+1;
    if(stage.get(b)<want){ stage.set(b,want); changed=true; }
  }
  if(!changed) break;
}
for(const c of canon.creatures) c.stage=stage.get(c.id);
canon.summary.stages={}; for(const c of canon.creatures) canon.summary.stages[c.stage]=(canon.summary.stages[c.stage]||0)+1;
fs.writeFileSync(cf, JSON.stringify(canon,null,2)+'\n');
console.log('stages:',JSON.stringify(canon.summary.stages));
for(const id of ['buglin','rupter','mangler','movingflesh','pri_longarms','ada_longarms','sim_cow','fer_cow','beckon_siii'])
  if(stage.has(id)) console.log('  '+id+' = stage '+stage.get(id));