# Architecture and integration notes

This document records *why* CSRPmon is built the way it is, and exactly which Cobblemon and CSRP
APIs it depends on. It exists so the next person can extend the addon without re-deriving all of it.

Verified against **Cobblemon 1.8.1+1.21.1** (GitLab tag `1.8.1`, jar from Modrinth) and
**CSRP 1.10.8**. Every signature below was confirmed by compiling against the real jars.

---

## 1. Why the addon does not re-implement Pokémon

Cobblemon's battle engine is a Showdown port: turn resolution, the type chart, stat stages, status
conditions, weather, abilities, items, experience curves and the AI all live inside Cobblemon and are
driven by *data* (`Species`, `MoveTemplate`, `BattlePokemon`), not by entity classes. A wild battle
is started by handing Cobblemon a `PokemonEntity`:

```kotlin
// com.cobblemon.mod.common.battles.BattleBuilder
@JvmOverloads
fun pve(
    player: ServerPlayer,
    pokemonEntity: PokemonEntity,
    leadingPokemon: UUID? = null,
    battleFormat: BattleFormat = BattleFormat.GEN_9_SINGLES,
    cloneParties: Boolean = false,
    healFirst: Boolean = false,
    fleeDistance: Float = Cobblemon.config.defaultFleeDistance,
    party: PartyStore = player.party()
): BattleStartResult
```

So the addon's entire job is: **produce a `PokemonEntity` for a CSRP creature, and make it look like
that creature.** Everything else is Cobblemon.

## 2. Species registration is pure data

```kotlin
object PokemonSpecies : JsonDataRegistry<Species> {
    override val id = cobblemonResource("species")
    override val type = PackType.SERVER_DATA
    ...
}
```

`JsonDataRegistry.reload` walks `ResourceManager.listResources(resourcePath)` and keys each entry by
`<namespace>:<file name without extension>`. It does **not** filter by namespace, so an addon only has
to ship `data/<its own namespace>/species/<name>.json` — no registration call, no codec, nothing.

That is why all 24 species are plain JSON under `src/main/resources/data/csrpmon/species/`.

Field notes that cost time to establish:

* `implemented` must be `true`; Cobblemon treats unimplemented species as not-really-present.
* Stat keys are snake_case: `hp`, `attack`, `defence`, `special_attack`, `special_defence`, `speed`
  (British "defence").
* `experienceGroup` values are `erratic | fast | medium_fast | medium_slow | slow | fluctuating`.
* Egg groups use `water_1` / `water_2` / `water_3`, not `water1`.
* Evolutions are `{"variant": "level_up", "requirements": [{"variant": "level", "minLevel": N}]}`.
* Wild movesets come from `data/cobblemon/moveset_builders/wild.json`
  (`{"slot1": ["last_offensive","last_levelup"], ...}`), i.e. **the learnset is what a wild Pokémon
  actually fights with**.
* Unknown move names degrade to a dummy move with an error log (`Moves.getByNameOrDummy`), so a typo
  is silent-ish; `tools/validate_species.mjs` exists to catch that before it ships.
* The translation key is derived from the **name**, not the file name:
  `<namespace>.species.<name lowercased, non-alphanumerics stripped>.name`. `"Host II"` therefore
  needs the key `csrpmon.species.hostii.name`.

## 3. Creating the Pokémon

`PokemonProperties` parses the same shorthand the `/pokemon` command uses and can hand back a ready
entity:

```java
PokemonEntity pokemon = PokemonProperties.Companion
        .parse("species=csrpmon:rupter level=24")
        .createEntity(level, player);   // PokemonEntity(Level, Pokemon)
pokemon.moveTo(x, y, z, yaw, 0f);
level.addFreshEntity(pokemon);

BattleStartResult result = BattleBuilder.INSTANCE.pve(player, pokemon);
if (result instanceof SuccessfulBattleStart started) {
    UUID battleId = started.getBattle().getBattleId();
}
```

Wild level is derived from the creature's tier plus the world's CSRP evolution phase
(`SrpWorldData.get(serverLevel).evolutionPhase()`, 0–10), so the encounter difficulty tracks the
player's progress through SRP.

## 4. The model bridge (the hard part)

Cobblemon draws Pokémon through `PokemonRenderer`, which resolves a poser from
`VaryingModelRepository`, which loads **Blockbench Bedrock JSON** from
`assets/<namespace>/bedrock/pokemon/{models,posers,animations,resolvers}/`. An addon species with no
such assets renders as the `cobblemon:substitute` fallback doll.

Re-authoring 24 SRP creatures as Bedrock models was not an option: CSRP geometry is **Tabula JSON**
(`assets/csrp/tabula/`) driven by CSRP's own Citadel animation runtime, and the two formats do not
map onto each other without a converter.

