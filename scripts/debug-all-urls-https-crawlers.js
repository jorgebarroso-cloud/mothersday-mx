/**
 * 🔍 DEBUG COMPLETO: Verificar que TODAS las URLs sean HTTPS y visibles por crawlers
 * 
 * Este script verifica:
 * 1. Todas las URLs generadas en el código son HTTPS
 * 2. No hay referencias a localhost o http://
 * 3. robots.txt permite acceso a crawlers
 * 4. Sitemap genera URLs correctas
 * 5. Metadata genera URLs canónicas correctas
 * 6. Hreflang genera URLs correctas
 * 7. UTM tracking usa URLs correctas
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PRODUCTION_DOMAIN = 'https://celebratevalentines.com';
const HTTP_PATTERN = /http:\/\//gi;
const LOCALHOST_PATTERN = /localhost|127\.0\.0\.1/gi;
const URL_PATTERN = /(https?:\/\/[^\s"'<>\)]+|['"`]\/[^'"`\s]+['"`])/gi;

const errors = [];
const warnings = [];
const info = [];

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function logError(message) {
  errors.push(message);
  console.error(`${colors.red}❌ ERROR:${colors.reset} ${message}`);
}

function logWarning(message) {
  warnings.push(message);
  console.warn(`${colors.yellow}⚠️  WARNING:${colors.reset} ${message}`);
}

function logInfo(message) {
  info.push(message);
  console.log(`${colors.cyan}ℹ️  INFO:${colors.reset} ${message}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✅${colors.reset} ${message}`);
}

// Función para leer archivos recursivamente
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      // Ignorar node_modules, .next, out, etc.
      if (!['node_modules', '.next', 'out', '.git', 'dist', 'build'].includes(file)) {
        getAllFiles(filePath, arrayOfFiles);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Verificar archivo específico
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  let hasIssues = false;

  // 1. Verificar HTTP (no HTTPS)
  const httpMatches = content.match(HTTP_PATTERN);
  if (httpMatches) {
    // Filtrar casos válidos (xmlns en SVG, comentarios, etc.)
    const invalidHttp = httpMatches.filter((match, index) => {
      const beforeMatch = content.substring(0, content.indexOf(match, index));
      const afterMatch = content.substring(content.indexOf(match, index));
      
      // Ignorar si está en comentario
      const lastComment = beforeMatch.lastIndexOf('//');
      const lastBlockComment = beforeMatch.lastIndexOf('/*');
      const lastBlockCommentEnd = beforeMatch.lastIndexOf('*/');
      
      if (lastComment > lastBlockCommentEnd && !afterMatch.match(/^\s*\/\//)) {
        return false; // Es un comentario
      }
      
      // Ignorar xmlns en SVG
      if (beforeMatch.includes('xmlns') && afterMatch.match(/^:\/\/www\.w3\.org/)) {
        return false; // Es xmlns estándar XML
      }
      
      return true; // Es un problema
    });
    
    if (invalidHttp.length > 0) {
      logError(`${relativePath}: Encontrado ${invalidHttp.length} uso(s) de http:// (debe ser https://)`);
      hasIssues = true;
    }
  }

  // 2. Verificar localhost
  const localhostMatches = content.match(LOCALHOST_PATTERN);
  if (localhostMatches) {
    // Filtrar comentarios y documentación
    const invalidLocalhost = localhostMatches.filter((match, index) => {
      const beforeMatch = content.substring(0, content.indexOf(match, index));
      const lastComment = beforeMatch.lastIndexOf('//');
      const lastBlockComment = beforeMatch.lastIndexOf('/*');
      const lastBlockCommentEnd = beforeMatch.lastIndexOf('*/');
      
      // Ignorar si está en comentario
      if (lastComment > lastBlockCommentEnd || lastBlockComment > lastBlockCommentEnd) {
        return false;
      }
      
      // Ignorar si está en string de documentación (dentro de markdown o comentarios de documentación)
      if (beforeMatch.includes('localhost') && beforeMatch.match(/\/\*\*|\/\/.*localhost/)) {
        return false;
      }
      
      return true;
    });
    
    if (invalidLocalhost.length > 0) {
      logError(`${relativePath}: Encontrado ${invalidLocalhost.length} referencia(s) a localhost/127.0.0.1 en código de producción`);
      hasIssues = true;
    }
  }

  // 3. Verificar URLs hardcodeadas que no sean HTTPS
  const urlMatches = content.match(URL_PATTERN);
  if (urlMatches) {
    urlMatches.forEach((urlMatch) => {
      // Limpiar comillas
      const cleanUrl = urlMatch.replace(/['"`]/g, '');
      
      // Verificar si es una URL absoluta
      if (cleanUrl.startsWith('http://')) {
        logError(`${relativePath}: URL HTTP encontrada: ${cleanUrl}`);
        hasIssues = true;
      }
      
      // Verificar si es una URL relativa que debería ser absoluta en producción
      if (cleanUrl.startsWith('/') && !cleanUrl.startsWith('//')) {
        // Verificar si está en contextos donde debería ser absoluta (canonical, hreflang, sitemap, etc.)
        const context = content.substring(Math.max(0, content.indexOf(urlMatch) - 100), content.indexOf(urlMatch) + 100);
        if (context.includes('canonical') || context.includes('hreflang') || context.includes('sitemap') || 
            context.includes('openGraph') || context.includes('twitter') || context.includes('alternates')) {
          logWarning(`${relativePath}: URL relativa en contexto de SEO (debería ser absoluta): ${cleanUrl}`);
        }
      }
    });
  }

  // 4. Verificar uso de window.location.origin (debería usar getNormalizedOrigin)
  if (content.includes('window.location.origin') && !content.includes('getNormalizedOrigin')) {
    // Verificar que no esté en comentarios
    const originMatches = content.match(/window\.location\.origin/g);
    if (originMatches) {
      originMatches.forEach((match, index) => {
        const beforeMatch = content.substring(0, content.indexOf(match, index));
        const lastComment = beforeMatch.lastIndexOf('//');
        const lastBlockComment = beforeMatch.lastIndexOf('/*');
        const lastBlockCommentEnd = beforeMatch.lastIndexOf('*/');
        
        if (lastComment <= lastBlockCommentEnd && lastBlockComment <= lastBlockCommentEnd) {
          logWarning(`${relativePath}: Uso de window.location.origin (debería usar getNormalizedOrigin() para garantizar URL de producción)`);
          hasIssues = true;
        }
      });
    }
  }

  // 5. Verificar baseUrl hardcodeado
  if (content.includes('baseUrl') || content.includes('baseURL')) {
    const baseUrlMatches = content.match(/baseUrl\s*[:=]\s*['"`]([^'"`]+)['"`]/gi);
    if (baseUrlMatches) {
      baseUrlMatches.forEach((match) => {
        const url = match.match(/['"`]([^'"`]+)['"`]/)[1];
        if (!url.startsWith('https://')) {
          logError(`${relativePath}: baseUrl no es HTTPS: ${url}`);
          hasIssues = true;
        }
        if (url !== PRODUCTION_DOMAIN && !url.includes('localhost') && !url.includes('127.0.0.1')) {
          logWarning(`${relativePath}: baseUrl no es el dominio de producción: ${url}`);
        }
      });
    }
  }

  return hasIssues;
}

// Verificar archivos específicos críticos
function checkCriticalFiles() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 VERIFICANDO ARCHIVOS CRÍTICOS');
  console.log('='.repeat(80) + '\n');

  const criticalFiles = [
    'src/app/sitemap.ts',
    'src/app/robots.ts',
    'src/lib/utils/basepath.ts',
    'src/lib/valentines/utm.ts',
    'src/app/[locale]/[city]/page.tsx',
    'src/app/[locale]/[city]/gifts/page.tsx',
    'src/app/[locale]/[city]/restaurants/page.tsx',
    'src/app/[locale]/[city]/valentines-day/ideas/page.tsx',
    'src/app/[locale]/[city]/valentines-day/last-minute/page.tsx',
    'src/components/seo/hreflang-links.tsx',
    'middleware.ts',
    'public/robots.txt',
  ];

  criticalFiles.forEach((file) => {
    const filePath = path.join(PROJECT_ROOT, file);
    if (fs.existsSync(filePath)) {
      logInfo(`Verificando: ${file}`);
      checkFile(filePath);
    } else {
      logWarning(`Archivo no encontrado: ${file}`);
    }
  });
}

