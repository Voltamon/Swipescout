const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'src', 'i18n', 'locales');
const additionsFile = path.join(localesDir, 'batch_1_additions.json');
const langs = ['en', 'ar', 'zh'];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function deepMerge(target, src, changes, prefix = '') {
  for (const key of Object.keys(src)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (src[key] && typeof src[key] === 'object' && !Array.isArray(src[key])) {
      if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
        target[key] = {};
        changes.added.push(fullKey + ' (object)');
      }
      deepMerge(target[key], src[key], changes, fullKey);
    } else {
      if (!(key in target)) {
        target[key] = src[key];
        changes.added.push(fullKey);
      } else if (target[key] !== src[key]) {
        // Overwrite because user approved machine-assisted translations (Option A)
        changes.overwritten.push({ key: fullKey, from: target[key], to: src[key] });
        target[key] = src[key];
      }
    }
  }
}

if (!fs.existsSync(additionsFile)) {
  console.error('Additions file not found:', additionsFile);
  process.exit(1);
}

const additions = readJson(additionsFile);

for (const lang of langs) {
  const localePath = path.join(localesDir, `${lang}.json`);
  if (!fs.existsSync(localePath)) {
    console.warn(`Locale file missing, skipping: ${localePath}`);
    continue;
  }

  const bakPath = localePath + '.bak';
  if (!fs.existsSync(bakPath)) {
    fs.copyFileSync(localePath, bakPath);
    console.log(`Created backup: ${path.relative(process.cwd(), bakPath)}`);
  } else {
    console.log(`Backup already exists: ${path.relative(process.cwd(), bakPath)}`);
  }

  const localeJson = readJson(localePath);
  const additionsForLang = additions[lang];
  if (!additionsForLang) {
    console.log(`No additions for lang ${lang}, skipping.`);
    continue;
  }

  const changes = { added: [], overwritten: [] };
  deepMerge(localeJson, additionsForLang, changes);

  writeJson(localePath, localeJson);

  console.log(`Merged additions into ${path.basename(localePath)}:`);
  console.log(`  Added keys: ${changes.added.length}`);
  if (changes.added.length) console.log('   -', changes.added.join('\n   - '));
  console.log(`  Overwritten keys: ${changes.overwritten.length}`);
  if (changes.overwritten.length) console.log('   -', changes.overwritten.map(o => `${o.key}: "${o.from}" -> "${o.to}"`).join('\n   - '));
  console.log('');
}

console.log('Merge complete. Please run your build (yarn build) to verify.');
