# 【资料冲突】Rootmass Cyst 的 tier 归属

## 冲突内容

任务白名单的 **J. Deterrent Parasites** 一节列出了六个名字：

```
Dispatcher Tentacle
Kyphosis
Rootmass Cyst
Seizer
Sentry
Worm
```

但 CSRP 源码中，DETERRENT 层只有 **5** 个成员。

## 两版本

### 版本 A（任务白名单）
Rootmass Cyst 属于 DETERRENT。

### 版本 B（CSRP 源码）
```
entity.csrp.rooterball = "Rootmass Cyst"     ← 语言文件
bestiary/rooterball.json  "tier": "NEXUS"    ← 数据层
```

**"Rootmass Cyst" 就是 `csrp:rooterball`**，而它的 bestiary tier 字段写的是 **NEXUS**。
它由 Rooter（`rooter_si` … `rooter_siv`）产生，属于 Nexus 层。

### 已在正典中的记录
`srp-creatures.json` 中 `rooterball` 的 tierCode 与 tierBestiary 均为 NEXUS，
因此本轮之前它一直被计入 NEXUS（13 只），而不是 DETERRENT。

## 当前设计采用

**DETERRENT = 5 只**（dispatcherten / kyphosis / seizer / sentry / worm），
Rootmass Cyst 保留在 **NEXUS** 层设计。

## 理由

1. CSRP 的 bestiary 数据是权威 tier 来源之一，它明确写 NEXUS。
2. 源码中 Rootmass Cyst 由 Rooter 阶段体系产生，行为上属于巢穴核心而非外围阻遏。
3. 更重要的：**不为凑满白名单而虚构第六只阻遏体**。规则 1 明确禁止为了补齐名单而创造不存在的 SRP 生物。

## 未做的事

- 没有把 `rooterball` 改判为 DETERRENT 以迎合名单。
- 没有创造一只新的阻遏体来填第 6 个位置。
- 没有把 `dispatcherten` 之外的任何实体重新命名。

## 影响

任务白名单的 DETERRENT 一节将**永远只有 5 只被设计**。
第 6 个位置（Rootmass Cyst）会在 NEXUS 层完成设计，并在此处交叉引用。
