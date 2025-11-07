'use strict';
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const { ESLint } = require('eslint');
    const eslint = new ESLint({ cwd: process.cwd() });

    console.log('Running ESLint (this may take a minute)...');
    // Lint JS and JSX files in the repository
    const results = await eslint.lintFiles(['**/*.js', '**/*.jsx']);

    // Optionally, you can output the raw JSON to eslint-output.json
    const outJson = path.resolve(process.cwd(), 'eslint-output.json');
    fs.writeFileSync(outJson, JSON.stringify(results, null, 2), 'utf8');
    console.log('Wrote', outJson);

    // Aggregate by rule
    const groups = new Map();
    let total = 0;
    for (const fileReport of results) {
      const filePath = fileReport.filePath || '<unknown-file>';
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
    const outFile = path.resolve(process.cwd(), 'eslint-errors-by-rule-with-files.txt');
    const lines = [];
    lines.push('ESLint aggregated report (via Node API) - generated: ' + new Date().toISOString());
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
    fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
    console.log('Wrote aggregated report to', outFile);
  } catch (err) {
    console.error('Failed:', err && err.message);
    process.exitCode = 2;
  }
}

main();
