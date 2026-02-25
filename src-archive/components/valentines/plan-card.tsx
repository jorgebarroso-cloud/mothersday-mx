'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ValentinePlan } from '@/lib/valentines/service';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';

interface PlanCardProps {
  plan: ValentinePlan;
  priority?: boolean;
  compact?: boolean; // Smaller card variant
  featured?: boolean; // Special Top 3 design
  candlelight?: boolean; // Dark theme for Candlelight section
  getTrackedLink?: (link: string, planId?: string) => string; // UTM propagation function (now accepts planId)
  position?: number; // Display position (1, 2, 3) instead of actual rank for top picks
}

// Format date range from eventDates array
const formatDateRange = (dates: Date[]): string => {
  if (!dates || dates.length === 0) return '';
  
  const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const minDate = sortedDates[0];
  const maxDate = sortedDates[sortedDates.length - 1];
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  if (minDate.getTime() === maxDate.getTime()) {
    return formatDate(minDate);
  }
  
  return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
};

export function PlanCard({ plan, priority = false, compact = false, featured = false, candlelight = false, getTrackedLink, position }: PlanCardProps) {
  const t = useTranslations('PlanCard');
  
  // Apply UTM tracking to link if function is provided (pass plan.id for utm_campaign)
  const trackedLink = getTrackedLink ? getTrackedLink(plan.link, plan.id) : plan.link;
  
  // Get formatted date range
  const dateRange = formatDateRange(plan.eventDates);
  
  // Handle image loading errors
  const [imageError, setImageError] = useState(false);

  // Featured card design for Top 3
  if (featured) {
    return (
      <a 
        href={trackedLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block h-full group"
        aria-label={`${plan.title} at ${plan.venue} - ${plan.price} - Top Pick #${position ?? plan.rank}`}
      >
        <div className="relative h-full overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
          {/* Full background image */}
          <div className="relative aspect-[3/4] w-full">
            {plan.imageUrl && !imageError ? (
            <Image
              src={plan.imageUrl}
              alt={`${plan.title} - Valentine's Day experience in ${plan.venue}`}
              fill
              priority={priority}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              onError={() => setImageError(true)}
            />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                <span className="text-white/80 text-sm font-medium">Valentine's Experience</span>
              </div>
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            {/* Rank badge - show position if provided, otherwise actual rank */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/95 shadow-xl flex items-center justify-center">
                <span className="text-2xl font-black text-[#FF1F5A]">#{position ?? plan.rank}</span>
              </div>
              <div className="bg-gradient-to-r from-[#FF1F5A] to-[#FF6B9D] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                ♥ TOP PICK
              </div>
            </div>

            
            {/* Content at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <h3 className="font-bold text-xl leading-tight mb-2 line-clamp-2 drop-shadow-lg !text-white">
                {plan.title}
              </h3>
              <p className="text-white/80 text-sm mb-3 truncate">
                📍 {plan.venue}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-xl text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                  {plan.price}
                </span>
                <span className="bg-white text-[#FF1F5A] font-bold text-sm px-4 py-2 rounded-full group-hover:bg-[#FF1F5A] group-hover:text-white transition-all duration-300 shadow-lg">
                  {t('getTickets')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </a>
    );
  }

  // Premium card design for category pages
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Regular card design
  return (
    <a 
      href={trackedLink} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block h-full group"
    >
      <Card className={cn(
        "h-full overflow-hidden rounded-xl",
        "shadow-lg hover:shadow-2xl transition-all duration-300",
        "bg-white border border-gray-200",
        "transform hover:scale-[1.02]",
        candlelight && "bg-black border border-amber-600/40",
        compact && "shadow-sm"
      )}>
        <div className={cn(
          "relative w-full overflow-hidden",
          compact ? "aspect-[3/2]" : "aspect-[4/3]"
        )}>
          {plan.imageUrl && !imageError ? (
            <Image
              src={plan.imageUrl}
              alt={`${plan.title} - Valentine's Day experience in ${plan.venue}`}
              fill
              priority={priority}
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes={compact ? "(max-width: 768px) 50vw, 200px" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={cn(
              "w-full h-full flex items-center justify-center",
              candlelight ? "bg-amber-900/20 text-amber-200" : "bg-gradient-to-br from-pink-100 to-pink-200 text-pink-400"
            )}>
              <span className={compact ? "text-xs" : "text-sm font-medium"}>Valentine's Experience</span>
            </div>
          )}
          
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Wishlist Button - Floating */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className={cn(
              "absolute top-3 right-3 z-20",
              "w-10 h-10 rounded-full backdrop-blur-sm",
              "flex items-center justify-center",
              "transition-all duration-300",
              isWishlisted
                ? "bg-[#FF1493] text-white shadow-lg"
                : "bg-white/90 text-gray-600 hover:bg-white hover:scale-110"
            )}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn(
              "w-5 h-5 transition-all",
              isWishlisted && "fill-current"
            )} />
          </button>
          
          {/* Title over image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className={cn(
              "font-bold leading-tight line-clamp-2 text-white drop-shadow-lg mb-1",
              compact ? "text-sm" : "text-lg"
            )}>
              {plan.title}
            </h3>
            <p className={cn(
              "text-white/90 truncate",
              compact ? "text-xs" : "text-sm"
            )}>
              📍 {plan.venue}
            </p>
          </div>
        </div>
        
        <CardContent className={cn(
          "p-5",
          compact && "p-3"
        )}>
          {dateRange && (
            <p className={cn(
              "text-gray-500 mb-3",
              compact ? "text-xs" : "text-sm"
            )}>
              📅 {dateRange}
            </p>
          )}
          
          {/* Price - Prominent */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className={cn(
                "font-black text-[#FF1493]",
                compact ? "text-xl" : "text-3xl"
              )}>
                {plan.price}
              </span>
            </div>
            <span className={cn(
              "font-semibold text-[#FF1493] group-hover:underline transition-all",
              compact ? "text-xs" : "text-sm"
            )}>
              {t('getTickets')}
            </span>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

