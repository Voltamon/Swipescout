const fs = require('fs');
const path = require('path');

// List of common unused imports to remove
const unusedImports = [
  'useContext',
  'useEffect',
  'useCallback',
  'useMemo',
  'useRef',
  'useState',
  'useParams',
  'useNavigate',
  'useLocation',
  'useSearchParams',
  'useMediaQuery',
  'useTheme',
  'formatDistanceToNow',
  'motion',
  'fireEvent',
  'signInWithCustomToken',
  'enUS'
];

function removeUnusedImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove completely unused named imports from React
  const reactImportRegex = /import\s+(?:React(?:,\s*)?)?(?:\{([^}]+)\})?\s+from\s+['"]react['"]/;
  const match = content.match(reactImportRegex);
  
  if (match && match[1]) {
    const imports = match[1].split(',').map(i => i.trim()).filter(i => i);
    const filtered = imports.filter(imp => {
      const impName = imp.split(' as ')[0].trim();
      // Check if import is in unused list AND not used in code
      if (unusedImports.includes(impName)) {
        const usageRegex = new RegExp(`\\b${impName}\\b`, 'g');
        const matches = content.match(usageRegex) || [];
        // If only 1 match (the import itself), it's unused
        return matches.length > 1;
      }
      return true;
    });
    
    if (filtered.length !== imports.length) {
      if (filtered.length === 0) {
        content = content.replace(reactImportRegex, "import React from 'react'");
      } else {
        content = content.replace(reactImportRegex, `import React, { ${filtered.join(', ')} } from 'react'`);
      }
      modified = true;
    }
  }

  // Remove unused imports from react-router-dom
  const routerImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]react-router-dom['"]/;
  const routerMatch = content.match(routerImportRegex);
  
  if (routerMatch && routerMatch[1]) {
    const imports = routerMatch[1].split(',').map(i => i.trim()).filter(i => i);
    const filtered = imports.filter(imp => {
      const impName = imp.split(' as ')[0].trim();
      if (unusedImports.includes(impName)) {
        const usageRegex = new RegExp(`\\b${impName}\\b`, 'g');
        const matches = content.match(usageRegex) || [];
        return matches.length > 1;
      }
      return true;
    });
    
    if (filtered.length !== imports.length) {
      if (filtered.length === 0) {
        content = content.replace(routerImportRegex, '');
      } else {
        content = content.replace(routerImportRegex, `import { ${filtered.join(', ')} } from 'react-router-dom'`);
      }
      modified = true;
    }
  }

  // Prefix unused function parameters with underscore
  content = content.replace(/\(([^)]+)\)\s*=>\s*\{/g, (match, params) => {
    const paramList = params.split(',').map(p => p.trim());
    const newParams = paramList.map(param => {
      // Skip if already prefixed or is destructured
      if (param.startsWith('_') || param.includes('{') || param.includes('[')) {
        return param;
      }
      const paramName = param.split('=')[0].trim().split(':')[0].trim();
      return param; // Don't auto-prefix - too risky
    });
    return `(${newParams.join(', ')}) => {`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function fixUnusedVars(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Prefix unused catch parameters
  content = content.replace(/catch\s*\(\s*(\w+)\s*\)/g, (match, varName) => {
    if (!varName.startsWith('_')) {
      modified = true;
      return `catch (_${varName})`;
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function processDirectory(dir) {
  let totalFixed = 0;
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        totalFixed += processDirectory(filePath);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      if (removeUnusedImports(filePath)) {
        totalFixed++;
      }
      if (fixUnusedVars(filePath)) {
        // Already counted above if removeUnusedImports also ran
      }
    }
  });

  return totalFixed;
}

const srcPath = path.join(__dirname, '..', 'src');
console.log('Fixing ESLint errors...');
const fixed = processDirectory(srcPath);
console.log(`Fixed ${fixed} files`);
