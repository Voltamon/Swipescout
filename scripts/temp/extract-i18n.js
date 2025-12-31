/*
  extract-i18n.js
  - Scans frontend/src for literal visible strings (JSX text, common props)
  - For each unique literal not present in any locale, adds a key to en/messages.json and corresponding entries to ar/messages.json and zh/messages.json
  - Also finds t('some.key') usages and ensures that key exists in all three locales

  Usage: node scripts/extract-i18n.js
*/

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const I18N_DIR = path.join(SRC, 'i18n', 'locales');

const LANGS = ['en', 'ar', 'zh'];
const TARGET_FILE = 'messages.json'; // we will append new keys here

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error('Failed to read JSON', file, err.message);
    return null;
  }
}

function writeJson(file, obj) {
  const content = JSON.stringify(obj, null, 2) + '\n';
  fs.writeFileSync(file, content, 'utf8');
}

function collectLocaleValues(obj) {
  const vals = [];
  function recurse(o) {
    if (typeof o === 'string') vals.push(o);
    else if (Array.isArray(o)) o.forEach(recurse);
    else if (typeof o === 'object' && o !== null) Object.values(o).forEach(recurse);
  }
  recurse(obj);
  return vals;
}

function slugify(s) {
  return s.toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}

// Load all locale files
const locales = {};
for (const lang of LANGS) {
  const file = path.join(I18N_DIR, lang, TARGET_FILE);
  const json = readJson(file);
  if (!json) {
    console.error(`Missing ${file} — skipping`);
    locales[lang] = {};
  } else {
    locales[lang] = json;
  }
}

// Build a set of existing translation values (English primarily)
const existingValues = new Set();
for (const lang of LANGS) {
  const vals = collectLocaleValues(locales[lang]);
  vals.forEach(v => existingValues.add(v));
}

// Find files to scan
const patterns = ['**/*.jsx', '**/*.tsx', '**/*.js', '**/*.ts'];
const files = patterns.flatMap(p => glob.sync(p, { cwd: SRC, absolute: true, ignore: ['**/node_modules/**', '**/dist/**'] }));

const discoveredStrings = new Set();
const usedKeys = new Set();

const jsxTextRegex = />\s*([^<{\n>][^<>{}]*)\s*</g; // text between tags
const attrRegex = /(?:placeholder|title|alt|aria-label|label)\s*=\s*(?:"([^"]{2,})"|'([^']{2,})')/gi;
const tUsageRegex = /\bt\(\s*['"]([^'"]+)['"]\s*\)/g;

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');

  // JSX text
  let m;
  while ((m = jsxTextRegex.exec(content)) !== null) {
    const s = m[1].trim();
    if (s && s.length >= 2 && /[A-Za-z0-9]/.test(s)) {
      // filter out strings that likely belong to code like <Component></Component>
      if (!/^\d+$/.test(s)) discoveredStrings.add(s);
    }
  }

  // attributes
  while ((m = attrRegex.exec(content)) !== null) {
    const s = (m[1] || m[2] || '').trim();
    if (s && s.length >= 1) discoveredStrings.add(s);
  }

  // t('key') usage
  while ((m = tUsageRegex.exec(content)) !== null) {
    usedKeys.add(m[1]);
  }
}

// Now filter discoveredStrings: remove ones already present as translation values
const stringsToAdd = Array.from(discoveredStrings).filter(s => !existingValues.has(s));

// Prepare to add to messages.json in each lang
const enFile = path.join(I18N_DIR, 'en', TARGET_FILE);
const arFile = path.join(I18N_DIR, 'ar', TARGET_FILE);
const zhFile = path.join(I18N_DIR, 'zh', TARGET_FILE);

const enJson = readJson(enFile) || {};
const arJson = readJson(arFile) || {};
const zhJson = readJson(zhFile) || {};

let additions = 0;
for (const str of stringsToAdd) {
  // generate a key
  const base = slugify(str).slice(0, 40) || 'text';
  let key = `auto_${base}`;
  let counter = 1;
  while (Object.prototype.hasOwnProperty.call(enJson, key)) {
    key = `auto_${base}_${counter++}`;
  }

  enJson[key] = str;
  arJson[key] = str; // placeholder: same English text (so UI not blank)
  zhJson[key] = str;
  additions++;
  console.log(`Added key ${key} -> "${str}"`);
}

// Ensure used keys exist in all three locales
let keyAdditions = 0;
for (const k of usedKeys) {
  if (!Object.prototype.hasOwnProperty.call(enJson, k)) {
    enJson[k] = k; // fallback to key name
    keyAdditions++;
    console.log(`Created missing key in en: ${k}`);
  }
  if (!Object.prototype.hasOwnProperty.call(arJson, k)) {
    arJson[k] = k;
    keyAdditions++;
    console.log(`Created missing key in ar: ${k}`);
  }
  if (!Object.prototype.hasOwnProperty.call(zhJson, k)) {
    zhJson[k] = k;
    keyAdditions++;
    console.log(`Created missing key in zh: ${k}`);
  }
}

// Write back JSON files (sorted keys)
function sortKeys(obj) {
  return Object.keys(obj).sort().reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {});
}

if (additions > 0 || keyAdditions > 0) {
  writeJson(enFile, sortKeys(enJson));
  writeJson(arFile, sortKeys(arJson));
  writeJson(zhFile, sortKeys(zhJson));
  console.log(`Wrote changes: ${additions} literal(s) added, ${keyAdditions} missing key entries created.`);
} else {
  console.log('No additions required — locales are up to date.');
}

console.log('Finished scan.');
process.exit(0);
