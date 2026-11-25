'use client';

import React from 'react';
import Image from 'next/image';
import {
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { TravelRoom } from '@/types';

interface RoomCardProps {
  room: TravelRoom;
  onOpenWorkspace: (room: TravelRoom) => void;
  onJoinRoom?: (room: TravelRoom) => void;
  isJoined?: boolean;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onOpenWorkspace,
  onJoinRoom,
  isJoined = false,
}) => {
  const membersCount = room.member_count ?? room.current_members_count ?? 1;
  const spotsLeft = Math.max(0, room.max_members - membersCount);
  const isFull = spotsLeft === 0;

  const defaultImage =
    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800&auto=format&fit=crop&q=80';
  const coverImage = room.cover_image || defaultImage;

  return (
    <div
      onClick={() => onOpenWorkspace(room)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 p-0 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#174B37]/40 hover:shadow-xl dark:border-stone-800 dark:bg-[#14243A]/90 dark:hover:border-cyan-500/40 cursor-pointer"
    >
      {/* Cover Image & Badges */}
      <div className="relative h-52 w-full overflow-hidden bg-stone-900">
        <Image
          src={coverImage}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {room.women_only && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/90 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                Women-Only
              </span>
            )}
            {room.live_mode && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Live Trip
              </span>
            )}
            {room.travel_style && (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-900/75 px-2.5 py-1 text-xs font-medium text-stone-200 backdrop-blur-sm capitalize">
                <Compass className="h-3 w-3 text-[#FF9933]" />
                {room.travel_style}
              </span>
            )}
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${
              isFull
                ? 'bg-red-500/80 text-white'
                : spotsLeft <= 2
                ? 'bg-amber-500/80 text-white'
                : 'bg-emerald-600/80 text-white'
            }`}
          >
            <Users className="h-3 w-3" />
            {isFull ? 'Full' : `${spotsLeft} spots left`}
          </span>
        </div>

        {/* Bottom Image Overlay Info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5 text-xs font-medium drop-shadow-md">
            <MapPin className="h-3.5 w-3.5 text-[#FF9933]" />
            <span>
              {room.destination_city || room.destination_name}
              {room.state_name ? `, ${room.state_name}` : ''}
            </span>
          </div>
          {room.duration_days && (
            <div className="flex items-center gap-1 rounded bg-black/40 px-2 py-0.5 text-xs text-stone-200 backdrop-blur-sm">
              <Clock className="h-3 w-3 text-cyan-400" />
              <span>{room.duration_days} Days</span>
            </div>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-base font-bold text-stone-900 transition-colors group-hover:text-[#174B37] dark:text-stone-100 dark:group-hover:text-cyan-400">
          {room.name}
        </h3>

        <p className="mt-2 line-clamp-2 text-xs text-stone-600 dark:text-stone-300">
          {room.description || 'Join fellow travelers exploring local sights, sharing costs, and creating memories.'}
        </p>

        {/* Tags */}
        {room.travel_interests && room.travel_interests.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {room.travel_interests.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600 dark:bg-stone-800/80 dark:text-stone-300"
              >
                #{tag}
              </span>
            ))}
            {room.travel_interests.length > 3 && (
              <span className="text-[11px] font-medium text-stone-400 self-center">
                +{room.travel_interests.length - 3}
              </span>
            )}
          </div>
        )}

        <hr className="my-4 border-stone-200/60 dark:border-stone-800" />

        {/* Footer Meta */}
        <div className="space-y-2.5 text-xs">
          {/* Dates */}
          <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-stone-400" />
              {room.travel_dates_start
                ? `${new Date(room.travel_dates_start).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })} – ${new Date(room.travel_dates_end).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}`
                : 'Dates flexible'}
            </span>
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              {formatCurrency(room.budget_per_person || room.min_budget || 3000)}
              <span className="text-[10px] font-normal text-stone-500"> / person</span>
            </span>
          </div>

          {/* Creator & Action */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7 overflow-hidden rounded-full border border-stone-300 bg-stone-200 dark:border-stone-700">
                <Image
                  src={
                    room.creator?.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop'
                  }
                  alt={room.creator?.name || room.creator_username || 'Host'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-stone-800 dark:text-stone-200">
                  {room.creator?.name || room.creator_username || 'WAYNEX Host'}
                </span>
                <span className="text-[10px] text-stone-400">Host</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isJoined ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Joined
                </span>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onJoinRoom) {
                      onJoinRoom(room);
                    } else {
                      onOpenWorkspace(room);
                    }
                  }}
                  className="h-8 rounded-lg border-[#174B37] text-xs font-medium text-[#174B37] hover:bg-[#174B37] hover:text-white dark:border-cyan-400 dark:text-cyan-400 dark:hover:bg-cyan-500 dark:hover:text-black"
                >
                  {room.join_approval === 'manual' ? 'Request' : 'Join'}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