// Verificar robots.txt
function checkRobotsTxt() {
  console.log('\n' + '='.repeat(80));
  console.log('🤖 VERIFICANDO ROBOTS.TXT');
  console.log('='.repeat(80) + '\n');

  const robotsTxtPath = path.join(PROJECT_ROOT, 'public/robots.txt');
  const robotsTsPath = path.join(PROJECT_ROOT, 'src/app/robots.ts');

  // Verificar robots.txt estático
  if (fs.existsSync(robotsTxtPath)) {
    const content = fs.readFileSync(robotsTxtPath, 'utf8');
    
    // Verificar que permite /_next/static/
    if (!content.includes('Allow: /_next/static/') && !content.includes('Allow:/_next/static/')) {
      logError('public/robots.txt: No permite acceso a /_next/static/ (necesario para Next.js rendering)');
    } else {
      logSuccess('public/robots.txt: Permite acceso a /_next/static/');
    }

    // Verificar sitemap
    if (!content.includes('Sitemap:')) {
      logWarning('public/robots.txt: No tiene declaración de Sitemap');
    } else if (!content.includes(PRODUCTION_DOMAIN)) {
      logError(`public/robots.txt: Sitemap no apunta a ${PRODUCTION_DOMAIN}`);
    } else {
      logSuccess('public/robots.txt: Sitemap configurado correctamente');
    }
  } else {
    logWarning('public/robots.txt: No existe (se usa robots.ts dinámico)');
  }

  // Verificar robots.ts
  if (fs.existsSync(robotsTsPath)) {
    const content = fs.readFileSync(robotsTsPath, 'utf8');
    
    // Verificar que no bloquea /_next/
    if (content.includes("disallow: ['/api/', '/admin/', '/_next/']") || 
        content.includes('disallow: ["/api/", "/admin/", "/_next/"]')) {
      logError('src/app/robots.ts: Bloquea /_next/ (debe permitir /_next/static/ para Next.js rendering)');
    } else {
      logSuccess('src/app/robots.ts: No bloquea /_next/ (correcto)');
    }

    // Verificar sitemap
    if (!content.includes(PRODUCTION_DOMAIN)) {
      logError(`src/app/robots.ts: Sitemap no usa ${PRODUCTION_DOMAIN}`);
    } else {
      logSuccess('src/app/robots.ts: Sitemap configurado correctamente');
    }

    // Verificar que permite AI bots
    const aiBots = ['GPTBot', 'Google-Extended', 'CCBot', 'ClaudeBot'];
    aiBots.forEach((bot) => {
      if (content.includes(bot)) {
        logSuccess(`src/app/robots.ts: Permite ${bot}`);
      } else {
        logWarning(`src/app/robots.ts: No tiene regla explícita para ${bot}`);
      }
    });
  }
}

