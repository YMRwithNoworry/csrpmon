const fs=require('fs'),path=require('path');
const R=process.argv[2];
const jf=path.join(R,'src/main/java/alku/csrpmon/species/ParasiteSpeciesMap.java');
let src=fs.readFileSync(jf,'utf8');
const canon=JSON.parse(fs.readFileSync(path.join(R,'encyclopedia/canon/srp-creatures.json'),'utf8'));
const added=JSON.parse(fs.readFileSync(path.join(R,'csrpmon-new-entries.json'),'utf8'));

// keep the hand-written entries exactly as they are
const kept=[...src.matchAll(/add\("([a-z0-9_]+)", "([a-z0-9_]+)", (\d+), (\d+), (\d+)\);/g)]
  .map(m=>({csrp:m[1],sid:m[2],tier:+m[3],min:+m[4],max:+m[5]}));
const keptIds=new Set(kept.map(k=>k.csrp));
const fresh=added.filter(a=>!keptIds.has(a[0])).map(a=>({csrp:a[0],sid:a[1],tier:a[2],min:a[3],max:a[4]}));
const all=kept.concat(fresh);

const tiers=['INBORN','CRUDE','PRIMITIVE','ADAPTED','ASSIMILATED','WALKING_HEAD','ASSIMARA',
 'HIJACKED','FERAL','NEXUS','DETERRENT','PURE','PREEMINENT','DERIVED','ANCIENT','ABOMINATION'];
const bandOf={INBORN:1,CRUDE:2,PRIMITIVE:3,ADAPTED:4,ASSIMILATED:3,WALKING_HEAD:2,ASSIMARA:4,
 HIJACKED:3,FERAL:4,NEXUS:5,DETERRENT:3,PURE:4,PREEMINENT:5,DERIVED:6,ANCIENT:6,ABOMINATION:2};
const tierOfId={};
for(const c of canon.creatures) if(c.isCreature!==false) tierOfId[c.id]=c.tier;

let body='    static {\n';
for(const t of tiers){
  const rows=all.filter(e=>(tierOfId[e.csrp]||'')===t);
  if(!rows.length) continue;
  body+='        // '+t+' ('+rows.length+')\n';
  for(const e of rows) body+='        add("'+e.csrp+'", "'+e.sid+'", '+e.tier+', '+e.min+', '+e.max+');\n';
}
body+='    }';

const start=src.indexOf('    static {');
const endMarker='    private ParasiteSpeciesMap() {';
const end=src.indexOf(endMarker);
if(start<0||end<0||end<start) throw new Error('could not locate the static block');
src=src.slice(0,start)+body+'\n\n'+src.slice(end);
src=src.replace(/CSRP creatures as a real Cobblemon species/,'CSRP creatures as a real Cobblemon species');
fs.writeFileSync(jf,src);
console.log('map entries: kept',kept.length,'+ added',fresh.length,'= ',all.length);
console.log('tiers written:',tiers.filter(t=>all.some(e=>tierOfId[e.csrp]===t)).length);
