# ✅ Verificación de Assets Visuales - Celebrate Valentine's

## 📋 Checklist de Verificación

### 1. Favicons en Navegadores

#### Chrome/Edge
1. Abre `https://celebratevalentines.com` en Chrome
2. Presiona `F12` para abrir DevTools
3. Ve a **Application** → **Manifest**
4. Verifica que aparezcan:
   - ✅ `favicon.svg`
   - ✅ `favicon.ico` (fallback)
   - ✅ `icon-192.png`
   - ✅ `icon-512.png`

**Verificación en pestaña:**
- El favicon debe aparecer en la pestaña del navegador
- Debe mostrar los dos corazones entrelazados en rosa

#### Firefox
1. Abre `https://celebratevalentines.com` en Firefox
2. Verifica el favicon en la pestaña
3. Inspecciona el elemento `<link rel="icon">` en el HTML

#### Safari (macOS/iOS)
1. Abre `https://celebratevalentines.com` en Safari
2. Verifica el favicon en la pestaña
3. **Agregar a pantalla de inicio:**
   - iOS: Compartir → Agregar a pantalla de inicio
   - macOS: Archivo → Agregar a Dock
   - Verifica que `apple-touch-icon.png` (180x180) se muestre correctamente

#### Safari Pinned Tab
1. En Safari macOS, fija una pestaña (clic derecho → Fijar pestaña)
2. Verifica que el icono monocromo (`safari-pinned-tab.svg`) se muestre

---

### 2. OG Image en Redes Sociales

