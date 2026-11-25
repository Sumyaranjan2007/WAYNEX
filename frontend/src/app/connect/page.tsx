'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import { TravelRoom } from '@/types';

export default function ConnectPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedRooms, setJoinedRooms] = useState<string[]>([]);

  // Room creation state
  const [newRoom, setNewRoom] = useState({
    name: '',
    destination: 'Hampi',
    startingLocation: 'Bengaluru',
    startDate: '',
    endDate: '',
    budget: 4000,
    maxMembers: 6,
    description: '',
  });

  const [rooms, setRooms] = useState<TravelRoom[]>([
    {
      id: 'room-1',
      name: 'Weekend Bouldering & Sunrise in Hampi',
      description: 'Solo travelers meeting up to rent bicycles, climb granite boulders at Sanapur, and catch sunset from Matanga Hill.',
      creator: {
        id: 'u-1',
        name: 'Aarav Mehta',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      },
      destination_name: 'Hampi, Karnataka',
      destination_slug: 'hampi',
      starting_location: 'Bengaluru (KSR / Majestic)',
      travel_dates_start: '2026-12-05',
      travel_dates_end: '2026-12-08',
      budget_per_person: 3500,
      max_members: 6,
      current_members_count: 4,
      travel_interests: ['Bouldering', 'Ruins', 'Cycling', 'Photography'],
      status: 'planning',
      visibility: 'public',
    },
    {
      id: 'room-2',
      name: 'Coorg Coffee Plantation & River Rafting Trek',
      description: 'Sharing a shared homestay in Madikeri, plantation tours, visiting Abbey Falls, and river rafting in Dubare.',
      creator: {
        id: 'u-2',
        name: 'Sneha Patel',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      },
      destination_name: 'Coorg, Karnataka',
      destination_slug: 'coorg',
      starting_location: 'Bengaluru / Mysuru',
      travel_dates_start: '2026-12-12',
      travel_dates_end: '2026-12-14',
      budget_per_person: 4200,
      max_members: 4,
      current_members_count: 3,
      travel_interests: ['Trekking', 'Coffee', 'Nature', 'Bonfire'],
      status: 'confirmed',
      visibility: 'public',
    },
    {
      id: 'room-3',
      name: 'Gokarna Cliff Trek & Beach Backpacking',
      description: 'Backpacking between Kudle, Om, Half Moon, and Paradise Beach. Camping under the stars and fresh seafood.',
      creator: {
        id: 'u-3',
        name: 'Kabir Das',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      },
      destination_name: 'Gokarna, Karnataka',
      destination_slug: 'gokarna',
      starting_location: 'Goa / Hubballi',
      travel_dates_start: '2026-12-20',
      travel_dates_end: '2026-12-24',
      budget_per_person: 2800,
      max_members: 6,
      current_members_count: 5,
      travel_interests: ['Beach Trek', 'Camping', 'Yoga', 'Sunsets'],
      status: 'planning',
      visibility: 'public',
    },
    {
      id: 'room-4',
      name: 'Meghalaya Living Root Bridges & Dawki River',
      description: 'Visiting Cherrapunji, double decker living root bridge trek, and boating on glass-clear Umngot river in Dawki.',
      creator: {
        id: 'u-4',
        name: 'Tanvi Roy',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      },
      destination_name: 'Shillong & Dawki, Meghalaya',
      destination_slug: 'dawki-mawlynnong',
      starting_location: 'Guwahati (Airport / Station)',
      travel_dates_start: '2027-01-10',
      travel_dates_end: '2027-01-15',
      budget_per_person: 7500,
      max_members: 5,
      current_members_count: 3,
      travel_interests: ['Waterfalls', 'Root Bridges', 'Caving'],
      status: 'planning',
      visibility: 'public',
    },
  ]);

  const handleJoin = (roomId: string) => {
    if (joinedRooms.includes(roomId)) {
      setJoinedRooms((prev) => prev.filter((id) => id !== roomId));
    } else {
      setJoinedRooms((prev) => [...prev, roomId]);
    }
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.name) return;

    const created: TravelRoom = {
      id: 'room-' + Date.now(),
      name: newRoom.name,
      description: newRoom.description || 'Exciting trip organized by a verified traveler.',
      creator: {
        id: 'u-current',
        name: 'You (Organizer)',
      },
      destination_name: newRoom.destination,
      starting_location: newRoom.startingLocation,
      travel_dates_start: newRoom.startDate || '2026-12-15',
      travel_dates_end: newRoom.endDate || '2026-12-18',
      budget_per_person: newRoom.budget,
      max_members: newRoom.maxMembers,
      current_members_count: 1,
      travel_interests: ['Adventure', 'Discovery'],
      status: 'planning',
      visibility: 'public',
    };

    setRooms([created, ...rooms]);
    setJoinedRooms([...joinedRooms, created.id]);
    setIsModalOpen(false);
  };

  const filteredRooms = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destination_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.starting_location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <Badge variant="info" className="mb-2">
              Community Travel Rooms
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
              Find Your Travel Tribe
            </h1>
            <p className="text-navy-200 text-sm sm:text-base leading-relaxed">
              Connect with fellow solo travelers, join pre-planned itineraries, split cabs and accommodations, and travel safely in verified groups across India.
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => setIsModalOpen(true)}
            className="shadow-glow-cyan font-bold shrink-0 self-start md:self-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Travel Room
          </Button>
        </div>

        {/* Search input */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search rooms by destination, city or activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 text-white text-sm rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-cyan-400 placeholder-navy-400"
            />
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRooms.map((room) => {
            const isJoined = joinedRooms.includes(room.id);
            return (
              <Card key={room.id} variant="glass" className="p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant={room.status === 'confirmed' ? 'info' : 'success'} size="sm">
                      {room.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-navy-400 font-semibold">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>
                        {room.current_members_count + (isJoined ? 1 : 0)} / {room.max_members} Members
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                    {room.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-navy-300 leading-relaxed mb-4">
                    {room.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-navy-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>
                        Destination: <strong className="text-white">{room.destination_name}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        Starting From: <strong className="text-white">{room.starting_location}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {room.travel_interests.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] uppercase font-semibold bg-navy-800 text-cyan-300 px-2 py-0.5 rounded border border-navy-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-navy-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-navy-400">Budget / person:</span>
                    <div className="text-lg font-black text-amber-400 font-mono">
                      {formatCurrency(room.budget_per_person)}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isJoined ? 'outline' : 'primary'}
                    onClick={() => handleJoin(room.id)}
                    className={isJoined ? 'border-emerald-500 text-emerald-400' : ''}
                  >
                    {isJoined ? 'Leave Room' : 'Join Travel Room'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Modal: Create Travel Room */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create a New Travel Room"
          description="Host a trip plan and invite verified travelers to join you."
          maxWidth="lg"
        >
          <form onSubmit={handleCreateRoom} className="space-y-4 pt-2">
            <Input
              label="Room Title"
              placeholder="e.g. 3-Day Hampi Bouldering & Heritage Walk"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Destination"
                placeholder="e.g. Hampi, Gokarna, Coorg"
                value={newRoom.destination}
                onChange={(e) => setNewRoom({ ...newRoom, destination: e.target.value })}
                required
              />
              <Input
                label="Starting From City"
                placeholder="e.g. Bengaluru, Mumbai"
                value={newRoom.startingLocation}
                onChange={(e) => setNewRoom({ ...newRoom, startingLocation: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Estimated Budget / Person (₹)"
                type="number"
                placeholder="3500"
                value={newRoom.budget}
                onChange={(e) => setNewRoom({ ...newRoom, budget: Number(e.target.value) })}
              />
              <Input
                label="Max Group Size"
                type="number"
                placeholder="6"
                value={newRoom.maxMembers}
                onChange={(e) => setNewRoom({ ...newRoom, maxMembers: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-200">
                Brief Trip Description
              </label>
              <textarea
                rows={3}
                placeholder="What will you be doing? What stay style are you planning?"
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                className="w-full bg-navy-900 border border-navy-700 text-white text-sm rounded-lg p-3 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Publish Travel Room
              </Button>
            </div>
          </form>
        </Modal>
      </Container>
    </div>
  );
}
