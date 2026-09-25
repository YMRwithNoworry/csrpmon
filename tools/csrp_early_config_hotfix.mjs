#!/usr/bin/env node
/*
 * Fixes "Cannot get config value before config is loaded." crashes in CSRP.
 *
 * CSRP reads its ModConfigSpec values from entity createAttributes() methods, which NeoForge runs
 * during EntityAttributeCreationEvent - *before* the config files have been read. NeoForge's
 * ModConfigSpec$ConfigValue.getRaw() then throws:
 *
 *     IllegalStateException: Cannot get config value before config is loaded.
 *
 * and the game fails to start. The crash is reproducible in CSRP's own dev environment with no other
 * mods installed, so it is not caused by any addon.
 *
 * The fix keeps every accessor working exactly as before once the config is loaded, and falls back to
 * the declared default while it is not. It is applied mechanically:
 *
 *   1. every field declared as a ModConfigSpec value type is collected,
 *   2. "<FIELD>.get()" becomes "safe(<FIELD>)",
 *   3. a small "safe" helper is added to the class.
 *
 * The script is idempotent: running it twice changes nothing.
 *
 * Usage:
 *   node tools/csrp_early_config_hotfix.mjs --csrp-src <path> [--dry-run]
 *
 * <path> is the directory holding Config.java, i.e. <csrp>/src/main/java/alku/csrp
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const args = new Map();
let dryRun = false;
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--dry-run') {
    dryRun = true;
    continue;
  }
  if (process.argv[i].startsWith('--')) {
    args.set(process.argv[i].replace(/^--/, ''), process.argv[++i]);
  }
}

const csrpSrc = args.get('csrp-src');
if (!csrpSrc || !fs.existsSync(csrpSrc)) {
  console.error('--csrp-src must point at <csrp>/src/main/java/alku/csrp');
  process.exit(2);
}

const targets = [
  'Config.java',
  'config/MobsConfig.java',
  'config/GeneralConfig.java',
  'config/WorldConfig.java',
  'config/BlockConversionsConfig.java'
];

const HELPER = `
    /**
     * Reads a config value, falling back to its declared default while the config file has not been
     * read yet. NeoForge runs EntityAttributeCreationEvent before configs are loaded, and CSRP's
     * createAttributes() methods read config values, so an unguarded get() there crashes startup.
     */
    private static <T> T safe(ModConfigSpec.ConfigValue<T> value) {
        return SPEC.isLoaded() ? value.get() : value.getDefault();
    }
`;

let totalReplacements = 0;
const report = [];

for (const relative of targets) {
  const file = path.join(csrpSrc, relative);
  if (!fs.existsSync(file)) {
    report.push(`${relative}: not found, skipped`);
    continue;
  }
  let text = fs.readFileSync(file, 'utf8');
  if (text.includes('private static <T> T safe(ModConfigSpec.ConfigValue<T> value)')) {
    report.push(`${relative}: already patched, skipped`);
    continue;
  }

  // 1. collect ModConfigSpec value fields
  const fields = new Set();
  const fieldRe = /(?:public|private|protected)?\s*static\s+final\s+(?:ModConfigSpec\.\w+Value(?:<[^;=]+>)?)\s+([A-Z][A-Z0-9_]*)\s*=/g;
  let m;
  while ((m = fieldRe.exec(text)) !== null) fields.add(m[1]);
  if (fields.size === 0) {
    report.push(`${relative}: no ModConfigSpec fields found, skipped`);
    continue;
  }

  // 2. rewrite <FIELD>.get() -> safe(<FIELD>)
  let replacements = 0;
  for (const field of fields) {
    const pattern = new RegExp('\\b' + field + '\\.get\\(\\)', 'g');
    text = text.replace(pattern, () => {
      replacements++;
      return `safe(${field})`;
    });
  }

  if (replacements === 0) {
    report.push(`${relative}: ${fields.size} fields, nothing to rewrite`);
    continue;
  }

  // 3. insert the helper as the last member of the class
  const closing = text.lastIndexOf('}');
  if (closing === -1) {
    report.push(`${relative}: could not find the class body, skipped`);
    continue;
  }
  text = text.slice(0, closing) + HELPER + text.slice(closing);

  if (!dryRun) {
    fs.writeFileSync(file, text);
  }
  totalReplacements += replacements;
  report.push(`${relative}: ${replacements} call(s) guarded across ${fields.size} fields`);
}

for (const line of report) console.log('  ' + line);
console.log(`\n${dryRun ? '[dry run] ' : ''}${totalReplacements} config read(s) guarded.`);
