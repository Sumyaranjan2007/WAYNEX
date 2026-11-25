'use client';

import React, { useState } from 'react';
import {
  X,
  Compass,
  MapPin,
  Calendar,
  Wallet,
  Users,
  Bus,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Lock,
  Globe,
  Camera,
} from 'lucide-react';
import { CITY_HUBS } from '@/data/tripPlannerData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated: (roomData: any) => void;
}

export const CreateRoomModal: React.FC<Props> = ({ isOpen, onClose, onRoomCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Trip info
  const [name, setName] = useState('');
  const [destinationCity, setDestinationCity] = useState('Coorg');
  const [stateName, setStateName] = useState('Karnataka');
  const [startingLocation, setStartingLocation] = useState('Bengaluru');
  const [travelDatesStart, setTravelDatesStart] = useState('2026-12-15');
  const [travelDatesEnd, setTravelDatesEnd] = useState('2026-12-18');
  const [durationDays, setDurationDays] = useState(3);
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1596761226487-17eb481a5f6e?w=800&auto=format&fit=crop&q=80'
  );

  // Step 2: Budget
  const [budgetPerPerson, setBudgetPerPerson] = useState(4500);
  const [minBudget, setMinBudget] = useState(3500);
  const [maxBudget, setMaxBudget] = useState(5500);
  const [budgetCategory, setBudgetCategory] = useState('₹2,000–₹5,000');

  // Step 3: Travel Preferences
  const [travelStyle, setTravelStyle] = useState('nature');
  const [transportPreference, setTransportPreference] = useState('bus');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Coffee', 'Trekking', 'River Rafting']);

  // Step 4: Room Settings
  const [maxMembers, setMaxMembers] = useState(6);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [joinApproval, setJoinApproval] = useState<'auto' | 'manual'>('auto');
  const [womenOnly, setWomenOnly] = useState(false);
  const [roomRules, setRoomRules] = useState('Respect local culture. Early morning starts at 7:30 AM.');

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoomPayload = {
      id: `room-${Date.now()}`,
      name: name || `${destinationCity} Group Expedition`,
      description: description || `Join us for an exciting ${durationDays}-day trip to ${destinationCity}!`,
      destination_city: destinationCity,
      state_name: stateName,
      starting_location: startingLocation,
      travel_dates_start: travelDatesStart,
      travel_dates_end: travelDatesEnd,
      duration_days: durationDays,
      budget_per_person: budgetPerPerson,
      min_budget: minBudget,
      max_budget: maxBudget,
      travel_style: travelStyle,
      transport_preference: transportPreference,
      travel_interests: selectedInterests,
      max_members: maxMembers,
      member_count: 1,
      visibility,
      join_approval: joinApproval,
      women_only: womenOnly,
      room_rules: roomRules,
      cover_image: coverImage,
      creator_username: 'You (Creator)',
      status: 'planning',
      created_at: new Date().toISOString(),
    };

    onRoomCreated(newRoomPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#E2D9C8] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#14243A] text-white p-5 flex items-center justify-between border-b border-white/10">
          <div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FF9933] text-[#14243A] uppercase tracking-wider">
              Step {currentStep} of 4
            </span>
            <h3 className="text-xl font-bold font-serif text-white mt-1">
              Create a Travel Room
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* STEP 1: TRIP INFO */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#14243A] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#B85C38]" /> Trip Information
              </h4>

              <div>
                <label className="block text-xs font-bold text-[#14243A] mb-1">Room Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coorg Coffee Plantation & River Rafting Trek"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#B85C38]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#14243A] mb-1">Destination City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Coorg, Hampi, Kasol, Gokarna"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#B85C38]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14243A] mb-1">Starting Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bengaluru, New Delhi, Mumbai"
                    value={startingLocation}
                    onChange={(e) => setStartingLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#B85C38]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#14243A] mb-1">Start Date</label>
                  <input
                    type="date"
                    value={travelDatesStart}
                    onChange={(e) => setTravelDatesStart(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#14243A] mb-1">End Date</label>
                  <input
                    type="date"
                    value={travelDatesEnd}
                    onChange={(e) => setTravelDatesEnd(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#14243A] mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14243A] mb-1">Trip Description & Plan</label>
                <textarea
                  rows={3}
                  placeholder="Describe your plan, what you want to explore, homestay arrangements, activities..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A] focus:outline-none focus:ring-2 focus:ring-[#B85C38]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: BUDGET SETTINGS */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#14243A] flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#B85C38]" /> Budget & Expense Sharing
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#14243A] mb-1">
                    Estimated Budget Per Person (INR)
                  </label>
                  <input
                    type="number"
                    step={100}
                    value={budgetPerPerson}
                    onChange={(e) => setBudgetPerPerson(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-base font-bold rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A]"
                  />
                  <span className="text-[11px] text-[#64748B] mt-1 block">
                    Total Estimated Group Budget: ~₹{(budgetPerPerson * maxMembers).toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14243A] mb-1">Budget Category</label>
                  <select
                    value={budgetCategory}
                    onChange={(e) => setBudgetCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A]"
                  >
                    <option value="Under ₹2,000">Under ₹2,000 (Day Excursion)</option>
                    <option value="₹2,000–₹5,000">₹2,000–₹5,000 (Budget Explorer)</option>
                    <option value="₹5,000–₹10,000">₹5,000–₹10,000 (Mid-Range Comfort)</option>
                    <option value="₹10,000–₹20,000">₹10,000–₹20,000 (Premium Tour)</option>
                    <option value="₹20,000+">₹20,000+ (Luxury & Resorts)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 bg-[#EFE9DC] rounded-xl border border-[#E2D9C8] text-xs text-[#475569] space-y-1">
                <strong className="text-[#14243A] block">Expense Sharing Agreement:</strong>
                <p>
                  Shared accommodation, private cab/fuel tolls, and group activity fees are automatically divided equally among active room members in the Group Budget Tracker.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: PREFERENCES & TRANSIT */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#14243A] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#B85C38]" /> Travel Style & Transport Preference
              </h4>

              <div>
                <label className="block text-xs font-bold text-[#14243A] mb-2">Travel Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'backpacking', label: 'Backpacking' },
                    { id: 'nature', label: 'Nature & Trekking' },
                    { id: 'adventure', label: 'Adventure Sports' },
                    { id: 'heritage', label: 'Heritage & Ruins' },
                    { id: 'relaxed', label: 'Relaxed Leisure' },
                    { id: 'spiritual', label: 'Spiritual / Temples' },
                    { id: 'beach', label: 'Coastal / Beach' },
                    { id: 'wildlife', label: 'Wildlife Safaris' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setTravelStyle(st.id)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        travelStyle === st.id
                          ? 'bg-[#14243A] text-white border-[#14243A]'
                          : 'bg-[#F7F4EC] text-[#475569] border-[#E2D9C8] hover:border-[#B85C38]'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14243A] mb-2">Preferred Transport Mode</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'bus', label: 'Bus (KSRTC/Volvo)' },
                    { id: 'train', label: 'Train (Vande Bharat)' },
                    { id: 'car', label: 'Car / Road Trip' },
                    { id: 'bike', label: 'Bike Expedition' },
                  ].map((tr) => (
                    <button
                      key={tr.id}
                      type="button"
                      onClick={() => setTransportPreference(tr.id)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        transportPreference === tr.id
                          ? 'bg-[#14243A] text-white border-[#14243A]'
                          : 'bg-[#F7F4EC] text-[#475569] border-[#E2D9C8] hover:border-[#B85C38]'
                      }`}
                    >
                      {tr.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ROOM SETTINGS & SAFETY */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#14243A] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#174B37]" /> Capacity & Safety Safeguards
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#14243A] mb-1">Maximum Members</label>
                  <input
                    type="number"
                    min={2}
                    max={20}
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm font-bold rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A]"
                  />
                  <span className="text-[10px] text-[#64748B] mt-1 block">Rooms are capped at 20 members for cohesive planning.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14243A] mb-1">Room Joining Approval</label>
                  <select
                    value={joinApproval}
                    onChange={(e) => setJoinApproval(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A]"
                  >
                    <option value="auto">Auto Approve (First Come, First Served)</option>
                    <option value="manual">Manual Approval (Creator Reviews Requests)</option>
                  </select>
                </div>
              </div>

              {/* Women-Only Toggle */}
              <div className="p-4 rounded-2xl bg-[#FF9933]/10 border border-[#FF9933]/30 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#14243A]">Women-Only Travel Room</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#174B37] text-white">
                      Verified Safety
                    </span>
                  </div>
                  <p className="text-[11px] text-[#475569]">
                    Restricts joining eligibility strictly to verified female travelers with privacy safeguards.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={womenOnly}
                  onChange={(e) => setWomenOnly(e.target.checked)}
                  className="w-5 h-5 rounded text-[#B85C38] focus:ring-[#B85C38] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14243A] mb-1">Room Rules & Etiquette</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Respect everyone's dietary choices. Punctual morning starts."
                  value={roomRules}
                  onChange={(e) => setRoomRules(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-[#14243A]"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E2D9C8]">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-xl bg-[#F7F4EC] text-[#14243A] border border-[#E2D9C8] text-xs font-bold hover:bg-[#EFE9DC] transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#14243A] hover:bg-[#B85C38] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-7 py-2.5 rounded-xl bg-[#174B37] hover:bg-[#138808] text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Publish Travel Room</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
