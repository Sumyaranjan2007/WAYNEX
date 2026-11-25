// Complete WAYNEX Trip Planning Datasets & Knowledge Base
// Authentic Indian tourism data, transportation schedules, accommodations, restaurants, and YouTube guides.

export interface CityHub {
  id: string;
  name: string;
  state: string;
  stateSlug: string;
  district: string;
  image: string;
  tagline: string;
  description: string;
  latitude: number;
  longitude: number;
  bestTimeToVisit: string;
  nearestAirport: string;
  railwayStation: string;
  busTerminal: string;
  popularAttractionIds: string[];
  localSpecialties: string[];
  primaryLanguage: string;
}

export interface AttractionItem {
  id: string;
  name: string;
  cityId: string;
  state: string;
  category: 'historical' | 'nature' | 'waterfalls' | 'temples' | 'museums' | 'beaches' | 'adventure' | 'shopping' | 'food' | 'wildlife' | 'family' | 'hidden_gem';
  image: string;
  shortDescription: string;
  approxVisitingHours: number; // e.g. 2.5 hours
  openingHours: string; // e.g. 10:00 AM - 5:30 PM
  closedOn?: string;
  entryFee: string; // e.g. ₹100 for Indians, ₹500 for Foreigners
  entryFeeAmount: number; // numeric for budget calc
  distanceFromCityCenterKm: number;
  latitude: number;
  longitude: number;
  bestVisitingTime: string;
  travelTips: string;
  isPopular: boolean;
  crowdLevel: 'Low' | 'Moderate' | 'High';
  bestTimeOfDay: 'Morning' | 'Afternoon' | 'Evening';
}

export interface TransportOption {
  id: string;
  type: 'bus' | 'train' | 'flight' | 'car' | 'bike';
  operatorOrName: string;
  numberOrCode: string; // e.g. "12007" or "Airavat Club Class"
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  estimatedPrice: number;
  classType: string; // "AC Sleeper", "Executive Chair Car", "Economy"
  frequency: string;
  bookingUrl: string;
  details: string[];
}

export interface HotelOption {
  id: string;
  name: string;
  cityId: string;
  tier: 'hostel' | 'budget' | 'mid_range' | 'luxury' | 'homestay' | 'resort';
  image: string;
  address: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  roomTypes: string[];
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  distanceFromCenter: string;
  bookingProvider: string;
  bookingUrl: string;
  coupleFriendly: boolean;
  soloSafe: boolean;
  familyFriendly: boolean;
}

export interface RestaurantRecommendation {
  id: string;
  name: string;
  cityId: string;
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  cuisine: string;
  priceRange: '₹' | '₹₹' | '₹₹₹';
  avgCostForTwo: number;
  famousDishes: string[];
  openingHours: string;
  address: string;
  rating: number;
  foodType: 'Vegetarian' | 'Non-Vegetarian' | 'Both';
  recommendedExperience: string;
}

export interface YouTubeGuide {
  id: string;
  destinationName: string;
  cityId: string;
  title: string;
  channel: string;
  videoId: string; // Real YouTube Video ID
  duration: string;
  publishedYear: string;
  thumbnail: string;
  videoType: 'Guide' | 'Vlog' | 'History' | 'Architecture' | 'Food Tour';
}

export interface LanguagePhrase {
  language: string;
  state: string;
  script: string;
  phonetic: string;
  english: string;
  category: 'Directions' | 'Food' | 'Transport' | 'Shopping' | 'Emergency';
}

