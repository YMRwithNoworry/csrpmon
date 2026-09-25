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

## 2. The Mixin target really exists

The one risky assumption is the exact descriptor of the method the renderer bridge injects into.
Checked directly against the shipped Cobblemon jar:

```bat
javap -cp Cobblemon-neoforge-1.8.1+1.21.1.jar ^
  com.cobblemon.mod.common.client.render.pokemon.PokemonRenderer
```

```
public void render(com.cobblemon.mod.common.entity.pokemon.PokemonEntity, float, float,
                   com.mojang.blaze3d.vertex.PoseStack,
                   net.minecraft.client.renderer.MultiBufferSource, int);
```

This matches `PokemonRendererMixin`'s `method = "render(...)V"` exactly, so the injection point
resolves.

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

## 5. What is *not* covered by the above

Being honest about the limits of a headless run:

* **Visual verification of the renderer bridge.** The Mixin's target descriptor is verified and the
  class loads, but nothing here can confirm pixels. This needs `runClient` and a person looking at
  the screen.
* **The interaction and battle flow.** Starting a battle needs a player right-clicking a creature,
  so `WildEncounterManager` and the flee-restore path are compile-checked and logic-reviewed but not
  executed.
* **Pacification at runtime.** `ParasitePacifier` needs creatures to actually spawn and acquire
  targets.

These are the three things a short `runClient` session should confirm.

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
