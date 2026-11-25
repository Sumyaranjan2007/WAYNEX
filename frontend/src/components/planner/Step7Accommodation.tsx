'use client';

import React, { useState } from 'react';
import {
  Hotel,
  Star,
  MapPin,
  Check,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Coffee,
  Wifi,
  ShieldCheck,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { CityHub, HotelOption, HOTEL_CATALOG, AttractionItem } from '@/data/tripPlannerData';
import { RobustImage } from '@/components/ui/RobustImage';
import { formatCurrency } from '@/lib/utils';

interface Props {
  selectedCity: CityHub;
  selectedPlaces: AttractionItem[];
  selectedHotel: HotelOption;
  onSelectHotel: (hotel: HotelOption) => void;
  onPrev: () => void;
  onNext: () => void;
}

const TIER_FILTERS = [
  { id: 'all', label: 'All Stays' },
  { id: 'hostel', label: 'Backpacker Hostels' },
  { id: 'budget', label: 'Budget Hotels' },
  { id: 'mid_range', label: 'Mid-Range & Classic' },
  { id: 'luxury', label: 'Heritage & Luxury' },
];

export const Step7Accommodation: React.FC<Props> = ({
  selectedCity,
  selectedPlaces,
  selectedHotel,
  onSelectHotel,
  onPrev,
  onNext,
}) => {
  const [selectedTier, setSelectedTier] = useState('all');

  // Lookup accommodations for city
  const availableHotels: HotelOption[] =
    HOTEL_CATALOG[selectedCity.id] ||
    HOTEL_CATALOG['mysuru'] ||
    [];

  const filteredHotels = availableHotels.filter((h) => {
    if (selectedTier === 'all') return true;
    return h.tier === selectedTier;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9933]/15 text-[#B85C38] text-xs font-bold uppercase tracking-wider mb-2">
          <Hotel className="w-3.5 h-3.5 text-[#FF9933]" /> Stage 7 of 8
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#14243A] font-serif tracking-tight mb-2">
          Where would you like to stay in {selectedCity.name}?
        </h2>
        <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
          AI discovers hotels close to your selected attractions to minimize daily transit time and auto-integrates your 1:00 PM check-in into Day 1.
        </p>
      </div>

      {/* AI Hotel Recommendation Advisor */}
      <div className="bg-gradient-to-br from-[#14243A] to-[#1E3A5F] text-white p-5 sm:p-6 rounded-2xl shadow-md border border-white/10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF9933] text-[#14243A] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              AI Location Recommendation
            </h4>
            <p className="text-xs text-white/70">
              Optimal stay radius for your {selectedPlaces.length} selected destinations
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-white/90 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
          Based on your itinerary, we recommend staying within <strong>2 to 3 km of the City Center (near Nazarbad or Railway Station)</strong>. This will reduce your auto and taxi expenses by up to 40% and keep you within walking distance of famous heritage breakfast cafes like Vinayaka Mylari.
        </p>
      </div>

      {/* Tier Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E2D9C8]">
        {TIER_FILTERS.map((f) => {
          const isActive = selectedTier === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedTier(f.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#14243A] text-white shadow-sm'
                  : 'bg-white border border-[#E2D9C8] text-[#475569] hover:border-[#B85C38]'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHotels.map((hotel) => {
          const isSelected = selectedHotel?.id === hotel.id;

          return (
            <div
              key={hotel.id}
              onClick={() => onSelectHotel(hotel)}
              className={`rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#B85C38] ring-2 ring-[#B85C38] shadow-xl scale-[1.01]'
                  : 'bg-white border-[#E2D9C8] hover:border-[#B85C38]/50 hover:shadow-md'
              }`}
            >
              {/* Hotel Photo & Badge */}
              <div className="relative h-48 w-full overflow-hidden bg-[#14243A]">
                <RobustImage
                  src={hotel.image}
                  stateSlug={selectedCity.stateSlug}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14243A] via-[#14243A]/30 to-transparent" />

                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#14243A]/80 backdrop-blur-md text-[#FF9933] border border-white/10 uppercase tracking-wider">
                    {hotel.tier.replace('_', ' ')}
                  </span>
                  {hotel.soloSafe && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#174B37] text-white">
                      Solo Safe ✓
                    </span>
                  )}
                  {hotel.coupleFriendly && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B85C38] text-white">
                      Couple Friendly
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5 bg-[#14243A]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-amber-400 flex items-center gap-1 border border-white/10">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{hotel.rating}</span>
                  <span className="text-white/60 text-[10px]">({hotel.reviewCount})</span>
                </div>

                <div className="absolute bottom-2.5 left-3 right-3">
                  <h4 className="text-lg font-bold text-white font-serif leading-tight">
                    {hotel.name}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-white/80 mt-1">
                    <MapPin className="w-3 h-3 text-[#FF9933]" />
                    <span className="line-clamp-1">{hotel.distanceFromCenter}</span>
                  </div>
                </div>
              </div>

              {/* Details & Amenities */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#64748B]">Starting from</span>
                    <div>
                      <span className="text-xl font-black text-[#B85C38]">
                        {formatCurrency(hotel.pricePerNight)}
                      </span>
                      <span className="text-[11px] text-[#64748B]"> / night</span>
                    </div>
                  </div>

                  {/* Amenities Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hotel.amenities.slice(0, 4).map((a, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#F7F4EC] text-[#475569] border border-[#E2D9C8]"
                      >
                        {a}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-[#64748B] pt-1 flex items-center justify-between">
                    <span>Check-in: <strong>{hotel.checkInTime}</strong></span>
                    <span>Check-out: <strong>{hotel.checkOutTime}</strong></span>
                  </div>
                </div>

                {/* Important Booking Disclaimer & Buttons */}
                <div className="pt-3 border-t border-[#E2D9C8] space-y-2">
                  <div className="flex items-center justify-between">
                    <a
                      href={hotel.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-[#B85C38] hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Check on {hotel.bookingProvider.split('/')[0]}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      type="button"
                      onClick={() => onSelectHotel(hotel)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-[#174B37] text-white'
                          : 'bg-[#14243A] text-white hover:bg-[#B85C38]'
                      }`}
                    >
                      {isSelected ? 'Selected Stay ✓' : 'Select'}
                    </button>
                  </div>

                  <div className="text-[10px] text-[#94A3B8] italic flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>Booking is not auto-charged. Direct provider link used.</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E2D9C8]">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-3 rounded-xl bg-white border border-[#E2D9C8] text-[#14243A] font-bold text-xs hover:bg-[#EFE9DC] transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Transport</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-7 py-3 rounded-xl bg-[#14243A] hover:bg-[#B85C38] text-white font-bold text-xs shadow-md shadow-[#14243A]/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Generate Personalized Itinerary</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
