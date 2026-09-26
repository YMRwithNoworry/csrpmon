const fs=require('fs'),path=require('path');
const f=path.join(process.argv[2],'tools/build_relationships.cjs');
let s=fs.readFileSync(f,'utf8');
const from="const prim=[...rp.matchAll(/return ModEntities\\.(PRI_[A-Z0-9_]+)\\.get\\(\\)/g)].map(m=>m[1].toLowerCase());";
if(!s.includes(from)) throw new Error('anchor missing');
const to="const prim=[...rp.matchAll(/ModEntities\\.(PRI_[A-Z0-9_]+)\\.get\\(\\)/g)].map(m=>m[1].toLowerCase());";
s=s.replace(from,to);
fs.writeFileSync(f,s);
console.log('regex widened to match the arrow-case switch');