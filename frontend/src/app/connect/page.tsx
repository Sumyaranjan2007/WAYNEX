'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Users,
  Plus,
  MapPin,
  Calendar,
  Sparkles,
  Search,
  CheckCircle2,
  Lock,
  Globe,
  Share2,
  ShieldCheck,
  Compass,
  ArrowRight,
  Filter,
  Flame,
  UserCheck,
  Heart,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TravelRoom } from '@/types';
import {
  RECOMMENDED_COMPANIONS,
  COMMUNITY_UPDATES,
  TravelCompanion,
} from '@/data/connectData';
import { CreateRoomModal } from '@/components/connect/CreateRoomModal';
import { RoomCard } from '@/components/connect/RoomCard';
import { RoomWorkspace } from '@/components/connect/RoomWorkspace';
import { MemberProfileModal } from '@/components/connect/MemberProfileModal';

const INITIAL_ROOMS: TravelRoom[] = [
  {
    id: 'room-1',
    name: 'Coorg Coffee Plantation & River Rafting Trek',
    description:
      'Exploring misty Arabica coffee estates, trekking to Abbey Falls, bonfire stories at a traditional Kodava homestay, and whitewater rafting in Dubare.',
    creator: {
      id: 'u-1',
      name: 'Sneha Patel',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
    },
    creator_username: 'sneha_p',
    destination_name: 'Coorg, Karnataka',
    destination_city: 'Madikeri',
    state_name: 'Karnataka',
    cover_image:
      'https://images.unsplash.com/photo-1596761226487-17eb481a5f6e?w=800&auto=format&fit=crop&q=80',
    destination_slug: 'coorg',
    starting_location: 'Bengaluru / Mysuru',
    travel_dates_start: '2026-12-15',
    travel_dates_end: '2026-12-18',
    duration_days: 3,
    budget_per_person: 4500,
    min_budget: 3500,
    max_budget: 5500,
    max_members: 6,
    current_members_count: 4,
    member_count: 4,
    travel_interests: ['Trekking', 'Coffee Estates', 'River Rafting', 'Homestay'],
    travel_style: 'trekking',
    transport_preference: 'bus',
    status: 'planning',
    visibility: 'public',
    join_approval: 'auto',
    women_only: false,
    live_mode: false,
  },
  {
    id: 'room-2',
    name: 'Women-Only Himachal Parvati Valley & Kasol Retreat',
    description:
      'All-female backpackers retreat into Parvati Valley! Scenic Chalal riverside walks, authentic Israeli cafes, Manikaran hot springs, and safe guided hikes.',
    creator: {
      id: 'u-2',
      name: 'Ananya Sharma',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    },
    creator_username: 'ananya_s',
    destination_name: 'Kasol, Himachal Pradesh',
    destination_city: 'Kasol',
    state_name: 'Himachal Pradesh',
    cover_image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    destination_slug: 'kasol',
    starting_location: 'Delhi (Kashmere Gate) / Chandigarh',
    travel_dates_start: '2026-12-21',
    travel_dates_end: '2026-12-26',
    duration_days: 5,
    budget_per_person: 7800,
    min_budget: 6500,
    max_budget: 9000,
    max_members: 6,
    current_members_count: 3,
    member_count: 3,
    travel_interests: ['Himalayas', 'Riverside Cafes', 'Women-Only', 'Hot Springs'],
    travel_style: 'backpacking',
    transport_preference: 'bus',
    status: 'confirmed',
    visibility: 'public',
    join_approval: 'manual',
    women_only: true,
    live_mode: false,
  },
  {
    id: 'room-3',
    name: 'Hampi Bouldering, Ruins & Sunset Cycling',
    description:
      'Solo travelers meeting up to rent bicycles, climb granite boulders at Sanapur, explore Vijayanagara temple architecture, and catch golden sunsets from Matanga Hill.',
    creator: {
      id: 'u-3',
      name: 'Aarav Mehta',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
    },
    creator_username: 'aarav_m',
    destination_name: 'Hampi, Karnataka',
    destination_city: 'Hampi',
    state_name: 'Karnataka',
    cover_image:
      'https://images.unsplash.com/photo-1600100397608-f010f443bbf6?w=800&auto=format&fit=crop&q=80',
    destination_slug: 'hampi',
    starting_location: 'Bengaluru (KSR / Majestic)',
    travel_dates_start: '2026-12-05',
    travel_dates_end: '2026-12-08',
    duration_days: 3,
    budget_per_person: 3500,
    min_budget: 3000,
    max_budget: 4500,
    max_members: 6,
    current_members_count: 4,
    member_count: 4,
    travel_interests: ['Bouldering', 'Ancient Ruins', 'Cycling', 'Photography'],
    travel_style: 'backpacking',
    transport_preference: 'train',
    status: 'planning',
    visibility: 'public',
    join_approval: 'auto',
    women_only: false,
    live_mode: true,
  },
  {
    id: 'room-4',
    name: 'Gokarna Cliff Trek & Beach Bonfire Backpackers',
    description:
      'Backpacking between Kudle, Om, Half Moon, and Paradise Beach. Camping under coastal stars, fresh seafood shacks, and yoga at sunrise.',
    creator: {
      id: 'u-4',
      name: 'Kabir Das',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    },
    creator_username: 'kabir_d',
    destination_name: 'Gokarna, Karnataka',
    destination_city: 'Gokarna',
    state_name: 'Karnataka',
    cover_image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    destination_slug: 'gokarna',
    starting_location: 'Goa / Hubballi',
    travel_dates_start: '2026-12-28',
    travel_dates_end: '2027-01-02',
    duration_days: 5,
    budget_per_person: 3800,
    min_budget: 3200,
    max_budget: 5000,
    max_members: 8,
    current_members_count: 5,
    member_count: 5,
    travel_interests: ['Beach Trekking', 'Camping', 'Bonfire', 'Seafood'],
    travel_style: 'backpacking',
    transport_preference: 'bus',
    status: 'planning',
    visibility: 'public',
    join_approval: 'auto',
    women_only: false,
    live_mode: false,
  },
];

