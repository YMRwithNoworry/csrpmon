const fs=require('fs'),path=require('path');
const f=path.join(process.argv[2],'encyclopedia/README.md');
let s=fs.readFileSync(f,'utf8');
s=s.replace(/\| 5 \| Real relationships between creatures \|[^\n]*\n/, '| 5 | Real relationships between creatures | **done** - [canon/relationships.json](canon/relationships.json), **52 relations parsed out of ParasiteTransformation.java**, the mod own evolve/devolve code |\n');
s=s.replace(/\| 6 \| Per-creature Pokemon designs \|[^\n]*\n/, '| 6 | Per-creature Pokemon designs | **in progress - 11 / 129** ([pokedex/](pokedex/README.md)); the whole INBORN tier is done |\n');
s=s.replace(/\| 4 \| Tier \/ stage \/ ecology permission matrix \|[^\n]*\n/, '| 4 | Tier / stage / ecology permission matrix | **done** - tiers + minStage + denied, enforced by tools/build_pokedex.cjs |\n');
const F=String.fromCharCode(96,96,96);
const extra=['','## The strongest find so far','',
'entity/ParasiteTransformation.java is the mod own evolve/devolve implementation, and it settles the',
'growth graph outright instead of leaving it to naming conventions:','',
F+'java',
'if (type == BUGLIN)         return RUPTER;',
'if (type == RUPTER)         return MANGLER;',
'if (type == MOVINGFLESH)    return randomPrimitive(source);   // one of 12 pri_*',
'if (type == SIM_ADVENTURER) return THRALL;',
'if (type == HOST)           return HOSTII;',
'if (type == CRUX_INCOMPLETE)return CRUX;',
'// pri_X -> ada_X, sim_X -> fer_X (except sim_wolf and the *_head set)',
F,'',
'That is why buglin -> rupter -> mangler, movingflesh -> a random primitive, assimilated -> feral and',
'the whole nexus ladder are recorded as **proven** rather than assumed. Stage counts follow from it:',
'86 base / 27 mid / 13 final / 3 nexus-stage-IV.','',''].join('\n');
if(!s.includes('The strongest find so far')) s=s.replace('## Layout', extra+'## Layout');
fs.writeFileSync(f,s);
console.log('README updated');