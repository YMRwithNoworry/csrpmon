# SRP Creature Canon Database

Every creature below is proven to exist by reading the CSRP 1.10.8 source. Nothing is invented:
a row exists only because the entity is registered in `ModEntities.java`, or because the mod ships a
bestiary entry for it.

## Sources (all machine-read from the repository)

| Fact | Evidence |
|---|---|
| The creature exists | `registry/ModEntities.java` - the register call and its `MobCategory` |
| Original SRP class | the javadoc on each entity class, e.g. `EntityNuuh` for Mangler |
| Tier (code) | `relay/RelayScanReportFactory.java` - the `Tier` enum lists every creature |
| Tier (data) | `assets/csrp/bestiary/<id>.json` - the `tier` field |
| Growth relations | `entity/ParasiteTransformation.java` - the mod's own evolve/devolve implementation |
| Stage | derived from those proven chains: 1 base, 2 mid, 3 final, 4 nexus IV |
| Names | `assets/csrp/lang/{en_us,zh_cn}.json`, key `entity.csrp.<id>` |

Registered entity ids: **157**. Bestiary entries: **126**.
Creatures (MobCategory `MONSTER`/`CREATURE`): **129**. Excluded as non-creatures: **34**.
Proven relations: **53** - {"evolves-into":22,"devolves-into":6,"nexus-stage-up":9,"evolves-into-random":12,"head-of":1,"deploys":1,"spawns-part":1,"matures-from":1}

| Tier | Count |
|---|---|
| INBORN | 10 |
| CRUDE | 11 |
| PRIMITIVE | 12 |
| ADAPTED | 12 |
| ASSIMILATED | 13 |
| WALKING_HEAD | 10 |
| ASSIMARA | 6 |
| HIJACKED | 3 |
| FERAL | 9 |
| NEXUS | 13 |
| DETERRENT | 5 |
| PURE | 7 |
| PREEMINENT | 8 |
| DERIVED | 2 |
| ANCIENT | 4 |
| ABOMINATION | 2 |
| UNTIERED | 2 |

### INBORN (10)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 1 | `csrp:buglin` | Buglin | 虫灵 | - | code+bestiary |  |
| 1 | `csrp:gnat` | Gnat | 狂疫虫 | EntityAta | code+bestiary |  |
| 1 | `csrp:lice` | Lice | 狂疫飞虫 | EntityViin | code+bestiary |  |
| 2 | `csrp:rupter` | Rupter | 裂兽 | - | code+bestiary |  |
| 3 | `csrp:mangler` | Mangler | 凶裂兽 | EntityNuuh | code+bestiary |  |
| 1 | `csrp:carrier_flying` | Flying Carrier | 飞行母体 | - | code+bestiary |  |
| 1 | `csrp:carrier_heavy` | Heavy Carrier | 重型母体 | - | code+bestiary |  |
| 1 | `csrp:carrier_light` | Light Carrier | 轻型母体 | - | code+bestiary |  |
| 1 | `csrp:movingflesh` | Moving Flesh | 活体肉块 | - | code | no bestiary entry |
| 1 | `csrp:worker` | Worker | 工兽 | EntityKol | code | no bestiary entry |

### CRUDE (11)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 2 | `csrp:crux` | Crux | 烬余兽 | - | code+bestiary |  |
| 1 | `csrp:crux_incomplete` | Incomplete Crux | 未成形烬余兽 | - | code+bestiary |  |
| 1 | `csrp:airscrew` | Airscrew | 悬牵体 | - | code+bestiary |  |
| 1 | `csrp:heed` | Heed | 警戒兽 | - | code+bestiary |  |
| 1 | `csrp:host` | Host | 缠骨柱 | - | code+bestiary |  |
| 2 | `csrp:hostii` | Host II | 缠骷柱 | - | code+bestiary |  |
| 1 | `csrp:incompleteform_medium` | Medium Incomplete Form | 中型未成形寄生体 | - | code+bestiary |  |
| 1 | `csrp:incompleteform_small` | Small Incomplete Form | 小型未成形寄生体 | - | code+bestiary |  |
| 2 | `csrp:thrall` | Thrall | 寄生奴仆 | - | code+bestiary |  |
| 1 | `csrp:dredge` | Dredge | 溺骨妖 | - | code+bestiary |  |
| 1 | `csrp:carrier_worm` | Worm Carrier | 蠕虫载体 | EntityQuac | code | no bestiary entry |

