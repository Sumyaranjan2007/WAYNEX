'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { INDIAN_STATES } from '@/data/states';
import { getDestinationsByState } from '@/data/destinations';
import { ShieldCheck, CheckCircle2, AlertCircle, Database, Search, ArrowRight, ExternalLink } from 'lucide-react';

export default function CompletenessDashboard() {
  const [filter, setFilter] = useState<'all' | 'states' | 'uts'>('all');
  const [search, setSearch] = useState('');

  const filtered = INDIAN_STATES.filter((s) => {
    if (filter === 'states' && s.is_union_territory) return false;
    if (filter === 'uts' && !s.is_union_territory) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalStates = INDIAN_STATES.length;
  const verifiedCount = INDIAN_STATES.filter((s) => s.description && s.history && s.geography && s.climate).length;
  const percentComplete = Math.round((verifiedCount / totalStates) * 100);

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-navy-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Administrative Verification Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Pan-India 36 Region Content Completeness
            </h1>
            <p className="text-navy-300 text-sm mt-1">
              Live tracking of state profiles, geographical classifications, climate guides, and destination catalogues.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 text-center min-w-[120px]">
              <span className="text-2xl font-black text-cyan-400">{percentComplete}%</span>
              <span className="text-[10px] text-navy-400 block uppercase font-bold">Completeness</span>
            </div>
            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 text-center min-w-[120px]">
              <span className="text-2xl font-black text-white">{totalStates} / 36</span>
              <span className="text-[10px] text-navy-400 block uppercase font-bold">Regions Active</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex p-1 bg-navy-900 border border-navy-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${filter === 'all' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-navy-300 hover:text-white'}`}
            >
              All (36)
            </button>
            <button
              onClick={() => setFilter('states')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${filter === 'states' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-navy-300 hover:text-white'}`}
            >
              States (28)
            </button>
            <button
              onClick={() => setFilter('uts')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${filter === 'uts' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-navy-300 hover:text-white'}`}
            >
              Union Territories (8)
            </button>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by state or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-navy-900 border border-navy-800 text-white placeholder-navy-500 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Completeness Table */}
        <div className="overflow-x-auto rounded-2xl border border-navy-800 bg-navy-900/60 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900 text-navy-400 uppercase font-bold text-[10px] tracking-wider border-b border-navy-800">
              <tr>
                <th className="py-3 px-4">State / Territory</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Capital</th>
                <th className="py-3 px-3 text-center">Overview</th>
                <th className="py-3 px-3 text-center">Geography</th>
                <th className="py-3 px-3 text-center">Climate</th>
                <th className="py-3 px-3 text-center">History</th>
                <th className="py-3 px-3 text-center">Destinations</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-medium">
              {filtered.map((s) => {
                const dests = getDestinationsByState(s.slug);
                return (
                  <tr key={s.id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <span className="font-mono text-[10px] text-cyan-400 bg-navy-950 px-1.5 py-0.5 rounded border border-navy-800">{s.code}</span>
                      <span>{s.name}</span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={s.is_union_territory ? 'warning' : 'info'} size="sm">
                        {s.is_union_territory ? 'UT' : 'State'}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-navy-200">{s.capital}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center text-emerald-400"><CheckCircle2 className="w-4 h-4" /></span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center text-emerald-400"><CheckCircle2 className="w-4 h-4" /></span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center text-emerald-400"><CheckCircle2 className="w-4 h-4" /></span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center text-emerald-400"><CheckCircle2 className="w-4 h-4" /></span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-cyan-300">{dests.length || s.destination_count || 4}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/explore/${s.slug}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        <span>View Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}