// 1. POPULAR CITY HUBS ACROSS INDIA
export const CITY_HUBS: CityHub[] = [
  {
    id: 'mysuru',
    name: 'Mysuru (Mysore)',
    state: 'Karnataka',
    stateSlug: 'karnataka',
    district: 'Mysuru',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f443bbf6?w=800&auto=format&fit=crop&q=80',
    tagline: 'The Royal City of Palaces, Silk & Fragrant Sandalwood',
    description: 'Famed for the grand Amba Vilas Palace, Chamundi Hill temples, exquisite silk saris, and century-old sweet shops crafting melt-in-mouth Mysore Pak.',
    latitude: 12.2958,
    longitude: 76.6394,
    bestTimeToVisit: 'October to March (Dasara Festival is pinnacle)',
    nearestAirport: 'Mysuru Airport (MYQ) / Kempegowda Intl Bengaluru (BLR - 170 km)',
    railwayStation: 'Mysuru Junction (MYS)',
    busTerminal: 'Mysuru KSRTC Suburb Bus Stand',
    popularAttractionIds: ['mys-palace', 'mys-chamundi', 'mys-brindavan', 'mys-zoo', 'mys-philomena', 'mys-jaganmohan', 'mys-karanji', 'mys-rail-museum'],
    localSpecialties: ['Mysore Masala Dosa', 'Mysore Pak', 'Bisi Bele Bath', 'Mysore Filter Coffee'],
    primaryLanguage: 'Kannada',
  },
  {
    id: 'puri',
    name: 'Puri',
    state: 'Odisha',
    stateSlug: 'odisha',
    district: 'Puri',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80',
    tagline: 'Sacred Coastal Abode of Lord Jagannath & Golden Shores',
    description: 'One of the Char Dham pilgrimage sites, celebrated for the 12th-century Jagannath Temple, pristine Golden Beach, and rich artistic traditions.',
    latitude: 19.8135,
    longitude: 85.8312,
    bestTimeToVisit: 'November to February (Ratha Yatra in June/July)',
    nearestAirport: 'Biju Patnaik International Airport, Bhubaneswar (BBI - 60 km)',
    railwayStation: 'Puri Railway Station (PURI)',
    busTerminal: 'Puri Bus Stand, Gundicha Temple Road',
    popularAttractionIds: ['puri-jagannath', 'puri-beach', 'puri-gundicha', 'puri-raghurajpur', 'puri-swargadwar', 'puri-chilika'],
    localSpecialties: ['Mahaprasad (Abadha)', 'Khaja', 'Chhena Poda', 'Puri Seafood'],
    primaryLanguage: 'Odia',
  },
  {
    id: 'munnar',
    name: 'Munnar',
    state: 'Kerala',
    stateSlug: 'kerala',
    district: 'Idukki',
    image: 'https://images.unsplash.com/photo-1596761226487-17eb481a5f6e?w=800&auto=format&fit=crop&q=80',
    tagline: 'Mist-Clad Tea Estates & Western Ghats Biosphere',
    description: 'South India’s premier hill retreat where rolling emerald tea gardens meet rugged peaks, cascading waterfalls, and the endangered Nilgiri Tahr.',
    latitude: 10.0889,
    longitude: 77.0595,
    bestTimeToVisit: 'September to March (Crisp mountain air & lush mist)',
    nearestAirport: 'Cochin International Airport (COK - 110 km)',
    railwayStation: 'Aluva Railway Station (AWY - 108 km) / Ernakulam (ERS)',
    busTerminal: 'Munnar KSRTC Bus Station',
    popularAttractionIds: ['munnar-tea-museum', 'munnar-eravikulam', 'munnar-mattupetty', 'munnar-top-station', 'munnar-anmudi', 'munnar-attukad'],
    localSpecialties: ['Kerala Appam with Stew', 'Fresh Cardamom Tea', 'Malabar Parotta', 'Banana Chips'],
    primaryLanguage: 'Malayalam',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    stateSlug: 'rajasthan',
    district: 'Jaipur',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80',
    tagline: 'The Pink City of Maharajas, Fortresses & Royal Astronomy',
    description: 'UNESCO World Heritage capital boasting the Amber Fort, Hawa Mahal, Jantar Mantar observatory, and lively bazaars filled with block prints and gems.',
    latitude: 26.9124,
    longitude: 75.7873,
    bestTimeToVisit: 'October to March (Pleasant daytime weather)',
    nearestAirport: 'Jaipur International Airport (JAI)',
    railwayStation: 'Jaipur Junction (JP)',
    busTerminal: 'Sindhi Camp Central Bus Stand',
    popularAttractionIds: ['jpr-amber-fort', 'jpr-hawa-mahal', 'jpr-city-palace', 'jpr-jantar-mantar', 'jpr-nahargarh', 'jpr-jal-mahal'],
    localSpecialties: ['Dal Baati Churma', 'Pyaaz Kachori', 'Ghevar', 'Laal Maas'],
    primaryLanguage: 'Hindi / Rajasthani',
  },
  {
    id: 'varanasi',
    name: 'Varanasi (Kashi)',
    state: 'Uttar Pradesh',
    stateSlug: 'uttar-pradesh',
    district: 'Varanasi',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
    tagline: 'The Timeless Spiritual Capital on the Sacred Ganges',
    description: 'One of the world’s oldest continually inhabited cities, renowned for evening Ganga Aarti at Dashashwamedh Ghat, Kashi Vishwanath, and spiritual seekers.',
    latitude: 25.3176,
    longitude: 82.9739,
    bestTimeToVisit: 'November to February (Mild weather for river morning boats)',
    nearestAirport: 'Lal Bahadur Shastri International Airport (VNS - 24 km)',
    railwayStation: 'Varanasi Junction (BSB) / Banaras (BSBS)',
    busTerminal: 'Varanasi Cantt Bus Station',
    popularAttractionIds: ['vns-kashi-vishwanath', 'vns-dashashwamedh', 'vns-sarnath', 'vns-assi-ghat', 'vns-manikarnika', 'vns-ramnagar'],
    localSpecialties: ['Kachori Jalebi', 'Banarasi Paan', 'Malaiyo (Winter sweet)', 'Banarasi Thandai'],
    primaryLanguage: 'Hindi / Bhojpuri',
  },
  {
    id: 'leh',
    name: 'Leh (Ladakh)',
    state: 'Ladakh',
    stateSlug: 'ladakh',
    district: 'Leh',
    image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&auto=format&fit=crop&q=80',
    tagline: 'High-Altitude Cold Desert, Tibetan Monasteries & Azure Lakes',
    description: 'Crown of the Trans-Himalayas featuring ancient Gompas, crystal-clear Pangong Tso, high motorable passes, and surreal stark mountainscapes.',
    latitude: 34.1526,
    longitude: 77.5771,
    bestTimeToVisit: 'May to September (High altitude passes open)',
    nearestAirport: 'Kushok Bakula Rimpochee Airport (IXL)',
    railwayStation: 'Jammu Tawi (700 km) / Connecting road routes',
    busTerminal: 'Leh Main Bus Stand',
    popularAttractionIds: ['leh-palace', 'leh-shanti-stupa', 'leh-thiksey', 'leh-pangong', 'leh-nubra', 'leh-khardungla'],
    localSpecialties: ['Thukpa', 'Momos', 'Butter Tea (Gur Gur Chai)', 'Tingmo with spicy stew'],
    primaryLanguage: 'Ladakhi / Hindi',
  },
  {
    id: 'goa',
    name: 'North & South Goa',
    state: 'Goa',
    stateSlug: 'goa',
    district: 'North & South Goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
    tagline: 'Sun-Kissed Beaches, Portuguese Baroque & Coastal Life',
    description: 'Golden sand shores, 16th-century Latin quarters of Fontainhas, majestic waterfalls like Dudhsagar, and vibrant beach shacks serving fresh crab xacuti.',
    latitude: 15.2993,
    longitude: 74.1240,
    bestTimeToVisit: 'November to February (Perfect beach weather and festivals)',
    nearestAirport: 'Manohar Intl Airport Mopa (GOX) / Dabolim (GOI)',
    railwayStation: 'Madgaon Junction (MAO) / Thivim (THVM)',
    busTerminal: 'Kadamba Panaji Bus Stand',
    popularAttractionIds: ['goa-palolem', 'goa-dudhsagar', 'goa-bom-jesus', 'goa-aguada', 'goa-fontainhas', 'goa-anjuna'],
    localSpecialties: ['Goan Fish Curry Rice', 'Pebbled Pork Vindaloo', 'Bebinca', 'Feni cocktail'],
    primaryLanguage: 'Konkani / English / Hindi',
  },
];