### PRIMITIVE (12)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 2 | `csrp:pri_arachnida` | Primitive Arachnida | 原始蛛形兽 | - | code+bestiary |  |
| 2 | `csrp:pri_bolster` | Primitive Bolster | 原始协增兽 | - | code+bestiary |  |
| 2 | `csrp:pri_burrower` | Primitive Burrower | 原始掘地兽 | - | code+bestiary |  |
| 2 | `csrp:pri_devourer` | Primitive Devourer | 原始吞噬兽 | - | code+bestiary |  |
| 2 | `csrp:pri_longarms` | Primitive Longarms | 原始长臂兽 | - | code+bestiary |  |
| 2 | `csrp:pri_manducater` | Primitive Manducater | 原始咀骨兽 | - | code+bestiary |  |
| 2 | `csrp:pri_reeker` | Primitive Reeker | 原始毒腥兽 | - | code+bestiary |  |
| 2 | `csrp:pri_summoner` | Primitive Summoner | 原始召唤兽 | - | code+bestiary |  |
| 2 | `csrp:pri_tozoon` | Primitive Tozoon | 原始潜地兽 | - | code+bestiary |  |
| 2 | `csrp:pri_vermin` | Primitive Vermin | 原始孕虫兽 | - | code+bestiary |  |
| 2 | `csrp:pri_viscera` | Primitive Viscera | 原始脏腑兽 | EntityGim | code+bestiary |  |
| 2 | `csrp:pri_yelloweye` | Primitive Yelloweye | 原始黄眸兽 | - | code+bestiary |  |

### ADAPTED (12)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 3 | `csrp:ada_arachnida` | Adapted Arachnida | 适应蛛形兽 | - | code+bestiary |  |
| 3 | `csrp:ada_bolster` | Adapted Bolster | 适应协增兽 | - | code+bestiary |  |
| 1 | `csrp:ada_burrower` | Adapted Burrower | 适应掘地兽 | - | code+bestiary |  |
| 1 | `csrp:ada_devourer` | Adapted Devourer | 适应吞噬兽 | - | code+bestiary |  |
| 3 | `csrp:ada_longarms` | Adapted Longarms | 适应长臂兽 | - | code+bestiary |  |
| 3 | `csrp:ada_manducater` | Adapted Manducater | 适应咀骨兽 | - | code+bestiary |  |
| 3 | `csrp:ada_reeker` | Adapted Reeker | 适应毒腥兽 | - | code+bestiary |  |
| 3 | `csrp:ada_summoner` | Adapted Summoner | 适应召唤兽 | - | code+bestiary |  |
| 1 | `csrp:ada_tozoon` | Adapted Tozoon | 适应潜地兽 | - | code+bestiary |  |
| 3 | `csrp:ada_viscera` | Adapted Viscera | 适应脏腑兽 | - | code+bestiary |  |
| 3 | `csrp:ada_yelloweye` | Adapted Yelloweye | 适应黄眸兽 | - | code+bestiary |  |
| 3 | `csrp:ada_vermin` | Adapted Vermin | 适应孕虫兽 | - | code+bestiary |  |

