# 【资料冲突】Seeker 的 tier 归属

## 冲突内容

任务白名单的 **K. Pure Parasites** 一节列出了八个名字：

```
Grunt / Light Bomber / Marauder / Monarch
Overseer / Vigilante / Warden / Seeker
```

但 CSRP 源码中，PURE 层只有 **7** 个成员。

## 两版本

### 版本 A（任务白名单）
Seeker 属于 PURE。

### 版本 B（CSRP 源码）
```
srp-creatures.json:  seeker.tierCode = "PREEMINENT"
                     seeker.tierBestiary = null
```

Seeker 的 tier 来自 **`RelayScanReportFactory.Tier` 代码枚举**，值为 **PREEMINENT**。
它在 bestiary 数据层没有独立条目（tierBestiary 为 null），因此代码枚举是唯一来源。

### 数值层的旁证
```
Kind.OVERSEER(true, false, 80.0D, 20.0D, 22.0D, 0.27D, 0.40D, 32.0D, 5.0F, 2.0D)
Kind.SEEKER  (true, false, 80.0D, 20.0D, 22.0D, 0.27D, 0.40D, 32.0D, 5.0F, 2.0D)
```

**两者参数逐项完全相同**，但 tier 不同。这说明源码在实现上把两者当作同规格的空中单位，
tier 的区分来自 tier 枚举而非数值。

## 当前设计采用

**PURE = 7 只**（grunt / bomber_light / marauder / monarch / overseer / vigilante / warden），
Seeker 保留在 **PREEMINENT** 层设计。

## 理由

1. `RelayScanReportFactory.Tier` 是本图鉴两大权威 tier 来源之一，它明确写 PREEMINENT。
2. Seeker 在 bestiary 层没有独立记录，没有第二来源可以推翻代码枚举。
3. **不为凑满白名单而把 Seeker 强行改判为 PURE**。规则 1 禁止为补齐名单而扭曲已有资料。

## 未做的事

- 没有把 `seeker` 改判为 PURE 以迎合名单。
- 没有创造第八只 PURE 生物来填位置。
- 没有把 Overseer 与 Seeker 合并成一个设计（它们是两个独立实体，尽管数值相同）。

## 影响

任务白名单的 PURE 一节将**只有 7 只被设计**。
Seeker 会在 PREEMINENT 层完成设计，并在此处交叉引用；
Overseer 的条目中已记录「数值与 Seeker 逐项相同但 tier 不同」这一事实。
