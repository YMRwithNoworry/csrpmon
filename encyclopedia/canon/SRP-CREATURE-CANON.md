# SRP Creature Canon Database

Every creature below is proven to exist by reading the CSRP 1.10.8 source, not by memory.
Nothing is invented: a row exists only because the entity is registered in `ModEntities.java`,
or because the mod itself ships a bestiary entry for it.

## Sources (all machine-read from the repository)

| Fact | Evidence |
|---|---|
| The creature exists | `src/main/java/alku/csrp/registry/ModEntities.java` - the register call, plus its `MobCategory` |
| Tier (code) | `src/main/java/alku/csrp/relay/RelayScanReportFactory.java` - the `Tier` enum, which lists every creature by tier |
| Tier (data) | `src/main/resources/assets/csrp/bestiary/<id>.json` - the `tier` field |
| English / Chinese name | `assets/csrp/lang/en_us.json` and `zh_cn.json`, key `entity.csrp.<id>` |

Registered entity ids: **157**. Bestiary entries: **126**.
Creatures (MobCategory `MONSTER`/`CREATURE`): **129**. Excluded as non-creatures (projectiles, orbs, effects): **34**.

## Tiers

| Tier | Count |
|---|---|
| INBORN | 10 |
| ASSIMILATED | 13 |
| WALKING_HEAD | 10 |
| ASSIMARA | 6 |
| HIJACKED | 3 |
| FERAL | 9 |
| CRUDE | 11 |
| PRIMITIVE | 12 |
| ADAPTED | 12 |
| NEXUS | 13 |
| DETERRENT | 5 |
| PURE | 7 |
| PREEMINENT | 8 |
| DERIVED | 2 |
| ANCIENT | 4 |
| ABOMINATION | 2 |
| UNTIERED | 2 |

## The creatures

### INBORN (10)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:buglin` | Buglin | 虫灵 | code+bestiary |  |
| `csrp:gnat` | Gnat | 狂疫虫 | code+bestiary |  |
| `csrp:lice` | Lice | 狂疫飞虫 | code+bestiary |  |
| `csrp:rupter` | Rupter | 裂兽 | code+bestiary |  |
| `csrp:mangler` | Mangler | 凶裂兽 | code+bestiary |  |
| `csrp:carrier_flying` | Flying Carrier | 飞行母体 | code+bestiary |  |
| `csrp:carrier_heavy` | Heavy Carrier | 重型母体 | code+bestiary |  |
| `csrp:carrier_light` | Light Carrier | 轻型母体 | code+bestiary |  |
| `csrp:movingflesh` | Moving Flesh | 活体肉块 | code | no bestiary entry |
| `csrp:worker` | Worker | 工兽 | code | no bestiary entry |

### ASSIMILATED (13)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:sim_adventurer` | Assimilated Adventurer | 被同化的冒险者 | code+bestiary |  |
| `csrp:sim_bear` | Assimilated Bear | 被同化的熊 | code+bestiary |  |
| `csrp:sim_bigspider` | Assimilated Big Spider | 被同化的大蜘蛛 | code+bestiary |  |
| `csrp:sim_cow` | Assimilated Cow | 被同化的牛 | code+bestiary |  |
| `csrp:sim_dragone` | Assimilated Ender Dragon | 被同化的末影龙 | code+bestiary |  |
| `csrp:sim_enderman` | Assimilated Enderman | 被同化的末影人 | code+bestiary |  |
| `csrp:sim_horse` | Assimilated Horse | 被同化的马 | code+bestiary |  |
| `csrp:sim_human` | Assimilated Human | 被同化的人类 | code+bestiary |  |
| `csrp:sim_pig` | Assimilated Pig | 被同化的猪 | code+bestiary |  |
| `csrp:sim_sheep` | Assimilated Sheep | 被同化的羊 | code+bestiary |  |
| `csrp:sim_squid` | Assimilated Squid | 被同化的鱿鱼 | code+bestiary |  |
| `csrp:sim_villager` | Assimilated Villager | 被同化的村民 | code+bestiary |  |
| `csrp:sim_wolf` | Assimilated Wolf | 被同化的狼 | code+bestiary |  |