### ASSIMILATED (13)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 1 | `csrp:sim_adventurer` | Assimilated Adventurer | 被同化的冒险者 | - | code+bestiary |  |
| 1 | `csrp:sim_bear` | Assimilated Bear | 被同化的熊 | - | code+bestiary |  |
| 1 | `csrp:sim_bigspider` | Assimilated Big Spider | 被同化的大蜘蛛 | - | code+bestiary |  |
| 1 | `csrp:sim_cow` | Assimilated Cow | 被同化的牛 | - | code+bestiary |  |
| 1 | `csrp:sim_dragone` | Assimilated Ender Dragon | 被同化的末影龙 | - | code+bestiary |  |
| 1 | `csrp:sim_enderman` | Assimilated Enderman | 被同化的末影人 | - | code+bestiary |  |
| 1 | `csrp:sim_horse` | Assimilated Horse | 被同化的马 | - | code+bestiary |  |
| 1 | `csrp:sim_human` | Assimilated Human | 被同化的人类 | - | code+bestiary |  |
| 1 | `csrp:sim_pig` | Assimilated Pig | 被同化的猪 | - | code+bestiary |  |
| 1 | `csrp:sim_sheep` | Assimilated Sheep | 被同化的羊 | - | code+bestiary |  |
| 1 | `csrp:sim_squid` | Assimilated Squid | 被同化的鱿鱼 | - | code+bestiary |  |
| 1 | `csrp:sim_villager` | Assimilated Villager | 被同化的村民 | - | code+bestiary |  |
| 1 | `csrp:sim_wolf` | Assimilated Wolf | 被同化的狼 | - | code+bestiary |  |

### WALKING_HEAD (10)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 1 | `csrp:sim_cowhead` | Walking Cow Head | 行走牛头颅 | - | code+bestiary |  |
| 1 | `csrp:sim_endermanhead` | Walking Enderman Head | 行走末影人头颅 | - | code+bestiary |  |
| 1 | `csrp:sim_horsehead` | Walking Horse Head | 行走马头颅 | - | code+bestiary |  |
| 1 | `csrp:sim_humanhead` | Walking Human Head | 行走人类头颅 | - | code+bestiary |  |
| 1 | `csrp:sim_pighead` | Walking Pig Head | 行走猪头颅 | - | code+bestiary |  |
| 1 | `csrp:sim_sheephead` | Walking Sheep Head | 行走羊头颅 | - | code+bestiary |  |
| 1 | `csrp:sim_villagerhead` | Walking Villager Head | 行走村民头颅 | - | code+bestiary |  |
| 1 | `csrp:sim_wolfhead` | Walking Wolf Head | 行走狼头颅 | - | code+bestiary |  |
| 1 | `csrp:sim_adventurerhead` | Walking Adventurer Head | 行走冒险者头颅 | - | code+bestiary |  |
| 1 | `csrp:sim_dragonehead` | Walking Ender Dragon Head | 行走龙首 | - | code+bestiary |  |

### ASSIMARA (6)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 1 | `csrp:mar_bear` | Marauderized Bear | 诡化熊 | - | code+bestiary |  |
| 1 | `csrp:mar_cow` | Marauderized Cow | 诡化牛 | - | code+bestiary |  |
| 1 | `csrp:mar_enderman` | Marauderized Enderman | 诡化末影人 | - | code+bestiary |  |
| 1 | `csrp:mar_human` | Marauderized Human | 诡化人类 | - | code+bestiary |  |
| 1 | `csrp:mar_sheep` | Marauderized Sheep | 诡化羊 | - | code+bestiary |  |
| 1 | `csrp:mar_villager` | Marauderized Villager | 诡化村民 | - | code+bestiary |  |

### HIJACKED (3)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 1 | `csrp:hi_blaze` | Hijacked Blaze | 被操纵的烈焰人 | - | code+bestiary |  |
| 1 | `csrp:hi_golem` | Hijacked Golem | 被操纵的铁傀儡 | - | code+bestiary |  |
| 1 | `csrp:hi_skeleton` | Hijacked Skeleton | 被操纵的骷髅 | - | code+bestiary |  |

### FERAL (9)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 2 | `csrp:fer_bear` | Feral Bear | 狂化熊 | - | code+bestiary |  |
| 2 | `csrp:fer_cow` | Feral Cow | 狂化牛 | - | code+bestiary |  |
| 2 | `csrp:fer_enderman` | Feral Enderman | 狂化末影人 | - | code+bestiary |  |
| 2 | `csrp:fer_horse` | Feral Horse | 狂化马 | - | code+bestiary |  |
| 2 | `csrp:fer_human` | Feral Human | 狂化人类 | - | code+bestiary |  |
| 2 | `csrp:fer_pig` | Feral Pig | 狂化猪 | - | code+bestiary |  |
| 2 | `csrp:fer_sheep` | Feral Sheep | 狂化羊 | - | code+bestiary |  |
| 2 | `csrp:fer_villager` | Feral Villager | 狂化村民 | - | code+bestiary |  |
| 1 | `csrp:fer_wolf` | Feral Wolf | 狂化狼 | - | code+bestiary |  |

