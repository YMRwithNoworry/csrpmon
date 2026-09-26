# Parasite Pokémon Encyclopedia

Turning every **real** Scape and Run: Parasites creature into a Pokémon design.

> **Absolute rule:** no SRP creature is ever invented. Every design must cite a `csrp:<id>` that is
> provably registered in the CSRP source. If existence cannot be proven, the entry is marked
> 【待核实】 and left undesi gned rather than guessed.

## Why this can be done rigorously here

This repository sits next to the CSRP 1.10.8 source, so the encyclopedia is built by **reading the
mod**, not by recalling it:

| Question | Where the answer comes from |
|---|---|
| Does this creature exist? | `registry/ModEntities.java` - the register call and its `MobCategory` |
| What tier is it? | `relay/RelayScanReportFactory.java` - the `Tier` enum lists every creature |
| Second opinion on tier | `assets/csrp/bestiary/<id>.json` - the `tier` field |
| What is it called? | `assets/csrp/lang/{en_us,zh_cn}.json`, key `entity.csrp.<id>` |
| Which mechanics exist to base skills on? | `registry/ModMobEffects.java` - 28 registered effects |

## Progress

| Step | Deliverable | Status |
|---|---|---|
| 1 | SRP Creature Canon Database | **done** - [canon/SRP-CREATURE-CANON.md](canon/SRP-CREATURE-CANON.md) |
| 2 | Source ID / existence check | **done** - 129 creatures confirmed, 34 non-creatures excluded |
| 3 | SRP Common Skill Database (40-70) | **done** - 66 skills, [skills/SRP-COMMON-SKILLS.md](skills/SRP-COMMON-SKILLS.md) |
| 4 | Tier / ecology permission matrix | **done** - encoded per skill in the `tiers` field |
| 5 | Real relationships between creatures | partial - pri->ada pairs and nexus stages are extracted from the data; the rest is next |
| 6 | Per-creature Pokemon designs | not started |
| 7 | Per-creature skill tables | not started |
| 8-10 | Canon / similarity / gameplay review, final encyclopedia | not started |

## What the canon pass actually found

* **129 creatures** have `MobCategory.MONSTER`/`CREATURE`; **34** registered entities are projectiles,
  orbs, effects or body parts and are excluded from design.
* **16 tiers** exist across the two sources: INBORN, ASSIMILATED, WALKING_HEAD, ASSIMARA, HIJACKED,
  FERAL, CRUDE, PRIMITIVE, ADAPTED, NEXUS, DETERRENT, PURE, PREEMINENT, DERIVED, ANCIENT, ABOMINATION.
* **1 tier conflict**, recorded rather than silently resolved: `csrp:dispatcherten` is DETERRENT in
  the bestiary but NEXUS in the code enum. The bestiary wins because the user-provided whitelist also
  files Dispatcher Tentacle under Deterrent Parasites - two sources against one.
* **2 creatures are untiered** (`csrp:sim_dragonhead`, `csrp:marauder_tendril`) and stay
  【待核实】.
* **6 bestiary entries have no entity at all**: `smar_bear`, `smar_cow`, `smar_enderman`, `smar_human`,
  `smar_sheep`, `smar_villager`. They cannot be designed - there is nothing to point at. The similarly
  named `mar_*` set (ASSIMARA) does exist and is used instead.
* Of the statuses the brief suggested for the skill pool, these are **confirmed present**: Vomit,
  Spotted, Heightened Senses, Prey, Concussive Smoke Trail (`dod_smoke_trail`), Braining is a CSRP
  effect as well. These are **not present in CSRP** and are therefore not used as SRP sources:
  Conta, Overheating, Frostbite, Indeaf, Positive/Negative.

## Layout

```
encyclopedia/
  canon/
    srp-creatures.json          machine-readable canon (129 creatures)
    SRP-CREATURE-CANON.md       the same, readable, with evidence and conflicts
  skills/
    srp-common-skills.json      machine-readable skill pool (66 skills)
    SRP-COMMON-SKILLS.md        the same, readable, with tier permissions
```

## Regenerating

Both databases are produced by scripts that read the CSRP source, so they can be rebuilt when CSRP
moves: the tier table is parsed from `RelayScanReportFactory.java`, existence from `ModEntities.java`,
names from the lang files, and the skill pool is validated against the canon tiers (a skill may not
grant itself to a tier that does not exist).