### WALKING_HEAD (10)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:sim_cowhead` | Walking Cow Head | 行走牛头颅 | code+bestiary |  |
| `csrp:sim_endermanhead` | Walking Enderman Head | 行走末影人头颅 | code+bestiary |  |
| `csrp:sim_horsehead` | Walking Horse Head | 行走马头颅 | code+bestiary |  |
| `csrp:sim_humanhead` | Walking Human Head | 行走人类头颅 | code+bestiary |  |
| `csrp:sim_pighead` | Walking Pig Head | 行走猪头颅 | code+bestiary |  |
| `csrp:sim_sheephead` | Walking Sheep Head | 行走羊头颅 | code+bestiary |  |
| `csrp:sim_villagerhead` | Walking Villager Head | 行走村民头颅 | code+bestiary |  |
| `csrp:sim_wolfhead` | Walking Wolf Head | 行走狼头颅 | code+bestiary |  |
| `csrp:sim_adventurerhead` | Walking Adventurer Head | 行走冒险者头颅 | code+bestiary |  |
| `csrp:sim_dragonehead` | Walking Ender Dragon Head | 行走龙首 | code+bestiary |  |

### ASSIMARA (6)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:mar_bear` | Marauderized Bear | 诡化熊 | code+bestiary |  |
| `csrp:mar_cow` | Marauderized Cow | 诡化牛 | code+bestiary |  |
| `csrp:mar_enderman` | Marauderized Enderman | 诡化末影人 | code+bestiary |  |
| `csrp:mar_human` | Marauderized Human | 诡化人类 | code+bestiary |  |
| `csrp:mar_sheep` | Marauderized Sheep | 诡化羊 | code+bestiary |  |
| `csrp:mar_villager` | Marauderized Villager | 诡化村民 | code+bestiary |  |

### HIJACKED (3)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:hi_blaze` | Hijacked Blaze | 被操纵的烈焰人 | code+bestiary |  |
| `csrp:hi_golem` | Hijacked Golem | 被操纵的铁傀儡 | code+bestiary |  |
| `csrp:hi_skeleton` | Hijacked Skeleton | 被操纵的骷髅 | code+bestiary |  |

### FERAL (9)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:fer_bear` | Feral Bear | 狂化熊 | code+bestiary |  |
| `csrp:fer_cow` | Feral Cow | 狂化牛 | code+bestiary |  |
| `csrp:fer_enderman` | Feral Enderman | 狂化末影人 | code+bestiary |  |
| `csrp:fer_horse` | Feral Horse | 狂化马 | code+bestiary |  |
| `csrp:fer_human` | Feral Human | 狂化人类 | code+bestiary |  |
| `csrp:fer_pig` | Feral Pig | 狂化猪 | code+bestiary |  |
| `csrp:fer_sheep` | Feral Sheep | 狂化羊 | code+bestiary |  |
| `csrp:fer_villager` | Feral Villager | 狂化村民 | code+bestiary |  |
| `csrp:fer_wolf` | Feral Wolf | 狂化狼 | code+bestiary |  |

### CRUDE (11)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:crux` | Crux | 烬余兽 | code+bestiary |  |
| `csrp:crux_incomplete` | Incomplete Crux | 未成形烬余兽 | code+bestiary |  |
| `csrp:airscrew` | Airscrew | 悬牵体 | code+bestiary |  |
| `csrp:heed` | Heed | 警戒兽 | code+bestiary |  |
| `csrp:host` | Host | 缠骨柱 | code+bestiary |  |
| `csrp:hostii` | Host II | 缠骷柱 | code+bestiary |  |
| `csrp:incompleteform_medium` | Medium Incomplete Form | 中型未成形寄生体 | code+bestiary |  |
| `csrp:incompleteform_small` | Small Incomplete Form | 小型未成形寄生体 | code+bestiary |  |
| `csrp:thrall` | Thrall | 寄生奴仆 | code+bestiary |  |
| `csrp:dredge` | Dredge | 溺骨妖 | code+bestiary |  |
| `csrp:carrier_worm` | Worm Carrier | 蠕虫载体 | code | no bestiary entry |

