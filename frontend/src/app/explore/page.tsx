'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Search, MapPin, Star, Building2, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RobustImage } from '@/components/ui/RobustImage';
import { INDIAN_STATES } from '@/data/states';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'state' | 'ut'>('all');

  const filteredStates = INDIAN_STATES.filter((state) => {
    const matchesSearch =
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === 'all' ||
      (filterType === 'state' && !state.is_union_territory) ||
      (filterType === 'ut' && state.is_union_territory);

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#14243A] py-10 sm:py-14">
      <Container>
        {/* Editorial Page Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9933]/15 border border-[#FF9933]/30 text-[#B85C38] text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-[#FF9933]" />
            Comprehensive National Atlas
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#14243A] tracking-tight mb-4 font-serif">
            28 States. 8 Union Territories. Infinite Horizons.
          </h1>
          <p className="text-[#475569] text-base sm:text-lg leading-relaxed">
            Every corner of India holds centuries of heritage, diverse dialects, seasonal celebrations, and distinct cuisines. Explore all 36 regions with verified destinations, transit connectivity, and local safety contacts.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-white p-3 sm:p-4 rounded-2xl border border-[#E2D9C8] shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by state name, capital, or code (e.g. Odisha, Shimla, RJ)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#B85C38]"
            />
          </div>

          <div className="inline-flex p-1 bg-[#EFE9DC] rounded-xl border border-[#E2D9C8] self-start sm:self-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-[#14243A] text-white shadow-sm'
                  : 'text-[#475569] hover:text-[#14243A]'
              }`}
            >
              All Regions ({INDIAN_STATES.length})
            </button>
            <button
              onClick={() => setFilterType('state')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterType === 'state'
                  ? 'bg-[#14243A] text-white shadow-sm'
                  : 'text-[#475569] hover:text-[#14243A]'
              }`}
            >
              States ({INDIAN_STATES.filter((s) => !s.is_union_territory).length})
            </button>
            <button
              onClick={() => setFilterType('ut')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterType === 'ut'
                  ? 'bg-[#14243A] text-white shadow-sm'
                  : 'text-[#475569] hover:text-[#14243A]'
              }`}
            >
              UTs ({INDIAN_STATES.filter((s) => s.is_union_territory).length})
            </button>
          </div>
        </div>

        {/* States Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStates.map((state) => (
            <Link key={state.id} href={`/explore/${state.slug}`} className="group">
              <div className="h-full flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-[#E2D9C8] hover:border-[#B85C38]/60 hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 w-full overflow-hidden bg-[#14243A]">
                  <RobustImage
                    src={state.image || 'https://images.unsplash.com/photo-1600100397608-f010f443bbf6?w=600&h=400&fit=crop'}
                    stateSlug={state.slug}
                    alt={state.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14243A] via-[#14243A]/40 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      state.is_union_territory
                        ? 'bg-[#174B37] text-white'
                        : 'bg-[#B85C38] text-white'
                    }`}>
                      {state.is_union_territory ? 'Union Territory' : 'State'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#14243A]">
                      {state.destination_count || 15} Places
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="bg-[#14243A]/80 backdrop-blur-md text-[#FF9933] font-mono font-bold text-xs px-2.5 py-1 rounded-md border border-white/20">
                      {state.code}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#FF9933] transition-colors font-serif">
                      {state.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-white/80">
                      <Building2 className="w-3.5 h-3.5 text-[#FF9933]" />
                      <span>Capital: {state.capital}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-[#475569] line-clamp-2 mb-3 leading-relaxed">
                    {state.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-[#E2D9C8] text-xs">
                    <div className="flex items-center justify-between text-[#64748B]">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#FF9933]" />
                        Best Time:
                      </span>
                      <span className="text-[#14243A] font-semibold">{state.best_time_to_visit || 'Oct – Mar'}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[#B85C38] font-bold flex items-center gap-1 text-xs">
                        <Star className="w-3.5 h-3.5 fill-[#FF9933] text-[#FF9933]" />
                        {state.rating || 4.8} / 5.0
                      </span>
                      <span className="text-[#B85C38] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 text-xs">
                        Explore Region <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredStates.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E2D9C8]">
            <Compass className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#14243A]">No Regions Found</h3>
            <p className="text-sm text-[#64748B] mt-1">
              Try searching with a different state name or clear your search query.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
