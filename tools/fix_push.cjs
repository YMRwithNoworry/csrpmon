const fs=require('fs'),path=require('path');
const f=path.join(process.argv[2],'tools/git_push_via_api.cjs');
let s=fs.readFileSync(f,'utf8');
const from="    if(st==='D'){entries.push({path:file,mode:'100644',type:'blob',sha:null});continue;}";
if(!s.includes(from)) throw new Error('anchor missing');
const to="    if(st==='D'||!fs.existsSync(path.join(ROOT,file))){entries.push({path:file,mode:'100644',type:'blob',sha:null});continue;}";
fs.writeFileSync(f, s.replace(from,to));
console.log('push script now skips files missing from the working tree');