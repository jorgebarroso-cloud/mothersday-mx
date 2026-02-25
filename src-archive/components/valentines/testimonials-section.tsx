'use client';

import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function TestimonialsSection() {
  const t = useTranslations('Testimonials');
  
  const testimonials = t.raw('items') as Array<{
    text: string;
    author: string;
    location: string;
  }>;

  return (
    <section className="relative z-20 py-16 bg-gradient-to-b from-white to-pink-50/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-[#FF1493]">
              {t('title')}
            </h2>
            <p className="max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-pink-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {/* Stars Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="mb-6 italic">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="border-t border-pink-100 pt-4">
                  <p className="font-semibold text-gray-800 text-base">
                    {testimonial.author}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
