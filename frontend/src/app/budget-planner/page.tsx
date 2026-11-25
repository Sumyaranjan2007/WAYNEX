'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Compass,
  MapPin,
  Users,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Building,
  Utensils,
  Train,
  ShieldCheck,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { ALL_DESTINATIONS } from '@/data/destinations';

export default function BudgetPlannerPage() {
  const [startLocation, setStartLocation] = useState('Bengaluru');
  const [budgetTotal, setBudgetTotal] = useState(8000);
  const [numDays, setNumDays] = useState(3);
  const [numTravellers, setNumTravellers] = useState(1);
  const [travelType, setTravelType] = useState<'solo' | 'couple' | 'friends' | 'family'>('solo');
  const [transportPref, setTransportPref] = useState<'budget' | 'comfort' | 'flight'>('budget');
  const [stayPref, setStayPref] = useState<'hostel' | 'homestay' | 'hotel' | 'resort'>('hostel');
  const [foodPref, setFoodPref] = useState<'local' | 'cafes' | 'fine'>('local');

  // Calculation engine
  const breakdown = useMemo(() => {
    const total = budgetTotal;
    const perPerson = Math.round(total / numTravellers);
    const perDay = Math.round(perPerson / numDays);

    // Multipliers based on preferences
    let transportPct = 0.30;
    let stayPct = 0.35;
    let foodPct = 0.22;
    let bufferPct = 0.13;

    if (transportPref === 'flight') {
      transportPct = 0.45;
      stayPct = 0.28;
      foodPct = 0.17;
      bufferPct = 0.10;
    } else if (transportPref === 'comfort') {
      transportPct = 0.35;
      stayPct = 0.32;
    }

    if (stayPref === 'resort') {
      stayPct = 0.45;
      foodPct = 0.25;
      transportPct = 0.20;
      bufferPct = 0.10;
    }

    const transportCost = Math.round(total * transportPct);
    const stayCost = Math.round(total * stayPct);
    const foodCost = Math.round(total * foodPct);
    const activitiesCost = Math.round(total * (bufferPct * 0.6));
    const bufferCost = total - (transportCost + stayCost + foodCost + activitiesCost);

    // Feasibility calculation
    const minRequiredDaily =
      stayPref === 'hostel' ? 1200 : stayPref === 'homestay' ? 1800 : stayPref === 'hotel' ? 2600 : 4500;
    const isFeasible = perDay >= minRequiredDaily;

    return {
      perPerson,
      perDay,
      transportCost,
      stayCost,
      foodCost,
      activitiesCost,
      bufferCost,
      minRequiredDaily,
      isFeasible,
    };
  }, [budgetTotal, numDays, numTravellers, transportPref, stayPref]);

  // Find destinations that match daily budget
  const matchingDestinations = useMemo(() => {
    return ALL_DESTINATIONS.filter(
      (d) => (d.estimated_budget_per_day || 2000) <= breakdown.perDay * 1.2
    ).slice(0, 3);
  }, [breakdown.perDay]);

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <Badge variant="warning" className="mb-2">
            Algorithmic Engine
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            AI Budget Planner
          </h1>
          <p className="text-navy-200 text-sm sm:text-base leading-relaxed mb-4">
            Configure your parameters. Our mathematical model simulates real ticket prices, dormitory tariffs, and regional meal rates across India.
          </p>
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-cyan-500/10 to-navy-900 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-xs text-white">
                Looking for an interactive step-by-step itinerary with exact attractions, bus/trains, and hotels?
              </span>
            </div>
            <Link
              href="/trips"
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs shrink-0 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Launch AI Trip Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Column */}
          <div className="lg:col-span-6 space-y-6">
            <Card variant="glass" className="p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-navy-800 pb-3">
                <Calculator className="w-5 h-5 text-amber-400" />
                Trip Parameters
              </h2>

              {/* Starting Point */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-300 mb-1.5">
                  Starting City / Hub
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, Mumbai, Delhi, Hyderabad"
                    className="w-full bg-navy-900 border border-navy-700 text-white text-sm rounded-lg pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Budget Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-navy-300">
                    Total Budget (₹500 – ₹50,000)
                  </label>
                  <span className="text-xl font-black text-amber-400 font-mono">
                    {formatCurrency(budgetTotal)}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={budgetTotal}
                  onChange={(e) => setBudgetTotal(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-navy-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-navy-400">
                  <span>₹500 (Day Trip)</span>
                  <span>₹15,000</span>
                  <span>₹50,000 (Grand Tour)</span>
                </div>
              </div>

              {/* Sliders: Days & Travellers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-navy-300">
                    <span>Duration:</span>
                    <span className="text-cyan-400 font-mono">{numDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={numDays}
                    onChange={(e) => setNumDays(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-navy-800 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-navy-300">
                    <span>Travelers:</span>
                    <span className="text-cyan-400 font-mono">{numTravellers} Person</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={numTravellers}
                    onChange={(e) => setNumTravellers(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-navy-800 rounded-lg"
                  />
                </div>
              </div>

              {/* Travel Style */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-300 mb-2">
                  Travel Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['solo', 'couple', 'friends', 'family'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTravelType(type)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize transition-all border ${
                        travelType === type
                          ? 'bg-cyan-500 text-navy-950 border-cyan-400'
                          : 'bg-navy-900 border-navy-700 text-navy-300 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transport Preference */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-300 mb-2">
                  Transport Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransportPref('budget')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${
                      transportPref === 'budget'
                        ? 'bg-cyan-500 text-navy-950 border-cyan-400'
                        : 'bg-navy-900 border-navy-700 text-navy-300 hover:text-white'
                    }`}
                  >
                    Bus / Sleeper Train
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransportPref('comfort')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${
                      transportPref === 'comfort'
                        ? 'bg-cyan-500 text-navy-950 border-cyan-400'
                        : 'bg-navy-900 border-navy-700 text-navy-300 hover:text-white'
                    }`}
                  >
                    AC Express / Cab
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransportPref('flight')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${
                      transportPref === 'flight'
                        ? 'bg-cyan-500 text-navy-950 border-cyan-400'
                        : 'bg-navy-900 border-navy-700 text-navy-300 hover:text-white'
                    }`}
                  >
                    Domestic Flight
                  </button>
                </div>
              </div>

              {/* Accommodation Preference */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-300 mb-2">
                  Stay Preference
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      ['hostel', 'Hostel Dorm'],
                      ['homestay', 'Homestay'],
                      ['hotel', 'Budget Hotel'],
                      ['resort', 'Mid Resort'],
                    ] as const
                  ).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setStayPref(val)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all border ${
                        stayPref === val
                          ? 'bg-amber-500 text-navy-950 border-amber-400 font-bold'
                          : 'bg-navy-900 border-navy-700 text-navy-300 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Live Results Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Feasibility Alert */}
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                breakdown.isFeasible
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              }`}
            >
              {breakdown.isFeasible ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
              )}
              <div className="text-xs sm:text-sm">
                {breakdown.isFeasible ? (
                  <span>
                    <strong>Optimal Budget:</strong> With {formatCurrency(breakdown.perDay)}/day per traveler, your trip is well-funded for comfortable exploration.
                  </span>
                ) : (
                  <span>
                    <strong>Tight Margin:</strong> For {stayPref} stay style, we recommend adjusting your budget to at least {formatCurrency(breakdown.minRequiredDaily * numDays * numTravellers)} or reducing trip length.
                  </span>
                )}
              </div>
            </div>

            {/* Expense Breakdown Card */}
            <Card variant="glass" className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-navy-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Itemized Budget Plan</h3>
                  <div className="text-xs text-navy-400 mt-0.5">
                    For {numTravellers} traveler(s) &bull; {numDays} days
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {formatCurrency(budgetTotal)}
                  </div>
                  <div className="text-[11px] text-cyan-300 font-medium">
                    {formatCurrency(breakdown.perDay)} / day / person
                  </div>
                </div>
              </div>

              {/* Progress visual bar */}
              <div className="w-full h-3 rounded-full overflow-hidden bg-navy-800 flex">
                <div style={{ width: '32%' }} className="bg-cyan-500" title="Transport" />
                <div style={{ width: '36%' }} className="bg-amber-500" title="Stay" />
                <div style={{ width: '20%' }} className="bg-emerald-500" title="Food" />
                <div style={{ width: '12%' }} className="bg-purple-500" title="Buffer" />
              </div>

              {/* Split details list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-navy-900 border border-navy-800">
                  <div className="flex items-center gap-2.5">
                    <Train className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs sm:text-sm text-navy-200">Transport & Tickets</span>
                  </div>
                  <span className="font-mono font-bold text-white text-sm">
                    {formatCurrency(breakdown.transportCost)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-navy-900 border border-navy-800">
                  <div className="flex items-center gap-2.5">
                    <Building className="w-4 h-4 text-amber-400" />
                    <span className="text-xs sm:text-sm text-navy-200">Accommodation ({numDays} nights)</span>
                  </div>
                  <span className="font-mono font-bold text-white text-sm">
                    {formatCurrency(breakdown.stayCost)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-navy-900 border border-navy-800">
                  <div className="flex items-center gap-2.5">
                    <Utensils className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs sm:text-sm text-navy-200">Food & Beverages (3 meals/day)</span>
                  </div>
                  <span className="font-mono font-bold text-white text-sm">
                    {formatCurrency(breakdown.foodCost)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-navy-900 border border-navy-800">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span className="text-xs sm:text-sm text-navy-200">Activities, Entry Fees & Emergency Buffer</span>
                  </div>
                  <span className="font-mono font-bold text-white text-sm">
                    {formatCurrency(breakdown.activitiesCost + breakdown.bufferCost)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Recommended destinations for this budget */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Recommended Destinations Fitting Your Budget
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {matchingDestinations.map((d) => (
                  <Link key={d.id} href={`/destinations/${d.slug}`}>
                    <div className="p-3.5 rounded-xl bg-navy-900/90 border border-navy-700/80 hover:border-cyan-400 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <img
                          src={d.image}
                          alt={d.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {d.name}
                          </div>
                          <div className="text-xs text-navy-300">{d.state.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-amber-400">
                          {formatCurrency(d.estimated_budget_per_day)} / day
                        </div>
                        <span className="text-[11px] text-cyan-400 group-hover:underline">
                          View &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
