# No.8091 掠夺化熊 / Marauderized Bear

| | |
|---|---|
| **SRP Source** | `csrp:mar_bear` |
| **SRP 原名** | Marauderized Bear |
| **SRP 分类** | ASSIMARA（`RelayScanReportFactory.Tier.ASSIMARA` 与 `bestiary/mar_bear.json` 一致） |
| **宝可梦属性** | 虫 / 格斗 |
| **分类名** | 拖拽炮击掠夺宝可梦 |
| **身高** | 1.6 m |
| **体重** | 196 kg |

## 基础种族值

| HP | 攻击 | 防御 | 特攻 | 特防 | 速度 | 总和 |
|---|---|---|---|---|---|---|---|
| 84 | 92 | 60 | 66 | 50 | 40 | **392** |

总和 392。SRP 中 health 38.0 / armor 8.0 / damage 15.0 / knockbackResistance 0.8 / speed 0.25 / **followRange 64**。它的核心是三个写死的齐射常量：**VOLLEY_SHOTS = 7**、**VOLLEY_INTERVAL_TICKS = 20**、**VOLLEY_COOLDOWN_TICKS = 300**。

## 设计核心

“它不冲过来。**它先用七发把你钉住，再把你拖过去。**”

## 视觉设计

| 部位 | 设计 | 来源 |
|---|---|---|
| 头部 | 熊头保留，额部被寄生组织撑开并露出一组发射腔 | 7 连齐射 |
| 眼睛 | 两处暗红光点，开火时同步闪烁 | VOLLEY_INTERVAL_TICKS = 20 |
| 背部 | 背侧有七组可依次开合的骨刺发射腔 | VOLLEY_SHOTS = 7 |
| 前掌 | 巨大的熊掌保留，用于拖拽 | 推拽攻击 |
| 躯干 | 体型未明显膨胀，但肩部异常加厚 | armor 8.0 |
| 颜色 | 深红寄生组织 + 残留的棕熊毛 | SRP 模型配色 |

**动作姿势**：四足站立、前掌抓地；齐射时背侧发射腔按固定间隔依次张开，最后一发后立刻向前扑。

## SRP 特征保留

1. **7 连齐射**——VOLLEY_SHOTS = 7、VOLLEY_INTERVAL_TICKS = 20
2. **300 tick 长冷却**——VOLLEY_COOLDOWN_TICKS = 300，说明这是它的开团手段而不是常规输出
3. **拖拽控制**——TetheredMarauderizedEntity 类注释：Shared capture state for the legacy Marauderized bear and enderman pull attacks
4. **最远的感知范围**——followRange 64
5. **15% 流血几率**——MarauderizedParasiteEntity 的共享常量 BLEED_CHANCE = 0.15F，所有掠夺化体的攻击都有概率造成流血
6. **攻击动画时长 12 tick**——ATTACK_ANIMATION_TICKS = 12，与其他层级的攻击节奏不同
7. **来源**——掠夺化体是掠夺者（Marauder，PURE 层级）把生物改造后的产物

## 宝可梦化改造

* **「先齐射再拖拽」是源码里的两段式设计**：TetheredMarauderizedEntity 的注释明确把 bear 与 enderman 放在一起讲 pull attacks。我把它完整保留为「远程压制 → 拉近距离」的连段
* **300 tick 的冷却很长**，说明齐射是开团技能而不是常规输出。我据此把它做成「每场只能用有限次数的高压开局」
* 它是掠夺化体里 followRange 最远的之一（64），所以它的定位是**先发现你、先钉住你**

## 特性

**普通特性：拖拽索（`tetherpull`）**

自身使用齐射类招式后，若目标仍在我方场上，下一回合的接触类招式**必定命中且先制 +1**（对应拉近后的近身扑击）。

**隐藏特性：七连装填（`sevenround`）**

自身使用齐射类招式时**连续攻击 7 次**（每次威力较低）；使用后该招式进入 3 回合冷却。对应 VOLLEY_SHOTS = 7 与 VOLLEY_COOLDOWN_TICKS = 300。

## 独家技能 1：七连骨刺 / Seven-Round Volley

| 字段 | 值 |
|---|---|
| 属性 | 虫 |
| 分类 | 特殊 |
| 威力 | 22 |
| 命中 | 95 |
| PP | 5 |
| 范围 | 单体，全场 |

**效果**：**连续攻击 7 次**（每次威力 22，合计约 154）。使用后本招式**进入 3 回合冷却**。**使用后下一回合自身的接触类招式先制 +1**（拖拽）。

**触发条件**：无。

**视觉表现**：背侧七组发射腔按 20 tick 的固定间隔依次张开，连续射出七枚骨刺球，节奏稳定得几乎像机械。

**为什么只有它**：VOLLEY_SHOTS = 7、VOLLEY_INTERVAL_TICKS = 20、VOLLEY_COOLDOWN_TICKS = 300 三个常量的完整翻译。**它是全族唯一「多段齐射 + 长冷却 + 后续拖拽」三合一的招式**。

## SRP 通用技能（7 个）