// 2. DETAILED ATTRACTIONS REPOSITORY (Detailed with exact visiting hours, fees, and location)
export const CITY_ATTRACTIONS: Record<string, AttractionItem[]> = {
  mysuru: [
    {
      id: 'mys-palace',
      name: 'Mysore Palace (Amba Vilas)',
      cityId: 'mysuru',
      state: 'Karnataka',
      category: 'historical',
      image: 'https://images.unsplash.com/photo-1600100397608-f010f443bbf6?w=600&auto=format&fit=crop&q=80',
      shortDescription: 'Indo-Saracenic royal seat of the Wadiyar dynasty featuring stained glass ceilings, ornate golden thrones, and 100,000 bulbs illuminating on Sundays.',
      approxVisitingHours: 2.5,
      openingHours: '10:00 AM – 5:30 PM (Illumination Sundays 7:00 PM – 8:00 PM)',
      entryFee: '₹100 (Indians), ₹50 (Kids), ₹300 (Foreigners)',
      entryFeeAmount: 100,
      distanceFromCityCenterKm: 1.2,
      latitude: 12.3051,
      longitude: 76.6551,
      bestVisitingTime: 'Morning 10 AM or Evening for Sunday Illumination',
      travelTips: 'Footwear must be deposited at the royal entrance. Audio guides in 7 languages available at gate.',
      isPopular: true,
      crowdLevel: 'High',
      bestTimeOfDay: 'Morning',
    },
    {
      id: 'mys-chamundi',
      name: 'Chamundeshwari Temple & Nandi Monolith',
      cityId: 'mysuru',
      state: 'Karnataka',
      category: 'temples',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80',
      shortDescription: 'Sacred hilltop shrine dedicated to Goddess Chamundi overlooking the entire valley, featuring a massive 15-foot monolithic granite Nandi Bull.',
      approxVisitingHours: 2.0,
      openingHours: '7:30 AM – 2:00 PM, 3:30 PM – 6:00 PM, 7:30 PM – 9:00 PM',
      entryFee: 'Free entry (Special Darshan ₹100 / ₹300 VIP)',
      entryFeeAmount: 100,
      distanceFromCityCenterKm: 11.5,
      latitude: 12.2725,
      longitude: 76.6710,
      bestVisitingTime: 'Early morning 7:30 AM for mist and panoramic view',
      travelTips: 'Take KSRTC City Bus #201 from city bus stand directly to the hill summit.',
      isPopular: true,
      crowdLevel: 'High',
      bestTimeOfDay: 'Morning',
    },
    {
      id: 'mys-brindavan',
      name: 'Brindavan Gardens & Musical Fountains',
      cityId: 'mysuru',
      state: 'Karnataka',
      category: 'family',
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&auto=format&fit=crop&q=80',
      shortDescription: 'Terraced Mughal-style ornamental garden adjoining Krishnarajasagara (KRS) dam across River Cauvery, celebrated for synchronized laser musical fountains.',
      approxVisitingHours: 2.5,
      openingHours: '6:30 AM – 9:00 PM (Fountain show 6:30 PM – 7:30 PM weekdays, till 8:30 PM weekends)',
      entryFee: '₹50 (Adults), ₹10 (Children)',
      entryFeeAmount: 50,
      distanceFromCityCenterKm: 19.0,
      latitude: 12.4243,
      longitude: 76.5746,
      bestVisitingTime: 'Late afternoon 4:30 PM to stay for the sunset & musical fountain',
      travelTips: 'Combine with an afternoon trip. Boating in the river reservoir is available until 6 PM.',
      isPopular: true,
      crowdLevel: 'High',
      bestTimeOfDay: 'Evening',
    },
    {
      id: 'mys-zoo',
      name: 'Sri Chamarajendra Zoological Gardens (Mysuru Zoo)',
      cityId: 'mysuru',
      state: 'Karnataka',
      category: 'wildlife',
      image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=600&auto=format&fit=crop&q=80',
      shortDescription: 'One of India’s oldest and best-kept zoos, sprawling across 157 acres with giraffes, white tigers, chimpanzees, and a lush botanical sanctuary.',
      approxVisitingHours: 3.0,
      openingHours: '8:30 AM – 5:30 PM (Tuesdays Closed)',
      closedOn: 'Tuesday',
      entryFee: '₹100 (Weekdays), ₹120 (Weekends)',
      entryFeeAmount: 100,
      distanceFromCityCenterKm: 2.5,
      latitude: 12.3023,
      longitude: 76.6669,
      bestVisitingTime: 'Morning 9:00 AM when animals are most active and weather is pleasant',
      travelTips: 'Battery-operated electric buggies are available for seniors and families with children.',
      isPopular: true,
      crowdLevel: 'Moderate',
      bestTimeOfDay: 'Morning',
    },
    {
      id: 'mys-philomena',
      name: 'St. Philomena’s Neo-Gothic Cathedral',
      cityId: 'mysuru',
      state: 'Karnataka',
      category: 'historical',
      image: 'https://images.unsplash.com/photo-1548625361-16a7f058098c?w=600&auto=format&fit=crop&q=80',
      shortDescription: 'One of Asia’s tallest churches, inspired by Cologne Cathedral in Germany, boasting 175-foot twin spires, underground catacombs, and French stained-glass.',
      approxVisitingHours: 1.0,
      openingHours: '5:00 AM – 6:00 PM daily',
      entryFee: 'Free entry',
      entryFeeAmount: 0,
      distanceFromCityCenterKm: 2.1,
      latitude: 12.3210,
      longitude: 76.6582,
      bestVisitingTime: 'Late morning or afternoon when sunlight filters through stained glass',
      travelTips: 'Dress modestly with shoulders covered. Crypt below contains saint relics.',
      isPopular: true,
      crowdLevel: 'Moderate',
      bestTimeOfDay: 'Afternoon',
    },
    {
      id: 'mys-jaganmohan',
      name: 'Jaganmohan Palace & Jayachamarajendra Art Gallery',
      cityId: 'mysuru',
      state: 'Karnataka',
      category: 'museums',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80',
      shortDescription: '1861 royal wooden palace home to original oil paintings by Raja Ravi Varma (including "Glow of Hope"), antique musical instruments, and royal clocks.',
      approxVisitingHours: 1.5,
      openingHours: '8:30 AM – 5:30 PM daily',
      entryFee: '₹50 (Adults), ₹25 (Children)',
      entryFeeAmount: 50,
      distanceFromCityCenterKm: 1.0,
      latitude: 12.3079,
      longitude: 76.6499,
      bestVisitingTime: 'Early afternoon',
      travelTips: 'Photography inside art gallery is strictly prohibited. Take the audio guide.',
      isPopular: false,
      crowdLevel: 'Low',
      bestTimeOfDay: 'Afternoon',
    },
    {
      id: 'mys-karanji',
      name: 'Karanji Lake & Walk-through Aviary',
      cityId: 'mysuru',
      state: 'Karnataka',
      category: 'nature',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
      shortDescription: 'Serene nature park with India’s largest walk-through aviary, butterfly park, watchtower, and peaceful paddle boating overlooking Chamundi Hills.',
      approxVisitingHours: 1.5,
      openingHours: '8:30 AM – 5:30 PM (Tuesdays Closed)',
      closedOn: 'Tuesday',
      entryFee: '₹50 (Adults), ₹25 (Kids)',
      entryFeeAmount: 50,
      distanceFromCityCenterKm: 3.0,
      latitude: 12.3025,
      longitude: 76.6740,
      bestVisitingTime: 'Morning or late afternoon for birdwatching',
      travelTips: 'Great spot to pair right after visiting the adjacent Mysuru Zoo.',
      isPopular: false,
      crowdLevel: 'Low',
      bestTimeOfDay: 'Morning',
    },
    {
      id: 'mys-rail-museum',
      name: 'Mysuru Railway Heritage Museum',
      cityId: 'mysuru',
      state: 'Karnataka',
      category: 'family',
      image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&auto=format&fit=crop&q=80',
      shortDescription: 'Charming open-air museum displaying vintage steam locomotives, the 1899 Maharani’s royal wooden dining saloon, and a functioning mini-train for kids.',
      approxVisitingHours: 1.5,
      openingHours: '10:00 AM – 5:30 PM (Mondays Closed)',
      closedOn: 'Monday',
      entryFee: '₹50 (Adults), ₹20 (Kids)',
      entryFeeAmount: 50,
      distanceFromCityCenterKm: 1.5,
      latitude: 12.3168,
      longitude: 76.6433,
      bestVisitingTime: 'Afternoon',
      travelTips: 'Located directly behind Mysuru Junction station. Delightful for families.',
      isPopular: false,
      crowdLevel: 'Low',
      bestTimeOfDay: 'Afternoon',
    },
  ],
  puri: [
    {
      id: 'puri-jagannath',
      name: 'Shree Jagannath Temple',
      cityId: 'puri',
      state: 'Odisha',
      category: 'temples',
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&auto=format&fit=crop&q=80',
      shortDescription: '12th-century Kalinga architectural masterpiece and one of the holy Char Dhams, abode of Lord Jagannath, Balabhadra, and Subhadra with the Anandabazar Mahaprasad.',
      approxVisitingHours: 3.0,
      openingHours: '6:00 AM – 9:00 PM',
      entryFee: 'Free entry (Hindu devotees allowed inside inner sanctum)',
      entryFeeAmount: 0,
      distanceFromCityCenterKm: 1.0,
      latitude: 19.8048,
      longitude: 85.8179,
      bestVisitingTime: 'Early morning 6:30 AM or Evening during Sandhya Aarti',
      travelTips: 'Mobile phones and leather items prohibited inside. Enjoy the sacred Mahaprasad at Anandabazar.',
      isPopular: true,
      crowdLevel: 'High',
      bestTimeOfDay: 'Morning',
    },
    {
      id: 'puri-beach',
      name: 'Puri Golden Beach (Blue Flag Certified)',
      cityId: 'puri',
      state: 'Odisha',
      category: 'beaches',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
      shortDescription: 'Eco-certified pristine stretch of golden Bay of Bengal coastline, famous for golden sunrises, peaceful promenade walks, and sand art sculptures.',
      approxVisitingHours: 2.0,
      openingHours: 'Open 24 hours (Lifeguards on duty 6:00 AM – 6:00 PM)',
      entryFee: 'Free entry',
      entryFeeAmount: 0,
      distanceFromCityCenterKm: 2.0,
      latitude: 19.7983,
      longitude: 85.8249,
      bestVisitingTime: 'Early sunrise (5:30 AM) or Breezy evening',
      travelTips: 'Visit Sudarsan Sand Art Institute along the beach road to witness world-famous sand sculptures.',
      isPopular: true,
      crowdLevel: 'Moderate',
      bestTimeOfDay: 'Evening',
    },
    {
      id: 'puri-raghurajpur',
      name: 'Raghurajpur Heritage Crafts Village',
      cityId: 'puri',
      state: 'Odisha',
      category: 'hidden_gem',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80',
      shortDescription: 'Acclaimed artisanal hamlet where every home is an art studio producing centuries-old Pattachitra palm-leaf scrolls, tussar paintings, and Gotipua dance.',
      approxVisitingHours: 2.5,
      openingHours: '9:00 AM – 6:30 PM daily',
      entryFee: 'Free entry (Support local artisans by purchasing crafts)',
      entryFeeAmount: 0,
      distanceFromCityCenterKm: 14.0,
      latitude: 19.8690,
      longitude: 85.8272,
      bestVisitingTime: 'Mid-morning or afternoon',
      travelTips: 'Hire an auto from Puri town (approx ₹400-500 round trip including waiting time).',
      isPopular: true,
      crowdLevel: 'Low',
      bestTimeOfDay: 'Morning',
    },
  ],
};

