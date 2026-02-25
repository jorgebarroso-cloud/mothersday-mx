# Crawlabilidad: Google y bots de IA

**Objetivo**: El sitio debe ser rastreable e indexable por Google y por IAs, **sin cambiar** la UX/UI ni el contenido visible. Todo lo siguiente ya está implementado.

---

## 1. Lo que ya hace el sitio (sin tocar la vista)

### Robots y acceso
- **robots.ts** y **public/robots.txt**: Permiten a todos los bots (`*`) y explícitamente a GPTBot, Google-Extended, CCBot, ClaudeBot, anthropic-ai, cohere-ai, OAI-SearchBot. Ningún bot está bloqueado.
- **Allow** `/_next/static/`, `/_next/image/`, `/_next/image/` para que Google y las IAs puedan cargar JS/CSS y renderizar si lo necesitan.
- **Sitemap**: `https://celebratevalentines.com/sitemap.xml` declarado en robots.

### Meta y indexación
- **layout.tsx**: `robots: { index: true, follow: true }` y permisos explícitos para GPTBot, Google-Extended, CCBot, ClaudeBot.
- Páginas importantes (home, ciudad, categorías) no tienen `noindex`; están pensadas para indexación.

### Contenido en el HTML (visible para crawlers)
- **Static export** (`output: 'export'`): El HTML se genera en build; la respuesta incluye el árbol completo (Server Components + pre-render de Client Components). No hay shell vacío ni “Loading…” por Suspense.
- **Home** (`/en/`, etc.): HeroSection, GlobalGuideSection, CitySelector, etc. están en el HTML inicial; el h1 y el contenido del hero están en ese HTML.
- **Ciudad** (`/en/new-york/`, etc.):
  - `<h1 className="sr-only">` con nombre de ciudad y “Valentine's Day 2026”.
  - Sección `sr-only` “Top romantic picks” con Top 3 como `<a href="...">` (título, venue, precio).
  - ValentinesLandingView pre-renderizado con datos (hero, Top 3, categorías, etc.).
  - `<noscript>` con enlaces a planes y a Gifts, Restaurants, Ideas, Last minute para crawlers que no ejecutan JS.

### Enlaces rastreables
- Header y hero usan `<Link>` → `<a href="...">` en el HTML.
- CitySelector y PlanCard usan enlaces reales.
- Sitemap incluye las URLs importantes.

### Estructura y datos
- **StructuredData** (JSON-LD) en home y ciudad para rich results.
- **generateMetadata** en cada página: title, description, canonical, hreflang, Open Graph, Twitter.

---

## 2. Cómo comprobar que es crawleable y visible

1. **Ver código fuente** (Ctrl+U) en producción en `/en/` y `/en/new-york/`: debe verse el contenido (h1, secciones, enlaces, bloque sr-only en ciudad, noscript en ciudad).
2. **GSC – Inspección de URL**: “Ver página indexada” y pestaña “HTML”: comprobar que el HTML que Google tiene incluye texto y enlaces.
3. **Prueba sin JS**: abrir la página con JS desactivado; en ciudad debe verse el bloque `<noscript>` con enlaces (los crawlers que no ejecutan JS también reciben ese HTML).

La captura de GSC puede seguir mostrando solo hero + fondo en la primera vista; eso es **solo la imagen**. Lo importante para crawlabilidad es que el **HTML** que reciben los bots contenga el contenido; con static export y los bloques sr-only/noscript, así es.

---

## 3. Resumen

| Requisito              | Estado |
|------------------------|--------|
| UX/UI y contenido igual | Sí (hero 100dvh, sin banners) |
| Google puede rastrear   | Sí (robots allow, sitemap, HTML completo) |
| IAs pueden rastrear    | Sí (robots allow para GPTBot, etc.) |
| Contenido en el HTML   | Sí (static export + sr-only + noscript) |
| Enlaces en el HTML     | Sí (Link, sr-only Top 3, noscript) |

No hace falta cambiar layout ni diseño para que el sitio sea crawleable y visible para Google y las IAs; la configuración actual ya lo garantiza.
