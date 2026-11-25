'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building,
  Star,
  MapPin,
  Check,
  Wifi,
  Coffee,
  Tv,
  AirVent,
  Search,
  Filter,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Hotel } from '@/types';

export default function HotelsPage() {
  const [selectedDest, setSelectedDest] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const hotels: Hotel[] = [
    {
      id: 'ht-1',
      name: 'Hampi Boulders Heritage Homestay',
      destination: 'Hampi',
      type: 'homestay',
      price_per_night: 1850,
      rating: 4.9,
      review_count: 340,
      amenities: ['Free Wi-Fi', 'South Indian Breakfast', 'AC', 'River View'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop',
      address: 'Near Tungabhadra River, Sanapur, Hampi, Karnataka',
    },
    {
      id: 'ht-2',
      name: 'Zostel Hampi (Hippie Island)',
      destination: 'Hampi',
      type: 'hostel',
      price_per_night: 650,
      rating: 4.8,
      review_count: 620,
      amenities: ['Free Wi-Fi', 'Cafe & Lounge', 'Backpacker Community', 'Bicycle Rental'],
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=500&fit=crop',
      address: 'Main Bazaar Road, Virupapura Gaddi, Hampi',
    },
    {
      id: 'ht-3',
      name: 'Coorg Mist Valley Plantation Stay',
      destination: 'Coorg',
      type: 'homestay',
      price_per_night: 2400,
      rating: 4.8,
      review_count: 280,
      amenities: ['Coffee Plantation Walk', 'Kodava Dinner Included', 'Bonfire', 'Free Wi-Fi'],
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop',
      address: 'Madikeri - Virajpet Road, Coorg, Karnataka',
    },
    {
      id: 'ht-4',
      name: 'Kudle Beach Cliff Cottages',
      destination: 'Gokarna',
      type: 'budget_hotel',
      price_per_night: 1200,
      rating: 4.7,
      review_count: 410,
      amenities: ['Sea View Balcony', 'Free Wi-Fi', 'Beach Access', 'Seafood Cafe'],
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=500&fit=crop',
      address: 'Kudle Beach Cliff Path, Gokarna, Karnataka',
    },
    {
      id: 'ht-5',
      name: 'Royal Orchid Metropole Heritage Hotel',
      destination: 'Mysore',
      type: 'luxury',
      price_per_night: 4500,
      rating: 4.8,
      review_count: 530,
      amenities: ['Heritage Courtyard', 'Swimming Pool', 'Buffet Breakfast', 'Spa'],
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=500&fit=crop',
      address: 'J.L.B Road, Mysuru, Karnataka',
    },
  ];

  const filteredHotels = hotels.filter((h) => {
    const matchesDest = selectedDest === 'all' || h.destination.toLowerCase() === selectedDest.toLowerCase();
    const matchesType = selectedType === 'all' || h.type === selectedType;
    return matchesDest && matchesType;
  });

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <Badge variant="info" className="mb-2">
            Verified Stays
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            Hotels, Homestays & Hostels
          </h1>
          <p className="text-navy-200 text-sm sm:text-base leading-relaxed">
            Curated accommodations verified for cleanliness, genuine traveler hospitality, transparent pricing, and safety for solo and group travelers.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-800 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <span className="text-xs text-navy-400 mr-2 font-semibold">Destination:</span>
              <select
                value={selectedDest}
                onChange={(e) => setSelectedDest(e.target.value)}
                className="bg-navy-950 border border-navy-700 text-xs text-white rounded-lg px-3 py-2"
              >
                <option value="all">All Destinations</option>
                <option value="Hampi">Hampi</option>
                <option value="Coorg">Coorg</option>
                <option value="Gokarna">Gokarna</option>
                <option value="Mysore">Mysore</option>
              </select>
            </div>

            <div>
              <span className="text-xs text-navy-400 mr-2 font-semibold">Stay Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-navy-950 border border-navy-700 text-xs text-white rounded-lg px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="hostel">Hostels / Dorms</option>
                <option value="homestay">Homestays</option>
                <option value="budget_hotel">Budget Hotels</option>
                <option value="luxury">Heritage & Luxury</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-navy-400 font-semibold">
            Showing {filteredHotels.length} verified stays
          </div>
        </div>

        {/* Hotel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((h) => (
            <Card key={h.id} variant="default" className="flex flex-col justify-between overflow-hidden">
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={h.image}
                  alt={h.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge variant="info" size="sm">
                    {h.type.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 bg-navy-900/90 text-amber-400 font-bold text-xs px-2 py-0.5 rounded flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {h.rating} ({h.review_count})
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-bold text-white line-clamp-1">{h.name}</h3>
                  <div className="text-xs text-navy-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{h.destination}</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-navy-300 line-clamp-1">{h.address}</p>

                <div className="flex flex-wrap gap-1.5">
                  {h.amenities.map((a, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-navy-900 border border-navy-700/80 text-navy-300 px-2 py-0.5 rounded"
                    >
                      {a}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-navy-800 flex items-center justify-between">
                  <div>
                    <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
                      {formatCurrency(h.price_per_night)}
                    </span>
                    <span className="text-[10px] text-navy-400"> / night</span>
                  </div>
                  <Button size="sm">Reserve Stay</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
