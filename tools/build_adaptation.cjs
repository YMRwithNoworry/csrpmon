const fs=require('fs'),path=require('path');
const SRC=process.argv[2], ROOT=process.argv[3];
const edir=path.join(SRC,'entity');
const parents={}, declares={};
for(const f of fs.readdirSync(edir).filter(f=>f.endsWith('.java'))){
  const t=fs.readFileSync(path.join(edir,f),'utf8');
  const m=t.match(/class\s+(\w+)\s+extends\s+(\w+)/);
  if(!m) continue;
  const cls=m[1], par=m[2]; parents[cls]=par;
  const dm=t.match(/supportsDamageAdaptation\(\)\s*\{\s*return\s+(true|false)\s*;/);
  if(dm) declares[cls]=(dm[1]==='true');
}
const resolve=(cls)=>{ let c=cls, guard=0; while(c && guard++<40){ if(c in declares) return declares[c]; c=parents[c]; } return false; };
const mod=fs.readFileSync(path.join(SRC,'registry/ModEntities.java'),'utf8');
const idToClass={};
for(const st of mod.split(';')){
  const m=st.match(/(?:monster|ENTITIES\.register)\(\s*"([a-z0-9_]+)"/); if(!m) continue;
  const ref=st.match(/(\w+Entity)::new/);
  const lam=st.match(/new\s+(\w+Entity)\s*\(/);
  const c=ref||lam; if(c) idToClass[m[1]]=c[1];
}
const cf=path.join(ROOT,'encyclopedia/canon/srp-creatures.json');
const canon=JSON.parse(fs.readFileSync(cf,'utf8'));
let yes=0,no=0,unknown=[];
for(const c of canon.creatures){
  const cls=idToClass[c.id];
  if(!cls){ unknown.push(c.id); continue; }
  const v=resolve(cls);
  c.supportsAdaptation=v; c.entityClass=cls;
  if(v) yes++; else no++;
}
canon.summary.adaptationSupport={yes,no,tagged:yes+no,unknown:unknown.length};
fs.writeFileSync(cf, JSON.stringify(canon,null,2)+'\n');
console.log('supports adaptation:',yes,'| does not:',no,'| unknown class:',unknown.length, unknown.slice(0,10).join(','));
const odd=canon.creatures.filter(c=>c.supportsAdaptation&&['CRUDE','INBORN'].includes(c.tier)).map(c=>c.id);
console.log('INBORN/CRUDE that DO adapt ('+odd.length+'):', odd.join(', '));