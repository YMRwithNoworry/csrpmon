# Per-kind behaviour evidence (Primitive / Adapted)

Both tiers are implemented as one shared class with a `Kind` enum switch, so the
differences between the twelve parasites live in code rather than in separate files.
These tables were read straight out of the source and are what the designs are built on.

## Where it comes from

| Fact | Source |
|---|---|
| Primitive kinds | `entity/PrimitiveVariantEntity.java`, `enum Kind` |
| Adapted kinds | `entity/AdaptedVariantEntity.java`, `enum Kind` |
| Per-kind melee effects | the `switch (activeKind())` inside `doHurtTarget` |
| Per-kind AI | the `goalSelector.addGoal(...)` switch in each class |
| Per-kind constants | the `private static final` block of each class |
| Summon products | `SummonerEntity.summonBiomass()` |

Shared class javadoc, primitive tier: *"Each registered entity keeps its own type,
attributes, model, loot, and combat branch while sharing the common primitive
adaptation state."*

## Primitive tier - melee identity

| Kind | On-hit effect (source line) |
|---|---|
| ARACHNIDA | `MOVEMENT_SLOWDOWN` 80 ticks |
| BOLSTER | `VIRAL` 40 ticks, only when the virulent skin is active |
| DEVOURER | slams the target downward, `deltaMovement.y -= 0.5645` |
| MANDUCATER | 20% chance of `InfectionMechanics.applyCothEffect(target, this, 300, 0, false, true)` |
| REEKER | `POISON` 100 ticks; virulent skin adds `VIRAL`, berserker skin adds `BLEED`; also `launchSlime(target)` |

`push()` for MANDUCATER returns early while the entity is latched onto its target, which
is why it physically cannot be shoved off.

## Adapted tier - AI identity

| Kind | Goals (in priority order) |
|---|---|
| ARACHNIDA | `ArachnidaPullSkillGoal`, `ArachnidaWaterLeapGoal`, `ArachnidaMeleeGoal` |
| BOLSTER | `BolsterSupportGoal`, `BolsterOrbGoal`, `BarrageGoal`, `FastMeleeAttackGoal(1.20)` |
| BURROWER | burrow movement, `BurrowerMeleeGoal` |
| TOZOON | burrow movement, `TozoonAoeAttackGoal` |
| DEVOURER | `TryFindWaterGoal`, `DevourerMeleeGoal`, `RandomSwimmingGoal` |
| LONGARMS | `ShockwaveGoal`, `LongarmsMeleeGoal` |
| MANDUCATER | `CloakGoal`, `ManducaterEvadeGoal`, `ManducaterVomitGoal`, melee 1.20 |
| REEKER | `ChargeGoal`, melee 1.35 |
| SUMMONER | `SummonGoal`, `VomitGoal`, melee 1.05 |
| VERMIN | vermin target goals, `VerminFlightHeightGoal`, `VerminFlightAttackGoal` |

## The clearest Primitive to Adapted deltas

These are the numbers the designs lean on, because they quantify "the same species,
more specialised" rather than asserting it.

| Trait | Primitive | Adapted |
|---|---|---|
| Summoner total capacity | `TOTAL_SUMMON_CAPACITY = 4` | `SUMMONER_TOTAL_CAPACITY = 6` |
| Summoner per-summon count | `SUMMON_LIMIT = 2` | `SUMMONER_LIMIT = 1` |
| Summoner cooldown | `SUMMON_COOLDOWN_TICKS = 50` | `SUMMONER_COOLDOWN_TICKS = 40` |
| Summoner melee | none | `MeleeAttackGoal(1.05)` |
| Manducater tactics | latch and hold (`push()` early-return) | `CloakGoal` + `ManducaterEvadeGoal` + `ManducaterVomitGoal` |
| Longarms | `ShockwaveGoal`, scary orb, water leap, jump-at-higher | `ShockwaveGoal` + `LongarmsMeleeGoal` |
| Arachnida | melee slow only | gains `ArachnidaPullSkillGoal`, `ARACHNIDA_SKILL_SHOTS = 6` |
| Reeker | `ReekerRecruitFollowersGoal` | `ChargeGoal` |

## What the Summoner actually produces

```java
private boolean summonBiomass() {
    return BiomassEntity.spawnFromVomit(this, this, 5, List.of(
            new BiomassEntity.SummonOption(ModEntities.RUPTER.get(), 1.0D, 1)));
}
```

It conjures a biomass sac which hatches a **Rupter** - a real, already-designed
creature. `biomass` itself is registered as `MobCategory.MISC`, so the encyclopedia
treats it as an intermediate object rather than a Pokemon, and no summon in any design
references a creature outside the canon database.

