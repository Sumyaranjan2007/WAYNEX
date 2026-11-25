'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Compass,
  ArrowRight,
  Sparkles,
  Building2,
  Calendar,
  Layers,
  Plane,
  Train,
  Check,
} from 'lucide-react';
import { CityHub } from '@/data/tripPlannerData';
import { searchCityHubs, getAttractionsForCity } from '@/services/tripPlanningEngine';
import { RobustImage } from '@/components/ui/RobustImage';

interface Props {
  selectedCity: CityHub;
  onSelectCity: (city: CityHub) => void;
  departureCity: string;
  onChangeDepartureCity: (city: string) => void;
  onNext: () => void;
}

export const Step1DestinationCity: React.FC<Props> = ({
  selectedCity,
  onSelectCity,
  departureCity,
  onChangeDepartureCity,
  onNext,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const cityResults = searchCityHubs(searchQuery);
  const cityAttractions = getAttractionsForCity(selectedCity.id);

  const popularStartingPoints = [
    'Bengaluru',
    'Delhi NCR',
    'Mumbai',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Bhubaneswar',
    'Pune',
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title & Introduction */}
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9933]/15 text-[#B85C38] text-xs font-bold uppercase tracking-wider mb-2">
          <MapPin className="w-3.5 h-3.5 text-[#FF9933]" /> Stage 1 of 8
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#14243A] font-serif tracking-tight mb-2">
          Where would you like to travel?
        </h2>
        <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
          Choose any Indian city or destination hub. We’ll organize top-rated attractions, local bus and train connections, budget hotels, and regional cuisine.
        </p>
      </div>

      {/* Starting & Destination Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-[#E2D9C8] shadow-sm">
        {/* Departure City */}
        <div>
          <label className="block text-xs font-bold text-[#14243A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#B85C38]" /> Starting / Departure Location
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Bengaluru, New Delhi, Kolkata..."
              value={departureCity}
              onChange={(e) => onChangeDepartureCity(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#B85C38] font-medium"
            />
          </div>
          {/* Quick Starting Points Chips */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <span className="text-[11px] text-[#94A3B8] mr-1 self-center">Popular:</span>
            {popularStartingPoints.map((pt) => (
              <button
                key={pt}
                type="button"
                onClick={() => onChangeDepartureCity(pt)}
                className={`text-[11px] px-2 py-0.5 rounded-full border transition-all ${
                  departureCity.toLowerCase() === pt.toLowerCase()
                    ? 'bg-[#14243A] text-white border-[#14243A]'
                    : 'bg-[#EFE9DC] text-[#475569] border-[#E2D9C8] hover:border-[#B85C38]'
                }`}
              >
                {pt}
              </button>
            ))}
          </div>
        </div>

        {/* Search Destination City */}
        <div>
          <label className="block text-xs font-bold text-[#14243A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#FF9933]" /> Destination City / Region
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search destination city (e.g. Mysuru, Puri, Munnar, Jaipur)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF9933] font-medium"
            />
          </div>
          <p className="text-[11px] text-[#64748B] mt-2">
            Searching across all 36 States & Union Territories.
          </p>
        </div>
      </div>

      {/* Suggested Destination Cities Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-bold text-[#14243A] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF9933]" />
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Travel Hubs'}
          </h3>
          <span className="text-xs text-[#64748B]">{cityResults.length} cities available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cityResults.map((city) => {
            const isSelected = selectedCity.id === city.id;
            return (
              <div
                key={city.id}
                onClick={() => onSelectCity(city)}
                className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'ring-3 ring-[#B85C38] border-[#B85C38] bg-white shadow-xl scale-[1.02]'
                    : 'bg-white border-[#E2D9C8] hover:border-[#B85C38]/60 hover:shadow-md'
                }`}
              >
                {/* Photo & State Badge */}
                <div className="relative h-40 w-full overflow-hidden bg-[#14243A]">
                  <RobustImage
                    src={city.image}
                    stateSlug={city.stateSlug}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14243A] via-[#14243A]/30 to-transparent" />
                  
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#14243A]/80 backdrop-blur-md text-[#FF9933] border border-white/10 uppercase tracking-wider">
                      {city.state}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#174B37] text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div className="absolute bottom-2.5 left-3 right-3">
                    <h4 className="text-lg font-bold text-white font-serif leading-tight">
                      {city.name}
                    </h4>
                    <span className="text-xs text-white/80 block line-clamp-1">
                      {city.district} District
                    </span>
                  </div>
                </div>

                {/* Tagline & Key Specialties */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-[#475569] line-clamp-2 mb-2.5 leading-relaxed">
                    {city.tagline}
                  </p>

                  <div className="pt-2 border-t border-[#E2D9C8] flex items-center justify-between text-[11px] text-[#64748B]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#FF9933]" />
                      {city.bestTimeToVisit.split('(')[0]}
                    </span>
                    <span className={`font-bold ${isSelected ? 'text-[#B85C38]' : 'text-[#64748B] group-hover:text-[#B85C38]'}`}>
                      {isSelected ? 'Selected ✓' : 'Select City →'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected City Preview Banner */}
      <div className="bg-[#EFE9DC] border border-[#E2D9C8] rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B85C38] bg-[#B85C38]/10 px-2.5 py-0.5 rounded-full">
              Selected Destination
            </span>
            <span className="text-xs text-[#64748B]">{selectedCity.state}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#14243A] font-serif">
            {selectedCity.name}
          </h3>
          <p className="text-sm text-[#475569] max-w-2xl leading-relaxed">
            {selectedCity.description}
          </p>

          {/* Quick Transit & Regional Data */}
          <div className="flex flex-wrap gap-4 pt-2 text-xs text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <Train className="w-4 h-4 text-[#14243A]" />
              <span>{selectedCity.railwayStation}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Plane className="w-4 h-4 text-[#14243A]" />
              <span>{selectedCity.nearestAirport}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#14243A]" />
              <span>Attractions Available: <strong className="text-[#14243A]">{cityAttractions.length} Places</strong></span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onNext}
          className="w-full lg:w-auto px-7 py-3.5 rounded-xl bg-[#14243A] hover:bg-[#B85C38] text-white font-bold text-sm shadow-lg shadow-[#14243A]/20 transition-all duration-300 flex items-center justify-center gap-2 shrink-0"
        >
          <span>Proceed to Places ({cityAttractions.length})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
