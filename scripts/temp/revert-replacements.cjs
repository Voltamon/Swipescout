/* revert-replacements.cjs
   Restores original files from .bak backups created by replacement script
*/
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

function walkDir(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules','dist','.git'].includes(entry.name)) continue;
      walkDir(full, fileList);
    } else if (entry.isFile()) {
      if (full.endsWith('.bak')) fileList.push(full);
    }
  }
  return fileList;
}

const backups = walkDir(SRC);
if (backups.length === 0) {
  console.log('No .bak files found. Nothing to revert.');
  process.exit(0);
}

for (const b of backups) {
  const original = b.slice(0, -4);
  try {
    fs.copyFileSync(b, original);
    fs.unlinkSync(b);
    console.log(`Reverted ${original} from ${b}`);
  } catch (e) {
    console.error(`Failed to revert ${original}: ${e.message}`);
  }
}
console.log('Revert complete.');
process.exit(0);
