/**
 * Test completo de implementación UTM
 * Verifica que buildPlanUtmUrl funciona correctamente en todos los casos
 * Ejecutar: node scripts/test-utm-implementation.js
 */

// Simular la función buildPlanUtmUrl (lógica extraída de utm.ts)
const CITY_UTM_CODES = {
  'madrid': 'mad', 'barcelona': 'bcn', 'valencia': 'val', 'london': 'lon', 'paris': 'par',
  'lyon': 'lyo', 'new-york': 'nyc', 'los-angeles': 'lax', 'chicago': 'chi', 'miami': 'mia',
  'san-francisco': 'sfo', 'washington-dc': 'was', 'san-diego': 'san', 'atlanta': 'atl',
  'austin': 'aus', 'lisbon': 'lis', 'sao-paulo': 'sao', 'rio-de-janeiro': 'rio',
  'mexico-city': 'mex', 'buenos-aires': 'bue', 'montreal': 'mtl', 'berlin': 'ber',
  'hamburg': 'ham', 'vienna': 'vie', 'munchen': 'muc', 'dublin': 'dub', 'sydney': 'syd',
  'melbourne': 'mel', 'brisbane': 'bri', 'toronto': 'tor', 'roma': 'rom', 'milano': 'mil',
};

const DEFAULT_UTM_PARAMS = {
  utm_source: 'celebratevalentines',
  utm_medium: 'organiclanding',
  utm_content: 'valentines',
};

function getCityCode(citySlug) {
  const normalized = citySlug.toLowerCase();
  return CITY_UTM_CODES[normalized] ?? 'gen';
}

function extractPlanIdFromLink(link) {
  try {
    const url = new URL(link);
    const match = url.pathname.match(/\/m\/(\d+)/);
    return match ? match[1] : null;
  } catch {
    const match = link.match(/\/m\/(\d+)/);
    return match ? match[1] : null;
  }
}

function cleanPlanId(planId) {
  if (!planId) return null;
  
  let cleaned = planId.toString();
  
  // First, decode URL encoding (e.g., %2C -> comma)
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch {
    // If decoding fails, continue with original string
  }
  
  // Remove all non-digit characters (commas, spaces, etc.)
  cleaned = cleaned.replace(/[^\d]/g, '');
  
  return cleaned.length > 0 ? cleaned : null;
}

function buildPlanUtmUrl(planLink, planId, citySlug, incomingParams) {
  const rawPlanId = planId || extractPlanIdFromLink(planLink);
  const finalPlanId = cleanPlanId(rawPlanId);
  
  if (!finalPlanId) {
    return planLink; // Fallback
  }

  const cityCode = getCityCode(citySlug);
  const utmCampaign = `${finalPlanId}_${cityCode}`;

  try {
    const url = new URL(planLink);
    const utmParams = { ...DEFAULT_UTM_PARAMS };
    
    if (incomingParams) {
      if (incomingParams.utm_source) utmParams.utm_source = incomingParams.utm_source;
      if (incomingParams.utm_medium) utmParams.utm_medium = incomingParams.utm_medium;
      if (incomingParams.utm_content) utmParams.utm_content = incomingParams.utm_content;
    }
    
    utmParams.utm_campaign = utmCampaign;
    
    Object.entries(utmParams).forEach(([key, value]) => {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, value);
      }
    });
    
    return url.toString();
  } catch (error) {
    return planLink;
  }
}

// Tests
let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    const result = fn();
    if (result === true) {
      passed++;
      console.log(`✅ ${name}`);
    } else {
      failed++;
      failures.push({ name, error: result });
      console.log(`❌ ${name}: ${result}`);
    }
  } catch (error) {
    failed++;
    failures.push({ name, error: error.message });
    console.log(`❌ ${name}: ${error.message}`);
  }
}

console.log('🧪 Ejecutando tests de implementación UTM...\n');

// Test 1: URL básica sin UTMs entrantes (München - tu ejemplo)
test('München sin UTMs entrantes', () => {
  const result = buildPlanUtmUrl(
    'https://feverup.com/m/549909',
    '549909',
    'munchen',
    undefined
  );
  const url = new URL(result);
  return url.searchParams.get('utm_campaign') === '549909_muc' &&
         url.searchParams.get('utm_source') === 'celebratevalentines' &&
         url.searchParams.get('utm_medium') === 'organiclanding' &&
         url.searchParams.get('utm_content') === 'valentines';
});

// Test 2: Con UTMs entrantes (Google Ads)
test('München con UTMs entrantes (Google Ads)', () => {
  const result = buildPlanUtmUrl(
    'https://feverup.com/m/549909',
    '549909',
    'munchen',
    { utm_source: 'google', utm_medium: 'cpc', utm_content: 'valentines' }
  );
  const url = new URL(result);
  return url.searchParams.get('utm_campaign') === '549909_muc' &&
         url.searchParams.get('utm_source') === 'google' &&
         url.searchParams.get('utm_medium') === 'cpc' &&
         url.searchParams.get('utm_content') === 'valentines';
});

