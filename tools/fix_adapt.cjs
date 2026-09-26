const fs=require('fs'),path=require('path');
const f=path.join(process.argv[2],'tools/build_adaptation.cjs');
let s=fs.readFileSync(f,'utf8');
const from="  const c=st.match(/(\\\\w+Entity)::new/); if(c) idToClass[m[1]]=c[1];";
if(!s.includes(from)) throw new Error('anchor missing');
const to="  const c=st.match(/(\\\\w+Entity)::new/) || st.match(/new\\\\s+(\\\\w+Entity)\\\\s*\\\\(/); if(c) idToClass[m[1]]=c[1];";
fs.writeFileSync(f, s.replace(from,to));
console.log('class extraction now also handles the lambda form');