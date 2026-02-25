/**
 * Comparar ciudades del sitemap con las de los selectores
 * Identificar ciudades con contenido que no están en los selectores
 */

// Ciudades del sitemap (todas las que tienen contenido)
const SITEMAP_CITIES = [
  'madrid', 'barcelona', 'valencia', 'london', 'paris', 'lyon',
  'new-york', 'los-angeles', 'chicago', 'miami', 'san-francisco',
  'washington-dc', 'san-diego', 'atlanta', 'austin', 'lisbon',
  'sao-paulo', 'mexico-city', 'berlin', 'hamburg', 'vienna',
  'dublin', 'sydney', 'melbourne', 'brisbane',
  'toronto', 'buenos-aires', 'montreal', 'munchen', 'roma', 'milano'
];

// Ciudades en el city selector de la home (city-selector.tsx)
const HOME_SELECTOR_CITIES = [
  'new-york', 'los-angeles', 'chicago', 'london', 'sydney', 'melbourne', 'toronto',
  'madrid', 'barcelona', 'mexico-city', 'buenos-aires',
  'paris', 'montreal',
  'berlin', 'munchen', 'vienna',
  'lisbon',
  'roma', 'milano'
];

// Ciudades en el city selector del header
const HEADER_SELECTOR_CITIES = [
  'new-york', 'los-angeles', 'chicago', 'london', 'sydney', 'melbourne', 'toronto',
  'madrid', 'barcelona', 'mexico-city', 'buenos-aires',
  'paris', 'montreal',
  'berlin', 'munchen', 'vienna',
  'lisbon',
  'roma', 'milano'
];

// Encontrar ciudades que están en sitemap pero NO en ningún selector
const citiesInSitemap = new Set(SITEMAP_CITIES);
const citiesInSelectors = new Set([...HOME_SELECTOR_CITIES, ...HEADER_SELECTOR_CITIES]);

const missingCities = SITEMAP_CITIES.filter(city => !citiesInSelectors.has(city));

console.log('🔍 Análisis de ciudades en sitemap vs selectores\n');
console.log('='.repeat(60));
console.log(`Total ciudades en sitemap: ${SITEMAP_CITIES.length}`);
console.log(`Total ciudades en home selector: ${HOME_SELECTOR_CITIES.length}`);
console.log(`Total ciudades en header selector: ${HEADER_SELECTOR_CITIES.length}`);
console.log(`Total ciudades únicas en selectores: ${citiesInSelectors.size}`);
console.log('='.repeat(60));

if (missingCities.length > 0) {
  console.log(`\n❌ CIUDADES CON CONTENIDO PERO SIN SELECTOR (${missingCities.length}):\n`);
  
  // Agrupar por región para mejor presentación
  const cityNames = {
    'valencia': 'Valencia',
    'lyon': 'Lyon',
    'miami': 'Miami',
    'san-francisco': 'San Francisco',
    'washington-dc': 'Washington DC',
    'san-diego': 'San Diego',
    'atlanta': 'Atlanta',
    'austin': 'Austin',
    'sao-paulo': 'São Paulo',
    'hamburg': 'Hamburg',
    'dublin': 'Dublin',
    'brisbane': 'Brisbane'
  };
  
  missingCities.forEach((city, index) => {
    const name = cityNames[city] || city;
    console.log(`  ${index + 1}. ${name} (${city})`);
  });
  
  console.log('\n📋 Resumen por región:');
  console.log('  Europa: valencia, lyon, hamburg, dublin');
  console.log('  América: miami, san-francisco, washington-dc, san-diego, atlanta, austin, sao-paulo');
  console.log('  Oceanía: brisbane');
  
} else {
  console.log('\n✅ Todas las ciudades del sitemap están en los selectores');
}

// Verificar ciudades en selectores que NO están en sitemap (por si acaso)
const extraCities = [...citiesInSelectors].filter(city => !citiesInSitemap.has(city));
if (extraCities.length > 0) {
  console.log(`\n⚠️ Ciudades en selectores pero NO en sitemap (${extraCities.length}):`);
  extraCities.forEach(city => console.log(`  - ${city}`));
}

console.log('\n' + '='.repeat(60));