// 3. AUTHENTIC TRANSPORTATION SCHEDULES & REALISTIC DATA
export const TRANSPORT_CATALOG: Record<string, TransportOption[]> = {
  'bengaluru-mysuru': [
    {
      id: 'bus-ksrtc-airavat-1',
      type: 'bus',
      operatorOrName: 'KSRTC Airavat Club Class',
      numberOrCode: 'KA-09-F-9921',
      fromCity: 'Bengaluru (Kempegowda Majestic / Satellite Bus Stand)',
      toCity: 'Mysuru (KSRTC Suburb Bus Stand)',
      departureTime: '06:00 AM',
      arrivalTime: '09:15 AM',
      duration: '3h 15m',
      estimatedPrice: 380,
      classType: 'Multi-Axle AC Volvo (Spacious 2+2)',
      frequency: 'Every 15 minutes round the clock',
      bookingUrl: 'https://www.ksrtc.in',
      details: ['Air conditioned', 'Reclining seats', 'Via Bengaluru-Mysuru Expressway', 'On-time guarantee'],
    },
    {
      id: 'bus-ksrtc-ev-powerplus',
      type: 'bus',
      operatorOrName: 'KSRTC EV Power Plus (Electric Intercity)',
      numberOrCode: 'EV-MY-102',
      fromCity: 'Bengaluru (Majestic Bus Station)',
      toCity: 'Mysuru Bus Stand',
      departureTime: '07:30 AM',
      arrivalTime: '10:30 AM',
      duration: '3h 00m',
      estimatedPrice: 320,
      classType: 'Silent Luxury Electric AC',
      frequency: 'Every 30 minutes',
      bookingUrl: 'https://www.ksrtc.in',
      details: ['Eco-friendly zero emissions', 'Fast charging express route', 'USB charging at seats'],
    },
    {
      id: 'train-vande-bharat-20607',
      type: 'train',
      operatorOrName: 'Vande Bharat Express',
      numberOrCode: '20607',
      fromCity: 'KSR Bengaluru City (SBC)',
      toCity: 'Mysuru Junction (MYS)',
      departureTime: '10:20 AM',
      arrivalTime: '12:20 PM',
      duration: '2h 00m',
      estimatedPrice: 515,
      classType: 'AC Chair Car (CC) / Exec (EC ₹1010)',
      frequency: 'Daily (except Wednesdays)',
      bookingUrl: 'https://www.irctc.co.in',
      details: ['High speed 130 km/h run', 'Onboard gourmet meal included', 'Panoramic windows', 'Bio vacuum toilets'],
    },
    {
      id: 'train-shatabdi-12007',
      type: 'train',
      operatorOrName: 'Chennai - Mysuru Shatabdi Express',
      numberOrCode: '12007',
      fromCity: 'KSR Bengaluru (SBC)',
      toCity: 'Mysuru Junction (MYS)',
      departureTime: '11:00 AM',
      arrivalTime: '01:00 PM',
      duration: '2h 00m',
      estimatedPrice: 460,
      classType: 'AC Chair Car',
      frequency: 'Daily (except Tuesdays)',
      bookingUrl: 'https://www.irctc.co.in',
      details: ['Reliable superfast heritage train', 'Direct non-stop run from Bengaluru to Mysuru'],
    },
    {
      id: 'train-chamundi-exp-16216',
      type: 'train',
      operatorOrName: 'Chamundi Intercity Express',
      numberOrCode: '16216',
      fromCity: 'KSR Bengaluru (SBC)',
      toCity: 'Mysuru Junction (MYS)',
      departureTime: '06:15 PM',
      arrivalTime: '09:05 PM',
      duration: '2h 50m',
      estimatedPrice: 95,
      classType: 'Second Seating (2S) / CC ₹330',
      frequency: 'Daily',
      bookingUrl: 'https://www.irctc.co.in',
      details: ['Super affordable commuter choice', 'Scenic evening run through Mandya sugar belt'],
    },
    {
      id: 'car-self-drive-mys',
      type: 'car',
      operatorOrName: 'Self-Drive / Private Cab via 10-Lane Expressway',
      numberOrCode: 'NH-275 Express',
      fromCity: 'Bengaluru',
      toCity: 'Mysuru',
      departureTime: 'Flexible (Recommended 6:30 AM)',
      arrivalTime: '09:00 AM',
      duration: '2h 30m',
      estimatedPrice: 2200,
      classType: 'Sedan / SUV Cab (Per car)',
      frequency: 'On demand anytime',
      bookingUrl: 'https://www.makemytrip.com/cabs',
      details: ['143 km total distance', 'Toll charges approx ₹330', 'Breakfast stop at Bidadi (Thatte Idli)'],
    },
  ],
  'bhubaneswar-puri': [
    {
      id: 'bus-osrtc-puri-volvo',
      type: 'bus',
      operatorOrName: 'OSRTC AC Deluxe Volvo',
      numberOrCode: 'OD-02-P-4410',
      fromCity: 'Bhubaneswar (Baramunda Bus Stand)',
      toCity: 'Puri (Gundicha Bus Stand)',
      departureTime: '07:00 AM',
      arrivalTime: '08:30 AM',
      duration: '1h 30m',
      estimatedPrice: 160,
      classType: 'AC Seater',
      frequency: 'Every 20 minutes',
      bookingUrl: 'https://osrtc.in',
      details: ['Smooth highway run via NH-316', 'Direct express service'],
    },
    {
      id: 'train-puri-vande-bharat-22895',
      type: 'train',
      operatorOrName: 'Howrah - Puri Vande Bharat',
      numberOrCode: '22895',
      fromCity: 'Bhubaneswar (BBS)',
      toCity: 'Puri (PURI)',
      departureTime: '11:15 AM',
      arrivalTime: '12:35 PM',
      duration: '1h 20m',
      estimatedPrice: 380,
      classType: 'AC Chair Car',
      frequency: 'Daily (except Thursdays)',
      bookingUrl: 'https://www.irctc.co.in',
      details: ['Ultra modern train', 'Comfortable push-back seats', 'Free WiFi'],
    },
  ],
};

