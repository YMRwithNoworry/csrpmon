# NEXUS 三家族的机制差异（源码）

三个家族共用同一张阶段数值表（见 `nexus-stage-table.md`），
但**家族行为完全不同**。这一点来自 `NexusParasiteEntity.tick()` 的分支。

## 1. BECKON（召唤柱）

```java
if (activeKind.family == Family.BECKON) {
    if (getParasiteStatus() == 0) { setBODY(0.04F);  }  // Expand body
    else                          { setBODY(-0.04F); }  // Contract body
}
if (activeKind.family == Family.BECKON && temporaryLifetimeTicks > 0
        && --temporaryLifetimeTicks <= 0) {
    discard(); return;
}
```

- 躯体做**膨胀 / 收缩**动画
- `TEMPORARY_BECKON_LIFETIME = 300` —— 临时召唤柱**会自行消失**

## 2. ROOTER（根须柱）

```java
if (activeKind.family == Family.ROOTER && supportCooldown <= 0) {
    applyRooterSupport(activeKind.stage);
    // Rooter pillars provide battlefield support on the same accelerated
    // cadence as their direct summons (one pulse per second).
    supportCooldown = 50;
}
```

`applyRooterSupport(stage)` 的实际内容：

```java
getBoundingBox().inflate(16.0D + stage * 4.0D)   // 半径 = 16 + 4×stage
ally.addEffect(PIVOT,  300, Math.max(0, stage - 1))
ally.addEffect(PARATE, 300, Math.max(0, stage - 1))
StatusEffectEvents.linkToRooter(ally, this)
```

- **半径随阶数增长**：stage 1 = 20 格 → stage 4 = **32 格**
- 施加两个命名效果 **PIVOT** 与 **PARATE**，等级 = `stage - 1`
- 通过 `linkToRooter` 把友军**登记为自己的下属**（`ROOTER_OWNERS` 映射）
- **排除**其他 ROOTER 与 ROOTERBALL（不给自己人加）

→ **Rooter 不召唤生物，它给战场上的寄生体加 buff 并建立从属关系。**

## 3. DISPATCHER（调度柱）

```java
if (activeKind.family == Family.DISPATCHER && tickCount % 40 == 0) {
    storeNearbyParasite();
    placeNestFog(activeKind.stage);
}
if (activeKind.family == Family.DISPATCHER && activeKind.stage == 4) {
    tryPlaceFirstColony();
}
```

### storeNearbyParasite()
以 `FOLLOW_RANGE` 为范围搜索附近的寄生体，把其实体 ID 写入 `storedParasiteIds`。

### placeNestFog(stage)
```java
int count  = Math.min(3, 1 + stage);      // 铺雾块数，二阶起封顶 3
int radius = dispatcherFogRadius(stage);  // 半径随阶数增长
```
Y 轴偏移范围：`DISPATCHER_FOG_MIN_Y_OFFSET = -2` 到 `DISPATCHER_FOG_MAX_Y_OFFSET = 4`

### tryPlaceFirstColony() —— 仅 stage 4
```java
if (tickCount < 1_200 || random.nextInt(10) != 0) return;
if (!SrpWorldData.get(serverLevel).colonies().isEmpty()) {
    colonyPlacementProgress = -1_000; return;
}
```
- 启动 1200 tick（60 秒）后开始尝试，每次 1/10 概率
- **仅当世界上一块殖民地都没有时才会建立**

→ **终阶调度柱是全世界的「第一块殖民地」奠基者。**

## 4. 三家族扩张节奏的差异

| Family | blockRange 一阶→四阶 |
|---|---|
| BECKON | 3.0 → 3.0 → 3.0 → **18.0**（最后暴增） |
| DISPATCHER | 3.0 → 6.0 → 9.0 → 18.0（渐进） |
| ROOTER | 0.0 → 6.0 → 9.0 → 18.0（渐进，一阶为 0） |

**BECKON 前三阶完全不扩张**，另两个家族逐阶扩张。
这是三个家族最重要的结构差异。

## 5. 阶段晋级机制

```java
if (canGrow && growthDelayTicks > 0 && level() instanceof ServerLevel serverLevel) {
    int phase = SrpWorldData.get(serverLevel).evolutionPhase();
    int minimumPhase = activeKind.stage + 2;
    if (phase >= minimumPhase && (phase > minimumPhase || tickCount % 4 == 0)
            && ++growthTicks >= growthDelayTicks && evolve()) {
        return;
    }
}
```

**Nexus 会在世界进化相位达到 `stage + 2` 时自行晋级到下一阶。**
即：世界里寄生体的整体进化程度，决定了 Nexus 能长到第几阶。
这解释了 `rooterball` bestiary 中的 `minlorekill` / `minstatkill` 字段为何存在。
