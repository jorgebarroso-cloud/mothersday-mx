# 📋 Auditoría de Traducciones - FASE 1: Homepage & Global Components

## Texto Hardcodeado Encontrado

### 1. **TestimonialsSection** (`src/components/valentines/testimonials-section.tsx`)

**Textos a extraer:**
- Título: "What Our Couples Say"
- Subtítulo: "Real experiences from couples who made their Valentine's Day unforgettable"
- 3 testimonios completos con:
  - Texto del testimonio
  - Autor
  - Ubicación

**Keys propuestas:**
```json
"Testimonials": {
  "title": "What Our Couples Say",
  "subtitle": "Real experiences from couples who made their Valentine's Day unforgettable",
  "items": [
    {
      "text": "The best dinner in Rome! The restaurant was perfect, the food incredible, and the atmosphere was exactly what we needed for our Valentine's Day. Highly recommend!",
      "author": "Sofia & Marc",
      "location": "Rome, Italy"
    },
    {
      "text": "Unforgettable night in NYC! We booked a romantic rooftop dinner and it exceeded all expectations. The view was breathtaking and the service was impeccable.",
      "author": "Alex",
      "location": "New York, USA"
    },
    {
      "text": "Made our Valentine's Day in Paris absolutely magical! The candlelight dinner cruise was romantic beyond words. Every detail was perfect, from the food to the ambiance.",
      "author": "Emma & James",
      "location": "Paris, France"
    }
  ]
}
```

---

### 2. **WhyCelebrateSection** (`src/components/valentines/why-celebrate-section.tsx`)

**Textos a extraer:**
- Título: "Why Celebrate Valentine's Day as a Couple?"
- Descripción: "Valentine's Day is a special opportunity to celebrate your love, create lasting memories, and strengthen your bond with romantic experiences and meaningful Valentine's Day gifts."
- 4 razones con iconos:
  1. "Strengthen Your Bond" + descripción
  2. "Create Lasting Memories" + descripción
  3. "Express Your Love" + descripción
  4. "Reconnect & Rekindle" + descripción
- CTA: "Find Your Perfect City"

**Keys propuestas:**
```json
"WhyCelebrate": {
  "title": "Why Celebrate Valentine's Day as a Couple?",
  "description": "Valentine's Day is a special opportunity to celebrate your love, create lasting memories, and strengthen your bond with romantic experiences and meaningful Valentine's Day gifts.",
  "reasons": [
    {
      "title": "Strengthen Your Bond",
      "description": "Celebrating Valentine's Day together creates unforgettable romantic experiences that deepen your connection. It's the perfect opportunity to show your partner how much they mean to you with thoughtful Valentine's Day gifts and romantic moments."
    },
    {
      "title": "Create Lasting Memories",
      "description": "From intimate Candlelight concerts to romantic restaurants, Valentine's Day experiences become cherished memories. These romantic Valentine's ideas help you celebrate love in unique ways that you'll remember forever."
    },
    {
      "title": "Express Your Love",
      "description": "Valentine's Day gifts for her and gifts for him are more than presents—they're expressions of love. Whether it's personalized Valentine's gifts or last-minute Valentine's Day gifts, each one shows you care."
    },
    {
      "title": "Reconnect & Rekindle",
      "description": "In our busy lives, Valentine's Day offers a dedicated time to reconnect. Romantic experiences and date ideas help couples rekindle their romance and celebrate their relationship with meaningful Valentine's Day ideas."
    }
  ],
  "cta": "Find Your Perfect City"
}
```

---

### 3. **WhyUsSection** (`src/components/valentines/why-us-section.tsx`)

**Textos a extraer:**
- Título: "Why Choose Us for Your Valentine's Day 2026 Plans"
- Descripción 1: "Discover the best Valentine's Day gifts, romantic experiences, and unforgettable date ideas. From intimate Candlelight concerts to romantic restaurants, we help couples create perfect Valentine's Day moments."
- Descripción 2: "Trusted by thousands of couples for curated romantic experiences, last-minute Valentine's Day gifts, and unique date ideas in cities worldwide."
- 6 features:
  1. "Curated Valentine's Day Experiences" + descripción
  2. "Instant Booking for Last-Minute Plans" + descripción
  3. "Verified Reviews from Real Couples" + descripción
  4. "Unique Valentine's Day Gifts & Ideas" + descripción
  5. "Romantic Experiences in Top Cities" + descripción
  6. "Global Guide to Valentine's Day 2026" + descripción
- Sección final:
  - Título: "Your Trusted Source for Valentine's Day 2026"
  - 2 párrafos largos con keywords embebidos

