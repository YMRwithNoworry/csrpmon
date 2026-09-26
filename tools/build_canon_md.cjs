const fs=require('fs'),path=require('path');
const ROOT=process.argv[2];
const cdir=path.join(ROOT,'encyclopedia/canon');
const canon=JSON.parse(fs.readFileSync(path.join(cdir,'srp-creatures.json'),'utf8'));
const rels=JSON.parse(fs.readFileSync(path.join(cdir,'relationships.json'),'utf8'));
const c=canon.creatures;
const byTier={}; for(const x of c){const t=x.tier||'UNTIERED';(byTier[t]=byTier[t]||[]).push(x);}
const order=['INBORN','CRUDE','PRIMITIVE','ADAPTED','ASSIMILATED','WALKING_HEAD','ASSIMARA','HIJACKED','FERAL','NEXUS','DETERRENT','PURE','PREEMINENT','DERIVED','ANCIENT','ABOMINATION','UNTIERED'];
const L=[];
L.push('# SRP Creature Canon Database');
L.push('');
L.push('Every creature below is proven to exist by reading the CSRP 1.10.8 source. Nothing is invented:');
L.push('a row exists only because the entity is registered in `ModEntities.java`, or because the mod ships a');
L.push('bestiary entry for it.');
L.push('');
L.push('## Sources (all machine-read from the repository)');
L.push('');
L.push('| Fact | Evidence |');
L.push('|---|---|');
L.push('| The creature exists | `registry/ModEntities.java` - the register call and its `MobCategory` |');
L.push('| Original SRP class | the javadoc on each entity class, e.g. `EntityNuuh` for Mangler |');
L.push('| Tier (code) | `relay/RelayScanReportFactory.java` - the `Tier` enum lists every creature |');
L.push('| Tier (data) | `assets/csrp/bestiary/<id>.json` - the `tier` field |');
L.push('| Growth relations | `entity/ParasiteTransformation.java` - the mod\'s own evolve/devolve implementation |');
L.push('| Stage | derived from those proven chains: 1 base, 2 mid, 3 final, 4 nexus IV |');
L.push('| Names | `assets/csrp/lang/{en_us,zh_cn}.json`, key `entity.csrp.<id>` |');
L.push('');
L.push('Registered entity ids: **'+canon.summary.registeredEntityIds+'**. Bestiary entries: **'+canon.summary.bestiaryEntries+'**.');
L.push('Creatures (MobCategory `MONSTER`/`CREATURE`): **'+c.length+'**. Excluded as non-creatures: **'+canon.nonCreatures.length+'**.');
L.push('Proven relations: **'+rels.relations.length+'** - '+JSON.stringify(rels.counts));
L.push('');
L.push('| Tier | Count |');
L.push('|---|---|');
for(const t of order){ if(byTier[t]) L.push('| '+t+' | '+byTier[t].length+' |'); }
L.push('');
for(const t of order){
  const l=byTier[t]; if(!l) continue;
  L.push('### '+t+' ('+l.length+')');
  L.push('');
  L.push('| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |');
  L.push('|---|---|---|---|---|---|---|');
  for(const x of l){
    const src=[]; if(x.tierCode) src.push('code'); if(x.tierBestiary) src.push('bestiary');
    const n=[];
    if(x.tierConflict) n.push('**CONFLICT** code '+x.tierCode+' vs bestiary '+x.tierBestiary);
    if(!x.documentedInBestiary) n.push('no bestiary entry');
    if(!x.nameEn) n.push('no localized name');
    L.push('| '+x.stage+' | `'+x.sourceId+'` | '+(x.nameEn||'-')+' | '+(x.nameZh||'-')+' | '+((x.srpOriginalClass||[]).join(', ')||'-')+' | '+src.join('+')+' | '+n.join('; ')+' |');
  }
  L.push('');
}
L.push('## Proven growth relations');
L.push('');
L.push('Parsed out of `ParasiteTransformation.java`, which is the mod\'s own evolve/devolve code.');
L.push('');
for(const kind of Object.keys(rels.counts)){
  L.push('### '+kind+' ('+rels.counts[kind]+')');
  L.push('');
  for(const r of rels.relations.filter(x=>x.kind===kind)) L.push('- `'+r.from+'` -> `'+r.to+'`');
  L.push('');
}
L.push('## Conflicts and open questions');
L.push('');
for(const x of c.filter(y=>y.tierConflict)){
  L.push('### '+x.sourceId+' ('+(x.nameEn||'unnamed')+')');
  L.push('');
  L.push('- Version A: bestiary says `'+x.tierBestiary+'`, and the user-provided whitelist also files Dispatcher Tentacle under Deterrent Parasites');
  L.push('- Version B: `RelayScanReportFactory.Tier` says `'+x.tierCode+'`');
  L.push('- Adopted: `'+x.tierBestiary+'` - two independent sources agree, the code enum is the outlier.');
  L.push('- No third behaviour is invented.');
  L.push('');
}
const un=c.filter(x=>!x.tier);
if(un.length){
  L.push('### Untiered creatures');
  L.push('');
  L.push('Registered, real creatures, but neither tier source mentions them. Marked 【待核实】 and NOT designed.');
  L.push('');
  for(const x of un) L.push('- `'+x.sourceId+'` '+(x.nameEn||'(no name)')+' - '+x.entityCategory);
  L.push('');
}
L.push('### Bestiary entries with no entity');
L.push('');
L.push('`smar_bear`, `smar_cow`, `smar_enderman`, `smar_human`, `smar_sheep`, `smar_villager` have bestiary files');
L.push('but **no registered entity and no localized name**. There is nothing to point at, so they are not designed.');
L.push('The similarly named `mar_*` (ASSIMARA) set does exist and is used instead.');
L.push('');
L.push('### Naming notes');
L.push('');
L.push('- `carrier_worm` is named Carrier but `CarrierWormEntity extends BurrowingVariantEntity`: it has no fuse, no');
  L.push('  detonation and no toxic cloud. It is a burrower and is designed as one.');
L.push('- `movingflesh` is listed under INBORN in the tier enum but `MovingFleshEntity extends CrudeParasiteEntity`.');
L.push('- `lice` carries the javadoc *\"SRP 1.10.7 EntityViin: the short-lived flying vermin dropped by adapted Vermin\"*,');
  L.push('  i.e. the SRP-internal name is Viin while the CSRP id is `lice`.');
L.push('');
L.push('## Excluded: not creatures');
L.push('');
L.push(canon.nonCreatures.map(x=>'`'+x.sourceId+'`').join(', '));
L.push('');
fs.writeFileSync(path.join(cdir,'SRP-CREATURE-CANON.md'), L.join('\n')+'\n');
console.log('canon md regenerated:',L.length,'lines');