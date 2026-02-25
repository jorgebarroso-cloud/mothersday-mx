# Verificación de Páginas Temáticas

## Rutas a Verificar

### Estructura de Rutas
- `/en/{city}/gifts/` - Página de regalos
- `/en/{city}/restaurants/` - Página de restaurantes
- `/en/{city}/valentines-day/ideas/` - Página de ideas
- `/en/{city}/valentines-day/last-minute/` - Página de último minuto

### Ciudades (19 ciudades × 6 idiomas × 4 tipos = 456 páginas)
- madrid, barcelona, valencia, london, paris, lyon
- new-york, los-angeles, chicago, miami, san-francisco, washington-dc, san-diego, atlanta, austin
- lisbon, sao-paulo, mexico-city, buenos-aires, montreal
- berlin, hamburg, vienna, dublin
- sydney, melbourne, brisbane, toronto
- munchen, roma, milano

### Idiomas
- en, es, fr, de, it, pt

## Checklist de Verificación

### 1. Verificación de Rutas
- [ ] Todas las rutas de gifts funcionan
- [ ] Todas las rutas de restaurants funcionan
- [ ] Todas las rutas de ideas funcionan
- [ ] Todas las rutas de last-minute funcionan
- [ ] Rutas con diferentes idiomas funcionan
- [ ] Rutas con diferentes ciudades funcionan

### 2. Verificación de Metadata
- [ ] Título de página correcto (50-60 caracteres)
- [ ] Meta descripción correcta (150-160 caracteres)
- [ ] Keywords presentes
- [ ] Open Graph tags correctos
- [ ] Twitter Card tags correctos
- [ ] Canonical URL correcta
- [ ] Hreflang tags presentes

### 3. Verificación de Contenido
- [ ] Hero section se muestra correctamente
- [ ] Breadcrumbs funcionan
- [ ] Contenido introductorio se muestra
- [ ] Secciones específicas por tipo se muestran
- [ ] Grid de planes se muestra
- [ ] Filtros funcionan (precio y fecha)
- [ ] Traducciones correctas en todos los idiomas

### 4. Verificación de Filtros
- [ ] Filtro de precio funciona
- [ ] Filtro de fecha funciona
- [ ] Limpiar filtros funciona
- [ ] Filtros persisten en localStorage
- [ ] Filtros aplican correctamente a los planes

### 5. Verificación de Structured Data
- [ ] JSON-LD presente en el HTML
- [ ] Schema correcto según tipo de página
- [ ] BreadcrumbList presente
- [ ] ItemList presente con planes
- [ ] Schema específico (Product/Restaurant/Event) según tipo

### 6. Verificación de SEO
- [ ] Keywords optimizadas (15-20 por tipo)
- [ ] Títulos optimizados
- [ ] Descripciones optimizadas
- [ ] URLs amigables
- [ ] Sitemap incluye todas las páginas

## URLs de Ejemplo para Probar

### Inglés
- http://localhost:3000/en/madrid/gifts/
- http://localhost:3000/en/madrid/restaurants/
- http://localhost:3000/en/madrid/valentines-day/ideas/
- http://localhost:3000/en/madrid/valentines-day/last-minute/

### Español
- http://localhost:3000/es/madrid/gifts/
- http://localhost:3000/es/madrid/restaurants/
- http://localhost:3000/es/madrid/valentines-day/ideas/
- http://localhost:3000/es/madrid/valentines-day/last-minute/

### Francés
- http://localhost:3000/fr/paris/gifts/
- http://localhost:3000/fr/paris/restaurants/

### Alemán
- http://localhost:3000/de/berlin/gifts/
- http://localhost:3000/de/berlin/restaurants/

## Comandos de Verificación

```bash
# Verificar que el servidor está corriendo
curl http://localhost:3000/en/madrid/gifts/

# Verificar metadata (usar herramientas de desarrollo del navegador)
# Abrir DevTools > Elements > Buscar <head> > Verificar meta tags

# Verificar structured data
# Abrir DevTools > Elements > Buscar <script type="application/ld+json">
```

## Problemas Conocidos a Verificar

1. **Filtro de precio**: Verificar que el rango se calcula correctamente
2. **Filtro de fecha**: Verificar que funciona con planes sin fechas
3. **Traducciones**: Verificar que todas las keys existen en todos los idiomas
4. **Imágenes**: Verificar que las imágenes de skyline se cargan correctamente
5. **Breadcrumbs**: Verificar que los links funcionan correctamente