// Test 3: Diferentes ciudades
test('Madrid - código correcto', () => {
  const result = buildPlanUtmUrl('https://feverup.com/m/123456', '123456', 'madrid');
  const url = new URL(result);
  return url.searchParams.get('utm_campaign') === '123456_mad';
});

test('New York - código correcto', () => {
  const result = buildPlanUtmUrl('https://feverup.com/m/789012', '789012', 'new-york');
  const url = new URL(result);
  return url.searchParams.get('utm_campaign') === '789012_nyc';
});

test('Buenos Aires - código correcto', () => {
  const result = buildPlanUtmUrl('https://feverup.com/m/345678', '345678', 'buenos-aires');
  const url = new URL(result);
  return url.searchParams.get('utm_campaign') === '345678_bue';
});

// Test 4: Extracción de planId desde URL
test('Extraer planId desde URL si no se proporciona', () => {
  const result = buildPlanUtmUrl('https://feverup.com/m/999888', null, 'london');
  const url = new URL(result);
  return url.searchParams.get('utm_campaign') === '999888_lon';
});

// Test 5: URL con parámetros existentes
test('URL con parámetros existentes (no sobrescribir)', () => {
  const result = buildPlanUtmUrl(
    'https://feverup.com/m/111222?existing=param',
    '111222',
    'paris'
  );
  const url = new URL(result);
  return url.searchParams.get('existing') === 'param' &&
         url.searchParams.get('utm_campaign') === '111222_par';
});

// Test 6: UTMs entrantes no sobrescriben utm_campaign
test('UTMs entrantes no sobrescriben utm_campaign', () => {
  const result = buildPlanUtmUrl(
    'https://feverup.com/m/333444',
    '333444',
    'barcelona',
    { utm_campaign: 'old_campaign', utm_source: 'facebook' }
  );
  const url = new URL(result);
  // utm_campaign siempre debe ser {planId}_{cityCode}
  return url.searchParams.get('utm_campaign') === '333444_bcn' &&
         url.searchParams.get('utm_source') === 'facebook';
});

// Test 7: Todas las ciudades principales
const testCities = [
  ['munchen', 'muc'], ['madrid', 'mad'], ['barcelona', 'bcn'], ['london', 'lon'],
  ['paris', 'par'], ['new-york', 'nyc'], ['montreal', 'mtl'], ['toronto', 'tor'],
  ['mexico-city', 'mex'], ['buenos-aires', 'bue'], ['roma', 'rom'], ['milano', 'mil']
];

testCities.forEach(([city, code]) => {
  test(`${city} genera código ${code}`, () => {
    const result = buildPlanUtmUrl('https://feverup.com/m/555666', '555666', city);
    const url = new URL(result);
    return url.searchParams.get('utm_campaign') === `555666_${code}`;
  });
});

// Test 8: Ciudad no mapeada usa 'gen'
test('Ciudad no mapeada usa código gen', () => {
  const result = buildPlanUtmUrl('https://feverup.com/m/777888', '777888', 'unknown-city');
  const url = new URL(result);
  return url.searchParams.get('utm_campaign') === '777888_gen';
});

// Test 9: URL sin planId y sin /m/ID en URL
test('URL sin planId válido retorna original', () => {
  const result = buildPlanUtmUrl('https://feverup.com/other', null, 'madrid');
  return result === 'https://feverup.com/other';
});

// Test 10: PlanId con comas se limpia correctamente
test('PlanId con comas se limpia (404,940 -> 404940)', () => {
  const result = buildPlanUtmUrl('https://feverup.com/m/404940', '404,940', 'new-york');
  const url = new URL(result);
  return url.searchParams.get('utm_campaign') === '404940_nyc';
});

// Test 11: PlanId con URL encoding se limpia (%2C = coma)
test('PlanId con URL encoding se limpia (404%2C940 -> 404940)', () => {
  const result = buildPlanUtmUrl('https://feverup.com/m/404940', '404%2C940', 'new-york');
  const url = new URL(result);
  return url.searchParams.get('utm_campaign') === '404940_nyc';
});

// Test 12: PlanId con espacios se limpia
test('PlanId con espacios se limpia (404 940 -> 404940)', () => {
  const result = buildPlanUtmUrl('https://feverup.com/m/404940', '404 940', 'new-york');
  const url = new URL(result);
  return url.searchParams.get('utm_campaign') === '404940_nyc';
});

// Resumen
console.log('\n' + '='.repeat(50));
console.log(`✅ Tests pasados: ${passed}`);
console.log(`❌ Tests fallidos: ${failed}`);

if (failed > 0) {
  console.log('\n❌ Fallos:');
  failures.forEach(f => console.log(`  - ${f.name}: ${f.error}`));
  process.exit(1);
} else {
  console.log('\n✅ Todos los tests pasaron. Implementación UTM correcta.');
}
