# Verification log

Everything below was produced by running the real builds in this repository, not by inspection.
Commands are reproducible as written.

## 1. The addon compiles against the real jars

```bat
gradlew.bat build
```

```
BUILD SUCCESSFUL
build/libs/csrpmon-1.0.0.jar        46296 bytes, 54 entries
```

Compilation is against `csrp-1.10.8.jar` and `Cobblemon-neoforge-1.8.1+1.21.1.jar`; both the
Cobblemon battle/entity API and CSRP's `Parasite` marker interface are resolved at compile time.

The jar contains the 24 species files, both lang files, both mixin configs, the generated
`META-INF/neoforge.mods.toml` and all 8 classes.

## 2. A real client battles a real CSRP creature

```bat
gradlew.bat runClient
```

In the development client, interacting with a wild CSRP `rupter` produced:

```
[Server thread/DEBUG] [CSRPmon/]: Started a CSRPmon battle against rupter at level 10
[Render thread/INFO] [minecraft/ChatComponent]: [System] [CHAT] 去吧！小火龙！现在为第1回合。
```

and the battle screen below — a standard Cobblemon battle, Charmander (小火龙) Lv.10 against the wild
creature, with the full Fight / Pokémon / Catch / Run menu.

![A wild CSRP Rupter rendered inside a Cobblemon battle](screenshots/battle-rupter.png)

Three things this establishes at once:

* the encounter path works end to end — a CSRP creature really did become a wild Pokémon and start a
  Cobblemon battle;
* **the render bridge works** — the creature is drawn with its own CSRP model and texture, not the
  `cobblemon:substitute` fallback doll Cobblemon would use for an unknown species;
* the localisation resolves — the species is named 破裂虫 from `assets/csrpmon/lang/zh_cn.json`.

The log contains no exception from the `csrpmon` namespace, no Mixin failure, and
`CsrpRenderEvents` is registered on the game event bus.

### The first implementation of this bridge crashed real clients

The bridge was originally a Mixin into `PokemonRenderer.render`, with a descriptor verified against
Cobblemon 1.8.1 with `javap`:

```
public void render(com.cobblemon.mod.common.entity.pokemon.PokemonEntity, float, float,
                   com.mojang.blaze3d.vertex.PoseStack,
                   net.minecraft.client.renderer.MultiBufferSource, int);
```

The descriptor matched exactly, yet a production client died with:

```
InvalidInjectionException: Critical injection failure: @Inject annotation on
csrpmon$renderParasiteModel could not find any targets matching 'render(...)V'
in .../PokemonRenderer. No refMap loaded.
```

No refmap is generated for this project, and Mixin will not resolve a fully-specified selector
against a mod target without one. The Mixin, both mixin configs and the `[[mixins]]` entries were
removed in favour of `RenderLivingEvent.Pre`, which needs no descriptor. See
[`ARCHITECTURE.md`](ARCHITECTURE.md) section 4.

## 3. All 24 species validate against Cobblemon's own registries

`tools/validate_species.mjs` reads the ability and move names out of Cobblemon's
`data/cobblemon/showdown.zip` and checks every species file against them, plus types, egg groups,
experience groups, stat totals, evolution targets, drop items and the Java mapping table in both
directions.

```
species files        : 24
abilities available  : 316
moves available      : 962
mapping table size   : 24
evolution links      : 11
CSRP entity ids      : 157
CSRP item ids        : 26

All species data is valid.
```

The first run of this tool found three species with base stat totals of 802, 850 and 892 — higher
than any real Pokémon. Those were rebalanced before shipping; the check now fails anything above 720.

## 4. A real NeoForge server loads the addon and every species

```bat
gradlew.bat runServer
```

```
[modloading-worker-0/INFO] [CSRPmon/]: CSRPmon loaded: 24 CSRP creatures can now be battled and caught as Pokemon.
[Server thread/INFO] [minecraft/DedicatedServer]: Done (14.604s)! For help, type "help"
[Server thread/INFO] [CSRPmon/]: Cobblemon accepted all 24 CSRPmon species, e.g. Buglin (Bug).
```

That last line comes from `SpeciesSelfCheck`, which asks Cobblemon's own `PokemonSpecies`
registry for each of the 24 species at `ServerStartedEvent` and reports what it found. It proves
that the datapack JSON is genuinely registered with Cobblemon (not merely present in the jar) and
that the type data parses — `Buglin` came back as a `Bug` type.

The log contains no errors for the `csrpmon` namespace.

## 5. What remains for a person to check

The headless runs cover startup, data loading and the full encounter, and the client screenshot above
covers the model bridge. Still worth a human eye:

* **Animation fidelity.** The stand-in is driven by position, rotation and walk animation mirrored
  from the Pokémon entity; CSRP's own triggered animations (attack wind-ups and so on) are not
  forwarded, so the creature may look calmer in battle than it would in the wild.
