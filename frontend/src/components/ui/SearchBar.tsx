'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Search, X, MapPin, Compass } from 'lucide-react';
import Link from 'next/link';

export interface SearchSuggestion {
  id: string;
  title: string;
  type: 'state' | 'destination' | 'attraction';
  subtitle?: string;
  href: string;
}

export interface SearchBarProps {
  className?: string;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  onSearch?: (query: string) => void;
  debounceMs?: number;
  size?: 'md' | 'lg';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  className,
  placeholder = 'Search destinations, states, or experiences in India...',
  suggestions = [],
  onSearch,
  debounceMs = 250,
  size = 'md',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(query);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, onSearch, debounceMs]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = query.trim()
    ? suggestions.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
    : suggestions.slice(0, 5);

  const isLarge = size === 'lg';

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div
        className={cn(
          'relative flex items-center w-full bg-navy-900/90 border border-navy-700/80 rounded-xl transition-all duration-300 shadow-lg',
          'focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/30 focus-within:bg-navy-900',
          isLarge ? 'py-3.5 px-4 sm:px-5' : 'py-2.5 px-3.5'
        )}
      >
        <Search
          className={cn(
            'text-cyan-400 shrink-0 mr-3 transition-colors',
            isLarge ? 'w-5 h-5' : 'w-4 h-4'
          )}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'w-full bg-transparent text-white placeholder-navy-400 focus:outline-none font-medium',
            isLarge ? 'text-base sm:text-lg' : 'text-sm'
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="p-1 rounded-md text-navy-400 hover:text-white hover:bg-navy-800 transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-navy-900/95 backdrop-blur-xl border border-navy-700 rounded-xl shadow-2xl overflow-hidden z-50 py-2 divide-y divide-navy-800/60 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-cyan-400">
            {query.trim() ? 'Search Results' : 'Popular Suggestions'}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredSuggestions.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2.5 hover:bg-navy-800/80 transition-colors group cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-navy-800 group-hover:bg-cyan-500/20 text-cyan-400 mr-3 transition-colors">
                  {item.type === 'state' ? (
                    <Compass className="w-4 h-4" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {item.title}
                  </div>
                  {item.subtitle && (
                    <div className="text-xs text-navy-300 truncate">
                      {item.subtitle}
                    </div>
                  )}
                </div>
                <span className="text-[10px] uppercase font-bold text-navy-400 bg-navy-800 px-2 py-0.5 rounded border border-navy-700">
                  {item.type}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
