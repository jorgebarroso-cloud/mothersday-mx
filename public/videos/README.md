# Videos por Ciudad - Celebrate Valentine's

## Estructura de Videos

Coloca los videos de San Valentín específicos de cada ciudad en esta carpeta con el siguiente formato de nombre:

### Formato de Nombres

```
valentines-[city-slug].mp4
```

### Ejemplos

- `valentines-madrid.mp4` - Video de San Valentín en Madrid
- `valentines-barcelona.mp4` - Video de San Valentín en Barcelona
- `valentines-new-york.mp4` - Video de San Valentín en New York
- `valentines-paris.mp4` - Video de San Valentín en París
- `valentines-london.mp4` - Video de San Valentín en Londres

### Ciudades Soportadas

El sistema buscará automáticamente videos para las siguientes ciudades:

**Español:**
- `valentines-madrid.mp4`
- `valentines-barcelona.mp4`
- `valentines-valencia.mp4`
- `valentines-mexico-city.mp4`

**Inglés:**
- `valentines-london.mp4`
- `valentines-new-york.mp4`
- `valentines-los-angeles.mp4`
- `valentines-chicago.mp4`
- `valentines-miami.mp4`
- `valentines-san-francisco.mp4`
- `valentines-washington-dc.mp4`
- `valentines-san-diego.mp4`
- `valentines-atlanta.mp4`
- `valentines-austin.mp4`
- `valentines-sydney.mp4`
- `valentines-melbourne.mp4`
- `valentines-brisbane.mp4`
- `valentines-dublin.mp4`

**Francés:**
- `valentines-paris.mp4`
- `valentines-lyon.mp4`

**Alemán:**
- `valentines-berlin.mp4`
- `valentines-hamburg.mp4`
- `valentines-vienna.mp4`

**Portugués:**
- `valentines-lisbon.mp4`
- `valentines-sao-paulo.mp4`

### Video por Defecto

Si no existe un video específico para una ciudad, se usará:
- `/Valentines.mp4` (video genérico)

### Especificaciones Recomendadas

- **Formato:** MP4 (H.264)
- **Resolución:** Mínimo 1920x1080 (Full HD)
- **Duración:** 10-30 segundos (loop)
- **Tamaño:** Optimizado para web (< 5MB recomendado)
- **Aspecto:** 16:9 o similar
- **Contenido:** Debe mostrar elementos reconocibles de la ciudad con temática de San Valentín

### Cómo Agregar un Video

1. Obtén o crea el video de San Valentín para la ciudad
2. Nómbralo según el formato: `valentines-[city-slug].mp4`
3. Colócalo en esta carpeta: `/public/videos/`
4. El sistema lo detectará automáticamente

### Notas

- Los videos deben ser reconocibles de la ciudad (monumentos, calles, lugares emblemáticos)
- Deben tener temática romántica/de San Valentín
- Se reproducen en loop automático
- Son silenciosos (muted) por defecto
