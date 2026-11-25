'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  MapPin,
  Compass,
  ShieldCheck,
  Calendar,
  Settings,
  LogOut,
  Star,
  Award,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const displayName = user
    ? user.first_name
      ? `${user.first_name} ${user.last_name || ''}`
      : user.username
    : 'Traveler Explorer';

  const userCity = user?.city || 'Bengaluru';
  const userState = user?.state || 'Karnataka';

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12">
      <Container className="max-w-4xl">
        {/* Profile Card Header */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-900 to-navy-800 border border-navy-700/80 shadow-2xl mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center font-black text-cyan-300 text-3xl shadow-glow-cyan shrink-0">
            {displayName[0].toUpperCase()}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{displayName}</h1>
                <div className="text-xs text-navy-300 mt-0.5">{user?.email || 'explorer@waynex.in'}</div>
              </div>
              <Badge variant="success" size="sm" className="self-center sm:self-auto">
                Verified Traveler
              </Badge>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-navy-300 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {userCity}, {userState}
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                SOS Emergency Protection Active
              </span>
            </div>
          </div>
        </div>

        {/* Travel Stats Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 text-center">
            <div className="text-2xl font-black text-cyan-400 font-mono">6</div>
            <div className="text-xs text-navy-400 uppercase font-semibold mt-1">States Explored</div>
          </div>
          <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 text-center">
            <div className="text-2xl font-black text-amber-400 font-mono">14</div>
            <div className="text-xs text-navy-400 uppercase font-semibold mt-1">Destinations Visited</div>
          </div>
          <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 text-center">
            <div className="text-2xl font-black text-emerald-400 font-mono">2</div>
            <div className="text-xs text-navy-400 uppercase font-semibold mt-1">Travel Rooms Joined</div>
          </div>
          <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 text-center">
            <div className="text-2xl font-black text-white font-mono">100%</div>
            <div className="text-xs text-navy-400 uppercase font-semibold mt-1">Safety Score</div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Saved Destinations */}
          <Card variant="default" className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              Saved Destinations
            </h2>
            <div className="space-y-2 text-xs">
              <Link href="/destinations/hampi" className="block p-3 rounded-lg bg-navy-950 hover:bg-navy-800 transition-colors">
                <div className="font-bold text-white">Hampi, Karnataka</div>
                <div className="text-navy-400">UNESCO World Heritage Site &bull; 4.9 &star;</div>
              </Link>
              <Link href="/destinations/coorg" className="block p-3 rounded-lg bg-navy-950 hover:bg-navy-800 transition-colors">
                <div className="font-bold text-white">Coorg (Kodagu), Karnataka</div>
                <div className="text-navy-400">Coffee Hills & Waterfalls &bull; 4.8 &star;</div>
              </Link>
            </div>
            <Link href="/destinations" className="text-xs text-cyan-400 hover:underline block pt-1">
              Browse More Destinations &rarr;
            </Link>
          </Card>

          {/* Emergency Safety Summary */}
          <Card variant="default" className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Safety & Emergency Status
            </h2>
            <p className="text-xs text-navy-300 leading-relaxed">
              Your profile is linked to National Emergency 112 with 2 verified guardian contacts on standby.
            </p>
            <div className="pt-2">
              <Link href="/safe">
                <Button variant="danger" size="sm" className="w-full">
                  Manage SOS Contacts & Helplines
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Logout Section */}
        <div className="flex justify-end pt-4 border-t border-navy-800">
          <Button variant="outline" size="md" onClick={handleLogout} className="border-navy-700 text-red-400 hover:bg-red-950/30">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out of WAYNEX
          </Button>
        </div>
      </Container>
    </div>
  );
}