### PRIMITIVE (12)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:pri_arachnida` | Primitive Arachnida | 原始蛛形兽 | code+bestiary |  |
| `csrp:pri_bolster` | Primitive Bolster | 原始协增兽 | code+bestiary |  |
| `csrp:pri_burrower` | Primitive Burrower | 原始掘地兽 | code+bestiary |  |
| `csrp:pri_devourer` | Primitive Devourer | 原始吞噬兽 | code+bestiary |  |
| `csrp:pri_longarms` | Primitive Longarms | 原始长臂兽 | code+bestiary |  |
| `csrp:pri_manducater` | Primitive Manducater | 原始咀骨兽 | code+bestiary |  |
| `csrp:pri_reeker` | Primitive Reeker | 原始毒腥兽 | code+bestiary |  |
| `csrp:pri_summoner` | Primitive Summoner | 原始召唤兽 | code+bestiary |  |
| `csrp:pri_tozoon` | Primitive Tozoon | 原始潜地兽 | code+bestiary |  |
| `csrp:pri_vermin` | Primitive Vermin | 原始孕虫兽 | code+bestiary |  |
| `csrp:pri_viscera` | Primitive Viscera | 原始脏腑兽 | code+bestiary |  |
| `csrp:pri_yelloweye` | Primitive Yelloweye | 原始黄眸兽 | code+bestiary |  |

### ADAPTED (12)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:ada_arachnida` | Adapted Arachnida | 适应蛛形兽 | code+bestiary |  |
| `csrp:ada_bolster` | Adapted Bolster | 适应协增兽 | code+bestiary |  |
| `csrp:ada_burrower` | Adapted Burrower | 适应掘地兽 | code+bestiary |  |
| `csrp:ada_devourer` | Adapted Devourer | 适应吞噬兽 | code+bestiary |  |
| `csrp:ada_longarms` | Adapted Longarms | 适应长臂兽 | code+bestiary |  |
| `csrp:ada_manducater` | Adapted Manducater | 适应咀骨兽 | code+bestiary |  |
| `csrp:ada_reeker` | Adapted Reeker | 适应毒腥兽 | code+bestiary |  |
| `csrp:ada_summoner` | Adapted Summoner | 适应召唤兽 | code+bestiary |  |
| `csrp:ada_tozoon` | Adapted Tozoon | 适应潜地兽 | code+bestiary |  |
| `csrp:ada_viscera` | Adapted Viscera | 适应脏腑兽 | code+bestiary |  |
| `csrp:ada_yelloweye` | Adapted Yelloweye | 适应黄眸兽 | code+bestiary |  |
| `csrp:ada_vermin` | Adapted Vermin | 适应孕虫兽 | code+bestiary |  |

### NEXUS (13)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:beckon_si` | Stage I Beckon | I阶召唤柱 | code+bestiary |  |
| `csrp:beckon_sii` | Stage II Beckon | II阶召唤柱 | code+bestiary |  |
| `csrp:beckon_siii` | Stage III Beckon | III阶召唤柱 | code+bestiary |  |
| `csrp:beckon_siv` | Stage IV Beckon | IV阶召唤柱 | code+bestiary |  |
| `csrp:dispatcher_si` | Stage I Dispatcher | I阶调度柱 | code+bestiary |  |
| `csrp:dispatcher_sii` | Stage II Dispatcher | II阶调度柱 | code+bestiary |  |
| `csrp:dispatcher_siii` | Stage III Dispatcher | III阶调度柱 | code+bestiary |  |
| `csrp:dispatcher_siv` | Stage IV Dispatcher | IV阶调度柱 | code+bestiary |  |
| `csrp:rooter_si` | Stage I Rooter | I阶支庇柱 | code+bestiary |  |
| `csrp:rooter_sii` | Stage II Rooter | II阶支庇柱 | code+bestiary |  |
| `csrp:rooter_siii` | Stage III Rooter | III阶支庇柱 | code+bestiary |  |
| `csrp:rooter_siv` | Stage IV Rooter | IV阶支庇柱 | code+bestiary |  |
| `csrp:rooterball` | Rootmass Cyst | 支庇柱囊块 | code+bestiary |  |

### DETERRENT (5)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:dispatcherten` | Dispatcher Tentacle | 调度柱触须 | code+bestiary | **CONFLICT** code says NEXUS, bestiary says DETERRENT |
| `csrp:kyphosis` | Kyphosis | 曲击柱 | code+bestiary |  |
| `csrp:seizer` | Seizer | 缠缚触手 | code+bestiary |  |
| `csrp:sentry` | Sentry | 哨戒爪 | code+bestiary |  |
| `csrp:worm` | Worm | 侵袭蠕虫 | code+bestiary |  |

### PURE (7)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:grunt` | Grunt | 步行兽 | code+bestiary |  |
| `csrp:bomber_light` | Light Bomber | 轻型轰炸兽 | code+bestiary |  |
| `csrp:marauder` | Marauder | 掠夺兽 | code+bestiary |  |
| `csrp:monarch` | Monarch | 统御兽  | code+bestiary |  |
| `csrp:overseer` | Overseer | 监察兽 | code+bestiary |  |
| `csrp:vigilante` | Vigilante | 巡兽 | code+bestiary |  |
| `csrp:warden` | Warden | 看守兽 | code+bestiary |  |

