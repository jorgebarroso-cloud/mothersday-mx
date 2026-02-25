/**
 * Mother's Day Landing Page — React reference implementation
 * Use with: React (Next.js or Vite), Tailwind CSS, Lucide React
 *
 * Sub-components: HeroSection, ValuePropsGrid, CityQuickLinks, Testimonials, SEOFooter
 */

import React, { useState, useMemo } from 'react';
import { MapPin, UtensilsCrossed, Music, Gift, Calendar } from 'lucide-react';

// ——— Data ———
const CITIES = [
  { slug: 'london', name: 'London' },
  { slug: 'manchester', name: 'Manchester' },
  { slug: 'birmingham', name: 'Birmingham' },
  { slug: 'liverpool', name: 'Liverpool' },
  { slug: 'leeds', name: 'Leeds' },
  { slug: 'bristol', name: 'Bristol' },
  { slug: 'brighton', name: 'Brighton' },
  { slug: 'edinburgh', name: 'Edinburgh' },
];

const VALUE_CARDS = [
  {
    id: 'dining',
    title: 'Afternoon Tea & Dining',
    description: 'Treat her to a special meal or classic afternoon tea.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop',
    href: '#cities',
    icon: UtensilsCrossed,
  },
  {
    id: 'experiences',
    title: 'Workshops & Concerts',
    description: 'Candlelight, live music and creative workshops.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba16ba1acbe?w=800&h=600&fit=crop',
    href: '#cities',
    icon: Music,
  },
  {
    id: 'gifting',
    title: 'Curated Gifts',
    description: "Experience gifts and presents she'll remember.",
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop',
    href: '#cities',
    icon: Gift,
  },
  {
    id: 'events',
    title: "What's On Nearby",
    description: 'Events and agendas in your city.',
    image: '/images/london.png',
    href: '#cities',
    icon: Calendar,
  },
];

const TESTIMONIALS = [
  {
    text: "I booked afternoon tea for Mum in London — she loved it. Dead easy to book and just right for Mother's Day.",
    author: 'Sarah, London',
    stars: 5,
  },
  {
    text: "The Candlelight concert went down a treat as a Mother's Day gift. Would definitely recommend if you're after ideas in Manchester.",
    author: 'James, Manchester',
    stars: 5,
  },
];

const SEO_CONTENT = (
  <>
    <p>
      <strong>Mother's Day UK</strong> (Mothering Sunday 2026: 22 March) is the perfect time to treat Mum. Whether you're looking for <strong>mothers day ideas</strong>, <strong>mothers day gifts</strong> or <strong>things to do for Mother's Day</strong>, we've got <strong>Mother's Day experiences</strong> and <strong>gift ideas for Mother's Day</strong> in <a href="/london/">Mother's Day London</a>, <a href="/manchester/">Mother's Day Manchester</a> and <a href="/birmingham/">Mother's Day Birmingham</a>. <a href="#cities">Pick your city</a> and book ahead.
    </p>
    <p>
      <strong>Things to do for Mother's Day</strong> include afternoon tea, <strong>Candlelight Mother's Day</strong> concerts, workshops and <strong>Mother's Day events</strong>. Our <strong>Mother's Day plans</strong> and <strong>experience gifts</strong> are bookable on Fever — from <a href="/london/experiences/">Mother's Day experiences London</a> to <a href="/manchester/ideas/">Mother's Day gift ideas Manchester</a> and <a href="/birmingham/events/">Mother's Day events Birmingham</a>.
    </p>
  </>
);

