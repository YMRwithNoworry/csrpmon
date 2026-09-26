# NEXUS 阶段数值表（源码逐项）

来源：`entity/NexusParasiteEntity.java` 的 `Kind` 枚举。

构造签名：

```java
Kind(Family family, int stage, double maxHealth, double armor, double attackDamage,
     int bombCount, int activeCap, int summonCooldown,
     float maxBlockHardness, double blockRange, int experience)
```

## 全表

| Kind | Family | Stage | Health | Armor | Damage | bombCount | activeCap | summonCD | Hardness | blockRange | EXP |
|---|---|---|---|---|---|---|---|---|---|---|---|
| BECKON_SI | BECKON | 1 | 25.0 | 4.0 | 2.5 | 4 | 4 | 50 | 1.0 | 3.0 | 16 |
| BECKON_SII | BECKON | 2 | 60.0 | 8.0 | 6.0 | 5 | 6 | 45 | 1.0 | 3.0 | 32 |
| BECKON_SIII | BECKON | 3 | 110.0 | 16.0 | 13.0 | 6 | 8 | 40 | 1.0 | 3.0 | 64 |
| BECKON_SIV | BECKON | 4 | 220.0 | 25.0 | 20.0 | 8 | 12 | 40 | **5.0** | **18.0** | **220** |
| DISPATCHER_SI | DISPATCHER | 1 | 33.0 | 7.0 | 3.0 | 4 | 3 | 60 | 1.0 | 3.0 | 16 |
| DISPATCHER_SII | DISPATCHER | 2 | 70.0 | 14.0 | 7.0 | 5 | 5 | 55 | 2.0 | 6.0 | 32 |
| DISPATCHER_SIII | DISPATCHER | 3 | 130.0 | 21.0 | 14.0 | 6 | 7 | 50 | 3.0 | 9.0 | 64 |
| DISPATCHER_SIV | DISPATCHER | 4 | 250.0 | 28.0 | 22.0 | 8 | 9 | 45 | 5.0 | 18.0 | 220 |
| ROOTER_SI | ROOTER | 1 | 40.0 | 7.0 | 2.5 | 4 | 3 | 60 | **0.0** | **0.0** | 16 |
| ROOTER_SII | ROOTER | 2 | 80.0 | 14.0 | 6.0 | 5 | 5 | 55 | 2.0 | 6.0 | 32 |
| ROOTER_SIII | ROOTER | 3 | 150.0 | 21.0 | 13.0 | 6 | 7 | 50 | 3.0 | 9.0 | 64 |
| ROOTER_SIV | ROOTER | 4 | **300.0** | 28.0 | 20.0 | 8 | 9 | 45 | 5.0 | 18.0 | 220 |
| ROOTERBALL | ROOTERBALL | 0 | 20.0 | 10.0 | **0.0** | 0 | 0 | 0 | 0.0 | 0.0 | 0 |

## 三条推进轴

### 1. 四个共同递增的参数
```
bombCount       4 → 5 → 6 → 8       （装填数）
activeCap       3~4 → 5~6 → 7~8 → 9~12 （同场上限）
summonCooldown  50~60 → 45~55 → 40~50 → 40~45 （召唤冷却，逐阶缩短）
experience      16 → 32 → 64 → 220  （经验，四阶暴涨 3.4 倍）
```

### 2. 每个 Family 的血量曲线
```
BECKON      25 → 60 → 110 → 220
DISPATCHER  33 → 70 → 130 → 250
ROOTER      40 → 80 → 150 → 300   ← 同阶最高
```

### 3. Stage IV 的质变（三个 Family 共有）
```
maxBlockHardness  1.0~3.0 → 5.0
blockRange        3.0~9.0 → 18.0
```

**注意：BECKON 前三阶的 blockRange 全部是 3.0**，只有四阶跳到 18.0（6 倍）。
DISPATCHER 与 ROOTER 则是 3.0 → 6.0 → 9.0 → 18.0 的**渐进**曲线。
**这是三个 Family 之间最重要的结构差异。**

## 家族专属行为（源码 tick 分支）

```java
if (activeKind.family == Family.BECKON) { ... }       // 躯体动画 + temporaryLifetimeTicks
if (activeKind.family == Family.ROOTER && supportCooldown <= 0) { ... }
if (activeKind.family == Family.DISPATCHER && tickCount % 40 == 0) { ... }
```

相关常量：
```java
TEMPORARY_BECKON_LIFETIME = 300
DISPATCHER_FOG_MIN_Y_OFFSET = -2
DISPATCHER_FOG_MAX_Y_OFFSET = 4      // Dispatcher 会生成雾
```

字段：`private final List<String> storedParasiteIds` —— **所有 Nexus 都预先储存待召唤的个体 ID**。

## 源码注释

```java
// Summoning pillars cast every 2–3 seconds in the original game.
// Use a four-times faster cadence while retaining stage progression.
```

即：**CSRP 把召唤节奏加快了四倍**，但保留了阶段推进。

## ROOTERBALL（Rootmass Cyst）的异常

它是唯一 `stage = 0`、`family = ROOTERBALL` 的条目，且：
- `attackDamage = 0.0`
- `bombCount = activeCap = summonCooldown = 0`
- `maxBlockHardness = blockRange = 0.0`
- `experience = 0`

**它不属于任何阶段体系**，是 Rooter 产生的独立结构体。
这解释了为什么任务白名单把它列在 DETERRENT 而 CSRP 把它记为 NEXUS（见
`conflict-rootmass-cyst.md`）。
