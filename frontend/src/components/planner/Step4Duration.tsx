'use client';

import React from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  Layers,
} from 'lucide-react';
import { CityHub, AttractionItem } from '@/data/tripPlannerData';
import { analyzeDestinationFeasibility } from '@/services/tripPlanningEngine';

interface Props {
  selectedCity: CityHub;
  selectedPlaces: AttractionItem[];
  durationDays: number;
  startDate: string;
  endDate: string;
  onChangeDurationDays: (days: number) => void;
  onChangeStartDate: (date: string) => void;
  onChangeEndDate: (date: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

const DURATION_PRESETS = [
  { days: 1, label: '1 Day', sub: 'Express Excursion' },
  { days: 2, label: '2 Days', sub: 'Weekend Getaway' },
  { days: 3, label: '3 Days', sub: 'Long Weekend Escape' },
  { days: 4, label: '4 Days', sub: 'Relaxed Deep Dive' },
  { days: 5, label: '5 Days', sub: 'Comprehensive Tour' },
  { days: 7, label: '7 Days', sub: 'Full Regional Immersion' },
];

export const Step4Duration: React.FC<Props> = ({
  selectedCity,
  selectedPlaces,
  durationDays,
  startDate,
  endDate,
  onChangeDurationDays,
  onChangeStartDate,
  onChangeEndDate,
  onPrev,
  onNext,
}) => {
  const feasibility = analyzeDestinationFeasibility(selectedPlaces, selectedCity, durationDays);
  const isPaceRushed = durationDays < feasibility.recommendedDays;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9933]/15 text-[#B85C38] text-xs font-bold uppercase tracking-wider mb-2">
          <Calendar className="w-3.5 h-3.5 text-[#FF9933]" /> Stage 4 of 8
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#14243A] font-serif tracking-tight mb-2">
          How many days do you have for this trip?
        </h2>
        <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
          Select your duration or travel dates. AI balances sightseeing hours with travel buffers, meal breaks, and evening rest.
        </p>
      </div>

      {/* Preset Day Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {DURATION_PRESETS.map((preset) => {
          const isSelected = durationDays === preset.days;
          return (
            <button
              key={preset.days}
              type="button"
              onClick={() => onChangeDurationDays(preset.days)}
              className={`p-4 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-between gap-1.5 ${
                isSelected
                  ? 'bg-[#14243A] text-white border-[#14243A] shadow-lg scale-105 ring-2 ring-[#B85C38]'
                  : 'bg-white border-[#E2D9C8] text-[#14243A] hover:border-[#B85C38]'
              }`}
            >
              <span className={`text-base font-black ${isSelected ? 'text-[#FF9933]' : 'text-[#14243A]'}`}>
                {preset.label}
              </span>
              <span className={`text-[10px] leading-tight ${isSelected ? 'text-white/80' : 'text-[#64748B]'}`}>
                {preset.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Date Pickers & Custom Number */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2D9C8] shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#14243A] uppercase tracking-wider mb-2">
            Trip Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onChangeStartDate(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#B85C38]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#14243A] uppercase tracking-wider mb-2">
            Trip End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onChangeEndDate(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#B85C38]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#14243A] uppercase tracking-wider mb-2">
            Custom Days
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={30}
              value={durationDays}
              onChange={(e) => onChangeDurationDays(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2.5 text-sm font-bold text-[#14243A] rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] focus:outline-none focus:ring-2 focus:ring-[#B85C38]"
            />
            <span className="text-xs text-[#64748B] shrink-0">Days</span>
          </div>
        </div>
      </div>

      {/* AI Duration Advisor Banner */}
      <div className={`p-5 sm:p-6 rounded-2xl border transition-all ${
        isPaceRushed
          ? 'bg-amber-500/10 border-amber-500/30 text-[#14243A]'
          : 'bg-[#174B37]/10 border-[#174B37]/30 text-[#14243A]'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isPaceRushed ? 'bg-amber-500 text-white' : 'bg-[#174B37] text-white'
          }`}>
            <Sparkles className="w-5 h-5" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold uppercase tracking-wider">
                AI Duration Advisor Evaluation
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                isPaceRushed ? 'bg-amber-500 text-white' : 'bg-[#174B37] text-white'
              }`}>
                {isPaceRushed ? 'Fast-Paced / Rushed' : 'Optimal Pace'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              {feasibility.advisorMessage}
            </p>

            {isPaceRushed && (
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onChangeDurationDays(feasibility.recommendedDays)}
                  className="px-3 py-1.5 rounded-lg bg-[#14243A] text-white text-xs font-bold hover:bg-[#B85C38] transition-all"
                >
                  Accept AI Recommendation: Extend to {feasibility.recommendedDays} Days
                </button>
                <button
                  type="button"
                  onClick={() => {}}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#E2D9C8] text-[#14243A] text-xs font-semibold"
                >
                  Keep my {durationDays}-day fast-paced plan
                </button>
              </div>
            )}
          </div>
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
          <span>Back to Budget</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-7 py-3 rounded-xl bg-[#14243A] hover:bg-[#B85C38] text-white font-bold text-xs shadow-md shadow-[#14243A]/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Next: Select Travellers</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
