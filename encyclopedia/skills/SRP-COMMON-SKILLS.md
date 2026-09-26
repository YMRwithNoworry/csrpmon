# SRP Common Skill Database

A pool of **66** skills shared across the SRP Pokemon. Every one derives from a
mechanic that provably exists in CSRP 1.10.8 - the 28 mob effects in `registry/ModMobEffects.java`,
the entity behaviours, and the infection/adaptation systems. Nothing here invents an SRP creature.

## Permission model

每个技能有三重约束：tiers（哪些 Tier 可学）、minStage（最低形态阶段：1 基础/2 中间/3 最终/4 巢穴 IV）、denied（明确排除者）。stage 由 relationships.json 中已被证明的成长链推导。 另外，B. 适应系的全部技能受 speciesGate 约束：只有源码中 supportsDamageAdaptation() 返回 true 的生物可学——这是 Species Restriction 的机器化实现。 被感染的宿主层级（ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL）共享 INBORN 与 CRUDE 的基础工具集，因为它们本身就是寄生宿主。 传送系技能以 ASSIMILATED 的同化末影人为原型。

| Axis | Meaning |
|---|---|
| `tiers` | which tiers may learn it |
| `minStage` | lowest form stage: 1 base, 2 mid, 3 final, 4 nexus stage IV |
| `denied` | who is explicitly excluded, and why |

## Confirmed SRP effects used as sources

`coth` (Call Of The Hive), `bleed`, `viral`, `corrosion`, `corrosive`, `rage`, `needler`, `link`,
`fear`, `feral`, `repel`, `primitive`, `adapted`, `pure`, `crude`, `nexus`, `dod_smoke_trail`,
`thornshade_thorns`, `antimall`, `distorted_enlightenment`, `vomit`, `senses`, `prey`, `debar`,
`foster`, `pivot`, `jugg`, `parate`.

| Category | Skills |
|---|---|
| A. 感染系 | 8 |
| B. 适应系 | 6 |
| C. 流血系 | 4 |
| D. 腐蚀系 | 5 |
| E. 病毒系 | 3 |
| F. 恐惧系 | 4 |
| G. 针刺系 | 4 |
| H. 饥饿系 | 3 |
| I. 迟滞系 | 3 |
| J. 成长掠夺系 | 2 |
| K. 狂怒系 | 3 |
| L. 伪装系 | 2 |
| M. 寄生球系 | 3 |
| N. 召唤系 | 3 |
| O. 再生系 | 2 |
| P. 空间系 | 2 |
| Q. 场地系 | 2 |
| R. 水域系 | 2 |
| S. 特殊状态系 | 5 |

## A. 感染系 (8)

### 寄生接触 / Parasitic Contact

- **ID**: `parasiticcontact`
- **来源机制**: Call Of The Hive (mob effect `coth`)
- **适用 Tier**: INBORN, CRUDE, PRIMITIVE, ADAPTED, PURE, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 虫 / 物理
- **威力 / 命中 / PP**: 40 / 100 / 25
- **效果**: 接触并把巢群信号注入目标。命中后目标获得 1 层【感染】。若使用者连续两回合对同一目标使用，层数再 +1（同一招式的连击计数从 SRP 的持续接触时间转化而来）。
- **叠层机制**: 感染 1~3 层：每层在回合结束时损失 1/16 最大 HP；3 层时目标无法被替换下场一回合。
- **冷却机制**: 无
- **视觉表现**: 口器接触处渗出黑色丝状物并短暂连向使用者。
- **不能学习者**: ASSIMILATED / WALKING_HEAD / HIJACKED / FERAL / NEXUS / ANCIENT / DERIVED 不学习——它们不靠接触传播。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 感染撕咬 / Infecting Bite

- **ID**: `infectingbite`
- **来源机制**: Call Of The Hive + 寄生体近战撕咬
- **适用 Tier**: INBORN, CRUDE, PRIMITIVE, ADAPTED, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 虫 / 物理
- **威力 / 命中 / PP**: 65 / 95 / 20
- **效果**: 造成伤害后有 50% 概率附加 1 层【感染】。目标已中毒时改为附加 2 层。
- **叠层机制**: 与寄生接触共用感染层数。
- **冷却机制**: 无
- **视觉表现**: 咬合瞬间从伤口喷出细小孢子。
- **不能学习者**: NEXUS / ANCIENT / DERIVED。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 群巢传播 / Hive Spread

- **ID**: `hivespread`
- **来源机制**: Call Of The Hive 的群体扩散
- **适用 Tier**: CRUDE, PRIMITIVE, ADAPTED, PURE, PREEMINENT, NEXUS, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 虫 / 变化
- **威力 / 命中 / PP**: - / 100 / 10
- **效果**: 把使用者身上的【感染】层数原样复制给对手全队（双打时复制给两个对手），层数上限 2。
- **叠层机制**: 传播不叠加，只取较高者。
- **冷却机制**: 3 回合
- **视觉表现**: 一圈可见的孢子波从使用者脚下扩散出去。
- **不能学习者**: INBORN 低阶（buglin/gnat/lice）只能通过寄生接触传播，不学此招。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 感染脉冲 / Infection Pulse

- **ID**: `infectionpulse`
- **来源机制**: Call Of The Hive 的范围脉冲
- **适用 Tier**: PRIMITIVE, ADAPTED, PURE, PREEMINENT, NEXUS, ANCIENT
- **属性 / 类别**: 毒 / 特殊
- **威力 / 命中 / PP**: 70 / 100 / 15
- **效果**: 对场上所有其他宝可梦造成伤害；对已带【感染】的目标额外造成 1 层。
- **叠层机制**: 命中后 +1 层。
- **冷却机制**: 2 回合
- **视觉表现**: 以使用者为圆心的黑色脉冲环。
- **不能学习者**: INBORN / ASSIMILATED / HIJACKED。

### 寄生孢子 / Parasitic Spores

- **ID**: `parasiticspores`
- **来源机制**: Call Of The Hive 的持续传播
- **适用 Tier**: CRUDE, PRIMITIVE, ADAPTED, NEXUS, PREEMINENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 草 / 变化
- **威力 / 命中 / PP**: - / 90 / 15
- **效果**: 布下孢子场地，持续 4 回合。每回合结束时场上所有非使用者阵营的宝可梦获得 1 层【感染】。
- **叠层机制**: 每回合 +1 层，上限 3。
- **冷却机制**: 场地消失前不能再次使用
- **视觉表现**: 地面浮现暗绿色孢子云。
- **不能学习者**: ASSIMILATED / WALKING_HEAD / HIJACKED / FERAL（它们是宿主，不是播种者）。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 巢母呼唤 / Hive Mother Call

