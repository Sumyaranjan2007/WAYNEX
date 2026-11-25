'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Search,
  Star,
  Compass,
  Filter,
  Sparkles,
  ArrowUpDown,
  ChevronRight,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RobustImage } from '@/components/ui/RobustImage';
import { ALL_DESTINATIONS } from '@/data/destinations';
import { formatCurrency } from '@/lib/utils';

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'budget_asc' | 'budget_desc'>('rating');

  const categories = [
    { label: 'All Categories', value: 'all' },
    { label: 'Heritage Sites', value: 'heritage_site' },
    { label: 'Hill Stations', value: 'hill_station' },
    { label: 'Beaches', value: 'beach' },
    { label: 'Temples', value: 'temple' },
    { label: 'National Parks', value: 'national_park' },
    { label: 'Waterfalls', value: 'waterfall' },
    { label: 'Adventure', value: 'adventure' },
    { label: 'Cities', value: 'city' },
    { label: 'Villages', value: 'village' },
  ];

  const states = Array.from(new Set(ALL_DESTINATIONS.map((d) => d.state.name))).sort();

  const filtered = ALL_DESTINATIONS.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.district && d.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || d.category === categoryFilter;

    const matchesState = stateFilter === 'all' || d.state.name === stateFilter;

    return matchesSearch && matchesCategory && matchesState;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'budget_asc')
      return (a.estimated_budget_per_day || 0) - (b.estimated_budget_per_day || 0);
    if (sortBy === 'budget_desc')
      return (b.estimated_budget_per_day || 0) - (a.estimated_budget_per_day || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#14243A] py-10 font-sans selection:bg-[#FF9933]/20">
      <Container>
        {/* Header Banner */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE9DC] text-[#B85C38] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
            All 36 States & Union Territories • 547 Verified Destinations
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#14243A] tracking-tight">
            Discover India’s Wonders
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-2xl">
            Search from over 500 researched travel destinations across all 28 Indian States and 8 Union Territories.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] shadow-sm mb-8 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by destination name, state (e.g. Goa, Ladakh, Kerala, Odisha), or attraction..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F4EC] border border-[#E2D9C8] rounded-xl pl-11 pr-4 py-3 text-sm text-[#14243A] placeholder-[#64748B] focus:outline-none focus:border-[#B85C38] focus:ring-1 focus:ring-[#B85C38] transition-all"
            />
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategoryFilter(c.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  categoryFilter === c.value
                    ? 'bg-[#B85C38] text-white shadow-sm'
                    : 'bg-[#F7F4EC] text-[#64748B] hover:text-[#14243A] border border-[#E2D9C8]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* State Filter & Sorting */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E2D9C8]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                Filter by State:
              </span>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="bg-[#F7F4EC] border border-[#E2D9C8] text-xs text-[#14243A] font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-[#B85C38]"
              >
                <option value="all">All States & UTs (36)</option>
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-[#64748B]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#F7F4EC] border border-[#E2D9C8] text-xs text-[#14243A] font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-[#B85C38]"
              >
                <option value="rating">Top Rated</option>
                <option value="budget_asc">Budget: Low to High</option>
                <option value="budget_desc">Budget: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-xs text-[#64748B] font-bold uppercase tracking-wider mb-6 flex items-center justify-between">
          <span>Showing {filtered.length} verified destinations across India</span>
          {categoryFilter !== 'all' || stateFilter !== 'all' || searchQuery ? (
            <button
              onClick={() => {
                setCategoryFilter('all');
                setStateFilter('all');
                setSearchQuery('');
              }}
              className="text-[#B85C38] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          ) : null}
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((dest) => (
            <Link key={dest.id} href={`/destinations/${dest.slug}`} className="group">
              <Card variant="interactive" className="h-full flex flex-col justify-between overflow-hidden bg-white border border-[#E2D9C8] shadow-sm hover:shadow-md transition-all">
                <div className="relative h-48 w-full overflow-hidden bg-[#14243A]">
                  <RobustImage
                    src={dest.image}
                    alt={dest.name}
                    stateSlug={dest.state.slug}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-[#14243A] backdrop-blur-sm shadow-sm">
                      {dest.category.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 bg-black/60 text-[#FFD700] font-bold text-xs px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {dest.rating}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-black text-white group-hover:text-[#FF9933] transition-colors drop-shadow-sm truncate">
                      {dest.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-[#EFE9DC]">
                      <MapPin className="w-3.5 h-3.5 text-[#FF9933] shrink-0" />
                      <span className="truncate">{dest.district ? `${dest.district}, ` : ''}{dest.state.name}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="pt-3 border-t border-[#E2D9C8] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#64748B]">Est. Daily:</span>{' '}
                      <span className="font-bold text-[#14243A]">
                        {formatCurrency(dest.estimated_budget_per_day)}
                      </span>
                    </div>
                    <span className="text-[#B85C38] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                      Explore <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E2D9C8]">
            <Compass className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#14243A]">No Matching Destinations Found</h3>
            <p className="text-sm text-[#64748B] mt-1">
              Try adjusting your search terms or clearing the category and state filters.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
