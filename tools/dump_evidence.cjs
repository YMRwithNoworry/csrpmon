const fs=require('fs'),path=require('path');
const SRC=process.argv[2], ROOT=process.argv[3], filter=new RegExp(process.argv[4]);
const mod=fs.readFileSync(path.join(SRC,'registry/ModEntities.java'),'utf8');
const idToClass={};
for(const st of mod.split(';')){
  const m=st.match(/(?:monster|ENTITIES\.register)\(\s*"([a-z0-9_]+)"/); if(!m) continue;
  const c=st.match(/(\w+Entity)::new/) || st.match(/new\s+(\w+Entity)\s*\(/); if(c) idToClass[m[1]]=c[1];
}
const edir=path.join(SRC,'entity');
for(const id of Object.keys(idToClass).filter(x=>filter.test(x)).sort()){
  const cls=idToClass[id]; const f=path.join(edir,cls+'.java');
  if(!fs.existsSync(f)){ console.log('=== '+id+' ('+cls+') MISSING'); continue; }
  const t=fs.readFileSync(f,'utf8');
  const doc=(t.match(/\/\*\*([\s\S]{0,420}?)\*\//)||[])[1];
  const docTxt=doc?doc.replace(/\s+/g,' ').replace(/^\* ?/,'').trim():'';
  const attrs=[...t.matchAll(/Attributes\.(MAX_HEALTH|ARMOR|ATTACK_DAMAGE|MOVEMENT_SPEED|FLYING_SPEED|KNOCKBACK_RESISTANCE|FOLLOW_RANGE),\s*([0-9.]+)/g)].map(m=>m[1].replace('Attributes.','')+'='+m[2]);
  const consts=[...t.matchAll(/private static final (?:int|float|double) ([A-Z_]{4,}) = ([0-9_.*FfDd]+)/g)].slice(0,10).map(m=>m[1]+'='+m[2]);
  const goals=[...t.matchAll(/new (\w+Goal)\(/g)].map(m=>m[1]);
  console.log('=== '+id+'  ->  '+cls);
  if(docTxt) console.log('  doc: '+docTxt.slice(0,230));
  if(attrs.length) console.log('  attrs: '+attrs.join(' '));
  if(consts.length) console.log('  consts: '+consts.slice(0,8).join(' '));
  if(goals.length) console.log('  goals: '+[...new Set(goals)].slice(0,6).join(' '));
}