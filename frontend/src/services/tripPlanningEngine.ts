// Advanced AI Trip Planning Engine for WAYNEX
// Provides feasibility evaluation, budget allocation, day clustering, and chronological schedule generation.

import {
  CITY_HUBS,
  CITY_ATTRACTIONS,
  TRANSPORT_CATALOG,
  HOTEL_CATALOG,
  RESTAURANT_CATALOG,
  YOUTUBE_TRAVEL_GUIDES,
  LANGUAGE_ASSISTANCE,
  CityHub,
  AttractionItem,
  TransportOption,
  HotelOption,
  RestaurantRecommendation,
  YouTubeGuide,
  LanguagePhrase,
} from '@/data/tripPlannerData';
import { ALL_DESTINATIONS } from '@/data/destinations';
import { Destination } from '@/types';

export interface ItineraryActivity {
  id: string;
  timeSlot: string; // e.g. "10:00 AM – 12:30 PM"
  title: string;
  type: 'attraction' | 'meal' | 'transit' | 'hotel_checkin' | 'leisure';
  description: string;
  locationName: string;
  distanceFromPrev: string;
  transitAdvice: string;
  estimatedCost: number;
  entryFee?: string;
  thingsToDo?: string[];
  foodRecommendation?: string;
  youtubeVideos?: YouTubeGuide[];
  mapQuery: string;
}

export interface ItineraryDay {
  dayNumber: number;
  dateStr?: string;
  theme: string;
  totalHours: number;
  estimatedExpense: number;
  morningPlan: ItineraryActivity[];
  afternoonPlan: ItineraryActivity[];
  eveningPlan: ItineraryActivity[];
  nightPlan: ItineraryActivity[];
  breakfastSpot?: RestaurantRecommendation;
  lunchSpot?: RestaurantRecommendation;
  dinnerSpot?: RestaurantRecommendation;
  snackSpot?: RestaurantRecommendation;
}

export interface BudgetBreakdown {
  totalBudget: number;
  effectiveBudget: number;
  budgetType: 'per_person' | 'total_group';
  travellersCount: number;
  perPersonBudget: number;
  perDayPerPerson: number;
  categories: {
    transport: number;
    accommodation: number;
    food: number;
    localTransit: number;
    attractionFees: number;
    activities: number;
    emergencyReserve: number;
    miscellaneous: number;
  };
  isFeasible: boolean;
  status: 'comfortable' | 'moderate' | 'tight' | 'exceeded';
  warningMessage?: string;
  suggestions: string[];
}

export interface FeasibilityAssessment {
  totalPlaces: number;
  totalSightseeingHours: number;
  recommendedDays: number;
  advisorMessage: string;
  dayClusters: {
    dayNumber: number;
    places: AttractionItem[];
    theme: string;
  }[];
}