Instead `PokemonRendererMixin` injects at the head of the one method that decides what a Pokémon
looks like:

```java
@Inject(
    method = "render(Lcom/cobblemon/mod/common/entity/pokemon/PokemonEntity;FLcom/mojang/blaze3d/vertex/PoseStack;Lnet/minecraft/client/renderer/MultiBufferSource;I)V",
    at = @At("HEAD"), cancellable = true, remap = false)
private void csrpmon$renderParasiteModel(PokemonEntity entity, ... , CallbackInfo ci) { ... }
```

That exact descriptor was verified against the shipped jar with `javap`:

```
public void render(com.cobblemon.mod.common.entity.pokemon.PokemonEntity, float, float,
                   com.mojang.blaze3d.vertex.PoseStack,
                   net.minecraft.client.renderer.MultiBufferSource, int);
```

For a `csrpmon` species the mixin cancels Cobblemon's rendering and delegates to
`CsrpCreatureVisuals`, which:

1. looks up the CSRP `EntityType` that the species maps back to,
2. keeps a **client-side stand-in** of that entity (`EntityType#create(ClientLevel)`), one per
   `PokemonEntity` id,
3. mirrors position, rotations, `tickCount`, `WalkAnimationState` and delta movement onto it every
   frame, so CSRP's animation code sees a normally-moving creature,
4. fetches the creature's **own** renderer from
   `Minecraft.getInstance().getEntityRenderDispatcher().getRenderer(standIn)` and calls it.

The creature therefore shows up with its real model, texture and animation — in the world and in the
battle scene, where Cobblemon has already moved the `PokemonEntity` into position.

Everything is wrapped in `try/catch`: if the bridge throws, the mixin does not cancel and Cobblemon
renders the species normally, so a rendering problem can never break a battle. `remap = false` is
correct because NeoForge 1.20.2+ runs with Mojang official names and does not remap mods, and
Cobblemon's classes are unobfuscated in the released jar.

## 5. Pacification

SRP parasites hunt with two goals:

```java
targetSelector.addGoal(1, new HurtByTargetGoal(this).setAlertOthers());
targetSelector.addGoal(2, new NearestAttackableTargetGoal<>(this, LivingEntity.class, 10, ...));
```

`ParasitePacifier` therefore:

* removes every `NearestAttackableTargetGoal` (and any goal whose class name contains
  `NearestAttackableTarget`) from both selectors when a creature joins the level, and
* vetoes `LivingChangeTargetEvent` unless the proposed target is `entity.getLastHurtByMob()`.

The second step is the real enforcement: it does not matter which goal asked for a target. The result
is a creature that ignores everything until something hits it, which is what "does not actively
attack anything" means in practice. `retaliateWhenAttacked = false` makes them fully passive.

## 6. Battle lifecycle

Cobblemon removes the wild `PokemonEntity` when it is caught or knocked out, but leaves it standing
when the player flees. `WildEncounterManager` polls `BattleRegistry.getBattle(id)` on the server tick
and, when the battle disappears:

* if the wild `PokemonEntity` is **still in the world** (the player ran), it is discarded and the
  original CSRP creature is spawned back at the recorded position with its proactive goals already
  stripped;
* if it is **gone** (caught or fainted) nothing is restored.

Polling avoids having to bridge Kotlin function types (`onEndHandlers` is a
`MutableList<(PokemonBattle) -> Unit>`) from Java for no benefit.

## 7. Build wiring

* NeoForge moddev **2.0.141**, Gradle 8.8, JDK 21.
* `compileOnly` on the Cobblemon jar, the CSRP jar and `kotlin-stdlib` — javac needs the stdlib to
  read annotations on Kotlin classes; without it the build fails with
  "unknown enum constant DeprecationLevel.WARNING".
* Parchment is **not** used. `maven.parchmentmc.org` is unreachable from the build environment used
  here; parameter names are not needed for this addon.
* `csrpmon.mixins.json` (common) and `csrpmon.client.mixins.json` (client) are declared in
  `neoforge.mods.toml` under `[[mixins]]`. The common config is deliberately empty but present, so
  the two configurations stay symmetric.
* Dev runs need the Cobblemon, Kotlin for Forge, Citadel, LDLib2 and CSRP jars in the run directory's
  `mods/` folder; putting them in `libs/` is not enough on its own, because FML does not discover
  mods from the compiler classpath in this setup.

## 8. Extending to more creatures

Adding a creature is three edits and no code:

1. add `data/csrpmon/species/<id>.json`,
2. add the `add("<csrp entity id>", "<species id>", tier, minLevel, maxLevel);` row to
   `ParasiteSpeciesMap`,
3. add the name/description keys to both lang files using the
   `<lowercased name with non-alphanumerics removed>` form.

Then run `tools/validate_species.mjs`, which fails the build if the two sides disagree.
