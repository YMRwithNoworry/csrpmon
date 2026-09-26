const fs=require('fs'),path=require('path');
const R=process.argv[2];
// fix the dedupe key in the generator (it double-prefixed csrp:)
const gf=path.join(R,'tools/build_inherit_rels.cjs');
let g=fs.readFileSync(gf,'utf8');
const from="  if(rel.relations.some(r=>('csrp:'+r.from+'>'+r.to+'>'+r.kind)===key)) continue;";
if(g.includes(from)) g=g.replace(from, "  if(rel.relations.some(r=>(r.from+'>'+r.to+'>'+r.kind)===key)) continue;");
fs.writeFileSync(gf,g);
// dedupe the data file
const rf=path.join(R,'encyclopedia/canon/relationships.json');
const rel=JSON.parse(fs.readFileSync(rf,'utf8'));
const seen=new Set(); const out=[];
for(const r of rel.relations){ const k=r.from+'>'+r.to+'>'+r.kind; if(seen.has(k)) continue; seen.add(k); out.push(r); }
const kinds={}; for(const r of out) kinds[r.kind]=(kinds[r.kind]||0)+1;
rel.relations=out; rel.counts=kinds;
fs.writeFileSync(rf, JSON.stringify(rel,null,2)+'\n');
console.log('relations after dedupe:', out.length, JSON.stringify(kinds));