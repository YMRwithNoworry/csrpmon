const fs=require('fs'),path=require('path');
const SRC=process.argv[2], ROOT=process.argv[3];
const t=fs.readFileSync(path.join(SRC,'entity/ParasiteTransformation.java'),'utf8');
const EV='ParasiteTransformation.evolutionType() / devolutionType() in the CSRP source';
const rels=[]; const add=(a,b,kind,ev)=>{ if(a&&b) rels.push({from:'csrp:'+a,to:'csrp:'+b,kind,evidence:ev}); };
// 1. direct entity-to-entity returns
const evo=t.slice(t.indexOf('private static EntityType<?> evolutionType'), t.indexOf('private static EntityType<?> devolutionType'));
for(const m of evo.matchAll(/type == ModEntities\.([A-Z0-9_]+)\.get\(\)\) return ModEntities\.([A-Z0-9_]+)\.get\(\)/g))
  add(m[1].toLowerCase(), m[2].toLowerCase(), 'evolves-into', EV);
const devo=t.slice(t.indexOf('private static EntityType<?> devolutionType'), t.indexOf('private static EntityType<?> nextNexusStage'));
for(const m of devo.matchAll(/type == ModEntities\.([A-Z0-9_]+)\.get\(\)\) return ModEntities\.([A-Z0-9_]+)\.get\(\)/g))
  add(m[1].toLowerCase(), m[2].toLowerCase(), 'devolves-into', EV);
// 2. nexus chains (explicit in code)
const nex=t.slice(t.indexOf('private static EntityType<?> nextNexusStage'), t.indexOf('private static EntityType<?> previousNexusStage'));
for(const m of nex.matchAll(/type == ModEntities\.([A-Z0-9_]+)\.get\(\)\) return ModEntities\.([A-Z0-9_]+)\.get\(\)/g))
  add(m[1].toLowerCase(), m[2].toLowerCase(), 'nexus-stage-up', EV);
// 3. moving flesh melts into a random primitive (explicit switch)
const rp=t.slice(t.indexOf('private static EntityType<?> randomPrimitive'));
const prim=[...rp.matchAll(/ModEntities\.(PRI_[A-Z0-9_]+)\.get\(\)/g)].map(m=>m[1].toLowerCase());
const uniq=(a)=>[...new Set(a)];
for(const p of uniq(prim)) add('movingflesh', p, 'evolves-into-random', EV+' - randomPrimitive() switch, '+(rp.match(/nextInt\((\d+)\)/)||[])[1]+' cases');
// 4. the path rules, with their explicit exclusions
const ALL=JSON.parse(fs.readFileSync(path.join(ROOT,'encyclopedia/canon/srp-creatures.json'),'utf8')).creatures.map(c=>c.id);
const EVPATH=EV+' - the pri_/ada_ , sim_/fer_ name rules in evolutionType()';
for(const id of ALL){
  const m=/^pri_(.+)$/.exec(id);
  if(m && !['pri_burrower','pri_devourer','pri_tozoon'].includes(id) && ALL.includes('ada_'+m[1])) add(id,'ada_'+m[1],'evolves-into',EVPATH);
  const s=/^sim_(.+)$/.exec(id);
  if(s && !id.endsWith('_head') && id!=='sim_wolf' && ALL.includes('fer_'+s[1])) add(id,'fer_'+s[1],'evolves-into',EVPATH);
}
// 5. non-evolution structural relations kept from the data
add('sim_cowhead','sim_cow','head-of','both registered; bestiary tiers WALKING_HEAD / ASSIMILATED');
add('anc_pod','anc_dreadnaut','deploys','anc_pod is the drop pod registered alongside the Dreadnaut (Tier enum ANCIENT)');
add('anc_dreadnaut','anc_dreadnaut_ten','spawns-part','anc_dreadnaut_ten is the Dreadnaut tentacle entity');
const seen=new Set(); const out=[];
for(const r of rels){ const k=r.from+'>'+r.to+'>'+r.kind; if(seen.has(k)) continue; seen.add(k); out.push(r); }
const kinds={}; for(const r of out) kinds[r.kind]=(kinds[r.kind]||0)+1;
fs.writeFileSync(path.join(ROOT,'encyclopedia/canon/relationships.json'), JSON.stringify({
  note:'Only relations the CSRP source proves. The evolution graph is parsed directly out of ParasiteTransformation.java, which is the mod\'s own evolve/devolve implementation - not inferred from naming alone.',
  counts:kinds, relations:out},null,2)+'\n');
console.log('relations:',out.length, JSON.stringify(kinds));