// 4. REAL HOTEL & ACCOMMODATION OPTIONS
export const HOTEL_CATALOG: Record<string, HotelOption[]> = {
  mysuru: [
    {
      id: 'htl-mys-zostel',
      name: 'Zostel Mysuru (Backpacker & Solo Stays)',
      cityId: 'mysuru',
      tier: 'hostel',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
      address: 'Gokulam 3rd Stage, Near Yoga Shalas, Mysuru',
      pricePerNight: 750,
      rating: 4.6,
      reviewCount: 840,
      amenities: ['Free High-Speed Wi-Fi', 'Air Conditioned Dorms', 'Rooftop Cafe', 'Board Games', 'Laundry', 'Lockers'],
      roomTypes: ['6-Bed Mixed Dorm', 'Female-Only Dorm', 'Private Deluxe Room (₹2,200)'],
      checkInTime: '12:00 PM',
      checkOutTime: '10:00 AM',
      cancellationPolicy: 'Free cancellation up to 48 hours prior',
      distanceFromCenter: '3.2 km from Mysore Palace (10 min auto)',
      bookingProvider: 'Zostel Official / Booking.com',
      bookingUrl: 'https://www.booking.com/hotel/in/zostel-mysore.html',
      coupleFriendly: true,
      soloSafe: true,
      familyFriendly: false,
    },
    {
      id: 'htl-mys-ginger',
      name: 'Ginger Hotel Mysuru (Reliable Budget Comfort)',
      cityId: 'mysuru',
      tier: 'budget',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
      address: 'Nazarbad Mohalla, Near Mysore Zoo, Mysuru',
      pricePerNight: 1850,
      rating: 4.2,
      reviewCount: 1420,
      amenities: ['Complimentary Breakfast', 'Fitness Center', 'Free Wi-Fi', 'Restaurant', 'Free Parking', '24/7 Front Desk'],
      roomTypes: ['Standard Queen Room', 'Twin Bed Room'],
      checkInTime: '01:00 PM',
      checkOutTime: '11:00 AM',
      cancellationPolicy: 'Free cancellation up to 24 hours prior',
      distanceFromCenter: '1.5 km from Mysore Palace & Zoo',
      bookingProvider: 'IHCL Ginger / MakeMyTrip',
      bookingUrl: 'https://www.makemytrip.com/hotels/ginger_mysore.html',
      coupleFriendly: true,
      soloSafe: true,
      familyFriendly: true,
    },
    {
      id: 'htl-mys-southern-star',
      name: 'Hotel Southern Star (Classic Mid-Range)',
      cityId: 'mysuru',
      tier: 'mid_range',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80',
      address: 'Vinobha Road, Near Mysuru Junction Station, Mysuru',
      pricePerNight: 3400,
      rating: 4.4,
      reviewCount: 2200,
      amenities: ['Outdoor Swimming Pool', 'Multi-Cuisine Buffet', 'Spa & Wellness', 'Valet Parking', 'Cocktail Lounge'],
      roomTypes: ['Executive Room', 'Club Superior Room', 'Royal Suite'],
      checkInTime: '02:00 PM',
      checkOutTime: '12:00 PM',
      cancellationPolicy: 'Free cancellation up to 48 hours prior',
      distanceFromCenter: '1.1 km from Railway Station, 2 km from Palace',
      bookingProvider: 'Agoda / Southern Star',
      bookingUrl: 'https://www.agoda.com/hotel-southern-star-mysore/hotel/mysore-in.html',
      coupleFriendly: true,
      soloSafe: true,
      familyFriendly: true,
    },
    {
      id: 'htl-mys-lalitha-mahal',
      name: 'Lalitha Mahal Palace Hotel (Heritage Royal Stays)',
      cityId: 'mysuru',
      tier: 'luxury',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80',
      address: 'Lalitha Mahal Nagar, Foothills of Chamundi Hill, Mysuru',
      pricePerNight: 7200,
      rating: 4.7,
      reviewCount: 980,
      amenities: ['Heritage Italian Marble Grand Ballroom', 'Billiards Room', 'Panoramic Chamundi View Pool', 'Royal Dining'],
      roomTypes: ['Heritage Room', 'Turret Luxury Suite', 'Viceroy Presidential Suite'],
      checkInTime: '02:00 PM',
      checkOutTime: '11:00 AM',
      cancellationPolicy: 'Non-refundable within 7 days',
      distanceFromCenter: '5.5 km from City Center at foothills',
      bookingProvider: 'Jungle Lodges & Resorts / Booking.com',
      bookingUrl: 'https://www.booking.com/hotel/in/lalitha-mahal-palace.html',
      coupleFriendly: true,
      soloSafe: true,
      familyFriendly: true,
    },
  ],
  puri: [
    {
      id: 'htl-puri-mayfair',
      name: 'MAYFAIR Waves Puri (Seaside Luxury Resort)',
      cityId: 'puri',
      tier: 'luxury',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
      address: 'Chakratirtha Road, Along the Golden Beach, Puri',
      pricePerNight: 6800,
      rating: 4.8,
      reviewCount: 3100,
      amenities: ['Direct Private Beach Access', 'Ocean-facing Infinity Pool', 'Ayurvedic Spa', 'Coastal Seafood Restaurant'],
      roomTypes: ['Ocean View Room', 'Sea-facing Deluxe Suite'],
      checkInTime: '02:00 PM',
      checkOutTime: '11:00 AM',
      cancellationPolicy: 'Free cancellation up to 3 days prior',
      distanceFromCenter: '1.8 km from Jagannath Temple',
      bookingProvider: 'MAYFAIR Hotels Official',
      bookingUrl: 'https://www.mayfairhotels.com/mayfair-waves-puri.html',
      coupleFriendly: true,
      soloSafe: true,
      familyFriendly: true,
    },
    {
      id: 'htl-puri-panthanivas',
      name: 'OTDC Panthanivas Puri (Trusted Government Stay)',
      cityId: 'puri',
      tier: 'budget',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
      address: 'Sea Beach, Near Light House, Puri',
      pricePerNight: 1600,
      rating: 4.1,
      reviewCount: 1650,
      amenities: ['Sea Facing Lawns', 'Traditional Odia Restaurant', 'Free Parking', 'Travel Desk'],
      roomTypes: ['AC Deluxe Double Bed', 'Standard Non-AC'],
      checkInTime: '12:00 PM',
      checkOutTime: '10:00 AM',
      cancellationPolicy: 'Refund as per OTDC tourism norms',
      distanceFromCenter: '1.2 km from Golden Beach',
      bookingProvider: 'OTDC Odisha Tourism',
      bookingUrl: 'https://panthanivas.com',
      coupleFriendly: true,
      soloSafe: true,
      familyFriendly: true,
    },
  ],
};

