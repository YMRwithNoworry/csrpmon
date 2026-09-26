# No.8130 远古恐慑 / Ancient Dreadnaut

| | |
|---|---|
| **SRP Source** | `csrp:anc_dreadnaut` |
| **SRP 原名** | Ancient Dreadnaut |
| **SRP 分类** | ANCIENT（`RelayScanReportFactory.Tier.ANCIENT` 与 `bestiary/anc_dreadnaut.json` 一致） |
| **宝可梦属性** | 虫 / 飞行 |
| **分类名** | 灾害级空域宝可梦 |
| **身高** | 7.5 m |
| **体重** | 2400 kg |

## 基础种族值

| HP | 攻击 | 防御 | 特攻 | 特防 | 速度 | 总和 |
|---|---|---|---|---|---|---|---|
| 148 | 120 | 124 | 110 | 96 | 58 | **656** |

总和 656，**全图鉴第二高**（纯化缠祟 706）。SRP 中 health **200.0** / armor 15.0 / damage 15.0 / speed 0.30。**它拥有 `ServerBossEvent`（Boss 血条）与 `AncientPart[] bodyParts`（身体部位数组）**——这两项在整个模组里只有 ANCIENT 层才有。

## 设计核心

“它不是"最强的寄生体"。**它是一个会飞的、带部位的、有血条的灾害。**”

## 视觉设计

| 部位 | 设计 | 来源 |
|---|---|---|
| 头部 | 巨大的楔形头骨，两侧各有一组发射腔 | DreadVolleyGoal |
| 眼睛 | 一整排横向暗红光带，视野覆盖整个前半球 | 空域控制 |
| 躯干 | **分段式躯体，每一段都是独立的部位** | AncientPart[] bodyParts |
| 翼膜 | **四对巨大翼膜**，跨度超过体型数倍 | DreadFlightGoal |
| 空投腔 | 腹部有一整套空投结构 | DreadPodGoal |
| 颜色 | 深红寄生组织 + 骨灰白甲板 + 核心暗紫 | SRP 模型配色 |

**动作姿势**：持续滞空、盘旋高度极高；发动时四对翼膜完全展开，投下空投仓后立刻爬升。

## SRP 特征保留

1. **Boss 级身份**——`private final ServerBossEvent bossEvent;`
2. **身体部位系统**——`private final AncientPart[] bodyParts;`
3. **三套专属目标**——`DreadVolleyGoal`（齐射）/ `DreadPodGoal`（空投）/ `DreadFlightGoal` + `DreadRandomFlightGoal`（飞行）
4. **专属移动控制**——`DreadMoveControl`
5. **极高数值**——health 200.0 / armor 15.0
6. **原始类名**——同族的地面触手类注释为 *"Legacy Ancient Dreadnaut ground tendril (EntityOroncoTen)"*

## 宝可梦化改造

* **`ServerBossEvent` 与 `AncientPart[]` 是 ANCIENT 层独有的两项**——前者是 Boss 血条，后者是身体部位数组。我据此把它做成**全图鉴唯二拥有独立部位血量的 Boss 之一**（另一只在这里是远古霸主）
* **它有三个专属目标，构成三套协同系统**：齐射压制 → 空投投放地面单位 → 飞行重新定位。完全符合你规则对 ANCIENT「超大规模攻击 ＋ 阶段机制 ＋ 领域」的要求
* **它的地面触手是另一个独立实体**（`anc_dreadnaut_ten`，50.0/3.75/2.0）——所以我把它设计成**本体与触手分离的空域要塞**

## 特性

**普通特性：分段躯体（ancientparts）**

自身拥有 **3 个独立部位**（对应 `AncientPart[] bodyParts`），每个部位耐久相当于最大 HP 的 25%。**每破坏一个部位，自身的齐射段数减少 1 段**。对应 `AncientPart[]` 与 `DreadVolleyGoal` 的联动。

**隐藏特性：灾害级血条（bosshp）**

自身受到的伤害在**单次不超过最大 HP 的 20%**（对应 `ServerBossEvent` 的 Boss 定位）。**该保护在自身全部部位被破坏后失效**。

