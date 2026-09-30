const fs=require('fs'),path=require('path');
const R=process.argv[2];
const canon=JSON.parse(fs.readFileSync(path.join(R,'encyclopedia/canon/srp-creatures.json'),'utf8'));
const designDir=path.join(R,'encyclopedia/pokedex/_designs');
const speciesDir=path.join(R,'src/main/resources/data/csrpmon/species');
const resDir=path.join(R,'src/main/resources/assets/csrpmon/bedrock/pokemon/resolvers');
const texDir=path.join(R,'src/main/resources/assets/csrpmon/textures/pokemon');

const TYPES={'虫':'bug','毒':'poison','恶':'dark','一般':'normal','格斗':'fighting','飞行':'flying','地面':'ground','岩石':'rock','钢':'steel','水':'water','火':'fire','草':'grass','电':'electric','超能':'psychic','幽灵':'ghost','龙':'dragon','妖精':'fairy','冰':'ice'};

const TIERBAND={INBORN:[1,3,10],CRUDE:[2,10,20],PRIMITIVE:[3,24,36],ADAPTED:[4,34,46],
ASSIMILATED:[3,20,32],WALKING_HEAD:[2,12,22],ASSIMARA:[4,34,46],HIJACKED:[3,22,34],
FERAL:[4,34,46],NEXUS:[5,46,58],DETERRENT:[3,22,34],PURE:[4,34,46],
PREEMINENT:[5,46,58],DERIVED:[6,58,75],ANCIENT:[6,58,80],ABOMINATION:[2,12,22]};
const CATCH={INBORN:225,CRUDE:190,PRIMITIVE:120,ADAPTED:90,ASSIMILATED:150,WALKING_HEAD:190,
ASSIMARA:90,HIJACKED:150,FERAL:90,NEXUS:45,DETERRENT:150,PURE:90,PREEMINENT:45,
DERIVED:3,ANCIENT:3,ABOMINATION:150};

const MOVES={bug:['bugbite','leechlife','xscissor','lunge','pinmissile','fellstinger','uturn'],
poison:['poisonsting','sludgebomb','sludgewave','toxic','toxicspikes','gunkshot'],
dark:['bite','crunch','darkpulse','nightslash','suckerpunch'],
normal:['tackle','scratch','quickattack','bodyslam','slash','furyswipes','hyperbeam'],
fighting:['karatechop','brickbreak','closecombat','drainpunch'],
flying:['gust','wingattack','aerialace','bravebird'],
ground:['mudslap','bulldoze','dig','earthquake'],
rock:['rockthrow','rockslide','stoneedge','smackdown'],
steel:['metalclaw','ironhead','flashcannon','irondefense'],
water:['bodyslam','quickattack','slash'],
fire:['ember','flamethrower'],
grass:['absorb','megadrain','gigadrain','growth'],
electric:['thundershock','thunderbolt','thunder'],
psychic:['confusion','psybeam','psychic','psyshock','lightscreen','reflect'],
ghost:['astonish','shadowball','shadowclaw'],
dragon:['dragonbreath','dragonclaw','dragonpulse','outrage'],
fairy:['tackle','quickattack','bodyslam'],
ice:['tackle','bodyslam','slash']};

const ABIL={INBORN:['primitivewildness','h:parasiticinstinct'],CRUDE:['primitivewildness','h:parasiticinstinct'],
PRIMITIVE:['parasiticinstinct','h:adaptivemutation'],ADAPTED:['adaptivemutation','h:swiftsymbiosis'],
ASSIMILATED:['colonyinfection','h:parasiticinstinct'],WALKING_HEAD:['colonyinfection','h:hiveswarm'],
ASSIMARA:['adaptivemutation','h:colonyinfection'],HIJACKED:['swiftsymbiosis','h:parasiticinstinct'],
FERAL:['swiftsymbiosis','h:hiveswarm'],NEXUS:['parasiticnest','h:infiniteproliferation'],
DETERRENT:['hiveswarm','h:parasiticnest'],PURE:['hiveswarm','h:swiftsymbiosis'],
PREEMINENT:['infiniteproliferation','h:adaptivemutation'],DERIVED:['infiniteproliferation','h:adaptivemutation'],
ANCIENT:['infiniteproliferation','h:parasiticnest'],ABOMINATION:['primitivewildness','h:hiveswarm']};

const TEXTURES=['buglin','rupter','gnat'];
const placeholder=fs.readFileSync(path.join(texDir,'buglin.png'));

