const fs=require('fs'),path=require('path');
const R=process.argv[2];
// fix the generator so a shared base class maps to many ids and is then rejected
const gf=path.join(R,'tools/build_inherit_rels.cjs');
let g=fs.readFileSync(gf,'utf8');
g=g.replace("const classToId={}; for(const [id,cls] of Object.entries(idToClass)) if(!(cls in classToId)) classToId[cls]=id;",
  "const classToIds={}; for(const [id,cls] of Object.entries(idToClass)){ (classToIds[cls]=classToIds[cls]||[]).push(id); }\n// only a class that belongs to EXACTLY ONE creature is evidence of a relationship; a shared base class is not\nconst classToId={}; for(const [cls,ids] of Object.entries(classToIds)) if(ids.length===1) classToId[cls]=ids[0];");
fs.writeFileSync(gf,g);
// drop the edge that was produced by the old logic
const rf=path.join(R,'encyclopedia/canon/relationships.json');
const rel=JSON.parse(fs.readFileSync(rf,'utf8'));
const before=rel.relations.length;
rel.relations=rel.relations.filter(x=>!((x.from==='csrp:fer_bear'&&x.to==='csrp:fer_enderman')));
const kinds={}; for(const r of rel.relations) kinds[r.kind]=(kinds[r.kind]||0)+1;
rel.counts=kinds;
fs.writeFileSync(rf, JSON.stringify(rel,null,2)+'\n');
console.log('removed', before-rel.relations.length, 'false-positive edge(s)');