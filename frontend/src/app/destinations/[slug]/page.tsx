'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Star,
  Calendar,
  Clock,
  Ticket,
  Plane,
  Train,
  Car,
  Utensils,
  Sun,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Bookmark,
  BookmarkCheck,
  Navigation,
  Sparkles,
  ExternalLink,
  Video,
  Info,
  PhoneCall,
  ChevronRight,
  Compass,
  Bus,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RobustImage } from '@/components/ui/RobustImage';
import { getDestinationBySlug, getDestinationsByState } from '@/data/destinations';
import { formatCurrency } from '@/lib/utils';

interface DestinationPageProps {
  params: {
    slug: string;
  };
}

export default function DestinationDetailPage({ params }: DestinationPageProps) {
  const { slug } = params;
  const destination = getDestinationBySlug(slug);
  const [activeTab, setActiveTab] = useState<'overview' | 'attractions' | 'reach' | 'food' | 'safety'>('overview');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  // Check saved state in localStorage
  useEffect(() => {
    if (destination) {
      try {
        const savedTrips = JSON.parse(localStorage.getItem('waynex_saved_trips') || '[]');
        setIsSaved(savedTrips.includes(destination.slug));
      } catch (e) {
        // Ignore localStorage error
      }
    }
  }, [destination]);

  const toggleSaveTrip = () => {
    if (!destination) return;
    try {
      const savedTrips = JSON.parse(localStorage.getItem('waynex_saved_trips') || '[]');
      let updated: string[];
      if (isSaved) {
        updated = savedTrips.filter((s: string) => s !== destination.slug);
        setIsSaved(false);
        showToast(`Removed ${destination.name} from My Trips`);
      } else {
        updated = [...savedTrips, destination.slug];
        setIsSaved(true);
        showToast(`Added ${destination.name} to My Trips!`);
      }
      localStorage.setItem('waynex_saved_trips', JSON.stringify(updated));
    } catch (e) {
      setIsSaved(!isSaved);
    }
  };

  const handleShare = async () => {
    if (!destination) return;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${destination.name} - WAYNEX India Travel Guide`,
          text: `Discover ${destination.name} in ${destination.state.name} on WAYNEX.`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!destination) {
    return (
      <div className="min-h-screen bg-[#F7F4EC] text-[#14243A] flex flex-col items-center justify-center p-4">
        <MapPin className="w-16 h-16 text-[#B85C38] mb-4 animate-bounce" />
        <h1 className="text-3xl font-black mb-2">Destination Not Found</h1>
        <p className="text-[#64748B] mb-6">
          Could not locate a destination matching &quot;{slug}&quot;.
        </p>
        <Link href="/destinations">
          <Button variant="primary">Browse All Destinations</Button>
        </Link>
      </div>
    );
  }

  // Related destinations in the same state
  const relatedDestinations = getDestinationsByState(destination.state.slug)
    .filter((d) => d.slug !== destination.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#14243A] pb-24 font-sans selection:bg-[#FF9933]/20 selection:text-[#14243A]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14243A] text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 border border-white/20 animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#FF9933]" />
          {toastMessage}
        </div>
      )}

      {/* Breadcrumbs Bar */}
      <div className="bg-[#EFE9DC]/70 border-b border-[#E2D9C8] text-xs py-2.5 px-4 sm:px-6">
        <Container>
          <div className="flex items-center gap-1.5 flex-wrap text-[#64748B]">
            <Link href="/" className="hover:text-[#B85C38] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#A39B8B]" />
            <Link href="/explore" className="hover:text-[#B85C38] transition-colors">States of India</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#A39B8B]" />
            <Link href={`/explore/${destination.state.slug}`} className="hover:text-[#B85C38] transition-colors font-medium">
              {destination.state.name}
            </Link>
            {destination.district && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#A39B8B]" />
                <span>{destination.district}</span>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-[#A39B8B]" />
            <span className="text-[#14243A] font-bold">{destination.name}</span>
          </div>
        </Container>
      </div>

      {/* Hero Banner Section */}
      <div className="relative h-[480px] sm:h-[560px] w-full overflow-hidden bg-[#14243A]">
        <RobustImage
          src={destination.image}
          alt={destination.name}
          stateSlug={destination.state.slug}
          className="w-full h-full object-cover"
        />
        {/* Subtle multi-layer gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14243A] via-[#14243A]/60 to-black/30" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end">
          <Container className="pb-10">
            <div className="flex items-center justify-between gap-4 mb-3">
              <Link
                href={`/explore/${destination.state.slug}`}
                className="inline-flex items-center gap-1.5 text-xs text-[#EFE9DC] hover:text-white font-medium bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Explore {destination.state.name}
              </Link>

              {/* Action Icons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSaveTrip}
                  title={isSaved ? 'Remove from My Trips' : 'Save to My Trips'}
                  className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                    isSaved
                      ? 'bg-[#FF9933] text-white border-[#FF9933]'
                      : 'bg-black/40 hover:bg-black/60 text-white border-white/20'
                  }`}
                >
                  {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleShare}
                  title="Share Destination"
                  className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#B85C38] text-white shadow-sm">
                {destination.category.replace('_', ' ')}
              </span>
              {destination.is_trending && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF9933] text-white flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3" /> Trending
                </span>
              )}
              {destination.is_hidden_gem && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#174B37] text-white shadow-sm">
                  Hidden Gem
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md mb-3">
              {destination.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#EFE9DC]">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-[#FF9933]" />
                {destination.district ? `${destination.district}, ` : ''}{destination.state.name}
              </span>
              <span className="flex items-center gap-1 font-bold text-[#FFD700]">
                <Star className="w-4 h-4 fill-current" />
                {destination.rating} ({destination.review_count} traveler reviews)
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-full font-semibold border border-white/15 backdrop-blur-sm">
                Est. {formatCurrency(destination.estimated_budget_per_day)} / day
              </span>
            </div>
          </Container>
        </div>
      </div>

      {/* Quick Facts Strip */}
      <div className="bg-[#EFE9DC] border-b border-[#E2D9C8] py-4">
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white shadow-sm text-[#B85C38]">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-[#64748B] uppercase font-bold tracking-wider">Best Season</div>
                <div className="font-bold text-[#14243A] truncate">{destination.best_time_to_visit}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white shadow-sm text-[#174B37]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-[#64748B] uppercase font-bold tracking-wider">Ideal Duration</div>
                <div className="font-bold text-[#14243A]">2 - 3 Days</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white shadow-sm text-[#FF9933]">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-[#64748B] uppercase font-bold tracking-wider">Entry Fee</div>
                <div className="font-bold text-[#14243A]">Free / Nominal</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white shadow-sm text-[#14243A]">
                <Train className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-[#64748B] uppercase font-bold tracking-wider">Transit Rail</div>
                <div className="font-bold text-[#14243A] truncate">{destination.how_to_reach?.train || 'Connected'}</div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white shadow-sm text-[#B85C38]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-[#64748B] uppercase font-bold tracking-wider">Emergency Help</div>
                <div className="font-bold text-[#14243A]">National: 112</div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2D9C8] shadow-sm">
        <Container>
          <div className="flex overflow-x-auto space-x-8 py-3.5 scrollbar-none text-sm font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap pb-1 border-b-2 transition-all ${
                activeTab === 'overview'
                  ? 'text-[#B85C38] border-[#B85C38]'
                  : 'text-[#64748B] border-transparent hover:text-[#14243A]'
              }`}
            >
              Overview & Highlights
            </button>
            <button
              onClick={() => setActiveTab('attractions')}
              className={`whitespace-nowrap pb-1 border-b-2 transition-all ${
                activeTab === 'attractions'
                  ? 'text-[#B85C38] border-[#B85C38]'
                  : 'text-[#64748B] border-transparent hover:text-[#14243A]'
              }`}
            >
              Top Attractions ({destination.highlights.length})
            </button>
            <button
              onClick={() => setActiveTab('reach')}
              className={`whitespace-nowrap pb-1 border-b-2 transition-all ${
                activeTab === 'reach'
                  ? 'text-[#B85C38] border-[#B85C38]'
                  : 'text-[#64748B] border-transparent hover:text-[#14243A]'
              }`}
            >
              How to Reach & Transit
            </button>
            <button
              onClick={() => setActiveTab('food')}
              className={`whitespace-nowrap pb-1 border-b-2 transition-all ${
                activeTab === 'food'
                  ? 'text-[#B85C38] border-[#B85C38]'
                  : 'text-[#64748B] border-transparent hover:text-[#14243A]'
              }`}
            >
              Local Food & Culture
            </button>
            <button
              onClick={() => setActiveTab('safety')}
              className={`whitespace-nowrap pb-1 border-b-2 transition-all ${
                activeTab === 'safety'
                  ? 'text-[#B85C38] border-[#B85C38]'
                  : 'text-[#64748B] border-transparent hover:text-[#14243A]'
              }`}
            >
              Travel Safety & Contacts
            </button>
          </div>
        </Container>
      </div>

      {/* Main Tab Content */}
      <Container className="pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {/* Description Card */}
                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9C8] shadow-sm space-y-4">
                  <h2 className="text-2xl font-black text-[#14243A]">About {destination.name}</h2>
                  <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                    {destination.description}
                  </p>

                  {destination.why_famous && (
                    <div className="p-4 rounded-xl bg-[#F7F4EC] border-l-4 border-[#B85C38] space-y-1">
                      <div className="text-xs font-bold text-[#B85C38] uppercase tracking-wider">
                        Why It Is Famous
                      </div>
                      <p className="text-sm text-[#14243A] font-medium leading-relaxed italic">
                        &quot;{destination.why_famous}&quot;
                      </p>
                    </div>
                  )}
                </div>

                {/* Highlights Grid */}
                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9C8] shadow-sm">
                  <h3 className="text-xl font-bold text-[#14243A] mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#FF9933]" />
                    Key Experiences & Highlights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {destination.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F4EC] border border-[#E2D9C8]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#174B37] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-[#14243A] font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Local Food Snapshot */}
                {destination.local_food && destination.local_food.length > 0 && (
                  <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9C8] shadow-sm">
                    <h3 className="text-xl font-bold text-[#14243A] mb-3 flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-[#B85C38]" />
                      Authentic Local Specialties
                    </h3>
                    <p className="text-xs text-[#64748B] mb-4">
                      Signature dishes and authentic culinary traditions to experience when visiting {destination.name}:
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {destination.local_food.map((food, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-xs sm:text-sm font-semibold text-[#14243A] shadow-2xs hover:border-[#B85C38] transition-colors"
                        >
                          🍲 {food}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Attractions */}
            {activeTab === 'attractions' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9C8] shadow-sm">
                  <h2 className="text-2xl font-black text-[#14243A] mb-2">
                    Must-Visit Sites in {destination.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748B] mb-6">
                    Curated list of key attractions, architectural landmarks, and natural marvels.
                  </p>

                  <div className="space-y-4">
                    {destination.highlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[#F7F4EC] border border-[#E2D9C8] hover:border-[#B85C38] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="w-8 h-8 rounded-xl bg-[#14243A] text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-[#14243A]">{item}</h4>
                            <p className="text-xs text-[#64748B] mt-0.5">
                              Recommended visit: 1.5 - 2.5 hours • Open daily
                            </p>
                          </div>
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${item}, ${destination.name}, ${destination.state.name}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B85C38] hover:text-[#9A4928] bg-white px-3 py-2 rounded-xl border border-[#E2D9C8] shrink-0"
                        >
                          <Navigation className="w-3.5 h-3.5" /> Navigate on Maps
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: How to Reach */}
            {activeTab === 'reach' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9C8] shadow-sm space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-[#14243A] mb-1">
                      Transport & Connectivity
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B]">
                      Verified railway stations, airport gateways, and road networks for {destination.name}.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Air */}
                    <div className="p-5 rounded-2xl bg-[#F7F4EC] border border-[#E2D9C8] flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-white text-[#B85C38] shadow-sm shrink-0">
                        <Plane className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#14243A] mb-1">By Air</h4>
                        <p className="text-sm text-[#475569] leading-relaxed">
                          {destination.how_to_reach?.air || 'Nearest regional domestic and international airport connections.'}
                        </p>
                      </div>
                    </div>

                    {/* Train */}
                    <div className="p-5 rounded-2xl bg-[#F7F4EC] border border-[#E2D9C8] flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-white text-[#14243A] shadow-sm shrink-0">
                        <Train className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#14243A] mb-1">By Train (Indian Railways)</h4>
                        <p className="text-sm text-[#475569] leading-relaxed">
                          {destination.how_to_reach?.train || 'Frequent superfast and express trains connect to the nearest railhead.'}
                        </p>
                      </div>
                    </div>

                    {/* Road */}
                    <div className="p-5 rounded-2xl bg-[#F7F4EC] border border-[#E2D9C8] flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-white text-[#174B37] shadow-sm shrink-0">
                        <Bus className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#14243A] mb-1">By Bus & Road</h4>
                        <p className="text-sm text-[#475569] leading-relaxed">
                          {destination.how_to_reach?.road || 'Regular State Road Transport Corporation (RTC) buses and private coaches.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Last Mile Advice */}
                  <div className="p-5 rounded-2xl bg-[#EFE9DC] border border-[#E2D9C8] space-y-1.5">
                    <div className="text-xs font-bold text-[#14243A] uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#B85C38]" /> Last-Mile Transit Tip
                    </div>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      Pre-paid auto-rickshaws, app cabs, and shared jeeps operate actively from the main railway junction and bus station. Always insist on metered fares or agree on fixed rates beforehand.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Food & Culture */}
            {activeTab === 'food' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9C8] shadow-sm space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-[#14243A] mb-1">
                      Local Cuisine & Food Guide
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B]">
                      Every region in India has an extraordinary culinary signature. Here is what to eat in {destination.name}.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {destination.local_food?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[#F7F4EC] border border-[#E2D9C8] space-y-2"
                      >
                        <div className="text-2xl">🍲</div>
                        <h4 className="text-base font-bold text-[#14243A]">{item}</h4>
                        <p className="text-xs text-[#64748B] leading-relaxed">
                          Prepared with authentic regional herbs and spices. Available at traditional bazaars and local eateries.
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F7F4EC] border-l-4 border-[#174B37] space-y-1">
                    <div className="text-xs font-bold text-[#174B37] uppercase tracking-wider">
                      Cultural Heritage
                    </div>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      {destination.culture || `Deeply rooted in traditional ${destination.state.name} arts, indigenous festivals, and hospitality.`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Safety */}
            {activeTab === 'safety' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D9C8] shadow-sm space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-[#14243A] mb-1">
                      Traveler Safety & Emergency Assistance
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B]">
                      WAYNEX Safe: essential emergency contacts and safety advisories for {destination.name}.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-center">
                      <PhoneCall className="w-5 h-5 text-[#B85C38] mx-auto mb-1.5" />
                      <div className="text-xs text-[#64748B] uppercase font-bold">National Emergency</div>
                      <div className="text-xl font-black text-[#14243A] mt-0.5">112</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-center">
                      <ShieldCheck className="w-5 h-5 text-[#174B37] mx-auto mb-1.5" />
                      <div className="text-xs text-[#64748B] uppercase font-bold">Tourist Police</div>
                      <div className="text-xl font-black text-[#14243A] mt-0.5">1363</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#E2D9C8] text-center">
                      <PhoneCall className="w-5 h-5 text-[#FF9933] mx-auto mb-1.5" />
                      <div className="text-xs text-[#64748B] uppercase font-bold">Ambulance</div>
                      <div className="text-xl font-black text-[#14243A] mt-0.5">108</div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#EFE9DC] border border-[#E2D9C8] space-y-2">
                    <h4 className="text-sm font-bold text-[#14243A] flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#B85C38]" /> Safe Travel Tips
                    </h4>
                    <ul className="text-xs text-[#475569] space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>Drink sealed bottled or filtered water; avoid unboiled tap water.</li>
                      <li>Dress respectfully when visiting ancient temple shrines and sacred religious monuments.</li>
                      <li>In remote forested or high-altitude mountain areas, register with local checkpoints and travel with licensed guides.</li>
                      <li>Keep emergency helpline 112 bookmarked on your mobile device.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Action Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2D9C8] shadow-sm space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[#B85C38]">
                Interactive Trip Planner
              </div>

              <div className="text-2xl font-black text-[#14243A]">
                {formatCurrency(destination.estimated_budget_per_day)}
                <span className="text-xs font-medium text-[#64748B]"> / day (avg)</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <Link href={`/budget-planner?dest=${destination.slug}`} className="block">
                  <Button variant="primary" size="lg" className="w-full bg-[#B85C38] hover:bg-[#9A4928] text-white">
                    <Sparkles className="w-4 h-4 mr-2" /> Plan with AI Trip Planner
                  </Button>
                </Link>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" size="lg" className="w-full border-[#14243A] text-[#14243A] hover:bg-[#EFE9DC]">
                    <Navigation className="w-4 h-4 mr-2 text-[#B85C38]" /> Explore Coordinates on Map
                  </Button>
                </a>

                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="w-full py-3 px-4 rounded-xl border border-[#E2D9C8] text-xs font-bold text-[#14243A] hover:bg-[#F7F4EC] transition-colors flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4 text-[#FF9933]" /> Watch Travel Experience Guide
                </button>

                <Link href={`/connect?dest=${destination.slug}`} className="block">
                  <button className="w-full py-3 px-4 rounded-xl bg-[#EFE9DC] text-xs font-bold text-[#14243A] hover:bg-[#E2D9C8] transition-colors flex items-center justify-center gap-2">
                    👥 Connect with Traveling Companions
                  </button>
                </Link>
              </div>
            </div>

            {/* Weather & Location Snapshot */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2D9C8] shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-[#14243A] uppercase tracking-wider">
                Geographical Coordinates
              </h4>
              <div className="text-xs font-mono text-[#64748B] bg-[#F7F4EC] p-3 rounded-xl border border-[#E2D9C8] space-y-1">
                <div>Latitude: <span className="font-bold text-[#14243A]">{destination.latitude}° N</span></div>
                <div>Longitude: <span className="font-bold text-[#14243A]">{destination.longitude}° E</span></div>
                <div>Region: <span className="font-bold text-[#14243A]">{destination.state.name}</span></div>
              </div>
            </div>

            {/* Related Destinations */}
            {relatedDestinations.length > 0 && (
              <div className="p-6 rounded-2xl bg-white border border-[#E2D9C8] shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-[#14243A] uppercase tracking-wider">
                  More in {destination.state.name}
                </h4>
                <div className="space-y-3">
                  {relatedDestinations.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/destinations/${rel.slug}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F7F4EC] transition-colors group"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-[#E2D9C8]">
                        <RobustImage
                          src={rel.image}
                          alt={rel.name}
                          stateSlug={rel.state.slug}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-[#14243A] truncate group-hover:text-[#B85C38] transition-colors">
                          {rel.name}
                        </div>
                        <div className="text-xs text-[#64748B] flex items-center gap-2 mt-0.5">
                          <span className="capitalize">{rel.category.replace('_', ' ')}</span>
                          <span>•</span>
                          <span className="text-[#FF9933] font-semibold">★ {rel.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Video Modal Placeholder */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#14243A] text-white p-6 sm:p-8 rounded-2xl max-w-xl w-full border border-white/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Video className="w-5 h-5 text-[#FF9933]" />
                {destination.name} Video Experience
              </h3>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-white/60 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/60 flex flex-col items-center justify-center p-6 text-center border border-white/10">
              <Video className="w-12 h-12 text-[#FF9933] mb-3 animate-pulse" />
              <div className="text-sm font-bold text-white mb-1">
                Curated Travel Documentary & Drone Tour
              </div>
              <p className="text-xs text-[#A39B8B] mb-4">
                Watch immersive 4K cinematic footage of {destination.name}, {destination.state.name}.
              </p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  `${destination.name} ${destination.state.name} tourism travel guide 4k`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF0000] text-white font-bold text-xs hover:bg-[#CC0000] transition-colors"
              >
                Open on YouTube <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-xs text-[#A39B8B] text-center">
              Official tourism documentaries, cultural dances, and walking guides from verified creators.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
