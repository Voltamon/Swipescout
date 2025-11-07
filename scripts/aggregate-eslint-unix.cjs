const fs = require('fs');
const path = require('path');

const INPUT = path.join(process.cwd(), 'eslint-unix.txt');
const OUTPUT = path.join(process.cwd(), 'eslint-errors-by-category.txt');

if (!fs.existsSync(INPUT)) {
  console.error('Input not found:', INPUT);
  process.exit(2);
}

const raw = fs.readFileSync(INPUT, 'utf8').split(/\r?\n/);
const byRule = new Map();
let total = 0;

for (const line of raw) {
  if (!line.trim()) continue;
  // ESLint unix format: file:line:col: severity message (ruleId)
  // We'll extract file, line, col and ruleId (last parenthesized token)
  const ruleMatch = line.match(/\(([^)]+)\)\s*$/);
  const rule = ruleMatch ? ruleMatch[1] : '__UNKNOWN__';
  const prefix = line.split(':', 4); // file:line:col:rest
  const file = prefix[0] || '';
  const lineNum = prefix[1] || '0';
  const col = prefix[2] || '0';
  const message = line.replace(/^.*?:\d+:\d+:\s*/, '').replace(/\s*\([^)]+\)\s*$/, '').trim();

  if (!byRule.has(rule)) byRule.set(rule, []);
  byRule.get(rule).push({ file, line: lineNum, column: col, message });
  total++;
}

const rows = Array.from(byRule.entries()).map(([rule, entries]) => ({ rule, count: entries.length, entries }));
rows.sort((a, b) => b.count - a.count);

const lines = [];
lines.push(`ESLint errors grouped by rule - generated: ${new Date().toISOString()}`);
lines.push(`Total messages parsed: ${total}`);
lines.push('');

for (const row of rows) {
  lines.push(`RULE: ${row.rule}  —  ${row.count} occurrence${row.count === 1 ? '' : 's'}`);
  lines.push('------------------------------------------------------------');
  const limit = Math.min(row.entries.length, 200);
  for (let i = 0; i < limit; i++) {
    const e = row.entries[i];
    const rel = path.relative(process.cwd(), e.file);
    lines.push(`${i + 1}. ${rel}:${e.line}:${e.column}  ${e.message}`);
  }
  if (row.entries.length > limit) lines.push(`... and ${row.entries.length - limit} more occurrences`);
  lines.push('');
}

fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
console.log(`Wrote report to ${OUTPUT}`);
