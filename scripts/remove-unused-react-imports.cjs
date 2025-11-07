const fs = require('fs');
const path = require('path');

let fixedFiles = 0;

function removeUnusedReactImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // List of React imports to check
  const reactImports = ['useContext', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useState'];
  
  // Pattern to match React import statement
  const reactImportRegex = /import\s+React(?:,\s*\{([^}]+)\})?\s+from\s+['"]react['"]/;
  const match = content.match(reactImportRegex);
  
  if (match && match[1]) {
    const imports = match[1].split(',').map(i => i.trim()).filter(i => i);
    const filteredImports = [];
    
    imports.forEach(imp => {
      const impName = imp.split(' as ')[0].trim();
      
      // Check if this import is actually used in the file
      const usageRegex = new RegExp(`\\b${impName}\\(|\\b${impName}\\s`, 'g');
      const matches = content.match(usageRegex) || [];
      
      // If found more than once (import + usage), keep it
      if (matches.length > 0) {
        filteredImports.push(imp);
      }
    });
    
    // Rebuild the import statement
    if (filteredImports.length === 0) {
      // Only default React import
      content = content.replace(reactImportRegex, "import React from 'react'");
    } else if (filteredImports.length !== imports.length) {
      // Some imports removed
      content = content.replace(reactImportRegex, `import React, { ${filteredImports.join(', ')} } from 'react'`);
    }
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        processDirectory(filePath);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      if (removeUnusedReactImports(filePath)) {
        fixedFiles++;
        console.log(`Fixed: ${filePath}`);
      }
    }
  });
}

const srcPath = path.join(__dirname, '..', 'src');
console.log('Removing unused React imports...\n');
processDirectory(srcPath);
console.log(`\n✓ Fixed ${fixedFiles} files`);
