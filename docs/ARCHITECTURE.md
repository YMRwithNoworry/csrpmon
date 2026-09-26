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

### The approach that failed

The first implementation was a Mixin into Cobblemon's renderer:

```java
@Mixin(value = PokemonRenderer.class, remap = false)
public abstract class PokemonRendererMixin {
    @Inject(
        method = "render(Lcom/cobblemon/mod/common/entity/pokemon/PokemonEntity;FLcom/mojang/blaze3d/vertex/PoseStack;Lnet/minecraft/client/renderer/MultiBufferSource;I)V",
        at = @At("HEAD"), cancellable = true, remap = false)
    // ...
}
```

The descriptor is byte-for-byte correct — `javap` against the shipped Cobblemon 1.8.1 jar shows
exactly one matching method, and the mixin applies in a development client. **In a production client
it crashes the game:**

```
Mixin apply for mod csrpmon failed csrpmon.client.mixins.json:PokemonRendererMixin
  InvalidInjectionException: Critical injection failure: @Inject annotation on
  csrpmon$renderParasiteModel could not find any targets matching 'render(...)V'
  in com/cobblemon/mod/common/client/render/pokemon/PokemonRenderer. No refMap loaded.
```

`No refMap loaded` is the whole story: moddev generates no refmap for this project, and Mixin will
not resolve a fully-specified selector against a *mod* target without one. A selector that happens to
be correct is not the same as one Mixin will accept — and a cosmetic feature must never take the
client down. The Mixin was removed, along with both mixin configs and their `[[mixins]]` entries.

### What replaced it

`CsrpRenderEvents` listens to an ordinary NeoForge event:

```java
@EventBusSubscriber(modid = Csrpmon.MODID, value = Dist.CLIENT)
public final class CsrpRenderEvents {
    @SubscribeEvent
    public static void onRenderLivingPre(RenderLivingEvent.Pre<PokemonEntity, PosablePokemonEntityModel> event) {
        // ...
        if (CsrpCreatureVisuals.render(pokemon, yaw, event.getPartialTick(),
                event.getPoseStack(), event.getMultiBufferSource(), event.getPackedLight())) {
            event.setCanceled(true);
        }
    }
}
```

This needs no method descriptor, so no signature change, mapping or missing refmap can break it. It
fires only for the Pokémon entity type, and cancelling it skips Cobblemon's model while a CSRP
renderer draws instead.

`CsrpCreatureVisuals` then:

1. identifies the species and maps it back to the CSRP `EntityType`,
2. keeps a **client-side stand-in** of that entity (`EntityType#create(ClientLevel)`), one per
   `PokemonEntity` id, capped at 128 entries,
3. mirrors position, rotations, `tickCount`, `WalkAnimationState` and delta movement onto it every
   frame, so CSRP's animation code sees a normally-moving creature,
4. fetches the creature's **own** renderer from
   `Minecraft.getInstance().getEntityRenderDispatcher().getRenderer(standIn)` and calls it.

Everything sits inside `try/catch`: a failure is logged once and leaves Cobblemon's own rendering in
place, so a rendering problem degrades to a Substitute doll instead of crashing.

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

## 9. Custom abilities and moves are JavaScript, not JSON

`Abilities` and `Moves` are `DataRegistry`s that do not read JSON at all. They collect every
`data/<namespace>/{abilities,moves}/*.js`, hand the text to the bundled Showdown engine via
`ShowdownService.service.sendRegistryData(map, "ability"|"move")`, and then read the engine's
registry back:

```kotlin
manager.listResources("moves") { it.path.endsWith(".js") }.forEach { (identifier, resource) ->
    moveScripts[identifier.path] = resource.open().bufferedReader().use { it.readText() }
}
ShowdownService.service.sendRegistryData(moveScripts, "move")
val movesJson = ShowdownService.service.getRegistryData("move")
```

Each file is the bare body of a Showdown effect — a single `{ ... }`, no comments, no wrapper — and
the engine fills in the id from the file name. Two consequences that are easy to get wrong:

1. **The `name` field must produce the same id as the file name.** Showdown computes the id as
   `name` lowercased with every non-alphanumeric removed, and Cobblemon registers the effect under
   *that* id. `primitivewild.js` containing `name: "Primitive Wildness"` registers as
   `primitivewildness`, and every reference to `primitivewild` silently resolves to nothing — which
   fails the whole species it appears in. This is verified and guarded against in
   `tools/validate_species.mjs`.
2. New effects must **omit** `num`; only effects that replace a vanilla one should carry its number.

The hooks used here were checked against the bundled engine rather than assumed, and each effect is
derived from a real one: `onSourceDamagingHit` from `poisontouch`, `onSourceAfterFaint` from `moxie`,
`onSetStatus` from `insomnia`, `onModifyAtk`/`onModifySpe` from `swarm`, `multihit`/`drain` from
`bulletseed`/`absorb`.

Cobblemon 1.8 cannot add new **status conditions** from a datapack, so the "寄生" (parasite) status is
the existing Leech Seed volatile, applied by `parasiticinstinct`.

## 10. Portraits come from the sprite path, not the model path

The battle UI calls `drawPosablePortrait`, which is:

```kotlin
val sprite = VaryingModelRepository.getSprite(identifier, state, SpriteType.PORTRAIT)
if (sprite == null) { ...render the 3D poser, falling back to Substitute... } else { ...draw the PNG... }
```

So a species that declares a `portrait` sprite never needs a Bedrock model for the GUI. The sprite is
looked up through the same variation resolver as everything else, and `ModelAssetVariation` has all
fields optional with `fits()` only checking aspects, so a resolver whose variation contains nothing
but `sprites` is valid. When something does insist on a 3D model,
`VaryingModelRepository.getPoser` catches the resulting `IllegalStateException` and falls back, so
this cannot take the client down.

The PNGs are produced offline by `tools/render_portraits.java`: the CSRP `.tbl` files are ZIPs
holding a Tabula `model.json`, whose cubes carry `position` (a pivot relative to the parent), `offset`
(the box minimum relative to that pivot), `dimensions`, `rotation`, `txOffset` and `children`. The
tool accumulates absolute pivots, projects the tree isometrically, sorts cubes back to front and
textures each visible face using Minecraft's box-UV layout, sampling the creature's own
`textures/entity/<creature>.png`.
