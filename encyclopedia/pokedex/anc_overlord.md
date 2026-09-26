# No.8131 远古争霸 / Ancient Overlord

| | |
|---|---|
| **SRP Source** | `csrp:anc_overlord` |
| **SRP 原名** | Ancient Overlord |
| **SRP 分类** | ANCIENT（`RelayScanReportFactory.Tier.ANCIENT` 与 `bestiary/anc_overlord.json` 一致） |
| **宝可梦属性** | 虫 / 超能 |
| **分类名** | 灾害级追猎宝可梦 |
| **身高** | 8.2 m |
| **体重** | 2800 kg |

## 基础种族值

| HP | 攻击 | 防御 | 特攻 | 特防 | 速度 | 总和 |
|---|---|---|---|---|---|---|---|
| 156 | 132 | 118 | 104 | 102 | 44 | **656** |

总和 656，**与远古恐慑并列全图鉴第二高**。SRP 中 health **250.0（ANCIENT 层最高）** / armor 15.0 / **damage 20.0** / speed 0.23。**它同样拥有 `ServerBossEvent` 与 `AncientPart[] bodyParts`**，但目标组是 `OverlordHomingGoal` 与 `OverlordMeleeGoal`。

## 设计核心

“恐慑把东西扔下来。争霸**自己过来**——而且它打出来的东西会拐弯。”

## 视觉设计

| 部位 | 设计 | 来源 |
|---|---|---|
| 头部 | 巨大的钝形头骨，没有发射腔 | 与恐慑的核心区别 |
| 眼睛 | **成对出现的追踪光点**，会随目标移动 | OverlordHomingGoal |
| 躯干 | 分段式躯体，每一段都是独立部位 | AncientPart[] bodyParts |
| 前肢 | 一对极粗壮的前肢，末端为整块骨板 | OverlordMeleeGoal |
| 背部 | 背侧没有翼膜结构，躯干完全为近战设计 | 不飞行 |
| 颜色 | 深红寄生组织 + 骨灰白甲板 + 更深的暗紫核心 | SRP 模型配色 |

**动作姿势**：直立、重心极低；攻击时前肢不做大幅挥动，而是**以整个身体压上去**。

## SRP 特征保留

1. **Boss 级身份**——`private final ServerBossEvent bossEvent;`
2. **身体部位系统**——`private final AncientPart[] bodyParts;`
3. **两套专属目标**——`OverlordHomingGoal`（追踪弹）/ `OverlordMeleeGoal`（近战）
4. **ANCIENT 层最高生命**——health **250.0**
5. **最慢速度**——speed 0.23

## 宝可梦化改造

* **它与恐慑共享两项 ANCIENT 独有的字段**（`ServerBossEvent` 与 `AncientPart[]`），所以两者是同级的灾害
* **但目标组完全不同**：恐慑是 `DreadVolley` + `DreadPod` + `DreadFlight`（空域三套），它是 `OverlordHoming` + `OverlordMelee`（追踪 + 近战两套）
* **`OverlordHomingGoal` 说明它的投射物会追踪**——我据此把它做成"必定命中但可被减伤"的追踪弹，与恐慑的可规避齐射形成对照

## 特性

**普通特性：分段躯体（ancientparts）**

自身拥有 **3 个独立部位**（对应 `AncientPart[] bodyParts`），每个部位耐久相当于最大 HP 的 25%。**每破坏一个部位，自身受到的伤害提高 10%**。对应 `AncientPart[]`。

**隐藏特性：灾害级血条（bosshp）**

自身受到的伤害在**单次不超过最大 HP 的 20%**（对应 `ServerBossEvent`）。**该保护在自身全部部位被破坏后失效**。

## 独家技能 1：争霸追猎弹 / Overlord Homing

| 字段 | 值 |
|---|---|
| 属性 | 超能 |
| 分类 | 特殊 |
| 威力 | 95 |
| 命中 | 必中 |
| PP | 10 |
| 范围 | 单体，全场 |

**效果**：**必定命中**（追踪弹，对应 `OverlordHomingGoal`）。命中后使目标**本回合无法替换下场**。对应它是追猎型灾害。

**触发条件**：无。

**视觉表现**：从躯干两侧射出数枚暗紫色追踪弹，弹道中途多次拐弯绕过障碍，命中后目标脚下浮现锁定纹。

**为什么只有它**：`OverlordHomingGoal` 的翻译。**与恐慑的齐射形成对照**：恐慑对全场打可规避的弹幕，它对单体打躲不掉的追踪弹。

## 独家技能 2：争霸压顶 / Overlord Press

| 字段 | 值 |
|---|---|
| 属性 | 虫 |
| 分类 | 物理 |
| 威力 | 135 |
| 命中 | 95 |
| PP | 10 |
| 范围 | 自身周围 1 格 |

**效果**：对接触范围内所有对手造成伤害。**若目标本回合已被追猎弹命中，威力提高 30%**。对应 `OverlordMeleeGoal`。

**触发条件**：与追猎弹是否命中相关。

**视觉表现**：前肢撑地、整个躯体垂直压下，分段式躯体的每一节依次合拢，落点产生环状冲击。

**为什么只有它**：`OverlordMeleeGoal` 与 damage 20.0 的翻译，并与追踪弹**形成两段连携**：先追踪锁定，再贴身压顶。**这正是 ANCIENT 层要求的"两套相互配合的系统"**。

## SRP 通用技能（10 个）