- **ID**: `hivemothercall`
- **来源机制**: Call Of The Hive 的召唤面向
- **适用 Tier**: NEXUS, PREEMINENT, ANCIENT
- **属性 / 类别**: 虫 / 变化
- **威力 / 命中 / PP**: - / 必中 / 5
- **效果**: 呼叫巢群：所有场上对手获得 2 层【感染】，且使用者的召唤类招式冷却立即减少 2 回合。
- **叠层机制**: +2 层。
- **冷却机制**: 5 回合
- **视觉表现**: 天空中出现向下收束的丝线。
- **不能学习者**: 非 Nexus/Preeminent/Ancient 一律不学——召唤权限由生态位决定。

### 病毒注入 / Virus Inject

- **ID**: `virusinject`
- **来源机制**: mob effect `viral`
- **适用 Tier**: PRIMITIVE, ADAPTED, PURE, PREEMINENT, NEXUS, ANCIENT, DERIVED
- **属性 / 类别**: 毒 / 变化
- **威力 / 命中 / PP**: - / 95 / 10
- **效果**: 目标最大 HP 的 1/8 被"侵蚀"（本场战斗内视为损失，不影响战后恢复），并立即失去等量当前 HP 的 1/2。
- **叠层机制**: 可叠加，最多 3 次。
- **冷却机制**: 3 回合
- **视觉表现**: 注射部位出现黑色血管纹路。
- **不能学习者**: INBORN / CRUDE / ASSIMILATED / WALKING_HEAD / HIJACKED / FERAL / DETERRENT。

### 感染标记 / Infection Mark

- **ID**: `infectionmark`
- **来源机制**: Call Of The Hive 的标记面向
- **适用 Tier**: INBORN, CRUDE, PRIMITIVE, ADAPTED, PURE, NEXUS, PREEMINENT, ANCIENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 虫 / 变化
- **威力 / 命中 / PP**: - / 100 / 20
- **效果**: 标记目标 3 回合：本阵营对其造成的虫/毒属性伤害 +25%，且其身上的【感染】不会被清除。
- **叠层机制**: 重复使用只刷新回合数。
- **冷却机制**: 无
- **视觉表现**: 目标身上出现悬浮的红色巢群印记。
- **不能学习者**: 无——INBORN 是巢群的前哨，本来就负责替后续单位指认目标。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。
- **备注**: v2 修正：原本禁止 INBORN 学习，但校验器发现虫崽兽的设计里用到了它。INBORN 作为巢群前哨指认目标是其生态职责，因此放开。

## B. 适应系 (6)

### 适应学习 / Adaptive Learning

- **ID**: `adaptivelearning`
- **来源机制**: Adaptation system（Primitive→Adapted 的针对性进化）
- **适用 Tier**: CRUDE, INBORN, PRIMITIVE, ADAPTED, PURE, PREEMINENT, ANCIENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 超能 / 变化
- **威力 / 命中 / PP**: - / 必中 / 20
- **效果**: 记录本场战斗中最后一次受到攻击的属性。之后受到同属性攻击时伤害减少 20%。只保留最新记录的属性。
- **叠层机制**: 单层记录，可被新属性覆盖。
- **冷却机制**: 无
- **视觉表现**: 使用者体表短暂浮现该属性颜色的纹路。
- **不能学习者**: INBORN / CRUDE / ASSIMILATED / WALKING_HEAD / HIJACKED / FERAL / NEXUS / DERIVED 不学——只有带 Adaptation 能力的种类才有。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 损伤分析 / Damage Analysis

- **ID**: `damageanalysis`
- **来源机制**: Adaptation system
- **适用 Tier**: CRUDE, INBORN, PRIMITIVE, ADAPTED, PURE, PREEMINENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 超能 / 变化
- **威力 / 命中 / PP**: - / 必中 / 15
- **效果**: 查看对手的招式表与最高威力招式，并使自己在下一回合受到的第一次攻击伤害减少 30%。
- **叠层机制**: 不叠加。
- **冷却机制**: 2 回合
- **视觉表现**: 使用者眼中的复眼结构高速对焦。
- **不能学习者**: INBORN / NEXUS / ANCIENT / DERIVED。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 快速适应 / Rapid Adaptation

- **ID**: `rapidadaptation`
- **来源机制**: Adaptation system 的加速版本（Adapted 相较 Primitive 的强化）
- **适用 Tier**: CRUDE, INBORN, ADAPTED, PREEMINENT, ANCIENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 超能 / 变化
- **威力 / 命中 / PP**: - / 必中 / 10
- **效果**: 立即获得"适应学习"的一次记录，且本回合受到的伤害减少 25%。Adapted 系使用时可同时保留两条记录。
- **叠层机制**: 最多 2 条记录（仅 Adapted 及以上）。
- **冷却机制**: 3 回合
- **视觉表现**: 体表纹路瞬间全部点亮。
- **不能学习者**: PRIMITIVE 只能学适应学习，不能学快速适应——这是 Primitive→Adapted 的技能层级分界。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 抗性记录 / Resistance Record

- **ID**: `resistancelog`
- **来源机制**: Adaptation system
- **适用 Tier**: CRUDE, INBORN, ADAPTED, PURE, PREEMINENT, ANCIENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 钢 / 变化
- **威力 / 命中 / PP**: - / 必中 / 10
- **效果**: 把已记录的属性和自身防御绑定：只要记录存在，自身防御 +1 阶段，且受到该属性的伤害再减少 10%。
- **叠层机制**: 与适应学习叠加，最多减伤 30%。
- **冷却机制**: 4 回合
- **视觉表现**: 外壳析出对应属性的结晶层。
- **不能学习者**: PRIMITIVE / NEXUS。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 战斗进化 / Combat Evolution

- **ID**: `combatevolution`
- **来源机制**: Adaptation system 的战场即时进化
- **适用 Tier**: CRUDE, INBORN, ADAPTED, PREEMINENT, ANCIENT, DERIVED, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 超能 / 变化
- **威力 / 命中 / PP**: - / 必中 / 5
- **效果**: 消耗已记录的所有适应条目，每消耗一条提升攻击与特攻各 1 阶段。无记录时该招式失败。
- **叠层机制**: 消耗型，不叠加。
- **冷却机制**: 5 回合
- **视觉表现**: 全身寄生组织重新排列并膨胀。
- **不能学习者**: INBORN / ASSIMILATED / HIJACKED / FERAL / NEXUS。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 适应重构 / Adaptive Rebuild

- **ID**: `adaptiverebuild`
- **来源机制**: Adaptation system 的修复面向
- **适用 Tier**: CRUDE, INBORN, ADAPTED, PREEMINENT, ANCIENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 超能 / 变化
- **威力 / 命中 / PP**: - / 必中 / 10
- **效果**: 恢复最大 HP 的 25%，并清除自身所有能力下降。若已记录适应属性，改为恢复 35%。
- **叠层机制**: 不叠加。
- **冷却机制**: 3 回合
- **视觉表现**: 伤口被快速生长的寄生组织填满。
- **不能学习者**: INBORN / CRUDE / PRIMITIVE。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

