// WAYNEX Connect Social Travel Community Data
// Seeded travel companions, community updates, and mock rooms for offline/API fallback.

export interface TravelCompanion {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  travelStyle: string; // e.g. "Backpacker & Trekker"
  languages: string[];
  favoriteDestinations: string[];
  tripsCompleted: number;
  isVerified: boolean;
  compatibilityScore: number; // e.g. 94%
  connectionStatus: 'none' | 'pending' | 'connected';
}

export interface TravelCommunityUpdate {
  id: string;
  author: string;
  authorAvatar: string;
  location: string;
  timeAgo: string;
  content: string;
  image?: string;
  likesCount: number;
  commentsCount: number;
  tag: string;
}

export const RECOMMENDED_COMPANIONS: TravelCompanion[] = [
  {
    id: 'u-sneha',
    name: 'Sneha Patel',
    username: 'sneha_p',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
    bio: 'Coffee estate enthusiast, weekend trekker, and wildlife photographer. Passionate about sustainable eco-travel.',
    location: 'Bengaluru, Karnataka',
    travelStyle: 'Eco-Trekking & Heritage',
    languages: ['Kannada', 'English', 'Hindi', 'Gujarati'],
    favoriteDestinations: ['Coorg', 'Wayanad', 'Chikmagalur', 'Kabini'],
    tripsCompleted: 12,
    isVerified: true,
    compatibilityScore: 96,
    connectionStatus: 'none',
  },
  {
    id: 'u-aarav',
    name: 'Aarav Mehta',
    username: 'aarav_m',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
    bio: 'Bouldering buff and history student. Love exploring ancient stone architecture and cycling through temple ruins.',
    location: 'Bengaluru, Karnataka',
    travelStyle: 'Backpacking & Cycling',
    languages: ['Hindi', 'English', 'Kannada'],
    favoriteDestinations: ['Hampi', 'Badami', 'Gokarna', 'Pondicherry'],
    tripsCompleted: 18,
    isVerified: true,
    compatibilityScore: 92,
    connectionStatus: 'none',
  },
  {
    id: 'u-ananya',
    name: 'Ananya Sharma',
    username: 'ananya_s',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    bio: 'Solo female traveler advocating safe women-only group journeys. Himalayan wanderer and yoga practitioner.',
    location: 'New Delhi / Chandigarh',
    travelStyle: 'Slow Travel & Himalayan Trails',
    languages: ['Hindi', 'Punjabi', 'English'],
    favoriteDestinations: ['Parvati Valley', 'Spiti', 'Dharamshala', 'Rishikesh'],
    tripsCompleted: 24,
    isVerified: true,
    compatibilityScore: 89,
    connectionStatus: 'none',
  },
  {
    id: 'u-kabir',
    name: 'Kabir Das',
    username: 'kabir_d',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    bio: 'Coastal backpacker and beach camper. Always looking for hidden sea cliffs, seafood shacks, and bonfire music.',
    location: 'Goa / Mangaluru',
    travelStyle: 'Coastal Hikes & Camping',
    languages: ['Konkani', 'English', 'Hindi', 'Marathi'],
    favoriteDestinations: ['Gokarna', 'South Goa', 'Varkala', 'Tarkarli'],
    tripsCompleted: 15,
    isVerified: true,
    compatibilityScore: 88,
    connectionStatus: 'none',
  },
  {
    id: 'u-rohan',
    name: 'Rohan Varma',
    username: 'rohan_v',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    bio: 'Road tripper, Royal Enfield rider, and mountain pass enthusiast. Traversed Ladakh and Spiti circuit thrice.',
    location: 'Pune / Mumbai',
    travelStyle: 'Motorcycle Touring & Adventure',
    languages: ['Marathi', 'Hindi', 'English'],
    favoriteDestinations: ['Ladakh', 'Zanskar', 'Spiti', 'Western Ghats'],
    tripsCompleted: 21,
    isVerified: true,
    compatibilityScore: 85,
    connectionStatus: 'none',
  },
];

export const COMMUNITY_UPDATES: TravelCommunityUpdate[] = [
  {
    id: 'upd-1',
    author: 'Sneha Patel',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    location: 'Coorg, Karnataka',
    timeAgo: '2 hours ago',
    content: 'Just finished an incredible morning mist walk through the Arabica coffee shrubs in Madikeri! Fresh harvest aroma in the air. ☕ If anyone is joining our Coorg room this weekend, pack a light fleece for evening chill!',
    image: 'https://images.unsplash.com/photo-1596761226487-17eb481a5f6e?w=600&auto=format&fit=crop&q=80',
    likesCount: 24,
    commentsCount: 6,
    tag: 'Trip Update',
  },
  {
    id: 'upd-2',
    author: 'Ananya Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    location: 'Kasol, Himachal Pradesh',
    timeAgo: '5 hours ago',
    content: 'Our women-only Himachal retreat group has 2 spots left! We depart from Kashmere Gate, Delhi on Dec 21st. Verified homestay and safe local guide secured. Check the room under Women-Only!',
    likesCount: 38,
    commentsCount: 11,
    tag: 'Looking for Members',
  },
  {
    id: 'upd-3',
    author: 'Aarav Mehta',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    location: 'Hampi, Karnataka',
    timeAgo: '1 day ago',
    content: 'Sunset from Matanga Hill never gets old. Pro tip for travelers: cross the Tungabhadra river before 5:30 PM if you plan to stay on Sanapur side. Coracle boats stop service after dark.',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f443bbf6?w=600&auto=format&fit=crop&q=80',
    likesCount: 52,
    commentsCount: 14,
    tag: 'Travel Tip',
  },
];