export interface CompleteTripPlan {
  id: string;
  title: string;
  destinationCity: CityHub;
  departureCity: string;
  travelDates?: { start: string; end: string };
  durationDays: number;
  budget: BudgetBreakdown;
  travellerType: 'solo' | 'couple' | 'friends' | 'family';
  adultsCount: number;
  childrenCount: number;
  selectedTransport: TransportOption;
  selectedHotel: HotelOption;
  selectedPlaces: AttractionItem[];
  itineraryDays: ItineraryDay[];
  allVideos: YouTubeGuide[];
  localPhrases: LanguagePhrase[];
  weatherNote: string;
  emergencyInfo: {
    nationalEmergency: string;
    touristHelpline: string;
    nearestHospital: string;
    touristPoliceStation: string;
  };
  status: 'draft' | 'saved' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// Helper to safely get state string
function getStateName(dest: any): string {
  if (!dest || !dest.state) return '';
  return typeof dest.state === 'string' ? dest.state : (dest.state.name || '');
}

function getStateSlug(dest: any): string {
  if (!dest) return '';
  if (dest.state_slug) return dest.state_slug;
  if (dest.state && typeof dest.state === 'object' && dest.state.slug) return dest.state.slug;
  return '';
}

// 1. City & Destination Search
export function searchCityHubs(query: string): CityHub[] {
  const q = query.trim().toLowerCase();
  if (!q) return CITY_HUBS;

  // Filter curated city hubs first
  const curatedMatches = CITY_HUBS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q)
  );

  if (curatedMatches.length > 0) return curatedMatches;

  // Dynamically map from 547 destinations if matching another city
  const destMatches = ALL_DESTINATIONS.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      getStateName(d).toLowerCase().includes(q) ||
      (d.district && d.district.toLowerCase().includes(q))
  ).slice(0, 5);

  const dynamicCities: CityHub[] = destMatches.map((d: any) => ({
    id: d.slug,
    name: d.name,
    state: getStateName(d),
    stateSlug: getStateSlug(d),
    district: d.district || d.name,
    image: d.image,
    tagline: `Explore ${d.category} in ${getStateName(d)}`,
    description: d.description,
    latitude: d.latitude,
    longitude: d.longitude,
    bestTimeToVisit: d.best_time_to_visit || 'October to March',
    nearestAirport: d.how_to_reach?.air || d.nearest_airport || 'Nearest State Airport',
    railwayStation: d.how_to_reach?.train || d.nearest_railway || `${d.name} Station`,
    busTerminal: `${d.name} Central Bus Stand`,
    popularAttractionIds: [d.slug],
    localSpecialties: d.local_food || d.local_cuisine || ['Local delicacies', 'Traditional thali'],
    primaryLanguage: 'Regional Indian Language',
  }));

  return dynamicCities;
}

export function getCityHubById(cityId: string): CityHub {
  const found = CITY_HUBS.find((c) => c.id === cityId);
  if (found) return found;

  const dest: any = ALL_DESTINATIONS.find((d: any) => d.slug === cityId || d.name.toLowerCase().includes(cityId.toLowerCase()));
  if (dest) {
    return {
      id: dest.slug,
      name: dest.name,
      state: getStateName(dest),
      stateSlug: getStateSlug(dest),
      district: dest.district || dest.name,
      image: dest.image,
      tagline: `Verified ${dest.category} in ${getStateName(dest)}`,
      description: dest.description,
      latitude: dest.latitude,
      longitude: dest.longitude,
      bestTimeToVisit: dest.best_time_to_visit || 'October to March',
      nearestAirport: dest.how_to_reach?.air || dest.nearest_airport || 'Regional Airport',
      railwayStation: dest.how_to_reach?.train || dest.nearest_railway || 'Nearby Railway Station',
      busTerminal: 'Central Bus Stand',
      popularAttractionIds: [dest.slug],
      localSpecialties: dest.local_food || dest.local_cuisine || ['Local sweets', 'Spiced curry'],
      primaryLanguage: 'Regional Language',
    };
  }

  return CITY_HUBS[0]; // fallback Mysuru
}

// 2. Attractions Retrieval
export function getAttractionsForCity(cityId: string): AttractionItem[] {
  if (CITY_ATTRACTIONS[cityId]) {
    return CITY_ATTRACTIONS[cityId];
  }

  // Fallback: search ALL_DESTINATIONS in the same state or matching name
  const city = getCityHubById(cityId);
  const matchedDests = ALL_DESTINATIONS.filter(
    (d: any) =>
      getStateName(d).toLowerCase() === city.state.toLowerCase() ||
      (d.district && d.district.toLowerCase() === city.district.toLowerCase())
  ).slice(0, 8);

  return matchedDests.map((d: any, index) => ({
    id: d.slug,
    name: d.name,
    cityId: city.id,
    state: getStateName(d),
    category: (d.category?.toLowerCase().includes('temple') ? 'temples' :
              d.category?.toLowerCase().includes('waterfall') ? 'waterfalls' :
              d.category?.toLowerCase().includes('beach') ? 'beaches' :
              d.category?.toLowerCase().includes('wildlife') ? 'wildlife' : 'historical'),
    image: d.image,
    shortDescription: d.description,
    approxVisitingHours: 2.0,
    openingHours: d.timings || '9:00 AM – 6:00 PM',
    entryFee: d.entry_fee || '₹50 per person',
    entryFeeAmount: 50,
    distanceFromCityCenterKm: (index + 1) * 3.5,
    latitude: d.latitude,
    longitude: d.longitude,
    bestVisitingTime: d.best_time_to_visit || 'Morning or Afternoon',
    travelTips: 'Wear comfortable walking shoes. Pre-book tickets online where available.',
    isPopular: !!(d.is_trending || d.is_hidden_gem),
    crowdLevel: 'Moderate',
    bestTimeOfDay: index % 2 === 0 ? 'Morning' : 'Evening',
  }));
}