## C. 流血系 (4)

### 裂创 / Laceration

- **ID**: `laceration`
- **来源机制**: mob effect `bleed`
- **适用 Tier**: INBORN, CRUDE, PRIMITIVE, ADAPTED, PURE, PREEMINENT, ANCIENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 一般 / 物理
- **威力 / 命中 / PP**: 55 / 100 / 25
- **效果**: 命中后使目标流血 3 回合。流血期间目标每回合结束损失 1/16 最大 HP；**目标在本回合使用过切换或加速类招式时，该回合流血伤害翻倍**。
- **叠层机制**: 流血层数 1~3，每层 +1/16。
- **冷却机制**: 无
- **视觉表现**: 伤口处持续滴落暗红色粒子。
- **不能学习者**: 无特殊限制——流血是 SRP 最基础的伤害机制之一。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 深度撕裂 / Deep Laceration

- **ID**: `deeplaceration`
- **来源机制**: mob effect `bleed` 的高阶形态
- **适用 Tier**: INBORN, PRIMITIVE, ADAPTED, PURE, PREEMINENT, ANCIENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL（需第 2 阶段）
- **属性 / 类别**: 恶 / 物理
- **威力 / 命中 / PP**: 80 / 90 / 15
- **效果**: 直接附加 2 层流血；若目标已流血，改为 +2 层并使其速度下降 1 阶段。
- **叠层机制**: +2 层。
- **冷却机制**: 2 回合
- **视觉表现**: 三道深可见骨的爪痕。
- **不能学习者**: INBORN 只能学裂创。
- **矩阵修正记录**: 深度撕裂比裂创更深，只有体型增大的第二形态以上才能造成。 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 血流加速 / Blood Rush

- **ID**: `bloodrush`
- **来源机制**: bleed 与移动创伤的组合
- **适用 Tier**: CRUDE, PRIMITIVE, ADAPTED, FERAL, PURE, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED
- **属性 / 类别**: 恶 / 变化
- **威力 / 命中 / PP**: - / 100 / 15
- **效果**: 把目标已流血的层数翻倍（上限 3），并使目标速度提升 1 阶段——层数越高，其移动带来的额外流血伤害越重。
- **叠层机制**: 翻倍叠层。
- **冷却机制**: 2 回合
- **视觉表现**: 目标身上血雾变浓。
- **不能学习者**: NEXUS / ANCIENT / DERIVED。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 撕裂追击 / Rending Pursuit

- **ID**: `rendingpursuit`
- **来源机制**: SRP 追猎行为 + bleed
- **适用 Tier**: INBORN, CRUDE, PRIMITIVE, ADAPTED, FERAL, PURE, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED
- **属性 / 类别**: 恶 / 物理
- **威力 / 命中 / PP**: 50 / 100 / 20
- **效果**: 先制 +1。若目标身上有流血层数，威力提升为 50×(1+层数×0.5)；目标替换下场时该招式在入场者身上立即再结算一次流血伤害。
- **叠层机制**: 不叠层，只吃层数加成。
- **冷却机制**: 无
- **视觉表现**: 残影扑击，落点留下血痕。
- **不能学习者**: NEXUS / ANCIENT / DETERRENT。
- **矩阵修正记录**: 矩阵修正：原本只列 INBORN 与更高阶，漏了夹在中间的 CRUDE。CRUDE 处于 INBORN 之上，不可能反而失去这个基础追击招式。 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

## D. 腐蚀系 (5)

### 腐蚀撕咬 / Corrosive Bite

- **ID**: `corrosivebite`
- **来源机制**: mob effect `corrosion` / `corrosive`
- **适用 Tier**: INBORN, CRUDE, PRIMITIVE, ADAPTED, PURE, PREEMINENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 毒 / 物理
- **威力 / 命中 / PP**: 60 / 95 / 20
- **效果**: 命中后使目标防御下降 1 阶段，并附加【腐蚀】2 回合。
- **叠层机制**: 腐蚀叠至 3 层时目标防御额外 -1。
- **冷却机制**: 无
- **视觉表现**: 咬痕边缘冒酸雾。
- **不能学习者**: ANCIENT / DERIVED 不学——它们改用装甲溶解。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 酸蚀喷射 / Acid Spray

- **ID**: `acidspray`
- **来源机制**: corrosion 的远程投射形态
- **适用 Tier**: PRIMITIVE, ADAPTED, PURE, PREEMINENT, NEXUS
- **属性 / 类别**: 毒 / 特殊
- **威力 / 命中 / PP**: 50 / 100 / 20
- **效果**: 对全体对手造成伤害并各降 1 阶段特防。
- **叠层机制**: 特防下降可叠加至 -3。
- **冷却机制**: 2 回合
- **视觉表现**: 扇形酸雾喷出，地面留下腐蚀斑。
- **不能学习者**: INBORN / ASSIMILATED / HIJACKED / FERAL / ANCIENT。

### 装甲溶解 / Armour Dissolve

- **ID**: `armordissolve`
- **来源机制**: corrosion 对护甲的针对性
- **适用 Tier**: ADAPTED, PURE, PREEMINENT, ANCIENT, DERIVED
- **属性 / 类别**: 毒 / 变化
- **威力 / 命中 / PP**: - / 90 / 10
- **效果**: 目标防御与特防各下降 2 阶段；若目标为钢属性，改为各下降 3 阶段并无法在本场战斗内恢复防御。
- **叠层机制**: 大幅叠层。
- **冷却机制**: 4 回合
- **视觉表现**: 目标外壳出现蜂窝状溶解孔。
- **不能学习者**: 低阶一律不学。

### 腐蚀标记 / Corrosion Mark

- **ID**: `corrosionmark`
- **来源机制**: corrosion 的标记面向
- **适用 Tier**: CRUDE, PRIMITIVE, ADAPTED, PURE, NEXUS, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 毒 / 变化
- **威力 / 命中 / PP**: - / 100 / 15
- **效果**: 标记目标 3 回合：其受到的钢/岩属性抗性视作不存在（弱点照常计算），且每回合结束防御 -1 阶段（最多 -3）。
- **叠层机制**: 刷新回合数。
- **冷却机制**: 无
- **视觉表现**: 目标脚下出现环形腐蚀符。
- **不能学习者**: 与装甲溶解互斥，学会其一即不能学另一。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 腐殖爆裂 / Humic Burst

- **ID**: `humicburst`
- **来源机制**: corrosion + 巢群生物质
- **适用 Tier**: PRIMITIVE, ADAPTED, PURE, PREEMINENT, ANCIENT, NEXUS
- **属性 / 类别**: 毒 / 特殊
- **威力 / 命中 / PP**: 90 / 85 / 10
- **效果**: 造成伤害；若目标带有【腐蚀】层数，每层使威力 +20，并立即消耗全部腐蚀层数。
- **叠层机制**: 消耗型。
- **冷却机制**: 3 回合
- **视觉表现**: 体内生物质鼓胀后炸开，溅出酸液。
- **不能学习者**: INBORN / ASSIMILATED / WALKING_HEAD / HIJACKED / FERAL。

