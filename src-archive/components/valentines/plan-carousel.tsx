'use client';

import { useState, useRef, useEffect } from 'react';
import { ValentinePlan } from '@/lib/valentines/service';
import { PlanCard } from './plan-card';
import { cn } from '@/lib/utils';

interface PlanCarouselProps {
  plans: ValentinePlan[];
  title: string;
  autoScroll?: boolean;  // Enable auto-scrolling (continuous infinite)
  compact?: boolean;     // Use compact cards
  cardWidth?: number;    // Card width in pixels
  id?: string;           // Section ID for anchors
  candlelight?: boolean; // Dark theme for Candlelight cards
  getTrackedLink?: (link: string, planId?: string) => string; // UTM propagation function (now accepts planId)
  lightTheme?: boolean;  // Light theme with pink text on white background
  showPosition?: boolean; // Show position (1, 2, 3) instead of actual rank
}

export function PlanCarousel({ 
  plans, 
  title, 
  autoScroll = false, 
  compact = false,
  cardWidth = 280,
  id,
  candlelight = false,
  getTrackedLink,
  lightTheme = false,
  showPosition = false
}: PlanCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = cardWidth + 24; // Card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  // For infinite carousel, duplicate plans
  const displayPlans = autoScroll ? [...plans, ...plans, ...plans] : plans;
  const gap = compact ? 16 : 24;
  const totalWidth = plans.length * (cardWidth + gap);

  return (
    <section id={id} className="space-y-4 scroll-mt-24">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className={cn(
            "font-bold pl-4 border-l-4",
            lightTheme 
              ? "text-[#FF1493] border-[#FF1493]/50" 
              : "text-white drop-shadow-lg border-white/50",
            compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
          )}>
            {title}
          </h2>
          
          {/* Navigation arrows - only show for non-auto-scroll */}
          {!autoScroll && (
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={cn(
                  "rounded-full border-2 transition-all",
                  compact ? "p-1.5" : "p-2.5",
                  canScrollLeft 
                    ? lightTheme 
                      ? 'border-[#FF1493]/40 text-[#FF1493] hover:bg-[#FF1493]/10 hover:border-[#FF1493]'
                      : 'border-white/40 text-white hover:bg-white/20 hover:border-white' 
                    : lightTheme
                      ? 'border-[#FF1493]/20 text-[#FF1493]/30 cursor-not-allowed'
                      : 'border-white/20 text-white/30 cursor-not-allowed'
                )}
                aria-label="Scroll left"
              >
                <svg className={compact ? "w-4 h-4" : "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={cn(
                  "rounded-full border-2 transition-all",
                  compact ? "p-1.5" : "p-2.5",
                  canScrollRight 
                    ? lightTheme
                      ? 'border-[#FF1493]/40 text-[#FF1493] hover:bg-[#FF1493]/10 hover:border-[#FF1493]'
                      : 'border-white/40 text-white hover:bg-white/20 hover:border-white' 
                    : lightTheme
                      ? 'border-[#FF1493]/20 text-[#FF1493]/30 cursor-not-allowed'
                      : 'border-white/20 text-white/30 cursor-not-allowed'
                )}
                aria-label="Scroll right"
              >
                <svg className={compact ? "w-4 h-4" : "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Carousel container */}
      {autoScroll ? (
        // Continuous infinite scroll marquee
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={cn(
              "flex",
              compact ? "gap-4" : "gap-6",
              isPaused ? "animate-pause" : ""
            )}
            style={{
              animation: `marquee ${plans.length * 5}s linear infinite`,
              animationPlayState: isPaused ? 'paused' : 'running',
              width: 'fit-content'
            }}
          >
            {displayPlans.map((plan, index) => (
              <div 
                key={`${plan.id}-${index}`} 
                className="flex-shrink-0"
                style={{ width: cardWidth }}
              >
                <PlanCard 
                  plan={plan} 
                  compact={compact} 
                  featured={autoScroll} 
                  candlelight={candlelight} 
                  getTrackedLink={getTrackedLink}
                  position={showPosition ? (index % plans.length) + 1 : undefined}
                />
              </div>
            ))}
          </div>
          
          {/* CSS for marquee animation */}
          <style jsx>{`
            @keyframes marquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-${totalWidth}px);
              }
            }
          `}</style>
        </div>
      ) : (
        // Regular scrollable carousel
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className={cn(
              "flex overflow-x-auto scrollbar-hide scroll-smooth pb-4",
              compact ? "gap-4" : "gap-6"
            )}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className="flex-shrink-0"
                style={{ width: cardWidth }}
              >
                <PlanCard plan={plan} compact={compact} candlelight={candlelight} getTrackedLink={getTrackedLink} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

