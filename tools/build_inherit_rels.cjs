const fs=require('fs'),path=require('path');
const SRC=process.argv[2], ROOT=process.argv[3];
const edir=path.join(SRC,'entity');
const parents={};
for(const f of fs.readdirSync(edir).filter(f=>f.endsWith('.java'))){
  const t=fs.readFileSync(path.join(edir,f),'utf8');
  const m=t.match(/class\s+(\w+)\s+extends\s+(\w+)/);
  if(m) parents[m[1]]=m[2];
}
const mod=fs.readFileSync(path.join(SRC,'registry/ModEntities.java'),'utf8');
const idToClass={};
for(const st of mod.split(';')){
  const m=st.match(/(?:monster|ENTITIES\.register)\(\s*"([a-z0-9_]+)"/); if(!m) continue;
  const c=st.match(/(\w+Entity)::new/) || st.match(/new\s+(\w+Entity)\s*\(/); if(c) idToClass[m[1]]=c[1];
}
const classToIds={}; for(const [id,cls] of Object.entries(idToClass)){ (classToIds[cls]=classToIds[cls]||[]).push(id); }
// only a class that belongs to EXACTLY ONE creature is evidence of a relationship; a shared base class is not
const classToId={}; for(const [cls,ids] of Object.entries(classToIds)) if(ids.length===1) classToId[cls]=ids[0];
const canon=JSON.parse(fs.readFileSync(path.join(ROOT,'encyclopedia/canon/srp-creatures.json'),'utf8'));
const creatures=new Set(canon.creatures.map(c=>c.id));
const found=[];
for(const [id,cls] of Object.entries(idToClass)){
  if(!creatures.has(id)) continue;
  let c=parents[cls], guard=0;
  while(c && guard++<20){
    const pid=classToId[c];
    if(pid && pid!==id && creatures.has(pid)){ found.push({from:pid,to:id,parentClass:c,childClass:cls}); }
    c=parents[c];
  }
}
const rf=path.join(ROOT,'encyclopedia/canon/relationships.json');
const rel=JSON.parse(fs.readFileSync(rf,'utf8'));
let added=0;
for(const f of found){
  const key='csrp:'+f.from+'>csrp:'+f.to+'>matures-from';
  if(rel.relations.some(r=>(r.from+'>'+r.to+'>'+r.kind)===key)) continue;
  rel.relations.push({from:'csrp:'+f.from,to:'csrp:'+f.to,kind:'matures-from',
    evidence:'class inheritance: '+f.childClass+' extends '+f.parentClass+' in the CSRP source'});
  added++;
}
const kinds={}; for(const r of rel.relations) kinds[r.kind]=(kinds[r.kind]||0)+1;
rel.counts=kinds;
rel.note=rel.note+' Inheritance edges are added where one creature class literally extends another creature class.';
fs.writeFileSync(rf, JSON.stringify(rel,null,2)+'\n');
console.log('inheritance edges added:',added);
for(const f of found) console.log('  '+f.parentClass+' <- '+f.childClass+'  ('+f.from+' -> '+f.to+')');