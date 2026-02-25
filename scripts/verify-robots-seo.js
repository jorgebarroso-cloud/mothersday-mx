/**
 * Verificar configuración de robots.txt y SEO
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de robots.txt y SEO...\n');
console.log('='.repeat(60));

let allOk = true;
const issues = [];
const warnings = [];

// 1. Verificar robots.txt
console.log('\n📄 1. VERIFICACIÓN ROBOTS.TXT');
console.log('-'.repeat(60));

const robotsPath = path.join(__dirname, '../public/robots.txt');
const robotsContent = fs.readFileSync(robotsPath, 'utf8');

// Verificar que permite _next/static/
if (robotsContent.includes('Allow: /_next/static/')) {
  console.log('✅ _next/static/ está permitido');
} else {
  console.log('❌ _next/static/ NO está permitido explícitamente');
  issues.push('robots.txt: Falta Allow: /_next/static/');
  allOk = false;
}

// Verificar que no bloquea _next/
if (robotsContent.includes('Disallow: /_next/')) {
  console.log('⚠️  _next/ está bloqueado (puede ser problemático si no permite static/)');
  warnings.push('robots.txt: Disallow: /_next/ puede bloquear archivos necesarios');
} else {
  console.log('✅ _next/ no está bloqueado explícitamente');
}

// Verificar sitemap
if (robotsContent.includes('Sitemap:')) {
  console.log('✅ Sitemap configurado');
} else {
  console.log('⚠️  Sitemap no configurado');
  warnings.push('robots.txt: Falta configuración de Sitemap');
}

// 2. Verificar Middleware
console.log('\n🔄 2. VERIFICACIÓN MIDDLEWARE');
console.log('-'.repeat(60));

const middlewarePath = path.join(__dirname, '../middleware.ts');
const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');

// Verificar que usa 301 para redirects
if (middlewareContent.includes('status: 301')) {
  console.log('✅ Middleware usa redirects 301 (Permanent)');
} else {
  console.log('❌ Middleware NO usa redirects 301');
  issues.push('middleware.ts: Falta status: 301 en redirects');
  allOk = false;
}

// Verificar que solo redirige la raíz, no rutas específicas
if (middlewareContent.includes("request.nextUrl.pathname === '/'")) {
  console.log('✅ Middleware solo redirige la raíz (/)');
} else {
  console.log('⚠️  Verificar que middleware solo redirige la raíz');
  warnings.push('middleware.ts: Verificar lógica de redirects');
}

// Verificar que no redirige rutas de ciudades
const cityRedirectPattern = /redirect.*\/en\/.*madrid|redirect.*\/es\/.*barcelona/i;
if (cityRedirectPattern.test(middlewareContent)) {
  console.log('❌ Middleware puede estar redirigiendo rutas de ciudades');
  issues.push('middleware.ts: Puede estar redirigiendo rutas específicas incorrectamente');
  allOk = false;
} else {
  console.log('✅ Middleware no redirige rutas de ciudades');
}

// 3. Verificar nginx.conf
console.log('\n🌐 3. VERIFICACIÓN NGINX.CONF');
console.log('-'.repeat(60));

const nginxPath = path.join(__dirname, '../nginx.conf');
const nginxContent = fs.readFileSync(nginxPath, 'utf8');

// Verificar port_in_redirect
if (nginxContent.includes('port_in_redirect off')) {
  console.log('✅ port_in_redirect off configurado');
} else {
  console.log('❌ Falta port_in_redirect off');
  issues.push('nginx.conf: Falta port_in_redirect off');
  allOk = false;
}

// Verificar que las rutas de ciudades se sirven correctamente
if (nginxContent.includes('try_files $uri/index.html')) {
  console.log('✅ Rutas con trailing slash configuradas correctamente');
} else {
  console.log('⚠️  Verificar configuración de rutas en nginx');
  warnings.push('nginx.conf: Verificar try_files para rutas');
}

// Resumen
console.log('\n' + '='.repeat(60));
console.log('📋 RESUMEN');
console.log('='.repeat(60));

if (allOk && issues.length === 0) {
  console.log('✅ CONFIGURACIÓN CORRECTA');
  if (warnings.length > 0) {
    console.log('\n⚠️  ADVERTENCIAS (no críticas):');
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

console.log('\n' + '='.repeat(60));
console.log('✅ LISTO PARA PROBAR EN LOCAL');
console.log('='.repeat(60));
