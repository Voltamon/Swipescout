'use strict';
const fs = require('fs');
const path = require('path');

const input = path.resolve(process.cwd(), 'eslint-output.json');
const out = path.resolve(process.cwd(), 'eslint-errors-by-rule-with-files.txt');

function safeReadJSON(file) {
  try {
    const s = fs.readFileSync(file, 'utf8');
    // Trim leading garbage (non-json) until first [ or { appears
    const first = s.search(/[\[{]/);
    const jsonText = first > 0 ? s.slice(first) : s;
    return JSON.parse(jsonText);
  } catch (err) {
    console.error('Failed to read/parse', file, err && err.message);
    process.exitCode = 2;
    return null;
  }
}

const data = safeReadJSON(input);
if (!data) process.exit(2);

const groups = new Map();
let total = 0;
for (const fileReport of data) {
  const filePath = fileReport.filePath || fileReport.file || '<unknown-file>';
  for (const msg of fileReport.messages || []) {
    const rule = msg.ruleId || '<no-rule-id>';
    total++;
    if (!groups.has(rule)) groups.set(rule, []);
    groups.get(rule).push({
      file: filePath,
      line: msg.line || 0,
      column: msg.column || 0,
      severity: msg.severity === 2 ? 'error' : (msg.severity === 1 ? 'warning' : 'info'),
      message: msg.message
    });
  }
}

const sortedRules = Array.from(groups.entries()).sort((a,b)=> b[1].length - a[1].length);

const lines = [];
lines.push('ESLint JSON aggregated report - generated: ' + new Date().toISOString());
lines.push('Total messages parsed: ' + total);
lines.push('');
for (const [rule, items] of sortedRules) {
  lines.push(`RULE: ${rule}  —  ${items.length} occurrences`);
  lines.push('------------------------------------------------------------');
  for (const it of items) {
    lines.push(` ${it.file}:${it.line}:${it.column}  ${it.severity}  ${it.message}`);
  }
  lines.push('');
}

fs.writeFileSync(out, lines.join('\n'), 'utf8');
console.log('Wrote report to', out);