**Keys propuestas:**
```json
"WhyUs": {
  "title": "Why Choose Us for Your Valentine's Day 2026 Plans",
  "description1": "Discover the best Valentine's Day gifts, romantic experiences, and unforgettable date ideas. From intimate Candlelight concerts to romantic restaurants, we help couples create perfect Valentine's Day moments.",
  "description2": "Trusted by thousands of couples for curated romantic experiences, last-minute Valentine's Day gifts, and unique date ideas in cities worldwide.",
  "features": [
    {
      "title": "Curated Valentine's Day Experiences",
      "description": "Discover handpicked romantic experiences, from intimate Candlelight concerts to exclusive romantic restaurants. We select only the best Valentine's Day gifts and date ideas to create unforgettable romantic moments for couples."
    },
    {
      "title": "Instant Booking for Last-Minute Plans",
      "description": "Forgot to plan ahead? No problem. Book romantic experiences, Valentine's Day gifts, and romantic dinners instantly. Perfect for last-minute Valentine's Day gifts and spontaneous romantic date ideas."
    },
    {
      "title": "Verified Reviews from Real Couples",
      "description": "Every romantic experience is verified and reviewed by couples who've celebrated Valentine's Day with us. Find trusted recommendations for Valentine's Day gifts for her, gifts for him, and the best romantic experiences."
    },
    {
      "title": "Unique Valentine's Day Gifts & Ideas",
      "description": "From personalized Valentine's gifts to romantic getaways, discover unique Valentine's Day gift ideas for every couple. Whether you're looking for gifts for her, gifts for him, or experiences for both."
    },
    {
      "title": "Romantic Experiences in Top Cities",
      "description": "Explore the best romantic restaurants, Candlelight concerts, and Valentine's Day experiences in major cities worldwide. From romantic dinners to intimate concerts, find perfect date ideas in your city."
    },
    {
      "title": "Global Guide to Valentine's Day 2026",
      "description": "Your comprehensive guide to celebrating Valentine's Day 2026. Discover romantic experiences, Valentine's Day gifts, romantic restaurants, and unforgettable date ideas in cities around the world."
    }
  ],
  "trustedSource": {
    "title": "Your Trusted Source for Valentine's Day 2026",
    "paragraph1": "Whether you're searching for **Valentine's Day gifts for her**, **gifts for him**, or **romantic experiences for couples**, we've curated the best selection of **romantic restaurants**, **Candlelight concerts**, and **unique date ideas**. Perfect for **last-minute Valentine's Day gifts** or planning ahead for **Valentine's Day 2026**.",
    "paragraph2": "Join thousands of couples who trust us for their **romantic Valentine's Day plans**, from intimate dinners to unforgettable **romantic getaways** and **couple activities**."
  }
}
```

---

### 4. **Footer** (`src/components/layout/footer.tsx`)

**Textos a extraer (actualmente con condicionales lang === 'es' ? ...):**
- Brand: "Celebrate Valentine's"
- Descripción del brand (ya existe en Footer.description)
- "Made with love"
- "Popular Cities"
- "All Cities"
- "Resources"
- "Home"
- "Contact"
- "Legal"
- "Terms of Service"
- "Privacy Policy"
- "Cookie Policy"
- Copyright: "All rights reserved."
- "Website:"

**Keys propuestas:**
```json
"Footer": {
  "brand": "Celebrate Valentine's",
  "madeWithLove": "Made with love",
  "popularCities": "Popular Cities",
  "allCities": "All Cities",
  "resources": "Resources",
  "home": "Home",
  "contact": "Contact",
  "legal": "Legal",
  "termsOfService": "Terms of Service",
  "privacyPolicy": "Privacy Policy",
  "cookiePolicy": "Cookie Policy",
  "allRightsReserved": "All rights reserved.",
  "website": "Website:",
  "valentinesDayIn": "Valentine's Day in"
}
```

---

### 5. **Error Messages** (varios archivos)

**Textos a extraer:**
- "Error Loading Page"
- "Please try again later"

**Keys propuestas:**
```json
"Common": {
  "errorLoadingPage": "Error Loading Page",
  "pleaseTryAgainLater": "Please try again later"
}
```

---

### 6. **PlanCard** (`src/components/valentines/plan-card.tsx`)

**Textos a extraer:**
- "Get Tickets →"

**Keys propuestas:**
```json
"PlanCard": {
  "getTickets": "Get Tickets →"
}
```

---

### 7. **Price Format** (`src/lib/valentines/service.ts`)

**Textos a extraer:**
- Formato: "From ${price}" o "From €{price}"

**Keys propuestas:**
```json
"Price": {
  "from": "From"
}
```

---

## Resumen de Archivos a Modificar

1. ✅ `src/messages/en.json` - Agregar todas las nuevas keys
2. ✅ `src/components/valentines/testimonials-section.tsx` - Usar useTranslations
3. ✅ `src/components/valentines/why-celebrate-section.tsx` - Usar useTranslations
4. ✅ `src/components/valentines/why-us-section.tsx` - Usar useTranslations
5. ✅ `src/components/layout/footer.tsx` - Reemplazar condicionales con useTranslations
6. ✅ `src/app/[locale]/page.tsx` - Usar traducciones para errores
7. ✅ `src/app/[locale]/[city]/page.tsx` - Usar traducciones para errores
8. ✅ `src/components/valentines/plan-card.tsx` - Usar traducciones
9. ✅ `src/lib/valentines/service.ts` - Usar traducciones para formato de precio (requiere refactor)

---

## Próximos Pasos

1. Actualizar `en.json` con todas las keys
2. Reemplazar texto hardcodeado en componentes
3. Generar traducciones para ES, FR, DE, IT, PT
4. Probar que todo funciona correctamente
