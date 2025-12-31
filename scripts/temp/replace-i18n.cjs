/*
  replace-i18n.cjs
  - Dry-run: Scans files and reports potential replacements of literal texts to t('key') using existing locale mapping
  - Apply mode: when run with --apply, performs replacements and adds useTranslation import and const { t } = useTranslation() inside components

  Usage:
    node scripts/replace-i18n.cjs --dry (default)
    node scripts/replace-i18n.cjs --apply
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const I18N_DIR = path.join(SRC, 'i18n', 'locales');
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
// convert messages values -> key (if duplicate values, prefer the first key)
const valueToKey = {};
for (const [k, v] of Object.entries(messages)) {
  if (typeof v === 'string' && !(v in valueToKey)) valueToKey[v] = k;
}

const files = walkDir(SRC);

const attrRegex = /(?:placeholder|title|alt|aria-label|label)\s*=\s*("([^"]{1,200}?)"|'([^']{1,200}?)')/gi;
const jsxTextRegex = />\s*([^<{\n>][^<>{}]*)\s*</g; // matching text between tags

let totalCandidates = 0;
const fileReports = [];

function addImportIfMissing(content) {
  if (/react-i18next/.test(content)) return content; // assume import exists
  // insert after first import block
  const lines = content.split('\n');
  let insertIndex = 0;
  while (insertIndex < lines.length && lines[insertIndex].startsWith('import')) insertIndex++;
  lines.splice(insertIndex, 0, "import { useTranslation } from 'react-i18next';");
  return lines.join('\n');
}

function ensureTInjected(content) {
  // For each component, try to inject const { t } = useTranslation(); after the opening brace
  // Simple heuristic: find "export default function NAME(" or "function NAME(" or const NAME = ( ... ) => {
  // We'll insert after the first '{' that follows the function declaration

  const functionPatterns = [/export\s+default\s+function\s+[A-Za-z0-9_]+\s*\(/g, /function\s+[A-Za-z0-9_]+\s*\(/g, /const\s+[A-Za-z0-9_]+\s*=\s*\(/g, /const\s+[A-Za-z0-9_]+\s*=\s*[^=]*=>\s*\{/g];
  let modified = content;
  for (const pat of functionPatterns) {
    let m;
    while ((m = pat.exec(content)) !== null) {
      const idx = m.index;
      // find the first '{' after idx
      const braceIdx = content.indexOf('{', idx);
      if (braceIdx !== -1) {
        // check if we already have useTranslation inside
        const slice = content.slice(braceIdx, braceIdx + 200);
        if (/useTranslation\(|const\s+\{\s*t\s*\}/.test(slice)) continue;
        // insert "\n  const { t } = useTranslation();\n" after brace
        modified = modified.slice(0, braceIdx + 1) + "\n  const { t } = useTranslation();\n" + modified.slice(braceIdx + 1);
      }
    }
  }
  return modified;
}

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  let report = { file: f, attrs: [], texts: [] };

  // attributes
  let am;
  while ((am = attrRegex.exec(content)) !== null) {
    const raw = (am[2] || am[3] || '').trim();
    if (raw.length < 1) continue;
    const key = valueToKey[raw];
    if (key) {
      report.attrs.push({ match: am[0], value: raw, key });
    }
  }

  // jsx text
  let tm;
  while ((tm = jsxTextRegex.exec(content)) !== null) {
    const raw = tm[1].trim();
    if (raw.length < 1) continue;
    const key = valueToKey[raw];
    if (key) report.texts.push({ match: tm[0], value: raw, key });
  }

  if (report.attrs.length || report.texts.length) {
    totalCandidates += report.attrs.length + report.texts.length;
    fileReports.push(report);
  }
}

console.log(`Found ${fileReports.length} files with ${totalCandidates} replacement candidates (matching English messages).`);
// print samples (up to 20 files, with up to 6 candidates each)
let shown = 0;
for (const r of fileReports) {
  if (shown >= 20) break;
  console.log('---');
  console.log(r.file);
  for (const a of r.attrs.slice(0,3)) console.log(`  ATTR: "${a.value}" -> ${a.key}`);
  for (const t of r.texts.slice(0,3)) console.log(`  TEXT: "${t.value}" -> ${t.key}`);
  shown++;
}

if (!APPLY) {
  console.log('\nDry-run complete. No files were modified. To apply replacements, run with --apply.');
  process.exit(0);
}

// APPLY mode
console.log('\nApply mode: performing replacements...');
for (const r of fileReports) {
  let content = fs.readFileSync(r.file, 'utf8');
  let modified = false;

  // ensure import
  if (!/react-i18next/.test(content)) {
    content = addImportIfMissing(content);
    modified = true;
  }

  // attributes
  content = content.replace(attrRegex, (full, p1, p2, p3) => {
    const raw = (p2 || p3 || '').trim();
    const key = valueToKey[raw];
    if (key) {
      modified = true;
      return `${full.split('=')[0]}={t('${key}')}`;
    }
    return full;
  });

  // jsx text
  content = content.replace(jsxTextRegex, (full, inner) => {
    const raw = inner.trim();
    const key = valueToKey[raw];
    if (key) {
      modified = true;
      return `>{t('${key}')}<`;
    }
    return full;
  });

  // ensure t injection
  content = ensureTInjected(content);

  if (modified) {
    // backup original
    fs.writeFileSync(r.file + '.bak', fs.readFileSync(r.file, 'utf8'));
    fs.writeFileSync(r.file, content, 'utf8');
    console.log(`Modified ${r.file} (backup at ${r.file}.bak)`);
  }
}

console.log('Apply complete. Please run tests and review changes.');
process.exit(0);