| 技能 | 属性 | 类别 | 效果 | 为什么它可以学 |
|---|---|---|---|---|
| [寄生接触](../skills/SRP-COMMON-SKILLS.md) | 虫 | 物理 | 接触并把巢群信号注入目标。命中后目标获得 1 层【感染】。若使用者连续两回合对同一目标使用，层数再 +1（同一招式的连击计数从 SRP 的持… | 掠夺化体的接触注染 |
| [裂创](../skills/SRP-COMMON-SKILLS.md) | 一般 | 物理 | 命中后使目标流血 3 回合。流血期间目标每回合结束损失 1/16 最大 HP；**目标在本回合使用过切换或加速类招式时，该回合流血伤害翻倍*… | BLEED_CHANCE = 0.15F 的流血效果 |
| [撕裂追击](../skills/SRP-COMMON-SKILLS.md) | 恶 | 物理 | 先制 +1。若目标身上有流血层数，威力提升为 50×(1+层数×0.5)；目标替换下场时该招式在入场者身上立即再结算一次流血伤害。… | 拖拽后的近身追击 |
| [猎物标记](../skills/SRP-COMMON-SKILLS.md) | 一般 | 变化 | 标记目标 3 回合：本阵营对其造成的伤害 +15%，且其逃跑必定失败。… | 齐射前必须锁定目标 |
| [感染之球](../skills/SRP-COMMON-SKILLS.md) | 毒 | 特殊 | 无视命中判定（必中）造成伤害，并附加 1 层感染。… | 骨刺球属于球体类投射物 |
| [动作迟滞](../skills/SRP-COMMON-SKILLS.md) | 地面 | 变化 | 目标速度下降 1 阶段，且其下回合使用的先制招式失效（先制度视为 0）。… | 七连齐射的连续冲击 |
| [腐蚀标记](../skills/SRP-COMMON-SKILLS.md) | 毒 | 变化 | 标记目标 3 回合：其受到的钢/岩属性抗性视作不存在（弱点照常计算），且每回合结束防御 -1 阶段（最多 -3）。… | 骨刺球持续磨损护甲 |

## 普通技能

飞叶快刀、劈开、咬碎、剑舞、守住、蛮力。

## 技能循环

| 阶段 | 技能 | 目的 |
|---|---|---|
| 起手 | 七连骨刺 | 用 7 段齐射完成高压开局 |
| 核心 | 劈开 / 咬碎 | 在拖拽命中后近身输出 |
| 强化 | 剑舞 / 七连装填（特性） | 把齐射与近战的衔接拉开 |
| 控制 | 动作迟滞 / 腐蚀标记 | 削弱目标行动 |
| 收尾 | 蛮力 | 在目标被拉到身边后收场 |

## 生态

* **生活环境**：感染区各处——掠夺者改造出的产物，没有固定领地
* **食物**：被拖过来的猎物
* **猎物**：远距离目标（followRange 64）
* **天敌**：能在齐射冷却期内贴近它的单位
* **行为**：远距离齐射—拖拽—近身结束。**不打持久战**
* **群体**：通常单独出现
* **巢穴**：掠夺者的**改造产物**，不隶属于巢穴
* **繁殖**：不繁殖，由掠夺者改造生物而成
* **与其他 SRP 宝可梦关系**：与掠夺化末影人共享 TetheredMarauderizedEntity 的拖拽机制（源码注释把两者并列）

## 进化 / 阶段

```
来源：被掠夺者改造的熊
  ↓
当前：掠夺化熊（csrp:mar_bear）
  ↓
【无直接宝可梦进化】

证据：MarauderizedBearEntity 的 createMarauderizedAttributes(38.0D, 8.0D, 15.0D, 0.8D, 0.25D, 64.0D)
与三个齐射常量；父类 TetheredMarauderizedEntity 的拖拽注释。
```

## 图鉴描述 1

> 它不靠近你，它先打你七次——然后你发现自己已经站在它面前了。

## 图鉴描述 2

> 观察记录：齐射 7 发，间隔 20 tick，全部射完后有 300 tick 冷却。
齐射结束后样本立刻前扑，命中率显著高于平时。
 ——结论：**七发不是伤害，是绳子**。

## 质量检查

| 检查 | 结果 |
|---|---|
| Canon Check | **YES** — `csrp:mar_bear` 注册存在（MobCategory `MONSTER`），tier 由 ASSIMARA 来源确认 |
| Source ID Check | **YES** — `csrp:mar_bear` |
| Tier Check | **YES** — ASSIMARA |
| Skill Check | **YES** — 七连骨刺 |
| Common Skill Check | **YES** — 7 个，且全部通过 tier 许可校验 |
| Lore Check | **NO 违规** — 见“宝可梦化改造”，原创机制均已标注为宝可梦化产物 |
| Gameplay Check | 输出（7 段齐射）、控制（拖拽 + 先制）、扩散（感染）——ASSIMARA 层的远程开团型 |
| Similarity Check | 与掠夺化末影人的区别：末影人靠**传送**直接贴脸，熊靠**齐射 + 拖拽**把你拉过来。同样是 pull attacks，一个用空间，一个用骨刺。 |

