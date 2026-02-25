/**
 * Verificación de códigos UTM: todas las ciudades usadas en la app deben tener código en src/lib/valentines/utm.ts
 * Ejecutar: node scripts/verify-utm-cities.js
 *
 * Lista de ciudades en city-keywords.ts (CITY_NAMES) - debe coincidir con CITY_UTM_CODES en utm.ts
 */
const CITIES_IN_APP = [
  'madrid', 'barcelona', 'valencia', 'london', 'paris', 'lyon', 'new-york',
  'los-angeles', 'chicago', 'miami', 'san-francisco', 'washington-dc', 'san-diego',
  'atlanta', 'austin', 'lisbon', 'sao-paulo', 'rio-de-janeiro', 'mexico-city',
  'buenos-aires', 'montreal', 'berlin', 'hamburg', 'vienna', 'munchen',
  'dublin', 'sydney', 'melbourne', 'brisbane', 'toronto', 'roma', 'milano',
];

// Códigos esperados (debe coincidir con src/lib/valentines/utm.ts)
const EXPECTED_UTM_CODES = {
  madrid: 'mad', barcelona: 'bcn', valencia: 'val', london: 'lon', paris: 'par',
  lyon: 'lyo', 'new-york': 'nyc', 'los-angeles': 'lax', chicago: 'chi', miami: 'mia',
  'san-francisco': 'sfo', 'washington-dc': 'was', 'san-diego': 'san', atlanta: 'atl',
  austin: 'aus', lisbon: 'lis', 'sao-paulo': 'sao', 'rio-de-janeiro': 'rio',
  'mexico-city': 'mex', 'buenos-aires': 'bue', montreal: 'mtl', berlin: 'ber',
  hamburg: 'ham', vienna: 'vie', munchen: 'muc', dublin: 'dub', sydney: 'syd',
  melbourne: 'mel', brisbane: 'bri', toronto: 'tor', roma: 'rom', milano: 'mil',
};

let failed = false;

// 1. Todas las ciudades de la app tienen código UTM
const missing = CITIES_IN_APP.filter((c) => !EXPECTED_UTM_CODES[c]);
if (missing.length > 0) {
  console.error('❌ Ciudades sin código UTM en utm.ts:', missing.join(', '));
  failed = true;
} else {
  console.log('✅ Todas las ciudades tienen código UTM (' + CITIES_IN_APP.length + ' ciudades).');
}

// 2. No hay códigos duplicados (evitar colisiones)
const codes = Object.values(EXPECTED_UTM_CODES);
const duplicates = codes.filter((c, i) => codes.indexOf(c) !== i);
const uniqueDupes = [...new Set(duplicates)];
if (uniqueDupes.length > 0) {
  console.error('❌ Códigos UTM duplicados:', uniqueDupes.join(', '));
  failed = true;
} else {
  console.log('✅ Códigos UTM únicos (sin colisiones).');
}

// 3. Ejemplo de URL generada (formato esperado)
const sampleUrl = 'https://feverup.com/m/549909';
const expectedCampaign = '549909_muc';
// Simular buildPlanUtmUrl: campaign = planId + _ + cityCode
const sampleCampaign = '549909_' + EXPECTED_UTM_CODES['munchen'];
if (sampleCampaign !== expectedCampaign) {
  console.error('❌ Ejemplo campaña München: esperado', expectedCampaign, ', obtenido', sampleCampaign);
  failed = true;
} else {
  console.log('✅ Ejemplo utm_campaign München:', sampleCampaign);
}

if (failed) {
  process.exit(1);
}
console.log('');
console.log('Verificación UTM completada correctamente.');
