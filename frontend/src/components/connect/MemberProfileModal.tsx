'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  ShieldCheck,
  Sparkles,
  Compass,
  Languages,
  CheckCircle2,
  Share2,
  MessageSquare,
  UserPlus,
  Heart,
  X,
  Star,
  Luggage,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TravelCompanion } from '@/data/connectData';

interface MemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  companion: TravelCompanion | null;
  onConnect?: (id: string) => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  isOpen,
  onClose,
  companion,
  onConnect,
}) => {
  const [requestSent, setRequestSent] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!companion) return null;

  const handleConnect = () => {
    setRequestSent(true);
    if (onConnect) onConnect(companion.id);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#14243A]">
        {/* Banner with Indian motif gradient */}
        <div className="h-32 w-full bg-gradient-to-r from-[#174B37] via-[#1F5F45] to-[#FF9933]/90 relative">
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition"
              title="Share profile"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {copied && (
            <div className="absolute top-12 right-3 rounded-md bg-stone-900/90 px-3 py-1 text-xs text-white shadow-md">
              Link copied!
            </div>
          )}
        </div>

        {/* Profile Info Header */}
        <div className="relative px-6 pb-6 pt-0">
          <div className="-mt-14 flex items-end justify-between">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-stone-200 shadow-md dark:border-[#14243A]">
              <Image
                src={companion.avatar}
                alt={companion.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                <Sparkles className="h-3.5 w-3.5 text-[#FF9933]" />
                {companion.compatibilityScore}% Compatibility
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                  {companion.name}
                </h2>
                {companion.isVerified && (
                  <span title="Govt ID Verified Traveler">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                @{companion.username} •{' '}
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#FF9933]" />
                  {companion.location}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={requestSent ? 'outline' : 'primary'}
                onClick={handleConnect}
                disabled={requestSent}
                className="h-9 px-4 text-xs font-semibold rounded-xl"
              >
                {requestSent ? (
                  <>
                    <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-500" />
                    Request Sent
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-1.5 h-4 w-4" />
                    Connect
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl border border-stone-200/80 bg-stone-50/70 p-3.5 dark:border-stone-800 dark:bg-stone-900/50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs font-semibold text-stone-900 dark:text-stone-100">
                <Luggage className="h-3.5 w-3.5 text-[#174B37] dark:text-cyan-400" />
                {companion.tripsCompleted}
              </div>
              <div className="text-[11px] text-stone-500">Trips Done</div>
            </div>
            <div className="text-center border-x border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-center gap-1 text-xs font-semibold text-stone-900 dark:text-stone-100">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                4.9 / 5
              </div>
              <div className="text-[11px] text-stone-500">Travel Karma</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                100%
              </div>
              <div className="text-[11px] text-stone-500">Safety Check</div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              About
            </h4>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
              {companion.bio}
            </p>
          </div>

          {/* Travel Style & Languages */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
                <Compass className="h-3.5 w-3.5 text-[#FF9933]" />
                Travel Style
              </h4>
              <div className="mt-2">
                <span className="rounded-lg bg-[#174B37]/10 px-3 py-1 text-xs font-medium text-[#174B37] dark:bg-cyan-950/60 dark:text-cyan-300">
                  {companion.travelStyle}
                </span>
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
                <Languages className="h-3.5 w-3.5 text-[#FF9933]" />
                Languages Spoken
              </h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {companion.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-stone-100 px-2 py-0.5 text-xs text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Favorite Destinations */}
          <div className="mt-5">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
              <MapPin className="h-3.5 w-3.5 text-[#FF9933]" />
              Favorite Indian Destinations
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {companion.favoriteDestinations.map((dest, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-800 shadow-sm dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
                >
                  📍 {dest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
