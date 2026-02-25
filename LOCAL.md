# Ver el sitio en local

## Cómo ver el sitio en local (rápido)

**Requisito:** Node.js v18+ instalado.

Desde la carpeta del proyecto:

```powershell
npm run local
```

O:

```powershell
npm run dev
```

El servidor usará el **primer puerto libre** entre 3000, 3001 y 3080. En la terminal verás algo como:

```
  Servidor local:  http://localhost:3000
  Ctrl+C para detener
```

Abre esa URL en el navegador. Si 3000 está ocupado, se usará 3001 o 3080 (la terminal indica cuál).

- **Home:** http://localhost:3000 (o el puerto que indique)
- **London:** http://localhost:3000/london/
- **Otra ciudad:** http://localhost:3000/manchester/ , http://localhost:3000/birmingham/ , etc.

Para detener: **Ctrl+C** en la terminal.

---

## Dónde está todo el contenido

| Qué | Dónde |
|-----|--------|
| **Home** | `index.html` (raíz del proyecto) |
| **City pages** | `london/index.html`, `manchester/index.html`, `birmingham/index.html`, etc. |
| **Subpáginas por ciudad** | `london/ideas/index.html`, `london/experiences/index.html`, `london/events/index.html`, `london/candlelight/index.html` (y lo mismo para cada ciudad) |
| **Estilos** | `css/` (bundle.min.css es el que carga el sitio) |
| **Scripts** | `js/` (main.min.js, glide.min.js) |
| **Imágenes** | `images/` (hero-uk.png, london.png, logo.svg, etc.) |
| **Legal** | `legal/cookies.html` |
| **404** | `404.html` |

Ciudades: **london**, **manchester**, **birmingham**, **liverpool**, **leeds**, **bristol**, **brighton**, **edinburgh**.

---

## Alternativa: npx serve

Si prefieres usar el paquete `serve`:

```powershell
npx serve . -p 3000
```

Si el puerto 3000 está en uso: `npx serve . -p 3001`

---

## Importante

- **No abras** `index.html` con doble clic (protocolo `file://`). Las rutas como `/london/` no funcionan; hace falta un servidor.
- Si cambias CSS o JS, regenera el bundle: `.\scripts\build-static.ps1` y recarga la página.