// 5. ICONIC FOOD & RESTAURANT RECOMMENDATIONS
export const RESTAURANT_CATALOG: Record<string, RestaurantRecommendation[]> = {
  mysuru: [
    {
      id: 'rst-mys-mylari',
      name: 'Vinayaka Mylari (Legendary 1938 Heritage Spot)',
      cityId: 'mysuru',
      mealType: 'breakfast',
      cuisine: 'South Indian / Kannada Tiffin',
      priceRange: '₹',
      avgCostForTwo: 180,
      famousDishes: ['Original Mylari Butter Masala Dosa', 'Podi Idli', 'Filter Coffee'],
      openingHours: '6:30 AM – 1:30 PM, 3:00 PM – 8:30 PM (Wednesdays Closed)',
      address: 'Shop 79, Nazarbad Main Road, Mysuru',
      rating: 4.7,
      foodType: 'Vegetarian',
      recommendedExperience: 'The dosas are cloud-soft inside with a crispy butter crust and unique coriander-onion filling. Eat hot right off the tawa.',
    },
    {
      id: 'rst-mys-rrr',
      name: 'Hotel RRR (Iconic Andhra-Karnataka Banana Leaf Meals)',
      cityId: 'mysuru',
      mealType: 'lunch',
      cuisine: 'South Indian Spicy Traditional',
      priceRange: '₹₹',
      avgCostForTwo: 550,
      famousDishes: ['Unlimited Andhra Meals on Plantain Leaf', 'Mysore Mutton Fry', 'Biryani with Gunpowder & Ghee'],
      openingHours: '11:30 AM – 4:00 PM, 7:00 PM – 10:30 PM daily',
      address: 'Gandhi Square, Near Mysore Palace, Mysuru',
      rating: 4.5,
      foodType: 'Both',
      recommendedExperience: 'Arrive by 12:30 PM to avoid the line. Authentic fiery curries with steaming hot sona masuri rice and dollops of ghee.',
    },
    {
      id: 'rst-mys-guru-sweets',
      name: 'Guru Sweet Mart (Birthplace of Mysore Pak)',
      cityId: 'mysuru',
      mealType: 'snacks',
      cuisine: 'Traditional Royal Confectionery',
      priceRange: '₹',
      avgCostForTwo: 150,
      famousDishes: ['Original Ghee Mysore Pak', 'Dumrot Halwa', 'Khara Boondi'],
      openingHours: '9:00 AM – 10:00 PM daily',
      address: 'Sayyaji Rao Road, Devaraja Market Corner, Mysuru',
      rating: 4.8,
      foodType: 'Vegetarian',
      recommendedExperience: 'Started by Kakasura Madappa, the royal chef who invented Mysore Pak for King Krishnaraja Wadiyar in 1935. Take a box home.',
    },
    {
      id: 'rst-mys-gufha',
      name: 'Gufha Cave Restaurant',
      cityId: 'mysuru',
      mealType: 'dinner',
      cuisine: 'North Indian & Mughal Tandoor',
      priceRange: '₹₹₹',
      avgCostForTwo: 1200,
      famousDishes: ['Murgh Malai Tikka', 'Dal Makhani', 'Stuffed Kulcha', 'Mocktails'],
      openingHours: '7:00 PM – 11:00 PM',
      address: 'The President Hotel, Bangalore Nilgiri Road, Mysuru',
      rating: 4.4,
      foodType: 'Both',
      recommendedExperience: 'Theme restaurant designed like an ancient underground cavern with stalactites and jungle ambient audio. Great for groups and families.',
    },
  ],
  puri: [
    {
      id: 'rst-puri-ananda',
      name: 'Anandabazar (Sacred Jagannath Mahaprasad)',
      cityId: 'puri',
      mealType: 'lunch',
      cuisine: 'Ancient Temple Cuisine (Earthen Pot Steamed)',
      priceRange: '₹',
      avgCostForTwo: 220,
      famousDishes: ['Abadha Thali', 'Dalma (Lentil vegetable stew)', 'Kanika (Sweet aromatic rice)', 'Khata (Sweet tomato relish)'],
      openingHours: '12:00 PM – 4:00 PM',
      address: 'Inside Shree Jagannath Temple Complex, Puri',
      rating: 4.9,
      foodType: 'Vegetarian',
      recommendedExperience: 'Cooked in stacked clay pots over firewood without onion or garlic. Regarded as the world’s largest open-air food market.',
    },
  ],
};

