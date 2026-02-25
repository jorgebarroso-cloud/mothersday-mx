/**
 * Verificación completa de optimización SEO, UX/UI y código
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN COMPLETA DE OPTIMIZACIÓN\n');
console.log('='.repeat(60));

let allOk = true;
const issues = [];

// 1. Verificar SEO
console.log('\n📊 1. VERIFICACIÓN SEO');
console.log('-'.repeat(60));

const cityKeywordsPath = path.join(__dirname, '../src/lib/seo/city-keywords.ts');
const cityKeywordsContent = fs.readFileSync(cityKeywordsPath, 'utf8');

const citiesToCheck = [
  'valencia', 'lyon', 'miami', 'san-francisco', 'washington-dc',
  'san-diego', 'atlanta', 'austin', 'hamburg', 'dublin', 'brisbane'
];

citiesToCheck.forEach(city => {
  const hasKeywords = cityKeywordsContent.includes(`'${city}': {`);
  const has2026 = cityKeywordsContent.includes(`'${city}':`) && 
                  cityKeywordsContent.match(new RegExp(`'${city}':[\\s\\S]*?title:[\\s\\S]*?2026`));
  
  if (hasKeywords && has2026) {
    console.log(`  ✅ ${city}: SEO optimizado para 2026`);
  } else {
    console.log(`  ❌ ${city}: Problemas de SEO`);
    issues.push(`SEO: ${city} no está completamente optimizado`);
    allOk = false;
  }
});

// Verificar categorías
const hasCategory2026 = cityKeywordsContent.includes("title: `Valentine's Day Gifts in ${cityName} 2026") &&
                        cityKeywordsContent.includes("title: `Romantic Restaurants in ${cityName} | Valentine's Day 2026");

if (hasCategory2026) {
  console.log('  ✅ Categorías optimizadas para 2026');
} else {
  console.log('  ❌ Categorías no optimizadas');
  issues.push('SEO: Categorías no tienen 2026');
  allOk = false;
}

// 2. Verificar Selectores
console.log('\n🎯 2. VERIFICACIÓN SELECTORES');
console.log('-'.repeat(60));

const citySelectorPath = path.join(__dirname, '../src/components/valentines/city-selector.tsx');
const headerPath = path.join(__dirname, '../src/components/layout/header.tsx');
const citySelectorContent = fs.readFileSync(citySelectorPath, 'utf8');
const headerContent = fs.readFileSync(headerPath, 'utf8');

citiesToCheck.forEach(city => {
  const inSelector = citySelectorContent.includes(`slug: '${city}'`);
  const inHeader = headerContent.includes(`slug: '${city}'`);
  
  if (inSelector && inHeader) {
    console.log(`  ✅ ${city}: En ambos selectores`);
  } else {
    console.log(`  ❌ ${city}: Faltante en selectores`);
    issues.push(`Selectores: ${city} no está en ambos selectores`);
    allOk = false;
  }
});

// 3. Verificar UX/UI
console.log('\n🎨 3. VERIFICACIÓN UX/UI');
console.log('-'.repeat(60));

// Verificar accesibilidad
const hasAltTexts = citySelectorContent.includes('alt={`Romantic Valentine\'s dinner');
const hasAriaLabels = headerContent.includes('aria-label') && headerContent.includes('aria-expanded');
const hasLoadingLazy = citySelectorContent.includes('loading="lazy"');
const hasResponsiveClasses = citySelectorContent.includes('sm:grid-cols-2') && 
                            citySelectorContent.includes('md:grid-cols-3');

if (hasAltTexts) {
  console.log('  ✅ Alt texts presentes en imágenes');
} else {
  console.log('  ❌ Faltan alt texts');
  issues.push('UX/UI: Faltan alt texts en imágenes');
  allOk = false;
}

if (hasAriaLabels) {
  console.log('  ✅ Aria labels presentes');
} else {
  console.log('  ❌ Faltan aria labels');
  issues.push('UX/UI: Faltan aria labels');
  allOk = false;
}

if (hasLoadingLazy) {
  console.log('  ✅ Lazy loading implementado');
} else {
  console.log('  ❌ No hay lazy loading');
  issues.push('UX/UI: No hay lazy loading');
  allOk = false;
}

if (hasResponsiveClasses) {
  console.log('  ✅ Diseño responsive implementado');
} else {
  console.log('  ❌ No hay diseño responsive');
  issues.push('UX/UI: No hay diseño responsive');
  allOk = false;
}

// Verificar hover states
const hasHoverStates = citySelectorContent.includes('group-hover:') && 
                       citySelectorContent.includes('hover:');

if (hasHoverStates) {
  console.log('  ✅ Estados hover implementados');
} else {
  console.log('  ⚠️  Estados hover podrían mejorarse');
}

// 4. Verificar Código
console.log('\n💻 4. VERIFICACIÓN CÓDIGO');
console.log('-'.repeat(60));

// Verificar que no hay console.logs de debug
const hasConsoleLogs = citySelectorContent.includes('console.log') || 
                       headerContent.includes('console.log');

if (!hasConsoleLogs) {
  console.log('  ✅ No hay console.logs de debug');
} else {
  console.log('  ⚠️  Hay console.logs (revisar si son necesarios)');
}

// Verificar imports correctos
const hasCorrectImports = citySelectorContent.includes("from 'next/link'") &&
                          citySelectorContent.includes("from 'next/image'") &&
                          headerContent.includes("from 'next/link'");

if (hasCorrectImports) {
  console.log('  ✅ Imports correctos');
} else {
  console.log('  ❌ Problemas con imports');
  issues.push('Código: Problemas con imports');
  allOk = false;
}

// Verificar TypeScript types
const hasTypes = citySelectorContent.includes('type Region') || 
                 citySelectorContent.includes('interface');

if (hasTypes) {
  console.log('  ✅ Tipos TypeScript presentes');
} else {
  console.log('  ⚠️  Podría mejorar tipado TypeScript');
}

// 5. Verificar Imágenes
console.log('\n🖼️  5. VERIFICACIÓN IMÁGENES');
console.log('-'.repeat(60));

const imagesPath = path.join(__dirname, '../public/images/posters');
const imageFiles = fs.readdirSync(imagesPath);

citiesToCheck.forEach(city => {
  const imageFile = `skyline-${city}.jpg`;
  const exists = imageFiles.includes(imageFile);
  
  if (exists) {
    console.log(`  ✅ ${city}: Imagen existe`);
  } else {
    console.log(`  ❌ ${city}: Imagen NO existe`);
    issues.push(`Imágenes: ${city} no tiene imagen`);
    allOk = false;
  }
});

// Resumen
console.log('\n' + '='.repeat(60));
console.log('📋 RESUMEN');
console.log('='.repeat(60));

if (allOk && issues.length === 0) {
  console.log('✅ TODO ESTÁ OPTIMIZADO CORRECTAMENTE');
  console.log('\n✅ SEO: Todas las ciudades optimizadas para 2026');
  console.log('✅ Selectores: Todas las ciudades añadidas');
  console.log('✅ UX/UI: Accesibilidad y responsive implementados');
  console.log('✅ Código: Estructura correcta');
  console.log('✅ Imágenes: Todas presentes');
} else {
  console.log('❌ HAY PROBLEMAS QUE RESOLVER:');
  issues.forEach(issue => console.log(`  - ${issue}`));
  process.exit(1);
}

console.log('\n' + '='.repeat(60));
console.log('✅ LISTO PARA COMMIT');
console.log('='.repeat(60));
