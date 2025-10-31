#!/usr/bin/env node

/**
 * Script to extract hardcoded strings from React components and suggest i18n keys
 * Usage: node scripts/extract-i18n-strings.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pages used in dashboard tabs
const DASHBOARD_PAGES = [
  'JobSearchPage.jsx',
  'ResumeBuilderPage.jsx',
  'InterviewPage.jsx',
  'NotificationSettingsPage.jsx',
  'AllVideosPage.jsx',
  'SavedVideosPage.jsx',
  'LikedVideosPage.jsx',
  'JobSeekerProfile.jsx',
  'Settings.jsx',
  'JobSeekerDashboard.jsx',
  'Chat.jsx',
  'NotificationsPage.jsx',
  'VideoUpload.jsx',
  'VideoEditPage.jsx',
  'VideosPage.jsx',
  'CareerAdvicePage.jsx',
  'PersonalityTestPage.jsx',
  'SkillGapAnalysisPage.jsx',
  'CandidateSearchPage.jsx',
  'JobPostingForm.jsx',
  'CompanyVideos.jsx',
  'JobsListingPage.jsx',
  'EmployerProfilePage.jsx',
  'EmployerDashboard.jsx',
  'HelpPageLinks.jsx',
  'AdminTabs.jsx',
  'admin/UserManagementPage.jsx',
  'admin/ContentModerationPage.jsx',
  'admin/BlogListPage.jsx',
  'admin/BlogEditorPage.jsx',
  'admin/AdminAnalyticsPage.jsx',
  'admin/SystemSettingsPage.jsx',
  'admin/AdminJobsPage.jsx',
  'admin/AdminVideosPage.jsx',
  'adminDashboard.jsx'
];

const PAGES_DIR = path.join(__dirname, '..', 'src', 'pages');

// Regex patterns to find hardcoded strings
const STRING_PATTERNS = [
  // JSX text content
  /<[^>]+>([^<>{]+)</g,
  // String literals in JSX attributes
  /(?:placeholder|title|label|alt|aria-label)=["']([^"']+)["']/g,
  // Template literals with simple text
  /`([^`${}]+)`/g,
  // Simple string literals (cautious)
  /["']([A-Z][a-zA-Z\s]{3,})["']/g
];

function extractStringsFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.jsx');
    const strings = new Set();

    // Check if file already uses i18n
    const usesI18n = content.includes('useTranslation') || content.includes('t(');

    STRING_PATTERNS.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const str = match[1]?.trim();
        if (str && str.length > 2 && !str.includes('className') && !str.includes('style')) {
          // Filter out likely variable names and code
          if (/^[A-Z]/.test(str) || /\s/.test(str)) {
            strings.add(str);
          }
        }
      }
    });

    return {
      fileName,
      filePath,
      usesI18n,
      strings: Array.from(strings).filter(s => 
        s.length > 3 && 
        !/^\d+$/.test(s) && 
        !s.includes('()') &&
        !s.includes('className') &&
        !/^[a-z]+$/.test(s) // ignore single lowercase words
      )
    };
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

function generateTranslationKeys(fileName, strings) {
  const baseName = fileName.replace(/Page|Dashboard|Profile|Form/g, '').toLowerCase();
  const translations = {};

  strings.forEach((str, index) => {
    const key = str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 3)
      .join('_');
    
    translations[key] = str;
  });

  return translations;
}

function main() {
  console.log('🔍 Scanning dashboard pages for hardcoded strings...\n');

  const results = [];

  DASHBOARD_PAGES.forEach(pageName => {
    const filePath = path.join(PAGES_DIR, pageName);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${pageName} - Not found`);
      return;
    }

    const result = extractStringsFromFile(filePath);
    if (result && result.strings.length > 0) {
      results.push(result);
    }
  });

  // Generate report
  console.log('\n📊 Internationalization Status Report\n');
  console.log('='.repeat(80));

  results.forEach(({ fileName, usesI18n, strings }) => {
    const status = usesI18n ? '✅ Uses i18n' : '❌ Needs i18n';
    console.log(`\n${status} - ${fileName}`);
    
    if (!usesI18n && strings.length > 0) {
      console.log(`  Found ${strings.length} potential strings to translate:`);
      strings.slice(0, 5).forEach(str => {
        console.log(`    - "${str}"`);
      });
      if (strings.length > 5) {
        console.log(`    ... and ${strings.length - 5} more`);
      }
    }
  });

  // Generate translation file suggestions
  console.log('\n\n📝 Suggested Translation Keys\n');
  console.log('='.repeat(80));

  const allTranslations = {};

  results.forEach(({ fileName, strings, usesI18n }) => {
    if (!usesI18n && strings.length > 0) {
      const translations = generateTranslationKeys(fileName, strings);
      const namespace = fileName.toLowerCase().replace('.jsx', '');
      allTranslations[namespace] = translations;
    }
  });

  // Save to file
  const outputPath = path.join(__dirname, 'i18n-extraction-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(allTranslations, null, 2));
  
  console.log(`\n✅ Results saved to: ${outputPath}`);
  console.log('\nNext steps:');
  console.log('1. Review the extracted strings');
  console.log('2. Add them to your locale files');
  console.log('3. Update components to use t() function');
}

main();