### NEXUS (13)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 1 | `csrp:beckon_si` | Stage I Beckon | I阶召唤柱 | - | code+bestiary |  |
| 2 | `csrp:beckon_sii` | Stage II Beckon | II阶召唤柱 | - | code+bestiary |  |
| 3 | `csrp:beckon_siii` | Stage III Beckon | III阶召唤柱 | - | code+bestiary |  |
| 4 | `csrp:beckon_siv` | Stage IV Beckon | IV阶召唤柱 | - | code+bestiary |  |
| 1 | `csrp:dispatcher_si` | Stage I Dispatcher | I阶调度柱 | - | code+bestiary |  |
| 2 | `csrp:dispatcher_sii` | Stage II Dispatcher | II阶调度柱 | - | code+bestiary |  |
| 3 | `csrp:dispatcher_siii` | Stage III Dispatcher | III阶调度柱 | - | code+bestiary |  |
| 4 | `csrp:dispatcher_siv` | Stage IV Dispatcher | IV阶调度柱 | - | code+bestiary |  |
| 1 | `csrp:rooter_si` | Stage I Rooter | I阶支庇柱 | - | code+bestiary |  |
| 2 | `csrp:rooter_sii` | Stage II Rooter | II阶支庇柱 | - | code+bestiary |  |
| 3 | `csrp:rooter_siii` | Stage III Rooter | III阶支庇柱 | - | code+bestiary |  |
| 4 | `csrp:rooter_siv` | Stage IV Rooter | IV阶支庇柱 | - | code+bestiary |  |
| 1 | `csrp:rooterball` | Rootmass Cyst | 支庇柱囊块 | - | code+bestiary |  |

### DETERRENT (5)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 1 | `csrp:dispatcherten` | Dispatcher Tentacle | 调度柱触须 | - | code+bestiary | **CONFLICT** code NEXUS vs bestiary DETERRENT |
| 1 | `csrp:kyphosis` | Kyphosis | 曲击柱 | - | code+bestiary |  |
| 1 | `csrp:seizer` | Seizer | 缠缚触手 | - | code+bestiary |  |
| 1 | `csrp:sentry` | Sentry | 哨戒爪 | - | code+bestiary |  |
| 1 | `csrp:worm` | Worm | 侵袭蠕虫 | - | code+bestiary |  |

### PURE (7)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 1 | `csrp:grunt` | Grunt | 步行兽 | - | code+bestiary |  |
| 1 | `csrp:bomber_light` | Light Bomber | 轻型轰炸兽 | - | code+bestiary |  |
| 1 | `csrp:marauder` | Marauder | 掠夺兽 | EntityEsor | code+bestiary |  |
| 1 | `csrp:monarch` | Monarch | 统御兽  | - | code+bestiary |  |
| 1 | `csrp:overseer` | Overseer | 监察兽 | - | code+bestiary |  |
| 1 | `csrp:vigilante` | Vigilante | 巡兽 | - | code+bestiary |  |
| 1 | `csrp:warden` | Warden | 看守兽 | - | code+bestiary |  |

### PREEMINENT (8)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 1 | `csrp:bogle` | Bogle | 怖怪体 | - | code+bestiary |  |
| 1 | `csrp:carrier_colony` | Colony Carrier | 聚生载体 | - | code+bestiary |  |
| 1 | `csrp:haunter` | Haunter | 逐猎兽 | - | code+bestiary |  |
| 1 | `csrp:bomber_heavy` | Heavy Bomber | 重型轰炸兽 | - | code+bestiary |  |
| 1 | `csrp:wraith` | Wraith | 幽鬼体 | - | code+bestiary |  |
| 1 | `csrp:succor` | Succor | 援助泡 | EntityFlam | code+bestiary |  |
| 1 | `csrp:architect` | Architect | 构筑体 | EntityTenn | code | no bestiary entry |
| 1 | `csrp:seeker` | Seeker | 追迹兽 | - | code | no bestiary entry |

