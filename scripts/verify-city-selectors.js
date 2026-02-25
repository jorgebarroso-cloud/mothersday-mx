/**
 * Verificar que todas las ciudades optimizadas están en los selectores
 */

const fs = require('fs');
const path = require('path');

const citySelectorPath = path.join(__dirname, '../src/components/valentines/city-selector.tsx');
const headerPath = path.join(__dirname, '../src/components/layout/header.tsx');

const citySelectorContent = fs.readFileSync(citySelectorPath, 'utf8');
const headerContent = fs.readFileSync(headerPath, 'utf8');

// Ciudades que deben estar en los selectores (excepto sao-paulo)
const citiesToCheck = [
  { slug: 'valencia', name: 'Valencia' },
  { slug: 'lyon', name: 'Lyon' },
  { slug: 'miami', name: 'Miami' },
  { slug: 'san-francisco', name: 'San Francisco' },
  { slug: 'washington-dc', name: 'Washington DC' },
  { slug: 'san-diego', name: 'San Diego' },
  { slug: 'atlanta', name: 'Atlanta' },
  { slug: 'austin', name: 'Austin' },
  { slug: 'hamburg', name: 'Hamburg' },
  { slug: 'dublin', name: 'Dublin' },
  { slug: 'brisbane', name: 'Brisbane' },
];

console.log('🔍 Verificando ciudades en selectores...\n');

let allOk = true;

citiesToCheck.forEach(city => {
  const inCitySelector = citySelectorContent.includes(`slug: '${city.slug}'`);
  const inHeader = headerContent.includes(`slug: '${city.slug}'`);
  
  if (inCitySelector && inHeader) {
    console.log(`✅ ${city.name} (${city.slug}): En ambos selectores`);
  } else {
    console.log(`❌ ${city.name} (${city.slug}): ${!inCitySelector ? 'Falta en city-selector' : ''} ${!inHeader ? 'Falta en header' : ''}`);
    allOk = false;
  }
});

// Verificar que sao-paulo NO está
const saoPauloInSelector = citySelectorContent.includes("slug: 'sao-paulo'");
const saoPauloInHeader = headerContent.includes("slug: 'sao-paulo'");

if (!saoPauloInSelector && !saoPauloInHeader) {
  console.log('\n✅ São Paulo correctamente excluida de ambos selectores');
} else {
  console.log(`\n❌ São Paulo debería estar excluida pero aparece en: ${saoPauloInSelector ? 'city-selector' : ''} ${saoPauloInHeader ? 'header' : ''}`);
  allOk = false;
}

console.log('\n' + '='.repeat(60));
if (allOk) {
  console.log('✅ TODAS las ciudades están correctamente añadidas');
} else {
  console.log('❌ Algunas ciudades faltan o están mal configuradas');
  process.exit(1);
}