// Verificar sitemap
function checkSitemap() {
  console.log('\n' + '='.repeat(80));
  console.log('🗺️  VERIFICANDO SITEMAP');
  console.log('='.repeat(80) + '\n');

  const sitemapPath = path.join(PROJECT_ROOT, 'src/app/sitemap.ts');
  if (!fs.existsSync(sitemapPath)) {
    logError('src/app/sitemap.ts: No existe');
    return;
  }

  const content = fs.readFileSync(sitemapPath, 'utf8');

  // Verificar baseUrl
  if (!content.includes(PRODUCTION_DOMAIN)) {
    logError(`src/app/sitemap.ts: No usa ${PRODUCTION_DOMAIN} como baseUrl`);
  } else {
    logSuccess(`src/app/sitemap.ts: Usa ${PRODUCTION_DOMAIN} como baseUrl`);
  }

  // Verificar que no use http://
  if (content.match(HTTP_PATTERN)) {
    logError('src/app/sitemap.ts: Contiene http:// (debe ser https://)');
  } else {
    logSuccess('src/app/sitemap.ts: Todas las URLs son HTTPS');
  }

  // Verificar estructura
  if (!content.includes('MetadataRoute.Sitemap')) {
    logWarning('src/app/sitemap.ts: No usa MetadataRoute.Sitemap (puede ser correcto si usa otro método)');
  }
}

