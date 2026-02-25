'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface DateFilterProps {
  onDateRangeChange: (range: [Date, Date] | null) => void;
  availableDates: Date[]; // All available dates across all plans
  currentRange: [Date, Date] | null; // Current selected range (for persistence)
}

export function DateFilter({ onDateRangeChange, availableDates, currentRange }: DateFilterProps) {
  const t = useTranslations('DateFilter');
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(currentRange?.[0] || null);
  const [endDate, setEndDate] = useState<Date | null>(currentRange?.[1] || null);
  const [currentMonth, setCurrentMonth] = useState(currentRange?.[0] || new Date());
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Sync internal state when currentRange prop changes (e.g., from localStorage)
  useEffect(() => {
    setStartDate(currentRange?.[0] || null);
    setEndDate(currentRange?.[1] || null);
    if (currentRange?.[0]) {
      setCurrentMonth(currentRange[0]);
    }
  }, [currentRange]);

  // Calculate dropdown position when opening and on scroll
  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 8,
          left: Math.max(8, rect.left) // Ensure it doesn't go off screen left
        });
      }
    };
    
    updatePosition();
    
    if (isOpen) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get unique available dates as date strings for quick lookup
  const availableDateStrings = new Set(
    availableDates.map(d => d.toDateString())
  );

  // Check if a date has available events
  const hasEvents = (date: Date) => availableDateStrings.has(date.toDateString());

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay(); // 0 = Sunday
    
    const days: (Date | null)[] = [];
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(date);
      setEndDate(null);
    } else {
      // Complete selection
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const applyFilter = () => {
    if (startDate && endDate) {
      onDateRangeChange([startDate, endDate]);
    }
    setIsOpen(false);
  };

  const clearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    onDateRangeChange(null);
    setIsOpen(false);
  };

  const isInRange = (date: Date) => {
    if (!startDate) return false;
    if (!endDate) return date.toDateString() === startDate.toDateString();
    return date >= startDate && date <= endDate;
  };

  const isStartOrEnd = (date: Date) => {
    if (startDate && date.toDateString() === startDate.toDateString()) return true;
    if (endDate && date.toDateString() === endDate.toDateString()) return true;
    return false;
  };

  const formatDisplayDate = () => {
    if (!startDate) return t('selectDates');
    if (!endDate) return startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const monthNames = [
    t('months.january'),
    t('months.february'),
    t('months.march'),
    t('months.april'),
    t('months.may'),
    t('months.june'),
    t('months.july'),
    t('months.august'),
    t('months.september'),
    t('months.october'),
    t('months.november'),
    t('months.december')
  ];

  return (
    <div className="relative">
      {/* Filter Button - matches price filter button style */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap border",
          startDate && endDate
            ? "bg-white text-[#FF1493] border-white shadow-md"
            : "text-white hover:bg-white/20 border-white/50"
        )}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{formatDisplayDate()}</span>
        {startDate && endDate && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              clearFilter();
            }}
            className="ml-1 hover:bg-pink-200 rounded-full p-0.5 cursor-pointer"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        )}
      </button>

      {/* Calendar Dropdown - Fixed position to escape overflow containers */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="fixed z-[9999] bg-white rounded-xl shadow-2xl border border-pink-100 p-4 min-w-[300px]"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-1 hover:bg-pink-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-semibold text-gray-800">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-1 hover:bg-pink-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {[
              t('weekdays.sunday'),
              t('weekdays.monday'),
              t('weekdays.tuesday'),
              t('weekdays.wednesday'),
              t('weekdays.thursday'),
              t('weekdays.friday'),
              t('weekdays.saturday')
            ].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((date, index) => (
              <div key={index} className="aspect-square">
                {date ? (
                  <button
                    onClick={() => handleDateClick(date)}
                    disabled={!hasEvents(date)}
                    className={cn(
                      "w-full h-full rounded-full text-sm flex items-center justify-center transition-all",
                      !hasEvents(date) && "text-gray-300 cursor-not-allowed",
                      hasEvents(date) && !isInRange(date) && "text-gray-700 hover:bg-pink-100",
                      isInRange(date) && !isStartOrEnd(date) && "bg-pink-100 text-[#FF1493]",
                      isStartOrEnd(date) && "bg-[#FF1493] text-white font-semibold",
                      hasEvents(date) && "relative"
                    )}
                  >
                    {date.getDate()}
                    {hasEvents(date) && !isInRange(date) && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF1493] rounded-full" />
                    )}
                  </button>
                ) : (
                  <div />
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-pink-100">
            <button
              onClick={clearFilter}
              className="flex-1 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {t('clear')}
            </button>
            <button
              onClick={applyFilter}
              disabled={!startDate || !endDate}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
                startDate && endDate
                  ? "bg-[#FF1493] text-white hover:bg-[#E0127D]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              {t('apply')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

