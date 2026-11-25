'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  MapPin,
  Calendar,
  Users,
  MessageSquare,
  Compass,
  DollarSign,
  Bot,
  Camera,
  ShieldCheck,
  Send,
  ThumbsUp,
  Plus,
  Radio,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  Share2,
  Navigation,
  FileText,
  UserCheck,
  Check,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import { TravelRoom, RoomMessage, RoomItineraryItem, RoomExpense, RoomMemory } from '@/types';

interface RoomWorkspaceProps {
  room: TravelRoom;
  onClose: () => void;
  onUpdateRoom?: (updatedRoom: TravelRoom) => void;
}

type TabType =
  | 'overview'
  | 'chat'
  | 'itinerary'
  | 'map'
  | 'members'
  | 'budget'
  | 'ai'
  | 'memories';

export const RoomWorkspace: React.FC<RoomWorkspaceProps> = ({
  room: initialRoom,
  onClose,
  onUpdateRoom,
}) => {
  const [room, setRoom] = useState<TravelRoom>(initialRoom);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLiveMode, setIsLiveMode] = useState<boolean>(initialRoom.live_mode || false);
  const [safetyCheckedIn, setSafetyCheckedIn] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<RoomMessage[]>([
    {
      id: 'm-1',
      room: initialRoom.id,
      sender_username: initialRoom.creator?.name || 'Aarav',
      message_type: 'text',
      content: `Hey everyone! Welcome to the ${initialRoom.name} planning room! Super excited for this trip. Check out the itinerary tab to vote on our daily spots.`,
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'm-2',
      room: initialRoom.id,
      sender_username: 'Sneha P.',
      message_type: 'text',
      content: 'Hello! I packed trekking shoes and a camera. Looking forward to meeting you all!',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ]);
  const [newMessageText, setNewMessageText] = useState('');

  // Itinerary Items State (Collaborative Voting)
  const [itineraryItems, setItineraryItems] = useState<RoomItineraryItem[]>([
    {
      id: 'it-1',
      room: initialRoom.id,
      day_number: 1,
      time_slot: '09:00 AM - 12:00 PM',
      title: `${initialRoom.destination_city || 'City'} Heritage Walking Tour`,
      description: 'Explore the landmark historical monuments, architecture, and local artisan lanes.',
      category: 'Sightseeing',
      entry_fee: 50,
      votes_count: 3,
      voter_ids: ['u-1', 'u-2', 'u-3'],
      is_confirmed: true,
      suggested_by_username: 'Aarav Mehta',
    },
    {
      id: 'it-2',
      room: initialRoom.id,
      day_number: 1,
      time_slot: '04:30 PM - 07:00 PM',
      title: 'Sunset Viewpoint & Photography Walk',
      description: 'Golden hour panoramic photography from the scenic cliff overlook followed by evening chai.',
      category: 'Nature',
      entry_fee: 0,
      votes_count: 4,
      voter_ids: ['u-1', 'u-2', 'u-3', 'u-4'],
      is_confirmed: true,
      suggested_by_username: 'Sneha Patel',
    },
    {
      id: 'it-3',
      room: initialRoom.id,
      day_number: 2,
      time_slot: '07:00 AM - 11:30 AM',
      title: 'Local Nature Trek & Waterfall Dip',
      description: 'Gentle 4km guided trail through lush green forest reserve with freshwater bathing pool.',
      category: 'Adventure',
      entry_fee: 150,
      votes_count: 2,
      voter_ids: ['u-1', 'u-2'],
      is_confirmed: false,
      suggested_by_username: 'Kabir Das',
    },
  ]);
  const [showAddItineraryModal, setShowAddItineraryModal] = useState(false);
  const [newItineraryTitle, setNewItineraryTitle] = useState('');
  const [newItineraryTime, setNewItineraryTime] = useState('10:00 AM');
  const [newItineraryDay, setNewItineraryDay] = useState(1);
  const [newItineraryFee, setNewItineraryFee] = useState(0);

  // Group Expenses State
  const [expenses, setExpenses] = useState<RoomExpense[]>([
    {
      id: 'exp-1',
      room: initialRoom.id,
      title: 'Group Homestay Advance Deposit (2 Nights)',
      amount: 4800,
      category: 'Stay',
      paid_by_username: initialRoom.creator?.name || 'Aarav Mehta',
      split_among: ['Aarav', 'Sneha', 'Kabir', 'Ananya'],
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'exp-2',
      room: initialRoom.id,
      title: 'Shared Tempo Traveler / Cab Booking',
      amount: 3200,
      category: 'Transit',
      paid_by_username: 'Sneha Patel',
      split_among: ['Aarav', 'Sneha', 'Kabir', 'Ananya'],
      created_at: new Date(Date.now() - 43200000).toISOString(),
    },
  ]);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('Food');

  // Members & Join Requests State
  const [members, setMembers] = useState([
    {
      id: 'm-aarav',
      name: initialRoom.creator?.name || 'Aarav Mehta',
      role: 'Room Host',
      avatar:
        initialRoom.creator?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      verified: true,
      status: 'confirmed',
    },
    {
      id: 'm-sneha',
      name: 'Sneha Patel',
      role: 'Co-planner',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      verified: true,
      status: 'confirmed',
    },
    {
      id: 'm-kabir',
      name: 'Kabir Das',
      role: 'Member',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      verified: true,
      status: 'confirmed',
    },
  ]);

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'req-1',
      name: 'Priya Iyer',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      bio: 'Solo female trekker from Chennai. Love nature walks and vegetarian cuisine.',
      requestedAt: '3 hours ago',
    },
  ]);

  // AI Assistant Tab State
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: `Namaste! I am WAYNEX AI, your smart travel copilot for **${
        initialRoom.destination_city || initialRoom.name
      }**. I can recommend authentic local eateries, optimize your daily timetable, check live weather, or calculate travel distances between stops. How can I assist the group today?`,
    },
  ]);
  const [aiInput, setAiInput] = useState('');

  // Memories State
  const [memories, setMemories] = useState<RoomMemory[]>([
    {
      id: 'mem-1',
      room: initialRoom.id,
      username: 'Sneha Patel',
      image_url:
        'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800&auto=format&fit=crop&q=80',
      caption: 'Sunrise over the misty Western Ghats trails. Unforgettable view!',
      location_name: `${initialRoom.destination_city || 'Western Ghats'} Peak`,
      created_at: 'Yesterday',
    },
    {
      id: 'mem-2',
      room: initialRoom.id,
      username: 'Aarav Mehta',
      image_url:
        'https://images.unsplash.com/photo-1596761226487-17eb481a5f6e?w=800&auto=format&fit=crop&q=80',
      caption: 'Evening coffee break at a heritage estate plantation.',
      location_name: 'Estate Bungalow',
      created_at: '2 days ago',
    },
  ]);
  const [showAddMemoryModal, setShowAddMemoryModal] = useState(false);
  const [newMemoryCaption, setNewMemoryCaption] = useState('');
  const [newMemoryLocation, setNewMemoryLocation] = useState('');
  const [newMemoryUrl, setNewMemoryUrl] = useState('');

  // Handle Send Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const msg: RoomMessage = {
      id: `m-${Date.now()}`,
      room: room.id,
      sender_username: 'You',
      message_type: 'text',
      content: newMessageText.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, msg]);
    setNewMessageText('');
  };

  // Handle Itinerary Vote Toggle
  const handleVoteItinerary = (itemId: string) => {
    setItineraryItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const hasVoted = item.voter_ids.includes('you');
          const nextVoters = hasVoted
            ? item.voter_ids.filter((id) => id !== 'you')
            : [...item.voter_ids, 'you'];
          return {
            ...item,
            votes_count: nextVoters.length,
            voter_ids: nextVoters,
          };
        }
        return item;
      })
    );
  };

  // Handle Add Itinerary Item
  const handleAddItineraryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItineraryTitle.trim()) return;

    const newItem: RoomItineraryItem = {
      id: `it-${Date.now()}`,
      room: room.id,
      day_number: newItineraryDay,
      time_slot: newItineraryTime,
      title: newItineraryTitle.trim(),
      description: 'Added by group member for vote.',
      category: 'Activity',
      entry_fee: Number(newItineraryFee) || 0,
      votes_count: 1,
      voter_ids: ['you'],
      is_confirmed: false,
      suggested_by_username: 'You',
    };

    setItineraryItems((prev) => [...prev, newItem]);
    setNewItineraryTitle('');
    setShowAddItineraryModal(false);
  };

  // Handle Add Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newExpenseAmount);
    if (!newExpenseTitle.trim() || isNaN(amt) || amt <= 0) return;

    const newExp: RoomExpense = {
      id: `exp-${Date.now()}`,
      room: room.id,
      title: newExpenseTitle.trim(),
      amount: amt,
      category: newExpenseCategory,
      paid_by_username: 'You',
      split_among: members.map((m) => m.name),
      created_at: new Date().toISOString(),
    };

    setExpenses((prev) => [newExp, ...prev]);
    setNewExpenseTitle('');
    setNewExpenseAmount('');
    setShowAddExpenseModal(false);
  };

  // Handle Approve Join Request
  const handleApproveRequest = (reqId: string, reqName: string, reqAvatar: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== reqId));
    setMembers((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        name: reqName,
        role: 'Member',
        avatar: reqAvatar,
        verified: true,
        status: 'confirmed',
      },
    ]);
    const updatedCount = (room.current_members_count || 3) + 1;
    const updated = { ...room, current_members_count: updatedCount, member_count: updatedCount };
    setRoom(updated);
    if (onUpdateRoom) onUpdateRoom(updated);
  };

  // Handle AI Chat
  const handleSendAiPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userText = aiInput.trim();
    setAiMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setAiInput('');

    try {
      const res = await fetch('http://localhost:8000/api/v1/assistant/room/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_name: room.name,
          destination: room.destination_city || room.destination_name,
          message: userText,
          group_context: {
            members_count: members.length,
            duration_days: room.duration_days,
            budget_per_person: room.budget_per_person,
            travel_style: room.travel_style,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiMessages((prev) => [
          ...prev,
          { sender: 'ai', text: data.response || data.text },
        ]);
        return;
      }
    } catch (err) {
      console.warn('Backend room AI service unavailable, using local response', err);
    }

    // Contextual responses based on destination and topic (fallback)
    setTimeout(() => {
      let reply = `Here are some recommendations for ${room.destination_city || 'your trip'}:`;
      const lower = userText.toLowerCase();

      if (lower.includes('food') || lower.includes('eat') || lower.includes('cafe') || lower.includes('restaurant')) {
        reply = `Top recommended dining near ${room.destination_city || 'the location'}:\n1. **Local Heritage Kitchen**: Renowned for authentic regional thalis and fresh spices.\n2. **Hilltop / Riverside Cafe**: Great for evening snacks, specialty coffee, and scenic sunset views.\n3. **Night Market Stalls**: Must try hot steamed snacks and sweet local delicacies.`;
      } else if (lower.includes('weather') || lower.includes('pack') || lower.includes('wear') || lower.includes('clothes')) {
        reply = `Current travel forecast for ${room.destination_city || 'the destination'}:\n• Daytime: Comfortable 22°C - 26°C with sunny skies.\n• Evenings: Pleasant drop to 14°C - 18°C. Carry a light windbreaker or fleece hoodie.\n• Essentials: Sturdy walking shoes, reusable water bottle, sunscreen, and portable power bank.`;
      } else if (lower.includes('cost') || lower.includes('budget') || lower.includes('money') || lower.includes('split')) {
        const totalExp = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const perPerson = totalExp / (members.length || 1);
        reply = `Your group has currently logged **${formatCurrency(totalExp)}** in shared expenses. With ${members.length} confirmed members, that works out to **${formatCurrency(perPerson)} per person**. You are within the planned group budget!`;
      } else {
        reply = `Great travel idea for ${room.name}! Based on your itinerary, consider planning early departures (around 07:30 AM) to beat the tourist crowds and capture the best golden hour lighting. Let me know if you would like me to draft an hourly breakdown!`;
      }

      setAiMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  // Handle Add Memory
  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryUrl.trim() || !newMemoryCaption.trim()) return;

    const newMem: RoomMemory = {
      id: `mem-${Date.now()}`,
      room: room.id,
      username: 'You',
      image_url: newMemoryUrl.trim(),
      caption: newMemoryCaption.trim(),
      location_name: newMemoryLocation.trim() || room.destination_city || 'India',
      created_at: 'Just now',
    };

    setMemories((prev) => [newMem, ...prev]);
    setNewMemoryUrl('');
    setNewMemoryCaption('');
    setNewMemoryLocation('');
    setShowAddMemoryModal(false);
  };

  // Calculations for budget
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalGroupBudget = (room.budget_per_person || 3500) * members.length;
  const perPersonExpense = members.length > 0 ? totalExpenses / members.length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative flex flex-col h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-stone-200/90 bg-[#F7F4EC] shadow-2xl dark:border-stone-800 dark:bg-[#101C2E]">
        {/* Live Trip Mode Banner */}
        {isLiveMode && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-700 via-teal-700 to-[#174B37] px-5 py-2.5 text-white text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
              </span>
              <span className="font-bold tracking-wide">LIVE TRIP MODE ACTIVE</span>
              <span className="hidden sm:inline text-white/80">|</span>
              <span className="hidden sm:inline text-white/90">
                Today&apos;s Stop: {itineraryItems[0]?.title || 'En Route'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSafetyCheckedIn(!safetyCheckedIn)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  safetyCheckedIn
                    ? 'bg-emerald-400 text-stone-900'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {safetyCheckedIn ? '✓ Safety Checked In' : 'Tap to Safety Check-in'}
              </button>
              <button
                onClick={() => setIsLiveMode(false)}
                className="text-stone-200 hover:text-white text-xs underline"
              >
                Exit Live
              </button>
            </div>
          </div>
        )}

        {/* Room Header */}
        <div className="relative border-b border-stone-200/80 bg-white px-5 py-4 dark:border-stone-800 dark:bg-[#14243A]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-stone-200 flex-shrink-0">
                <Image
                  src={
                    room.cover_image ||
                    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=200&fit=crop'
                  }
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg font-bold text-stone-900 dark:text-white">
                    {room.name}
                  </h1>
                  {room.women_only && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                      <ShieldCheck className="h-3 w-3" />
                      Women-Only
                    </span>
                  )}
                  <span className="rounded-full bg-[#174B37]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#174B37] dark:bg-cyan-950 dark:text-cyan-400 capitalize">
                    {room.travel_style || 'Backpacking'}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                  <span className="flex items-center gap-1 font-medium text-stone-700 dark:text-stone-300">
                    <MapPin className="h-3.5 w-3.5 text-[#FF9933]" />
                    {room.destination_city || room.destination_name}
                    {room.state_name ? `, ${room.state_name}` : ''}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {room.travel_dates_start} to {room.travel_dates_end}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(room.budget_per_person || 3500)} / person
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Close */}
            <div className="flex items-center gap-2 self-end md:self-center">
              {!isLiveMode && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsLiveMode(true)}
                  className="h-8 text-xs font-semibold border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400"
                >
                  <Radio className="mr-1.5 h-3.5 w-3.5 animate-pulse text-emerald-600" />
                  Live Trip Mode
                </Button>
              )}

              <button
                onClick={onClose}
                className="rounded-full bg-stone-100 p-2 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 flex items-center gap-1 overflow-x-auto border-t border-stone-200/60 pt-2 no-scrollbar dark:border-stone-800">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'chat', label: 'Chat', icon: MessageSquare, badge: messages.length },
              { id: 'itinerary', label: 'Itinerary & Sights', icon: Compass, badge: itineraryItems.length },
              { id: 'map', label: 'Route Map', icon: Navigation },
              { id: 'members', label: 'Members', icon: Users, badge: members.length },
              { id: 'budget', label: 'Group Budget', icon: DollarSign },
              { id: 'ai', label: 'AI Travel Agent', icon: Bot },
              { id: 'memories', label: 'Memories', icon: Camera, badge: memories.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#174B37] text-white shadow-sm dark:bg-cyan-600'
                      : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Workspace Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Trip Description */}
                <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-[#14243A]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
                    Trip Overview
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                    {room.description ||
                      'An incredible group trip designed to experience local architecture, culture, cuisine, and secret nature trails. All members collaborate on the itinerary, split expenses equally, and travel safely together.'}
                  </p>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="rounded-lg bg-stone-50 p-2.5 dark:bg-stone-900/60">
                      <span className="text-stone-400 block text-[10px]">Starting From</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        {room.starting_location || 'Bengaluru / State Capital'}
                      </span>
                    </div>
                    <div className="rounded-lg bg-stone-50 p-2.5 dark:bg-stone-900/60">
                      <span className="text-stone-400 block text-[10px]">Transit Mode</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200 capitalize">
                        {room.transport_preference || 'Bus / Shared Cab'}
                      </span>
                    </div>
                    <div className="rounded-lg bg-stone-50 p-2.5 dark:bg-stone-900/60">
                      <span className="text-stone-400 block text-[10px]">Group Capacity</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        {members.length} / {room.max_members} Confirmed
                      </span>
                    </div>
                    <div className="rounded-lg bg-stone-50 p-2.5 dark:bg-stone-900/60">
                      <span className="text-stone-400 block text-[10px]">Join Policy</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200 capitalize">
                        {room.join_approval === 'manual' ? 'Approval Required' : 'Instant Join'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Room Rules & Safety Agreement */}
                <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-[#14243A]">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-white">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Community Standards & Safety Agreement
                  </h3>
                  <div className="mt-3 space-y-2 text-xs text-stone-600 dark:text-stone-300">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Respect and Inclusivity:</strong> All travelers agree to maintain a safe, welcoming, and harassment-free atmosphere for all group members.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Transparent Expense Settlement:</strong> Keep group expenses updated in the Group Budget tab. Settle before the final day of travel.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Safety Check-ins:</strong> During Live Trip Mode, check-in at daily milestones so everyone&apos;s trusted contacts know the group is safe.
                      </span>
                    </div>
                    {room.women_only && (
                      <div className="flex items-start gap-2 text-rose-700 dark:text-rose-300 font-medium bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg">
                        <ShieldCheck className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-500" />
                        <span>
                          <strong>Women-Only Verified Sanctuary:</strong> This room is strictly reserved for women travelers with verified ID credentials.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Quick Stats & Emergency */}
              <div className="space-y-6">
                {/* Host Profile */}
                <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-[#14243A]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Trip Host
                  </h3>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-stone-200">
                      <Image
                        src={
                          room.creator?.avatar ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
                        }
                        alt="Host"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-stone-900 dark:text-white">
                        <span>{room.creator?.name || 'Aarav Mehta'}</span>
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      </div>
                      <span className="text-xs text-stone-500">Verified Explorer • 18 Trips</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Helplines */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    State Travel Emergency Contacts
                  </h4>
                  <div className="mt-2 space-y-1.5 text-xs text-amber-800 dark:text-amber-200">
                    <p>• All India Emergency Helpline: <strong>112</strong></p>
                    <p>• Women Helpline: <strong>1091 / 181</strong></p>
                    <p>• National Tourist Info Helpline: <strong>1800-11-1363</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHAT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[65vh] rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-[#14243A]">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.sender_username === 'You' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender_username !== 'You' && (
                      <div className="h-7 w-7 rounded-full bg-[#174B37] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {msg.sender_username.charAt(0)}
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl p-3 text-xs shadow-sm ${
                        msg.sender_username === 'You'
                          ? 'bg-[#174B37] text-white rounded-tr-none'
                          : 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200 rounded-tl-none'
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between gap-3 text-[10px] opacity-75">
                        <span className="font-semibold">{msg.sender_username}</span>
                        <span>
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 border-t border-stone-200 p-3 dark:border-stone-800"
              >
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Share a thought, timing update, or question with the group..."
                  className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#174B37] dark:border-stone-700 dark:bg-stone-900 dark:text-white"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 px-4 rounded-xl bg-[#174B37] text-white hover:bg-[#1F5F45] text-xs font-semibold"
                >
                  <Send className="h-3.5 w-3.5 mr-1" />
                  Send
                </Button>
              </form>
            </div>
          )}

          {/* TAB 3: ITINERARY & SIGHTS */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                    Collaborative Trip Plan & Attractions
                  </h3>
                  <p className="text-xs text-stone-500">
                    Vote on proposed sights to confirm them in the official group itinerary.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowAddItineraryModal(true)}
                  className="h-8 text-xs font-semibold rounded-lg bg-[#174B37] text-white hover:bg-[#1F5F45]"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Suggest Attraction
                </Button>
              </div>

              <div className="space-y-3">
                {itineraryItems.map((item) => {
                  const hasVoted = item.voter_ids.includes('you');
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-[#14243A]"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                            Day {item.day_number} • {item.time_slot}
                          </span>
                          <span className="text-[11px] font-medium text-stone-400 capitalize">
                            {item.category}
                          </span>
                          {item.is_confirmed && (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              <CheckCircle2 className="h-3 w-3" /> Confirmed
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-xs text-stone-600 dark:text-stone-300">
                          {item.description}
                        </p>

                        <div className="text-[11px] text-stone-400">
                          Fee: {item.entry_fee > 0 ? formatCurrency(item.entry_fee) : 'Free'}{' '}
                          • Suggested by {item.suggested_by_username || 'Host'}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                          onClick={() => handleVoteItinerary(item.id)}
                          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                            hasVoted
                              ? 'bg-[#174B37] text-white shadow'
                              : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'
                          }`}
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>{item.votes_count} Votes</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Itinerary Modal */}
              {showAddItineraryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-[#14243A]">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                        Suggest an Attraction / Activity
                      </h4>
                      <button onClick={() => setShowAddItineraryModal(false)}>
                        <X className="h-4 w-4 text-stone-400" />
                      </button>
                    </div>

                    <form onSubmit={handleAddItineraryItem} className="space-y-3 text-xs">
                      <div>
                        <label className="block mb-1 font-semibold text-stone-700 dark:text-stone-300">
                          Title / Attraction Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newItineraryTitle}
                          onChange={(e) => setNewItineraryTitle(e.target.value)}
                          placeholder="e.g., Sanapur Lake Coracle Ride"
                          className="w-full rounded-lg border border-stone-200 p-2 dark:border-stone-700 dark:bg-stone-900 text-stone-900 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block mb-1 font-semibold text-stone-700 dark:text-stone-300">
                            Day
                          </label>
                          <select
                            value={newItineraryDay}
                            onChange={(e) => setNewItineraryDay(Number(e.target.value))}
                            className="w-full rounded-lg border border-stone-200 p-2 dark:border-stone-700 dark:bg-stone-900 text-stone-900 dark:text-white"
                          >
                            <option value={1}>Day 1</option>
                            <option value={2}>Day 2</option>
                            <option value={3}>Day 3</option>
                          </select>
                        </div>
                        <div>
                          <label className="block mb-1 font-semibold text-stone-700 dark:text-stone-300">
                            Time
                          </label>
                          <input
                            type="text"
                            value={newItineraryTime}
                            onChange={(e) => setNewItineraryTime(e.target.value)}
                            placeholder="e.g., 03:00 PM"
                            className="w-full rounded-lg border border-stone-200 p-2 dark:border-stone-700 dark:bg-stone-900 text-stone-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-stone-700 dark:text-stone-300">
                          Estimated Entry Fee (₹)
                        </label>
                        <input
                          type="number"
                          value={newItineraryFee}
                          onChange={(e) => setNewItineraryFee(Number(e.target.value))}
                          placeholder="0 for free"
                          className="w-full rounded-lg border border-stone-200 p-2 dark:border-stone-700 dark:bg-stone-900 text-stone-900 dark:text-white"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddItineraryModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          className="bg-[#174B37] text-white hover:bg-[#1F5F45]"
                        >
                          Submit Proposal
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ROUTE MAP */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-[#14243A]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                      Interactive Route & Navigation Timeline
                    </h3>
                    <p className="text-xs text-stone-500">
                      Shared travel route connecting boarding point, accommodation, and verified attractions.
                    </p>
                  </div>
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                    Total Estimated Transit: ~45 km
                  </span>
                </div>

                {/* Timeline Route Nodes */}
                <div className="relative mt-6 space-y-6 pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-700">
                  <div className="relative">
                    <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow" />
                    <div className="text-xs font-bold text-stone-900 dark:text-white">
                      Start: {room.starting_location || 'Meeting Hub'}
                    </div>
                    <p className="text-[11px] text-stone-500">Boarding & rendezvous point for all members.</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#FF9933] shadow" />
                    <div className="text-xs font-bold text-stone-900 dark:text-white">
                      Midway Pitstop: Scenic Ghat Highway Dhaba
                    </div>
                    <p className="text-[11px] text-stone-500">Rest stop, tea, and quick photography break.</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#174B37] dark:bg-cyan-400 shadow" />
                    <div className="text-xs font-bold text-stone-900 dark:text-white">
                      Destination Base: {room.destination_city || room.destination_name}
                    </div>
                    <p className="text-[11px] text-stone-500">Homestay check-in and local sightseeing trailhead.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MEMBERS */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              {/* Confirmed Members */}
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-3">
                  Confirmed Room Members ({members.length} / {room.max_members})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm dark:border-stone-800 dark:bg-[#14243A]"
                    >
                      <div className="relative h-11 w-11 overflow-hidden rounded-full border border-stone-200">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs font-bold text-stone-900 dark:text-white">
                          <span>{member.name}</span>
                          {member.verified && (
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                          )}
                        </div>
                        <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Join Requests (Host Control) */}
              {pendingRequests.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-2">
                    Pending Join Requests ({pendingRequests.length})
                  </h4>
                  <div className="space-y-2">
                    {pendingRequests.map((req) => (
                      <div
                        key={req.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg bg-white p-3 shadow-sm dark:bg-[#14243A]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-9 overflow-hidden rounded-full">
                            <Image src={req.avatar} alt={req.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-stone-900 dark:text-white">
                              {req.name}
                            </span>
                            <p className="text-[11px] text-stone-500">{req.bio}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveRequest(req.id, req.name, req.avatar)}
                            className="h-7 text-xs bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setPendingRequests((prev) => prev.filter((r) => r.id !== req.id))
                            }
                            className="h-7 text-xs text-stone-600"
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: BUDGET & EXPENSES */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm dark:border-stone-800 dark:bg-[#14243A]">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase">
                    Target Budget
                  </span>
                  <div className="mt-1 text-base font-bold text-stone-900 dark:text-white">
                    {formatCurrency(totalGroupBudget)}
                  </div>
                </div>
                <div className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm dark:border-stone-800 dark:bg-[#14243A]">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase">
                    Total Spent
                  </span>
                  <div className="mt-1 text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(totalExpenses)}
                  </div>
                </div>
                <div className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm dark:border-stone-800 dark:bg-[#14243A]">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase">
                    Your Share
                  </span>
                  <div className="mt-1 text-base font-bold text-stone-900 dark:text-white">
                    {formatCurrency(perPersonExpense)}
                  </div>
                </div>
                <div className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm dark:border-stone-800 dark:bg-[#14243A]">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase">
                    Remaining
                  </span>
                  <div className="mt-1 text-base font-bold text-cyan-600 dark:text-cyan-400">
                    {formatCurrency(Math.max(0, totalGroupBudget - totalExpenses))}
                  </div>
                </div>
              </div>

              {/* Action & Expenses List */}
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-[#14243A]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                    Logged Group Expenses
                  </h3>
                  <Button
                    size="sm"
                    onClick={() => setShowAddExpenseModal(true)}
                    className="h-8 text-xs font-semibold bg-[#174B37] text-white hover:bg-[#1F5F45]"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Log Expense
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex items-center justify-between rounded-lg border border-stone-100 bg-stone-50/70 p-3 text-xs dark:border-stone-800 dark:bg-stone-900/50"
                    >
                      <div>
                        <span className="font-bold text-stone-900 dark:text-white">{exp.title}</span>
                        <div className="text-[11px] text-stone-400">
                          Paid by <strong>{exp.paid_by_username}</strong> • Split equally among {exp.split_among.length} members
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-stone-900 dark:text-white">
                          {formatCurrency(exp.amount)}
                        </span>
                        <div className="text-[10px] text-emerald-600">
                          ({formatCurrency(exp.amount / exp.split_among.length)} each)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Expense Modal */}
              {showAddExpenseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-[#14243A]">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                        Log a Shared Expense
                      </h4>
                      <button onClick={() => setShowAddExpenseModal(false)}>
                        <X className="h-4 w-4 text-stone-400" />
                      </button>
                    </div>

                    <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
                      <div>
                        <label className="block mb-1 font-semibold text-stone-700 dark:text-stone-300">
                          Expense Title
                        </label>
                        <input
                          type="text"
                          required
                          value={newExpenseTitle}
                          onChange={(e) => setNewExpenseTitle(e.target.value)}
                          placeholder="e.g., Dinner at Local Dhaba"
                          className="w-full rounded-lg border border-stone-200 p-2 dark:border-stone-700 dark:bg-stone-900 text-stone-900 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block mb-1 font-semibold text-stone-700 dark:text-stone-300">
                            Amount (₹)
                          </label>
                          <input
                            type="number"
                            required
                            value={newExpenseAmount}
                            onChange={(e) => setNewExpenseAmount(e.target.value)}
                            placeholder="1200"
                            className="w-full rounded-lg border border-stone-200 p-2 dark:border-stone-700 dark:bg-stone-900 text-stone-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-semibold text-stone-700 dark:text-stone-300">
                            Category
                          </label>
                          <select
                            value={newExpenseCategory}
                            onChange={(e) => setNewExpenseCategory(e.target.value)}
                            className="w-full rounded-lg border border-stone-200 p-2 dark:border-stone-700 dark:bg-stone-900 text-stone-900 dark:text-white"
                          >
                            <option value="Food">Food & Drinks</option>
                            <option value="Stay">Stay & Lodging</option>
                            <option value="Transit">Cab & Fuel</option>
                            <option value="Tickets">Entry Tickets</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddExpenseModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          className="bg-[#174B37] text-white hover:bg-[#1F5F45]"
                        >
                          Record Expense
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: AI TRAVEL AGENT */}
          {activeTab === 'ai' && (
            <div className="flex flex-col h-[65vh] rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-[#14243A]">
              <div className="flex items-center gap-2 border-b border-stone-200 px-4 py-3 dark:border-stone-800">
                <Bot className="h-5 w-5 text-[#FF9933]" />
                <div>
                  <h4 className="font-bold text-xs text-stone-900 dark:text-white">
                    WAYNEX Room Copilot
                  </h4>
                  <span className="text-[10px] text-stone-400">
                    Live insights for {room.destination_city || room.destination_name}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="h-7 w-7 rounded-full bg-[#FF9933] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        AI
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-[#174B37] text-white rounded-tr-none'
                          : 'bg-stone-50 border border-stone-200 text-stone-800 dark:bg-stone-800/80 dark:border-stone-700 dark:text-stone-200 rounded-tl-none whitespace-pre-line'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick AI Prompts */}
              <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-2 border-t border-stone-100 dark:border-stone-800 no-scrollbar">
                {[
                  'Best local food?',
                  'Current weather & packing tips',
                  'Budget status check',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAiInput(prompt);
                    }}
                    className="whitespace-nowrap rounded-full bg-stone-100 px-2.5 py-1 text-[11px] text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
                  >
                    💡 {prompt}
                  </button>
                ))}
              </div>

              <form
                onSubmit={handleSendAiPrompt}
                className="flex items-center gap-2 p-3 border-t border-stone-200 dark:border-stone-800"
              >
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask WAYNEX AI anything about this destination or plan..."
                  className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-white"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 px-4 rounded-xl bg-[#174B37] text-white hover:bg-[#1F5F45] text-xs font-semibold"
                >
                  Ask
                </Button>
              </form>
            </div>
          )}

          {/* TAB 8: MEMORIES */}
          {activeTab === 'memories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                    Trip Memories & Shared Album
                  </h3>
                  <p className="text-xs text-stone-500">
                    High-resolution photographs and travel stories shared by room members.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowAddMemoryModal(true)}
                  className="h-8 text-xs font-semibold bg-[#174B37] text-white hover:bg-[#1F5F45]"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Upload Memory
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-[#14243A]"
                  >
                    <div className="relative h-48 w-full bg-stone-900">
                      <Image
                        src={mem.image_url}
                        alt={mem.caption}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3 text-xs">
                      <p className="font-medium text-stone-800 dark:text-stone-200">
                        {mem.caption}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400">
                        <span>📍 {mem.location_name}</span>
                        <span>By {mem.username}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Memory Modal */}
              {showAddMemoryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-[#14243A]">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                        Share a Trip Photo & Story
                      </h4>
                      <button onClick={() => setShowAddMemoryModal(false)}>
                        <X className="h-4 w-4 text-stone-400" />
                      </button>
                    </div>

                    <form onSubmit={handleAddMemory} className="space-y-3 text-xs">
                      <div>
                        <label className="block mb-1 font-semibold text-stone-700 dark:text-stone-300">
                          Photo Image URL
                        </label>
                        <input
                          type="url"
                          required
                          value={newMemoryUrl}
                          onChange={(e) => setNewMemoryUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full rounded-lg border border-stone-200 p-2 dark:border-stone-700 dark:bg-stone-900 text-stone-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-stone-700 dark:text-stone-300">
                          Caption / Travel Story
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={newMemoryCaption}
                          onChange={(e) => setNewMemoryCaption(e.target.value)}
                          placeholder="What made this moment special?"
                          className="w-full rounded-lg border border-stone-200 p-2 dark:border-stone-700 dark:bg-stone-900 text-stone-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-stone-700 dark:text-stone-300">
                          Location Pin
                        </label>
                        <input
                          type="text"
                          value={newMemoryLocation}
                          onChange={(e) => setNewMemoryLocation(e.target.value)}
                          placeholder="e.g., Matanga Hill Sunset Point"
                          className="w-full rounded-lg border border-stone-200 p-2 dark:border-stone-700 dark:bg-stone-900 text-stone-900 dark:text-white"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddMemoryModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          className="bg-[#174B37] text-white hover:bg-[#1F5F45]"
                        >
                          Upload
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
