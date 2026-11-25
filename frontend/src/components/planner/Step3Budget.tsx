'use client';

import React from 'react';
import {
  Wallet,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  ShieldAlert,
  Users,
  User,
  Info,
} from 'lucide-react';
import { CityHub, AttractionItem } from '@/data/tripPlannerData';
import { calculateBudgetBreakdown, BudgetBreakdown } from '@/services/tripPlanningEngine';
import { formatCurrency } from '@/lib/utils';

interface Props {
  selectedCity: CityHub;
  selectedPlaces: AttractionItem[];
  budgetAmount: number;
  budgetType: 'per_person' | 'total_group';
  travellersCount: number;
  durationDays: number;
  onChangeBudgetAmount: (val: number) => void;
  onChangeBudgetType: (val: 'per_person' | 'total_group') => void;
  onPrev: () => void;
  onNext: () => void;
}

const SUGGESTED_RANGES = [
  { label: 'Under ₹2,000', value: 2000, desc: 'Budget backpacker / Day excursion' },
  { label: '₹2,000 – ₹5,000', value: 4500, desc: 'Comfortable budget traveler' },
  { label: '₹5,000 – ₹10,000', value: 8000, desc: 'Standard mid-range getaway' },
  { label: '₹10,000 – ₹20,000', value: 15000, desc: 'Premium sightseeing & dining' },
  { label: '₹20,000 – ₹50,000', value: 30000, desc: 'Luxury heritage & resorts' },
  { label: '₹50,000+', value: 50000, desc: 'Ultra-exclusive royal tour' },
];

