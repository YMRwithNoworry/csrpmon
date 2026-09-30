const fs=require('fs'),path=require('path');
const R=process.argv[2];
const M=JSON.parse(fs.readFileSync(path.join(R,'tools/mechanics.json'),'utf8'));
const dir=path.join(R,'src/main/resources/data/csrpmon/moves');
const KEEP=new Set(['devourevolution','hivebite','nestsummon','parasiticbite','rendingclaws']);
const TYPE={'一般':'Normal','格斗':'Fighting','飞行':'Flying','毒':'Poison','地面':'Ground','岩石':'Rock','虫':'Bug','幽灵':'Ghost','钢':'Steel','水':'Water','草':'Grass','电':'Electric','超能':'Psychic','冰':'Ice','龙':'Dragon','恶':'Dark','妖精':'Fairy'};
const CAT={'物理':'Physical','特殊':'Special','变化':'Status'};
const PP={common:20,signature:10};
const NL=String.fromCharCode(10);
const Q=String.fromCharCode(34);
function statFor(e){
  if(e.indexOf('速度')>=0||e.indexOf('迟滞')>=0) return 'spe';
  if(e.indexOf('特攻')>=0) return 'spa';
  if(e.indexOf('特防')>=0) return 'spd';
  if(e.indexOf('防御')>=0||e.indexOf('护甲')>=0) return 'def';
  return 'atk';
}
// One volatile per move, named exactly the move id. Showdown resolves an inline condition by
// moves.getByID(toID(volatileStatus)), so the name must be the move id or every callback is lost.
function conditionBlock(id,f){
  const c=[];
  c.push('  volatileStatus: '+JSON.stringify(id)+',');
  c.push('  condition: {');
  c.push('    name: '+JSON.stringify(id)+',');
  c.push('    noCopy: true,');
  if(f.infect){
    c.push('    onStart(target) {');
    c.push('      this.effectState.layers = Math.min(3, (this.effectState.layers || 0) + 1);');
    c.push('      this.add('+Q+'-start'+Q+', target, '+Q+'Infection'+Q+', '+Q+'[layers] '+Q+' + this.effectState.layers);');
    c.push('    },');
    c.push('    onRestart(target) {');
    c.push('      this.effectState.layers = Math.min(3, (this.effectState.layers || 0) + 1);');
    c.push('      this.add('+Q+'-start'+Q+', target, '+Q+'Infection'+Q+', '+Q+'[up]'+Q+');');
    c.push('    },');
  }
  c.push('    onResidualOrder: 8,');
  c.push('    onResidual(pokemon) {');
  if(f.infect) c.push('      const layers = this.effectState.layers || 1;');
  if(f.infect) c.push('      this.damage(pokemon.maxhp * layers / 16, pokemon, this.effectState.source);');
  else if(f.dotDen) c.push('      this.damage(pokemon.maxhp / '+f.dotDen+', pokemon, this.effectState.source);');
  if(f.adapt) c.push('      this.effectState.turns = (this.effectState.turns || 0) + 1;');
  c.push('    },');
  if(f.adapt){
    c.push('    onSourceModifyDamage(damage, source, target, move) {');
    c.push('      const turns = this.effectState.turns || 0;');
    c.push('      if (turns > 0) this.debug('+Q+'adaptation reduces damage'+Q+');');
    c.push('      if (turns >= 1) return this.chainModify(0.8);');
    c.push('    },');
  }
  if(f.infect){
    c.push('    onTrapPokemon(pokemon) {');
    c.push('      if ((this.effectState.layers || 1) >= 3) pokemon.tryTrap();');
    c.push('    },');
  } else if(f.trap){
    c.push('    onTrapPokemon(pokemon) {');
    c.push('      pokemon.tryTrap();');
    c.push('    },');
  }
  c.push('  },');
  return c;
}
const needsCondition=(f)=>!!(f.infect||f.dotDen||f.adapt||(f.trap&&!f.infect));
let written=0, withCond=0; const fam={};
for(const id of Object.keys(M)){
  const m=M[id], f=m.mech;
  if(KEEP.has(id)) continue;
  const enName = (String(m.en||id).toLowerCase().replace(/[^a-z0-9]+/g,'')===id) ? m.en : id;
  const b=['{'];
  b.push('  accuracy: '+((m.cls==='变化'&&!f.infect)?'true':'100')+',');
  b.push('  basePower: '+m.pow+',');
  b.push('  category: '+JSON.stringify(CAT[m.cls]||'Status')+',');
  b.push('  name: '+JSON.stringify(enName)+',');
  b.push('  pp: '+(PP[m.kind]||10)+',');
  b.push('  priority: '+(f.priority?Math.min(3,f.priority):0)+',');
  if(f.drain) b.push('  drain: [1, 2],');
  else if(f.heal && m.cls==='变化') b.push('  heal: [1, 2],');
  if(f.multihit && m.cls!=='变化') b.push('  multihit: '+f.multihit+',');
  if(f.recoil && m.cls!=='变化') b.push('  recoil: [1, 4],');
  const fl = m.cls==='物理' ? '{contact:1,protect:1,mirror:1,metronome:1}' : (m.cls==='变化' ? '{snatch:1,metronome:1}' : '{protect:1,mirror:1,metronome:1}');
  b.push('  flags: '+fl+',');
  if(m.cls==='变化'&&f.boostSelf&&!f.summon){ b.push('  boosts: {'+statFor(m.eff)+': 1},'); fam.boostSelf=(fam.boostSelf||0)+1; }
  if(needsCondition(f)){ for(const line of conditionBlock(id,f)) b.push(line); withCond++; if(f.infect)fam.infect=(fam.infect||0)+1; if(f.dotDen)fam.dot=(fam.dot||0)+1; if(f.adapt)fam.adapt=(fam.adapt||0)+1; }
  if(m.cls!=='变化'&&f.dropTarget){ b.push('  secondary: {chance: 100, boosts: {'+statFor(m.eff)+': -1}},'); fam.dropTarget=(fam.dropTarget||0)+1; }
  else b.push('  secondary: null,');
  b.push('  target: '+JSON.stringify(f.area?'allAdjacentFoes':(m.cls==='变化'?'self':'normal'))+',');
  b.push('  type: '+JSON.stringify(TYPE[m.type]||'Normal')+',');
  b.push('  contestType: '+Q+'Clever'+Q+',');
  b.push('}');
  fs.writeFileSync(path.join(dir,id+'.js'),b.join(NL)+NL);
  written++;
}
console.log('moves rewritten:',written,'| with a volatile condition:',withCond);
console.log('families:',Object.entries(fam).map(function(kv){return kv[0]+'='+kv[1]}).join('  '));