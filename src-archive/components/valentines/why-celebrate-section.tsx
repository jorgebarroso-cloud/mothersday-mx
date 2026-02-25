'use client';

import { Heart, Sparkles, Gift, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function WhyCelebrateSection() {
  const t = useTranslations('WhyCelebrate');
  
  const reasons = t.raw('reasons') as Array<{
    title: string;
    description: string;
  }>;

  const icons = [
    <Heart className="w-6 h-6" key="heart" />,
    <Sparkles className="w-6 h-6" key="sparkles" />,
    <Gift className="w-6 h-6" key="gift" />,
    <Users className="w-6 h-6" key="users" />
  ];

  return (
    <div className="relative z-20 py-8 bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-[#FF1493]">
              {t('title')}
            </h2>
            <p className="max-w-3xl mx-auto">
              {t('description')}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent mx-auto mt-3"></div>
          </div>

          {/* Reasons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border-2 border-pink-100 hover:border-[#FF1493] hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#FF1493] to-[#FF6B9D] flex items-center justify-center text-white shadow-lg">
                    {icons[index]}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2">
                      {reason.title}
                    </h3>
                    <p className="text-sm">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-6 text-center">
            <a
              href="#city-selector"
              className="inline-block bg-gradient-to-r from-[#FF1493] to-[#FF6B9D] text-white font-bold text-base px-6 py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {t('cta')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
