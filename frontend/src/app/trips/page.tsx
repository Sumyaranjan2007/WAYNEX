'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  Calendar,
  Wallet,
  Users,
  Bus,
  Hotel,
  Sparkles,
  Bookmark,
  Plus,
  Trash2,
  Share2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Bot,
  Layers,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { PlannerProgressBar } from '@/components/planner/PlannerProgressBar';
import { Step1DestinationCity } from '@/components/planner/Step1DestinationCity';
import { Step2PlacesToVisit } from '@/components/planner/Step2PlacesToVisit';
import { Step3Budget } from '@/components/planner/Step3Budget';
import { Step4Duration } from '@/components/planner/Step4Duration';
import { Step5TravellerType } from '@/components/planner/Step5TravellerType';
import { Step6Transportation } from '@/components/planner/Step6Transportation';
import { Step7Accommodation } from '@/components/planner/Step7Accommodation';
import { Step8FinalItinerary } from '@/components/planner/Step8FinalItinerary';
import { AIAssistantDrawer } from '@/components/planner/AIAssistantDrawer';

import {
  CITY_HUBS,
  TRANSPORT_CATALOG,
  HOTEL_CATALOG,
  CityHub,
  AttractionItem,
  TransportOption,
  HotelOption,
} from '@/data/tripPlannerData';
import {
  getCityHubById,
  getAttractionsForCity,
  calculateBudgetBreakdown,
  generateChronologicalItinerary,
  collectYouTubeGuidesForPlaces,
  getLanguagePhrasesForCity,
  CompleteTripPlan,
  saveTripDraft,
  loadTripDraft,
  saveTripToLocalStorage,
  getSavedTripsFromLocalStorage,
} from '@/services/tripPlanningEngine';
import { formatCurrency } from '@/lib/utils';
import { RobustImage } from '@/components/ui/RobustImage';

