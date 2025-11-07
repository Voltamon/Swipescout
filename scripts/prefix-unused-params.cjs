const fs = require('fs');
const path = require('path');

let fixedFiles = 0;

// Common unused parameter names that should be prefixed
const unusedParams = [
  'theme', 'e', 'err', 'error', 'videoId', 'Icon', 'asChild', 
  'formData', 'embedded', 'onStatusChange', 'setVideoTab', 
  'showSuggestions', 'filterType', 'showSidebar', 'showHeader', 
  'fullScreen', 'interviewId', 'meetingLink', 'divider',
  'index', 'prev', 'persistentToken'
];

function prefixUnusedParams(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Fix arrow function parameters
  // Match: (param) => or (param1, param2) =>
  content = content.replace(/\(([^)]+)\)\s*=>/g, (match, params) => {
    const paramList = params.split(',').map(p => p.trim());
    const newParams = paramList.map(param => {
      // Skip if already prefixed, is destructured, or has default value
      if (param.startsWith('_') || param.includes('{') || param.includes('[')) {
        return param;
      }
      
      // Get the param name (before : for types or = for defaults)
      const paramName = param.split('=')[0].split(':')[0].trim();
      
      // Check if it's in our list of known unused params
      if (unusedParams.includes(paramName)) {
        // Replace the param name with _paramName
        return param.replace(paramName, `_${paramName}`);
      }
      
      return param;
    });
    return `(${newParams.join(', ')}) =>`;
  });
  
  // Fix regular function parameters
  // Match: function name(param) or const name = function(param)
  content = content.replace(/function\s+\w*\s*\(([^)]+)\)/g, (match, params) => {
    const paramList = params.split(',').map(p => p.trim());
    const newParams = paramList.map(param => {
      if (param.startsWith('_') || param.includes('{') || param.includes('[')) {
        return param;
      }
      
      const paramName = param.split('=')[0].split(':')[0].trim();
      
      if (unusedParams.includes(paramName)) {
        return param.replace(paramName, `_${paramName}`);
      }
      
      return param;
    });
    
    return match.replace(params, newParams.join(', '));
  });
  
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
      if (prefixUnusedParams(filePath)) {
        fixedFiles++;
        console.log(`Fixed: ${filePath}`);
      }
    }
  });
}

const srcPath = path.join(__dirname, '..', 'src');
console.log('Prefixing unused parameters...\n');
processDirectory(srcPath);
console.log(`\n✓ Fixed ${fixedFiles} files`);
