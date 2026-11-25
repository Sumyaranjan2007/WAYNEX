'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  Star,
  Calendar,
  Languages,
  BookOpen,
  Utensils,
  Sun,
  ShieldCheck,
  Building2,
  ArrowLeft,
  ExternalLink,
  Plane,
  Train,
  PhoneCall,
  Clock,
  Layers,
  Sparkles,
  CloudSun,
  Landmark,
  Share2
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RobustImage } from '@/components/ui/RobustImage';
import { getStateBySlug, INDIAN_STATES } from '@/data/states';
import { getDestinationsByState } from '@/data/destinations';
import { formatCurrency } from '@/lib/utils';

export function StateDetailView({ stateSlug }: { stateSlug: string }) {
  const state = getStateBySlug(stateSlug);
  const [activeTab, setActiveTab] = useState<'overview' | 'geography' | 'climate' | 'history' | 'destinations' | 'culture'>('overview');

  if (!state) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex flex-col items-center justify-center p-4">
        <Compass className="w-16 h-16 text-cyan-400 mb-4 animate-spin-slow" />
        <h1 className="text-3xl font-black mb-2">State Not Found</h1>
        <p className="text-navy-300 mb-6 text-center max-w-md">
          The requested region &quot;{stateSlug}&quot; could not be located in our registry.
        </p>
        <div className="flex gap-3">
          <Link href="/explore">
            <Button variant="primary">Explore All 36 States & UTs</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const destinations = getDestinationsByState(state.slug);

  const monthsList = [
    { name: 'Jan', season: 'Winter', suit: 'Peak', temp: '14°C - 26°C' },
    { name: 'Feb', season: 'Winter', suit: 'Peak', temp: '16°C - 28°C' },
    { name: 'Mar', season: 'Summer', suit: 'Good', temp: '20°C - 32°C' },
    { name: 'Apr', season: 'Summer', suit: 'Moderate', temp: '25°C - 38°C' },
    { name: 'May', season: 'Summer', suit: 'Moderate', temp: '28°C - 41°C' },
    { name: 'Jun', season: 'Monsoon', suit: 'Moderate', temp: '26°C - 35°C' },
    { name: 'Jul', season: 'Monsoon', suit: 'Good', temp: '24°C - 31°C' },
    { name: 'Aug', season: 'Monsoon', suit: 'Good', temp: '24°C - 30°C' },
    { name: 'Sep', season: 'Post-Monsoon', suit: 'Peak', temp: '24°C - 31°C' },
    { name: 'Oct', season: 'Autumn', suit: 'Peak', temp: '22°C - 30°C' },
    { name: 'Nov', season: 'Winter', suit: 'Peak', temp: '18°C - 28°C' },
    { name: 'Dec', season: 'Winter', suit: 'Peak', temp: '14°C - 26°C' }
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* Hero Banner Section */}
      <div className="relative h-[440px] sm:h-[500px] w-full overflow-hidden">
        <RobustImage
          src={state.banner_image || state.image}
          stateSlug={state.slug}
          alt={state.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/30" />

        <div className="absolute inset-0 flex items-end">
          <Container className="pb-10">
            <div className="flex items-center justify-between mb-4">
              <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold bg-navy-900/80 px-3.5 py-1.5 rounded-lg border border-navy-700/80 backdrop-blur-md shadow-md"
              >
                <ArrowLeft className="w-4 h-4" /> All 36 States & UTs
              </Link>
              
              <div className="flex items-center gap-2">
                {state.official_website && (
                  <a
                    href={state.official_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-navy-300 hover:text-white bg-navy-900/80 px-3 py-1.5 rounded-lg border border-navy-700 backdrop-blur-md"
                  >
                    <span>Gov Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <Badge variant="info">
                {state.is_union_territory ? 'Union Territory of India' : 'State of India'}
              </Badge>
              <span className="font-mono text-xs font-bold text-amber-300 bg-navy-900/90 px-2.5 py-0.5 rounded border border-navy-700">
                CODE: {state.code}
              </span>
              <span className="text-xs text-navy-300 font-medium">
                Capital: <strong className="text-white">{state.capital}</strong>
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-3">
              {state.name}
            </h1>

            <p className="text-sm sm:text-lg text-navy-200 max-w-3xl leading-relaxed">
              {state.description}
            </p>
          </Container>
        </div>
      </div>

      {/* Quick Facts Bar */}
      <div className="bg-navy-900 border-y border-navy-800">
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-navy-800 text-cyan-400 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-navy-400 block uppercase font-bold tracking-wider text-[10px]">Capital</span>
                <span className="text-white font-bold">{state.capital}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-navy-800 text-cyan-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-navy-400 block uppercase font-bold tracking-wider text-[10px]">Formation</span>
                <span className="text-white font-bold">{state.formation_date || '1 Nov 1956'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-navy-800 text-amber-400 shrink-0">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <span className="text-navy-400 block uppercase font-bold tracking-wider text-[10px]">Languages</span>
                <span className="text-white font-bold truncate max-w-[140px] block">{state.languages || 'Official regional languages'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-navy-800 text-emerald-400 shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-navy-400 block uppercase font-bold tracking-wider text-[10px]">Best Season</span>
                <span className="text-white font-bold">{state.best_time_to_visit || 'Oct - Mar'}</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content Area with Navigation Tabs */}
      <Container className="py-10">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-navy-800 pb-4 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'destinations', label: `Destinations (${destinations.length})`, icon: Compass },
            { id: 'geography', label: 'Geography & Ecology', icon: Layers },
            { id: 'climate', label: 'Climate & Seasons', icon: CloudSun },
            { id: 'history', label: 'History & Heritage', icon: Landmark },
            { id: 'culture', label: 'Culture & Cuisine', icon: Utensils },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === id
                  ? 'bg-cyan-500 text-navy-950 shadow-glow-cyan'
                  : 'bg-navy-900/60 text-navy-300 hover:text-white hover:bg-navy-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <Card variant="glass" className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    About {state.name}
                  </h3>
                  <p className="text-navy-200 leading-relaxed text-sm sm:text-base">
                    {state.description}
                  </p>
                </Card>

                <Card variant="glass" className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    Key Highlights & Attractions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {(state.popular_attractions || ['Heritage Architecture', 'Nature Trails', 'Cultural Festivals', 'Culinary Landmarks']).map((att, i) => (
                      <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-navy-950 border border-navy-800">
                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span className="text-sm font-semibold text-white">{att}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <Card variant="glass" className="p-6">
                  <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-red-400" />
                    Travel & Safety Helplines
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-navy-800">
                      <span className="text-navy-300">National Emergency</span>
                      <span className="font-mono font-bold text-white">112</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-navy-800">
                      <span className="text-navy-300">National Tourist Infoline</span>
                      <span className="font-mono font-bold text-cyan-400">1363</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-navy-800">
                      <span className="text-navy-300">Women Helpline</span>
                      <span className="font-mono font-bold text-white">1091</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-navy-300">Railway Security</span>
                      <span className="font-mono font-bold text-white">139</span>
                    </div>
                  </div>
                </Card>

                {state.tourism_website && (
                  <Card variant="glass" className="p-6">
                    <h4 className="text-base font-bold text-white mb-2">Official Tourism Department</h4>
                    <p className="text-xs text-navy-300 mb-4">
                      Explore official tourism itineraries and government-sanctioned homestay programs.
                    </p>
                    <a
                      href={state.tourism_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs transition-colors"
                    >
                      <span>Visit Tourism Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Destinations */}
        {activeTab === 'destinations' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">
                Verified Destinations in {state.name}
              </h3>
              <Badge variant="info">{destinations.length} Catalogued</Badge>
            </div>

            {destinations.length === 0 ? (
              <div className="text-center py-16 bg-navy-900/50 rounded-2xl border border-navy-800 p-8">
                <Compass className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-60" />
                <h4 className="text-lg font-bold text-white mb-1">Destinations Being Catalogued</h4>
                <p className="text-xs text-navy-300 max-w-md mx-auto mb-4">
                  Our regional research team is currently validating coordinates and transport links for destinations in {state.name}.
                </p>
                <Link href="/destinations">
                  <Button variant="outline" size="sm">Browse Pan-India Catalog</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((dest) => (
                  <Link key={dest.id} href={`/destinations/${dest.slug}`} className="group">
                    <Card variant="interactive" className="h-full flex flex-col justify-between overflow-hidden">
                      <div className="relative h-48 w-full overflow-hidden">
                        <RobustImage
                          src={dest.image}
                          stateSlug={state.slug}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <Badge variant="info" size="sm">{dest.category}</Badge>
                        </div>
                        <div className="absolute top-3 right-3 bg-navy-900/80 backdrop-blur-md px-2 py-0.5 rounded text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {dest.rating || 4.8}
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h4 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                            {dest.name}
                          </h4>
                        </div>
                      </div>

                      <CardContent className="p-4 flex-1 flex flex-col justify-between">
                        <p className="text-xs text-navy-300 line-clamp-2 mb-3">
                          {dest.description}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-navy-800 text-xs">
                          <span className="text-navy-400">
                            Est: <strong className="text-white">{formatCurrency(dest.estimated_budget_per_day)}/day</strong>
                          </span>
                          <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                            Explore &rarr;
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Geography & Ecology */}
        {activeTab === 'geography' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <Card variant="glass" className="p-6">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Geographical Structure & Terrain
              </h3>
              <p className="text-navy-200 leading-relaxed text-sm sm:text-base mb-6">
                {state.geography}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-navy-800">
                <div className="p-4 rounded-xl bg-navy-950 border border-navy-800">
                  <span className="text-xs text-navy-400 block font-bold uppercase">Total Geographic Area</span>
                  <span className="text-lg font-black text-white mt-1 block">{(state.area_sq_km || 50000).toLocaleString()} km²</span>
                </div>
                <div className="p-4 rounded-xl bg-navy-950 border border-navy-800">
                  <span className="text-xs text-navy-400 block font-bold uppercase">Administrative Districts</span>
                  <span className="text-lg font-black text-cyan-400 mt-1 block">{state.districts_count || 30} Districts</span>
                </div>
                <div className="p-4 rounded-xl bg-navy-950 border border-navy-800">
                  <span className="text-xs text-navy-400 block font-bold uppercase">Center Coordinates</span>
                  <span className="text-xs font-mono text-white mt-2 block">{state.latitude?.toFixed(2)}° N, {state.longitude?.toFixed(2)}° E</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 4: Climate & Monthly Seasons */}
        {activeTab === 'climate' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <Card variant="glass" className="p-6">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-400" />
                Climate Overview
              </h3>
              <p className="text-navy-200 text-sm leading-relaxed mb-6">
                {state.climate}
              </p>

              <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-4">
                12-Month Travel Suitability Guide
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {monthsList.map((m, i) => (
                  <div key={i} className="p-3 rounded-xl bg-navy-950 border border-navy-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{m.name}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          m.suit === 'Peak' ? 'bg-emerald-500/20 text-emerald-300' :
                          m.suit === 'Good' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {m.suit}
                        </span>
                      </div>
                      <span className="text-[11px] text-navy-400 block mt-1">{m.season}</span>
                    </div>
                    <div className="mt-3 pt-2 border-t border-navy-900 text-[10px] text-navy-300">
                      {m.temp}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Tab 5: History & Heritage */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <Card variant="glass" className="p-6">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-cyan-400" />
                Historical Chronology & Dynasties
              </h3>
              <p className="text-navy-200 text-sm sm:text-base leading-relaxed mb-6">
                {state.history}
              </p>
            </Card>
          </div>
        )}

        {/* Tab 6: Culture & Cuisine */}
        {activeTab === 'culture' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <Card variant="glass" className="p-6">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-400" />
                Cultural Identity & Regional Cuisine
              </h3>
              <p className="text-navy-200 text-sm leading-relaxed mb-4">
                Experience authentic local culinary dishes, traditional dance forms, and indigenous handicrafts that define {state.name}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-xl bg-navy-950 border border-navy-800">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">Spoken Languages</h4>
                  <p className="text-sm text-white font-medium">{state.languages || 'Official regional languages'}</p>
                </div>
                <div className="p-4 rounded-xl bg-navy-950 border border-navy-800">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">Heritage Crafts</h4>
                  <p className="text-sm text-white font-medium">Traditional handlooms, folk paintings, and regional metalcraft.</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Container>
    </div>
  );
}
