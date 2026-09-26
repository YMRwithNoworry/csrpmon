# 【实体确认状态】两个未归类实体的最终裁定

本图鉴正典初始收录 129 个实体记录，其中 **2 个**在两个 tier 来源中均无记录。
本轮（第 29 轮）已全部查清。

---

## 一、`csrp:marauder_tendril`（Marauder Tendril）——**已确认，已设计**

### 结论
**它是一个真实存在的实体，已按母体 tier 归类并完成设计。**

### 证据
```java
// registry/ModEntities.java:374
public static final DeferredHolder<EntityType<?>, EntityType<MarauderTendrilEntity>> MARAUDER_TENDRIL =
        monster("marauder_tendril", MarauderTendrilEntity::new, 0.6F, 2.0F);
```

```java
// entity/MarauderTendrilEntity.java
/**
 * Hitbox and detached-tendril implementation used by Marauder. Attached
 * instances are invisible collision targets; detached/support modes render the
 * legacy Esor tendril and retain their own short-lived combat behavior.
 */
public final class MarauderTendrilEntity extends Monster implements CitadelAnimatedEntity, Parasite {
```

属性：`MAX_HEALTH = 30.0D` / `ARMOR = 3.0D` / `ATTACK_DAMAGE = 5.0D` / `MOVEMENT_SPEED = 0.25D`

### tier 归属
- **无独立 tier 记录**，也无 bestiary 条目。
- 它是 `csrp:marauder`（**PURE**）的部件，直接对应掠夺者的 `TENDRIL_HEALTH_FRACTION` 常量。
- **本图鉴依母体归入 PURE，并在正典中标注 `inheritedTier: true` 与理由。**

### 为什么可以设计
规则 2 要求「无法确认是否真实存在」时标为待核实。
本实体**有注册、有独立类、有类注释、有属性**——**存在性是确证的**，缺的只是 tier 记录。
因此按规则 1（设计真实存在的生物）完成设计，并公开标注 tier 是继承而来。

---

## 二、`csrp:sim_dragonhead`（Walking Ender Dragon Head）——**已确认为别名，不设计**

### 结论
**它不是一只独立的生物，而是 `csrp:sim_dragonehead` 的兼容性别名。本图鉴不为它单独设计。**

### 证据（三重）

**① 注册常量名直接写明 COMPAT**
```java
// registry/ModEntities.java:292
public static final DeferredHolder<EntityType<?>, EntityType<AssimilatedDragonHeadEntity>> SIM_DRAGON_HEAD_COMPAT =
        monster("sim_dragonhead", AssimilatedDragonHeadEntity::new, 1.75F, 1.95F, 0.8F);
```
两个 id 映射到**同一个类** `AssimilatedDragonHeadEntity`：
```java
monster("sim_dragonehead", AssimilatedDragonHeadEntity::new, ...)
monster("sim_dragonhead",  AssimilatedDragonHeadEntity::new, ...)
```

**② bestiary 文件名与内部 id 不一致**

文件 `bestiary/sim_dragonhead.json` 的内容是：
```json
{
  "id": "csrp:sim_dragonehead",
  "tier": "WALKING_HEAD",
  "name_key": "entity.csrp.sim_dragonhead.name",
  ...
}
```

**文件名是 `sim_dragonhead`，但内部 `id` 字段写的是 `csrp:sim_dragonehead`。**
也就是说：这份文档本身**声明它描述的是 `sim_dragonehead`**，只是沿用了 `sim_dragonhead` 的名称键。

**③ tier 归属**
tier `WALKING_HEAD` 属于 `csrp:sim_dragonehead`，该实体已于第 16 轮完成设计（`pokedex/sim_dragonehead.md`）。

### 为什么不设计
如果为它单独设计，就会**凭空多出一只 SRP 不存在的生物**——这正是规则 1 明令禁止的
「创造不存在于 SRP 的新生物」。它是注册别名，不是新物种。

---

## 最终统计

| 项目 | 数量 |
|---|---|
| 正典收录的实体记录 | 129 |
| 确认为独立生物并完成设计 | **128** |
| 确认为别名、不设计 | **1**（`csrp:sim_dragonhead`） |
| 仍未核实 | **0** |

**两个实体均已裁定，不存在遗留的待核实项。**