// 3. AI Destination Feasibility Advisor
export function analyzeDestinationFeasibility(
  selectedPlaces: AttractionItem[],
  destinationCity: CityHub,
  requestedDays?: number
): FeasibilityAssessment {
  if (selectedPlaces.length === 0) {
    return {
      totalPlaces: 0,
      totalSightseeingHours: 0,
      recommendedDays: 1,
      advisorMessage: 'Select one or more attractions to analyze trip feasibility.',
      dayClusters: [],
    };
  }

  const totalSightseeingHours = selectedPlaces.reduce((sum, p) => sum + p.approxVisitingHours, 0);
  
  // A relaxed traveling day allows ~4.5 to 5.0 hours of active visiting plus transit & meals
  let recommendedDays = Math.ceil(totalSightseeingHours / 4.5);
  if (recommendedDays < 1) recommendedDays = 1;

  // Group places geographically / sequentially into day clusters
  const dayClusters: { dayNumber: number; places: AttractionItem[]; theme: string }[] = [];
  const placesPerDay = Math.ceil(selectedPlaces.length / recommendedDays);

  for (let i = 0; i < recommendedDays; i++) {
    const cluster = selectedPlaces.slice(i * placesPerDay, (i + 1) * placesPerDay);
    if (cluster.length > 0) {
      const mainCat = cluster[0].category;
      const theme =
        i === 0
          ? `${destinationCity.name} Heritage & Iconic Landmarks`
          : i === 1
          ? `Panoramic Nature, Temples & Scenic Heights`
          : `Cultural Arts, Gardens & Local Hidden Gems`;

      dayClusters.push({
        dayNumber: i + 1,
        places: cluster,
        theme,
      });
    }
  }

  let advisorMessage = '';
  if (requestedDays && requestedDays < recommendedDays) {
    advisorMessage = `Great choices! You selected ${selectedPlaces.length} places in ${destinationCity.name} requiring ~${totalSightseeingHours.toFixed(1)} hours of sightseeing. Completing these in ${requestedDays} day${requestedDays > 1 ? 's' : ''} will feel rushed. My AI recommendation is a ${recommendedDays}-day itinerary for a comfortable, stress-free experience.`;
  } else {
    advisorMessage = `Great choices! You selected ${selectedPlaces.length} places in ${destinationCity.name}. Based on visiting times and travel distances, a ${recommendedDays}-day trip is ideal for an unhurried exploration.`;
  }

  return {
    totalPlaces: selectedPlaces.length,
    totalSightseeingHours,
    recommendedDays,
    advisorMessage,
    dayClusters,
  };
}

