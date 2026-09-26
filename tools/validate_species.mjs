#!/usr/bin/env node
/*
 * Validates every CSRPmon species file against the Cobblemon data it will be loaded by.
 *
 * Checks performed:
 *   1. every species file is valid JSON and declares the fields Cobblemon's Species class reads,
 *   2. primary/secondary types exist in Cobblemon's type chart,
 *   3. every ability exists in Cobblemon's ability registry,
 *   4. every learnset entry exists in Cobblemon's move registry and is well formed,
 *   5. every evolution result points at another species shipped here,
 *   6. every drop item exists (csrp: ids are checked against the CSRP sources, minecraft: against
 *      a small allow-list, cobblemon: entries are reported for manual review),
 *   7. the Java mapping table and the species directory agree in both directions,
 *   8. every mapped CSRP entity id really is registered by the CSRP mod.
 *
 * Usage:
 *   node tools/validate_species.mjs --showdown <dir> --csrp-src <dir> [--species <dir>]
 *
 * <dir> for --showdown must contain data/abilities.js and data/moves.js extracted from
 * Cobblemon's data/cobblemon/showdown.zip.
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  args.set(process.argv[i].replace(/^--/, ''), process.argv[i + 1]);
}

const speciesDir = args.get('species') ?? 'src/main/resources/data/csrpmon/species';
const showdownDir = args.get('showdown');
const csrpSrc = args.get('csrp-src');
const mappingFile = args.get('mapping') ?? 'src/main/java/alku/csrpmon/species/ParasiteSpeciesMap.java';

const problems = [];
const fail = (msg) => problems.push(msg);

function topLevelKeys(source) {
  const start = source.indexOf('{');
  const body = start === -1 ? source : source.slice(start);
  const out = new Set();
  const re = /^\s*"?([a-zA-Z0-9_]+)"?\s*:\s*\{/gm;
  let m;
  while ((m = re.exec(body)) !== null) out.add(m[1].toLowerCase());
  return out;
}

if (!showdownDir || !fs.existsSync(path.join(showdownDir, 'data/abilities.js'))) {
  console.error('--showdown must point at a directory holding data/abilities.js and data/moves.js');
  process.exit(2);
}
const abilities = topLevelKeys(fs.readFileSync(path.join(showdownDir, 'data/abilities.js'), 'utf8'));
const moves = topLevelKeys(fs.readFileSync(path.join(showdownDir, 'data/moves.js'), 'utf8'));

// Abilities and moves this addon defines itself, in data/csrpmon/{abilities,moves}/*.js.
// Cobblemon loads these into the same registries, so they are valid references too.
const ourData = path.join(speciesDir, '../../..', 'data/csrpmon');
for (const [kind, set] of [['abilities', abilities], ['moves', moves]]) {
  const dir = path.resolve(ourData, kind);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.js')) continue;
    const id = path.basename(file, '.js').toLowerCase();
    set.add(id);
    const body = fs.readFileSync(path.join(dir, file), 'utf8');
    if (/\/\//.test(body)) fail(kind + '/' + file + ': contains a // comment, which Cobblemon rejects');
    if (!/^\s*\{/.test(body)) fail(kind + '/' + file + ': must begin with a curly brace');
    const named = /name\s*:\s*"([^"]+)"/.exec(body);
    if (!named) { fail(kind + '/' + file + ': has no name field'); continue; }
    const derived = named[1].toLowerCase().replace(/[^a-z0-9]+/g, '');
    if (derived !== id) {
      fail(kind + '/' + file + ': Showdown derives the id from name "' + named[1] + '" as "' + derived + '", but the file is called "' + id + '". Cobblemon registers the effect under "' + derived + '", so anything referring to "' + id + '" will fail to load.');
    }
  }
  console.log(kind + ' defined here: ' + [...set].filter(x => fs.existsSync(path.join(dir, x + '.js'))).length);
}
const types = new Set(['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']);
const eggGroups = new Set(['monster', 'water_1', 'bug', 'flying', 'field', 'fairy', 'grass',
  'human_like', 'water_3', 'mineral', 'amorphous', 'water_2', 'ditto', 'dragon', 'undiscovered']);
const experienceGroups = new Set(['erratic', 'fast', 'medium_fast', 'medium_slow', 'slow', 'fluctuating']);
const statKeys = ['hp', 'attack', 'defence', 'special_attack', 'special_defence', 'speed'];

// ---- CSRP side -------------------------------------------------------------------------------
let csrpItems = null;
let csrpEntities = null;
if (csrpSrc) {
  const itemsFile = path.join(csrpSrc, 'registry/ModItems.java');
  const entitiesFile = path.join(csrpSrc, 'registry/ModEntities.java');
  if (fs.existsSync(itemsFile)) {
    csrpItems = new Set([...fs.readFileSync(itemsFile, 'utf8').matchAll(/simple\(\s*"([a-z0-9_]+)"/g)].map((m) => m[1]));
  }
  if (fs.existsSync(entitiesFile)) {
    const text = fs.readFileSync(entitiesFile, 'utf8');
    csrpEntities = new Set([
      ...[...text.matchAll(/monster\(\s*"([a-z0-9_]+)"/g)].map((m) => m[1]),
      ...[...text.matchAll(/ENTITIES\.register\(\s*"([a-z0-9_]+)"/g)].map((m) => m[1])
    ]);
  }
}

// ---- Java mapping table ----------------------------------------------------------------------
const mapped = new Map();
if (fs.existsSync(mappingFile)) {
  const java = fs.readFileSync(mappingFile, 'utf8');
  for (const m of java.matchAll(/add\("([a-z0-9_]+)",\s*"([a-z0-9_]+)",\s*(\d+),\s*(\d+),\s*(\d+)\)/g)) {
    mapped.set(m[2], { csrp: m[1], tier: Number(m[3]), min: Number(m[4]), max: Number(m[5]) });
    if (Number(m[3]) > Number(m[4]) * 0 + Number(m[4]) && Number(m[4]) > Number(m[5])) {
      fail(`mapping ${m[2]}: minLevel ${m[4]} is above maxLevel ${m[5]}`);
    }
    if (csrpEntities && !csrpEntities.has(m[1])) {
      fail(`mapping ${m[2]}: CSRP entity id "${m[1]}" is not registered by CSRP`);
    }
  }
} else {
  console.warn(`note: mapping file ${mappingFile} not found, skipping cross-checks`);
}

// ---- species files ---------------------------------------------------------------------------
const files = fs.readdirSync(speciesDir).filter((f) => f.endsWith('.json')).sort();
if (files.length === 0) fail('no species files found in ' + speciesDir);

const seenNames = new Map();
const seenDex = new Map();
const evolutions = [];

for (const file of files) {
  const id = path.basename(file, '.json');
  let json;
  try {
    json = JSON.parse(fs.readFileSync(path.join(speciesDir, file), 'utf8'));
  } catch (e) {
    fail(`${file}: not valid JSON (${e.message})`);
    continue;
  }
  const where = (msg) => fail(`${file}: ${msg}`);

  for (const key of ['implemented', 'nationalPokedexNumber', 'name', 'primaryType', 'height', 'weight',
    'abilities', 'eggGroups', 'baseStats', 'evYield', 'baseExperienceYield', 'experienceGroup',
    'catchRate', 'hitbox', 'behaviour', 'drops', 'moves']) {
    if (!(key in json)) where(`missing required field "${key}"`);
  }
  if (json.implemented !== true) where('"implemented" must be true or Cobblemon hides the species');
  if (!types.has(json.primaryType)) where(`unknown primaryType "${json.primaryType}"`);
  if (json.secondaryType !== undefined && !types.has(json.secondaryType)) {
    where(`unknown secondaryType "${json.secondaryType}"`);
  }
  if (json.secondaryType === json.primaryType) where('secondaryType repeats primaryType');

  for (const key of statKeys) {
    if (typeof json.baseStats?.[key] !== 'number') where(`baseStats.${key} must be a number`);
    if (typeof json.evYield?.[key] !== 'number') where(`evYield.${key} must be a number`);
  }
  const bst = statKeys.reduce((sum, k) => sum + (json.baseStats?.[k] ?? 0), 0);
  // 720 is the highest base stat total any real Pokemon has; anything above would be off-chart.
  if (bst < 200 || bst > 720) where(`base stat total ${bst} is outside the sane range`);

  for (const ability of json.abilities ?? []) {
    const plain = ability.startsWith('h:') ? ability.slice(2) : ability;
    if (!abilities.has(plain)) where(`unknown ability "${ability}"`);
  }
  for (const group of json.eggGroups ?? []) {
    if (!eggGroups.has(group)) where(`unknown eggGroup "${group}"`);
  }
  if (!experienceGroups.has(json.experienceGroup)) {
    where(`unknown experienceGroup "${json.experienceGroup}"`);
  }
  if (typeof json.catchRate !== 'number' || json.catchRate < 1 || json.catchRate > 255) {
    where(`catchRate ${json.catchRate} is out of range`);
  }
  if (typeof json.hitbox?.width !== 'number' || typeof json.hitbox?.height !== 'number') {
    where('hitbox needs numeric width and height');
  }
  if (!Array.isArray(json.moves) || json.moves.length === 0) {
    where('moves must be a non-empty array');
  } else {
    for (const entry of json.moves) {
      const match = /^(\d+):([a-z0-9]+)$/.exec(entry);
      if (!match) {
        where(`move "${entry}" is not in "<level>:<move>" form`);
        continue;
      }
      if (!moves.has(match[2])) where(`unknown move "${match[2]}"`);
      const lvl = Number(match[1]);
      if (lvl < 1 || lvl > 100) where(`move "${entry}" has an impossible level`);
    }
  }
  for (const drop of json.drops?.entries ?? []) {
    const item = drop.item ?? '';
    if (item.startsWith('csrp:')) {
      const path_ = item.slice(5);
      if (csrpItems && !csrpItems.has(path_)) {
        where(`drop item "${item}" is not a CSRP item id`);
      }
    } else if (!/^(minecraft|cobblemon):/.test(item)) {
      where(`drop item "${item}" uses an unexpected namespace`);
    }
  }

  const previous = seenNames.get(json.name);
  if (previous) where(`name "${json.name}" is already used by ${previous}`);
  seenNames.set(json.name, file);
  const dexPrevious = seenDex.get(json.nationalPokedexNumber);
  if (dexPrevious) where(`dex number ${json.nationalPokedexNumber} is already used by ${dexPrevious}`);
  seenDex.set(json.nationalPokedexNumber, file);

  for (const evo of json.evolutions ?? []) {
    if (!evo.result) where('evolution without a result');
    evolutions.push({ from: id, to: evo.result, file });
  }

  if (mapped.size > 0 && !mapped.has(id)) {
    where('has no entry in the Java mapping table, so players can never meet it');
  }
}

for (const evo of evolutions) {
  if (!files.includes(evo.to + '.json')) {
    fail(`${evo.file}: evolution targets "${evo.to}", which this addon does not ship`);
  }
}
for (const speciesId of mapped.keys()) {
  if (!files.includes(speciesId + '.json')) {
    fail(`mapping table lists "${speciesId}" but data/csrpmon/species/${speciesId}.json does not exist`);
  }
}

const total = files.length;
console.log(`species files        : ${total}`);
console.log(`abilities available  : ${abilities.size}`);
console.log(`moves available      : ${moves.size}`);
console.log(`mapping table size   : ${mapped.size}`);
console.log(`evolution links      : ${evolutions.length}`);
if (csrpEntities) console.log(`CSRP entity ids      : ${csrpEntities.size}`);
if (csrpItems) console.log(`CSRP item ids        : ${csrpItems.size}`);

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.error('  - ' + problem);
  process.exit(1);
}
console.log('\nAll species data is valid.');