#### Facebook
1. Ve a [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Ingresa: `https://celebratevalentines.com`
3. Haz clic en **Scrape Again** para forzar actualización
4. Verifica:
   - ✅ Imagen OG visible (1200x630px)
   - ✅ Título correcto
   - ✅ Descripción correcta
   - ✅ URL correcta

**Resultado esperado:**
- Imagen: `/images/brand/og-image.jpg` o fallback
- Título: "Valentine's Day 2026: Best Romantic Plans & Dinners"
- Descripción: "Explore romantic plans for Valentine's Day 2026..."

#### Twitter/X
1. Ve a [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Ingresa: `https://celebratevalentines.com`
3. Verifica:
   - ✅ Card type: `summary_large_image`
   - ✅ Imagen visible (1200x630px)
   - ✅ Título y descripción correctos

**Resultado esperado:**
- Card: `summary_large_image`
- Imagen: `/images/brand/og-image.jpg`
- Título y descripción correctos

#### LinkedIn
1. Ve a [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
2. Ingresa: `https://celebratevalentines.com`
3. Verifica:
   - ✅ Imagen preview visible
   - ✅ Título y descripción correctos

**Resultado esperado:**
- Imagen preview de 1200x630px
- Metadata correcta

#### WhatsApp
1. Abre WhatsApp (móvil o web)
2. Comparte el enlace: `https://celebratevalentines.com`
3. Verifica que aparezca:
   - ✅ Imagen preview
   - ✅ Título
   - ✅ Descripción

---

### 3. PWA en Móviles

#### Android (Chrome)
1. Abre `https://celebratevalentines.com` en Chrome Android
2. Menú (3 puntos) → **Instalar aplicación** o **Agregar a pantalla de inicio**
3. Verifica:
   - ✅ Icono de la app (icon-192.png o icon-512.png)
   - ✅ Nombre: "Celebrate Valentine's"
   - ✅ La app se abre en modo standalone (sin barra del navegador)
   - ✅ Theme color: Rosa (#FF1493)

**Verificación en Chrome DevTools (móvil):**
- F12 → Application → Manifest
- Verifica todos los iconos listados
- Verifica `theme_color`: `#FF1493`
- Verifica `background_color`: `#1a1a1a`

#### iOS (Safari)
1. Abre `https://celebratevalentines.com` en Safari iOS
2. Compartir → **Agregar a pantalla de inicio**
3. Verifica:
   - ✅ Icono: `apple-touch-icon.png` (180x180)
   - ✅ Nombre: "Celebrate Valentine's"
   - ✅ La app se abre en modo standalone

**Verificación:**
- El icono debe aparecer en la pantalla de inicio
- Al abrir, debe ser fullscreen (sin barra de Safari)

---

## 🔍 Herramientas de Verificación Online

### Favicons
- [RealFaviconGenerator Favicon Checker](https://realfavicongenerator.net/favicon_checker)
  - Ingresa: `https://celebratevalentines.com`
  - Verifica todos los favicons y tamaños

### OG Images
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Open Graph Preview](https://www.opengraph.xyz/)

### PWA
- [PWA Builder](https://www.pwabuilder.com/)
  - Ingresa: `https://celebratevalentines.com`
  - Verifica manifest, service worker, etc.

---

## 📱 Verificación Manual en Dispositivos

### Desktop
- [ ] Chrome: Favicon visible en pestaña
- [ ] Firefox: Favicon visible en pestaña
- [ ] Safari: Favicon visible en pestaña
- [ ] Edge: Favicon visible en pestaña

### Mobile
- [ ] iOS Safari: Icono al agregar a pantalla de inicio
- [ ] Android Chrome: Icono al instalar PWA
- [ ] WhatsApp: Preview image al compartir
- [ ] Facebook: Preview image al compartir
- [ ] Twitter: Card image al compartir

---

## 🐛 Solución de Problemas

### Favicon no aparece
1. **Limpia la caché del navegador:**
   - Chrome: Ctrl+Shift+Delete → Caché de imágenes
   - Firefox: Ctrl+Shift+Delete → Caché
   - Safari: Cmd+Option+E (limpiar caché)

2. **Verifica que los archivos existan:**
   - `https://celebratevalentines.com/favicon.svg`
   - `https://celebratevalentines.com/favicon.ico`
   - `https://celebratevalentines.com/apple-touch-icon.png`

3. **Fuerza recarga:**
   - Chrome: Ctrl+F5
   - Firefox: Ctrl+Shift+R
   - Safari: Cmd+Shift+R

### OG Image no aparece
1. **Limpia la caché de Facebook/Twitter:**
   - Facebook: Usa "Scrape Again" en Sharing Debugger
   - Twitter: Espera 24 horas o usa Card Validator

2. **Verifica que el archivo exista:**
   - `https://celebratevalentines.com/images/brand/og-image.jpg`

3. **Verifica metadata en HTML:**
   - Busca `<meta property="og:image" content="...">`
   - Debe apuntar a la URL correcta

### PWA no funciona
1. **Verifica el manifest:**
   - `https://celebratevalentines.com/site.webmanifest`
   - Debe ser JSON válido

2. **Verifica HTTPS:**
   - PWA requiere HTTPS (excepto localhost)

3. **Verifica iconos:**
   - `icon-192.png` y `icon-512.png` deben existir

---

## ✅ Checklist Final

### Archivos Requeridos
- [ ] `favicon.svg` ✅ (existe)
- [ ] `favicon.ico` ⏳ (generar)
- [ ] `apple-touch-icon.png` ✅ (existe, verificar)
- [ ] `icon-192.png` ⏳ (generar)
- [ ] `icon-512.png` ⏳ (generar)
- [ ] `safari-pinned-tab.svg` ✅ (existe)
- [ ] `site.webmanifest` ✅ (existe)
- [ ] `browserconfig.xml` ✅ (existe)
- [ ] `images/brand/og-image.jpg` ⏳ (crear)

### Verificaciones
- [ ] Favicons en Chrome
- [ ] Favicons en Firefox
- [ ] Favicons en Safari
- [ ] OG Image en Facebook
- [ ] OG Image en Twitter
- [ ] OG Image en LinkedIn
- [ ] OG Image en WhatsApp
- [ ] PWA en Android
- [ ] PWA en iOS

---

**Última verificación:** [Fecha]
**Estado:** ⏳ Pendiente generación de PNGs/ICO