// 4. AI Budget Allocation Engine
export function calculateBudgetBreakdown(
  budgetAmount: number,
  budgetType: 'per_person' | 'total_group',
  travellersCount: number,
  durationDays: number,
  accommodationTier: string = 'budget',
  transportMode: string = 'bus'
): BudgetBreakdown {
  const travellers = Math.max(1, travellersCount);
  const days = Math.max(1, durationDays);

  const totalBudget = budgetAmount;
  const perPersonBudget = budgetType === 'per_person' ? budgetAmount : Math.round(budgetAmount / travellers);
  const effectiveBudget = budgetType === 'per_person' ? budgetAmount * travellers : budgetAmount;
  const perDayPerPerson = Math.round(perPersonBudget / days);

  // Percentage allocations adjusted for transport & stay tiers
  let transportPct = 0.22;
  let stayPct = 0.32;
  let foodPct = 0.20;
  let localTransitPct = 0.10;
  let attractionPct = 0.06;
  let activitiesPct = 0.05;
  let reservePct = 0.05;

  if (transportMode === 'flight') {
    transportPct = 0.38;
    stayPct = 0.26;
    foodPct = 0.16;
  } else if (transportMode === 'car') {
    transportPct = 0.28;
    stayPct = 0.30;
  }

  if (accommodationTier === 'luxury' || accommodationTier === 'resort') {
    stayPct = 0.45;
    foodPct = 0.18;
    transportPct = 0.18;
  } else if (accommodationTier === 'hostel') {
    stayPct = 0.18;
    foodPct = 0.25;
    activitiesPct = 0.15;
  }

  const categories = {
    transport: Math.round(effectiveBudget * transportPct),
    accommodation: Math.round(effectiveBudget * stayPct),
    food: Math.round(effectiveBudget * foodPct),
    localTransit: Math.round(effectiveBudget * localTransitPct),
    attractionFees: Math.round(effectiveBudget * attractionPct),
    activities: Math.round(effectiveBudget * activitiesPct),
    emergencyReserve: Math.round(effectiveBudget * reservePct),
    miscellaneous: Math.round(effectiveBudget * (1 - (transportPct + stayPct + foodPct + localTransitPct + attractionPct + activitiesPct + reservePct))),
  };

  // Feasibility Check
  // Minimum comfortable daily spend per person in India: ~₹1,200 for budget, ~₹2,500 for mid-range
  const minRequiredPerDay = accommodationTier === 'hostel' ? 800 : accommodationTier === 'luxury' ? 4500 : 1500;
  const totalMinRequired = minRequiredPerDay * days * travellers;

  let isFeasible = true;
  let status: 'comfortable' | 'moderate' | 'tight' | 'exceeded' = 'comfortable';
  let warningMessage = undefined;
  const suggestions: string[] = [];

  if (effectiveBudget < totalMinRequired * 0.75) {
    isFeasible = false;
    status = 'exceeded';
    warningMessage = `Your budget of ₹${effectiveBudget.toLocaleString()} is below the estimated minimum of ₹${Math.round(totalMinRequired).toLocaleString()} for ${travellers} person(s) over ${days} day(s).`;
    suggestions.push('Choose a verified backpacker hostel or budget homestay.');
    suggestions.push('Use public buses and local transit instead of private cabs.');
    suggestions.push('Prioritize free entrance heritage sites and public gardens.');
  } else if (effectiveBudget < totalMinRequired) {
    status = 'tight';
    warningMessage = `Your budget is lean for ${days} day(s). Some careful choices on dining and transit will keep you on track.`;
    suggestions.push('Opt for local heritage cafes and tiffin houses instead of fine dining.');
    suggestions.push('Book KSRTC/state express bus tickets in advance.');
  } else if (effectiveBudget > totalMinRequired * 2.5) {
    status = 'comfortable';
    suggestions.push('You have comfortable budget headroom! Consider a luxury heritage palace dinner or spa session.');
  } else {
    status = 'moderate';
    suggestions.push('Balanced budget! Enjoy both cultural sightseeing and memorable local dining.');
  }

  return {
    totalBudget,
    effectiveBudget,
    budgetType,
    travellersCount: travellers,
    perPersonBudget,
    perDayPerPerson,
    categories,
    isFeasible,
    status,
    warningMessage,
    suggestions,
  };
}