| 技能 | 属性 | 类别 | 效果 | 为什么它可以学 |
|---|---|---|---|---|
| [寄生释放](../skills/SRP-COMMON-SKILLS.md) | 虫 | 变化 | 释放体内储存的寄生体：对目标造成固定 1/6 最大 HP 伤害并附加 2 层感染；每场战斗只能使用 2 次。… | ANCIENT 层的灾害级职能来源 |
| [巢母呼唤](../skills/SRP-COMMON-SKILLS.md) | 虫 | 变化 | 呼叫巢群：所有场上对手获得 2 层【感染】，且使用者的召唤类招式冷却立即减少 2 回合。… | ANCIENT 层的灾害级职能来源 |
| [巢穴威压](../skills/SRP-COMMON-SKILLS.md) | 恶 | 变化 | 只要使用者在场，全体对手每回合有 25% 概率无法使用非伤害类招式；已有恐惧标记的对手概率提高到 50%。… | ANCIENT 层的灾害级职能来源 |
| [寄生领域](../skills/SRP-COMMON-SKILLS.md) | 毒 | 变化 | 布下领域 5 回合：每回合结束，场上对手损失 1/16 最大 HP 并获得 1 层感染；使用者的回复量 +30%。… | ANCIENT 层的灾害级职能来源 |
| [感染脉冲](../skills/SRP-COMMON-SKILLS.md) | 毒 | 特殊 | 对场上所有其他宝可梦造成伤害；对已带【感染】的目标额外造成 1 层。… | ANCIENT 层的灾害级职能来源 |
| [猎杀气息](../skills/SRP-COMMON-SKILLS.md) | 恶 | 变化 | 3 回合内自身对 HP 低于 50% 的目标伤害 +30%，且目标无法逃跑或替换。… | ANCIENT 层的灾害级职能来源 |
| [群巢传播](../skills/SRP-COMMON-SKILLS.md) | 虫 | 变化 | 把使用者身上的【感染】层数原样复制给对手全队（双打时复制给两个对手），层数上限 2。… | ANCIENT 层的灾害级职能来源 |
| [巢穴建立](../skills/SRP-COMMON-SKILLS.md) | 草 | 变化 | 在场上建立巢穴 4 回合：使用者每回合结束回复 1/8 最大 HP，且召唤类招式冷却每回合 -1。… | ANCIENT 层的灾害级职能来源 |
| [猎物标记](../skills/SRP-COMMON-SKILLS.md) | 一般 | 变化 | 标记目标 3 回合：本阵营对其造成的伤害 +15%，且其逃跑必定失败。… | ANCIENT 层的灾害级职能来源 |
| [恐惧凝视](../skills/SRP-COMMON-SKILLS.md) | 恶 | 变化 | 目标命中率下降 1 阶段；若目标 HP 已低于 50%，改为下降 2 阶段。… | ANCIENT 层的灾害级职能来源 |

## 普通技能

逆鳞、精神强念、臂锤、地震、守住、蛮力。

## 技能循环

| 阶段 | 技能 | 目的 |
|---|---|---|
| 起手 | 争霸追猎弹 | 追踪锁定并禁止换人 |
| 核心 | 争霸压顶 | 在锁定后贴身重压 |
| 强化 | 分段躯体（特性） | 用三个部位抵挡伤害 |
| 控制 | 巢穴威压 / 恐惧凝视 | 压制目标行动 |
| 收尾 | 逆鳞 | 在目标无法脱身时全力收场 |

## 生态

* **生活环境**：感染区核心地带——它不像恐慑那样滞空，而是直接推进
* **食物**：不需要
* **猎物**：不筛选，一次锁定一个
* **天敌**：能连续破坏它三个部位的手段
* **行为**：锁定—追踪—压顶。**两段连携，没有第三段**
* **群体**：从不群居
* **巢穴**：ANCIENT 层不属于巢穴体系，它是**灾害本身**
* **繁殖**：不繁殖
* **与其他 SRP 宝可梦关系**：与远古恐慑一同拥有 `ServerBossEvent` 与 `AncientPart[]`；**两者是同级灾害，但一个空域一个近战**

## 进化 / 阶段

```
来源：无（ANCIENT 起点）
  ↓
当前：远古争霸（`csrp:anc_overlord`）
  ↓
【无直接宝可梦进化】

证据：`Kind.OVERLORD(250.0D, 15.0D, 20.0D, 0.23D)`、`private final ServerBossEvent bossEvent;`、
`private final AncientPart[] bodyParts;`，以及 `OverlordHomingGoal` / `OverlordMeleeGoal`。
```

## 图鉴描述 1

> 它不像恐慑那样在天上。它直接朝你走过来——而且它打出来的东西会拐弯。

## 图鉴描述 2

> 观察记录：生命 250.0，为 ANCIENT 层最高；Boss 级血条，3 个独立部位。
追踪弹必中且禁止换人；随后近战压顶威力提升 30%。
 ——结论：**它的两段是连着的。躲开第一段才有第二段的余地**。

## 质量检查

| 检查 | 结果 |
|---|---|
| Canon Check | **YES** — `csrp:anc_overlord` 注册存在（MobCategory `MONSTER`），tier 由 ANCIENT 来源确认 |
| Source ID Check | **YES** — `csrp:anc_overlord` |
| Tier Check | **YES** — ANCIENT |
| Skill Check | **YES** — 争霸追猎弹、争霸压顶 |
| Common Skill Check | **YES** — 10 个，且全部通过 tier 许可校验 |
| Lore Check | **NO 违规** — 见“宝可梦化改造”，原创机制均已标注为宝可梦化产物 |
| Gameplay Check | 输出（必中追踪 + 贴身重压的两段连携）、生存（250 HP + 3 部位 + Boss 保护）、控制（禁止换人 + 威压）——ANCIENT 层的近战灾害 |
| Similarity Check | 与远古恐慑**共享两项 ANCIENT 独有字段**（Boss 血条 + 部位数组），但**目标组完全不同**：恐慑是空域三套，它是追踪＋近战两套。 |

