'use client';

import React, { useState } from 'react';
import {
  Bus,
  Train,
  Plane,
  Car,
  Compass,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  Fuel,
  CreditCard,
  MapPin,
} from 'lucide-react';
import { CityHub, TransportOption, TRANSPORT_CATALOG } from '@/data/tripPlannerData';
import { formatCurrency } from '@/lib/utils';

interface Props {
  selectedCity: CityHub;
  departureCity: string;
  selectedTransport: TransportOption;
  onSelectTransport: (opt: TransportOption) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Step6Transportation: React.FC<Props> = ({
  selectedCity,
  departureCity,
  selectedTransport,
  onSelectTransport,
  onPrev,
  onNext,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'bus' | 'train' | 'flight' | 'car'>('all');

  // Lookup transport catalog
  const routeKey = `${(departureCity || 'bengaluru').toLowerCase()}-${selectedCity.id.toLowerCase()}`;
  const reverseRouteKey = `bengaluru-mysuru`; // reliable baseline
  const availableOptions: TransportOption[] =
    TRANSPORT_CATALOG[routeKey] ||
    TRANSPORT_CATALOG[reverseRouteKey] ||
    [
      {
        id: 'bus-std',
        type: 'bus',
        operatorOrName: 'State Express Transport Corp',
        numberOrCode: 'ST-Express',
        fromCity: departureCity || 'Departure Hub',
        toCity: selectedCity.name,
        departureTime: '06:30 AM',
        arrivalTime: '10:00 AM',
        duration: '3h 30m',
        estimatedPrice: 350,
        classType: 'Deluxe AC Seater',
        frequency: 'Every 30 mins',
        bookingUrl: 'https://www.redbus.in',
        details: ['AC semi-sleeper', 'Direct intercity route'],
      },
      {
        id: 'train-std',
        type: 'train',
        operatorOrName: 'Superfast Intercity Express',
        numberOrCode: '12601',
        fromCity: departureCity || 'Departure Hub',
        toCity: selectedCity.name,
        departureTime: '08:00 AM',
        arrivalTime: '10:30 AM',
        duration: '2h 30m',
        estimatedPrice: 280,
        classType: 'AC Chair Car (CC)',
        frequency: 'Daily',
        bookingUrl: 'https://www.irctc.co.in',
        details: ['Punctual daily train', 'Comfortable seating'],
      },
    ];

  const filteredOptions = availableOptions.filter((opt) => {
    if (activeTab === 'all') return true;
    return opt.type === activeTab;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9933]/15 text-[#B85C38] text-xs font-bold uppercase tracking-wider mb-2">
          <Bus className="w-3.5 h-3.5 text-[#FF9933]" /> Stage 6 of 8
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#14243A] font-serif tracking-tight mb-2">
          How would you like to travel?
        </h2>
        <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
          Compare verified bus schedules, Vande Bharat and express trains, flights, or driving routes from <strong>{departureCity || 'Bengaluru'}</strong> to <strong>{selectedCity.name}</strong>.
        </p>
      </div>

      {/* AI Transport Comparison Box */}
      <div className="bg-gradient-to-br from-[#14243A] to-[#1E3A5F] text-white p-5 sm:p-6 rounded-2xl shadow-md border border-white/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF9933] text-[#14243A] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              AI Transportation Comparison
            </h4>
            <p className="text-xs text-white/70">
              Analyzing route: {departureCity || 'Bengaluru'} &rarr; {selectedCity.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-white/10 border border-white/10">
            <span className="text-xs font-bold text-[#FF9933] flex items-center gap-1.5">
              <Bus className="w-3.5 h-3.5" /> Bus (KSRTC / State)
            </span>
            <p className="text-xs text-white/80 mt-1">
              ~3 hrs 15 mins • High frequency (every 15 mins) • Most budget-friendly choice (₹320 - ₹380).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 border border-white/10">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Train className="w-3.5 h-3.5" /> Train (Vande Bharat / Shatabdi)
            </span>
            <p className="text-xs text-white/80 mt-1">
              Fastest transit (~2 hrs) • Scenic corridor • Onboard meals on Vande Bharat (₹515).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 border border-white/10">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5" /> Driving / Cab
            </span>
            <p className="text-xs text-white/80 mt-1">
              ~2 hrs 30 mins via 10-Lane Expressway • Complete flexibility for en-route stops (₹2,200/car).
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/90">
          <strong className="text-[#FF9933]">AI Recommendation:</strong> Take the KSRTC Airavat Club Class bus or Vande Bharat Express for comfort, followed by local auto-rickshaws or city buses in {selectedCity.name}.
        </div>
      </div>

      {/* Mode Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2D9C8] pb-3 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-[#14243A] text-white shadow-sm'
              : 'bg-white border border-[#E2D9C8] text-[#475569] hover:border-[#B85C38]'
          }`}
        >
          All Modes ({availableOptions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bus')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'bus'
              ? 'bg-[#14243A] text-white shadow-sm'
              : 'bg-white border border-[#E2D9C8] text-[#475569] hover:border-[#B85C38]'
          }`}
        >
          <Bus className="w-3.5 h-3.5" />
          <span>Buses</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('train')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'train'
              ? 'bg-[#14243A] text-white shadow-sm'
              : 'bg-white border border-[#E2D9C8] text-[#475569] hover:border-[#B85C38]'
          }`}
        >
          <Train className="w-3.5 h-3.5" />
          <span>Trains</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('car')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'car'
              ? 'bg-[#14243A] text-white shadow-sm'
              : 'bg-white border border-[#E2D9C8] text-[#475569] hover:border-[#B85C38]'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>Self-Drive / Cabs</span>
        </button>
      </div>

      {/* Available Transportation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOptions.map((opt) => {
          const isSelected = selectedTransport?.id === opt.id;
          const isBus = opt.type === 'bus';
          const isTrain = opt.type === 'train';

          return (
            <div
              key={opt.id}
              onClick={() => onSelectTransport(opt)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#B85C38] ring-2 ring-[#B85C38] shadow-lg scale-[1.01]'
                  : 'bg-white border-[#E2D9C8] hover:border-[#B85C38]/50 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#F7F4EC] border border-[#E2D9C8] flex items-center justify-center text-[#14243A]">
                      {isBus ? <Bus className="w-4 h-4 text-[#B85C38]" /> : isTrain ? <Train className="w-4 h-4 text-[#14243A]" /> : <Car className="w-4 h-4 text-[#174B37]" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#14243A]">{opt.operatorOrName}</h4>
                      <span className="text-[11px] text-[#64748B] font-mono">{opt.numberOrCode} • {opt.classType}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-[#B85C38]">
                      {formatCurrency(opt.estimatedPrice)}
                    </span>
                    <span className="text-[10px] text-[#64748B] block">per person</span>
                  </div>
                </div>

                {/* Timing Bar */}
                <div className="bg-[#F7F4EC] p-3 rounded-xl border border-[#E2D9C8] flex items-center justify-between my-3 text-xs">
                  <div>
                    <span className="font-black text-[#14243A] text-sm block">{opt.departureTime}</span>
                    <span className="text-[10px] text-[#64748B] line-clamp-1">{opt.fromCity}</span>
                  </div>

                  <div className="flex flex-col items-center px-2">
                    <span className="text-[10px] font-bold text-[#64748B]">{opt.duration}</span>
                    <div className="w-16 h-0.5 bg-[#E2D9C8] my-0.5 relative">
                      <div className="w-2 h-2 rounded-full bg-[#B85C38] absolute -top-0.5 right-0" />
                    </div>
                    <span className="text-[9px] text-[#94A3B8]">{opt.frequency}</span>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-[#14243A] text-sm block">{opt.arrivalTime}</span>
                    <span className="text-[10px] text-[#64748B] line-clamp-1">{opt.toCity}</span>
                  </div>
                </div>

                {/* Bullets */}
                <ul className="space-y-1 mb-4">
                  {opt.details.map((d, i) => (
                    <li key={i} className="text-[11px] text-[#475569] flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-[#174B37] shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E2D9C8] flex items-center justify-between">
                <a
                  href={opt.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-[#64748B] hover:text-[#B85C38] font-semibold inline-flex items-center gap-1"
                >
                  <span>Official Booking Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={() => onSelectTransport(opt)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#174B37] text-white'
                      : 'bg-[#14243A] text-white hover:bg-[#B85C38]'
                  }`}
                >
                  {isSelected ? 'Selected Transit ✓' : 'Select'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Local City Transit Guidance (e.g. Mysuru City Buses) */}
      <div className="bg-[#EFE9DC] p-5 rounded-2xl border border-[#E2D9C8] space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#14243A] flex items-center gap-2">
          <Bus className="w-4 h-4 text-[#FF9933]" />
          Verified Local Transit in {selectedCity.name}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#475569] pt-1">
          <div className="bg-white p-3 rounded-xl border border-[#E2D9C8]">
            <strong className="text-[#14243A] block mb-0.5">City Bus #201 / #202</strong>
            <span>Direct frequency from Suburban Bus Stand to Chamundi Hill summit (Fare: ₹20-30).</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#E2D9C8]">
            <strong className="text-[#14243A] block mb-0.5">City Bus #303</strong>
            <span>Connects City Bus Stand directly to KRS Dam / Brindavan Gardens (Fare: ₹35).</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#E2D9C8]">
            <strong className="text-[#14243A] block mb-0.5">Prepaid Auto Rickshaws</strong>
            <span>Available at Mysuru Railway Station exit and Suburb Bus Stand with meter regulation.</span>
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
          <span>Back to Travellers</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-7 py-3 rounded-xl bg-[#14243A] hover:bg-[#B85C38] text-white font-bold text-xs shadow-md shadow-[#14243A]/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Next: Select Accommodation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
