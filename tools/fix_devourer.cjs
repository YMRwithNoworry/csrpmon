const fs=require('fs'),path=require('path');
const R=process.argv[2];
const note=fs.readFileSync(path.join(R,'encyclopedia/canon/conflict-burrower-devourer-tozoon.md'),'utf8').trim();
for(const id of ['pri_devourer','ada_devourer']){
  const f=path.join(R,'encyclopedia/pokedex/_designs/'+id+'.json');
  const d=JSON.parse(fs.readFileSync(f,'utf8'));
  d.evolution=note;
  if(id==='ada_devourer') d.common=d.common.filter(c=>c.id!=='deeplaceration');
  fs.writeFileSync(f, JSON.stringify(d,null,2)+'\n');
  console.log(id,'corrected; common skills:',(d.common||[]).length);
}