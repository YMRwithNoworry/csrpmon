# Primitive / Adapted attribute table (read from the source)

`PrimitiveVariantEntity` and `AdaptedVariantEntity` each hold a `switch (kind)` that
assigns health / armor / damage / speed / knockbackResistance / followRange. These are the
actual numbers the design stats are calibrated against.

## Primitive tier

| Kind | health | armor | damage | speed | knockback | follow |
|---|---|---|---|---|---|---|
| ARACHNIDA | 35 | 4.0 | 15 | 0.30 | 0.20 | 36 |
| BOLSTER | 35 | 4.0 | 6 | 0.19 | 0.35 | 32 |
| BURROWER | 45 | 9.0 | 15 | 0.26 | 0.70 | 24 |
| DEVOURER | 60 | 4.0 | 20 | **0.0** | 1.0 | 24 |
| MANDUCATER | 30 | 4.0 | 12 | **0.35** | 0.50 | 24 |
| REEKER | 40 | **12.0** | 12 | 0.31234 | 0.60 | 24 |
| TOZOON | 45 | 9.0 | 15 | 0.26 | 1.0 | 24 |
| YELLOWEYE | 30 | 3.5 | 3.5 | 0.25 | 0.20 | 24 |

Note `DEVOURER: speed = 0.0` - it cannot move at all. That is why the adapted form
gaining `TryFindWaterGoal` and `RandomSwimmingGoal` is a change of category rather than a
stat bump: the species goes from immobile to mobile.

## Adapted tier

| Kind | health | armor | damage | speed | knockback | follow |
|---|---|---|---|---|---|---|
| BOLSTER | 105 | 19.0 | 36 | 0.17 | 0.90 | 32 |
| BURROWER | 95 | **24.0** | 27 | 0.32 | 1.0 | 32 |
| VERMIN | 115 | 15.0 | 45 | 0.25 | 0.65 | 32 |
| YELLOWEYE | 55 | 13.5 | 17 | 0.30 | 0.35 | - |

Others (ARACHNIDA, DEVOURER, LONGARMS, MANDUCATER, REEKER, SUMMONER, TOZOON, VISCERA)
use `applyConfiguredAttributes(...)` against `MobsConfig` getters instead of literals.

## What this says about the tier relationship

Every adapted entry is strictly bigger, but the shape of the change differs per pair,
which is what the designs try to preserve:

| Pair | Primitive | Adapted | The nature of the change |
|---|---|---|---|
| Devourer | speed 0.0 | gains water movement | immobile to mobile |
| Yelloweye | 30 / 3.5 / 3.5 | 55 / 13.5 / 17.0 | glass cannon to armoured battery |
| Bolster | damage 6, speed 0.19 | 36 damage, still slow | pure support to heavy support |
| Burrower | armor 9 | armor 24 | already tough, now very tough |