export default function TripsPage() {
  // Navigation mode: 'planner' or 'saved_trips'
  const [viewMode, setViewMode] = useState<'planner' | 'saved_trips'>('planner');
  const [currentStep, setCurrentStep] = useState(1);
  const [maxCompletedStep, setMaxCompletedStep] = useState(1);

  // Stage 1: City & Starting location
  const [selectedCity, setSelectedCity] = useState<CityHub>(CITY_HUBS[0]); // default Mysuru
  const [departureCity, setDepartureCity] = useState('Bengaluru');

  // Stage 2: Selected Places
  const [selectedPlaces, setSelectedPlaces] = useState<AttractionItem[]>([]);

  // Stage 3: Budget
  const [budgetAmount, setBudgetAmount] = useState(8000);
  const [budgetType, setBudgetType] = useState<'per_person' | 'total_group'>('per_person');

  // Stage 4: Duration
  const [durationDays, setDurationDays] = useState(2);
  const [startDate, setStartDate] = useState('2026-12-10');
  const [endDate, setEndDate] = useState('2026-12-12');

  // Stage 5: Traveller Type
  const [travellerType, setTravellerType] = useState<'solo' | 'couple' | 'friends' | 'family'>('friends');
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [specialPreferences, setSpecialPreferences] = useState<string[]>(['Photography & heritage architecture']);

  // Stage 6: Transportation
  const [selectedTransport, setSelectedTransport] = useState<TransportOption>(
    TRANSPORT_CATALOG['bengaluru-mysuru'][0]
  );

  // Stage 7: Accommodation
  const [selectedHotel, setSelectedHotel] = useState<HotelOption>(
    HOTEL_CATALOG['mysuru'][1] // Ginger Hotel
  );

  // Assistant & Save States
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedTrips, setSavedTrips] = useState<CompleteTripPlan[]>([]);

  // Initialize defaults on mount
  useEffect(() => {
    // Load default places for Mysuru
    const defaultPlaces = getAttractionsForCity(selectedCity.id).slice(0, 5);
    setSelectedPlaces(defaultPlaces);

    // Load saved trips from local storage
    const loadedSaved = getSavedTripsFromLocalStorage();
    setSavedTrips(loadedSaved);

    // Check for draft
    const draft = loadTripDraft();
    if (draft && draft.selectedCity) {
      setSelectedCity(draft.selectedCity);
      if (draft.departureCity) setDepartureCity(draft.departureCity);
      if (draft.selectedPlaces) setSelectedPlaces(draft.selectedPlaces);
      if (draft.budgetAmount) setBudgetAmount(draft.budgetAmount);
      if (draft.durationDays) setDurationDays(draft.durationDays);
      if (draft.travellerType) setTravellerType(draft.travellerType);
    }
  }, []);

  // Update places when city changes
  const handleSelectCity = (city: CityHub) => {
    setSelectedCity(city);
    const newPlaces = getAttractionsForCity(city.id).slice(0, 5);
    setSelectedPlaces(newPlaces);

    // Update transport & hotel defaults
    const key = `${(departureCity || 'bengaluru').toLowerCase()}-${city.id.toLowerCase()}`;
    const trans = TRANSPORT_CATALOG[key] || TRANSPORT_CATALOG['bengaluru-mysuru'];
    if (trans && trans.length > 0) setSelectedTransport(trans[0]);

    const hotels = HOTEL_CATALOG[city.id] || HOTEL_CATALOG['mysuru'];
    if (hotels && hotels.length > 0) setSelectedHotel(hotels[0]);
  };

  const handleTogglePlace = (place: AttractionItem) => {
    setSelectedPlaces((prev) => {
      const exists = prev.some((p) => p.id === place.id);
      if (exists) {
        return prev.filter((p) => p.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
  };

  const handleTogglePreference = (pref: string) => {
    setSpecialPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    if (step > maxCompletedStep) {
      setMaxCompletedStep(step);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = () => {
    if (currentStep < 8) {
      goToStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  // Compile Final Complete Plan
  const compiledBudget = calculateBudgetBreakdown(
    budgetAmount,
    budgetType,
    adultsCount + childrenCount,
    durationDays,
    selectedHotel?.tier,
    selectedTransport?.type
  );

  const compiledItinerary = generateChronologicalItinerary(
    selectedCity,
    departureCity,
    selectedPlaces,
    durationDays,
    selectedTransport,
    selectedHotel,
    compiledBudget
  );

  const compiledVideos = collectYouTubeGuidesForPlaces(selectedPlaces);
  const compiledPhrases = getLanguagePhrasesForCity(selectedCity);

  const fullTripPlan: CompleteTripPlan = {
    id: `trip-${selectedCity.id}-${Date.now()}`,
    title: `${selectedCity.name} ${durationDays}-Day Trip`,
    destinationCity: selectedCity,
    departureCity: departureCity || 'Bengaluru',
    travelDates: { start: startDate, end: endDate },
    durationDays,
    budget: compiledBudget,
    travellerType,
    adultsCount,
    childrenCount,
    selectedTransport,
    selectedHotel,
    selectedPlaces,
    itineraryDays: compiledItinerary,
    allVideos: compiledVideos,
    localPhrases: compiledPhrases,
    weatherNote: `Optimal seasonal conditions expected in ${selectedCity.name}. Average temperature ~18°C to 28°C.`,
    emergencyInfo: {
      nationalEmergency: '112',
      touristHelpline: '1363',
      nearestHospital: `${selectedCity.name} District Hospital & Emergency Trauma Care`,
      touristPoliceStation: `${selectedCity.name} Heritage Tourist Police Station`,
    },
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleSaveTrip = () => {
    saveTripToLocalStorage(fullTripPlan);
    setIsSaved(true);
    setSavedTrips(getSavedTripsFromLocalStorage());

    // Also attempt backend persistence silently
    if (typeof window !== 'undefined') {
      fetch('http://127.0.0.1:8000/api/v1/budget/trips/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: fullTripPlan.title,
          destination_city: selectedCity.name,
          departure_city: departureCity,
          duration_days: durationDays,
          budget_amount: budgetAmount,
          budget_type: budgetType,
          traveller_type: travellerType,
          adults_count: adultsCount,
          children_count: childrenCount,
          transport_mode: selectedTransport?.type || 'bus',
          accommodation_type: selectedHotel?.tier || 'budget_hotel',
          status: 'saved',
          selected_places: selectedPlaces.map((p) => p.name),
          itinerary_data: fullTripPlan,
        }),
      }).catch(() => {
        // Fallback already saved in localStorage
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#14243A] py-8 sm:py-12">
      <Container>
        {/* Navigation & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs text-[#64748B] hover:text-[#14243A] font-semibold"
            >
              Home
            </Link>
            <span className="text-xs text-[#94A3B8]">&rarr;</span>
            <span className="text-xs font-bold text-[#14243A]">AI Trip Planner</span>
          </div>

          <div className="inline-flex p-1 bg-white border border-[#E2D9C8] rounded-xl self-start sm:self-auto shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('planner')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'planner'
                  ? 'bg-[#14243A] text-white shadow-sm'
                  : 'text-[#475569] hover:text-[#14243A]'
              }`}
            >
              Interactive Trip Planner
            </button>
            <button
              type="button"
              onClick={() => setViewMode('saved_trips')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'saved_trips'
                  ? 'bg-[#14243A] text-white shadow-sm'
                  : 'text-[#475569] hover:text-[#14243A]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Trips ({savedTrips.length})</span>
            </button>
          </div>
        </div>

        {/* VIEW MODE 1: MASTER MULTI-STEP PLANNER */}
        {viewMode === 'planner' ? (
          <div>
            {/* Progress Bar (Stages 1 to 8) */}
            <PlannerProgressBar
              currentStep={currentStep}
              onStepClick={goToStep}
              maxCompletedStep={maxCompletedStep}
            />

            {/* STAGE 1: DESTINATION CITY */}
            {currentStep === 1 && (
              <Step1DestinationCity
                selectedCity={selectedCity}
                onSelectCity={handleSelectCity}
                departureCity={departureCity}
                onChangeDepartureCity={setDepartureCity}
                onNext={handleNextStep}
              />
            )}

            {/* STAGE 2: PLACES TO VISIT */}
            {currentStep === 2 && (
              <Step2PlacesToVisit
                selectedCity={selectedCity}
                selectedPlaces={selectedPlaces}
                onTogglePlace={handleTogglePlace}
                onSetSelectedPlaces={setSelectedPlaces}
                onPrev={handlePrevStep}
                onNext={handleNextStep}
              />
            )}

            {/* STAGE 3: BUDGET */}
            {currentStep === 3 && (
              <Step3Budget
                selectedCity={selectedCity}
                selectedPlaces={selectedPlaces}
                budgetAmount={budgetAmount}
                budgetType={budgetType}
                travellersCount={adultsCount + childrenCount}
                durationDays={durationDays}
                onChangeBudgetAmount={setBudgetAmount}
                onChangeBudgetType={setBudgetType}
                onPrev={handlePrevStep}
                onNext={handleNextStep}
              />
            )}

            {/* STAGE 4: DURATION */}
            {currentStep === 4 && (
              <Step4Duration
                selectedCity={selectedCity}
                selectedPlaces={selectedPlaces}
                durationDays={durationDays}
                startDate={startDate}
                endDate={endDate}
                onChangeDurationDays={setDurationDays}
                onChangeStartDate={setStartDate}
                onChangeEndDate={setEndDate}
                onPrev={handlePrevStep}
                onNext={handleNextStep}
              />
            )}

            {/* STAGE 5: TRAVELLER TYPE */}
            {currentStep === 5 && (
              <Step5TravellerType
                travellerType={travellerType}
                adultsCount={adultsCount}
                childrenCount={childrenCount}
                specialPreferences={specialPreferences}
                onChangeTravellerType={setTravellerType}
                onChangeAdultsCount={setAdultsCount}
                onChangeChildrenCount={setChildrenCount}
                onTogglePreference={handleTogglePreference}
                onPrev={handlePrevStep}
                onNext={handleNextStep}
              />
            )}

            {/* STAGE 6: TRANSPORTATION */}
            {currentStep === 6 && (
              <Step6Transportation
                selectedCity={selectedCity}
                departureCity={departureCity}
                selectedTransport={selectedTransport}
                onSelectTransport={setSelectedTransport}
                onPrev={handlePrevStep}
                onNext={handleNextStep}
              />
            )}

            {/* STAGE 7: ACCOMMODATION */}
            {currentStep === 7 && (
              <Step7Accommodation
                selectedCity={selectedCity}
                selectedPlaces={selectedPlaces}
                selectedHotel={selectedHotel}
                onSelectHotel={setSelectedHotel}
                onPrev={handlePrevStep}
                onNext={handleNextStep}
              />
            )}

            {/* STAGE 8: COMPLETE PERSONALIZED FINAL ITINERARY */}
            {currentStep === 8 && (
              <Step8FinalItinerary
                tripPlan={fullTripPlan}
                onEditStep={goToStep}
                onSaveTrip={handleSaveTrip}
                isSaved={isSaved}
              />
            )}
          </div>
        ) : (
          /* VIEW MODE 2: SAVED TRIPS LIST */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#14243A] font-serif">
                  My Planned & Saved Expeditions
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  Revisit your saved itineraries, export summaries, or continue personalizing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setViewMode('planner');
                  setCurrentStep(1);
                }}
                className="px-4 py-2 rounded-xl bg-[#14243A] text-white text-xs font-bold hover:bg-[#B85C38] transition-all flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Trip</span>
              </button>
            </div>

            {savedTrips.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E2D9C8] p-12 text-center space-y-4">
                <Compass className="w-12 h-12 text-[#94A3B8] mx-auto animate-spin-slow" />
                <h3 className="text-lg font-bold text-[#14243A]">No Saved Trips Found</h3>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                  Use the multi-step interactive trip planner to create your first personalized India journey.
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode('planner')}
                  className="px-6 py-2.5 rounded-xl bg-[#14243A] text-white text-xs font-bold hover:bg-[#B85C38]"
                >
                  Start Planning
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-white rounded-2xl border border-[#E2D9C8] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="relative h-44 w-full bg-[#14243A]">
                      <RobustImage
                        src={trip.destinationCity.image}
                        stateSlug={trip.destinationCity.stateSlug}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#14243A] via-[#14243A]/30 to-transparent" />
                      
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#14243A]/80 text-[#FF9933] border border-white/10 uppercase">
                          {trip.destinationCity.state}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 text-white">
                        <h4 className="text-lg font-bold font-serif leading-tight">{trip.title}</h4>
                        <span className="text-xs text-white/80">{trip.durationDays} Days • {trip.selectedPlaces.length} Destinations</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1 text-xs text-[#64748B]">
                        <div className="flex justify-between">
                          <span>Total Budget:</span>
                          <strong className="text-[#14243A]">₹{trip.budget.effectiveBudget.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Transit:</span>
                          <span className="text-[#14243A]">{trip.selectedTransport?.operatorOrName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hotel:</span>
                          <span className="text-[#14243A] line-clamp-1">{trip.selectedHotel?.name}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E2D9C8] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCity(trip.destinationCity);
                            setDepartureCity(trip.departureCity);
                            setSelectedPlaces(trip.selectedPlaces);
                            setDurationDays(trip.durationDays);
                            setBudgetAmount(trip.budget.totalBudget);
                            setSelectedTransport(trip.selectedTransport);
                            setSelectedHotel(trip.selectedHotel);
                            setViewMode('planner');
                            setCurrentStep(8);
                          }}
                          className="text-xs font-bold text-[#B85C38] hover:underline flex items-center gap-1"
                        >
                          <span>Open Itinerary &rarr;</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const filtered = savedTrips.filter((t) => t.id !== trip.id);
                            setSavedTrips(filtered);
                            if (typeof window !== 'undefined') {
                              localStorage.setItem('waynex_planned_trips_v2', JSON.stringify(filtered));
                            }
                          }}
                          className="text-[#94A3B8] hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Persistent Floating AI Travel Assistant Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            type="button"
            onClick={() => setIsAssistantOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#14243A] hover:bg-[#B85C38] text-white font-bold text-xs shadow-2xl shadow-[#14243A]/40 border border-white/20 transition-all duration-300 hover:scale-105"
          >
            <div className="w-6 h-6 rounded-lg bg-[#FF9933] text-[#14243A] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <span>AI Travel Assistant</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        </div>

        {/* Slide-over Context-Aware AI Travel Assistant Drawer */}
        <AIAssistantDrawer
          isOpen={isAssistantOpen}
          onClose={() => setIsAssistantOpen(false)}
          destinationCity={selectedCity}
          departureCity={departureCity}
          selectedPlaces={selectedPlaces}
          budgetAmount={budgetAmount}
          durationDays={durationDays}
          travellerType={travellerType}
          selectedTransport={selectedTransport}
          selectedHotel={selectedHotel}
        />
      </Container>
    </div>
  );
}
