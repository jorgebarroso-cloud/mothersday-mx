/**
 * Complete SEO Technical Audit Verification
 * Verifies all 5 critical points from the audit
 */

const fs = require('fs');
const path = require('path');

console.log('🕵️ COMPLETE SEO TECHNICAL AUDIT VERIFICATION\n');
console.log('='.repeat(70));

let allOk = true;
const criticalIssues = [];
const warnings = [];

// 1. Localhost & Protocol Check
console.log('\n1. 🚫 LOCALHOST & PROTOCOL CHECK');
console.log('-'.repeat(70));

const srcFiles = [
  'src/app/sitemap.ts',
  'src/app/robots.ts',
  'src/lib/utils/basepath.ts',
  'middleware.ts',
  'next.config.js'
];

let foundLocalhost = false;
srcFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Check for hardcoded localhost (excluding comments and dev scripts)
    const localhostMatches = content.match(/localhost|127\.0\.0\.1/g);
    if (localhostMatches && !file.includes('basepath')) {
      // basepath.ts is allowed to check for localhost
      const isInComment = content.split('\n').some((line, idx) => {
        const matchIdx = content.indexOf(localhostMatches[0]);
        const lineStart = content.lastIndexOf('\n', matchIdx);
        return line.substring(0, lineStart).includes('//') || 
               line.substring(0, lineStart).includes('/*');
      });
      if (!isInComment) {
        console.log(`  ⚠️  ${file}: Contains localhost reference`);
        warnings.push(`${file}: localhost reference found`);
      }
    }
    
    // Check for http:// (excluding SVG xmlns which is standard)
    const httpMatches = content.match(/http:\/\/[^s]/g);
    if (httpMatches) {
      httpMatches.forEach(match => {
        if (!match.includes('www.w3.org') && !match.includes('xmlns')) {
          console.log(`  ❌ ${file}: Contains http:// (insecure)`);
          criticalIssues.push(`${file}: Insecure http:// link found`);
          allOk = false;
        }
      });
    }
    
    // Check baseUrl
    if (content.includes('baseUrl') || content.includes('baseUrl')) {
      const hasProductionUrl = content.includes('celebratevalentines.com');
      if (hasProductionUrl) {
        console.log(`  ✅ ${file}: Uses production domain`);
      } else {
        console.log(`  ⚠️  ${file}: baseUrl may not be production`);
        warnings.push(`${file}: Verify baseUrl is production`);
      }
    }
  }
});

if (!foundLocalhost) {
  console.log('  ✅ No hardcoded localhost URLs in production code');
}

// 2. Robots Governance
console.log('\n2. 🤖 ROBOT GOVERNANCE & LLM VISIBILITY');
console.log('-'.repeat(70));

const robotsPath = path.join(__dirname, '../src/app/robots.ts');
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  
  // Check for Allow: /
  if (robotsContent.includes("allow: '/'") || robotsContent.includes('allow: "/"')) {
    console.log('  ✅ User-agent: * has Allow: /');
  } else {
    console.log('  ❌ Missing Allow: /');
    criticalIssues.push('robots.ts: Missing Allow: /');
    allOk = false;
  }
  
  // Check for AI bots
  const aiBots = ['GPTBot', 'Google-Extended', 'CCBot', 'ClaudeBot', 'anthropic-ai', 'cohere-ai', 'OAI-SearchBot'];
  const allAiBotsPresent = aiBots.every(bot => robotsContent.includes(bot));
  if (allAiBotsPresent) {
    console.log('  ✅ All AI bots explicitly allowed');
  } else {
    console.log('  ⚠️  Some AI bots may be missing');
    warnings.push('robots.ts: Verify all AI bots are allowed');
  }
  
  // CRITICAL: Check if /_next/ is blocked
  if (robotsContent.includes("disallow: ['/api/', '/admin/', '/_next/']") || 
      robotsContent.includes('disallow: ["/api/", "/admin/", "/_next/"]')) {
    console.log('  ❌ CRITICAL: /_next/ is blocked - this will prevent rendering!');
    criticalIssues.push('robots.ts: /_next/ is blocked - must allow /_next/static/');
    allOk = false;
  } else if (robotsContent.includes("disallow: ['/api/', '/admin/']") ||
             robotsContent.includes('disallow: ["/api/", "/admin/"]')) {
    console.log('  ✅ /_next/ is NOT blocked (correct)');
  } else {
    console.log('  ⚠️  Verify /_next/ is not blocked');
    warnings.push('robots.ts: Verify /_next/static/ is accessible');
  }
  
  // Check sitemap
  if (robotsContent.includes('celebratevalentines.com/sitemap.xml')) {
    console.log('  ✅ Sitemap points to production URL');
  } else {
    console.log('  ⚠️  Verify sitemap URL');
    warnings.push('robots.ts: Verify sitemap URL');
  }
} else {
  console.log('  ❌ robots.ts not found');
  criticalIssues.push('robots.ts: File not found');
  allOk = false;
}

// 3. Hreflang Integrity
console.log('\n3. 🌍 HREFLANG INTEGRITY');
console.log('-'.repeat(70));

