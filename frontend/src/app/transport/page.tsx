'use client';

import React, { useState } from 'react';
import {
  Train,
  Bus,
  Plane,
  Car,
  Clock,
  ArrowRight,
  Search,
  Calendar,
  MapPin,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface TransportRoute {
  id: string;
  mode: 'train' | 'bus' | 'flight' | 'taxi';
  name: string;
  code?: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  operator: string;
  stops: string;
  availability: 'Available' | 'Fast Filling' | 'Waitlist';
}

export default function TransportPage() {
  const [fromCity, setFromCity] = useState('Bengaluru (SBC / BLR)');
  const [toCity, setToCity] = useState('Hosapete / Hampi (HPT)');
  const [activeMode, setActiveMode] = useState<'all' | 'train' | 'bus' | 'flight'>('all');

  const routes: TransportRoute[] = [
    {
      id: 'tr-1',
      mode: 'train',
      name: 'Hampi Express (16592)',
      code: '16592',
      departure: '22:00 (SBC)',
      arrival: '07:10 (HPT)',
      duration: '9h 10m',
      price: 385,
      operator: 'Indian Railways (South Western Railway)',
      stops: 'Direct Overnight Sleeper',
      availability: 'Available',
    },
    {
      id: 'tr-2',
      mode: 'train',
      name: 'Vande Bharat Express',
      code: '20661',
      departure: '05:45 (SBC)',
      arrival: '10:45 (UBL)',
      duration: '5h 00m',
      price: 1120,
      operator: 'Indian Railways',
      stops: 'High-speed Chair Car',
      availability: 'Fast Filling',
    },
    {
      id: 'tr-3',
      mode: 'bus',
      name: 'KSRTC Airavat Club Class Multi-Axle',
      departure: '23:15 (Majestic)',
      arrival: '06:30 (Hosapete)',
      duration: '7h 15m',
      price: 790,
      operator: 'Karnataka State Road Transport Corp',
      stops: 'Direct AC Sleeper',
      availability: 'Available',
    },
    {
      id: 'tr-4',
      mode: 'bus',
      name: 'Greenline Travels Volvo B11R',
      departure: '22:30 (Indiranagar)',
      arrival: '06:00 (Hampi Bazar)',
      duration: '7h 30m',
      price: 950,
      operator: 'Greenline Private Sleeper',
      stops: 'Direct Drops at Hampi Bazar',
      availability: 'Fast Filling',
    },
    {
      id: 'tr-5',
      mode: 'flight',
      name: 'Star Air Regional Express',
      code: 'S5-121',
      departure: '14:20 (BLR)',
      arrival: '15:15 (VDY Jindal Vidyanagar)',
      duration: '55m',
      price: 3450,
      operator: 'Star Air Embraer E175',
      stops: 'Non-stop Flight (~40km from Hampi)',
      availability: 'Available',
    },
  ];

  const filteredRoutes = routes.filter(
    (r) => activeMode === 'all' || r.mode === activeMode
  );

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <Badge variant="info" className="mb-2">
            Inter-City Transport
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            Transport & Route Planner
          </h1>
          <p className="text-navy-200 text-sm sm:text-base leading-relaxed">
            Find direct Indian Railways express trains, state bus services (KSRTC, MSRTC, HRTC), and regional flights with transparent pricing.
          </p>
        </div>

        {/* Route Search Inputs */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-700/80 shadow-2xl space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-300 mb-1.5">
                From Station / City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 text-white text-sm rounded-lg pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-cyan-400 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-300 mb-1.5">
                To Destination
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-700 text-white text-sm rounded-lg pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-cyan-400 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-navy-800">
            <div className="inline-flex p-1 bg-navy-950 border border-navy-800 rounded-xl">
              <button
                onClick={() => setActiveMode('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMode === 'all' ? 'bg-cyan-500 text-navy-950' : 'text-navy-300'
                }`}
              >
                All Modes
              </button>
              <button
                onClick={() => setActiveMode('train')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeMode === 'train' ? 'bg-cyan-500 text-navy-950' : 'text-navy-300'
                }`}
              >
                <Train className="w-3.5 h-3.5" /> Trains
              </button>
              <button
                onClick={() => setActiveMode('bus')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeMode === 'bus' ? 'bg-cyan-500 text-navy-950' : 'text-navy-300'
                }`}
              >
                <Bus className="w-3.5 h-3.5" /> State Buses
              </button>
              <button
                onClick={() => setActiveMode('flight')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeMode === 'flight' ? 'bg-cyan-500 text-navy-950' : 'text-navy-300'
                }`}
              >
                <Plane className="w-3.5 h-3.5" /> Flights
              </button>
            </div>

            <span className="text-xs text-navy-400 font-semibold">
              Showing schedules for {filteredRoutes.length} route options
            </span>
          </div>
        </div>

        {/* Route Cards */}
        <div className="space-y-4">
          {filteredRoutes.map((route) => (
            <Card key={route.id} variant="default" className="p-5 hover:border-cyan-500/50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left Info */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-navy-900 border border-navy-700 text-cyan-400 shrink-0">
                    {route.mode === 'train' && <Train className="w-6 h-6" />}
                    {route.mode === 'bus' && <Bus className="w-6 h-6" />}
                    {route.mode === 'flight' && <Plane className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base sm:text-lg font-bold text-white">{route.name}</h3>
                      <Badge
                        variant={
                          route.availability === 'Available'
                            ? 'success'
                            : route.availability === 'Fast Filling'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {route.availability}
                      </Badge>
                    </div>
                    <div className="text-xs text-navy-300">
                      Operator: <span className="text-white font-medium">{route.operator}</span>
                    </div>
                    <div className="text-xs text-cyan-400 mt-1 font-medium">{route.stops}</div>
                  </div>
                </div>

                {/* Center Timing */}
                <div className="flex items-center gap-6 border-y lg:border-y-0 lg:border-x border-navy-800 py-3 lg:py-0 lg:px-8">
                  <div>
                    <div className="text-sm sm:text-base font-bold text-white">{route.departure}</div>
                    <div className="text-[11px] text-navy-400">Departure</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-navy-400 font-mono">{route.duration}</span>
                    <div className="w-20 h-0.5 bg-navy-700 relative my-1">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">Direct</span>
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-white">{route.arrival}</div>
                    <div className="text-[11px] text-navy-400">Arrival</div>
                  </div>
                </div>

                {/* Right Price & CTA */}
                <div className="flex items-center justify-between lg:justify-end gap-4">
                  <div className="text-left lg:text-right">
                    <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                      {formatCurrency(route.price)}
                    </div>
                    <div className="text-[11px] text-navy-400">per passenger</div>
                  </div>
                  <Button size="sm" className="font-semibold px-4 py-2">
                    Book & Check Seats
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