// Verificar getNormalizedOrigin
function checkGetNormalizedOrigin() {
  console.log('\n' + '='.repeat(80));
  console.log('🔧 VERIFICANDO getNormalizedOrigin()');
  console.log('='.repeat(80) + '\n');

  const basepathPath = path.join(PROJECT_ROOT, 'src/lib/utils/basepath.ts');
  if (!fs.existsSync(basepathPath)) {
    logError('src/lib/utils/basepath.ts: No existe');
    return;
  }

  const content = fs.readFileSync(basepathPath, 'utf8');

  // Verificar que retorna HTTPS en producción
  if (!content.includes(PRODUCTION_DOMAIN)) {
    logError(`src/lib/utils/basepath.ts: getNormalizedOrigin() no retorna ${PRODUCTION_DOMAIN} en producción`);
  } else {
    logSuccess('src/lib/utils/basepath.ts: getNormalizedOrigin() retorna dominio de producción correctamente');
  }

  // Verificar que no use window.location.origin en producción
  const hasWindowOrigin = content.includes('window.location.origin');
  const hasProductionCheck = content.includes('celebratevalentines.com') || content.includes('isProduction');
  
  if (hasWindowOrigin && hasProductionCheck) {
    logSuccess('src/lib/utils/basepath.ts: getNormalizedOrigin() verifica producción antes de usar window.location.origin');
  } else if (hasWindowOrigin) {
    logWarning('src/lib/utils/basepath.ts: getNormalizedOrigin() usa window.location.origin sin verificar producción');
  }
}