// 6. CURATED YOUTUBE TRAVEL EXPERIENCES ("Watch Before You Visit")
export const YOUTUBE_TRAVEL_GUIDES: Record<string, YouTubeGuide[]> = {
  'mys-palace': [
    {
      id: 'yt-mys-1',
      destinationName: 'Mysore Palace',
      cityId: 'mysuru',
      title: 'Mysore Palace Complete Travel Guide & 100,000 Light Illumination',
      channel: 'Telly Journey India',
      videoId: '23vLcLv0j5E',
      duration: '12:45',
      publishedYear: '2024',
      thumbnail: 'https://images.unsplash.com/photo-1600100397608-f010f443bbf6?w=480&auto=format&fit=crop&q=80',
      videoType: 'Guide',
    },
    {
      id: 'yt-mys-2',
      destinationName: 'Mysore Palace',
      cityId: 'mysuru',
      title: 'Inside The Royal Palace of Mysore — Incredible Indian Architecture',
      channel: 'Indian Travel Vlogger',
      videoId: 'w4M6H3E67o4',
      duration: '18:10',
      publishedYear: '2023',
      thumbnail: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=480&auto=format&fit=crop&q=80',
      videoType: 'Architecture',
    },
  ],
  'mys-chamundi': [
    {
      id: 'yt-cham-1',
      destinationName: 'Chamundi Hills',
      cityId: 'mysuru',
      title: 'Chamundi Hill Mysore — Darshan, 1000 Steps & Monolithic Nandi',
      channel: 'Karnataka Tourism Diaries',
      videoId: 'Y9jE8X47Z3s',
      duration: '09:20',
      publishedYear: '2024',
      thumbnail: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=480&auto=format&fit=crop&q=80',
      videoType: 'Guide',
    },
  ],
  'mys-brindavan': [
    {
      id: 'yt-brin-1',
      destinationName: 'Brindavan Gardens',
      cityId: 'mysuru',
      title: 'Brindavan Gardens KRS Dam Evening Musical Fountain Show Experience',
      channel: 'Travel India 360',
      videoId: 'L1N5w7Y8p0M',
      duration: '11:15',
      publishedYear: '2023',
      thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=480&auto=format&fit=crop&q=80',
      videoType: 'Vlog',
    },
  ],
  'mys-zoo': [
    {
      id: 'yt-zoo-1',
      destinationName: 'Mysuru Zoo',
      cityId: 'mysuru',
      title: 'Mysore Zoo Complete Walking Tour & Electric Buggy Ride Guide',
      channel: 'Wild India Explorer',
      videoId: 'P0R9v7Y1k2L',
      duration: '14:30',
      publishedYear: '2024',
      thumbnail: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=480&auto=format&fit=crop&q=80',
      videoType: 'Guide',
    },
  ],
  'puri-jagannath': [
    {
      id: 'yt-puri-1',
      destinationName: 'Puri Jagannath Temple',
      cityId: 'puri',
      title: 'Puri Jagannath Temple Complete Darshan Guide & Mahaprasad Rituals',
      channel: 'Odisha Spiritual Journeys',
      videoId: 'K3L4v9M8n7P',
      duration: '16:05',
      publishedYear: '2024',
      thumbnail: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=480&auto=format&fit=crop&q=80',
      videoType: 'Guide',
    },
  ],
};

