/**
 * Script para verificar la configuración de nginx
 * Verifica que no haya problemas con redirects o puertos
 */

const fs = require('fs');
const path = require('path');

const nginxConfigPath = path.join(__dirname, '../nginx.conf');
const nginxConfig = fs.readFileSync(nginxConfigPath, 'utf8');

console.log('🔍 Verificando configuración de nginx...\n');

let issues = [];
let warnings = [];

// Verificar que port_in_redirect esté configurado
if (!nginxConfig.includes('port_in_redirect')) {
  issues.push('❌ Falta configuración port_in_redirect off');
} else {
  console.log('✅ port_in_redirect configurado');
}

// Verificar headers de proxy
if (!nginxConfig.includes('real_ip_header')) {
  warnings.push('⚠️  Falta configuración real_ip_header (puede ser necesario para Cloud Run)');
} else {
  console.log('✅ real_ip_header configurado');
}

// Verificar que no haya redirects a HTTP explícitos
if (nginxConfig.includes('return 301 http://') || nginxConfig.includes('return 302 http://')) {
  issues.push('❌ Hay redirects a HTTP (deberían ser HTTPS)');
} else {
  console.log('✅ No hay redirects explícitos a HTTP');
}

// Verificar que los redirects de ciudades usen 301
const redirectMatches = nginxConfig.match(/return\s+(\d+)\s+/g);
if (redirectMatches) {
  redirectMatches.forEach(match => {
    const status = match.match(/\d+/)[0];
    if (status === '302') {
      warnings.push(`⚠️  Redirect ${status} encontrado (debería ser 301 para SEO)`);
    } else if (status === '301') {
      console.log(`✅ Redirect ${status} (correcto para SEO)`);
    }
  });
}

// Verificar comentarios sobre HTTPS
if (!nginxConfig.includes('Cloud Run handles HTTPS')) {
  warnings.push('⚠️  Falta comentario sobre manejo de HTTPS por Cloud Run');
} else {
  console.log('✅ Comentarios sobre HTTPS presentes');
}

console.log('\n' + '='.repeat(60));
if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ Configuración de nginx correcta');
} else {
  if (issues.length > 0) {
    console.log('\n❌ PROBLEMAS ENCONTRADOS:');
    issues.forEach(issue => console.log(`  ${issue}`));
  }
  if (warnings.length > 0) {
    console.log('\n⚠️  ADVERTENCIAS:');
    warnings.forEach(warning => console.log(`  ${warning}`));
  }
}