### DERIVED (2)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 1 | `csrp:draconite` | Draconite | §9邪狱龙 | - | code+bestiary |  |
| 1 | `csrp:kirin` | Kirin | §9踏虚体 | - | code+bestiary |  |

### ANCIENT (4)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 1 | `csrp:anc_dreadnaut` | Ancient Dreadnaut | 远古惧魔 | - | code+bestiary |  |
| 1 | `csrp:anc_overlord` | Ancient Overlord | 远古君魔 | - | code+bestiary |  |
| 1 | `csrp:anc_dreadnaut_ten` | Ancient Dreadnaut Tendril | 远古惧魔触须 | EntityOroncoTen | code | no bestiary entry |
| 1 | `csrp:anc_pod` | Ancient Drop Pod | 空投吊舱 | EntityDropPod | code | no bestiary entry |

### ABOMINATION (2)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 1 | `csrp:abo_bodies` | Many Bodies | 缀合多体 | - | bestiary |  |
| 1 | `csrp:abo_head` | Giant Head | 巨型头颅 | - | bestiary |  |

### UNTIERED (2)

| Stage | Source ID | English | Chinese | SRP class | Tier source | Notes |
|---|---|---|---|---|---|---|
| 1 | `csrp:sim_dragonhead` | Walking Ender Dragon Head | 行走龙首 | - |  | no bestiary entry |
| 1 | `csrp:marauder_tendril` | Marauder Tendril | 掠夺者触手 | - |  | no bestiary entry |

## Proven growth relations

Parsed out of `ParasiteTransformation.java`, which is the mod's own evolve/devolve code.

### evolves-into (22)

- `csrp:buglin` -> `csrp:rupter`
- `csrp:rupter` -> `csrp:mangler`
- `csrp:sim_adventurer` -> `csrp:thrall`
- `csrp:host` -> `csrp:hostii`
- `csrp:crux_incomplete` -> `csrp:crux`
- `csrp:sim_bear` -> `csrp:fer_bear`
- `csrp:sim_cow` -> `csrp:fer_cow`
- `csrp:sim_enderman` -> `csrp:fer_enderman`
- `csrp:sim_horse` -> `csrp:fer_horse`
- `csrp:sim_human` -> `csrp:fer_human`
- `csrp:sim_pig` -> `csrp:fer_pig`
- `csrp:sim_sheep` -> `csrp:fer_sheep`
- `csrp:sim_villager` -> `csrp:fer_villager`
- `csrp:pri_arachnida` -> `csrp:ada_arachnida`
- `csrp:pri_bolster` -> `csrp:ada_bolster`
- `csrp:pri_longarms` -> `csrp:ada_longarms`
- `csrp:pri_manducater` -> `csrp:ada_manducater`
- `csrp:pri_reeker` -> `csrp:ada_reeker`
- `csrp:pri_summoner` -> `csrp:ada_summoner`
- `csrp:pri_vermin` -> `csrp:ada_vermin`
- `csrp:pri_viscera` -> `csrp:ada_viscera`
- `csrp:pri_yelloweye` -> `csrp:ada_yelloweye`

### devolves-into (6)

- `csrp:rupter` -> `csrp:buglin`
- `csrp:mangler` -> `csrp:rupter`
- `csrp:thrall` -> `csrp:sim_adventurer`
- `csrp:hostii` -> `csrp:host`
- `csrp:crux` -> `csrp:crux_incomplete`
- `csrp:ada_vermin` -> `csrp:movingflesh`

### nexus-stage-up (9)

- `csrp:beckon_si` -> `csrp:beckon_sii`
- `csrp:beckon_sii` -> `csrp:beckon_siii`
- `csrp:beckon_siii` -> `csrp:beckon_siv`
- `csrp:dispatcher_si` -> `csrp:dispatcher_sii`
- `csrp:dispatcher_sii` -> `csrp:dispatcher_siii`
- `csrp:dispatcher_siii` -> `csrp:dispatcher_siv`
- `csrp:rooter_si` -> `csrp:rooter_sii`
- `csrp:rooter_sii` -> `csrp:rooter_siii`
- `csrp:rooter_siii` -> `csrp:rooter_siv`