// ——— 1. HeroSection (with city dropdown) ———
function HeroSection() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <img
        src="/images/hero-uk.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/75" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-2xl mx-auto py-16">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-shadow">
          Mother's Day UK: Make Her Day Unforgettable
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-white/95">
          Discover unique experiences, gifts, and dining in your city.
        </p>

        {/* City selector */}
        <div className="mt-8 max-w-xs mx-auto relative">
          <label htmlFor="city-search" className="block text-left text-sm font-semibold mb-2 text-white/95">
            Where are you?
          </label>
          <input
            id="city-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            placeholder="e.g. Manchester, Leeds"
            className="w-full px-4 py-3 rounded-2xl border-2 border-white/50 bg-white/95 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-white focus:ring-4 focus:ring-emerald-500/30"
            aria-autocomplete="list"
            aria-expanded={isOpen}
          />
          {isOpen && matches.length > 0 && (
            <ul
              className="absolute top-full left-0 right-0 mt-1 py-2 bg-white rounded-xl shadow-xl max-h-64 overflow-y-auto z-20"
              role="listbox"
            >
              {matches.map((city) => (
                <li key={city.slug}>
                  <a
                    href={`/${city.slug}/`}
                    className="block px-4 py-3 text-gray-800 hover:bg-gray-100 transition"
                    role="option"
                  >
                    {city.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="mt-4 text-sm font-semibold text-white/90">
          London, Manchester, Birmingham & more
        </p>
      </div>
    </section>
  );
}

// ——— 2. ValuePropsGrid (4 image-first cards) ———
function ValuePropsGrid() {
  return (
    <section className="py-16 sm:py-24 bg-[#FDF8F6]" aria-labelledby="value-props-heading">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 id="value-props-heading" className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 border-b-4 border-emerald-200 pb-2 inline-block">
          Inspiration for every Mum
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          Afternoon tea, concerts, gifts and local events — pick your city above to see what's on.
        </p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {VALUE_CARDS.map((card) => (
            <a
              key={card.id}
              href={card.href}
              className="group block bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={card.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition">
                  {card.title}
                </h3>
                <p className="mt-1 text-gray-600 text-sm leading-relaxed">{card.description}</p>
                <span className="mt-3 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-lg">
                  See more
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ——— 3. CityQuickLinks (pills) ———
function CityQuickLinks() {
  return (
    <section id="cities" className="py-16 sm:py-24 bg-gray-50" aria-labelledby="city-pills-heading">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 id="city-pills-heading" className="font-serif text-3xl font-bold text-gray-900">
          Choose your city
        </h2>
        <p className="mt-2 text-gray-600">Quick links to see experiences, dining and events near you.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {CITIES.map((city) => (
            <a
              key={city.slug}
              href={`/${city.slug}/`}
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-full font-semibold text-gray-800 bg-white border border-gray-200 shadow-sm hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-md transition-all"
            >
              {city.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ——— 4. Testimonials (carousel) ———
function Testimonials() {
  const [index, setIndex] = useState(0);
  return (
    <section className="py-16 sm:py-24 bg-gray-100" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 id="testimonials-heading" className="font-serif text-3xl font-bold text-gray-900 mb-8">
          What families say
        </h2>
        <div className="overflow-hidden">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`p-8 bg-white rounded-2xl shadow-md border border-gray-200 ${i === index ? 'block' : 'hidden'}`}
              role="tabpanel"
            >
              <p className="text-amber-500 text-lg tracking-widest mb-3" aria-hidden>★★★★★</p>
              <blockquote className="text-gray-800 italic text-lg">"{t.text}"</blockquote>
              <cite className="mt-3 block text-sm text-gray-500 not-italic">— {t.author}</cite>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition ${i === index ? 'bg-emerald-600' : 'bg-gray-300'}`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ——— 5. SEOFooter (de-emphasized accordion) ———
function SEOFooter() {
  const [open, setOpen] = useState(false);
  return (
    <section className="py-8 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-3xl">
        <details
          className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50"
          open={open}
          onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
        >
          <summary className="px-4 py-3 text-sm font-semibold text-gray-500 cursor-pointer hover:text-emerald-600 list-none">
            More about Mother's Day
          </summary>
          <div className="px-4 py-4 border-t border-gray-200 text-[13px] leading-relaxed text-gray-500 [&_strong]:text-gray-600 [&_a]:text-emerald-600">
            {SEO_CONTENT}
          </div>
        </details>
      </div>
    </section>
  );
}

// ——— LandingPage (main component) ———
export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <ValuePropsGrid />
      <CityQuickLinks />
      {/* Trust block can be inserted here */}
      <Testimonials />
      {/* FAQ section can be inserted here */}
      <SEOFooter />
    </main>
  );
}

export { HeroSection, ValuePropsGrid, CityQuickLinks, Testimonials, SEOFooter };