## 独家技能 1：恐慑齐射 / Dread Volley

| 字段 | 值 |
|---|---|
| 属性 | 虫 |
| 分类 | 特殊 |
| 威力 | 55 |
| 命中 | 95 |
| PP | 10 |
| 范围 | 全体对手 |

**效果**：对场上**所有对手连续攻击 3 次**（每次威力 55）。**每破坏自身 1 个部位，段数减少 1 段**。对应 `DreadVolleyGoal`。

**触发条件**：无。

**视觉表现**：头部两侧的发射腔依次张开，连续三轮向全场倾泻暗红弹幕，翼膜每轮都因后坐而轻震一下。

**为什么只有它**：`DreadVolleyGoal` 的翻译，并与 `AncientPart[]` 绑定——**部位越少，齐射越稀**。

## 独家技能 2：恐慑空投 / Dread Pod

| 字段 | 值 |
|---|---|
| 属性 | 飞行 |
| 分类 | 变化 |
| 威力 | - |
| 命中 | 必中 |
| PP | 5 |
| 范围 | 全场 |

**效果**：从腹部投下 **1 具空投仓**（对应 `DreadPodGoal`），下回合从白名单中释放 **1 只寄生体**。**对应独立实体 `csrp:anc_pod`**。造成 0 点伤害。

**触发条件**：无。

**视觉表现**：腹部空投结构开启，一具暗红荚舱垂直落下并砸入地面，荚舱表面随即出现裂缝并渗出生物质。