### evolves-into-random (12)

- `csrp:movingflesh` -> `csrp:pri_longarms`
- `csrp:movingflesh` -> `csrp:pri_summoner`
- `csrp:movingflesh` -> `csrp:pri_vermin`
- `csrp:movingflesh` -> `csrp:pri_viscera`
- `csrp:movingflesh` -> `csrp:pri_arachnida`
- `csrp:movingflesh` -> `csrp:pri_bolster`
- `csrp:movingflesh` -> `csrp:pri_burrower`
- `csrp:movingflesh` -> `csrp:pri_devourer`
- `csrp:movingflesh` -> `csrp:pri_manducater`
- `csrp:movingflesh` -> `csrp:pri_reeker`
- `csrp:movingflesh` -> `csrp:pri_tozoon`
- `csrp:movingflesh` -> `csrp:pri_yelloweye`

### head-of (1)

- `csrp:sim_cowhead` -> `csrp:sim_cow`

### deploys (1)

- `csrp:anc_pod` -> `csrp:anc_dreadnaut`

### spawns-part (1)

- `csrp:anc_dreadnaut` -> `csrp:anc_dreadnaut_ten`

### matures-from (1)

- `csrp:incompleteform_small` -> `csrp:incompleteform_medium`

## Conflicts and open questions

### csrp:dispatcherten (Dispatcher Tentacle)

- Version A: bestiary says `DETERRENT`, and the user-provided whitelist also files Dispatcher Tentacle under Deterrent Parasites
- Version B: `RelayScanReportFactory.Tier` says `NEXUS`
- Adopted: `DETERRENT` - two independent sources agree, the code enum is the outlier.
- No third behaviour is invented.

### Untiered creatures

Registered, real creatures, but neither tier source mentions them. Marked 【待核实】 and NOT designed.

- `csrp:sim_dragonhead` Walking Ender Dragon Head - MONSTER
- `csrp:marauder_tendril` Marauder Tendril - MONSTER

### Bestiary entries with no entity

`smar_bear`, `smar_cow`, `smar_enderman`, `smar_human`, `smar_sheep`, `smar_villager` have bestiary files
but **no registered entity and no localized name**. There is nothing to point at, so they are not designed.
The similarly named `mar_*` (ASSIMARA) set does exist and is used instead.

### Naming notes

- `carrier_worm` is named Carrier but `CarrierWormEntity extends BurrowingVariantEntity`: it has no fuse, no
  detonation and no toxic cloud. It is a burrower and is designed as one.
- `movingflesh` is listed under INBORN in the tier enum but `MovingFleshEntity extends CrudeParasiteEntity`.
- `lice` carries the javadoc *"SRP 1.10.7 EntityViin: the short-lived flying vermin dropped by adapted Vermin"*,
  i.e. the SRP-internal name is Viin while the CSRP id is `lice`.

## Excluded: not creatures

`csrp:antiinfestedblock`, `csrp:biomass`, `csrp:bomb`, `csrp:cloudtoxic`, `csrp:crux_block_damage`, `csrp:dragon_egg_assimilation`, `csrp:gore`, `csrp:haunter_damage`, `csrp:haunter_homing`, `csrp:homming`, `csrp:kirin_slash`, `csrp:meteor`, `csrp:nade`, `csrp:orbboom`, `csrp:orbscary`, `csrp:orbvoid`, `csrp:parasite_projectile`, `csrp:pulling_ball`, `csrp:pullingball`, `csrp:remain`, `csrp:scary_orb`, `csrp:scent`, `csrp:shockwave`, `csrp:smar_bear`, `csrp:smar_cow`, `csrp:smar_enderman`, `csrp:smar_human`, `csrp:smar_sheep`, `csrp:smar_villager`, `csrp:source`, `csrp:tendril`, `csrp:warden_waveshock`, `csrp:wave`, `csrp:waveshock`

