'use client';

import Link from 'next/link';
import { Gift, UtensilsCrossed, Heart, Sparkles } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface ValentinesIdeasSectionProps {
  city: string;
  lang: string;
}

export function ValentinesIdeasSection({ city, lang }: ValentinesIdeasSectionProps) {
  const t = useTranslations('ValentinesIdeas');
  const locale = useLocale();
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  
  const ideasRaw = t.raw('ideas') as Array<{
    title: string;
    description: string;
  }>;

  // Replace {city} placeholder with actual city name in descriptions
  const ideas = ideasRaw.map(idea => ({
    ...idea,
    description: idea.description.replace(/{city}/g, city)
  }));

  const icons = [
    <Gift className="w-6 h-6" key="gift" />,
    <UtensilsCrossed className="w-6 h-6" key="utensils" />,
    <Heart className="w-6 h-6" key="heart" />,
    <Sparkles className="w-6 h-6" key="sparkles" />
  ];

  const links = [
    `/${locale}/${citySlug}/gifts`,
    `/${locale}/${citySlug}/restaurants`,
    `/${locale}/${citySlug}/valentines-day/ideas`,
    `/${locale}/${citySlug}/valentines-day/last-minute`
  ];

  return (
    <div className="relative z-20 py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('title', { city })}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          {/* Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ideas.map((idea, index) => (
              <Link
                key={index}
                href={links[index]}
                className="group bg-gradient-to-br from-pink-50 to-white rounded-xl p-6 border border-pink-100 hover:border-pink-300 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                    {icons[index]}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                    {idea.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {idea.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