### PREEMINENT (8)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:bogle` | Bogle | 怖怪体 | code+bestiary |  |
| `csrp:carrier_colony` | Colony Carrier | 聚生载体 | code+bestiary |  |
| `csrp:haunter` | Haunter | 逐猎兽 | code+bestiary |  |
| `csrp:bomber_heavy` | Heavy Bomber | 重型轰炸兽 | code+bestiary |  |
| `csrp:wraith` | Wraith | 幽鬼体 | code+bestiary |  |
| `csrp:succor` | Succor | 援助泡 | code+bestiary |  |
| `csrp:architect` | Architect | 构筑体 | code | no bestiary entry |
| `csrp:seeker` | Seeker | 追迹兽 | code | no bestiary entry |

### DERIVED (2)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:draconite` | Draconite | §9邪狱龙 | code+bestiary |  |
| `csrp:kirin` | Kirin | §9踏虚体 | code+bestiary |  |

### ANCIENT (4)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:anc_dreadnaut` | Ancient Dreadnaut | 远古惧魔 | code+bestiary |  |
| `csrp:anc_overlord` | Ancient Overlord | 远古君魔 | code+bestiary |  |
| `csrp:anc_dreadnaut_ten` | Ancient Dreadnaut Tendril | 远古惧魔触须 | code | no bestiary entry |
| `csrp:anc_pod` | Ancient Drop Pod | 空投吊舱 | code | no bestiary entry |

### ABOMINATION (2)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:abo_bodies` | Many Bodies | 缀合多体 | bestiary |  |
| `csrp:abo_head` | Giant Head | 巨型头颅 | bestiary |  |

### UNTIERED (2)

| Source ID | English | Chinese | Tier source | Notes |
|---|---|---|---|---|
| `csrp:sim_dragonhead` | Walking Ender Dragon Head | 行走龙首 |  | no bestiary entry |
| `csrp:marauder_tendril` | Marauder Tendril | 掠夺者触手 |  | no bestiary entry |

## Conflicts and open questions

### csrp:dispatcherten (Dispatcher Tentacle)

- Version A: bestiary says `DETERRENT` (and the user-provided whitelist lists Dispatcher Tentacle under Deterrent Parasites)
- Version B: `RelayScanReportFactory.Tier` says `NEXUS`
- Adopted: `DETERRENT` - two independent sources agree, the code enum is the outlier.
- No third behaviour is invented.

### Untiered creatures

These are registered and are real creatures, but neither tier source mentions them.
They are marked **【待核实】** and will not be designed until a tier is confirmed.

- `csrp:sim_dragonhead` Walking Ender Dragon Head - MONSTER
- `csrp:marauder_tendril` Marauder Tendril - MONSTER

### Bestiary entries with no entity

`smar_bear`, `smar_cow`, `smar_enderman`, `smar_human`, `smar_sheep`, `smar_villager` have bestiary
files but **no registered entity and no localized name**. They cannot be designed: there is no
`csrp:smar_*` creature to point at. The similarly named `mar_*` (ASSIMARA) set does exist and is used instead.

## Excluded: not creatures

These are registered entities but are projectiles, orbs, effects or body parts, so they are
**not** valid Pokemon subjects:

`csrp:antiinfestedblock`, `csrp:biomass`, `csrp:bomb`, `csrp:cloudtoxic`, `csrp:crux_block_damage`, `csrp:dragon_egg_assimilation`, `csrp:gore`, `csrp:haunter_damage`, `csrp:haunter_homing`, `csrp:homming`, `csrp:kirin_slash`, `csrp:meteor`, `csrp:nade`, `csrp:orbboom`, `csrp:orbscary`, `csrp:orbvoid`, `csrp:parasite_projectile`, `csrp:pulling_ball`, `csrp:pullingball`, `csrp:remain`, `csrp:scary_orb`, `csrp:scent`, `csrp:shockwave`, `csrp:smar_bear`, `csrp:smar_cow`, `csrp:smar_enderman`, `csrp:smar_human`, `csrp:smar_sheep`, `csrp:smar_villager`, `csrp:source`, `csrp:tendril`, `csrp:warden_waveshock`, `csrp:wave`, `csrp:waveshock`

