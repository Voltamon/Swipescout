const fs = require('fs');
const path = require('path');

// Common unused variables to check and potentially remove
const VARIABLES_TO_CHECK = ['user', 'theme', 't', 'isMobile', 'loading', 'error'];

function isVariableUsed(content, varName, declarationLine) {
  // Split content into lines
  const lines = content.split('\n');
  
  // Remove the declaration line and everything before it
  const lineIndex = lines.findIndex(line => line.includes(declarationLine));
  if (lineIndex === -1) return true; // If we can't find it, assume it's used
  
  const contentAfterDeclaration = lines.slice(lineIndex + 1).join('\n');
  
  // Check if the variable is used after its declaration
  // Look for the variable name as a whole word (not part of another word)
  const usageRegex = new RegExp(`\\b${varName}\\b`, 'g');
  const matches = contentAfterDeclaration.match(usageRegex);
  
  return matches && matches.length > 0;
}

function removeUnusedDestructuredVar(content, varName) {
  const lines = content.split('\n');
  let modified = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Match: const { user } = useAuth();
    // or: const { user, otherVar } = useAuth();
    const singleVarMatch = line.match(new RegExp(`const\\s*\\{\\s*${varName}\\s*\\}\\s*=`));
    const multiVarMatch = line.match(new RegExp(`const\\s*\\{([^}]+)\\}\\s*=`));
    
    if (singleVarMatch) {
      // Check if it's actually used
      if (!isVariableUsed(content, varName, line)) {
        // Comment out the entire line
        lines[i] = `  // ${line.trim()} // Removed: unused variable`;
        modified = true;
      }
    } else if (multiVarMatch && line.includes(varName)) {
      // Multiple variables in destructuring
      const varsString = multiVarMatch[1];
      const vars = varsString.split(',').map(v => v.trim());
      
      // Check if this specific variable is used
      if (vars.includes(varName) && !isVariableUsed(content, varName, line)) {
        // Remove just this variable from the destructuring
        const newVars = vars.filter(v => v !== varName);
        
        if (newVars.length === 0) {
          // All variables unused, comment out line
          lines[i] = `  // ${line.trim()} // Removed: unused variable`;
        } else {
          // Keep other variables
          const replacement = line.replace(
            `{ ${varsString} }`,
            `{ ${newVars.join(', ')} }`
          );
          lines[i] = replacement;
        }
        modified = true;
      }
    }
    
    // Match: const user = something;
    const directAssignMatch = line.match(new RegExp(`const\\s+${varName}\\s*=`));
    if (directAssignMatch && !isVariableUsed(content, varName, line)) {
      lines[i] = `  // ${line.trim()} // Removed: unused variable`;
      modified = true;
    }
  }
  
  return modified ? lines.join('\n') : null;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let fileModified = false;
    
    for (const varName of VARIABLES_TO_CHECK) {
      const result = removeUnusedDestructuredVar(newContent, varName);
      if (result) {
        newContent = result;
        fileModified = true;
      }
    }
    
    if (fileModified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other build directories
      if (!['node_modules', 'build', 'dist', '.git'].includes(file)) {
        walkDir(filePath, fileList);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main execution
console.log('Removing unused variables...\n');

const srcDir = path.join(process.cwd(), 'src');
const files = walkDir(srcDir);

let fixedCount = 0;
const fixedFiles = [];

files.forEach(file => {
  if (processFile(file)) {
    console.log(`Fixed: ${file}`);
    fixedFiles.push(file);
    fixedCount++;
  }
});

console.log(`\n✓ Fixed ${fixedCount} files`);
