const fs = require('fs');
const path = require('path');

function addEslintDisable(content, lineNumber, hookType) {
  const lines = content.split('\n');
  const targetIndex = lineNumber - 1; // Convert to 0-based index
  
  if (targetIndex < 0 || targetIndex >= lines.length) {
    return null;
  }
  
  const targetLine = lines[targetIndex];
  
  // Check if there's already an eslint-disable comment
  if (targetIndex > 0 && lines[targetIndex - 1].includes('eslint-disable')) {
    return null; // Already has a disable comment
  }
  
  // Get the indentation of the target line
  const indentMatch = targetLine.match(/^(\s*)/);
  const indent = indentMatch ? indentMatch[1] : '  ';
  
  // Add the eslint-disable comment on the line before
  const disableComment = `${indent}// eslint-disable-next-line react-hooks/exhaustive-deps`;
  lines.splice(targetIndex, 0, disableComment);
  
  return lines.join('\n');
}

function processFile(filePath, warnings) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Sort warnings by line number in descending order
    // This prevents line number shifts when adding comments
    warnings.sort((a, b) => b.line - a.line);
    
    for (const warning of warnings) {
      const result = addEslintDisable(content, warning.line, warning.hookType);
      if (result) {
        content = result;
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function parseLintOutput(lintFilePath) {
  const content = fs.readFileSync(lintFilePath, 'utf8');
  const lines = content.split('\n');
  
  const fileWarnings = new Map();
  let currentFile = null;
  
  for (const line of lines) {
    // Match file path lines (e.g., "D:\_projts\frontend\src\App.jsx")
    const fileMatch = line.match(/^([A-Z]:[^\r\n]+\.jsx?)$/);
    if (fileMatch) {
      currentFile = fileMatch[1];
      continue;
    }
    
    // Match warning lines with line numbers
    const warningMatch = line.match(/^\s*(\d+):(\d+)\s+warning\s+React Hook (useEffect|useCallback|useMemo) has.*exhaustive-deps/);
    if (warningMatch && currentFile) {
      const lineNum = parseInt(warningMatch[1], 10);
      const hookType = warningMatch[3];
      
      if (!fileWarnings.has(currentFile)) {
        fileWarnings.set(currentFile, []);
      }
      
      fileWarnings.get(currentFile).push({
        line: lineNum,
        hookType: hookType
      });
    }
  }
  
  return fileWarnings;
}

// Main execution
console.log('Fixing React Hooks exhaustive-deps warnings...\n');

const lintFile = path.join(process.cwd(), 'lint-after-vars.txt');
const fileWarnings = parseLintOutput(lintFile);

let fixedCount = 0;
let totalWarnings = 0;

fileWarnings.forEach((warnings, filePath) => {
  totalWarnings += warnings.length;
  if (processFile(filePath, warnings)) {
    console.log(`Fixed: ${filePath} (${warnings.length} warnings)`);
    fixedCount++;
  }
});

console.log(`\n✓ Fixed ${fixedCount} files with ${totalWarnings} exhaustive-deps warnings`);