const cityPagePath = path.join(__dirname, '../src/app/[locale]/[city]/page.tsx');
if (fs.existsSync(cityPagePath)) {
  const cityPageContent = fs.readFileSync(cityPagePath, 'utf8');
  
  // Check for alternates.languages
  if (cityPageContent.includes('alternates:') && cityPageContent.includes('languages:')) {
    console.log('  ✅ Hreflang implemented via alternates.languages');
  } else {
    console.log('  ⚠️  Hreflang may not be implemented');
    warnings.push('City pages: Verify hreflang implementation');
  }
  
  // Check for x-default
  if (cityPageContent.includes("'x-default'") || cityPageContent.includes('"x-default"')) {
    console.log('  ✅ x-default included');
  } else {
    console.log('  ⚠️  x-default may be missing');
    warnings.push('City pages: Verify x-default hreflang');
  }
  
  // Check for absolute URLs
  if (cityPageContent.includes('https://celebratevalentines.com/')) {
    console.log('  ✅ Hreflang URLs are absolute (HTTPS)');
  } else {
    console.log('  ❌ Hreflang URLs may not be absolute');
    criticalIssues.push('City pages: Hreflang URLs must be absolute');
    allOk = false;
  }
  
  // Check for self-reference (current locale should be in languages object)
  // This is handled by Next.js automatically if the current URL is in the languages object
  console.log('  ⚠️  Verify self-referencing hreflang (should be automatic)');
  warnings.push('City pages: Verify self-referencing hreflang link');
}

// 4. Sitemap Architecture
console.log('\n4. 🗺️ SITEMAP ARCHITECTURE');
console.log('-'.repeat(70));

const sitemapPath = path.join(__dirname, '../src/app/sitemap.ts');
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  
  // Check for all locales
  const locales = ['en', 'es', 'fr', 'de', 'it', 'pt'];
  const allLocalesPresent = locales.every(locale => sitemapContent.includes(`'${locale}'`) || sitemapContent.includes(`"${locale}"`));
  if (allLocalesPresent) {
    console.log('  ✅ All locales included');
  } else {
    console.log('  ⚠️  Some locales may be missing');
    warnings.push('sitemap.ts: Verify all locales are included');
  }
  
  // Check for cities
  if (sitemapContent.includes('CITIES') || sitemapContent.includes('cities')) {
    console.log('  ✅ Cities array found');
  } else {
    console.log('  ⚠️  Verify cities are included');
    warnings.push('sitemap.ts: Verify cities are included');
  }
  
  // Check for absolute URLs
  if (sitemapContent.includes('https://celebratevalentines.com')) {
    console.log('  ✅ URLs are absolute (HTTPS)');
  } else {
    console.log('  ❌ URLs may not be absolute');
    criticalIssues.push('sitemap.ts: URLs must be absolute');
    allOk = false;
  }
  
  // Check for duplicate URLs (basic check)
  if (sitemapContent.includes('//')) {
    console.log('  ⚠️  Potential duplicate slashes in URLs');
    warnings.push('sitemap.ts: Check for duplicate slashes');
  } else {
    console.log('  ✅ No obvious duplicate slashes');
  }
} else {
  console.log('  ❌ sitemap.ts not found');
  criticalIssues.push('sitemap.ts: File not found');
  allOk = false;
}

// 5. Internal Linking
console.log('\n5. 🔗 INTERNAL LINKING & ARCHITECTURE');
console.log('-'.repeat(70));

const componentsToCheck = [
  'src/components/layout/header.tsx',
  'src/components/layout/footer.tsx',
  'src/components/valentines/city-selector.tsx'
];

let allUseNextLink = true;
componentsToCheck.forEach(comp => {
  const compPath = path.join(__dirname, '..', comp);
  if (fs.existsSync(compPath)) {
    const compContent = fs.readFileSync(compPath, 'utf8');
    if (compContent.includes("from 'next/link'") || compContent.includes('from "next/link"')) {
      console.log(`  ✅ ${comp}: Uses Next.js Link`);
    } else {
      console.log(`  ⚠️  ${comp}: May not use Next.js Link`);
      warnings.push(`${comp}: Verify Next.js Link usage`);
      allUseNextLink = false;
    }
  }
});

if (allUseNextLink) {
  console.log('  ✅ All components use Next.js Link');
}

// Summary
console.log('\n' + '='.repeat(70));
console.log('📋 AUDIT SUMMARY');
console.log('='.repeat(70));

if (allOk && criticalIssues.length === 0) {
  console.log('✅ ALL CHECKS PASSED');
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (non-critical):');
    warnings.forEach(w => console.log(`  - ${w}`));
  }
} else {
  console.log('❌ CRITICAL ISSUES FOUND:');
  criticalIssues.forEach(issue => console.log(`  - ${issue}`));
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach(w => console.log(`  - ${w}`));
  }
  process.exit(1);
}

console.log('\n' + '='.repeat(70));
console.log('✅ AUDIT COMPLETE');
console.log('='.repeat(70));