type CategoryFilter = 'all' | 'trending' | 'women-only' | 'solo' | 'available' | 'my-rooms';

export default function ConnectPage() {
  const [rooms, setRooms] = useState<TravelRoom[]>(INITIAL_ROOMS);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [selectedTransit, setSelectedTransit] = useState('all');

  // Modal & Workspace states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRoomForWorkspace, setSelectedRoomForWorkspace] = useState<TravelRoom | null>(null);
  const [selectedCompanion, setSelectedCompanion] = useState<TravelCompanion | null>(null);
  const [joinedRoomIds, setJoinedRoomIds] = useState<string[]>(['room-3']);

  // Fetch rooms from backend on mount
  useEffect(() => {
    async function fetchBackendRooms() {
      try {
        const res = await fetch('http://localhost:8000/api/v1/social/rooms/');
        if (res.ok) {
          const data = await res.json();
          const results = data.results || data;
          if (Array.isArray(results) && results.length > 0) {
            // Merge with local fallback
            const mappedRooms: TravelRoom[] = results.map((r: any) => ({
              id: String(r.id),
              name: r.name,
              description: r.description || '',
              creator: {
                id: String(r.creator?.id || 'u-0'),
                name: r.creator_username || r.creator?.name || 'Explorer',
                avatar:
                  r.creator?.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
              },
              creator_username: r.creator_username,
              destination_name: r.destination_city || r.destination_name || 'India',
              destination_city: r.destination_city,
              state_name: r.state_name,
              cover_image:
                r.cover_image ||
                'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800&auto=format&fit=crop&q=80',
              starting_location: r.starting_location || 'Bengaluru',
              travel_dates_start: r.travel_dates_start || '2026-12-15',
              travel_dates_end: r.travel_dates_end || '2026-12-18',
              duration_days: r.duration_days || 3,
              budget_per_person: Number(r.budget_per_person) || Number(r.min_budget) || 4000,
              min_budget: Number(r.min_budget) || 3000,
              max_budget: Number(r.max_budget) || 5000,
              max_members: r.max_members || 6,
              current_members_count: r.member_count || r.current_members_count || 1,
              member_count: r.member_count || r.current_members_count || 1,
              travel_interests: r.travel_interests || ['Travel', 'Explore'],
              travel_style: r.travel_style || 'backpacking',
              transport_preference: r.transport_preference || 'bus',
              status: r.status || 'planning',
              visibility: r.visibility || 'public',
              join_approval: r.join_approval || 'auto',
              women_only: Boolean(r.women_only),
              live_mode: Boolean(r.live_mode),
            }));

            // Combine unique rooms
            setRooms((prev) => {
              const ids = new Set(mappedRooms.map((m) => m.id));
              const extras = prev.filter((p) => !ids.has(p.id));
              return [...mappedRooms, ...extras];
            });
          }
        }
      } catch (e) {
        // Fallback silently to initial rooms
        console.warn('Backend rooms fetch offline or unavailable, using seeded rooms', e);
      }
    }

    fetchBackendRooms();
  }, []);

  // Filtered rooms logic
  const filteredRooms = rooms.filter((room) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = room.name.toLowerCase().includes(q);
      const matchDest = (room.destination_city || room.destination_name || '')
        .toLowerCase()
        .includes(q);
      const matchState = (room.state_name || '').toLowerCase().includes(q);
      if (!matchName && !matchDest && !matchState) return false;
    }

    // Category Tabs
    if (activeCategory === 'women-only' && !room.women_only) return false;
    if (activeCategory === 'trending' && (room.current_members_count || 1) < 3) return false;
    if (activeCategory === 'solo' && room.travel_style !== 'backpacking') return false;
    if (
      activeCategory === 'available' &&
      (room.current_members_count || 1) >= room.max_members
    )
      return false;
    if (activeCategory === 'my-rooms' && !joinedRoomIds.includes(room.id)) return false;

    // Travel Style Dropdown
    if (selectedStyle !== 'all' && room.travel_style !== selectedStyle) return false;

    // Transit Dropdown
    if (selectedTransit !== 'all' && room.transport_preference !== selectedTransit) return false;

    return true;
  });

  const handleRoomCreated = (newRoomData: any) => {
    const created: TravelRoom = {
      id: `room-${Date.now()}`,
      name: newRoomData.name || 'Exciting India Journey',
      description: newRoomData.description || 'Shared travel group planned via WAYNEX Connect.',
      creator: {
        id: 'user-you',
        name: 'You',
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
      },
      creator_username: 'You',
      destination_name: `${newRoomData.destination_city || 'India'}, ${
        newRoomData.state_name || ''
      }`,
      destination_city: newRoomData.destination_city,
      state_name: newRoomData.state_name,
      cover_image:
        newRoomData.cover_image ||
        'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800&auto=format&fit=crop&q=80',
      starting_location: newRoomData.starting_location || 'Bengaluru',
      travel_dates_start: newRoomData.travel_dates_start || '2026-12-15',
      travel_dates_end: newRoomData.travel_dates_end || '2026-12-18',
      duration_days: newRoomData.duration_days || 3,
      budget_per_person: newRoomData.budget_per_person || 4000,
      min_budget: newRoomData.min_budget || 3000,
      max_budget: newRoomData.max_budget || 5000,
      max_members: newRoomData.max_members || 6,
      current_members_count: 1,
      member_count: 1,
      travel_interests: newRoomData.travel_interests || ['Explore'],
      travel_style: newRoomData.travel_style || 'backpacking',
      transport_preference: newRoomData.transport_preference || 'bus',
      status: 'planning',
      visibility: newRoomData.visibility || 'public',
      join_approval: newRoomData.join_approval || 'auto',
      women_only: Boolean(newRoomData.women_only),
      live_mode: false,
    };

    setRooms((prev) => [created, ...prev]);
    setJoinedRoomIds((prev) => [...prev, created.id]);
    setSelectedRoomForWorkspace(created);
  };

  const handleJoinRoom = (room: TravelRoom) => {
    if (!joinedRoomIds.includes(room.id)) {
      setJoinedRoomIds((prev) => [...prev, room.id]);
      setRooms((prev) =>
        prev.map((r) =>
          r.id === room.id
            ? {
                ...r,
                current_members_count: (r.current_members_count || 1) + 1,
                member_count: (r.member_count || 1) + 1,
              }
            : r
        )
      );
    }
    setSelectedRoomForWorkspace(room);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EC] dark:bg-[#0E1726] text-stone-900 dark:text-stone-100">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#14243A] via-[#101D2E] to-[#14243A] py-16 sm:py-24 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FF9933_1px,transparent_1px)] [background-size:24px_24px]" />

        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-[#FF9933] backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              WAYNEX Connect • Social Travel Network
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Don&apos;t Travel Alone.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-amber-300 to-emerald-400">
                Find Your Travel People.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Meet fellow explorers across India, create collaborative travel rooms, plan verified
              itineraries, split expenses transparently, and embark on unforgettable group adventures.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => setIsCreateModalOpen(true)}
                className="h-12 px-6 rounded-xl bg-[#174B37] text-sm font-bold text-white shadow-lg hover:bg-[#1F5F45] transition-all hover:scale-[1.02]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create a Travel Room
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById('discover-rooms')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-12 px-6 rounded-xl border-white/20 bg-white/10 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Compass className="mr-2 h-4 w-4 text-[#FF9933]" />
                Discover Travel Rooms
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* RECOMMENDED TRAVEL COMPANIONS CAROUSEL */}
      <section className="py-12 border-b border-stone-200/80 bg-white/60 dark:border-stone-800/80 dark:bg-[#121E30]/60">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#174B37] dark:text-cyan-400 uppercase tracking-wider">
                <Users className="h-4 w-4" />
                Travel Companions
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
                Connect with Verified Travelers
              </h2>
            </div>
            <p className="text-xs text-stone-500 max-w-md">
              AI-matched travelers based on your travel style, destinations, and pace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {RECOMMENDED_COMPANIONS.map((companion) => (
              <div
                key={companion.id}
                onClick={() => setSelectedCompanion(companion)}
                className="group relative flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-4 shadow-sm hover:border-[#174B37]/50 hover:shadow-md dark:border-stone-800 dark:bg-[#14243A] cursor-pointer transition"
              >
                <div>
                  <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-emerald-500/40">
                    <Image
                      src={companion.avatar}
                      alt={companion.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-3 text-center">
                    <div className="flex items-center justify-center gap-1 font-bold text-sm text-stone-900 dark:text-white">
                      <span>{companion.name}</span>
                      {companion.isVerified && (
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400 flex items-center justify-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-[#FF9933]" />
                      {companion.location.split(',')[0]}
                    </p>
                  </div>

                  <div className="mt-2.5 text-center">
                    <span className="inline-block rounded bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                      {companion.travelStyle.split('&')[0]}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-center text-[11px] text-stone-500 dark:text-stone-400">
                    {companion.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    {companion.compatibilityScore}% Match
                  </span>
                  <span className="text-[11px] font-semibold text-[#174B37] dark:text-cyan-400 group-hover:underline">
                    View Profile →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* DISCOVER ROOMS SECTION */}
      <section id="discover-rooms" className="py-12">
        <Container>
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#FF9933] uppercase tracking-wider">
                <Compass className="h-4 w-4" />
                Active Travel Rooms
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
                Discover Travel Rooms Across India
              </h2>
            </div>

            <Button
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="h-10 px-4 rounded-xl bg-[#174B37] text-xs font-bold text-white shadow-sm hover:bg-[#1F5F45]"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Host a Room
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-stone-200/80 dark:border-stone-800">
            {[
              { id: 'all', label: 'All Rooms', icon: Globe },
              { id: 'trending', label: 'Trending', icon: Flame },
              { id: 'women-only', label: 'Women-Only', icon: ShieldCheck },
              { id: 'solo', label: 'Solo Backpackers', icon: Users },
              { id: 'available', label: 'Spots Available', icon: UserCheck },
              { id: 'my-rooms', label: `My Rooms (${joinedRoomIds.length})`, icon: Heart },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as CategoryFilter)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#174B37] text-white shadow-sm dark:bg-cyan-600'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 dark:bg-[#14243A] dark:border-stone-800 dark:text-stone-300'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Filters Bar */}
          <div className="mt-6 flex flex-col md:flex-row items-center gap-3 rounded-2xl border border-stone-200/90 bg-white p-3 shadow-sm dark:border-stone-800 dark:bg-[#14243A]">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rooms by city, state, or destination (e.g., Coorg, Hampi, Kasol)..."
                className="w-full rounded-xl bg-stone-50 pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#174B37] dark:bg-stone-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
              >
                <option value="all">All Styles</option>
                <option value="backpacking">Backpacking</option>
                <option value="trekking">Trekking</option>
                <option value="road-trip">Road Trip</option>
                <option value="heritage">Heritage & Culture</option>
                <option value="leisure">Leisure & Relax</option>
              </select>

              <select
                value={selectedTransit}
                onChange={(e) => setSelectedTransit(e.target.value)}
                className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
              >
                <option value="all">All Transit</option>
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="shared-cab">Shared Cab</option>
                <option value="self-drive">Self Drive</option>
              </select>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="mt-8">
            {filteredRooms.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center dark:border-stone-800 dark:bg-[#14243A]">
                <Compass className="mx-auto h-12 w-12 text-stone-400" />
                <h3 className="mt-4 text-base font-bold text-stone-800 dark:text-stone-200">
                  No Travel Rooms Found
                </h3>
                <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
                  Try adjusting your filters or be the first to host a travel room for this destination!
                </p>
                <Button
                  size="sm"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-5 bg-[#174B37] text-xs font-bold text-white hover:bg-[#1F5F45]"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Create a Room
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onOpenWorkspace={(r) => setSelectedRoomForWorkspace(r)}
                    onJoinRoom={(r) => handleJoinRoom(r)}
                    isJoined={joinedRoomIds.includes(room.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* COMMUNITY DISPATCH / UPDATES FEED */}
      <section className="py-12 border-t border-stone-200/80 bg-stone-100/60 dark:border-stone-800/80 dark:bg-[#0B1320]/60">
        <Container>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <MessageSquare className="h-4 w-4" />
                Community Feed
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
                Live Field Notes & Travel Dispatches
              </h2>
            </div>
            <p className="text-xs text-stone-500">
              Real-time advice, road conditions, and invites from travelers currently on the road.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMMUNITY_UPDATES.map((post) => (
              <div
                key={post.id}
                className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-[#14243A]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8 overflow-hidden rounded-full">
                        <Image
                          src={post.authorAvatar}
                          alt={post.author}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-900 dark:text-white">
                          {post.author}
                        </span>
                        <div className="text-[10px] text-stone-400">
                          {post.location} • {post.timeAgo}
                        </div>
                      </div>
                    </div>

                    <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                      {post.tag}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-stone-700 dark:text-stone-300">
                    {post.content}
                  </p>

                  {post.image && (
                    <div className="relative mt-3 h-36 w-full overflow-hidden rounded-lg">
                      <Image
                        src={post.image}
                        alt="Post media"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5 text-[#FF9933]" />
                    {post.likesCount} Helpful
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {post.commentsCount} replies
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CREATE ROOM MODAL */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onRoomCreated={handleRoomCreated}
      />

      {/* MEMBER PROFILE MODAL */}
      <MemberProfileModal
        isOpen={Boolean(selectedCompanion)}
        onClose={() => setSelectedCompanion(null)}
        companion={selectedCompanion}
      />

      {/* DEDICATED ROOM WORKSPACE (8 TABS) */}
      {selectedRoomForWorkspace && (
        <RoomWorkspace
          room={selectedRoomForWorkspace}
          onClose={() => setSelectedRoomForWorkspace(null)}
          onUpdateRoom={(updated) => {
            setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
            setSelectedRoomForWorkspace(updated);
          }}
        />
      )}
    </div>
  );
}
