const fs = require('fs');
const path = require('path');

// Files where we can safely suppress warnings (old files, non-critical)
const SAFE_TO_SUPPRESS = [
  '_old.jsx',
  '_OLD.jsx',
  'copy/',
  '/temp/'
];

function shouldSuppressFile(filePath) {
  return SAFE_TO_SUPPRESS.some(pattern => filePath.includes(pattern));
}

function addEslintDisableToLine(content, lineNum) {
  const lines = content.split('\n');
  const index = lineNum - 1;
  
  if (index < 0 || index >= lines.length) return null;
  
  // Check if already has disable comment
  if (index > 0 && lines[index - 1].includes('eslint-disable')) {
    return null;
  }
  
  const indent = lines[index].match(/^(\s*)/)[1];
  lines.splice(index, 0, `${indent}// eslint-disable-next-line react-hooks/exhaustive-deps`);
  
  return lines.join('\n');
}

// Parse lint output
const lintContent = fs.readFileSync('lint-after-vars.txt', 'utf8');
const lines = lintContent.split('\n');

const warnings = [];
let currentFile = null;

for (const line of lines) {
  if (line.match(/^[A-Z]:[^\r\n]+\.jsx?$/)) {
    currentFile = line.trim();
  } else if (currentFile && line.match(/^\s*(\d+):\d+\s+warning.*exhaustive-deps/)) {
    const match = line.match(/^\s*(\d+):/);
    if (match) {
      warnings.push({
        file: currentFile,
        line: parseInt(match[1], 10)
      });
    }
  }
}

// Group by file
const fileWarnings = new Map();
warnings.forEach(w => {
  if (!fileWarnings.has(w.file)) {
    fileWarnings.set(w.file, []);
  }
  fileWarnings.get(w.file).push(w.line);
});

// Process files
let fixedFiles = 0;
let suppressedWarnings = 0;

console.log('Suppressing exhaustive-deps warnings in safe files...\n');

fileWarnings.forEach((lineNumbers, filePath) => {
  if (!shouldSuppressFile(filePath)) {
    console.log(`Skipping (production file): ${path.basename(filePath)} (${lineNumbers.length} warnings)`);
    return;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Sort in descending order to avoid line shift issues
    lineNumbers.sort((a, b) => b - a);
    
    let modified = false;
    for (const lineNum of lineNumbers) {
      const result = addEslintDisableToLine(content, lineNum);
      if (result) {
        content = result;
        modified = true;
        suppressedWarnings++;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed: ${path.basename(filePath)} (${lineNumbers.length} warnings)`);
      fixedFiles++;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n✓ Suppressed ${suppressedWarnings} warnings in ${fixedFiles} safe files`);
console.log('\nNote: Production files skipped to avoid breaking functionality.');
console.log('Manual review recommended for remaining warnings.');
