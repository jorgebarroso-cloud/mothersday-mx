/**
 * 🔍 Verificación SEO: Rutas URL vs Estado React
 * 
 * Verifica que:
 * 1. Todas las ciudades tienen rutas dinámicas /[locale]/[city]
 * 2. Los CityCards usan <Link> (no onClick con useState)
 * 3. El nombre de la ciudad está en el HTML inicial
 * 4. No hay redirects 301/302 problemáticos
 * 5. El contenido es server-side (no solo client-side)
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const errors = [];
const warnings = [];
const info = [];

function logError(message) {
  errors.push(message);
  console.error(`❌ ERROR: ${message}`);
}

function logWarning(message) {
  warnings.push(message);
  console.warn(`⚠️  WARNING: ${message}`);
}

function logInfo(message) {
  info.push(message);
  console.log(`ℹ️  INFO: ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

// 1. Verificar que existe la ruta dinámica
function verifyDynamicRoute() {
  console.log('\n' + '='.repeat(80));
  console.log('1. 🔍 VERIFICANDO RUTA DINÁMICA');
  console.log('='.repeat(80) + '\n');

  const cityPagePath = path.join(PROJECT_ROOT, 'src/app/[locale]/[city]/page.tsx');
  
  if (!fs.existsSync(cityPagePath)) {
    logError('src/app/[locale]/[city]/page.tsx NO EXISTE');
    return false;
  }

  logSuccess('src/app/[locale]/[city]/page.tsx existe');

  const content = fs.readFileSync(cityPagePath, 'utf8');

  // Verificar que es async (server component)
  if (!content.includes('export default async function CityPage')) {
    logError('CityPage NO es async (debe ser server component)');
    return false;
  }
  logSuccess('CityPage es async (server component)');

  // Verificar que tiene generateStaticParams
  if (!content.includes('generateStaticParams')) {
    logWarning('CityPage NO tiene generateStaticParams (puede estar en otro lugar)');
  } else {
    logSuccess('CityPage tiene generateStaticParams');
  }

  // Verificar que fetcha datos server-side
  if (!content.includes('await getValentinesData')) {
    logError('CityPage NO hace fetch server-side de datos');
    return false;
  }
  logSuccess('CityPage hace fetch server-side de datos');

  // Verificar que el nombre de la ciudad se pasa al componente
  if (!content.includes('city={cityName}') && !content.includes('cityName={cityName}')) {
    logWarning('CityPage puede no estar pasando el nombre de la ciudad al componente');
  } else {
    logSuccess('CityPage pasa el nombre de la ciudad al componente');
  }

  return true;
}

// 2. Verificar que CitySelector usa <Link>
function verifyCitySelectorLinks() {
  console.log('\n' + '='.repeat(80));
  console.log('2. 🔗 VERIFICANDO LINKS EN CITY SELECTOR');
  console.log('='.repeat(80) + '\n');

  const citySelectorPath = path.join(PROJECT_ROOT, 'src/components/valentines/city-selector.tsx');
  
  if (!fs.existsSync(citySelectorPath)) {
    logError('city-selector.tsx NO EXISTE');
    return false;
  }

  const content = fs.readFileSync(citySelectorPath, 'utf8');

  // Verificar que usa Link de next/link
  if (!content.includes("from 'next/link'") && !content.includes('from "next/link"')) {
    logError('city-selector.tsx NO importa Link de next/link');
    return false;
  }
  logSuccess('city-selector.tsx importa Link de next/link');

  // Verificar que usa <Link> (no onClick con router.push)
  if (!content.includes('<Link')) {
    logError('city-selector.tsx NO usa <Link> para navegación');
    return false;
  }
  logSuccess('city-selector.tsx usa <Link> para navegación');

  // Verificar que NO usa onClick con router.push para navegación principal
  const onClickMatches = content.match(/onClick.*router\.push.*city/g);
  if (onClickMatches && onClickMatches.length > 0) {
    logWarning('city-selector.tsx puede usar onClick con router.push (debería usar <Link>)');
  } else {
    logSuccess('city-selector.tsx NO usa onClick con router.push para navegación principal');
  }

  // Verificar que los href son correctos
  if (!content.includes('href={`/${locale}/${city.slug}/`}')) {
    logWarning('city-selector.tsx puede no tener href correcto');
  } else {
    logSuccess('city-selector.tsx tiene href correcto con locale y slug');
  }

  return true;
}

// 3. Verificar que el nombre de la ciudad está en el HTML
function verifyCityNameInHTML() {
  console.log('\n' + '='.repeat(80));
  console.log('3. 📄 VERIFICANDO NOMBRE DE CIUDAD EN HTML');
  console.log('='.repeat(80) + '\n');

  const cityPagePath = path.join(PROJECT_ROOT, 'src/app/[locale]/[city]/page.tsx');
  const content = fs.readFileSync(cityPagePath, 'utf8');

  // Verificar que cityName se pasa a componentes
  if (!content.includes('city={cityName}') && !content.includes('cityName={cityName}')) {
    logError('El nombre de la ciudad NO se pasa a los componentes');
    return false;
  }
  logSuccess('El nombre de la ciudad se pasa a los componentes');

  // Verificar que HeroSection recibe city
  if (content.includes('<HeroSection') && !content.includes('city={cityName}')) {
    logWarning('HeroSection puede no recibir el nombre de la ciudad');
  } else if (content.includes('city={cityName}')) {
    logSuccess('HeroSection recibe el nombre de la ciudad');
  }

  // Verificar que ValentinesLandingView recibe city
  if (content.includes('<ValentinesLandingView') && !content.includes('city={cityName}')) {
    logWarning('ValentinesLandingView puede no recibir el nombre de la ciudad');
  } else if (content.includes('city={cityName}')) {
    logSuccess('ValentinesLandingView recibe el nombre de la ciudad');
  }

  // Verificar que el nombre aparece en el componente (no solo en estado)
  const landingViewPath = path.join(PROJECT_ROOT, 'src/components/valentines/valentines-landing-view.tsx');
  if (fs.existsSync(landingViewPath)) {
    const landingContent = fs.readFileSync(landingViewPath, 'utf8');
    
    // Buscar que el nombre de la ciudad se renderiza directamente
    if (landingContent.includes('{city}') || landingContent.includes('cityName')) {
      logSuccess('valentines-landing-view.tsx renderiza el nombre de la ciudad');
    } else {
      logWarning('valentines-landing-view.tsx puede no renderizar el nombre de la ciudad directamente');
    }
  }

  return true;
}

// 4. Verificar redirects
function verifyNoRedirects() {
  console.log('\n' + '='.repeat(80));
  console.log('4. 🔄 VERIFICANDO REDIRECTS');
  console.log('='.repeat(80) + '\n');

  const middlewarePath = path.join(PROJECT_ROOT, 'middleware.ts');
  const content = fs.readFileSync(middlewarePath, 'utf8');

  // Verificar que solo redirige la raíz (/), no las ciudades
  if (content.includes('pathname === \'/\'') || content.includes("pathname === '/'")) {
    logSuccess('Middleware solo redirige la raíz (/)');
  } else {
    logWarning('Middleware puede redirigir otras rutas');
  }

  // Verificar que no hay redirects de ciudades a home
  const redirectMatches = content.match(/redirect.*city|redirect.*\[city\]/gi);
  if (redirectMatches && redirectMatches.length > 0) {
    logError('Middleware puede tener redirects de ciudades a home');
    return false;
  }
  logSuccess('Middleware NO tiene redirects de ciudades a home');

  // Verificar next.config.js
  const nextConfigPath = path.join(PROJECT_ROOT, 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Buscar redirects en next.config.js
    if (nextConfigContent.includes('redirects') && nextConfigContent.includes('city')) {
      logWarning('next.config.js puede tener redirects relacionados con ciudades');
    } else {
      logSuccess('next.config.js NO tiene redirects problemáticos');
    }
  }

  return true;
}

// 5. Verificar robots.txt
function verifyRobotsTxt() {
  console.log('\n' + '='.repeat(80));
  console.log('5. 🤖 VERIFICANDO ROBOTS.TXT');
  console.log('='.repeat(80) + '\n');

  const robotsTxtPath = path.join(PROJECT_ROOT, 'public/robots.txt');
  const robotsTsPath = path.join(PROJECT_ROOT, 'src/app/robots.ts');

  // Verificar robots.txt estático
  if (fs.existsSync(robotsTxtPath)) {
    const content = fs.readFileSync(robotsTxtPath, 'utf8');
    
    if (content.includes('Allow: /_next/static/')) {
      logSuccess('public/robots.txt permite /_next/static/');
    } else {
      logError('public/robots.txt NO permite /_next/static/');
    }

    if (content.includes('Allow: /_next/image/')) {
      logSuccess('public/robots.txt permite /_next/image/');
    } else {
      logWarning('public/robots.txt puede no permitir /_next/image/');
    }

    if (content.includes('Allow: /api/public/')) {
      logSuccess('public/robots.txt permite /api/public/');
    } else {
      logWarning('public/robots.txt puede no permitir /api/public/');
    }
  }

  // Verificar robots.ts
  if (fs.existsSync(robotsTsPath)) {
    const content = fs.readFileSync(robotsTsPath, 'utf8');
    
    const hasStatic = content.includes('/_next/static/');
    const hasImage = content.includes('/_next/image/');
    const hasPublic = content.includes('/api/public/');
    
    if (hasStatic && hasImage && hasPublic) {
      logSuccess('src/app/robots.ts permite /_next/static/, /_next/image/, /api/public/');
    } else if (hasStatic) {
      logSuccess('src/app/robots.ts permite /_next/static/');
    } else {
      logWarning('src/app/robots.ts puede no permitir /_next/static/');
    }
  }

  return true;
}

// 6. Verificar que HeroSection usa router.push correctamente
function verifyHeroSectionNavigation() {
  console.log('\n' + '='.repeat(80));
  console.log('6. 🔍 VERIFICANDO NAVEGACIÓN EN HERO SECTION');
  console.log('='.repeat(80) + '\n');

  const heroPath = path.join(PROJECT_ROOT, 'src/components/valentines/hero-section.tsx');
  const content = fs.readFileSync(heroPath, 'utf8');

  // Verificar que usa router.push (correcto para búsqueda)
  if (content.includes('router.push(cityPath)')) {
    logSuccess('hero-section.tsx usa router.push para navegación (correcto para búsqueda)');
  } else {
    logWarning('hero-section.tsx puede no usar router.push');
  }

  // Verificar que NO usa useState para cambiar vistas
  if (content.includes('useState') && content.match(/useState.*city|useState.*selected/gi)) {
    logError('hero-section.tsx usa useState para navegación (debería usar router.push)');
    return false;
  }
  logSuccess('hero-section.tsx NO usa useState para navegación');

  return true;
}

// 7. Verificar que el contenido está server-side
function verifyServerSideContent() {
  console.log('\n' + '='.repeat(80));
  console.log('7. 🖥️  VERIFICANDO CONTENIDO SERVER-SIDE');
  console.log('='.repeat(80) + '\n');

  const cityPagePath = path.join(PROJECT_ROOT, 'src/app/[locale]/[city]/page.tsx');
  const content = fs.readFileSync(cityPagePath, 'utf8');

  // Verificar que es async
  if (!content.includes('async function CityPage')) {
    logError('CityPage NO es async (no puede hacer fetch server-side)');
    return false;
  }
  logSuccess('CityPage es async');

  // Verificar que hace await getValentinesData
  if (!content.includes('await getValentinesData')) {
    logError('CityPage NO hace await getValentinesData (no es server-side)');
    return false;
  }
  logSuccess('CityPage hace await getValentinesData (server-side)');

  // Verificar que NO es 'use client'
  if (content.includes("'use client'") || content.includes('"use client"')) {
    logError('CityPage tiene "use client" (debe ser server component)');
    return false;
  }
  logSuccess('CityPage NO tiene "use client" (es server component)');

  return true;
}

// Resumen
function printSummary() {
  console.log('\n' + '='.repeat(80));
  console.log('📋 RESUMEN FINAL');
  console.log('='.repeat(80) + '\n');

  console.log(`ℹ️  Informaciones: ${info.length}`);
  console.log(`⚠️  Advertencias: ${warnings.length}`);
  console.log(`❌ Errores: ${errors.length}`);

  if (errors.length === 0 && warnings.length === 0) {
    console.log(`\n✅ ¡PERFECTO! Todas las verificaciones pasaron\n`);
    return 0;
  } else if (errors.length === 0) {
    console.log(`\n⚠️  Hay advertencias pero no errores críticos\n`);
    return 0;
  } else {
    console.log(`\n❌ Se encontraron errores que deben corregirse\n`);
    return 1;
  }
}

// Ejecutar todas las verificaciones
function main() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 VERIFICACIÓN SEO: Rutas URL vs Estado React');
  console.log('='.repeat(80) + '\n');

  verifyDynamicRoute();
  verifyCitySelectorLinks();
  verifyCityNameInHTML();
  verifyNoRedirects();
  verifyRobotsTxt();
  verifyHeroSectionNavigation();
  verifyServerSideContent();

  const exitCode = printSummary();
  process.exit(exitCode);
}

main();
