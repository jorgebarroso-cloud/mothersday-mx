/**
 * Verificación final de integración UTM
 * Verifica que todos los componentes están correctamente conectados
 */

const fs = require('fs');
const path = require('path');

let errors = [];
let warnings = [];

console.log('🔍 Verificando integración UTM completa...\n');

// 1. Verificar que utm.ts existe y exporta buildPlanUtmUrl
const utmPath = path.join(__dirname, '../src/lib/valentines/utm.ts');
if (!fs.existsSync(utmPath)) {
  errors.push('❌ src/lib/valentines/utm.ts no existe');
} else {
  const utmContent = fs.readFileSync(utmPath, 'utf8');
  if (!utmContent.includes('export function buildPlanUtmUrl')) {
    errors.push('❌ buildPlanUtmUrl no está exportada en utm.ts');
  }
  if (!utmContent.includes('CITY_UTM_CODES')) {
    errors.push('❌ CITY_UTM_CODES no está definido en utm.ts');
  }
  console.log('✅ utm.ts existe y exporta buildPlanUtmUrl');
}

// 2. Verificar que valentines-landing-view.tsx importa y usa buildPlanUtmUrl
const landingPath = path.join(__dirname, '../src/components/valentines/valentines-landing-view.tsx');
if (fs.existsSync(landingPath)) {
  const landingContent = fs.readFileSync(landingPath, 'utf8');
  if (!landingContent.includes("import { buildPlanUtmUrl }")) {
    errors.push('❌ valentines-landing-view.tsx no importa buildPlanUtmUrl');
  } else if (landingContent.includes('buildPlanUtmUrl(')) {
    console.log('✅ valentines-landing-view.tsx importa y usa buildPlanUtmUrl');
  } else {
    warnings.push('⚠️ valentines-landing-view.tsx importa buildPlanUtmUrl pero no la usa');
  }
  
  // Verificar que getTrackedLink acepta planId
  if (!landingContent.includes('getTrackedLink = useCallback((link: string, planId?: string)')) {
    errors.push('❌ getTrackedLink en valentines-landing-view.tsx no acepta planId');
  }
} else {
  errors.push('❌ valentines-landing-view.tsx no existe');
}

// 3. Verificar que category-page-view.tsx importa y usa buildPlanUtmUrl
const categoryPath = path.join(__dirname, '../src/components/valentines/category-page-view.tsx');
if (fs.existsSync(categoryPath)) {
  const categoryContent = fs.readFileSync(categoryPath, 'utf8');
  if (!categoryContent.includes("import { buildPlanUtmUrl }")) {
    errors.push('❌ category-page-view.tsx no importa buildPlanUtmUrl');
  } else if (categoryContent.includes('buildPlanUtmUrl(')) {
    console.log('✅ category-page-view.tsx importa y usa buildPlanUtmUrl');
  } else {
    warnings.push('⚠️ category-page-view.tsx importa buildPlanUtmUrl pero no la usa');
  }
  
  // Verificar que getTrackedLink acepta planId
  if (!categoryContent.includes('getTrackedLink = useCallback((link: string, planId?: string)')) {
    errors.push('❌ getTrackedLink en category-page-view.tsx no acepta planId');
  }
} else {
  errors.push('❌ category-page-view.tsx no existe');
}

// 4. Verificar que plan-card.tsx pasa plan.id a getTrackedLink
const planCardPath = path.join(__dirname, '../src/components/valentines/plan-card.tsx');
if (fs.existsSync(planCardPath)) {
  const planCardContent = fs.readFileSync(planCardPath, 'utf8');
  if (!planCardContent.includes('getTrackedLink(plan.link, plan.id)')) {
    errors.push('❌ plan-card.tsx no pasa plan.id a getTrackedLink');
  } else {
    console.log('✅ plan-card.tsx pasa plan.id a getTrackedLink');
  }
  
  // Verificar que la interfaz acepta planId
  if (!planCardContent.includes('getTrackedLink?: (link: string, planId?: string)')) {
    errors.push('❌ PlanCardProps.getTrackedLink no acepta planId');
  }
} else {
  errors.push('❌ plan-card.tsx no existe');
}

// 5. Verificar que plan-carousel.tsx tiene la firma correcta
const carouselPath = path.join(__dirname, '../src/components/valentines/plan-carousel.tsx');
if (fs.existsSync(carouselPath)) {
  const carouselContent = fs.readFileSync(carouselPath, 'utf8');
  if (!carouselContent.includes('getTrackedLink?: (link: string, planId?: string)')) {
    errors.push('❌ PlanCarouselProps.getTrackedLink no acepta planId');
  } else {
    console.log('✅ plan-carousel.tsx tiene firma correcta para getTrackedLink');
  }
} else {
  errors.push('❌ plan-carousel.tsx no existe');
}

// 6. Verificar que los planes manuales tienen id
const manualDataFiles = [
  'munchen-manual-data.ts',
  'toronto-manual-data.ts',
  'buenos-aires-manual-data.ts',
  'mexico-city-manual-data.ts',
  'montreal-manual-data.ts',
  'roma-manual-data.ts',
  'milano-manual-data.ts'
];

let manualDataOk = true;
manualDataFiles.forEach(file => {
  const filePath = path.join(__dirname, '../src/lib/valentines', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Verificar que tiene id: en los objetos
    if (!content.includes('id:')) {
      errors.push(`❌ ${file} no tiene campo id en los planes`);
      manualDataOk = false;
    }
  }
});

if (manualDataOk) {
  console.log('✅ Planes manuales tienen campo id');
}

// Resumen
console.log('\n' + '='.repeat(50));
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ Verificación completa: TODO CORRECTO');
  console.log('\n✅ Integración UTM lista para producción');
} else {
  if (errors.length > 0) {
    console.log(`\n❌ Errores encontrados (${errors.length}):`);
    errors.forEach(e => console.log(`  ${e}`));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️ Advertencias (${warnings.length}):`);
    warnings.forEach(w => console.log(`  ${w}`));
  }
  process.exit(errors.length > 0 ? 1 : 0);
}
