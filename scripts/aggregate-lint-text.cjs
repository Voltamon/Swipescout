const fs = require('fs');
const path = require('path');

const INPUT = path.join(process.cwd(), 'lint-after-vars.txt');
const OUTPUT = path.join(process.cwd(), 'eslint-errors-by-category.txt');

if (!fs.existsSync(INPUT)) {
  console.error('Input not found:', INPUT);
  process.exit(2);
}

const raw = fs.readFileSync(INPUT, 'utf8').split(/\r?\n/);
const byRule = new Map();
let currentFile = null;
let total = 0;

for (let i = 0; i < raw.length; i++) {
  const line = raw[i];
  if (!line) continue;

  // Detect file path lines (absolute Windows path)
  const fileMatch = line.match(/^([A-Z]:\\[^\r\n]+\.(jsx?|ts|tsx|js))$/i);
  if (fileMatch) {
    currentFile = fileMatch[1];
    continue;
  }

  // Look for lines containing 'error' or 'warning' and a trailing rule id
  // Example: "  68:6  warning  React Hook useEffect ...  react-hooks/exhaustive-deps"
  const severityMatch = line.match(/\b(error|warning)\b/i);
  if (!severityMatch) continue;

  // Try to capture the rule id as the last token consisting of letters/numbers/@/_/\/-
  const ruleMatch = line.match(/([a-z0-9@\/_-]+)\s*$/i);
  const rule = ruleMatch ? ruleMatch[1] : '__UNKNOWN__';

  // Extract location if possible from early part of the line (e.g., "  68:6")
  const locMatch = line.match(/^(\s*)(\d+):(\d+)/);
  const lineNum = locMatch ? locMatch[2] : '';
  const colNum = locMatch ? locMatch[3] : '';

  const entry = {
    file: currentFile || 'UNKNOWN',
    line: lineNum || '0',
    column: colNum || '0',
    message: line.trim()
  };

  if (!byRule.has(rule)) byRule.set(rule, []);
  byRule.get(rule).push(entry);
  total++;
}

const rows = Array.from(byRule.entries()).map(([rule, entries]) => ({ rule, count: entries.length, entries }));
rows.sort((a, b) => b.count - a.count);

const out = [];
out.push(`ESLint errors grouped by rule - generated: ${new Date().toISOString()}`);
out.push(`Total messages parsed: ${total}`);
out.push('');

for (const row of rows) {
  out.push(`RULE: ${row.rule}  —  ${row.count} occurrence${row.count === 1 ? '' : 's'}`);
  out.push('------------------------------------------------------------');
  const limit = Math.min(row.entries.length, 200);
  for (let i = 0; i < limit; i++) {
    const e = row.entries[i];
    const rel = e.file ? path.relative(process.cwd(), e.file) : e.file;
    out.push(`${i + 1}. ${rel}:${e.line}:${e.column}  ${e.message}`);
  }
  if (row.entries.length > limit) out.push(`... and ${row.entries.length - limit} more occurrences`);
  out.push('');
}

fs.writeFileSync(OUTPUT, out.join('\n'), 'utf8');
console.log(`Wrote report to ${OUTPUT}`);
