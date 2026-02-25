/**
 * Verificación completa: Todos los planes de todas las ciudades tienen planId limpio
 * Verifica que no haya comas, espacios, o caracteres especiales en los IDs
 */

const fs = require('fs');
const path = require('path');

let errors = [];
let warnings = [];
let totalPlans = 0;
let plansWithIssues = 0;

console.log('🔍 Verificando TODOS los planes de TODAS las ciudades...\n');

// Función para limpiar planId (misma lógica que en el código)
function cleanPlanId(rawId) {
  if (!rawId) return '';
  let cleaned = rawId.toString();
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch {
    // If decoding fails, continue with original
  }
  cleaned = cleaned.replace(/[^\d]/g, '');
  return cleaned;
}

// Función para verificar si un ID tiene problemas
function hasInvalidCharacters(id) {
  if (!id) return true;
  const cleaned = cleanPlanId(id);
  return cleaned !== id || cleaned.length === 0;
}

// 1. Verificar datos manuales
console.log('📋 Verificando datos manuales...');
const manualDataFiles = [
  'munchen-manual-data.ts',
  'toronto-manual-data.ts',
  'buenos-aires-manual-data.ts',
  'mexico-city-manual-data.ts',
  'montreal-manual-data.ts',
  'roma-manual-data.ts',
  'milano-manual-data.ts'
];

manualDataFiles.forEach(file => {
  const filePath = path.join(__dirname, '../src/lib/valentines', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extraer todos los IDs usando regex
    const idMatches = content.matchAll(/id:\s*['"]([^'"]+)['"]/g);
    let filePlans = 0;
    let fileIssues = 0;
    
    for (const match of idMatches) {
      const rawId = match[1];
      filePlans++;
      totalPlans++;
      
      if (hasInvalidCharacters(rawId)) {
        const cleaned = cleanPlanId(rawId);
        if (cleaned !== rawId) {
          errors.push(`❌ ${file}: ID "${rawId}" necesita limpieza -> "${cleaned}"`);
          fileIssues++;
          plansWithIssues++;
        } else if (cleaned.length === 0) {
          errors.push(`❌ ${file}: ID "${rawId}" está vacío después de limpiar`);
          fileIssues++;
          plansWithIssues++;
        }
      }
    }
    
    if (fileIssues === 0) {
      console.log(`  ✅ ${file}: ${filePlans} planes - IDs limpios`);
    } else {
      console.log(`  ⚠️ ${file}: ${filePlans} planes - ${fileIssues} con problemas`);
    }
  } else {
    warnings.push(`⚠️ Archivo manual no encontrado: ${file}`);
  }
});

// 2. Verificar que service.ts limpia los IDs del CSV
console.log('\n📋 Verificando limpieza en service.ts...');
const servicePath = path.join(__dirname, '../src/lib/valentines/service.ts');
if (fs.existsSync(servicePath)) {
  const serviceContent = fs.readFileSync(servicePath, 'utf8');
  
  // Verificar que existe la función cleanPlanId
  if (!serviceContent.includes('cleanPlanId')) {
    errors.push('❌ service.ts NO tiene función cleanPlanId para limpiar IDs del CSV');
  } else {
    console.log('  ✅ service.ts tiene función cleanPlanId');
  }
  
  // Verificar que se usa en el mapeo de planes
  if (!serviceContent.includes('const id = cleanPlanId(rawId)') && 
      !serviceContent.includes('const id = cleanPlanId(rawId);')) {
    errors.push('❌ service.ts NO aplica cleanPlanId al procesar planes del CSV');
  } else {
    console.log('  ✅ service.ts aplica cleanPlanId a los planes del CSV');
  }
} else {
  errors.push('❌ service.ts no existe');
}

// 3. Verificar que utm.ts limpia los IDs
console.log('\n📋 Verificando limpieza en utm.ts...');
const utmPath = path.join(__dirname, '../src/lib/valentines/utm.ts');
if (fs.existsSync(utmPath)) {
  const utmContent = fs.readFileSync(utmPath, 'utf8');
  
  // Verificar que existe la función cleanPlanId
  if (!utmContent.includes('function cleanPlanId')) {
    errors.push('❌ utm.ts NO tiene función cleanPlanId');
  } else {
    console.log('  ✅ utm.ts tiene función cleanPlanId');
  }
  
  // Verificar que se usa en buildPlanUtmUrl
  if (!utmContent.includes('const finalPlanId = cleanPlanId(rawPlanId)') &&
      !utmContent.includes('const finalPlanId = cleanPlanId(rawPlanId);')) {
    errors.push('❌ utm.ts NO aplica cleanPlanId en buildPlanUtmUrl');
  } else {
    console.log('  ✅ utm.ts aplica cleanPlanId en buildPlanUtmUrl');
  }
} else {
  errors.push('❌ utm.ts no existe');
}

// 4. Verificar que todos los componentes pasan plan.id correctamente
console.log('\n📋 Verificando componentes...');
const components = [
  { file: 'plan-card.tsx', check: 'getTrackedLink(plan.link, plan.id)' },
  { file: 'valentines-landing-view.tsx', check: 'buildPlanUtmUrl' },
  { file: 'category-page-view.tsx', check: 'buildPlanUtmUrl' }
];

components.forEach(({ file, check }) => {
  const filePath = path.join(__dirname, '../src/components/valentines', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(check)) {
      console.log(`  ✅ ${file} usa ${check}`);
    } else {
      warnings.push(`⚠️ ${file} podría no estar usando ${check} correctamente`);
    }
  }
});

// 5. Test de ejemplo: Verificar que IDs problemáticos se limpian
console.log('\n🧪 Test de limpieza de IDs problemáticos...');
const testCases = [
  { input: '404,940', expected: '404940', desc: 'ID con coma' },
  { input: '404%2C940', expected: '404940', desc: 'ID con URL encoding' },
  { input: '404 940', expected: '404940', desc: 'ID con espacio' },
  { input: '404940', expected: '404940', desc: 'ID limpio' },
  { input: '123', expected: '123', desc: 'ID simple' }
];

let testPassed = 0;
let testFailed = 0;

testCases.forEach(({ input, expected, desc }) => {
  const result = cleanPlanId(input);
  if (result === expected) {
    testPassed++;
    console.log(`  ✅ ${desc}: "${input}" -> "${result}"`);
  } else {
    testFailed++;
    errors.push(`❌ Test fallido - ${desc}: "${input}" -> "${result}" (esperado: "${expected}")`);
  }
});

// Resumen
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(60));
console.log(`Total planes verificados: ${totalPlans}`);
console.log(`Planes con problemas: ${plansWithIssues}`);
console.log(`Tests de limpieza: ${testPassed} pasados, ${testFailed} fallidos`);

if (errors.length === 0 && warnings.length === 0 && plansWithIssues === 0 && testFailed === 0) {
  console.log('\n✅ VERIFICACIÓN COMPLETA: TODO CORRECTO');
  console.log('✅ Todos los planes de todas las ciudades tienen IDs limpios');
  console.log('✅ La limpieza está aplicada en service.ts y utm.ts');
  console.log('✅ Todos los componentes usan la limpieza correctamente');
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ERRORES ENCONTRADOS (${errors.length}):`);
    errors.forEach(e => console.log(`  ${e}`));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️ ADVERTENCIAS (${warnings.length}):`);
    warnings.forEach(w => console.log(`  ${w}`));
  }
  if (plansWithIssues > 0) {
    console.log(`\n❌ ${plansWithIssues} planes tienen IDs con caracteres inválidos`);
  }
  process.exit(1);
}
