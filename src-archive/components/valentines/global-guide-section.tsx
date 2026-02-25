'use client';

import { MapPin, Heart } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export function GlobalGuideSection() {
  const t = useTranslations('GlobalGuide');
  const locale = useLocale();

  return (
    <section className="relative z-20 py-16 bg-gradient-to-b from-white via-pink-50/30 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Two Column Layout */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-pink-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Image (50%) */}
              <div className="relative h-64 lg:h-auto min-h-[400px] bg-gradient-to-br from-pink-100 via-red-50 to-pink-200 overflow-hidden">
                {/* Decorative hearts pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-10 left-10 w-16 h-16">
                    <Heart className="w-full h-full text-pink-400" fill="currentColor" />
                  </div>
                  <div className="absolute top-32 right-16 w-12 h-12">
                    <Heart className="w-full h-full text-red-300" fill="currentColor" />
                  </div>
                  <div className="absolute bottom-20 left-20 w-14 h-14">
                    <Heart className="w-full h-full text-pink-300" fill="currentColor" />
                  </div>
                  <div className="absolute bottom-32 right-10 w-10 h-10">
                    <Heart className="w-full h-full text-red-200" fill="currentColor" />
                  </div>
                </div>
                
                {/* Main visual element - Globe with hearts */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Globe circle */}
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-pink-200 to-red-200 border-4 border-white shadow-2xl flex items-center justify-center">
                      {/* Heart pin icon */}
                      <div className="relative">
                        <MapPin className="w-16 h-16 md:w-20 md:h-20 text-[#FF1493]" strokeWidth={2.5} />
                        <Heart className="w-8 h-8 md:w-10 md:h-10 text-[#FF1493] absolute -top-2 -right-2" fill="currentColor" />
                      </div>
                    </div>
                    {/* Floating hearts around globe */}
                    <div className="absolute -top-4 -left-4 w-6 h-6">
                      <Heart className="w-full h-full text-pink-400" fill="currentColor" />
                    </div>
                    <div className="absolute -top-2 -right-6 w-5 h-5">
                      <Heart className="w-full h-full text-red-300" fill="currentColor" />
                    </div>
                    <div className="absolute -bottom-4 -left-2 w-7 h-7">
                      <Heart className="w-full h-full text-pink-300" fill="currentColor" />
                    </div>
                    <div className="absolute -bottom-2 -right-4 w-6 h-6">
                      <Heart className="w-full h-full text-red-200" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Content (50%) */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                {/* Icon and Title */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#FF1493] to-[#FF6B9D] mb-4 shadow-lg">
                    {/* Custom heart pin icon */}
                    <div className="relative">
                      <MapPin className="w-7 h-7 text-white" strokeWidth={2.5} />
                      <Heart className="w-4 h-4 text-white absolute -top-1 -right-1" fill="currentColor" />
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#FF1493] mb-4">
                    {t('title')}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="space-y-4 text-gray-700 leading-relaxed mb-8">
                  <p className="text-lg md:text-xl text-gray-800 font-medium">
                    {t('description1')}
                  </p>
                  
                  <p className="text-base md:text-lg text-gray-600">
                    {t('description2')}
                  </p>
                </div>

                {/* Single CTA Button */}
                <div className="mt-6">
                  <Link
                    href="#city-selector"
                    className="inline-block text-center w-full bg-gradient-to-r from-[#FF1493] to-[#FF6B9D] text-white font-bold text-base md:text-lg px-8 py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    {t('cta')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