## E. 病毒系 (3)

### 生命侵蚀 / Life Erosion

- **ID**: `lifeerosion`
- **来源机制**: mob effect `viral`
- **适用 Tier**: PRIMITIVE, ADAPTED, PURE, PREEMINENT, ANCIENT, DERIVED
- **属性 / 类别**: 幽灵 / 特殊
- **威力 / 命中 / PP**: 60 / 100 / 15
- **效果**: 造成伤害，并把伤害的 30% 转化为"侵蚀量"：目标本场战斗最大 HP 上限按侵蚀量下降（最多下降 25%）。
- **叠层机制**: 侵蚀量累加，上限 25%。
- **冷却机制**: 2 回合
- **视觉表现**: 目标体表浮现病毒状黑色纹路并蔓延。
- **不能学习者**: INBORN / CRUDE / ASSIMILATED / WALKING_HEAD / HIJACKED / FERAL / DETERRENT / NEXUS。

### 病毒增幅 / Viral Amplification

- **ID**: `viralamp`
- **来源机制**: viral 的传染放大
- **适用 Tier**: ADAPTED, PURE, PREEMINENT, ANCIENT
- **属性 / 类别**: 幽灵 / 变化
- **威力 / 命中 / PP**: - / 必中 / 10
- **效果**: 自身每损失 25% 最大 HP，特攻 +1 阶段；同时把已有的"侵蚀量"翻倍。
- **叠层机制**: 侵蚀量翻倍，上限 25%。
- **冷却机制**: 4 回合
- **视觉表现**: 使用者体表的病毒纹路亮起并向外扩散。
- **不能学习者**: INBORN / PRIMITIVE。

### 病毒爆发 / Viral Outbreak

- **ID**: `viraloutbreak`
- **来源机制**: viral 的爆发结算
- **适用 Tier**: PREEMINENT, ANCIENT, DERIVED, ADAPTED
- **属性 / 类别**: 幽灵 / 特殊
- **威力 / 命中 / PP**: 110 / 90 / 5
- **效果**: 把目标身上全部"侵蚀量"一次性引爆，造成威力 110 + 侵蚀量百分比×4 的伤害，然后清除侵蚀量。
- **叠层机制**: 消耗型。
- **冷却机制**: 5 回合
- **视觉表现**: 目标全身病毒纹路同时炸开。
- **不能学习者**: 低阶与 Nexus 族不学。

## F. 恐惧系 (4)

### 恐惧凝视 / Fear Gaze

- **ID**: `feargaze`
- **来源机制**: mob effect `fear`
- **适用 Tier**: CRUDE, PRIMITIVE, ADAPTED, PURE, PREEMINENT, ANCIENT, DERIVED, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 恶 / 变化
- **威力 / 命中 / PP**: - / 100 / 20
- **效果**: 目标命中率下降 1 阶段；若目标 HP 已低于 50%，改为下降 2 阶段。
- **叠层机制**: 最多 -2。
- **冷却机制**: 无
- **视觉表现**: 使用者眼部发光，视线处空气扭曲。
- **不能学习者**: INBORN 不学——低阶没有产生恐惧的体型。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 灾厄低鸣 / Dire Howl

- **ID**: `direhowl`
- **来源机制**: fear 的群体面向
- **适用 Tier**: FERAL, PRIMITIVE, ADAPTED, PURE, PREEMINENT, ANCIENT
- **属性 / 类别**: 恶 / 变化
- **威力 / 命中 / PP**: - / 100 / 15
- **效果**: 全体对手命中下降 1 阶段，并有 30% 概率畏缩。
- **叠层机制**: 命中下降可叠加。
- **冷却机制**: 3 回合
- **视觉表现**: 声波以可见的同心圆扩散。
- **不能学习者**: NEXUS / DETERRENT。

### 猎杀气息 / Hunter's Aura

- **ID**: `hunteraura`
- **来源机制**: fear + SRP 追猎行为
- **适用 Tier**: FERAL, PRIMITIVE, ADAPTED, PURE, PREEMINENT, ANCIENT
- **属性 / 类别**: 恶 / 变化
- **威力 / 命中 / PP**: - / 必中 / 15
- **效果**: 3 回合内自身对 HP 低于 50% 的目标伤害 +30%，且目标无法逃跑或替换。
- **叠层机制**: 不叠加。
- **冷却机制**: 3 回合
- **视觉表现**: 使用者周围浮现暗红色气场。
- **不能学习者**: INBORN / NEXUS / ASSIMILATED。

### 巢穴威压 / Hive Oppression

- **ID**: `hiveoppression`
- **来源机制**: Nexus 领域的压制表现（fear 在巢穴附近强化）
- **适用 Tier**: NEXUS, PREEMINENT, ANCIENT
- **属性 / 类别**: 恶 / 变化
- **威力 / 命中 / PP**: - / 必中 / 10
- **效果**: 只要使用者在场，全体对手每回合有 25% 概率无法使用非伤害类招式；已有恐惧标记的对手概率提高到 50%。
- **叠层机制**: 与恐惧凝视共存但不叠概率。
- **冷却机制**: 4 回合
- **视觉表现**: 场地边缘升起黑色立柱状虚影。
- **不能学习者**: 非 Nexus/Preeminent/Ancient 一律不学。

## G. 针刺系 (4)

### 针刺 / Needle Sting

- **ID**: `needlesting`
- **来源机制**: mob effect `needler`
- **适用 Tier**: INBORN, CRUDE, PRIMITIVE, ADAPTED, PURE, DETERRENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 虫 / 物理
- **威力 / 命中 / PP**: 35 / 100 / 30
- **效果**: 命中后附加 1 层【针刺】。
- **叠层机制**: 针刺 1~5 层，每层在回合结束时造成 1/32 最大 HP 伤害。
- **冷却机制**: 无
- **视觉表现**: 细小针状物嵌入目标体表并持续闪烁。
- **不能学习者**: NEXUS / ANCIENT / DERIVED（它们用爆发而非累积）。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 毒针爆发 / Venom Needle Burst

- **ID**: `venomneedleburst`
- **来源机制**: needler 的爆发结算
- **适用 Tier**: INBORN, PRIMITIVE, ADAPTED, PURE, DETERRENT, PREEMINENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL（需第 2 阶段）
- **属性 / 类别**: 虫 / 物理
- **威力 / 命中 / PP**: 25 / 95 / 15
- **效果**: 随机攻击 3~5 次；每次命中附加 1 层针刺。
- **叠层机制**: 可一次叠满 5 层。
- **冷却机制**: 无
- **视觉表现**: 密集针雨从口器射出。
- **不能学习者**: INBORN 只能学针刺。
- **矩阵修正记录**: 针刺是多段攻击形态：基础针刺属于全族，爆发形态从第二形态（裂噬兽）起才具备。 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 穿刺孢子 / Piercing Spore

