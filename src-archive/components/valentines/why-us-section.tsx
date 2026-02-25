'use client';

import { Sparkles, Clock, Star, Gift, Heart, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function WhyUsSection() {
  const t = useTranslations('WhyUs');
  
  const features = t.raw('features') as Array<{
    title: string;
    description: string;
  }>;
  
  const staticFeatures = [
    { icon: <Heart className="w-6 h-6" /> },
    { icon: <Clock className="w-6 h-6" /> },
    { icon: <Star className="w-6 h-6" /> },
    { icon: <Gift className="w-6 h-6" /> },
    { icon: <Sparkles className="w-6 h-6" /> },
    { icon: <Globe className="w-6 h-6" /> }
  ];

  return (
    <section 
      className="relative z-20 py-16 bg-gradient-to-b from-white via-pink-50/30 to-white"
      itemScope 
      itemType="https://schema.org/Service"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title with SEO optimization */}
          <div className="text-center mb-12">
            <h2 
              className="text-[#FF1493]"
              itemProp="name"
            >
              {t('title')}
            </h2>
            <p className="text-lg max-w-4xl mx-auto mb-4">
              {t('description1')}
            </p>
            <p className="max-w-3xl mx-auto">
              {t('description2')}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent mx-auto mt-6"></div>
          </div>

          {/* Features Grid - 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <article
                key={index}
                className="group text-center bg-white rounded-2xl p-8 border-2 border-pink-100 hover:border-[#FF1493] hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                itemScope
                itemType="https://schema.org/Service"
              >
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF1493] to-[#FF6B9D] flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {staticFeatures[index].icon}
                  </div>
                </div>

                {/* Content */}
                <h3 
                  className="mb-4 group-hover:text-[#FF1493] transition-colors"
                  itemProp="name"
                >
                  {feature.title}
                </h3>
                <p 
                  className="mb-4"
                  itemProp="description"
                >
                  {feature.description}
                </p>
              </article>
            ))}
          </div>

          {/* Additional SEO-rich content - Refined with modern UI/UX */}
          <div className="mt-16 text-center">
            <div className="relative group bg-gradient-to-br from-white via-pink-50/50 to-white rounded-3xl p-10 md:p-12 border-2 border-pink-200/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(255,20,147,0.15)] hover:border-[#FF1493] transition-all duration-500 overflow-hidden">
              {/* Decorative gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF1493]/5 via-transparent to-[#FF6B9D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="mb-6 text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF1493] via-[#FF6B9D] to-[#FF1493] bg-clip-text text-transparent drop-shadow-sm">
                  {t('trustedSource.title')}
                </h3>
                
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#FF1493] to-transparent mx-auto mb-8"></div>
                
                <p className="text-lg md:text-xl max-w-4xl mx-auto mb-6 leading-relaxed text-gray-800">
                  {t('trustedSource.paragraph1')}
                </p>
                
                <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-gray-700">
                  {t('trustedSource.paragraph2')}
                </p>
              </div>
              
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#FF1493]/10 to-transparent rounded-br-3xl"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-[#FF6B9D]/10 to-transparent rounded-tl-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
