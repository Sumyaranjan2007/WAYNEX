'use client';

import React from 'react';
import {
  Users,
  User,
  Heart,
  Smile,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Camera,
  Coffee,
  Check,
} from 'lucide-react';

interface Props {
  travellerType: 'solo' | 'couple' | 'friends' | 'family';
  adultsCount: number;
  childrenCount: number;
  specialPreferences: string[];
  onChangeTravellerType: (type: 'solo' | 'couple' | 'friends' | 'family') => void;
  onChangeAdultsCount: (cnt: number) => void;
  onChangeChildrenCount: (cnt: number) => void;
  onTogglePreference: (pref: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

const TRAVELLER_TYPES = [
  {
    id: 'solo',
    title: 'Solo Explorer',
    subtitle: 'Independent & Flexible',
    icon: User,
    description: 'Affordable backpacker hostels, verified community stays, solo-safe night routes, and personal discovery.',
    color: '#FF9933',
    features: ['Hostels & budget stays', 'Safe transit verified', 'Solo-friendly cafes', 'WAYNEX Safe emergency'],
  },
  {
    id: 'couple',
    title: 'Couple Getaway',
    subtitle: 'Romantic & Scenic',
    icon: Heart,
    description: 'Charming boutique stays, scenic sunsets, couple-friendly heritage properties, and candlelit dinners.',
    color: '#B85C38',
    features: ['Couple-friendly verified', 'Scenic viewpoint timings', 'Private dining spots', 'Relaxed leisurely pace'],
  },
  {
    id: 'friends',
    title: 'Friends Adventure',
    subtitle: 'High Energy & Group Fun',
    icon: Smile,
    description: 'Thrilling group activities, cost-sharing allocations, nightlife, viewpoints, and street food safaris.',
    color: '#14243A',
    features: ['Group room discounts', 'Adventure & sports', 'Cost-sharing breakdown', 'Evening musical fountains'],
  },
  {
    id: 'family',
    title: 'Family Vacation',
    subtitle: 'Comfortable & All-Ages',
    icon: Users,
    description: 'Child-friendly parks, senior accessibility, spacious hotel rooms, dependable transit, and hygienic dining.',
    color: '#174B37',
    features: ['Electric buggies at zoo', 'Wheelchair accessibility', 'Spacious family suites', 'Mild hygienic meals'],
  },
];

const PREFERENCES_LIST = [
  'Relaxed leisurely pace',
  'Early morning starts (less crowd)',
  'Photography & heritage architecture',
  'Strict vegetarian dining',
  'Street food & local bazaars',
  'Adventure & nature hikes',
  'Spiritual temple rituals & aarti',
];

export const Step5TravellerType: React.FC<Props> = ({
  travellerType,
  adultsCount,
  childrenCount,
  specialPreferences,
  onChangeTravellerType,
  onChangeAdultsCount,
  onChangeChildrenCount,
  onTogglePreference,
  onPrev,
  onNext,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9933]/15 text-[#B85C38] text-xs font-bold uppercase tracking-wider mb-2">
          <Users className="w-3.5 h-3.5 text-[#FF9933]" /> Stage 5 of 8
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#14243A] font-serif tracking-tight mb-2">
          Who are you travelling with?
        </h2>
        <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
          AI tailors accommodation safety, pace of activities, transport comfort, and food recommendations to match your party.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TRAVELLER_TYPES.map((t) => {
          const isSelected = travellerType === t.id;
          const Icon = t.icon;

          return (
            <div
              key={t.id}
              onClick={() => onChangeTravellerType(t.id as any)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#B85C38] ring-2 ring-[#B85C38] shadow-lg scale-[1.02]'
                  : 'bg-white border-[#E2D9C8] hover:border-[#B85C38]/50 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${t.color}15`, color: t.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#174B37] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#14243A] font-serif">{t.title}</h3>
                <span className="text-xs font-semibold text-[#B85C38] block mb-2">{t.subtitle}</span>
                <p className="text-xs text-[#475569] leading-relaxed mb-4">{t.description}</p>
              </div>

              <div className="pt-3 border-t border-[#E2D9C8] space-y-1.5">
                {t.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#174B37] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Headcount Selectors */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2D9C8] shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold text-[#14243A] uppercase tracking-wider block mb-1">
            Adults (Age 12+)
          </label>
          <p className="text-xs text-[#64748B] mb-3">For ticket counts and hotel occupancy</p>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onChangeAdultsCount(num)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  adultsCount === num
                    ? 'bg-[#14243A] text-white shadow-md'
                    : 'bg-[#F7F4EC] text-[#14243A] border border-[#E2D9C8] hover:border-[#B85C38]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#14243A] uppercase tracking-wider block mb-1">
            Children (Age 0 - 11)
          </label>
          <p className="text-xs text-[#64748B] mb-3">Many attractions offer discounted or free child entry</p>
          <div className="flex items-center gap-3">
            {[0, 1, 2, 3, 4].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onChangeChildrenCount(num)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  childrenCount === num
                    ? 'bg-[#14243A] text-white shadow-md'
                    : 'bg-[#F7F4EC] text-[#14243A] border border-[#E2D9C8] hover:border-[#B85C38]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preferences Chips */}
      <div className="bg-[#EFE9DC] p-5 rounded-2xl border border-[#E2D9C8] space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#14243A] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF9933]" />
          Additional Travel Preferences (Optional)
        </h4>
        <div className="flex flex-wrap gap-2">
          {PREFERENCES_LIST.map((pref) => {
            const isSelected = specialPreferences.includes(pref);
            return (
              <button
                key={pref}
                type="button"
                onClick={() => onTogglePreference(pref)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#14243A] text-white shadow-sm'
                    : 'bg-white border border-[#E2D9C8] text-[#475569] hover:border-[#B85C38]'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {pref}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E2D9C8]">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-3 rounded-xl bg-white border border-[#E2D9C8] text-[#14243A] font-bold text-xs hover:bg-[#EFE9DC] transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Duration</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-7 py-3 rounded-xl bg-[#14243A] hover:bg-[#B85C38] text-white font-bold text-xs shadow-md shadow-[#14243A]/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Next: Select Transportation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