- **ID**: `piercingspore`
- **来源机制**: needler + 孢子传播
- **适用 Tier**: PRIMITIVE, ADAPTED, PURE, PREEMINENT, NEXUS
- **属性 / 类别**: 草 / 特殊
- **威力 / 命中 / PP**: 45 / 100 / 20
- **效果**: 命中后附加 2 层针刺；若目标已有感染层数，每层感染额外 +1 层针刺。
- **叠层机制**: 跨机制联动。
- **冷却机制**: 2 回合
- **视觉表现**: 孢子命中后长出短针。
- **不能学习者**: ASSIMILATED / HIJACKED / FERAL。

### 终末针 / Terminal Needle

- **ID**: `terminalneedle`
- **来源机制**: needler 达到阈值后的终结效果
- **适用 Tier**: ADAPTED, PURE, PREEMINENT, ANCIENT, DETERRENT
- **属性 / 类别**: 虫 / 物理
- **威力 / 命中 / PP**: 30 / 100 / 5
- **效果**: 只有当目标针刺层数 ≥3 时才能使用：消耗全部层数，造成 30×(消耗层数×2) 的伤害并使其麻痹。
- **叠层机制**: 消耗型，阈值触发。
- **冷却机制**: 4 回合
- **视觉表现**: 目标体内所有针同时向外炸出。
- **不能学习者**: 低阶与 Nexus 族不学。

## H. 饥饿系 (3)

### 饥饿领域 / Hunger Field

- **ID**: `hungerfield`
- **来源机制**: SRP 的 Hunger 状态（进食/回复剥夺）
- **适用 Tier**: CRUDE, PRIMITIVE, ADAPTED, PURE, PREEMINENT, NEXUS, ANCIENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 恶 / 变化
- **威力 / 命中 / PP**: - / 必中 / 10
- **效果**: 布下领域 4 回合：场上对手使用回复类招式、道具或特性的效果减半。
- **叠层机制**: 不叠加。
- **冷却机制**: 场地消失前不能再次使用
- **视觉表现**: 场地色调变暗，食物类粒子消失。
- **不能学习者**: INBORN / ASSIMILATED / WALKING_HEAD / HIJACKED。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 吞噬本能 / Devour Instinct

- **ID**: `devourinstinct`
- **来源机制**: SRP 寄生体吞噬生物质
- **适用 Tier**: INBORN, CRUDE, PRIMITIVE, ADAPTED, FERAL, PURE, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED
- **属性 / 类别**: 恶 / 物理
- **威力 / 命中 / PP**: 70 / 100 / 15
- **效果**: 造成伤害后回复伤害的 40%；若该次攻击击倒目标，额外回复 25%。
- **叠层机制**: 不叠加。
- **冷却机制**: 无
- **视觉表现**: 命中处生物质被吸入使用者体内。
- **不能学习者**: NEXUS / DETERRENT / DERIVED。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 寄生吸收 / Parasitic Drain

- **ID**: `parasiticdrain`
- **来源机制**: 寄生吸血 + Hunger
- **适用 Tier**: INBORN, CRUDE, PRIMITIVE, ADAPTED, PURE, PREEMINENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 虫 / 特殊
- **威力 / 命中 / PP**: 55 / 100 / 20
- **效果**: 造成伤害并回复其 50%；若目标处于【感染】状态，改为回复 75% 并使其感染层数 -1。
- **叠层机制**: 消耗目标感染层。
- **冷却机制**: 无
- **视觉表现**: 黑色丝线从目标连到使用者身上。
- **不能学习者**: NEXUS / ANCIENT。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

## I. 迟滞系 (3)

### 动作迟滞 / Motor Lag

- **ID**: `motorlag`
- **来源机制**: SRP 的 Mining Fatigue 类减速效果
- **适用 Tier**: CRUDE, PRIMITIVE, ADAPTED, PURE, DETERRENT, PREEMINENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 地面 / 变化
- **威力 / 命中 / PP**: - / 100 / 20
- **效果**: 目标速度下降 1 阶段，且其下回合使用的先制招式失效（先制度视为 0）。
- **叠层机制**: 速度下降可叠加。
- **冷却机制**: 无
- **视觉表现**: 目标四肢被半透明丝线缠住。
- **不能学习者**: INBORN 不学。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 肢体麻痹 / Limb Numbness

- **ID**: `limbnumbness`
- **来源机制**: Mining Fatigue 与麻痹的叠加
- **适用 Tier**: PRIMITIVE, ADAPTED, PURE, PREEMINENT, NEXUS
- **属性 / 类别**: 电 / 变化
- **威力 / 命中 / PP**: - / 90 / 15
- **效果**: 使目标麻痹；若目标已麻痹，改为使其速度下降 2 阶段并无法使用接触类招式 2 回合。
- **叠层机制**: 麻痹不可叠，减速可叠。
- **冷却机制**: 2 回合
- **视觉表现**: 目标肢体抽搐并僵直。
- **不能学习者**: ASSIMILATED / WALKING_HEAD / HIJACKED / FERAL。

### 神经阻断 / Nerve Block

- **ID**: `nerveblock`
- **来源机制**: Mining Fatigue 的高阶形态
- **适用 Tier**: ADAPTED, PURE, PREEMINENT, ANCIENT, DERIVED
- **属性 / 类别**: 超能 / 变化
- **威力 / 命中 / PP**: - / 85 / 10
- **效果**: 封锁目标最后使用过的招式 3 回合；若目标因此无法行动过，改为封锁两个招式。
- **叠层机制**: 可叠加不同招式。
- **冷却机制**: 3 回合
- **视觉表现**: 目标体表神经状纹路熄灭。
- **不能学习者**: INBORN / CRUDE / PRIMITIVE / NEXUS。

## J. 成长掠夺系 (2)

### 成长吞噬 / Growth Devour

- **ID**: `growthdevour`
- **来源机制**: SRP XP steal（击杀掠夺成长）
- **适用 Tier**: CRUDE, PRIMITIVE, ADAPTED, PURE, PREEMINENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 恶 / 物理
- **威力 / 命中 / PP**: 65 / 100 / 15
- **效果**: 造成伤害；若本次攻击击倒目标，使用者获得 1 阶段随机能力提升，并回复 25% 最大 HP。
- **叠层机制**: 不叠加。
- **冷却机制**: 无
- **视觉表现**: 目标解体为黑色生物质被吸入。
- **不能学习者**: INBORN 只能通过寄生吸收获取资源，不能掠夺成长。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 杀戮进化 / Killing Evolution

