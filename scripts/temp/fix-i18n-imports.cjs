/* fix-i18n-imports.cjs
   Removes duplicate imports of `i18n` in pages and prefers local imports over 'i18next'.
*/
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const PAGES = path.join(ROOT, 'src', 'pages');

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

const files = walkDir(PAGES);
let changed = 0;
for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  const importLines = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/import\s+(?:[^;]+)\s+from\s+['"]([^'"]+)['"]/);
    if (m) {
      if (/\bimport\b.*\bi18n\b/.test(line)) {
        importLines.push({ idx: i, line, from: m[1] });
      }
    }
  }
  if (importLines.length > 1) {
    // Prefer keeping local imports (not from 'i18next')
    let keepIdx = importLines.find(x => x.from !== 'i18next');
    if (!keepIdx) keepIdx = importLines[0];
    for (const imp of importLines) {
      if (imp.idx === keepIdx.idx) continue;
      // remove duplicate import line
      lines[imp.idx] = ''; // remove it safely
      changed++;
      console.log(`Removed duplicate i18n import from ${f}: ${imp.line}`);
    }
    const newContent = lines.join('\n');
    fs.copyFileSync(f, f + '.bak_fix_imports');
    fs.writeFileSync(f, newContent, 'utf8');
  }
}

console.log(`Finished. Updated ${changed} import lines.`);
process.exit(0);