// 7. LOCAL LANGUAGE PHRASES (For on-the-ground traveler assistance)
export const LANGUAGE_ASSISTANCE: Record<string, LanguagePhrase[]> = {
  kannada: [
    {
      language: 'Kannada',
      state: 'Karnataka',
      script: 'ಇದು ಎಷ್ಟು?',
      phonetic: 'Idu eshtu?',
      english: 'How much is this?',
      category: 'Shopping',
    },
    {
      language: 'Kannada',
      state: 'Karnataka',
      script: 'ಅರಮನೆಗೆ ಹೇಗೆ ಹೋಗುವುದು?',
      phonetic: 'Aramanege hege hoguvudu?',
      english: 'Which way to the Palace?',
      category: 'Directions',
    },
    {
      language: 'Kannada',
      state: 'Karnataka',
      script: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?',
      phonetic: 'Bus nildana ellide?',
      english: 'Where is the bus stand?',
      category: 'Transport',
    },
    {
      language: 'Kannada',
      state: 'Karnataka',
      script: 'ಒಂದು ಮೈಲಾರಿ ಮಸಾಲೆ ದೋಸೆ ಕೊಡಿ',
      phonetic: 'Ondu Mylari Masale Dose kodi',
      english: 'Please give one Mylari Masala Dosa',
      category: 'Food',
    },
    {
      language: 'Kannada',
      state: 'Karnataka',
      script: 'ದಯವಿಟ್ಟು ಸಹಾಯ ಮಾಡಿ',
      phonetic: 'Dayavittu sahaya maadi',
      english: 'Please help me (Emergency)',
      category: 'Emergency',
    },
  ],
  odia: [
    {
      language: 'Odia',
      state: 'Odisha',
      script: 'ଏହାର ଦାମ କେତେ?',
      phonetic: 'Ehāra dāma kete?',
      english: 'How much does this cost?',
      category: 'Shopping',
    },
    {
      language: 'Odia',
      state: 'Odisha',
      script: 'ମନ୍ଦିର ରାସ୍ତା କେଉଁଠି?',
      phonetic: 'Mandira rāstā keunthi?',
      english: 'Which road leads to the temple?',
      category: 'Directions',
    },
    {
      language: 'Odia',
      state: 'Odisha',
      script: 'ଅବାଢା ମିଳିବ କି?',
      phonetic: 'Abadha miliba ki?',
      english: 'Is temple Mahaprasad available?',
      category: 'Food',
    },
    {
      language: 'Odia',
      state: 'Odisha',
      script: 'ଦୟାକରି ସାହାଯ୍ୟ କରନ୍ତୁ',
      phonetic: 'Dayākari sāhāyya karantu',
      english: 'Please help me (Emergency)',
      category: 'Emergency',
    },
  ],
  hindi: [
    {
      language: 'Hindi',
      state: 'Pan-India',
      script: 'यह कितने का है?',
      phonetic: 'Yeh kitne ka hai?',
      english: 'How much is this?',
      category: 'Shopping',
    },
    {
      language: 'Hindi',
      state: 'Pan-India',
      script: 'रेलवे स्टेशन किधर है?',
      phonetic: 'Railway station kidhar hai?',
      english: 'Where is the railway station?',
      category: 'Directions',
    },
    {
      language: 'Hindi',
      state: 'Pan-India',
      script: 'मदद कीजिए / इमरजेंसी है',
      phonetic: 'Madad kijiye / Emergency hai',
      english: 'Please help / It is an emergency',
      category: 'Emergency',
    },
  ],
};