**为什么只有它**：`DreadPodGoal` 与独立实体 `anc_pod`（Ancient Drop Pod，45.0/5.0/**0.0** 伤害）的翻译。**它不直接召唤，它先投下一个会自己打开的容器**——这是源码里两个实体的联动。

## SRP 通用技能（10 个）

| 技能 | 属性 | 类别 | 效果 | 为什么它可以学 |
|---|---|---|---|---|
| [寄生释放](../skills/SRP-COMMON-SKILLS.md) | 虫 | 变化 | 释放体内储存的寄生体：对目标造成固定 1/6 最大 HP 伤害并附加 2 层感染；每场战斗只能使用 2 次。… | ANCIENT 层的灾害级职能来源 |
| [巢母呼唤](../skills/SRP-COMMON-SKILLS.md) | 虫 | 变化 | 呼叫巢群：所有场上对手获得 2 层【感染】，且使用者的召唤类招式冷却立即减少 2 回合。… | ANCIENT 层的灾害级职能来源 |
| [巢穴威压](../skills/SRP-COMMON-SKILLS.md) | 恶 | 变化 | 只要使用者在场，全体对手每回合有 25% 概率无法使用非伤害类招式；已有恐惧标记的对手概率提高到 50%。… | ANCIENT 层的灾害级职能来源 |
| [寄生领域](../skills/SRP-COMMON-SKILLS.md) | 毒 | 变化 | 布下领域 5 回合：每回合结束，场上对手损失 1/16 最大 HP 并获得 1 层感染；使用者的回复量 +30%。… | ANCIENT 层的灾害级职能来源 |
| [感染脉冲](../skills/SRP-COMMON-SKILLS.md) | 毒 | 特殊 | 对场上所有其他宝可梦造成伤害；对已带【感染】的目标额外造成 1 层。… | ANCIENT 层的灾害级职能来源 |
| [感染地面](../skills/SRP-COMMON-SKILLS.md) | 地面 | 变化 | 把场地变为"感染场地"5 回合：每回合结束对场上非寄生阵营的宝可梦造成 1/16 最大 HP 伤害；草属性以外的回复类招式效果 -20%。… | ANCIENT 层的灾害级职能来源 |
| [群巢传播](../skills/SRP-COMMON-SKILLS.md) | 虫 | 变化 | 把使用者身上的【感染】层数原样复制给对手全队（双打时复制给两个对手），层数上限 2。… | ANCIENT 层的灾害级职能来源 |
| [巢穴建立](../skills/SRP-COMMON-SKILLS.md) | 草 | 变化 | 在场上建立巢穴 4 回合：使用者每回合结束回复 1/8 最大 HP，且召唤类招式冷却每回合 -1。… | ANCIENT 层的灾害级职能来源 |
| [猎物标记](../skills/SRP-COMMON-SKILLS.md) | 一般 | 变化 | 标记目标 3 回合：本阵营对其造成的伤害 +15%，且其逃跑必定失败。… | ANCIENT 层的灾害级职能来源 |
| [恐惧凝视](../skills/SRP-COMMON-SKILLS.md) | 恶 | 变化 | 目标命中率下降 1 阶段；若目标 HP 已低于 50%，改为下降 2 阶段。… | ANCIENT 层的灾害级职能来源 |

## 普通技能

逆鳞、龙之俯冲、空气利刃、地震、守住、蛮力。

## 技能循环

| 阶段 | 技能 | 目的 |
|---|---|---|
| 起手 | 恐慑空投 | 先在地面投下空投仓 |
| 核心 | 恐慑齐射 | 对全场连续三轮压制 |
| 强化 | 分段躯体（特性） | 用部位抵挡伤害 |
| 控制 | 巢穴威压 / 恐惧凝视 | 压制全场节奏 |
| 收尾 | 逆鳞 | 在对手被弹幕打散后全力收场 |

## 生态

* **生活环境**：感染区高空——它的活动范围覆盖整片区域
* **食物**：不需要
* **猎物**：地面与空中一切
* **天敌**：能连续破坏它三个部位的手段
* **行为**：高空盘旋—齐射—空投—爬升。**从不落地**
* **群体**：从不群居——它是单独的灾害级个体
* **巢穴**：ANCIENT 层不属于巢穴体系，它是**灾害本身**
* **繁殖**：不繁殖
* **与其他 SRP 宝可梦关系**：**其地面触手是独立实体 `csrp:anc_dreadnaut_ten`**（50.0/3.75/2.0，类注释：*"Legacy Ancient Dreadnaut ground tendril (EntityOroncoTen)"*）；**其空投产物是独立实体 `csrp:anc_pod`**（45.0/5.0/0.0）

## 进化 / 阶段

```
来源：无（ANCIENT 起点）
  ↓
当前：远古恐慑（`csrp:anc_dreadnaut`）
  ↓
【无直接宝可梦进化】

证据：`Kind.DREADNAUT(200.0D, 15.0D, 15.0D, 0.30D)`、`private final ServerBossEvent bossEvent;`、
`private final AncientPart[] bodyParts;`，以及 `DreadVolleyGoal` / `DreadPodGoal` / `DreadFlightGoal` 三套目标。
```

## 图鉴描述 1

> 它飞得很高，大到不像同一个生态里的东西。它不追你——它把东西扔下来，然后继续飞。

## 图鉴描述 2

> 观察记录：生命 200.0，Boss 级血条，3 个独立部位。
齐射段数随部位损毁递减；空投产物为 `anc_pod`（攻击力 **0.0**）。
 ——结论：**先打它的部位。打本体是最慢的解法**。

## 质量检查

| 检查 | 结果 |
|---|---|
| Canon Check | **YES** — `csrp:anc_dreadnaut` 注册存在（MobCategory `MONSTER`），tier 由 ANCIENT 来源确认 |
| Source ID Check | **YES** — `csrp:anc_dreadnaut` |
| Tier Check | **YES** — ANCIENT |
| Skill Check | **YES** — 恐慑齐射、恐慑空投 |
| Common Skill Check | **YES** — 10 个，且全部通过 tier 许可校验 |
| Lore Check | **NO 违规** — 见“宝可梦化改造”，原创机制均已标注为宝可梦化产物 |
| Gameplay Check | 输出（全场三段齐射）、召唤（空投 → 释放）、生存（200 HP + 3 部位 + Boss 保护）、控制（威压 + 恐惧）——ANCIENT 层的空域灾害 |
| Similarity Check | 与远古争霸（`anc_overlord`）的区别：**它是空域型，争霸是近战型**。两者共享 `ServerBossEvent` 与 `AncientPart[]`，但目标组完全不同（它三套飞行相关，争霸是追踪与近战）。 |

