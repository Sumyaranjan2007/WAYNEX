'use client';

import React, { useState } from 'react';
import {
  Compass,
  Check,
  Plus,
  Clock,
  MapPin,
  Tag,
  DollarSign,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  GripVertical,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { CityHub, AttractionItem } from '@/data/tripPlannerData';
import { getAttractionsForCity, analyzeDestinationFeasibility } from '@/services/tripPlanningEngine';
import { RobustImage } from '@/components/ui/RobustImage';

interface Props {
  selectedCity: CityHub;
  selectedPlaces: AttractionItem[];
  onTogglePlace: (place: AttractionItem) => void;
  onSetSelectedPlaces: (places: AttractionItem[]) => void;
  onPrev: () => void;
  onNext: () => void;
}

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Places' },
  { id: 'historical', label: 'Historical & Palaces' },
  { id: 'temples', label: 'Temples & Heritage' },
  { id: 'nature', label: 'Nature & Lakes' },
  { id: 'wildlife', label: 'Wildlife & Zoos' },
  { id: 'family', label: 'Family & Gardens' },
  { id: 'museums', label: 'Museums & Art' },
  { id: 'hidden_gem', label: 'Hidden Gems' },
];

export const Step2PlacesToVisit: React.FC<Props> = ({
  selectedCity,
  selectedPlaces,
  onTogglePlace,
  onSetSelectedPlaces,
  onPrev,
  onNext,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const allAttractions = getAttractionsForCity(selectedCity.id);

  const filteredAttractions = allAttractions.filter((place) => {
    if (selectedFilter === 'all') return true;
    return place.category.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  // Run AI Destination Feasibility Advisor
  const feasibility = analyzeDestinationFeasibility(selectedPlaces, selectedCity);

  const handleSelectAll = () => {
    onSetSelectedPlaces(allAttractions);
  };

  const handleClearAll = () => {
    onSetSelectedPlaces([]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9933]/15 text-[#B85C38] text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-[#FF9933]" /> Stage 2 of 8
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#14243A] font-serif tracking-tight">
            Select Attractions in {selectedCity.name}
          </h2>
          <p className="text-[#64748B] text-sm sm:text-base mt-1">
            Choose what you want to see. AI will calculate travel feasibility, opening hours, and organize the ideal visiting order.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-white border border-[#E2D9C8] text-[#14243A] hover:bg-[#EFE9DC] transition-all"
          >
            Select All ({allAttractions.length})
          </button>
          {selectedPlaces.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-bold px-3 py-2 rounded-xl bg-white border border-[#E2D9C8] text-[#B85C38] hover:bg-rose-50 transition-all"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* Filter Categories Horizontal Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_FILTERS.map((cat) => {
          const isActive = selectedFilter === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#14243A] text-white shadow-sm'
                  : 'bg-white border border-[#E2D9C8] text-[#475569] hover:border-[#B85C38]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* AI Destination Advisor Box (Contextual Feedback) */}
      {selectedPlaces.length > 0 && (
        <div className="bg-gradient-to-br from-[#14243A] to-[#1E3A5F] text-white rounded-2xl p-5 sm:p-6 shadow-md border border-white/10 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FF9933] text-[#14243A] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  AI Destination Advisor
                  <span className="text-[10px] bg-white/20 text-[#FF9933] font-bold px-2 py-0.5 rounded-full uppercase">
                    Feasibility Analysis
                  </span>
                </h4>
                <p className="text-xs text-white/70">
                  {selectedPlaces.length} destination{selectedPlaces.length > 1 ? 's' : ''} selected • ~{feasibility.totalSightseeingHours.toFixed(1)} hrs estimated sightseeing
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-[#FF9933] block uppercase tracking-wider font-bold">Recommended Duration</span>
              <span className="text-xl sm:text-2xl font-black text-white">
                {feasibility.recommendedDays} Day{feasibility.recommendedDays > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/10">
            {feasibility.advisorMessage}
          </p>

          {/* AI Recommended Daily Breakdown Clusters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {feasibility.dayClusters.map((cluster) => (
              <div
                key={cluster.dayNumber}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#FF9933]">Day {cluster.dayNumber}</span>
                  <span className="text-[10px] text-white/60">{cluster.places.length} places</span>
                </div>
                <h5 className="text-xs font-semibold text-white/90 line-clamp-1">{cluster.theme}</h5>
                <ul className="text-[11px] text-white/75 space-y-1">
                  {cluster.places.map((p) => (
                    <li key={p.id} className="flex items-center gap-1.5 line-clamp-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#138808] shrink-0" />
                      <span>{p.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attractions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAttractions.map((place) => {
          const isSelected = selectedPlaces.some((p) => p.id === place.id);

          return (
            <div
              key={place.id}
              className={`rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#B85C38] ring-2 ring-[#B85C38] shadow-lg'
                  : 'bg-white border-[#E2D9C8] hover:border-[#B85C38]/50 hover:shadow-md'
              }`}
            >
              {/* Attraction Photo & Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-[#14243A]">
                <RobustImage
                  src={place.image}
                  stateSlug={selectedCity.stateSlug}
                  alt={place.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14243A] via-[#14243A]/30 to-transparent" />

                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#14243A]/80 backdrop-blur-md text-[#FF9933] border border-white/10 uppercase tracking-wider">
                    {place.category}
                  </span>
                  {place.distanceFromCityCenterKm > 0 && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                      {place.distanceFromCityCenterKm} km away
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 left-3 right-3">
                  <h4 className="text-lg font-bold text-white font-serif leading-tight">
                    {place.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-white/80 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FF9933]" />
                      ~{place.approxVisitingHours} hrs
                    </span>
                    <span>•</span>
                    <span className="line-clamp-1">{place.openingHours.split('(')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Details & Travel Tips */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-[#475569] leading-relaxed line-clamp-3">
                  {place.shortDescription}
                </p>

                {place.entryFee && (
                  <div className="text-[11px] text-[#64748B] flex items-center gap-1.5 bg-[#F7F4EC] p-2 rounded-lg border border-[#E2D9C8]">
                    <Tag className="w-3 h-3 text-[#B85C38] shrink-0" />
                    <span className="font-medium text-[#14243A] line-clamp-1">{place.entryFee}</span>
                  </div>
                )}

                {place.travelTips && (
                  <p className="text-[11px] text-[#64748B] italic line-clamp-2">
                    Tip: {place.travelTips}
                  </p>
                )}

                {/* Interactive Add / Remove Button */}
                <div className="pt-2 border-t border-[#E2D9C8]">
                  <button
                    type="button"
                    onClick={() => onTogglePlace(place)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-[#174B37] text-white shadow-sm hover:bg-[#138808]'
                        : 'bg-[#F7F4EC] text-[#14243A] border border-[#E2D9C8] hover:bg-[#14243A] hover:text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Added to Trip (Click to Remove)</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add to Trip</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Places Tray / Summary */}
      {selectedPlaces.length > 0 && (
        <div className="bg-white border border-[#E2D9C8] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#14243A] uppercase tracking-wider flex items-center gap-2">
              <Check className="w-4 h-4 text-[#174B37]" />
              Selected Destinations ({selectedPlaces.length})
            </h4>
            <span className="text-xs text-[#64748B]">
              Total Time: ~{feasibility.totalSightseeingHours.toFixed(1)} hrs
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedPlaces.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-xs font-semibold text-[#14243A]"
              >
                <span>{p.name}</span>
                <button
                  type="button"
                  onClick={() => onTogglePlace(p)}
                  className="hover:text-[#B85C38] text-[#94A3B8]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E2D9C8]">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-3 rounded-xl bg-white border border-[#E2D9C8] text-[#14243A] font-bold text-xs hover:bg-[#EFE9DC] transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Destination</span>
        </button>

        <button
          type="button"
          disabled={selectedPlaces.length === 0}
          onClick={onNext}
          className={`px-7 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 ${
            selectedPlaces.length > 0
              ? 'bg-[#14243A] hover:bg-[#B85C38] text-white shadow-[#14243A]/20 cursor-pointer'
              : 'bg-[#E2D9C8] text-[#94A3B8] cursor-not-allowed'
          }`}
        >
          <span>Next: Select Budget ({selectedPlaces.length} places)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
