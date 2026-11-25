export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: string;
  city?: string;
  state?: string;
  bio?: string;
  is_verified?: boolean;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  username?: string;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  city?: string;
  state?: string;
}

export interface AuthResponse {
  token: string;
  refresh: string;
  user: User;
}

export interface MonthlyClimateDetail {
  season: string;
  temp_range: string;
  rainfall: string;
  travel_suitability: 'Peak' | 'Good' | 'Moderate' | 'Avoid';
  precautions: string;
}

export interface TimelineEvent {
  year_or_era: string;
  title: string;
  description: string;
  significance: string;
  related_places?: string[];
  source?: string;
}

export interface State {
  id: string;
  name: string;
  slug: string;
  code: string;
  capital: string;
  description: string;
  history?: string;
  geography?: string;
  climate?: string;
  best_time_to_visit?: string;
  languages?: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  is_union_territory: boolean;
  destination_count?: number;
  rating?: number;
  popular_attractions?: string[];
  banner_image?: string;
  formation_date?: string;
  area_sq_km?: number;
  districts_count?: number;
  official_website?: string;
  tourism_website?: string;
  monthly_climate?: Record<string, MonthlyClimateDetail>;
  historical_timeline?: TimelineEvent[];
  cultural_heritage?: {
    festivals?: string[];
    traditional_arts?: string[];
    dance_forms?: string[];
    local_cuisine?: string[];
  };
  travel_transport?: {
    airports?: string[];
    rail_hubs?: string[];
    highways?: string[];
    connectivity_tip?: string;
  };
  emergency_contacts?: {
    tourist_helpline?: string;
    police?: string;
    medical?: string;
  };
}

export interface District {
  id: string;
  name: string;
  slug: string;
  state_id: string;
  state_name: string;
  description?: string;
  headquarters?: string;
}

export interface Attraction {
  id: string;
  name: string;
  category: 'historical' | 'natural' | 'religious' | 'adventure' | 'cultural' | 'entertainment' | 'shopping' | 'food' | 'other';
  description: string;
  entry_fee?: number;
  opening_hours?: string;
  visit_duration?: string;
  latitude?: number;
  longitude?: number;
  image?: string;
}

export interface DestinationMedia {
  id: string;
  media_type: 'image' | 'video' | 'youtube';
  url: string;
  title?: string;
  source?: string;
  is_primary: boolean;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  state: {
    id: string;
    name: string;
    slug: string;
    code?: string;
  };
  district?: string;
  category: 'city' | 'hill_station' | 'beach' | 'waterfall' | 'temple' | 'monument' | 'national_park' | 'village' | 'heritage_site' | 'adventure' | 'natural' | 'cultural' | 'other';
  description: string;
  history?: string;
  why_famous?: string;
  highlights: string[];
  best_time_to_visit: string;
  weather_info?: string;
  local_food?: string[];
  culture?: string;
  festivals?: string[];
  safety_info?: string;
  accessibility?: string;
  estimated_budget_per_day?: number;
  latitude: number;
  longitude: number;
  is_hidden_gem: boolean;
  is_trending: boolean;
  rating: number;
  review_count: number;
  image: string;
  media?: DestinationMedia[];
  attractions?: Attraction[];
  how_to_reach?: {
    air?: string;
    train?: string;
    road?: string;
  };
  reviews?: Review[];
}

export interface TravelRoom {
  id: string;
  name: string;
  description: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
  destination_name: string;
  destination_slug?: string;
  starting_location: string;
  travel_dates_start: string;
  travel_dates_end: string;
  budget_per_person: number;
  max_members: number;
  current_members_count: number;
  travel_interests: string[];
  status: 'planning' | 'confirmed' | 'ongoing' | 'completed';
  visibility: 'public' | 'private';
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: 'parent' | 'spouse' | 'sibling' | 'friend' | 'colleague' | 'other';
  is_primary: boolean;
  is_verified: boolean;
}

export interface EmergencySession {
  id: string;
  status: 'active' | 'resolved' | 'false_alarm';
  started_at: string;
  resolved_at?: string;
  initial_latitude: number;
  initial_longitude: number;
  initial_address: string;
  alert_type: string;
  battery_level?: number;
}

export interface BudgetProfile {
  starting_location: string;
  budget_amount: number;
  num_days: number;
  num_travellers: number;
  travel_type: 'solo' | 'couple' | 'family' | 'group' | 'business';
  transport_pref: 'budget' | 'comfort' | 'luxury' | 'any';
  accommodation_pref: 'hostel' | 'budget_hotel' | 'mid_range' | 'luxury' | 'homestay' | 'any';
  food_pref: 'street_food' | 'local_restaurants' | 'mid_range' | 'fine_dining' | 'any';
}

export interface BudgetRecommendation {
  destination: string;
  estimated_cost: number;
  breakdown: {
    transport: number;
    accommodation: number;
    food: number;
    activities: number;
    buffer: number;
  };
  tips: string[];
}

export interface TransportOption {
  id: string;
  mode: 'train' | 'bus' | 'flight' | 'taxi';
  name: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  price: number;
  stops: number;
  operator: string;
  rating?: number;
}

export interface Hotel {
  id: string;
  name: string;
  destination: string;
  type: 'hostel' | 'budget_hotel' | 'mid_range' | 'luxury' | 'homestay';
  price_per_night: number;
  rating: number;
  review_count: number;
  amenities: string[];
  image: string;
  address: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
}
