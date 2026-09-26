const fs=require('fs'),path=require('path');
const R=process.argv[2], n=process.argv[3];
const f=path.join(R,'encyclopedia/README.md');
let s=fs.readFileSync(f,'utf8');
s=s.replace(/\*\*in progress - \d+ \/ 129\*\*/, '**in progress - '+n+' / 129**');
fs.writeFileSync(f,s);
console.log('README now says', n, '/ 129');