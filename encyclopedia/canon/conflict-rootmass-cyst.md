# 【资料冲突】Rootmass Cyst 的 tier 归属

> **状态：已解决（第 28 轮完成设计）**。本记录保留冲突的完整过程。

## 冲突内容

任务白名单的 **J. Deterrent Parasites** 一节列出了六个名字：

```
Dispatcher Tentacle / Kyphosis / Rootmass Cyst / Seizer / Sentry / Worm
```

但 CSRP 源码中，DETERRENT 层只有 **5** 个成员。

## 两版本

### 版本 A（任务白名单）
Rootmass Cyst 属于 DETERRENT。

### 版本 B（CSRP 源码）
```
entity.csrp.rooterball = "Rootmass Cyst"     ← 语言文件
bestiary/rooterball.json  "tier": "NEXUS"    ← 数据层
Kind.ROOTERBALL(Family.ROOTERBALL, 0, ...)   ← 代码
```

**"Rootmass Cyst" 就是 `csrp:rooterball`**，tier 字段写的是 **NEXUS**。

## 采用

**DETERRENT = 5 只**（dispatcherten / kyphosis / seizer / sentry / worm），
Rootmass Cyst 归入 **NEXUS**，已于第 28 轮完成设计（`pokedex/rooterball.md`）。

## 理由

1. CSRP 的 bestiary 数据是权威 tier 来源之一，明确写 NEXUS。
2. 源码中它由 Rooter 阶段体系产生（`Family.ROOTERBALL`），属于巢穴核心结构。
3. **不为凑满白名单而虚构第六只阻遏体**（规则 1）。

## 第 28 轮补充的关键证据

源码 `NexusParasiteEntity.tick()` 中：

```java
if (activeKind.isRooterBall()) {
    return;
}
```

该判断位于 tick 的**早期**，在移动、感知、召唤、铺雾、加持、成长之前。
**它跳过全部后续逻辑。**

配合它的枚举值：

```java
ROOTERBALL(Family.ROOTERBALL, 0, 20.0D, 10.0D, 0.0D, 0, 0, 0, 0.0F, 0.0D, 0)
```

——**攻击力、召唤数、同场上限、召唤冷却、方块硬度、方块范围、经验值，全部为 0。**

因此：

- 它不是阻遏体（阻遏体有攻击力、能铺雾、能擒握）
- 它是**全模组唯一的零行为结构体**
- 归入 NEXUS 是正确的：它是 Rooter 的产物，属于巢穴结构层

## 未做的事

- 没有把 `rooterball` 改判为 DETERRENT 以迎合名单。
- 没有创造一只新的阻遏体来填第 6 个位置。
- 没有为它发明任何攻击或召唤能力（源码里全部为 0）。