- **ID**: `killingevolution`
- **来源机制**: XP steal 的累积形态
- **适用 Tier**: ADAPTED, PURE, PREEMINENT, ANCIENT, DERIVED
- **属性 / 类别**: 恶 / 变化
- **威力 / 命中 / PP**: - / 必中 / 5
- **效果**: 本场战斗中每击倒过一只宝可梦，就永久提升攻击与特攻各 1 阶段（最多 3 次）。使用后本场不再能替换下场。
- **叠层机制**: 累积 3 层。
- **冷却机制**: 5 回合
- **视觉表现**: 使用者体型明显膨胀，体表纹路转为猩红。
- **不能学习者**: INBORN / CRUDE / ASSIMILATED / WALKING_HEAD / HIJACKED / FERAL / NEXUS。

## K. 狂怒系 (3)

### 狂怒 / Frenzy

- **ID**: `frenzy`
- **来源机制**: mob effect `rage`
- **适用 Tier**: INBORN, CRUDE, PRIMITIVE, ADAPTED, FERAL, PURE, PREEMINENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED
- **属性 / 类别**: 恶 / 变化
- **威力 / 命中 / PP**: - / 必中 / 15
- **效果**: 攻击提升 2 阶段、防御下降 1 阶段；仅在自身 HP 低于 50% 时可用。
- **叠层机制**: 可与暴怒感染叠加。
- **冷却机制**: 3 回合
- **视觉表现**: 体表渗出红色雾气，动作变快。
- **不能学习者**: NEXUS / DETERRENT / ANCIENT（它们不靠自残换输出）。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 暴怒感染 / Berserk Infection

- **ID**: `berserkinfection`
- **来源机制**: rage 的传播形态
- **适用 Tier**: CRUDE, PRIMITIVE, ADAPTED, FERAL, PURE, PREEMINENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED
- **属性 / 类别**: 恶 / 变化
- **威力 / 命中 / PP**: - / 100 / 10
- **效果**: 使目标进入暴怒：其攻击提升 2 阶段但每回合结束损失 1/8 最大 HP，持续 3 回合。
- **叠层机制**: 不叠加，只刷新。
- **冷却机制**: 3 回合
- **视觉表现**: 目标眼睛变红并出现抖动。
- **不能学习者**: ASSIMILATED / WALKING_HEAD / HIJACKED / NEXUS。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 末路狂化 / Last Stand Rage

- **ID**: `laststandrage`
- **来源机制**: rage 的濒死强化
- **适用 Tier**: FERAL, PURE, PREEMINENT, ANCIENT, DERIVED
- **属性 / 类别**: 恶 / 变化
- **威力 / 命中 / PP**: - / 必中 / 5
- **效果**: 仅在 HP 低于 25% 时可用：攻击、特攻、速度各提升 2 阶段，但本回合结束后自身损失 1/4 最大 HP。
- **叠层机制**: 不叠加。
- **冷却机制**: 4 回合
- **视觉表现**: 全身纹路转为深红，体表不断崩落碎片。
- **不能学习者**: NEXUS / DETERRENT / INBORN。

## L. 伪装系 (2)

### 寄生拟态 / Parasitic Mimicry

- **ID**: `parasiticmimicry`
- **来源机制**: SRP Camouflage（Adapted 系的伪装表现）
- **适用 Tier**: ADAPTED, PURE, PREEMINENT, ANCIENT
- **属性 / 类别**: 一般 / 变化
- **威力 / 命中 / PP**: - / 必中 / 10
- **效果**: 2 回合内自身受到的第一次攻击必定落空；被命中后拟态解除。若使用者为 Adapted 且已记录适应属性，落空后获得该属性抗性 1 回合。
- **叠层机制**: 不叠加。
- **冷却机制**: 3 回合
- **视觉表现**: 体表颜色与周围环境同步。
- **不能学习者**: INBORN / CRUDE / PRIMITIVE / NEXUS / DERIVED——只有带 Adaptation 的谱系才会演化出拟态。

### 气息隐藏 / Aura Conceal

- **ID**: `auraconceal`
- **来源机制**: Camouflage
- **适用 Tier**: ADAPTED, DETERRENT, PURE, PREEMINENT
- **属性 / 类别**: 幽灵 / 变化
- **威力 / 命中 / PP**: - / 必中 / 15
- **效果**: 清除自身被标记类状态（感染标记、腐蚀标记、猎物标记），并在 2 回合内不会被新的标记类招式选中。
- **叠层机制**: 不叠加。
- **冷却机制**: 2 回合
- **视觉表现**: 使用者轮廓短暂透明。
- **不能学习者**: INBORN / FERAL / NEXUS。

## M. 寄生球系 (3)

### 感染之球 / Infection Orb

- **ID**: `infectionorb`
- **来源机制**: Parasite Orb 实体（orbvoid / scary_orb）
- **适用 Tier**: CRUDE, PRIMITIVE, ADAPTED, PURE, PREEMINENT, NEXUS, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 毒 / 特殊
- **威力 / 命中 / PP**: 70 / 100 / 15
- **效果**: 无视命中判定（必中）造成伤害，并附加 1 层感染。
- **叠层机制**: +1 层。
- **冷却机制**: 2 回合
- **视觉表现**: 黑色球体拖着尾迹飞向目标。
- **不能学习者**: INBORN / ASSIMILATED / WALKING_HEAD / HIJACKED / FERAL / ANCIENT。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 寄生领域 / Parasitic Field

- **ID**: `parasiticfield`
- **来源机制**: Parasite Orb 的持续领域
- **适用 Tier**: PRIMITIVE, ADAPTED, PURE, PREEMINENT, NEXUS, ANCIENT
- **属性 / 类别**: 毒 / 变化
- **威力 / 命中 / PP**: - / 必中 / 5
- **效果**: 布下领域 5 回合：每回合结束，场上对手损失 1/16 最大 HP 并获得 1 层感染；使用者的回复量 +30%。
- **叠层机制**: 每回合 +1 层感染（上限 3）。
- **冷却机制**: 场地消失前不能再次使用
- **视觉表现**: 地面浮现缓慢旋转的黑色符文环。
- **不能学习者**: INBORN / ASSIMILATED / WALKING_HEAD / HIJACKED / FERAL / DETERRENT。

### 神经压制球 / Neural Suppression Orb

- **ID**: `neuralsuppressionorb`
- **来源机制**: Parasite Orb 的压制面向
- **适用 Tier**: ADAPTED, PURE, PREEMINENT, NEXUS, ANCIENT
- **属性 / 类别**: 超能 / 特殊
- **威力 / 命中 / PP**: 80 / 95 / 10
- **效果**: 造成伤害并使目标特防下降 1 阶段；若目标带有任何 SRP 状态（感染/流血/腐蚀/针刺），改为下降 2 阶段并封锁其回复 2 回合。
- **叠层机制**: 可叠加。
- **冷却机制**: 3 回合
- **视觉表现**: 紫色球体命中后炸成网状纹路。
- **不能学习者**: INBORN / CRUDE / FERAL。

