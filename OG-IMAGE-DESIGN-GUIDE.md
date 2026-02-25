# 🎨 Guía de Diseño - OG Image (Open Graph)

## 📐 Especificaciones Técnicas

- **Dimensiones:** 1200 x 630 px (ratio 1.91:1)
- **Formato:** JPEG (optimizado) o PNG
- **Tamaño máximo:** 1MB (recomendado: < 300KB)
- **Ubicación:** `/public/images/brand/og-image.jpg`

## 🎨 Concepto de Diseño

### Layout Estructura:

```
┌─────────────────────────────────────────┐
│  [Background: Elegant blurred city]    │
│                                         │
│  [Logo/Icon: Top-left or center]       │
│                                         │
│  [Typography: Large, bold, elegant]     │
│  "Unforgettable Valentine's Day 2026"  │
│                                         │
│  [Subtitle: Medium, readable]           │
│  "celebratevalentines.com"              │
│                                         │
│  [Optional: Decorative elements]        │
│  (hearts, sparkles, subtle patterns)    │
└─────────────────────────────────────────┘
```

### Elementos Visuales:

1. **Background:**
   - Imagen de fondo elegante y romántica
   - Opciones sugeridas:
     - Ciudad de noche con luces difuminadas (blur)
     - Mesa romántica con velas y flores (desenfoque)
     - Silueta de pareja en atardecer
     - Textura elegante con gradiente rosa/dorado
   - Overlay oscuro (opacidad 40-60%) para legibilidad del texto

2. **Logo/Icon:**
   - Icono de dos corazones entrelazados (del favicon)
   - Posición: Top-left o centrado arriba
   - Tamaño: 80-120px
   - Color: Rosa (#FF1493) o blanco con sombra

3. **Typography Principal:**
   - Texto: "Unforgettable Valentine's Day 2026"
   - Fuente: Montserrat (Bold 700-800)
   - Tamaño: 64-72px
   - Color: Blanco (#FFFFFF) con sombra sutil
   - Alineación: Centrado o izquierda
   - Tracking: -1 a -2px (letter-spacing ajustado)

4. **Subtitle/URL:**
   - Texto: "celebratevalentines.com"
   - Fuente: Montserrat (Medium 500)
   - Tamaño: 24-28px
   - Color: Rosa claro (#FFB6C1) o blanco con opacidad 90%
   - Posición: Debajo del título principal

5. **Elementos Decorativos (Opcional):**
   - Corazones pequeños flotantes (opacidad 20-30%)
   - Partículas de brillo sutiles
   - Líneas elegantes decorativas
   - Bordes sutiles con gradiente

### Paleta de Colores:

- **Primario:** #FF1493 (Deep Pink)
- **Secundario:** #FF6B9D (Pink)
- **Acento:** #FFB6C1 (Light Pink)
- **Texto:** #FFFFFF (White)
- **Fondo:** Oscuro con overlay (#1a1a1a con opacidad)

### Ejemplo de Composición:

```
Background: [Blurred city lights at night]
Overlay: [Dark gradient 40% opacity]
Logo: [Top-left, 100px, white with shadow]
Title: [Center, 68px, white, bold, shadow]
Subtitle: [Below title, 26px, light pink]
Decorative: [Small hearts floating, 20% opacity]
```

## 🛠️ Herramientas Recomendadas

1. **Diseño:**
   - Figma (recomendado)
   - Adobe Photoshop
   - Canva (plantilla OG Image)

2. **Optimización:**
   - [Squoosh](https://squoosh.app/)
   - [TinyJPG](https://tinyjpg.com/)
   - ImageOptim (Mac)

3. **Verificación:**
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

## 📋 Checklist de Creación

- [ ] Diseño creado en 1200x630px
- [ ] Background elegante y romántico aplicado
- [ ] Logo/icono integrado
- [ ] Tipografía principal clara y legible
- [ ] URL/subtitle incluido
- [ ] Elementos decorativos sutiles (opcional)
- [ ] Overlay oscuro para legibilidad
- [ ] Imagen optimizada (< 300KB)
- [ ] Guardada como `og-image.jpg` en `/public/images/brand/`
- [ ] Verificada en Facebook Debugger
- [ ] Verificada en Twitter Card Validator
- [ ] Verificada en LinkedIn Post Inspector

## 🎯 Texto Sugerido (Variaciones)

### Opción 1 (Principal):
- **Título:** "Unforgettable Valentine's Day 2026"
- **Subtitle:** "celebratevalentines.com"

### Opción 2 (Alternativa):
- **Título:** "Romantic Plans & Experiences"
- **Subtitle:** "Valentine's Day 2026 | celebratevalentines.com"

### Opción 3 (Minimalista):
- **Título:** "Celebrate Valentine's"
- **Subtitle:** "Your Global Guide to Romance"

## 📱 Consideraciones Móviles

- El texto debe ser legible cuando se recorta en móviles
- Mantener elementos importantes en el centro
- Evitar texto muy cerca de los bordes
- Probar en diferentes dispositivos

## ✅ Resultado Final

Una imagen OG elegante, romántica y premium que:
- ✅ Captura la atención en redes sociales
- ✅ Comunica la marca claramente
- ✅ Es legible en todos los tamaños
- ✅ Genera clicks (alta CTR)
- ✅ Refleja la calidad premium del servicio

---

**Nota:** Una vez creada la imagen, actualiza el metadata en `src/app/layout.tsx` (ya está configurado para usar `/images/brand/og-image.jpg`).