// 5. Chronological Day-wise Itinerary Generator
export function generateChronologicalItinerary(
  city: CityHub,
  departureCity: string,
  selectedPlaces: AttractionItem[],
  daysCount: number,
  transportOption: TransportOption,
  hotelOption: HotelOption,
  budget: BudgetBreakdown
): ItineraryDay[] {
  const days: ItineraryDay[] = [];
  const restaurants = RESTAURANT_CATALOG[city.id] || [];
  const breakfast = restaurants.find((r) => r.mealType === 'breakfast');
  const lunch = restaurants.find((r) => r.mealType === 'lunch');
  const snacks = restaurants.find((r) => r.mealType === 'snacks');
  const dinner = restaurants.find((r) => r.mealType === 'dinner');

  const placesPerDay = Math.ceil(selectedPlaces.length / daysCount);

  for (let dayIdx = 0; dayIdx < daysCount; dayIdx++) {
    const dayNumber = dayIdx + 1;
    const dayPlaces = selectedPlaces.slice(dayIdx * placesPerDay, (dayIdx + 1) * placesPerDay);

    const morningPlan: ItineraryActivity[] = [];
    const afternoonPlan: ItineraryActivity[] = [];
    const eveningPlan: ItineraryActivity[] = [];
    const nightPlan: ItineraryActivity[] = [];

    // Day 1: Include Departure & Arrival
    if (dayNumber === 1) {
      morningPlan.push({
        id: `act-dep-${dayNumber}`,
        timeSlot: transportOption.departureTime ? `${transportOption.departureTime} – ${transportOption.arrivalTime}` : '06:30 AM – 09:30 AM',
        title: `Depart from ${departureCity || 'Origin'} via ${transportOption.operatorOrName}`,
        type: 'transit',
        description: `Board ${transportOption.classType} from ${departureCity}. Enjoy scenic views along the highway/rail corridor.`,
        locationName: departureCity,
        distanceFromPrev: '0 km',
        transitAdvice: `Board at scheduled departure. Keep digital ticket ready on phone.`,
        estimatedCost: Math.round(budget.categories.transport / daysCount),
        mapQuery: `${departureCity} to ${city.name}`,
      });

      morningPlan.push({
        id: `act-checkin-${dayNumber}`,
        timeSlot: '10:00 AM – 10:45 AM',
        title: `Arrival at ${city.name} & Luggage Drop at ${hotelOption.name}`,
        type: 'hotel_checkin',
        description: `Head to ${hotelOption.name}. Drop luggage at front desk if room is being prepared (official check-in at ${hotelOption.checkInTime}). Refresh for the day.`,
        locationName: hotelOption.name,
        distanceFromPrev: '2.5 km from terminal',
        transitAdvice: `Take pre-paid auto or cab from station/bus stand (~₹80-120).`,
        estimatedCost: 100,
        mapQuery: hotelOption.address,
      });

      if (breakfast) {
        morningPlan.push({
          id: `act-bfast-${dayNumber}`,
          timeSlot: '10:45 AM – 11:30 AM',
          title: `Traditional Breakfast at ${breakfast.name}`,
          type: 'meal',
          description: `Savor iconic regional specialties: ${breakfast.famousDishes.join(', ')}. Freshly brewed filter coffee.`,
          locationName: breakfast.name,
          distanceFromPrev: '0.8 km',
          transitAdvice: 'Short walk or quick auto rickshaw ride.',
          estimatedCost: Math.round(breakfast.avgCostForTwo / 2),
          foodRecommendation: breakfast.recommendedExperience,
          mapQuery: breakfast.address,
        });
      }
    } else {
      // Subsequent Days Breakfast
      morningPlan.push({
        id: `act-bfast-${dayNumber}`,
        timeSlot: '08:00 AM – 09:00 AM',
        title: breakfast ? `Breakfast at ${breakfast.name}` : `Morning Breakfast & Fresh Brew`,
        type: 'meal',
        description: `Start Day ${dayNumber} refreshed with steaming hot breakfast and local specialties.`,
        locationName: breakfast ? breakfast.name : city.name,
        distanceFromPrev: 'Hotel dining / local cafe',
        transitAdvice: 'Located near city center.',
        estimatedCost: 150,
        mapQuery: city.name,
      });
    }

    // Allocate Places across Morning, Afternoon, Evening
    dayPlaces.forEach((place, pIdx) => {
      const placeVideos = YOUTUBE_TRAVEL_GUIDES[place.id] || [];

      if (pIdx === 0) {
        // Morning Attraction
        morningPlan.push({
          id: `act-plc-${place.id}`,
          timeSlot: '11:45 AM – 01:15 PM',
          title: `Explore ${place.name}`,
          type: 'attraction',
          description: place.shortDescription,
          locationName: place.name,
          distanceFromPrev: `${place.distanceFromCityCenterKm} km`,
          transitAdvice: place.travelTips,
          estimatedCost: place.entryFeeAmount,
          entryFee: place.entryFee,
          thingsToDo: ['Guided tour of main hall', 'Photography at courtyards', 'Heritage audio guide'],
          youtubeVideos: placeVideos,
          mapQuery: `${place.name}, ${city.name}`,
        });
      } else if (pIdx === 1) {
        // Afternoon Attraction
        afternoonPlan.push({
          id: `act-plc-${place.id}`,
          timeSlot: '02:45 PM – 04:30 PM',
          title: `Visit ${place.name}`,
          type: 'attraction',
          description: place.shortDescription,
          locationName: place.name,
          distanceFromPrev: `${place.distanceFromCityCenterKm} km`,
          transitAdvice: place.travelTips,
          estimatedCost: place.entryFeeAmount,
          entryFee: place.entryFee,
          thingsToDo: ['Stroll through gardens', 'Observe architectural details'],
          youtubeVideos: placeVideos,
          mapQuery: `${place.name}, ${city.name}`,
        });
      } else {
        // Evening Attraction / Sunset
        eveningPlan.push({
          id: `act-plc-${place.id}`,
          timeSlot: '05:00 PM – 07:00 PM',
          title: `Sunset Experience at ${place.name}`,
          type: 'attraction',
          description: place.shortDescription,
          locationName: place.name,
          distanceFromPrev: `${place.distanceFromCityCenterKm} km`,
          transitAdvice: place.travelTips,
          estimatedCost: place.entryFeeAmount,
          entryFee: place.entryFee,
          thingsToDo: ['Watch panoramic sunset', 'Evening illumination / fountains'],
          youtubeVideos: placeVideos,
          mapQuery: `${place.name}, ${city.name}`,
        });
      }
    });

    // Lunch Slot
    if (lunch) {
      afternoonPlan.unshift({
        id: `act-lunch-${dayNumber}`,
        timeSlot: '01:30 PM – 02:30 PM',
        title: `Lunch at ${lunch.name}`,
        type: 'meal',
        description: `Authentic regional dining. Famous for: ${lunch.famousDishes.join(', ')}.`,
        locationName: lunch.name,
        distanceFromPrev: '1.2 km from morning spot',
        transitAdvice: 'Take an auto rickshaw or short 10-minute walk.',
        estimatedCost: Math.round(lunch.avgCostForTwo / 2),
        foodRecommendation: lunch.recommendedExperience,
        mapQuery: lunch.address,
      });
    }

    // Evening Snacks / Sweets
    if (snacks) {
      eveningPlan.push({
        id: `act-snack-${dayNumber}`,
        timeSlot: '07:15 PM – 08:00 PM',
        title: `Evening Treats at ${snacks.name}`,
        type: 'meal',
        description: `Taste the royal sweet tradition: ${snacks.famousDishes.join(', ')}.`,
        locationName: snacks.name,
        distanceFromPrev: 'Centrally located',
        transitAdvice: 'Located on heritage bazaar street.',
        estimatedCost: Math.round(snacks.avgCostForTwo / 2),
        foodRecommendation: snacks.recommendedExperience,
        mapQuery: snacks.address,
      });
    }

    // Dinner & Rest
    if (dinner) {
      nightPlan.push({
        id: `act-dinner-${dayNumber}`,
        timeSlot: '08:30 PM – 09:45 PM',
        title: `Dinner at ${dinner.name}`,
        type: 'meal',
        description: `Relaxing dinner atmosphere. Specialty dishes: ${dinner.famousDishes.join(', ')}.`,
        locationName: dinner.name,
        distanceFromPrev: 'Short transit back toward hotel',
        transitAdvice: 'App-based cab or auto.',
        estimatedCost: Math.round(dinner.avgCostForTwo / 2),
        foodRecommendation: dinner.recommendedExperience,
        mapQuery: dinner.address,
      });
    }

    nightPlan.push({
      id: `act-hotel-rest-${dayNumber}`,
      timeSlot: '10:00 PM',
      title: `Return & Overnight Rest at ${hotelOption.name}`,
      type: 'leisure',
      description: `Recharge in your comfortable room. Plan ready for Day ${dayNumber + 1}.`,
      locationName: hotelOption.name,
      distanceFromPrev: 'Return to hotel',
      transitAdvice: 'Safe late-night travel zone.',
      estimatedCost: 0,
      mapQuery: hotelOption.address,
    });

    const dayThemes = [
      `${city.name} Royal Heritage, Palaces & Historic Wonders`,
      `Panoramic Valley Views, Sacred Hills & Botanical Sanctuaries`,
      `Artisanal Craft Villages, Terraced Gardens & Sunset Cascades`,
      `Hidden Treasures, Cultural Bazaars & Departure Preparations`,
    ];

    days.push({
      dayNumber,
      theme: dayThemes[(dayNumber - 1) % dayThemes.length],
      totalHours: 8.5,
      estimatedExpense: Math.round(budget.effectiveBudget / daysCount),
      morningPlan,
      afternoonPlan,
      eveningPlan,
      nightPlan,
      breakfastSpot: breakfast,
      lunchSpot: lunch,
      dinnerSpot: dinner,
      snackSpot: snacks,
    });
  }

  return days;
}

