/**
 * Verificar que todas las ciudades tienen SEO optimizado para 2026
 */

const fs = require('fs');
const path = require('path');

const cityKeywordsPath = path.join(__dirname, '../src/lib/seo/city-keywords.ts');
const content = fs.readFileSync(cityKeywordsPath, 'utf8');

// Ciudades que deben tener keywords específicas (las 12 faltantes + miami actualizada)
const citiesToCheck = [
  'valencia', 'lyon', 'miami', 'san-francisco', 'washington-dc', 
  'san-diego', 'atlanta', 'austin', 'hamburg', 'dublin', 'brisbane'
];

console.log('🔍 Verificando SEO optimizado para 2026...\n');

let allOk = true;

citiesToCheck.forEach(city => {
  // Verificar que tiene keywords específicas
  const hasKeywords = content.includes(`'${city}': {`);
  
  // Verificar que el título tiene 2026
  const titlePattern = new RegExp(`'${city}':\\s*{[\\s\\S]*?title:\\s*['"]([^'"]*2026[^'"]*)['"]`, 'm');
  const titleMatch = content.match(titlePattern);
  const has2026 = titleMatch && titleMatch[1] && titleMatch[1].includes('2026');
  
  if (hasKeywords && has2026) {
    console.log(`✅ ${city}: Keywords específicas + 2026`);
  } else {
    console.log(`❌ ${city}: ${!hasKeywords ? 'Sin keywords específicas' : ''} ${!has2026 ? 'Sin 2026 en título' : ''}`);
    allOk = false;
  }
});

// Verificar generateCityKeywords usa 2026
const generateUses2026 = content.includes("title: `Valentine's Day in ${cityName} 2026");
if (generateUses2026) {
  console.log('\n✅ generateCityKeywords usa 2026');
} else {
  console.log('\n❌ generateCityKeywords NO usa 2026');
  allOk = false;
}

// Verificar getPageTypeSEOKeywords usa 2026
const pageTypeUses2026 = content.includes('2026') && 
  content.includes("title: `Valentine's Day Gifts in ${cityName} 2026") &&
  content.includes("title: `Romantic Restaurants in ${cityName} | Valentine's Day 2026") &&
  content.includes("title: `Valentine's Day Ideas in ${cityName} | Romantic Date Ideas 2026") &&
  content.includes("title: `Last-Minute Valentine's Plans in ${cityName} | Same Day 2026");

if (pageTypeUses2026) {
  console.log('✅ getPageTypeSEOKeywords usa 2026 en todas las categorías');
} else {
  console.log('❌ getPageTypeSEOKeywords podría no usar 2026 en todas las categorías');
  allOk = false;
}

console.log('\n' + '='.repeat(60));
if (allOk) {
  console.log('✅ TODAS las ciudades tienen SEO optimizado para 2026');
} else {
  console.log('❌ Algunas ciudades necesitan optimización');
  process.exit(1);
}