const src=fs.readFileSync(path.join(R,'src/main/java/alku/csrpmon/species/ParasiteSpeciesMap.java'),'utf8');
const existing=new Set([...src.matchAll(/add\("([a-z0-9_]+)"/g)].map(m=>m[1]));
const dexUsed=new Set();
for(const f of fs.readdirSync(speciesDir)){const d=JSON.parse(fs.readFileSync(path.join(speciesDir,f),'utf8'));if(d.nationalPokedexNumber)dexUsed.add(d.nationalPokedexNumber);}
let nextDex=Math.max(...dexUsed)+1;

const en=JSON.parse(fs.readFileSync(path.join(R,'src/main/resources/assets/csrpmon/lang/en_us.json'),'utf8'));
const zh=JSON.parse(fs.readFileSync(path.join(R,'src/main/resources/assets/csrpmon/lang/zh_cn.json'),'utf8'));

const added=[];
const ordered=canon.creatures.filter(c=>c.isCreature!==false);
for(const c of ordered){
  if(existing.has(c.id)) continue;
  const df=path.join(designDir,c.id+'.json');
  if(!fs.existsSync(df)) continue;
  const d=JSON.parse(fs.readFileSync(df,'utf8'));
  const tier=c.tier;
  const band=TIERBAND[tier]||[3,20,32];
  const sid=c.id;
  const t1=TYPES[d.types[0]]||'bug';
  const t2=TYPES[d.types[1]]||null;
  const primary=ABIL[tier]?ABIL[tier][0]:'parasiticinstinct';
  const hidden=ABIL[tier]?ABIL[tier][1]:'h:parasiticinstinct';
  const p1=MOVES[t1]||MOVES.normal, p2=MOVES[t2||t1]||MOVES.normal;
  const moves=['1:tackle','1:parasiticbite','1:'+p1[0],'4:'+p2[0],'10:'+p1[Math.min(1,p1.length-1)],
    '18:'+(band[0]>=3?'hivebite':p2[Math.min(1,p2.length-1)]),
    '28:'+(band[0]>=4?'rendingclaws':p1[Math.min(2,p1.length-1)]),
    '38:'+p2[Math.min(2,p2.length-1)],
    '50:'+(band[0]>=5?'nestsummon':p1[Math.min(3,p1.length-1)]),
    '62:'+(band[0]>=6?'devourevolution':'hyperbeam')];
  const dex=nextDex++;
  const species={implemented:true,nationalPokedexNumber:dex,name:d.en,
    pokedex:['csrpmon.species.'+sid+'.desc'],labels:['csrp',tier.toLowerCase()],
    aspects:[],maleRatio:0.5,height:Math.round(d.height*10),weight:Math.round(d.weight*10),
    primaryType:t1,abilities:[primary,hidden],eggGroups:['bug'],
    baseStats:{hp:d.stats[0],attack:d.stats[1],defence:d.stats[2],special_attack:d.stats[3],special_defence:d.stats[4],speed:d.stats[5]},
    evYield:{hp:0,attack:0,defence:0,special_attack:0,special_defence:0,speed:1},
    baseExperienceYield:40+band[0]*15,experienceGroup:'medium_fast',
    catchRate:CATCH[tier]||120,eggCycles:20,baseFriendship:50,baseScale:1,
    hitbox:{width:0.7,height:0.7,fixed:false},
    behaviour:{moving:{walk:{walkSpeed:0.2},swim:{avoidsWater:true},canLook:true},
      resting:{canSleep:true,light:'0-4',times:['any'],drowsyChance:0.0333,rouseChance:0.0042},
      herd:{maxSize:4,toleratedLeaders:[]}},
    drops:{amount:1,entries:[{item:'minecraft:rotten_flesh',percentage:50}]},
    moves:moves,evolutions:[]};
  if(t2) species.secondaryType=t2;
  fs.writeFileSync(path.join(speciesDir,sid+'.json'),JSON.stringify(species,null,2)+'\n');
  fs.writeFileSync(path.join(resDir,sid+'.json'),JSON.stringify({order:0,species:'csrpmon:'+sid,
    variations:[{aspects:[],sprites:{portrait:'csrpmon:textures/pokemon/'+sid+'.png',profile:'csrpmon:textures/pokemon/'+sid+'.png'}}]},null,2)+'\n');
  fs.writeFileSync(path.join(texDir,sid+'.png'),placeholder);
  en['csrpmon.species.'+sid+'.name']=d.en;
  en['csrpmon.species.'+sid+'.desc']=(d.dex1||'').slice(0,180);
  zh['csrpmon.species.'+sid+'.name']=d.zh;
  zh['csrpmon.species.'+sid+'.desc']=(d.dex1||'').slice(0,180);
  added.push([c.id,sid,tier,band[1],band[2]]);
}
fs.writeFileSync(path.join(R,'src/main/resources/assets/csrpmon/lang/en_us.json'),JSON.stringify(en,null,2)+'\n');
fs.writeFileSync(path.join(R,'src/main/resources/assets/csrpmon/lang/zh_cn.json'),JSON.stringify(zh,null,2)+'\n');
fs.writeFileSync(path.join(R,'csrpmon-new-entries.json'),JSON.stringify(added,null,2));
console.log('generated species:',added.length,'| dex range:',Math.max(...dexUsed)+1,'..',nextDex-1);
console.log('sample:',JSON.stringify(added.slice(0,3)));