// 6. Complete YouTube Videos Collector
export function collectYouTubeGuidesForPlaces(places: AttractionItem[]): YouTubeGuide[] {
  const guides: YouTubeGuide[] = [];
  const seenIds = new Set<string>();

  places.forEach((p) => {
    const list = YOUTUBE_TRAVEL_GUIDES[p.id] || [];
    list.forEach((v) => {
      if (!seenIds.has(v.id)) {
        seenIds.add(v.id);
        guides.push(v);
      }
    });
  });

  return guides;
}

// 7. Local Phrases Retrieval
export function getLanguagePhrasesForCity(city: CityHub): LanguagePhrase[] {
  const langKey = city.primaryLanguage.toLowerCase();
  if (LANGUAGE_ASSISTANCE[langKey]) {
    return LANGUAGE_ASSISTANCE[langKey];
  }
  if (city.stateSlug === 'karnataka') return LANGUAGE_ASSISTANCE.kannada;
  if (city.stateSlug === 'odisha') return LANGUAGE_ASSISTANCE.odia;
  return LANGUAGE_ASSISTANCE.hindi;
}

// 8. LocalStorage Trip Persistence
const LOCAL_STORAGE_KEY = 'waynex_planned_trips_v2';
const DRAFT_KEY = 'waynex_active_trip_draft_v2';

export function saveTripDraft(data: any): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save draft trip', e);
  }
}

export function loadTripDraft(): any | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearTripDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {}
}

export function saveTripToLocalStorage(trip: CompleteTripPlan): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getSavedTripsFromLocalStorage();
    const filtered = current.filter((t) => t.id !== trip.id);
    filtered.unshift(trip);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to persist trip to localStorage', e);
  }
}

export function getSavedTripsFromLocalStorage(): CompleteTripPlan[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