// Verificar todas las páginas que generan metadata
function checkMetadataPages() {
  console.log('\n' + '='.repeat(80));
  console.log('📄 VERIFICANDO PÁGINAS CON METADATA');
  console.log('='.repeat(80) + '\n');

  const metadataPages = [
    'src/app/[locale]/[city]/page.tsx',
    'src/app/[locale]/[city]/gifts/page.tsx',
    'src/app/[locale]/[city]/restaurants/page.tsx',
    'src/app/[locale]/[city]/valentines-day/ideas/page.tsx',
    'src/app/[locale]/[city]/valentines-day/last-minute/page.tsx',
    'src/app/[locale]/page.tsx',
  ];

  metadataPages.forEach((page) => {
    const filePath = path.join(PROJECT_ROOT, page);
    if (!fs.existsSync(filePath)) {
      logWarning(`No existe: ${page}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar que generateMetadata existe
    if (!content.includes('generateMetadata')) {
      logWarning(`${page}: No tiene generateMetadata`);
      return;
    }

    // Verificar canonical
    if (content.includes('canonical')) {
      if (content.includes(`canonicalUrl`) && content.includes(PRODUCTION_DOMAIN)) {
        logSuccess(`${page}: Canonical URL usa ${PRODUCTION_DOMAIN}`);
      } else {
        logError(`${page}: Canonical URL no usa ${PRODUCTION_DOMAIN}`);
      }
    } else {
      logWarning(`${page}: No tiene canonical URL`);
    }

    // Verificar hreflang
    if (content.includes('alternates') && content.includes('languages')) {
      if (content.includes(PRODUCTION_DOMAIN)) {
        logSuccess(`${page}: Hreflang URLs usan ${PRODUCTION_DOMAIN}`);
      } else {
        logError(`${page}: Hreflang URLs no usan ${PRODUCTION_DOMAIN}`);
      }
    } else {
      logWarning(`${page}: No tiene hreflang configurado`);
    }

    // Verificar OpenGraph
    if (content.includes('openGraph')) {
      if (content.includes(PRODUCTION_DOMAIN)) {
        logSuccess(`${page}: OpenGraph URLs usan ${PRODUCTION_DOMAIN}`);
      } else {
        logWarning(`${page}: OpenGraph URLs pueden no usar ${PRODUCTION_DOMAIN}`);
      }
    }
  });
}

// Verificar UTM tracking
function checkUtmTracking() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 VERIFICANDO UTM TRACKING');
  console.log('='.repeat(80) + '\n');

  const utmPath = path.join(PROJECT_ROOT, 'src/lib/valentines/utm.ts');
  if (!fs.existsSync(utmPath)) {
    logError('src/lib/valentines/utm.ts: No existe');
    return;
  }

  const content = fs.readFileSync(utmPath, 'utf8');

  // Verificar que usa getNormalizedOrigin
  if (content.includes('getNormalizedOrigin')) {
    logSuccess('src/lib/valentines/utm.ts: Usa getNormalizedOrigin()');
  } else if (content.includes('window.location.origin')) {
    logError('src/lib/valentines/utm.ts: Usa window.location.origin (debe usar getNormalizedOrigin())');
  } else {
    logWarning('src/lib/valentines/utm.ts: No se encontró uso de getNormalizedOrigin() ni window.location.origin');
  }
}

// Escanear todos los archivos
function scanAllFiles() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 ESCANEANDO TODOS LOS ARCHIVOS');
  console.log('='.repeat(80) + '\n');

  const srcPath = path.join(PROJECT_ROOT, 'src');
  if (!fs.existsSync(srcPath)) {
    logError('Directorio src/ no existe');
    return;
  }

  const allFiles = getAllFiles(srcPath);
  logInfo(`Encontrados ${allFiles.length} archivos para verificar`);

  let filesWithIssues = 0;
  allFiles.forEach((file) => {
    if (checkFile(file)) {
      filesWithIssues++;
    }
  });

  if (filesWithIssues === 0) {
    logSuccess(`Todos los ${allFiles.length} archivos verificados sin problemas críticos`);
  } else {
    logWarning(`${filesWithIssues} archivo(s) con problemas encontrados`);
  }
}

// Resumen final
function printSummary() {
  console.log('\n' + '='.repeat(80));
  console.log('📋 RESUMEN FINAL');
  console.log('='.repeat(80) + '\n');

  console.log(`${colors.cyan}ℹ️  Informaciones:${colors.reset} ${info.length}`);
  console.log(`${colors.yellow}⚠️  Advertencias:${colors.reset} ${warnings.length}`);
  console.log(`${colors.red}❌ Errores:${colors.reset} ${errors.length}`);

  if (errors.length === 0 && warnings.length === 0) {
    console.log(`\n${colors.green}✅ ¡PERFECTO! Todas las URLs son HTTPS y visibles por crawlers${colors.reset}\n`);
    return 0;
  } else if (errors.length === 0) {
    console.log(`\n${colors.yellow}⚠️  Hay advertencias pero no errores críticos${colors.reset}\n`);
    return 0;
  } else {
    console.log(`\n${colors.red}❌ Se encontraron errores que deben corregirse${colors.reset}\n`);
    return 1;
  }
}

// Ejecutar todas las verificaciones
function main() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 DEBUG COMPLETO: URLs HTTPS y Visibilidad para Crawlers');
  console.log('='.repeat(80));
  console.log(`Dominio de producción: ${PRODUCTION_DOMAIN}`);
  console.log(`Directorio del proyecto: ${PROJECT_ROOT}`);
  console.log('='.repeat(80) + '\n');

  checkCriticalFiles();
  checkRobotsTxt();
  checkSitemap();
  checkGetNormalizedOrigin();
  checkMetadataPages();
  checkUtmTracking();
  scanAllFiles();

  const exitCode = printSummary();
  process.exit(exitCode);
}

main();