## N. 召唤系 (3)

### 召援 / Call Reinforcement

- **ID**: `callreinforcement`
- **来源机制**: Reinforcement system
- **适用 Tier**: PRIMITIVE, ADAPTED, PURE, PREEMINENT, NEXUS, ANCIENT
- **属性 / 类别**: 虫 / 变化
- **威力 / 命中 / PP**: - / 必中 / 5
- **效果**: 召唤一只同阵营支援单位入场（双打占据空位；单打则在下回合结束时对对手造成一次固定 1/8 最大 HP 的冲撞）。召唤来源必须是本数据库 CONFIRMED 且 tier 不高于使用者的实体。
- **叠层机制**: 场上同时只能存在 1 个召唤物。
- **冷却机制**: 4 回合
- **视觉表现**: 地面裂开并爬出寄生体。
- **不能学习者**: INBORN / ASSIMILATED / WALKING_HEAD / HIJACKED / FERAL / DETERRENT / DERIVED。

### 寄生释放 / Parasite Release

- **ID**: `parasiterelease`
- **来源机制**: Carrier 体内储存并投放寄生体
- **适用 Tier**: INBORN, CRUDE, PRIMITIVE, ADAPTED, PREEMINENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 虫 / 变化
- **威力 / 命中 / PP**: - / 必中 / 5
- **效果**: 释放体内储存的寄生体：对目标造成固定 1/6 最大 HP 伤害并附加 2 层感染；每场战斗只能使用 2 次。
- **叠层机制**: +2 层。
- **冷却机制**: 每场 2 次
- **视觉表现**: 背部裂开并喷出幼虫群。
- **不能学习者**: NEXUS / ANCIENT / DETERRENT——它们的召唤是领域级，不走"释放"通道。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 菌巢召回 / Hive Recall

- **ID**: `hiverecall`
- **来源机制**: Beckon 的巢群召回
- **适用 Tier**: NEXUS, ANCIENT
- **属性 / 类别**: 虫 / 变化
- **威力 / 命中 / PP**: - / 必中 / 3
- **效果**: 把场上所有召唤物收回，每个收回的召唤物为使用者回复 20% 最大 HP，并使其领域类招式冷却减少 1 回合。
- **叠层机制**: 不叠加。
- **冷却机制**: 每场 3 次
- **视觉表现**: 丝线把寄生体拉回巢体。
- **不能学习者**: 只有 Nexus 与 Ancient 拥有召回权限。

## O. 再生系 (2)

### 组织再生 / Tissue Regeneration

- **ID**: `tissueregeneration`
- **来源机制**: Parasite 的脱战/持续恢复
- **适用 Tier**: INBORN, CRUDE, PRIMITIVE, ADAPTED, PURE, NEXUS, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 草 / 变化
- **威力 / 命中 / PP**: - / 必中 / 10
- **效果**: 3 回合内每回合结束回复 1/16 最大 HP；若期间未受到火属性伤害，回复量提升为 1/8。
- **叠层机制**: 不叠加，只刷新。
- **冷却机制**: 2 回合
- **视觉表现**: 伤口被快速生长的白色组织覆盖。
- **不能学习者**: ANCIENT / DERIVED 不学——它们用重构而非再生。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 休眠再生 / Dormancy Regeneration

- **ID**: `dormancyregen`
- **来源机制**: 寄生体的休眠恢复
- **适用 Tier**: CRUDE, PRIMITIVE, ADAPTED, NEXUS, PREEMINENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 草 / 变化
- **威力 / 命中 / PP**: - / 必中 / 5
- **效果**: 本回合不行动并进入休眠：回复 40% 最大 HP 并清除全部异常状态，但本回合受到的伤害 +50%。
- **叠层机制**: 不叠加。
- **冷却机制**: 3 回合
- **视觉表现**: 使用者蜷缩成球状并被生物质包裹。
- **不能学习者**: PURE / ANCIENT / DERIVED——纯战斗单位不进入休眠。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

## P. 空间系 (2)

### 寄生闪现 / Parasitic Blink

- **ID**: `parasiticblink`
- **来源机制**: Assimilated / Feral Enderman 的传送行为
- **适用 Tier**: ASSIMILATED, WALKING_HEAD, FERAL, PRIMITIVE, ADAPTED, NEXUS
- **属性 / 类别**: 超能 / 变化
- **威力 / 命中 / PP**: - / 必中 / 15
- **效果**: 先制 +2，与队伍中任意一只宝可梦交换位置（不消耗回合的替换），并清除自身被标记状态。
- **叠层机制**: 不叠加。
- **冷却机制**: 2 回合
- **视觉表现**: 紫色粒子中原地消失并出现在出手位置。
- **不能学习者**: **严格限制**：只有原型具备 Enderman 传送行为的实体可学；INBORN / CRUDE / PURE / ANCIENT 等一律不学。

### 猎杀传送 / Hunter Teleport

- **ID**: `hunterteleport`
- **来源机制**: Feral Enderman 的传送到目标背后
- **适用 Tier**: ASSIMILATED, FERAL, ADAPTED, PREEMINENT
- **属性 / 类别**: 超能 / 物理
- **威力 / 命中 / PP**: 75 / 100 / 10
- **效果**: 先制 +1；若目标带有猎物标记，本招必定命中且威力 +30%。
- **叠层机制**: 不叠加。
- **冷却机制**: 2 回合
- **视觉表现**: 使用者瞬间出现在目标身后并挥击。
- **不能学习者**: 不具备传送原型的实体一律不学。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED。同化末影人（sim_enderman）本身就是以传送为核心的宿主，类注释写明它 teleports itself and idle parasite allies；排除它反而不合理。

## Q. 场地系 (2)

### 感染地面 / Infested Ground

- **ID**: `infestedground`
- **来源机制**: Infested Blocks
- **适用 Tier**: INBORN, CRUDE, PRIMITIVE, ADAPTED, PURE, NEXUS, PREEMINENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED, FERAL
- **属性 / 类别**: 地面 / 变化
- **威力 / 命中 / PP**: - / 必中 / 10
- **效果**: 把场地变为"感染场地"5 回合：每回合结束对场上非寄生阵营的宝可梦造成 1/16 最大 HP 伤害；草属性以外的回复类招式效果 -20%。
- **叠层机制**: 场地唯一。
- **冷却机制**: 场地消失前不能再次使用
- **视觉表现**: 地面长出黑色菌毯与肉质组织。
- **不能学习者**: ASSIMILATED / WALKING_HEAD / HIJACKED / FERAL / DETERRENT / ANCIENT。
- **矩阵修正记录**: 证据：WorkerEntity 的 BuildColonyGoal 就是产生感染地面的行为，工虫必须能学。 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 巢穴建立 / Nest Establishment

