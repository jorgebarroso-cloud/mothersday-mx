'use client';

import { Heart, Gift, Sparkles, UtensilsCrossed, Music, MapPin, Wine, Sunset, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CityInfoSectionProps {
  city: string;
}

// Map city names to slugs for translation keys
const citySlugMap: Record<string, string> = {
  'Madrid': 'madrid',
  'Barcelona': 'barcelona',
  'Valencia': 'valencia',
  'London': 'london',
  'Paris': 'paris',
  'Lyon': 'lyon',
  'New York': 'new-york',
  'Los Angeles': 'los-angeles',
  'Chicago': 'chicago',
  'Miami': 'miami',
  'San Francisco': 'san-francisco',
  'Washington DC': 'washington-dc',
  'San Diego': 'san-diego',
  'Atlanta': 'atlanta',
  'Austin': 'austin',
  'Lisboa': 'lisbon',
  'São Paulo': 'sao-paulo',
  'Mexico City': 'mexico-city',
  'Berlin': 'berlin',
  'Hamburg': 'hamburg',
  'Vienna': 'vienna',
  'Dublin': 'dublin',
  'Sydney': 'sydney',
  'Melbourne': 'melbourne',
  'Brisbane': 'brisbane',
  'Toronto': 'toronto',
  'Buenos Aires': 'buenos-aires',
  'Montréal': 'montreal',
  'München': 'munchen',
  'Roma': 'roma',
  'Milano': 'milano',
};

// Icon mapping for reasons (consistent across cities)
const reasonIcons = [
  <Heart className="w-6 h-6" key="heart" />,
  <UtensilsCrossed className="w-6 h-6" key="utensils" />,
  <Music className="w-6 h-6" key="music" />,
  <Sunset className="w-6 h-6" key="sunset" />,
  <Sparkles className="w-6 h-6" key="sparkles" />,
  <MapPin className="w-6 h-6" key="mappin" />,
  <Star className="w-6 h-6" key="star" />,
  <Wine className="w-6 h-6" key="wine" />,
  <Gift className="w-6 h-6" key="gift" />
];

export function CityInfoSection({ city }: CityInfoSectionProps) {
  const t = useTranslations('CityInfo');
  
  // Get city slug for translation key
  const citySlug = citySlugMap[city] || city.toLowerCase().replace(/\s+/g, '-');
  
  // Try to get city-specific content, fallback to generic
  let cityKey = citySlug;
  let cityData;
  
  try {
    cityData = t.raw(cityKey);
  } catch (e) {
    // City not found, use fallback
    cityKey = 'fallback';
    cityData = t.raw('fallback');
  }
  
  // If city data doesn't exist or is incomplete, use fallback
  if (!cityData || !cityData.title || !cityData.intro || !cityData.reasons) {
    cityKey = 'fallback';
    cityData = t.raw('fallback');
  }
  
  interface ReasonData {
    title: string;
    description: string;
  }

  const info = {
    title: cityKey === 'fallback' ? cityData.title.replace('{city}', city) : cityData.title,
    intro: cityKey === 'fallback' ? cityData.intro.replace(/{city}/g, city) : cityData.intro,
    reasons: (cityData.reasons as ReasonData[]).map((reason: ReasonData, index: number) => ({
      icon: reasonIcons[index % reasonIcons.length],
      title: cityKey === 'fallback' ? reason.title.replace('{city}', city) : reason.title,
      description: cityKey === 'fallback' ? reason.description.replace(/{city}/g, city) : reason.description
    }))
  };

  return (
    <div className="relative z-20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-4">
              {info.title}
            </h2>
            <p className="text-pink-100 text-sm md:text-base max-w-3xl mx-auto mb-4 leading-relaxed">
              {info.intro}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent mx-auto"></div>
          </div>

          {/* Reasons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {info.reasons.map((reason, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white shadow-lg">
                    {reason.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {reason.title}
                    </h3>
                    <p className="text-pink-100 text-xs leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative elements */}
          <div className="absolute top-8 right-8 w-16 h-16 text-white/20 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
          </div>
          <div className="absolute bottom-8 left-8 w-12 h-12 text-white/15 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 85 L20 55 C5 40 5 20 25 20 C35 20 45 30 50 40 C55 30 65 20 75 20 C95 20 95 40 80 55 Z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
