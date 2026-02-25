# Diagnóstico: área gris en Google Search Console

**Fecha**: 23 enero 2026  
**Objetivo**: Determinar la causa real del área gris que aparece en la captura de GSC debajo del hero (sin asumir que sea solo el tamaño del hero ni solo el CSS).

---

## 1. Qué hemos hecho hasta ahora

- **COMPROBACIONES-REALIZADAS.md**: Se corrigió `fade-in-up` (sin `opacity: 0`), hero con `bg-[#FF3366]` de fallback, y se añadieron secciones visibles (banners rosas) para crawlers. La captura de GSC **seguía mostrando gris**.
- **VERIFICACION-SEO-CRAWLERS.md**: Se eliminó Suspense (ya no "Loading..."), enlaces con `<Link>`, contenido en HTML inicial. El problema de “pantalla gris” se atribuyó al Suspense; al persistir el gris, hay otra causa o una causa adicional.
- **Cambios recientes**: Se quitaron los banners rosas (UX) y se redujo el hero en móvil a `h-[65dvh]` para que más contenido entre en el primer viewport. Tú indicas que crees que **no es un tema de tamaño del hero sino de Next.js**.

---

## 2. Cadena de renderizado (Next.js + static export)

- **next.config.js**: Con `NODE_ENV=production` (o GITHUB_ACTIONS/DOCKER) se usa `output: 'export'`. El build genera HTML estático en `out/`.
- **Layout**: `layout.tsx` (root) → `body` sin clase de fondo explícita; `[locale]/layout.tsx` → `<main className="min-h-screen pt-14">` sin fondo. El color de fondo del **body** viene solo de **globals.css**.
- **globals.css**:  
  `:root { --background: 0 0% 96.1%; }`  
  `body { @apply bg-background ... }`  
  Es decir: **el fondo por defecto de toda la página es un gris claro** (HSL 0, 0%, 96.1%).
- **Página home** (`/en/`): Server Component; incluye HeroSection (client), GlobalGuideSection (client), CitySelector, etc. Con static export, Next.js pre-renderiza todo en build; el HTML estático incluye el árbol completo (incluidos los client components con su primer render).
- **Hero**: Tiene `bg-[#FF3366]` y altura `h-[65dvh]` (antes 100dvh). La sección siguiente (GlobalGuideSection) tiene `bg-gradient-to-b from-white via-pink-50/30 to-white`.

Conclusión de la cadena: el **único** color de fondo “por defecto” de la página es el del **body** = `--background` = **gris claro**. Cualquier zona que no tenga su propio fondo (o que no lo tenga aplicado aún) mostrará ese gris.

---

## 3. Posibles causas del gris “debajo del hero”

Se consideran solo causas plausibles con el código actual:

| Hipótesis | Explicación | Valoración |
|-----------|-------------|------------|
| **A) Fondo por defecto del body** | `body` usa `bg-background` = 96.1% luminosidad = gris claro. Cualquier área “vacía” o sin fondo propio (incluido el espacio debajo del hero hasta que se pinta la siguiente sección) muestra ese gris. | **Muy plausible** |
| **B) Orden de aplicación del CSS** | Next.js/Tailwind pueden cargar CSS en chunks. Si el crawler hace la captura antes de que se aplique el CSS de GlobalGuideSection (o del wrapper de ciudad), esa zona no tiene fondo y se ve el del body = gris. | **Plausible** |
| **C) Altura del hero** | Con hero a 100dvh (o 65dvh), “debajo del hero” es la siguiente sección. Si esa sección no se pinta a tiempo (B) o no tiene fondo en el snapshot, se ve el body (A). | **Contribuye**, no causa única |
| **D) Contenido no en el HTML** | El contenido SÍ está en el HTML estático (Server Components + pre-render de client components; sin Suspense con “Loading…”). No hay shell vacío. | **Descartada** como causa del gris |
| **E) Imagen del hero** | Si la imagen no carga, el hero ya tiene `bg-[#FF3366]`; no explica un gris *debajo* del hero. | **Descartada** para el área debajo |

---

## 4. Conclusión

**La causa más probable del área gris en GSC es la combinación de:**

1. **Causa principal: el color de fondo por defecto del body es gris**  
   `--background: 0 0% 96.1%` en `globals.css` y `body { @apply bg-background }` hacen que toda la página tenga de fondo un gris claro. Cualquier zona que en el momento del snapshot no tenga un fondo propio (por estar “debajo del hero”, por un hueco entre secciones o porque el CSS de la sección aún no se ha aplicado) se verá gris en la captura.

2. **Causa contribuyente: momento de la captura frente al CSS**  
   Si el crawler captura la página muy pronto (antes de que se apliquen todos los estilos de secciones), las áreas que dependen de clases Tailwind (p. ej. el gradiente de GlobalGuideSection) pueden no estar pintadas y se verá el fondo del body (gris).

No es un “bug” de Next.js en el sentido de contenido faltante o HTML incorrecto: el contenido está en el HTML estático. El efecto gris viene de **qué color tiene la página por defecto** (body) y **cuándo** se pinta el resto del CSS en el entorno del crawler.

---

## 5. Recomendación

**Cambiar el fondo por defecto de gris a blanco** (o a un blanco muy ligeramente rosa si quieres coherencia con la marca):

- En **`src/app/globals.css`**, en `:root`, cambiar:  
  `--background: 0 0% 96.1%;`  
  por  
  `--background: 0 0% 100%;`  
  (blanco puro).

Con eso:

- Si la causa es A: el “debajo del hero” y cualquier zona sin fondo propio pasan de gris a blanco.
- Si la causa es B: en capturas tempranas, en lugar de gris se verá blanco.

Es un cambio de una línea, bajo riesgo, y cubre tanto la causa de diseño (fondo por defecto) como la de timing del CSS en el crawler.

Opcionalmente se puede revertir el hero a `h-[100dvh]` si prefieres hero a pantalla completa; el gris en GSC se aborda con el cambio de `--background`, no con la altura del hero.