export const Step3Budget: React.FC<Props> = ({
  selectedCity,
  selectedPlaces,
  budgetAmount,
  budgetType,
  travellersCount,
  durationDays,
  onChangeBudgetAmount,
  onChangeBudgetType,
  onPrev,
  onNext,
}) => {
  const breakdown: BudgetBreakdown = calculateBudgetBreakdown(
    budgetAmount,
    budgetType,
    travellersCount,
    durationDays
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9933]/15 text-[#B85C38] text-xs font-bold uppercase tracking-wider mb-2">
          <Wallet className="w-3.5 h-3.5 text-[#FF9933]" /> Stage 3 of 8
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#14243A] font-serif tracking-tight mb-2">
          What is your total trip budget?
        </h2>
        <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
          AI will allocate your funds into realistic portions for transportation, hotels, local food, entry fees, and emergency reserves.
        </p>
      </div>

      {/* Per Person vs Total Group Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2D9C8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#14243A]">Budget Calculation Mode</h4>
          <p className="text-xs text-[#64748B]">Is this budget specified per individual traveler, or the collective total?</p>
        </div>

        <div className="inline-flex p-1 bg-[#EFE9DC] rounded-xl border border-[#E2D9C8] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onChangeBudgetType('per_person')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              budgetType === 'per_person'
                ? 'bg-[#14243A] text-white shadow-sm'
                : 'text-[#475569] hover:text-[#14243A]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Per Person</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeBudgetType('total_group')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              budgetType === 'total_group'
                ? 'bg-[#14243A] text-white shadow-sm'
                : 'text-[#475569] hover:text-[#14243A]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Total Group</span>
          </button>
        </div>
      </div>

      {/* Suggested Range Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {SUGGESTED_RANGES.map((rng) => {
          const isSelected = budgetAmount === rng.value;
          return (
            <button
              key={rng.label}
              type="button"
              onClick={() => onChangeBudgetAmount(rng.value)}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
                isSelected
                  ? 'bg-[#14243A] text-white border-[#14243A] shadow-md scale-105'
                  : 'bg-white border-[#E2D9C8] text-[#14243A] hover:border-[#B85C38]'
              }`}
            >
              <span className={`text-xs font-bold ${isSelected ? 'text-[#FF9933]' : 'text-[#B85C38]'}`}>
                {rng.label}
              </span>
              <span className={`text-[10px] mt-1 line-clamp-2 ${isSelected ? 'text-white/70' : 'text-[#64748B]'}`}>
                {rng.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom Budget Slider & Number Input */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2D9C8] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="text-xs font-bold text-[#14243A] uppercase tracking-wider block">
              Set Exact Budget Amount (INR)
            </label>
            <span className="text-xs text-[#64748B]">
              {budgetType === 'per_person' ? 'Per Person Budget' : 'Total Group Budget for All Travelers'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#14243A] font-serif">
              ₹
            </span>
            <input
              type="number"
              min={1000}
              max={250000}
              step={500}
              value={budgetAmount}
              onChange={(e) => onChangeBudgetAmount(Number(e.target.value))}
              className="w-36 sm:w-44 px-3 py-2 text-xl sm:text-2xl font-black text-[#14243A] rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] focus:outline-none focus:ring-2 focus:ring-[#B85C38]"
            />
          </div>
        </div>

        <input
          type="range"
          min={1500}
          max={60000}
          step={500}
          value={budgetAmount}
          onChange={(e) => onChangeBudgetAmount(Number(e.target.value))}
          className="w-full h-2 bg-[#EFE9DC] rounded-lg appearance-none cursor-pointer accent-[#B85C38]"
        />

        <div className="flex justify-between text-[11px] text-[#94A3B8]">
          <span>₹1,500</span>
          <span>₹15,000</span>
          <span>₹30,000</span>
          <span>₹45,000</span>
          <span>₹60,000+</span>
        </div>
      </div>

      {/* AI Budget Intelligence & 8-Category Allocation */}
      <div className="bg-gradient-to-br from-[#14243A] to-[#1E3A5F] text-white p-5 sm:p-7 rounded-2xl shadow-md border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF9933] text-[#14243A] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                AI Budget Intelligence
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  breakdown.status === 'comfortable' ? 'bg-[#138808] text-white' :
                  breakdown.status === 'tight' ? 'bg-amber-500 text-white' :
                  breakdown.status === 'exceeded' ? 'bg-rose-500 text-white' : 'bg-cyan-500 text-navy-950'
                }`}>
                  {breakdown.status}
                </span>
              </h3>
              <p className="text-xs text-white/70">
                Effective Total: <strong>₹{breakdown.effectiveBudget.toLocaleString()}</strong> (~₹{breakdown.perDayPerPerson.toLocaleString()}/day per person)
              </p>
            </div>
          </div>

          {breakdown.warningMessage && (
            <div className="text-xs bg-rose-500/20 text-rose-200 border border-rose-500/40 p-2.5 rounded-xl flex items-center gap-2 max-w-md">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{breakdown.warningMessage}</span>
            </div>
          )}
        </div>

        {/* 8-Category Allocation Grid */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF9933] mb-3">
            Estimated 8-Category Expense Allocation
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
              <span className="text-[11px] text-white/60 block">1. Inter-city Transit</span>
              <strong className="text-base text-white block mt-0.5">₹{breakdown.categories.transport.toLocaleString()}</strong>
              <span className="text-[10px] text-white/50">Bus / Train tickets</span>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
              <span className="text-[11px] text-white/60 block">2. Accommodation</span>
              <strong className="text-base text-white block mt-0.5">₹{breakdown.categories.accommodation.toLocaleString()}</strong>
              <span className="text-[10px] text-white/50">Hotel / Hostel nights</span>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
              <span className="text-[11px] text-white/60 block">3. Food & Dining</span>
              <strong className="text-base text-white block mt-0.5">₹{breakdown.categories.food.toLocaleString()}</strong>
              <span className="text-[10px] text-white/50">Meals, snacks, tiffins</span>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
              <span className="text-[11px] text-white/60 block">4. Local Transport</span>
              <strong className="text-base text-white block mt-0.5">₹{breakdown.categories.localTransit.toLocaleString()}</strong>
              <span className="text-[10px] text-white/50">Autos, city buses</span>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
              <span className="text-[11px] text-white/60 block">5. Attraction Fees</span>
              <strong className="text-base text-white block mt-0.5">₹{breakdown.categories.attractionFees.toLocaleString()}</strong>
              <span className="text-[10px] text-white/50">Palace & museum tickets</span>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
              <span className="text-[11px] text-white/60 block">6. Activities</span>
              <strong className="text-base text-white block mt-0.5">₹{breakdown.categories.activities.toLocaleString()}</strong>
              <span className="text-[10px] text-white/50">Boating, guides, light shows</span>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
              <span className="text-[11px] text-[#FF9933] block">7. Emergency Reserve</span>
              <strong className="text-base text-white block mt-0.5">₹{breakdown.categories.emergencyReserve.toLocaleString()}</strong>
              <span className="text-[10px] text-white/50">WAYNEX Safe buffer</span>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/10">
              <span className="text-[11px] text-white/60 block">8. Miscellaneous</span>
              <strong className="text-base text-white block mt-0.5">₹{breakdown.categories.miscellaneous.toLocaleString()}</strong>
              <span className="text-[10px] text-white/50">Souvenirs & shopping</span>
            </div>
          </div>
        </div>

        {/* AI Recommendations & Suggestions */}
        {breakdown.suggestions.length > 0 && (
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-xs space-y-1.5">
            <span className="font-bold text-[#FF9933] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> AI Budget Recommendations:
            </span>
            <ul className="space-y-1 text-white/80 list-disc list-inside">
              {breakdown.suggestions.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E2D9C8]">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-3 rounded-xl bg-white border border-[#E2D9C8] text-[#14243A] font-bold text-xs hover:bg-[#EFE9DC] transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Places</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-7 py-3 rounded-xl bg-[#14243A] hover:bg-[#B85C38] text-white font-bold text-xs shadow-md shadow-[#14243A]/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Next: Select Duration</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
