# Punto 1: Estudio completo de la web Colvin (thecolvinco.com)

Documento de referencia basado en [thecolvinco.com](https://www.thecolvinco.com/) para alinear después el sitio Mother's Day. Se ha analizado estructura, contenido y patrones visibles en el HTML y la oferta actual (San Valentín).

---

## 1. Colores (inferidos y a confirmar en DevTools)

- **Fondos:** Blanco y off-white; secciones con fondo muy suave para separar bloques.
- **Texto:** Negro / gris oscuro para títulos y cuerpo; gris medio para secundario.
- **Acento principal:** Verde (marca "natural"); en la oferta San Valentín se suma **rosa** en detalles ("Detalles que suman", iconografía).
- **CTAs:** Botón principal en color de marca (verde); texto del CTA claro y corto.
- **Top bar:** Fondo en color de campaña (ej. rosa/rojo suave para San Valentín) con texto blanco o oscuro según contraste.

**Acción recomendada:** En el navegador, inspeccionar en [thecolvinco.com](https://www.thecolvinco.com/) `theme-color`, botones, top bar y footer para anotar hex/RGB exactos y usarlos en variables CSS.

---

## 2. Logo y uso de marca

- **Logo:** Marca de palabra **"Colvin"** en imagen (PNG/SVG): tipografía limpia, sin icono o con icono muy integrado. URL observada: `cdn/shop/files/Colvin.png`.
- **Ubicación:** Header izquierda; clic lleva a home. En el contenido a veces se repite el logo pequeño en bloques tipo "Colvin" como firma de sección.
- **Favicon / móvil:** Misma marca "Colvin" o símbolo reducido.
- **Estilo:** Sans-serif moderna; sin serifas ni decoración; sensación "premium pero cercana".

---

## 3. Branding (voz y sensación)

- **Tono:** Cercano, positivo, orientado a "regalo" y "detalle" ("Regala bonito", "Amor a medida", "Bonito de principio a fin").
- **Mensajes de valor:** Envío gratis por compra mínima, urgencia suave ("2 días para San Valentín", "Quedan pocas unidades"), personalización ("Personaliza tu regalo").
- **Consistencia:** Títulos de sección cortos y memorables; CTAs con verbos de acción ("Descubre", "Ver detalles", "Elige tu opción").
- **Confianza:** Bloque de "Bonito de principio a fin" con tres pilares; logos de prensa (Vogue, Harper's Bazaar, Marie Claire) y citas.

---

## 4. Módulos que mejor funcionan y cómo están hechos

### 4.1 Top bar (urgencia / oferta)

- **Contenido:** Una sola línea: ej. "Envío gratis en San Valentín desde 60 €".
- **Uso:** Oferta clara y cuantificada; sin distracciones.
- **Implementación:** Barra full-width, texto centrado, tipografía legible y color de fondo que destaque.

### 4.2 Hero (carousel / bloques sucesivos)

- **Estructura por slide:** Imagen a ancho completo, **H2** (ej. "2 días para San Valentín", "Amor a medida", "El regalo estrella"), **una frase de apoyo** y **un solo CTA** ("Descubre la colección", "Regala bonito", "Lo quiero").
- **Uso:** Un mensaje por bloque; CTA único por pantalla; sin listas ni múltiples botones.
- **Jerarquía:** H2 muy visible; subtítulo corto; CTA como elemento principal de interacción.

### 4.3 Secciones de producto ("Los más regalados", "El regalo más especial", "Otros productos bonitos")

- **Título de sección:** H2 corto (ej. "Los más regalados").
- **Enlace "Ver todos":** Junto al título, a la colección o categoría.
- **Grid de cards:** Misma estructura en todas:
  - **Imagen** (o varias) como elemento principal.
  - **Badges** sobre la imagen: "Incluye tarjeta", "Maceta gratis", "Premium", "Jarrón gratis", "Quedan pocas unidades", "Agotado".
  - **Título del producto** (H3).
  - **Precio:** Precio de venta destacado; precio habitual tachado si hay descuento.
  - **Microcopy** opcional: ej. "Descuento y tarjeta. Detalles que suman".
  - **Dos CTAs:** "Ver detalles" (primario) y "Elige tu opción" (secundario / variante).
- **Uso:** Escaneable; badges para beneficio/urgencia; precios claros; doble CTA para "ver más" o "comprar/configurar".

### 4.4 Bloques editoriales ("Quiere bonito", "Personaliza…", "Son el detalle perfecto")

- **Estructura:** Headline en negrita, párrafo con 1–2 frases en **negrita**, CTA al final ("Ver colección", "Ver regalos", "Ver arreglos").
- **Fondo:** Distinto al resto (color o imagen suave) para marcar sección de "historia" o valor.
- **Uso:** Refuerzo de marca y beneficio; no sustituyen al producto sino que acompañan.

### 4.5 Bloque de confianza ("Bonito de principio a fin")

- **Estructura:** Título H2; **tres columnas** con:
  - Icono (ilustración/SVG).
  - Título corto (H3): "Diseñado en nuestro taller", "Regalos con intención", "De puerta a puerta en 24h".
  - Sin párrafo largo (o una línea como mucho).
- **Uso:** Tres pilares claros; iconografía reconocible; mensajes cortos para leer en segundos.

### 4.6 Testimonials / prensa

- **Formato:** Logos de medios (Vogue, Harper's Bazaar, Marie Claire) y cita debajo.
- **Uso:** Prueba social sin texto largo; autoridad de marca.

### 4.7 Footer

- **Columnas:** Ramos y ocasiones, Cerca de ti, Más información, Sobre nosotros, Legal.
- **Extras:** Selector país/idioma; iconos de métodos de pago; iconos de redes; copyright ("© 2026 Colvin. Tecnología de Shopify").
- **Uso:** Navegación por temas; confianza (pagos, redes); legal accesible.

---

## 5. Resumen: mejores usos para conversión y UX

| Patrón | Uso en Colvin | Aplicación posible en Mother's Day |
|--------|----------------|-------------------------------------|
| Top bar una línea | Oferta/urgencia clara | Countdown o mensaje de valor único |
| Hero un CTA | Un mensaje + un botón por bloque | Mantener un CTA principal por hero |
| Título + "Ver todos" | En cada grid de productos | "Ver todas las ciudades" o "Explorar por ciudad" |
| Cards con badges | Beneficio/urgencia sobre la imagen | Badges tipo "Popular", "Nuevo" en ideas/ciudades |
| Precio + tachado | Transparencia y descuento | No aplica igual; sí "From £X" en planes |
| Editorial headline + CTA | Historia + una acción | SEO block o bloque "Por qué regalar experiencias" |
| Trust 3 ítems | Icono + título corto | Ya en uso; reforzar iconos y mensajes cortos |

---

## 6. Siguiente paso recomendado

- **Punto 2 (futuro):** Con este estudio como base, definir en un segundo documento o plan:
  - Paleta exacta (hex) tomada de Colvin o adaptada a Mother's Day.
  - Tipografía (nombre de fuente si se identifica en Colvin).
  - Mapeo módulo a módulo (qué tenemos ya y qué ajustar en estructura/estilo para acercarse a Colvin sin cambiar el contenido ni las URLs del sitio actual).

Este estudio (punto 1) queda cerrado; se puede usar este documento como referencia en el repo para los siguientes pasos.
