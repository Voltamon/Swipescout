const fs = require('fs');
const path = require('path');

const INPUT = path.join(process.cwd(), 'eslint-output.json');
const OUTPUT = path.join(process.cwd(), 'eslint-errors-by-category.txt');

function safeReadJson(p) {
  try {
    let raw = fs.readFileSync(p, 'utf8');
    // Some CLI output may include leading garbage or BOM; try to find the JSON array
    raw = raw.trim();
    try {
      return JSON.parse(raw);
    } catch (e) {
      // Attempt to recover by extracting the first JSON array in the file
      const firstIdx = raw.indexOf('[');
      const lastIdx = raw.lastIndexOf(']');
      if (firstIdx !== -1 && lastIdx !== -1 && lastIdx > firstIdx) {
        const slice = raw.substring(firstIdx, lastIdx + 1);
        try {
          return JSON.parse(slice);
        } catch (e2) {
          console.error('Failed to parse JSON slice:', e2.message);
          return null;
        }
      }
      console.error('Unable to parse JSON and no JSON array found');
      return null;
    }
  } catch (err) {
    console.error(`Failed to read/parse ${p}:`, err.message);
    return null;
  }
}

function aggregate(results) {
  // results is an array of file results from eslint JSON
  const byRule = new Map();

  for (const fileResult of results) {
    const filePath = fileResult.filePath;
    const messages = fileResult.messages || [];

    for (const msg of messages) {
      const rule = msg.ruleId || '__UNKNOWN__';
      const entry = {
        file: filePath,
        line: msg.line || 0,
        column: msg.column || 0,
        severity: msg.severity, // 1=warning,2=error
        message: msg.message
      };

      if (!byRule.has(rule)) byRule.set(rule, []);
      byRule.get(rule).push(entry);
    }
  }

  return byRule;
}

function writeReport(byRule) {
  // Convert to array and sort by count desc
  const rows = Array.from(byRule.entries()).map(([rule, entries]) => ({ rule, count: entries.length, entries }));
  rows.sort((a, b) => b.count - a.count);

  const lines = [];
  lines.push(`ESLint errors grouped by rule - generated: ${new Date().toISOString()}`);
  lines.push('');

  for (const row of rows) {
    lines.push(`RULE: ${row.rule}  —  ${row.count} occurrence${row.count === 1 ? '' : 's'}`);
    lines.push('------------------------------------------------------------');
    // list up to 200 occurrences per rule to keep file sane
    const limit = Math.min(row.entries.length, 200);
    for (let i = 0; i < limit; i++) {
      const e = row.entries[i];
      const rel = path.relative(process.cwd(), e.file);
      lines.push(`${i + 1}. ${rel}:${e.line}:${e.column}  [${e.severity === 2 ? 'error' : 'warning'}] ${e.message}`);
    }
    if (row.entries.length > limit) {
      lines.push(`... and ${row.entries.length - limit} more occurrences`);
    }
    lines.push('');
  }

  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  console.log(`Wrote report to ${OUTPUT}`);
}

function main() {
  if (!fs.existsSync(INPUT)) {
    console.error(`Input file not found: ${INPUT}`);
    process.exit(2);
  }

  const results = safeReadJson(INPUT);
  if (!results) process.exit(3);

  const byRule = aggregate(results);
  writeReport(byRule);
}

main();
