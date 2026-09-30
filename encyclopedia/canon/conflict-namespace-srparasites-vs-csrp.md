# 【资料冲突】命名空间：`srparasites:` 与 `csrp:`

## 冲突内容

规则 2 要求每只宝可梦标注：

```
SRP Source：srparasites:xxxx
```

但本仓库对接的 CSRP 1.10.8 中，**不存在 `srparasites` 命名空间的实体**。所有实体都注册在 `csrp` 下。

---

## 版本 A：`srparasites:xxxx`

- 来源：任务书规则 2 的原文写法，也是原版 Scape and Run: Parasites 的命名空间。
- 该命名空间在本仓库对接的版本中**无法解析**：用 `srparasites:buglin` 取不到实体类型。

## 版本 B：`csrp:xxxx`

- 来源：CSRP 1.10.8 的实际代码。

证据一 —— 模组 ID 就是 `csrp`：

```java
// Csrp.java:38
public static final String MODID = "csrp";
```

证据二 —— CSRP 自己写了从旧命名空间到新命名空间的转换：

```java
// compendium/client/CompendiumEntry.java:9
String mappedId = originalId.startsWith("srparasites:")
        ? "csrp:" + originalId.substring("srparasites:".length()) : originalId;
```

这段代码**逐字确认了对应关系**：把 `srparasites:` 前缀替换为 `csrp:`，路径部分保持不变。

证据三 —— 旧命名空间还留了一个命令别名，说明它是从旧版本沿用下来的历史名称：

```java
// command/SrpCommands.java:121
return admin("srparasites")
```

证据四 —— 图鉴数据全部使用新命名空间：`assets/csrp/bestiary/*.json` 的 `id` 字段经检查全部为 `csrp:` 前缀，无一处 `srparasites`。

---

## 当前设计采用

**采用版本 B：`csrp:xxxx`。**

本图鉴全部 128 条条目的 SRP Source 均写作 `csrp:<路径>`。

## 理由

规则 2 的目的是「用真实存在的 Source ID 防止误造实体」。

- 写 `srparasites:buglin` **无法在本版本中解析**，反而会变成一个查不到的 ID，与该规则的目的相反。
- 写 `csrp:buglin` 可以从 `ModEntities` 直接查到注册项，是**可验证的**真实 ID。
- 两种写法**路径部分完全一致**，只是命名空间前缀不同，因此不会造成任何一只生物的身份歧义。

## 对应法则

```
srparasites:X  ≡  csrp:X
```

例如：

| 任务书写法 | 本版本实际 ID | 图鉴条目 |
|---|---|---|
| `srparasites:buglin` | `csrp:buglin` | `pokedex/buglin.md` |
| `srparasites:anc_overlord` | `csrp:anc_overlord` | `pokedex/anc_overlord.md` |

**未创造任何第三种命名空间，也未因该差异虚构或改名任何生物。**
