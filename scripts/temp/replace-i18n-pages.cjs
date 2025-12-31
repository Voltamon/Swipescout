/*
  replace-i18n-pages.cjs
  - Conservative replacement applied to files under src/pages
  - Replaces literal attribute strings (placeholder/title/alt/aria-label/label) with {i18n.t('key')} when matching an English message value
  - Replaces simple JSX text nodes (single-line, short, alpha/numeric and spaces only) with {i18n.t('key')}
  - Adds import i18n from 'i18next' if not present

  Usage:
    node scripts/replace-i18n-pages.cjs --dry  // default
    node scripts/replace-i18n-pages.cjs --apply
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAGES = path.join(ROOT, 'src', 'pages');
const I18N_DIR = path.join(ROOT, 'src', 'i18n', 'locales');
const EN_MESSAGES = path.join(I18N_DIR, 'en', 'messages.json');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return {}; }
}
function walkDir(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules','dist','.git'].includes(entry.name)) continue;
      walkDir(full, fileList);
    } else if (entry.isFile()) {
      if (/\.(jsx|tsx|js|ts)$/.test(entry.name)) fileList.push(full);
    }
  }
  return fileList;
}

const messages = readJson(EN_MESSAGES);
const valueToKey = {};
for (const [k, v] of Object.entries(messages)) {
  if (typeof v === 'string' && !(v in valueToKey)) valueToKey[v] = k;
}

const files = walkDir(PAGES);

const attrRegex = /(?:placeholder|title|alt|aria-label|label)\s*=\s*("([^"]{1,200}?)"|'([^']{1,200}?)')/gi;
const jsxTextRegex = />\s*([^<{\n>][^<>{}]*)\s*</g; // basic

let totalCandidates = 0;
const fileReports = [];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  let report = { file: f, attrs: [], texts: [] };

  let am;
  while ((am = attrRegex.exec(content)) !== null) {
    const raw = (am[2] || am[3] || '').trim();
    if (raw.length < 1) continue;
    const key = valueToKey[raw];
    if (key) report.attrs.push({ match: am[0], value: raw, key });
  }

  let tm;
  while ((tm = jsxTextRegex.exec(content)) !== null) {
    const raw = tm[1].trim();
    if (raw.length < 1) continue;
    // Conservative filter: only plain words, spaces, numbers, punctuation limited
    if (raw.length > 60) continue;
    if (!/^[\w\s'\-.,!?$%()–—]+$/.test(raw)) continue; // avoid code-like strings
    if (/\b(auto_|\(|&&|\?|:|=>)\b/.test(raw)) continue;
    const key = valueToKey[raw];
    if (key) report.texts.push({ match: tm[0], value: raw, key });
  }

  if (report.attrs.length || report.texts.length) {
    totalCandidates += report.attrs.length + report.texts.length;
    fileReports.push(report);
  }
}

console.log(`Pages scan: ${fileReports.length} files with ${totalCandidates} candidates.`);
for (const r of fileReports.slice(0, 30)) {
  console.log('---');
  console.log(r.file);
  for (const a of r.attrs) console.log(`  ATTR: "${a.value}" -> ${a.key}`);
  for (const t of r.texts) console.log(`  TEXT: "${t.value}" -> ${t.key}`);
}

if (!APPLY) {
  console.log('\nDry-run complete for pages. To apply replacements, run with --apply.');
  process.exit(0);
}

// APPLY
console.log('\nApplying changes to pages...');
for (const r of fileReports) {
  let content = fs.readFileSync(r.file, 'utf8');
  let modified = false;

  // attributes
  content = content.replace(attrRegex, (full, p1, p2, p3) => {
    const raw = (p2 || p3 || '').trim();
    const key = valueToKey[raw];
    if (key) {
      modified = true;
      return `${full.split('=')[0]}={i18n.t('${key}')} `;
    }
    return full;
  });

  // jsx text
  content = content.replace(jsxTextRegex, (full, inner) => {
    const raw = inner.trim();
    const key = valueToKey[raw];
    if (key && raw.length <= 60 && /^[\w\s'\-.,!?$%()–—]+$/.test(raw)) {
      modified = true;
      return `>{i18n.t('${key}')}<`;
    }
    return full;
  });

  // if there were replacements using i18n.t, ensure import exists
  if (modified) {
    // add import if file uses i18n.t and doesn't already import i18n
    if (/\{\s*i18n\.t\(|i18n\.t\(/.test(content) && !/\bimport\s+.*\bi18n\b/.test(content)) {
      const lines = content.split('\n');
      let insertIndex = 0;
      while (insertIndex < lines.length && lines[insertIndex].startsWith('import')) insertIndex++;
      lines.splice(insertIndex, 0, "import i18n from 'i18next';");
      content = lines.join('\n');
    }

    fs.copyFileSync(r.file, r.file + '.bak');
    fs.writeFileSync(r.file, content, 'utf8');
    console.log(`Modified ${r.file} (backup at ${r.file}.bak)`);
  }
}

console.log('Pages apply complete. Run lint/build and manual checks.');
process.exit(0);
