const fs = require('fs');
const path = require('path');

// Map of pages to their namespaces
const pageNamespaceMap = {
  'Contact.jsx': 'contact',
  'ContactPage.jsx': 'contact',
  'FAQ/FAQs.jsx': 'faq',
  'FAQs.jsx': 'faq',
  'PricingPage.jsx': 'pricing',
  'CreditsPage.jsx': 'credits',
  'legal/PrivacyPolicy.jsx': 'legal',
  'legal/TermsOfService.jsx': 'legal',
  'legal/CookiePolicy.jsx': 'legal',
  'legal/CommunityGuidelines.jsx': 'legal',
  'legal/CopyrightAndIPTerms.jsx': 'legal',
  'legal/EULA.jsx': 'legal',
};

function fixFile(filePath, namespace) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix useTranslation hook
    const useTranslationRegex = /const\s*{\s*t\s*}\s*=\s*useTranslation\(\s*\)/g;
    if (useTranslationRegex.test(content)) {
      content = content.replace(useTranslationRegex, `const { t } = useTranslation('${namespace}')`);
      modified = true;
      console.log(`✓ Fixed useTranslation in ${filePath}`);
    }

    // Remove namespace prefix from t() calls
    const tCallRegex = new RegExp(`t\\('${namespace}\\.`, 'g');
    if (tCallRegex.test(content)) {
      content = content.replace(tCallRegex, "t('");
      modified = true;
      console.log(`✓ Removed namespace prefix in ${filePath}`);
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findAndFixFiles(dir, pageMap) {
  let fixedCount = 0;

  for (const [pagePattern, namespace] of Object.entries(pageMap)) {
    const searchPath = path.join(dir, 'src', 'pages', pagePattern);
    
    if (fs.existsSync(searchPath)) {
      if (fixFile(searchPath, namespace)) {
        fixedCount++;
      }
    } else {
      // Try to find the file
      const fileName = path.basename(pagePattern);
      const searchDir = path.dirname(searchPath);
      
      if (fs.existsSync(searchDir)) {
        const files = fs.readdirSync(searchDir);
        const found = files.find(f => f === fileName);
        
        if (found) {
          const fullPath = path.join(searchDir, found);
          if (fixFile(fullPath, namespace)) {
            fixedCount++;
          }
        }
      }
    }
  }

  return fixedCount;
}

// Main execution
const projectRoot = path.join(__dirname, '..');
console.log('🔧 Fixing i18n namespaces in pages...\n');

const fixed = findAndFixFiles(projectRoot, pageNamespaceMap);

console.log(`\n✅ Fixed ${fixed} files`);
