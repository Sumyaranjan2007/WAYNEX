'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Compass,
  Bus,
  Train,
  Car,
  Hotel,
  Utensils,
  Wallet,
  Users,
  Video,
  Play,
  Share2,
  Download,
  Bookmark,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Languages,
  CloudSun,
  Printer,
  ArrowLeft,
  X,
} from 'lucide-react';
import {
  CompleteTripPlan,
  ItineraryDay,
  ItineraryActivity,
  saveTripToLocalStorage,
} from '@/services/tripPlanningEngine';
import { YouTubeGuide, LanguagePhrase } from '@/data/tripPlannerData';
import { RobustImage } from '@/components/ui/RobustImage';
import { formatCurrency } from '@/lib/utils';

interface Props {
  tripPlan: CompleteTripPlan;
  onEditStep: (step: number) => void;
  onSaveTrip: () => void;
  isSaved: boolean;
}

export const Step8FinalItinerary: React.FC<Props> = ({
  tripPlan,
  onEditStep,
  onSaveTrip,
  isSaved,
}) => {
  const [activeDayTab, setActiveDayTab] = useState(1);
  const [activeVideoModal, setActiveVideoModal] = useState<YouTubeGuide | null>(null);
  const [showLanguageHelp, setShowLanguageHelp] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const {
    title,
    destinationCity,
    departureCity,
    durationDays,
    budget,
    travellerType,
    adultsCount,
    childrenCount,
    selectedTransport,
    selectedHotel,
    selectedPlaces,
    itineraryDays,
    allVideos,
    localPhrases,
    emergencyInfo,
  } = tripPlan;

  const currentDay = itineraryDays.find((d) => d.dayNumber === activeDayTab) || itineraryDays[0];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Banner & Control Bar */}
      <div className="bg-[#14243A] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-[#B85C38]/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF9933]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#FF9933] text-[#14243A] uppercase tracking-wider">
                Personalized AI Travel Plan
              </span>
              <span className="text-xs text-white/70">
                Created for {travellerType.toUpperCase()} ({adultsCount} Adult{adultsCount > 1 ? 's' : ''})
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight">
              {destinationCity.name} {durationDays}-Day Expedition
            </h1>

            <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
              From {departureCity || 'Bengaluru'} to {destinationCity.name}, {destinationCity.state}. A complete chronological roadmap covering {selectedPlaces.length} attractions, authentic regional meals, comfortable transit, and local culture.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onSaveTrip}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                isSaved
                  ? 'bg-[#174B37] text-white'
                  : 'bg-[#FF9933] text-[#14243A] hover:bg-[#B85C38] hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isSaved ? 'Saved to My Trips ✓' : 'Save Itinerary'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5 border border-white/20"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Export / Print</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5 border border-white/20"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? 'Copied Link!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Quick Facts Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div>
            <span className="text-white/60 block text-[11px]">Departure Location</span>
            <strong className="text-white font-medium block mt-0.5">{departureCity || 'Bengaluru'}</strong>
          </div>
          <div>
            <span className="text-white/60 block text-[11px]">Selected Transport</span>
            <strong className="text-[#FF9933] font-medium block mt-0.5">{selectedTransport?.operatorOrName || 'KSRTC Express'}</strong>
          </div>
          <div>
            <span className="text-white/60 block text-[11px]">Stay / Hotel</span>
            <strong className="text-white font-medium block mt-0.5 line-clamp-1">{selectedHotel?.name || 'Heritage Hotel'}</strong>
          </div>
          <div>
            <span className="text-white/60 block text-[11px]">Total Budget</span>
            <strong className="text-[#FF9933] font-bold block mt-0.5">₹{budget.effectiveBudget.toLocaleString()}</strong>
          </div>
          <div>
            <span className="text-white/60 block text-[11px]">Places to Visit</span>
            <strong className="text-white font-medium block mt-0.5">{selectedPlaces.length} Destinations</strong>
          </div>
        </div>
      </div>

      {/* SECTION B: DEPARTURE & TRANSIT PLAN */}
      <div className="bg-white rounded-2xl border border-[#E2D9C8] p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-[#14243A] flex items-center gap-2">
            <Bus className="w-5 h-5 text-[#B85C38]" />
            Departure & Arrival Plan
          </h3>
          <button
            type="button"
            onClick={() => onEditStep(6)}
            className="text-xs text-[#B85C38] hover:underline font-bold"
          >
            Change Transport &rarr;
          </button>
        </div>

        <div className="bg-[#F7F4EC] p-4 rounded-xl border border-[#E2D9C8] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#14243A]">{selectedTransport?.operatorOrName}</span>
              <span className="text-[10px] bg-[#14243A] text-white px-2 py-0.5 rounded font-mono">{selectedTransport?.numberOrCode}</span>
            </div>
            <p className="text-xs text-[#475569]">
              Departure: <strong>{selectedTransport?.departureTime}</strong> from {departureCity || 'Origin'} &rarr; Arrival: <strong>{selectedTransport?.arrivalTime}</strong> at {destinationCity.name}
            </p>
            <span className="text-[11px] text-[#64748B] block">
              Estimated fare: <strong>{formatCurrency(selectedTransport?.estimatedPrice || 380)}/person</strong> • Duration: {selectedTransport?.duration}
            </span>
          </div>

          <a
            href={selectedTransport?.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#14243A] hover:bg-[#B85C38] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Book Tickets on Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* SECTION C & D: DAY-WISE CHRONOLOGICAL ITINERARY */}
      <div className="space-y-6">
        {/* Day Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {itineraryDays.map((d) => (
            <button
              key={d.dayNumber}
              type="button"
              onClick={() => setActiveDayTab(d.dayNumber)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
                activeDayTab === d.dayNumber
                  ? 'bg-[#14243A] text-white shadow-md'
                  : 'bg-white border border-[#E2D9C8] text-[#475569] hover:border-[#B85C38]'
              }`}
            >
              <span>Day {d.dayNumber}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeDayTab === d.dayNumber ? 'bg-[#FF9933] text-[#14243A]' : 'bg-[#EFE9DC] text-[#64748B]'}`}>
                {d.morningPlan.length + d.afternoonPlan.length + d.eveningPlan.length} activities
              </span>
            </button>
          ))}
        </div>

        {/* Active Day Content Header */}
        <div className="bg-[#EFE9DC] border border-[#E2D9C8] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#B85C38] font-bold uppercase tracking-wider mb-0.5">
              <span>Day {currentDay.dayNumber} Itinerary</span>
              <span>•</span>
              <span>Estimated Daily Spend: ₹{currentDay.estimatedExpense.toLocaleString()}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#14243A] font-serif">
              {currentDay.theme}
            </h3>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-[#E2D9C8] text-[#14243A] font-semibold hover:bg-[#F7F4EC]"
            >
              Add / Reorder Places
            </button>
          </div>
        </div>

        {/* Chronological Timeline Activities */}
        <div className="space-y-4">
          {[
            { phase: 'Morning Exploration', items: currentDay.morningPlan, color: '#FF9933' },
            { phase: 'Afternoon & Lunch', items: currentDay.afternoonPlan, color: '#B85C38' },
            { phase: 'Evening & Sunset', items: currentDay.eveningPlan, color: '#14243A' },
            { phase: 'Night & Rest', items: currentDay.nightPlan, color: '#174B37' },
          ].map((phaseSection) => {
            if (phaseSection.items.length === 0) return null;

            return (
              <div key={phaseSection.phase} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: phaseSection.color }}
                  />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#14243A]">
                    {phaseSection.phase}
                  </h4>
                </div>

                <div className="space-y-3 pl-4 border-l-2 border-[#E2D9C8] ml-1.5">
                  {phaseSection.items.map((act) => {
                    const isMeal = act.type === 'meal';
                    const isAttraction = act.type === 'attraction';
                    const isHotel = act.type === 'hotel_checkin';
                    const isTransit = act.type === 'transit';

                    return (
                      <div
                        key={act.id}
                        className="bg-white rounded-2xl border border-[#E2D9C8] p-4 sm:p-5 shadow-sm space-y-3 relative hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#FF9933] bg-[#14243A] px-2.5 py-1 rounded-lg">
                              {act.timeSlot}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isMeal ? 'bg-amber-100 text-amber-800' :
                              isAttraction ? 'bg-indigo-100 text-indigo-800' :
                              isHotel ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {act.type.replace('_', ' ')}
                            </span>
                          </div>

                          {act.estimatedCost > 0 && (
                            <span className="text-xs text-[#64748B]">
                              Est: <strong className="text-[#14243A]">₹{act.estimatedCost.toLocaleString()}</strong>
                            </span>
                          )}
                        </div>

                        <div>
                          <h5 className="text-base font-bold text-[#14243A] font-serif">
                            {act.title}
                          </h5>
                          <p className="text-xs text-[#475569] leading-relaxed mt-1">
                            {act.description}
                          </p>
                        </div>

                        {/* Transit Advice & Tips */}
                        {act.transitAdvice && (
                          <div className="text-[11px] text-[#64748B] bg-[#F7F4EC] p-2.5 rounded-xl border border-[#E2D9C8] flex items-center gap-2">
                            <Compass className="w-3.5 h-3.5 text-[#B85C38] shrink-0" />
                            <span><strong>Directions:</strong> {act.transitAdvice}</span>
                          </div>
                        )}

                        {/* Food Recommendation Note */}
                        {act.foodRecommendation && (
                          <div className="text-[11px] text-[#174B37] bg-[#174B37]/10 p-2.5 rounded-xl border border-[#174B37]/20 flex items-center gap-2">
                            <Utensils className="w-3.5 h-3.5 text-[#174B37] shrink-0" />
                            <span><strong>Culinary Highlight:</strong> {act.foodRecommendation}</span>
                          </div>
                        )}

                        {/* YouTube Video Guides for this attraction (Part 10) */}
                        {act.youtubeVideos && act.youtubeVideos.length > 0 && (
                          <div className="pt-2 border-t border-[#E2D9C8] space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#B85C38] flex items-center gap-1.5">
                              <Video className="w-3.5 h-3.5 text-[#FF9933]" />
                              Watch Before You Visit:
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {act.youtubeVideos.map((video) => (
                                <div
                                  key={video.id}
                                  onClick={() => setActiveVideoModal(video)}
                                  className="group/vid cursor-pointer p-2 rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] hover:border-[#B85C38] flex items-center gap-2.5 transition-all"
                                >
                                  <div className="relative w-16 h-11 rounded-lg overflow-hidden shrink-0 bg-black">
                                    <img
                                      src={video.thumbnail}
                                      alt={video.title}
                                      className="w-full h-full object-cover group-hover/vid:scale-105 transition-transform"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                      <Play className="w-4 h-4 fill-white text-white opacity-80 group-hover/vid:opacity-100" />
                                    </div>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <h6 className="text-[11px] font-bold text-[#14243A] line-clamp-1 group-hover/vid:text-[#B85C38]">
                                      {video.title}
                                    </h6>
                                    <span className="text-[10px] text-[#64748B] block">
                                      {video.channel} • {video.duration}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION E: HOTEL CHECK-IN & STAY INFORMATION */}
      <div className="bg-white rounded-2xl border border-[#E2D9C8] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-[#14243A] flex items-center gap-2">
            <Hotel className="w-5 h-5 text-[#174B37]" />
            Hotel Check-In & Accommodation Plan
          </h3>
          <button
            type="button"
            onClick={() => onEditStep(7)}
            className="text-xs text-[#B85C38] hover:underline font-bold"
          >
            Change Hotel &rarr;
          </button>
        </div>

        <div className="bg-[#F7F4EC] p-4 rounded-xl border border-[#E2D9C8] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-[#14243A]">{selectedHotel?.name}</h4>
              <span className="text-[10px] bg-[#174B37] text-white px-2 py-0.5 rounded font-bold uppercase">
                {selectedHotel?.tier.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-[#475569]">
              {selectedHotel?.address} • {selectedHotel?.distanceFromCenter}
            </p>
            <div className="text-[11px] text-[#64748B] flex items-center gap-3 pt-1">
              <span>Check-in: <strong>{selectedHotel?.checkInTime}</strong></span>
              <span>Check-out: <strong>{selectedHotel?.checkOutTime}</strong></span>
              <span>Rating: <strong>{selectedHotel?.rating} / 5.0</strong></span>
            </div>
          </div>

          <div className="text-right shrink-0 space-y-1">
            <span className="text-lg font-black text-[#B85C38] block">
              {formatCurrency(selectedHotel?.pricePerNight || 1850)}/night
            </span>
            <a
              href={selectedHotel?.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#B85C38] hover:underline font-bold flex items-center justify-end gap-1"
            >
              <span>View on {selectedHotel?.bookingProvider.split('/')[0]}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-[10px] text-[#94A3B8] block">Booking not completed</span>
          </div>
        </div>
      </div>

      {/* SECTION F: EXPENSE BREAKDOWN & REMAINING BUDGET */}
      <div className="bg-white rounded-2xl border border-[#E2D9C8] p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-[#14243A] flex items-center gap-2">
          <Wallet className="w-5 h-5 text-[#B85C38]" />
          Budget Distribution & Financial Summary
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#E2D9C8]">
            <span className="text-[#64748B] block text-[11px]">Inter-city Transit</span>
            <strong className="text-[#14243A] text-sm block mt-0.5">₹{budget.categories.transport.toLocaleString()}</strong>
          </div>
          <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#E2D9C8]">
            <span className="text-[#64748B] block text-[11px]">Accommodation</span>
            <strong className="text-[#14243A] text-sm block mt-0.5">₹{budget.categories.accommodation.toLocaleString()}</strong>
          </div>
          <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#E2D9C8]">
            <span className="text-[#64748B] block text-[11px]">Food & Dining</span>
            <strong className="text-[#14243A] text-sm block mt-0.5">₹{budget.categories.food.toLocaleString()}</strong>
          </div>
          <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#E2D9C8]">
            <span className="text-[#64748B] block text-[11px]">Attraction Entry</span>
            <strong className="text-[#14243A] text-sm block mt-0.5">₹{budget.categories.attractionFees.toLocaleString()}</strong>
          </div>
          <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#E2D9C8]">
            <span className="text-[#64748B] block text-[11px]">Local Autos / Buses</span>
            <strong className="text-[#14243A] text-sm block mt-0.5">₹{budget.categories.localTransit.toLocaleString()}</strong>
          </div>
          <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#E2D9C8]">
            <span className="text-[#64748B] block text-[11px]">Activities & Guide</span>
            <strong className="text-[#14243A] text-sm block mt-0.5">₹{budget.categories.activities.toLocaleString()}</strong>
          </div>
          <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#E2D9C8]">
            <span className="text-[#174B37] font-bold block text-[11px]">Emergency Buffer</span>
            <strong className="text-[#174B37] text-sm block mt-0.5">₹{budget.categories.emergencyReserve.toLocaleString()}</strong>
          </div>
          <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#E2D9C8]">
            <span className="text-[#64748B] block text-[11px]">Total Trip Cost</span>
            <strong className="text-[#B85C38] text-sm block mt-0.5">₹{budget.effectiveBudget.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* SECTION J: WATCH ALL DESTINATION VIDEOS (Part 10 Master Gallery) */}
      {allVideos.length > 0 && (
        <div className="bg-gradient-to-br from-[#14243A] to-[#1E3A5F] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-lg">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
                  Watch All Destination Travel Videos
                </h3>
                <p className="text-xs text-white/70">
                  Curated 4K tours, architectural history, and local vlogs for your itinerary
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {allVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveVideoModal(video)}
                className="group cursor-pointer bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#FF9933] transition-all flex flex-col justify-between"
              >
                <div className="relative h-32 w-full overflow-hidden bg-black">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono">
                    {video.duration}
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h5 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-[#FF9933] transition-colors">
                    {video.title}
                  </h5>
                  <div className="pt-2 text-[10px] text-white/60 flex items-center justify-between">
                    <span>{video.channel}</span>
                    <span className="text-[#FF9933] font-medium">Watch Tour &rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION K: LOCAL LANGUAGE ASSISTANCE & EMERGENCY CONTACTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Local Phrases Widget */}
        <div className="bg-white rounded-2xl border border-[#E2D9C8] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#14243A] uppercase tracking-wider flex items-center gap-2">
              <Languages className="w-4 h-4 text-[#FF9933]" />
              Local Language Assistance ({destinationCity.primaryLanguage})
            </h4>
            <span className="text-[11px] text-[#64748B]">Quick phrases</span>
          </div>

          <div className="space-y-2">
            {localPhrases.slice(0, 4).map((p, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-xs">
                <div className="flex items-center justify-between font-bold text-[#14243A]">
                  <span>{p.english}</span>
                  <span className="text-[10px] text-[#B85C38] bg-white px-2 py-0.5 rounded border border-[#E2D9C8]">{p.category}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-[#64748B]">
                  <span className="font-serif text-[#14243A]">{p.script}</span>
                  <span className="font-mono text-[#B85C38]">({p.phonetic})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WAYNEX Safe & Emergency Contacts */}
        <div className="bg-white rounded-2xl border border-[#E2D9C8] p-5 shadow-sm space-y-3">
          <h4 className="text-sm font-bold text-[#14243A] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#174B37]" />
            WAYNEX Safe & Emergency Network
          </h4>
          <p className="text-xs text-[#64748B]">
            Verified safety numbers and medical contacts for {destinationCity.name}:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between">
              <div>
                <strong>National Emergency Helpline:</strong>
                <span className="block text-[11px] text-rose-700">Police, Ambulance, Fire</span>
              </div>
              <span className="text-lg font-black text-rose-700">112</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
              <div>
                <strong>Incredible India Tourist Helpline:</strong>
                <span className="block text-[11px] text-amber-700">24/7 Multi-language Assistance</span>
              </div>
              <span className="text-lg font-black text-amber-700">1363</span>
            </div>
          </div>
        </div>
      </div>

      {/* YOUTUBE EMBED MODAL (Plays video inside page) */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14243A] border border-white/20 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-[#14243A] text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-rose-500 fill-current" />
                <h4 className="text-sm font-bold line-clamp-1">{activeVideoModal.title}</h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player Frame */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoModal.videoId}?autoplay=1`}
                title={activeVideoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-4 bg-[#14243A] text-white/80 text-xs flex items-center justify-between">
              <span>Channel: <strong className="text-white">{activeVideoModal.channel}</strong></span>
              <a
                href={`https://www.youtube.com/watch?v=${activeVideoModal.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#FF9933] hover:underline flex items-center gap-1 font-bold"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Navigation / Start New Trip */}
      <div className="flex items-center justify-between pt-6 border-t border-[#E2D9C8]">
        <button
          type="button"
          onClick={() => onEditStep(1)}
          className="px-6 py-3 rounded-xl bg-white border border-[#E2D9C8] text-[#14243A] font-bold text-xs hover:bg-[#EFE9DC] transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Plan Another Trip</span>
        </button>

        <button
          type="button"
          onClick={onSaveTrip}
          className="px-8 py-3 rounded-xl bg-[#14243A] hover:bg-[#B85C38] text-white font-bold text-xs shadow-lg shadow-[#14243A]/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Bookmark className="w-4 h-4" />
          <span>{isSaved ? 'Itinerary Saved to My Trips ✓' : 'Save Itinerary & Finish'}</span>
        </button>
      </div>
    </div>
  );
};
