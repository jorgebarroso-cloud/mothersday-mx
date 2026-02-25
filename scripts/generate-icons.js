/**
 * Script para generar iconos PNG/ICO desde SVG
 * Requiere: sharp, to-ico
 * 
 * Instalación:
 * npm install --save-dev sharp to-ico
 * 
 * Uso:
 * node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Verificar si sharp está disponible
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Error: sharp no está instalado.');
  console.log('📦 Instala las dependencias: npm install --save-dev sharp to-ico');
  process.exit(1);
}

const SVG_SOURCE = path.join(__dirname, '../public/images/brand/icon-source.svg');
const OUTPUT_DIR = path.join(__dirname, '../public');

// Tamaños a generar
const SIZES = {
  'favicon-16': 16,
  'favicon-32': 32,
  'favicon-48': 48,
  'apple-touch-icon': 180,
  'icon-192': 192,
  'icon-512': 512,
};

async function generatePNG(size, name) {
  try {
    const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
    
    await sharp(SVG_SOURCE)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparente
      })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outputPath);
    
    console.log(`✅ Generado: ${name}.png (${size}x${size})`);
    return outputPath;
  } catch (error) {
    console.error(`❌ Error generando ${name}.png:`, error.message);
    throw error;
  }
}

async function generateICO() {
  try {
    const toIco = require('to-ico');
    const fs = require('fs').promises;
    
    // Generar PNGs temporales para ICO
    const png16 = await sharp(SVG_SOURCE).resize(16, 16).png().toBuffer();
    const png32 = await sharp(SVG_SOURCE).resize(32, 32).png().toBuffer();
    const png48 = await sharp(SVG_SOURCE).resize(48, 48).png().toBuffer();
    
    // Crear ICO multi-resolución
    const ico = await toIco([png16, png32, png48]);
    
    const outputPath = path.join(OUTPUT_DIR, 'favicon.ico');
    await fs.writeFile(outputPath, ico);
    
    console.log('✅ Generado: favicon.ico (16x16, 32x32, 48x48)');
    return outputPath;
  } catch (error) {
    console.error('❌ Error generando favicon.ico:', error.message);
    console.log('💡 Alternativa: Usa https://cloudconvert.com/svg-to-ico');
    throw error;
  }
}

async function main() {
  console.log('🎨 Generando iconos desde SVG...\n');
  
  // Verificar que el SVG fuente existe
  if (!fs.existsSync(SVG_SOURCE)) {
    console.error(`❌ Error: No se encuentra ${SVG_SOURCE}`);
    process.exit(1);
  }
  
  try {
    // Generar PNGs
    for (const [name, size] of Object.entries(SIZES)) {
      await generatePNG(size, name);
    }
    
    // Generar ICO (opcional, requiere to-ico)
    try {
      await generateICO();
    } catch (error) {
      console.log('\n⚠️  ICO no generado. Usa herramienta online para favicon.ico');
    }
    
    console.log('\n✅ ¡Todos los iconos generados exitosamente!');
    console.log('\n📋 Archivos generados:');
    console.log('  - apple-touch-icon.png (180x180)');
    console.log('  - icon-192.png (192x192)');
    console.log('  - icon-512.png (512x512)');
    console.log('  - favicon.ico (si to-ico está disponible)');
    
  } catch (error) {
    console.error('\n❌ Error durante la generación:', error);
    process.exit(1);
  }
}

main();
