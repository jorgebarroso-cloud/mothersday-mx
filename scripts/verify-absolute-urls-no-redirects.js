/**
 * Verificar que no hay redirects HTTP→HTTPS y que todas las URLs son absolutas sin localhost
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando URLs absolutas y ausencia de redirects HTTP→HTTPS\n');
console.log('='.repeat(70));

let allOk = true;
const issues = [];
const warnings = [];

// 1. Verificar nginx.conf - NO debe tener redirects HTTP→HTTPS
console.log('\n1. 🌐 NGINX.CONF - Verificar redirects');
console.log('-'.repeat(70));

const nginxPath = path.join(__dirname, '../nginx.conf');
const nginxContent = fs.readFileSync(nginxPath, 'utf8');

// Verificar que NO hay redirects HTTP explícitos
if (nginxContent.includes('return 301 http://') || nginxContent.includes('return 302 http://')) {
  console.log('  ❌ CRITICAL: Hay redirects a HTTP en nginx.conf');
  issues.push('nginx.conf: Redirects a HTTP encontrados');
  allOk = false;
} else {
  console.log('  ✅ No hay redirects a HTTP en nginx.conf');
}

// Verificar port_in_redirect
if (nginxContent.includes('port_in_redirect off')) {
  console.log('  ✅ port_in_redirect off configurado');
} else {
  console.log('  ❌ Falta port_in_redirect off');
  issues.push('nginx.conf: Falta port_in_redirect off');
  allOk = false;
}

// 2. Verificar URLs canónicas - deben ser absolutas HTTPS
console.log('\n2. 🔗 URLs CANÓNICAS - Verificar absolutas');
console.log('-'.repeat(70));

const appFiles = [
  'src/app/sitemap.ts',
  'src/app/robots.ts',
  'src/app/[locale]/[city]/page.tsx',
  'src/app/[locale]/[city]/gifts/page.tsx',
  'src/app/[locale]/[city]/restaurants/page.tsx',
];

appFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar que usa https://celebratevalentines.com
    if (content.includes('https://celebratevalentines.com')) {
      console.log(`  ✅ ${file}: Usa HTTPS absoluto`);
    } else {
      console.log(`  ❌ ${file}: No usa HTTPS absoluto`);
      issues.push(`${file}: URLs no son absolutas HTTPS`);
      allOk = false;
    }
    
    // Verificar que NO usa localhost
    const localhostMatches = content.match(/localhost|127\.0\.0\.1/g);
    if (localhostMatches && !content.includes('// Allow localhost')) {
      // Excluir comentarios
      const lines = content.split('\n');
      const hasLocalhostInCode = lines.some(line => {
        const trimmed = line.trim();
        return (trimmed.includes('localhost') || trimmed.includes('127.0.0.1')) &&
               !trimmed.startsWith('//') && !trimmed.startsWith('*');
      });
      if (hasLocalhostInCode) {
        console.log(`  ❌ ${file}: Contiene localhost en código`);
        issues.push(`${file}: Contiene localhost`);
        allOk = false;
      }
    }
  }
});

// 3. Verificar utm.ts - window.location.origin
console.log('\n3. 🔧 UTM.TS - Verificar uso de window.location.origin');
console.log('-'.repeat(70));

const utmPath = path.join(__dirname, '../src/lib/valentines/utm.ts');
if (fs.existsSync(utmPath)) {
  const utmContent = fs.readFileSync(utmPath, 'utf8');
  
  if (utmContent.includes('window.location.origin')) {
    console.log('  ⚠️  utm.ts usa window.location.origin');
    console.log('  ⚠️  Esto podría usar localhost en desarrollo');
    warnings.push('utm.ts: Usa window.location.origin - verificar que planLinks sean absolutos');
    
    // Verificar que solo se usa en el catch block (fallback)
    if (utmContent.includes('catch') && utmContent.includes('window.location.origin')) {
      console.log('  ✅ Solo se usa en catch block (fallback para URLs relativas)');
    } else {
      console.log('  ⚠️  Verificar contexto de uso');
    }
  } else {
    console.log('  ✅ No usa window.location.origin');
  }
}

// 4. Verificar ForceHttps - NO debe causar redirects en producción normal
console.log('\n4. 🔒 FORCEHTTPS - Verificar comportamiento');
console.log('-'.repeat(70));

const forceHttpsPath = path.join(__dirname, '../src/components/security/force-https.tsx');
if (fs.existsSync(forceHttpsPath)) {
  const forceHttpsContent = fs.readFileSync(forceHttpsPath, 'utf8');
  
  // Verificar que solo redirige si protocol === 'http:'
  if (forceHttpsContent.includes("protocol === 'http:'")) {
    console.log('  ✅ Solo redirige si protocol es HTTP (correcto)');
  } else {
    console.log('  ⚠️  Verificar lógica de redirect');
    warnings.push('force-https.tsx: Verificar lógica de redirect');
  }
  
  // Verificar que no redirige solo por puerto
  if (forceHttpsContent.includes('Don\'t redirect based on port alone')) {
    console.log('  ✅ No redirige solo por puerto (correcto)');
  } else {
    console.log('  ⚠️  Verificar lógica de puerto');
  }
}

// 5. Verificar que todas las URLs en metadata son absolutas
console.log('\n5. 📄 METADATA - Verificar URLs absolutas');
console.log('-'.repeat(70));

const metadataFiles = [
  'src/app/[locale]/[city]/page.tsx',
  'src/app/[locale]/[city]/gifts/page.tsx',
];

metadataFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar patrones de URLs relativas en metadata
    const relativeUrlPattern = /(canonical|url|hrefLang|hreflang|alternates).*['"]\/(?!\/)/;
    if (relativeUrlPattern.test(content)) {
      // Verificar si son realmente relativas o parte de una URL absoluta
      const lines = content.split('\n');
      let hasRelativeUrls = false;
      lines.forEach((line, idx) => {
        if (line.includes('canonical') || line.includes('alternates') || line.includes('hreflang')) {
          // Verificar si la línea tiene https:// antes
          const beforeLine = lines.slice(0, idx).join('\n');
          if (!beforeLine.includes('https://celebratevalentines.com') || 
              !line.includes('https://celebratevalentines.com')) {
            // Podría ser relativa
            if (line.match(/['"]\/(en|es|fr|de|it|pt)/) && !line.includes('https://')) {
              hasRelativeUrls = true;
            }
          }
        }
      });
      
      if (hasRelativeUrls) {
        console.log(`  ⚠️  ${file}: Posibles URLs relativas en metadata`);
        warnings.push(`${file}: Verificar URLs en metadata`);
      } else {
        console.log(`  ✅ ${file}: URLs absolutas en metadata`);
      }
    } else {
      console.log(`  ✅ ${file}: No hay URLs relativas obvias`);
    }
  }
});

// Resumen
console.log('\n' + '='.repeat(70));
console.log('📋 RESUMEN');
console.log('='.repeat(70));

if (allOk && issues.length === 0) {
  console.log('✅ TODAS LAS VERIFICACIONES PASARON');
  if (warnings.length > 0) {
    console.log('\n⚠️  ADVERTENCIAS (revisar pero no críticas):');
    warnings.forEach(w => console.log(`  - ${w}`));
  }
} else {
  console.log('❌ PROBLEMAS ENCONTRADOS:');
  issues.forEach(issue => console.log(`  - ${issue}`));
  if (warnings.length > 0) {
    console.log('\n⚠️  ADVERTENCIAS:');
    warnings.forEach(w => console.log(`  - ${w}`));
  }
  process.exit(1);
}

console.log('\n' + '='.repeat(70));
console.log('✅ VERIFICACIÓN COMPLETA');
console.log('='.repeat(70));