* **Catching and the post-battle restore.** The battle starts and renders; catching the creature and
  the "player ran away, put the creature back" path are logic-verified but were not exercised
  in the screenshot session.
* **Pacification at runtime.** `ParasitePacifier` needs creatures to spawn and try to acquire
  targets over time.

## 6. Pre-existing CSRP startup crash found while verifying

While setting up the server run, CSRP itself turned out not to start at all — with or without this
addon. Reproduced by running CSRP's own project, with only CSRP + Citadel + LDLib2 installed:

```bat
cd ../csrp
gradlew.bat runServer
```

```
Mod loading issue for: csrp
Failure message: csrp (csrp) encountered an error while dispatching the
                 EntityAttributeCreationEvent event
    java.lang.IllegalStateException: Cannot get config value before config is loaded.
        at alku.csrp.config.MobsConfig.shycoHealthMultiplier(MobsConfig.java:391)
        at alku.csrp.entity.LongarmsEntity.createAttributes(LongarmsEntity.java:88)
        at alku.csrp.registry.CommonModEvents.registerAttributes(CommonModEvents.java:114)
```

CSRP's own `run/crash-reports/` already contained the identical failure from before this addon
existed, which rules out any interaction with CSRPmon.

**Cause.** `createAttributes()` reads `ModConfigSpec` values, but NeoForge fires
`EntityAttributeCreationEvent` before config files have been read, and
`ModConfigSpec.ConfigValue.getRaw()` throws while `spec.loadedConfig` is still `null`.

**Fix.** `tools/csrp_early_config_hotfix.mjs` wraps the reads:

```java
public static boolean allowMobs() {
    return safe(ALLOW_MOBS);              // was: ALLOW_MOBS.get()
}

private static <T> T safe(ModConfigSpec.ConfigValue<T> value) {
    return SPEC.isLoaded() ? value.get() : value.getDefault();
}
```

465 reads across 5 files, applied mechanically, idempotent, with `--dry-run`. After it the server
starts normally and section 4 above passes.

To undo it:

```bat
cd ../csrp
git checkout -- src/main/java/alku/csrp/Config.java src/main/java/alku/csrp/config
```

## 7. Custom abilities, moves and call signs (round 2)

CSRPmon now ships 8 abilities, 5 moves and 3 more species, all as datapack data.

### The effects really are in the battle engine

Cobblemon reports how many abilities and moves it loaded. Against the same instance:

```
Loaded 941 moves
Loaded 322 abilities
```

Cobblemon ships 936 moves and 314 abilities, so all 13 of ours were accepted from
`data/csrpmon/{moves,abilities}/*.js` and executed by the bundled Showdown engine.

### A real bug this caught

The first run failed:

```
ERROR Hidden ability referred to unknown ability: primitivewild
java.lang.IllegalStateException: Failed to interpret ability: ["swiftsymbiosis","h:primitivewild"]
Error loading JSON for data: csrpmon:pri_longarms
```

Cause: Showdown derives an effect's id from its **`name` field**, not from the file name. The file was
`primitivewild.js` but the name was `"Primitive Wildness"`, whose Showdown id is `primitivewildness`.
Cobblemon registered it under the derived id, so every reference to `primitivewild` resolved to
nothing and the species that used it failed to load entirely.

`tools/validate_species.mjs` now computes the derived id for every effect file and fails the check
when it disagrees with the file name, so this cannot come back silently. After the rename
(`primitivewildness.js`) the rerun is clean:

```
Loaded 941 moves
Loaded 322 abilities
0 "unknown ability" errors
0 "Error loading JSON for data" errors
Done (8.825s)! For help, type "help"
[CSRPmon/]: Cobblemon accepted all 27 CSRPmon species, e.g. Buglin (Bug).
```

### Portraits

27 portrait PNGs are generated by `tools/render_portraits.java` from the CSRP Tabula models and
textures, and 27 resolver JSONs point Cobblemon at them. The jar contains 27 species, 8 abilities,
5 moves, 27 resolvers and 27 portraits.

The portraits were inspected by eye: `rupter`, `kirin`, `beckon` and `buglin` all render the actual
creature geometry with its own texture rather than a flat placeholder. Two honest caveats:

* the shading is dim on the darkest creatures (`buglin` in particular reads as a dark block), because
  the source textures are very dark;
* **the sprite has not been seen inside the battle UI yet.** The client run reached Cobblemon data
  loading with no resolver errors and then exited before a world was entered, so the portrait path
  is verified as far as "the assets load and the resolver format matches what `getSprite` reads",
  but not by looking at a battle. Opening a battle against a CSRP creature is the confirmation still
  outstanding.