- **ID**: `nestestablishment`
- **来源机制**: Beckon / Rooter 的巢穴建立
- **适用 Tier**: NEXUS, ANCIENT, PREEMINENT
- **属性 / 类别**: 草 / 变化
- **威力 / 命中 / PP**: - / 必中 / 5
- **效果**: 在场上建立巢穴 4 回合：使用者每回合结束回复 1/8 最大 HP，且召唤类招式冷却每回合 -1。
- **叠层机制**: 与感染场地可共存。
- **冷却机制**: 4 回合
- **视觉表现**: 使用者脚下升起菌巢结构。
- **不能学习者**: 只有 Nexus / Preeminent / Ancient 能建立巢穴；其他 tier 不学。

## R. 水域系 (2)

### 水域伏击 / Water Ambush

- **ID**: `waterambush`
- **来源机制**: SRP 的水域伏击行为
- **适用 Tier**: CRUDE, PRIMITIVE, ADAPTED, PURE, FERAL, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED
- **属性 / 类别**: 水 / 物理
- **威力 / 命中 / PP**: 70 / 95 / 15
- **效果**: 先制 +1；仅在"水边/水下"场地条件下可用（雨天、水域场地或水系场地）。命中后目标速度下降 1 阶段。
- **叠层机制**: 不叠加。
- **冷却机制**: 2 回合
- **视觉表现**: 水面炸开并窜出寄生体。
- **不能学习者**: **不得全族通用**：不具备水域行为的实体（NEXUS / ANCIENT / DETERRENT / HIJACKED）不学。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 溺杀追猎 / Drowning Pursuit

- **ID**: `drowningpursuit`
- **来源机制**: SRP 水域追猎
- **适用 Tier**: ASSIMILATED, PRIMITIVE, ADAPTED, FERAL
- **属性 / 类别**: 水 / 物理
- **威力 / 命中 / PP**: 60 / 100 / 10
- **效果**: 连续 3 回合锁定目标，每回合自动造成威力 60 的伤害；目标替换下场则中断。
- **叠层机制**: 不叠加。
- **冷却机制**: 3 回合
- **视觉表现**: 水面下持续追猎的暗影。
- **不能学习者**: 非水域谱系一律不学。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED。被感染的鱿鱼（sim_squid）是水域掠食者，源码用 WaterBoundPathNavigation 绑定水域，它必须能学水域系技能。

## S. 特殊状态系 (5)

### 呕吐 / Vomit

- **ID**: `vomit`
- **来源机制**: mob effect `vomit`
- **适用 Tier**: INBORN, ASSIMILATED, FERAL, CRUDE, PRIMITIVE, ADAPTED, PREEMINENT, WALKING_HEAD, ASSIMARA, HIJACKED
- **属性 / 类别**: 毒 / 特殊
- **威力 / 命中 / PP**: 60 / 100 / 10
- **效果**: 吐出体内生物质：造成伤害并使目标中毒；若使用者身上有感染层数，每层使威力 +15 并消耗该层。
- **叠层机制**: 消耗自身感染层。
- **冷却机制**: 2 回合
- **视觉表现**: 口部喷出黑色半固态物质。
- **不能学习者**: NEXUS / ANCIENT / DERIVED。
- **矩阵修正记录**: 载虫的 spawnLingeringCloud() 就是吐出体内生物质形成毒云，与呕吐同源，因此放开 INBORN。 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 感官强化 / Heightened Senses

- **ID**: `heightenedsenses`
- **来源机制**: mob effect `senses`
- **适用 Tier**: CRUDE, PRIMITIVE, ADAPTED, PURE, PREEMINENT, FERAL, DETERRENT, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED
- **属性 / 类别**: 一般 / 变化
- **威力 / 命中 / PP**: - / 必中 / 15
- **效果**: 3 回合内命中率提升 1 阶段，且可以看穿对手的替身与闪避类变化（幻觉、拟态、气息隐藏）。
- **叠层机制**: 不叠加。
- **冷却机制**: 3 回合
- **视觉表现**: 使用者头部震颤，眼睛出现复眼反光。
- **不能学习者**: NEXUS / ANCIENT——它们的感知是领域级而非个体级。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 猎物标记 / Marked Prey

- **ID**: `markedprey`
- **来源机制**: mob effect `prey`
- **适用 Tier**: INBORN, FERAL, CRUDE, PRIMITIVE, ADAPTED, PURE, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED
- **属性 / 类别**: 一般 / 变化
- **威力 / 命中 / PP**: - / 100 / 20
- **效果**: 标记目标 3 回合：本阵营对其造成的伤害 +15%，且其逃跑必定失败。
- **叠层机制**: 刷新回合数。
- **冷却机制**: 无
- **视觉表现**: 目标头顶出现暗红色标记。
- **不能学习者**: NEXUS / DETERRENT。
- **矩阵修正记录**: 矩阵修正：加入 ASSIMILATED / WALKING_HEAD / ASSIMARA / HIJACKED / FERAL。这五个 tier 都是被感染的宿主，本来就具备寄生体的基础工具（感染、接触、撕裂），不可能比 INBORN 更少。

### 烟幕轨迹 / Parasitic Smoke Trail

- **ID**: `parasiticsmoke`
- **来源机制**: mob effect `dod_smoke_trail`
- **适用 Tier**: PRIMITIVE, ADAPTED, PURE, PREEMINENT, NEXUS
- **属性 / 类别**: 毒 / 变化
- **威力 / 命中 / PP**: - / 必中 / 10
- **效果**: 在自身位置留下烟幕 3 回合：烟幕中的对手命中率下降 1 阶段，且每回合结束获得 1 层感染。
- **叠层机制**: 每回合 +1 层感染。
- **冷却机制**: 3 回合
- **视觉表现**: 黑灰色烟柱在场上持续翻滚。
- **不能学习者**: INBORN / ASSIMILATED / WALKING_HEAD / HIJACKED / FERAL。

### 荆棘护体 / Thornshade Guard

- **ID**: `thornshadeguard`
- **来源机制**: mob effect `thornshade_thorns`
- **适用 Tier**: PRIMITIVE, ADAPTED, PURE, PREEMINENT, ANCIENT
- **属性 / 类别**: 草 / 变化
- **威力 / 命中 / PP**: - / 必中 / 10
- **效果**: 3 回合内自身受到接触类招式攻击时，攻击者受到其最大 HP 1/8 的反伤并被附加 1 层针刺。
- **叠层机制**: 不叠加，反伤可与自身特性叠加。
- **冷却机制**: 3 回合
- **视觉表现**: 体表长出深色荆棘。
- **不能学习者**: INBORN / CRUDE / NEXUS / DERIVED。

