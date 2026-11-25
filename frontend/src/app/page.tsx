'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Calculator,
  Users,
  ShieldCheck,
  Star,
  Clock,
  Search,
  Navigation,
  CheckCircle2,
  PhoneCall,
  Mountain,
  Palmtree,
  Landmark,
  Waves,
  TreePine,
  Sun,
  Flame,
  ChevronRight,
  Utensils,
  Train,
  Camera,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { MapContainer } from '@/components/map/MapContainer';
import { RobustImage } from '@/components/ui/RobustImage';
import { ALL_DESTINATIONS, getTrendingDestinations, getHiddenGems } from '@/data/destinations';
import { INDIAN_STATES } from '@/data/states';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetDays, setBudgetDays] = useState(3);
  const [budgetPerDay, setBudgetPerDay] = useState(2500);

  const trendingDestinations = getTrendingDestinations(6);
  const hiddenGems = getHiddenGems(4);
  const topFeaturedStates = INDIAN_STATES.slice(0, 8);

  // The 12 Curated Themed Collections
  const THEMED_COLLECTIONS = [
    {
      title: 'Himalayan Highs',
      subtitle: 'Snow peaks, alpine passes & cedar valleys',
      icon: Mountain,
      filterQuery: 'hill_station',
      count: '48 Destinations',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop',
      slug: 'himachal-pradesh',
    },
    {
      title: 'Royal Heritage & Forts',
      subtitle: 'Palaces, stepwells & imperial citadels',
      icon: Landmark,
      filterQuery: 'heritage_site',
      count: '65 Destinations',
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400&fit=crop',
      slug: 'rajasthan',
    },
    {
      title: 'Roaring Waterfalls',
      subtitle: 'Plunge pools, gorges & misty torrents',
      icon: Waves,
      filterQuery: 'waterfall',
      count: '28 Destinations',
      image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&h=400&fit=crop',
      slug: 'chhattisgarh',
    },
    {
      title: 'Coastal & Tropical Shores',
      subtitle: 'Golden beaches, lagoons & coral atolls',
      icon: Palmtree,
      filterQuery: 'beach',
      count: '54 Destinations',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
      slug: 'goa',
    },
    {
      title: 'Sacred Temples & Shrines',
      subtitle: 'Millennia-old sanctums & spiritual rituals',
      icon: Sparkles,
      filterQuery: 'temple',
      count: '62 Destinations',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop',
      slug: 'odisha',
    },
    {
      title: 'Untamed Wildlife & Tigers',
      subtitle: 'National parks, rhino plains & dense jungles',
      icon: TreePine,
      filterQuery: 'national_park',
      count: '38 Destinations',
      image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=600&h=400&fit=crop',
      slug: 'madhya-pradesh',
    },
    {
      title: 'Northeast Paradise',
      subtitle: 'Living root bridges, tea hills & tribal morungs',
      icon: Compass,
      filterQuery: 'all',
      count: '95 Destinations',
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=600&h=400&fit=crop',
      slug: 'meghalaya',
    },
    {
      title: 'Hidden Living Villages',
      subtitle: 'Sustainable communities & rural serenity',
      icon: MapPin,
      filterQuery: 'village',
      count: '24 Destinations',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
      slug: 'nagaland',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#F7F4EC] text-[#14243A] font-sans selection:bg-[#FF9933]/20">
      {/* SECTION 1: EDITORIAL HERO */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-[#EFE9DC]/60 via-[#F7F4EC] to-[#F7F4EC]">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#FF9933]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#B85C38]/5 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10 text-center max-w-5xl">
          {/* Saffron & Forest Green Identity Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2D9C8] text-xs sm:text-sm font-bold text-[#B85C38] shadow-xs mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-ping" />
            <span>INDIAN HERITAGE MEETS GLOBAL TRAVEL TECHNOLOGY</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#14243A] leading-[1.08] mb-6"
          >
            India Is Waiting.{' '}
            <span className="block sm:inline text-[#B85C38]">Find Your Way.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-[#475569] max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Explore 547 verified destinations across all 28 States and 8 Union Territories with authentic 3D geographical intelligence, rich local culture, and smart travel planning.
          </motion.p>

          {/* Prominent Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/destinations?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="relative flex items-center bg-white rounded-2xl border-2 border-[#E2D9C8] p-2 shadow-lg shadow-[#14243A]/5 focus-within:border-[#B85C38] transition-all"
            >
              <Search className="w-5 h-5 text-[#64748B] ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Where to? (e.g. Puri, Manali, Hampi, Munnar, Varanasi, Kaziranga)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-[#14243A] placeholder-[#64748B] focus:outline-none"
              />
              <Button type="submit" className="bg-[#B85C38] hover:bg-[#9A4928] text-white font-bold px-6 py-3 rounded-xl shrink-0 shadow-sm">
                Explore
              </Button>
            </form>

            {/* Quick Suggestion Chips */}
            <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-[#64748B] mt-3">
              <span className="font-bold">Popular:</span>
              {[
                { name: 'Puri, Odisha', slug: 'puri-odisha' },
                { name: 'Munnar, Kerala', slug: 'munnar-kerala' },
                { name: 'Hampi, Karnataka', slug: 'hampi-karnataka' },
                { name: 'Jaipur, Rajasthan', slug: 'jaipur-rajasthan' },
                { name: 'Manali, Himachal', slug: 'manali-himachal-pradesh' },
              ].map((chip) => (
                <Link
                  key={chip.slug}
                  href={`/destinations/${chip.slug}`}
                  className="px-2.5 py-1 rounded-full bg-white border border-[#E2D9C8] text-[#14243A] hover:border-[#B85C38] transition-colors"
                >
                  {chip.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link href="/explore">
              <Button size="lg" className="w-full sm:w-auto bg-[#14243A] hover:bg-[#1E334D] text-white px-8 py-4 rounded-xl font-bold shadow-md">
                <Compass className="w-5 h-5 mr-2 text-[#FF9933]" />
                Explore All 36 Regions
              </Button>
            </Link>
            <Link href="/budget-planner">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-[#14243A] text-[#14243A] hover:bg-[#EFE9DC] px-8 py-4 rounded-xl font-bold">
                <Calculator className="w-5 h-5 mr-2 text-[#B85C38]" />
                Calculate Trip Budget
              </Button>
            </Link>
          </motion.div>
        </Container>
      </section>

      {/* SECTION 2: 3D GEOGRAPHICAL INDIA EXPLORER */}
      <section className="py-16 bg-white border-y border-[#E2D9C8]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold text-[#B85C38] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-[#FF9933]" />
                Authentic Geographic Silhouette
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#14243A] tracking-tight">
                Interactive India 3D Explorer
              </h2>
              <p className="text-sm text-[#64748B] mt-1 max-w-xl">
                Inspect authentic boundaries of all 28 states and 8 union territories, complete with mainland, northeastern sister states, and islands.
              </p>
            </div>
            <Link href="/explore">
              <Button variant="outline" className="border-[#E2D9C8] text-[#14243A] hover:bg-[#F7F4EC]">
                View All State Slugs &rarr;
              </Button>
            </Link>
          </div>

          {/* Interactive Map Component Container */}
          <div className="rounded-2xl overflow-hidden border border-[#E2D9C8] shadow-sm bg-[#14243A] p-3">
            <MapContainer />
          </div>
        </Container>
      </section>

      {/* SECTION 3: FEATURED STATE DIRECTORY */}
      <section className="py-16 bg-[#F7F4EC]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold text-[#174B37] uppercase tracking-wider mb-1">
                36 States & Union Territories
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#14243A] tracking-tight">
                State & Regional Directory
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Every region contains complete academic history, climate profiles, transport routes, and verified attractions.
              </p>
            </div>
            <Link href="/explore">
              <Button variant="outline" className="border-[#E2D9C8] text-[#14243A] hover:bg-[#EFE9DC]">
                Browse All 36 Profiles &rarr;
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topFeaturedStates.map((st) => (
              <Link key={st.id} href={`/explore/${st.slug}`} className="group">
                <Card variant="interactive" className="h-full flex flex-col justify-between overflow-hidden bg-white border border-[#E2D9C8] shadow-sm hover:shadow-md transition-all">
                  <div className="relative h-44 w-full overflow-hidden bg-[#14243A]">
                    <RobustImage
                      src={st.image}
                      alt={st.name}
                      stateSlug={st.slug}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-white/90 text-[#14243A] font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                      {st.is_union_territory ? 'Union Territory' : 'State'}
                    </div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-xl font-black text-white group-hover:text-[#FF9933] transition-colors drop-shadow-sm">
                        {st.name}
                      </h3>
                      <div className="text-xs text-[#EFE9DC] flex items-center justify-between mt-0.5">
                        <span>Capital: {st.capital}</span>
                        <span className="font-bold text-[#FFD700]">★ {st.rating || 4.8}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                      {st.description}
                    </p>
                    <div className="pt-3 border-t border-[#E2D9C8] flex items-center justify-between text-xs">
                      <span className="text-[#64748B] font-medium">
                        {st.destination_count || 15} Destinations
                      </span>
                      <span className="text-[#B85C38] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                        Explore <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 4: THEMED TRAVEL COLLECTIONS */}
      <section className="py-16 bg-white border-y border-[#E2D9C8]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold text-[#B85C38] uppercase tracking-wider mb-2">
              Curated Thematic Discovery
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#14243A] tracking-tight">
              Explore by Travel Theme
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              Whether you yearn for snow-capped peaks, ancient stone temples, serene coastal backwaters, or spicy culinary trails, WAYNEX organizes India by theme.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {THEMED_COLLECTIONS.map((col, idx) => {
              const Icon = col.icon;
              return (
                <Link
                  key={idx}
                  href={`/destinations?category=${col.filterQuery}`}
                  className="group relative rounded-2xl overflow-hidden border border-[#E2D9C8] shadow-sm hover:shadow-md transition-all h-64 flex flex-col justify-end p-5 bg-[#14243A]"
                >
                  <RobustImage
                    src={col.image}
                    alt={col.title}
                    stateSlug={col.slug}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  <div className="relative z-10 space-y-1">
                    <div className="w-8 h-8 rounded-lg bg-[#FF9933] text-white flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#FF9933] transition-colors">
                      {col.title}
                    </h3>
                    <p className="text-xs text-[#EFE9DC] line-clamp-1">
                      {col.subtitle}
                    </p>
                    <div className="text-[11px] font-bold text-[#FFD700] pt-1">
                      {col.count} &rarr;
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* SECTION 5: TRENDING DESTINATIONS ACROSS INDIA */}
      <section className="py-16 bg-[#F7F4EC]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold text-[#FF9933] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> Trending Across India
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#14243A] tracking-tight">
                Top Traveler Favorites
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Hand-curated destinations celebrated for outstanding ratings, cultural heritage, and traveler experiences.
              </p>
            </div>
            <Link href="/destinations">
              <Button variant="outline" className="border-[#E2D9C8] text-[#14243A] hover:bg-[#EFE9DC]">
                View All 547 Destinations &rarr;
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingDestinations.map((dest) => (
              <Link key={dest.id} href={`/destinations/${dest.slug}`} className="group">
                <Card variant="interactive" className="h-full flex flex-col justify-between overflow-hidden bg-white border border-[#E2D9C8] shadow-sm hover:shadow-md transition-all">
                  <div className="relative h-52 w-full overflow-hidden bg-[#14243A]">
                    <RobustImage
                      src={dest.image}
                      alt={dest.name}
                      stateSlug={dest.state.slug}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#14243A] shadow-xs">
                        {dest.category.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 bg-black/60 text-[#FFD700] font-bold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {dest.rating}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-xl font-black text-white group-hover:text-[#FF9933] transition-colors drop-shadow-sm truncate">
                        {dest.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-[#EFE9DC]">
                        <MapPin className="w-3.5 h-3.5 text-[#FF9933] shrink-0" />
                        <span className="truncate">{dest.district ? `${dest.district}, ` : ''}{dest.state.name}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>

                    <div className="pt-3 border-t border-[#E2D9C8] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[#64748B]">Est. Daily:</span>{' '}
                        <span className="font-bold text-[#14243A]">
                          {formatCurrency(dest.estimated_budget_per_day)}
                        </span>
                      </div>
                      <span className="text-[#B85C38] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* SECTION 6: HERITAGE & CULTURE EDITORIAL */}
      <section className="py-20 bg-white border-y border-[#E2D9C8]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE9DC] text-[#B85C38] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
                Living Traditions & Craftsmanship
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-[#14243A] tracking-tight leading-tight">
                5,000 Years of Living Civilisation
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                India is not merely a geography; it is an uninterrupted cultural celebration. From the stone chariot wheels of Konark to the living root bridges of Meghalaya, from Odissi dance to Kashmiri Wazwan, WAYNEX connects you to authentic cultural roots.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#E2D9C8]">
                  <div className="text-2xl font-black text-[#B85C38]">42</div>
                  <div className="text-xs text-[#64748B] font-bold uppercase tracking-wider mt-0.5">
                    UNESCO World Heritage Sites
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#E2D9C8]">
                  <div className="text-2xl font-black text-[#174B37]">547+</div>
                  <div className="text-xs text-[#64748B] font-bold uppercase tracking-wider mt-0.5">
                    Verified Destinations
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/explore">
                  <Button className="bg-[#B85C38] hover:bg-[#9A4928] text-white font-bold px-6 py-3 rounded-xl">
                    Discover Indian Heritage &rarr;
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-56 rounded-2xl overflow-hidden shadow-sm border border-[#E2D9C8]">
                  <RobustImage
                    src="https://images.unsplash.com/photo-1596405539209-b64a60b131e4?w=600&h=600&fit=crop"
                    alt="Konark Sun Temple"
                    stateSlug="odisha"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-40 rounded-2xl overflow-hidden shadow-sm border border-[#E2D9C8]">
                  <RobustImage
                    src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop"
                    alt="Madurai Meenakshi Temple"
                    stateSlug="tamil-nadu"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-40 rounded-2xl overflow-hidden shadow-sm border border-[#E2D9C8]">
                  <RobustImage
                    src="https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=400&fit=crop"
                    alt="Hawa Mahal Jaipur"
                    stateSlug="rajasthan"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-56 rounded-2xl overflow-hidden shadow-sm border border-[#E2D9C8]">
                  <RobustImage
                    src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=600&fit=crop"
                    alt="Goa Heritage Church"
                    stateSlug="goa"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 7: SMART BUDGET PLANNER HIGHLIGHT */}
      <section className="py-16 bg-[#F7F4EC]">
        <Container>
          <div className="bg-white rounded-3xl border border-[#E2D9C8] p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE9DC] text-[#174B37] text-xs font-bold uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5" />
                Big Adventures. Smart Budgets.
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#14243A] tracking-tight">
                Plan Your Entire Trip Budget in Seconds
              </h2>
              <p className="text-sm text-[#475569] leading-relaxed">
                Estimate real-world costs for trains, state RTC buses, homestays, meals, and monument entry across all 36 Indian regions.
              </p>

              {/* Interactive Budget Preview Sliders */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#14243A] mb-1">
                    <span>Trip Duration: {budgetDays} Days</span>
                    <span className="text-[#B85C38]">Weekend / Short Trip</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={budgetDays}
                    onChange={(e) => setBudgetDays(Number(e.target.value))}
                    className="w-full accent-[#B85C38]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#14243A] mb-1">
                    <span>Daily Budget Per Person: {formatCurrency(budgetPerDay)}</span>
                    <span className="text-[#174B37]">Comfortable Standard</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="8000"
                    step="500"
                    value={budgetPerDay}
                    onChange={(e) => setBudgetPerDay(Number(e.target.value))}
                    className="w-full accent-[#B85C38]"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#F7F4EC] p-6 rounded-2xl border border-[#E2D9C8] space-y-4 text-center">
              <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Estimated Total Trip Cost
              </div>
              <div className="text-4xl font-black text-[#14243A]">
                {formatCurrency(budgetDays * budgetPerDay)}
              </div>
              <p className="text-xs text-[#64748B]">
                Includes lodging, local transit, meals, and sightseeing for 1 traveler.
              </p>
              <Link href={`/budget-planner?days=${budgetDays}&daily=${budgetPerDay}`} className="block">
                <Button className="w-full bg-[#14243A] hover:bg-[#1E334D] text-white font-bold py-3">
                  Open Complete Budget Breakdown &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION 8: WAYNEX SAFE & COMMUNITY */}
      <section className="py-16 bg-white border-t border-[#E2D9C8]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Safe Box */}
            <div className="p-8 rounded-3xl bg-[#F7F4EC] border border-[#E2D9C8] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#174B37] text-white">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#14243A]">WAYNEX Safe</h3>
                  <div className="text-xs text-[#174B37] font-semibold">Verified Safety Protocols & Helplines</div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Travel independently across India with complete peace of mind. Access national emergency helpline 112, women tourist safety 1091, and emergency location broadcast.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Link href="/safe">
                  <Button variant="outline" className="border-[#14243A] text-[#14243A] hover:bg-white font-bold text-xs">
                    Open Safety Center
                  </Button>
                </Link>
                <span className="text-xs font-bold text-[#14243A]">National Helpline: 112</span>
              </div>
            </div>

            {/* Travel Room Box */}
            <div className="p-8 rounded-3xl bg-[#F7F4EC] border border-[#E2D9C8] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#B85C38] text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#14243A]">Travel Together</h3>
                  <div className="text-xs text-[#B85C38] font-semibold">Connect with Verified Companions</div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Create or join community travel rooms for trekking in Himachal, exploring temple circuits in Odisha, or sharing houseboats in Kerala. Split costs and make lifelong memories.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Link href="/connect">
                  <Button className="bg-[#B85C38] hover:bg-[#9A4928] text-white font-bold text-xs">
                    Browse Travel Rooms
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
