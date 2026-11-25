'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Trash2,
  Share2,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';

interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'upcoming' | 'completed' | 'saved';
  image: string;
  days: {
    dayNumber: number;
    title: string;
    activities: string[];
  }[];
}

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'saved'>('upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({ title: '', destination: '', startDate: '', endDate: '', budget: 5000 });

  const [trips, setTrips] = useState<Trip[]>([
    {
      id: 'trip-1',
      title: 'Hampi Heritage & Bouldering Expedition',
      destination: 'Hampi, Karnataka',
      startDate: '2026-12-10',
      endDate: '2026-12-13',
      budget: 4500,
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1600100397608-f010f443bbf6?w=600&h=400&fit=crop',
      days: [
        {
          dayNumber: 1,
          title: 'Arrival & Sacred Center',
          activities: ['Check-in at Sanapur homestay', 'Virupaksha temple exploration', 'Sunset hike to Matanga Hill'],
        },
        {
          dayNumber: 2,
          title: 'Royal Enclosures & Stone Chariot',
          activities: ['Vittala Temple & musical pillars', 'Elephant Stables & Lotus Mahal', 'Coracle river crossing'],
        },
        {
          dayNumber: 3,
          title: 'Boulder Biking & Departure',
          activities: ['Hippie Island cycling tour', 'Sanapur lake cliff views', 'Evening sleeper train back to Bengaluru'],
        },
      ],
    },
    {
      id: 'trip-2',
      title: 'Monsoon Mist & Coffee Estate Retreat',
      destination: 'Coorg, Karnataka',
      startDate: '2026-08-15',
      endDate: '2026-08-18',
      budget: 6200,
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1596761226487-17eb481a5f6e?w=600&h=400&fit=crop',
      days: [
        {
          dayNumber: 1,
          title: 'Plantation Walk & Abbey Falls',
          activities: ['Estate tour and Arabica bean roasting', 'Abbey Falls visit', 'Kodava dinner'],
        },
      ],
    },
  ]);

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrip.title || !newTrip.destination) return;

    const created: Trip = {
      id: 'trip-' + Date.now(),
      title: newTrip.title,
      destination: newTrip.destination,
      startDate: newTrip.startDate || '2026-12-25',
      endDate: newTrip.endDate || '2026-12-28',
      budget: newTrip.budget,
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop',
      days: [
        {
          dayNumber: 1,
          title: 'Arrival & Check-in',
          activities: ['Check in to stay', 'Local area orientation', 'Sunset viewpoint'],
        },
      ],
    };

    setTrips([created, ...trips]);
    setIsModalOpen(false);
  };

  const filteredTrips = trips.filter((t) => t.status === activeTab);

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <Badge variant="info" className="mb-2">
              Trip Organizer
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
              My Travel Itineraries
            </h1>
            <p className="text-navy-200 text-sm sm:text-base">
              Manage your upcoming adventures, past completed expeditions, and saved travel plans.
            </p>
          </div>

          <Button size="lg" onClick={() => setIsModalOpen(true)} className="shrink-0 self-start md:self-auto">
            <Plus className="w-5 h-5 mr-2" />
            Plan New Trip
          </Button>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-navy-800 mb-8 space-x-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 transition-colors ${
              activeTab === 'upcoming' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-navy-400 hover:text-white'
            }`}
          >
            Upcoming Trips ({trips.filter((t) => t.status === 'upcoming').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-3 transition-colors ${
              activeTab === 'completed' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-navy-400 hover:text-white'
            }`}
          >
            Completed Trips ({trips.filter((t) => t.status === 'completed').length})
          </button>
        </div>

        {/* Trips List */}
        <div className="space-y-6">
          {filteredTrips.map((trip) => (
            <Card key={trip.id} variant="default" className="p-6 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 relative h-48 lg:h-full rounded-xl overflow-hidden">
                  <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="success" size="sm">
                      {trip.status}
                    </Badge>
                  </div>
                </div>

                <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{trip.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-navy-300 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        {trip.destination}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        {trip.startDate} &mdash; {trip.endDate}
                      </span>
                      <span className="font-bold text-amber-300">
                        Budget: {formatCurrency(trip.budget)}
                      </span>
                    </div>

                    {/* Day-by-day Preview */}
                    <div className="space-y-2 border-t border-navy-800 pt-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                        Day-Wise Plan
                      </div>
                      {trip.days.map((d) => (
                        <div key={d.dayNumber} className="text-xs text-navy-200">
                          <strong className="text-white">Day {d.dayNumber}: {d.title}</strong>
                          <div className="text-navy-400 ml-4">
                            &bull; {d.activities.join(' • ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-navy-800 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold">
                      Safety Checklist Completed
                    </span>
                    <Button size="sm" variant="outline">
                      View Full Itinerary
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredTrips.length === 0 && (
            <div className="p-12 text-center bg-navy-900/50 rounded-2xl border border-navy-800">
              <Briefcase className="w-12 h-12 text-navy-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No Trips in This Category</h3>
              <p className="text-xs text-navy-400 mt-1 mb-4">
                Ready to explore? Create a new trip or use our AI Budget Planner to generate one.
              </p>
              <Button size="sm" onClick={() => setIsModalOpen(true)}>
                Plan a New Trip Now
              </Button>
            </div>
          )}
        </div>

        {/* Modal: Plan New Trip */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Plan a New Trip"
          description="Create a personalized travel schedule."
        >
          <form onSubmit={handleCreateTrip} className="space-y-4 pt-2">
            <Input
              label="Trip Title"
              placeholder="e.g. Winter Trip to Hampi & Gokarna"
              value={newTrip.title}
              onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
              required
            />
            <Input
              label="Destination"
              placeholder="e.g. Hampi, Karnataka"
              value={newTrip.destination}
              onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start Date"
                type="date"
                value={newTrip.startDate}
                onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
              />
              <Input
                label="End Date"
                type="date"
                value={newTrip.endDate}
                onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
              />
            </div>
            <Input
              label="Estimated Budget (₹)"
              type="number"
              value={newTrip.budget}
              onChange={(e) => setNewTrip({ ...newTrip, budget: Number(e.target.value) })}
            />
            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Itinerary
              </Button>
            </div>
          </form>
        </Modal>
      </Container>
    </div>
  );
}
