'use client';

import React from 'react';
import {
  MapPin,
  Compass,
  Wallet,
  Calendar,
  Users,
  Bus,
  Hotel,
  Sparkles,
  Check,
} from 'lucide-react';

interface Props {
  currentStep: number;
  onStepClick: (step: number) => void;
  maxCompletedStep: number;
}

export const STAGES = [
  { step: 1, label: 'Destination', short: 'City', icon: MapPin },
  { step: 2, label: 'Places to Visit', short: 'Attractions', icon: Compass },
  { step: 3, label: 'Trip Budget', short: 'Budget', icon: Wallet },
  { step: 4, label: 'Duration', short: 'Days', icon: Calendar },
  { step: 5, label: 'Traveller Type', short: 'Party', icon: Users },
  { step: 6, label: 'Transport', short: 'Transit', icon: Bus },
  { step: 7, label: 'Stay & Hotel', short: 'Stay', icon: Hotel },
  { step: 8, label: 'Personalized Plan', short: 'Itinerary', icon: Sparkles },
];

export const PlannerProgressBar: React.FC<Props> = ({
  currentStep,
  onStepClick,
  maxCompletedStep,
}) => {
  return (
    <div className="w-full bg-white border border-[#E2D9C8] rounded-2xl p-3 sm:p-4 shadow-sm mb-8">
      {/* Step Numbers & Labels */}
      <div className="flex items-center justify-between overflow-x-auto pb-2 sm:pb-0 gap-2 scrollbar-none">
        {STAGES.map((s, idx) => {
          const isCompleted = s.step < currentStep;
          const isActive = s.step === currentStep;
          const isClickable = s.step <= maxCompletedStep || s.step <= currentStep;
          const Icon = s.icon;

          return (
            <div key={s.step} className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(s.step)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#14243A] text-white shadow-md shadow-[#14243A]/20 scale-105'
                    : isCompleted
                    ? 'bg-[#174B37]/10 text-[#174B37] hover:bg-[#174B37]/20 cursor-pointer'
                    : isClickable
                    ? 'bg-[#F7F4EC] text-[#64748B] hover:text-[#14243A] hover:bg-[#EFE9DC] cursor-pointer'
                    : 'bg-[#F7F4EC]/60 text-[#94A3B8] opacity-60 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-[#FF9933] text-[#14243A]'
                      : isCompleted
                      ? 'bg-[#174B37] text-white'
                      : 'bg-[#E2D9C8] text-[#64748B]'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : s.step}
                </div>
                <span className="hidden md:inline">{s.label}</span>
                <span className="md:hidden">{s.short}</span>
              </button>

              {idx < STAGES.length - 1 && (
                <div
                  className={`hidden lg:block w-4 h-0.5 rounded-full ${
                    s.step < currentStep ? 'bg-[#174B37]' : 'bg-[#E2D9C8]'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Line */}
      <div className="w-full bg-[#EFE9DC] h-1.5 rounded-full mt-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#FF9933] via-[#B85C38] to-[#174B37] h-full transition-all duration-500 rounded-full"
          style={{ width: `${((currentStep - 1) / (STAGES.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};
