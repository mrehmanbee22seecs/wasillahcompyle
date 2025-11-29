/**
 * AddToCalendar Component - Phase 3 Feature
 * Dropdown menu for adding events to various calendar providers
 * Zero cost - uses client-side calendar links (no OAuth required)
 */

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check, Download } from 'lucide-react';
import {
  generateGoogleCalendarLink,
  generateOutlookCalendarLink,
  generateYahooCalendarLink,
  downloadICalFile,
  CalendarEvent
} from '../../utils/calendarIntegration';

interface AddToCalendarProps {
  event: {
    title: string;
    description?: string;
    location?: string;
    startDate: Date;
    endDate: Date;
  };
  variant?: 'button' | 'compact' | 'dropdown';
  className?: string;
}

const calendarOptions = [
  {
    id: 'google',
    name: 'Google Calendar',
    icon: '📅',
    color: 'hover:bg-blue-50'
  },
  {
    id: 'outlook',
    name: 'Outlook',
    icon: '📧',
    color: 'hover:bg-blue-50'
  },
  {
    id: 'yahoo',
    name: 'Yahoo Calendar',
    icon: '📆',
    color: 'hover:bg-purple-50'
  },
  {
    id: 'ical',
    name: 'Download .ics',
    icon: '⬇️',
    color: 'hover:bg-gray-50'
  }
];

const AddToCalendar: React.FC<AddToCalendarProps> = ({
  event,
  variant = 'dropdown',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [addedTo, setAddedTo] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calendarEvent: CalendarEvent = {
    title: event.title,
    description: event.description,
    location: event.location,
    startDate: event.startDate,
    endDate: event.endDate
  };

  const timeoutRef = useRef<number | null>(null);

  const handleAddToCalendar = (providerId: string) => {
    const { startDate, endDate, title } = calendarEvent;
    if (
      !(startDate instanceof Date) || isNaN(startDate.getTime()) ||
      !(endDate instanceof Date) || isNaN(endDate.getTime()) ||
      endDate <= startDate
    ) {
      console.error('Invalid event dates for calendar export');
      setAddedTo(null);
      return;
    }

    const openSafe = (url: string) => {
      if (typeof window === 'undefined') return false;
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      return !!win;
    };

    let success = false;
    try {
      switch (providerId) {
        case 'google':
          success = openSafe(generateGoogleCalendarLink(calendarEvent));
          break;
        case 'outlook':
          success = openSafe(generateOutlookCalendarLink(calendarEvent));
          break;
        case 'yahoo':
          success = openSafe(generateYahooCalendarLink(calendarEvent));
          break;
        case 'ical':
          downloadICalFile(calendarEvent);
          success = true;
          break;
        default:
          console.warn('Unknown calendar provider:', providerId);
          return;
      }
    } catch (e) {
      success = false;
      console.error('Calendar action failed:', e);
    }

    if (success) {
      setAddedTo(providerId);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setAddedTo(null), 2000);
    } else {
      // Optional: transient failure indicator
      setAddedTo(null);
    }

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'add_to_calendar', {
        event_title: title,
        calendar_provider: providerId,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  if (variant === 'compact') {
    return (
      <button
        onClick={() => handleAddToCalendar('google')}
        className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${className}`}
        title="Add to Google Calendar"
      >
        <Calendar className="w-4 h-4" />
        <span>Add to Calendar</span>
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <div className="flex flex-wrap gap-2">
        {calendarOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleAddToCalendar(option.id)}
            className={`inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg ${option.color} transition-colors`}
          >
            <span>{option.icon}</span>
            <span>{option.name}</span>
            {addedTo === option.id && <Check className="w-4 h-4 text-green-500" />}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-vibrant-orange hover:bg-vibrant-orange-light text-white rounded-lg font-medium transition-colors"
        aria-label="Add to calendar"
      >
        <Calendar className="w-5 h-5" />
        <span>Add to Calendar</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase">Choose Calendar</p>
          </div>
          {calendarOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                handleAddToCalendar(option.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 ${option.color} transition-colors`}
            >
              <span className="text-lg">{option.icon}</span>
              <span className="flex-1 text-left">{option.name}</span>
              {addedTo === option.id && <Check className="w-4 h-4 text-green-500" />}
              {option.id === 'ical' && <Download className="w-4 h-4 text-gray-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddToCalendar;
