# 📋 Auditoría de Traducciones - FASE 2: Páginas de Ciudades

## Texto Hardcodeado Encontrado

### 1. **DateFilter** (`src/components/valentines/date-filter.tsx`)

**Textos a extraer:**
- "Clear" (botón)
- "Apply" (botón)
- Nombres de meses: "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
- Días de la semana: "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"

**Keys propuestas:**
```json
"DateFilter": {
  "selectDates": "Select dates",
  "clear": "Clear",
  "apply": "Apply",
  "months": {
    "january": "January",
    "february": "February",
    "march": "March",
    "april": "April",
    "may": "May",
    "june": "June",
    "july": "July",
    "august": "August",
    "september": "September",
    "october": "October",
    "november": "November",
    "december": "December"
  },
  "weekdays": {
    "sunday": "Su",
    "monday": "Mo",
    "tuesday": "Tu",
    "wednesday": "We",
    "thursday": "Th",
    "friday": "Fr",
    "saturday": "Sa"
  }
}
```

---

### 2. **CategoryNav** (`src/components/valentines/category-nav.tsx`)

**Textos a extraer:**
- "Under" (en formatPriceLabel)

**Keys propuestas:**
```json
"Price": {
  "from": "From",
  "under": "Under"
}
```

---

### 3. **ValentinesIdeasSection** (`src/components/valentines/valentines-ideas-section.tsx`)

**Textos a extraer:**
- Título: "Valentine's Day Ideas in {city}"
- Subtítulo: "Explore the best options to celebrate Valentine's Day"
- 4 ideas con títulos y descripciones (actualmente con condicionales lang === 'es' ? ...)

**Keys propuestas:**
```json
"ValentinesIdeas": {
  "title": "Valentine's Day Ideas in {city}",
  "subtitle": "Explore the best options to celebrate Valentine's Day",
  "ideas": [
    {
      "title": "Valentine's Day Gifts",
      "description": "Find the best Valentine's Day gifts in {city}"
    },
    {
      "title": "Romantic Restaurants",
      "description": "Discover the best romantic restaurants for Valentine's Day in {city}"
    },
    {
      "title": "Romantic Valentine's Ideas",
      "description": "Unique and romantic ideas to celebrate Valentine's Day in {city}"
    },
    {
      "title": "Last-Minute Plans",
      "description": "Perfect last-minute plans for Valentine's Day in {city}"
    }
  ]
}
```

---

### 4. **CityInfoSection** (`src/components/valentines/city-info-section.tsx`)

**Textos a extraer:**
- Este componente tiene contenido específico por ciudad hardcodeado
- Títulos, intros y razones para cada ciudad
- **Nota**: Este contenido es muy extenso y específico. Podría requerir un enfoque diferente (archivos separados por ciudad o mantenerlo en inglés si es contenido único por ciudad)

**Keys propuestas (estructura genérica):**
```json
"CityInfo": {
  "titleTemplate": "Why {city} is Perfect for Celebrating Valentine's Day",
  "introTemplate": "{city} offers the perfect blend of romantic experiences, unique Valentine's Day gifts, and unforgettable date ideas.",
  "reasons": {
    "romanticSpots": {
      "title": "Romantic Parks & Iconic Spots",
      "descriptionTemplate": "Discover romantic settings perfect for Valentine's Day in {city}"
    },
    "restaurants": {
      "title": "World-Class Romantic Restaurants",
      "descriptionTemplate": "From fine dining to intimate venues, {city} offers romantic restaurants for every couple"
    },
    "culture": {
      "title": "Cultural Experiences & Candlelight",
      "descriptionTemplate": "Intimate Candlelight concerts and cultural experiences make {city} ideal for romantic Valentine's ideas"
    }
  }
}
```

**Alternativa**: Mantener CityInfoSection con contenido hardcodeado si es específico por ciudad y no se repite.

---

## Resumen de Archivos a Modificar

1. ✅ `src/messages/en.json` - Agregar nuevas keys para DateFilter, Price, ValentinesIdeas
2. ✅ `src/components/valentines/date-filter.tsx` - Usar useTranslations
3. ✅ `src/components/valentines/category-nav.tsx` - Usar traducciones para "Under"
4. ✅ `src/components/valentines/valentines-ideas-section.tsx` - Reemplazar condicionales con useTranslations
5. ✅ Generar traducciones para ES, FR, DE, IT, PT

---

## Notas Importantes

- **CityInfoSection**: El contenido es muy específico por ciudad. Podríamos mantenerlo hardcodeado o crear un sistema de contenido dinámico. Por ahora, lo dejaremos como está si es contenido único.

- **Nombres de meses y días**: Necesitan traducción completa para cada idioma.

- **ValentinesIdeasSection**: Actualmente usa condicionales lang === 'es' ? ... que deben reemplazarse con useTranslations.
