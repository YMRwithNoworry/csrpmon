const fs=require('fs'),path=require('path');
const R=process.argv[2];
const f=path.join(R,'tools/build_canon_md.cjs');
let s=fs.readFileSync(f,'utf8');
const anchor="L.push('## Conflicts and open questions');";
if(!s.includes(anchor)) throw new Error('anchor missing');
const extra=[
"L.push('### Primitive/Adapted pairs the code refuses to link');",
"L.push('');",
"L.push('Three pairs look like growth pairs by naming but are **explicitly excluded** by');",
"L.push('`ParasiteTransformation.evolutionType()`: pri_burrower, pri_devourer and pri_tozoon all');",
"L.push('return null instead of an adapted form, and `devolutionType()` excludes their adapted');",
"L.push('counterparts just as explicitly. Both entities exist and are designed, but the relationship');",
"L.push('between them is **not asserted** - see conflict-burrower-devourer-tozoon.md.');",
"L.push('');",
"L.push('The other nine pri_/ada_ pairs do transform, and their edges are recorded as proven.');",
"L.push('');",
].join('\n');
s=s.replace(anchor, anchor+'\n'+extra);
fs.writeFileSync(f,s);
console.log('canon md now documents the excluded pairs');