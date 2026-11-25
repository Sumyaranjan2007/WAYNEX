import React from 'react';
import Link from 'next/link';
import {
  Compass,
  PhoneCall,
  ShieldCheck,
  Heart,
  Globe2,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#14243A] border-t border-[#243750] text-[#A3B2C6] relative z-10 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#243750]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-[#B85C38]/40 flex items-center justify-center p-1.5 shadow-md">
                <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                  <path d="M 16 22 L 25 50 L 32 32 L 39 50 L 48 22" stroke="#FF9933" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <polygon points="32,10 35,28 29,28" fill="#138808" />
                  <circle cx="32" cy="32" r="2.5" fill="#ffffff" />
                </svg>
              </div>
              <span className="text-2xl font-black text-white tracking-wider">
                WAY<span className="text-[#FF9933]">NEX</span>
              </span>
            </Link>
            <p className="text-sm text-[#A3B2C6] leading-relaxed max-w-sm">
              India Is Waiting. Find Your Way. Discover India&apos;s rich cultural heritage, 500+ verified destinations across all 36 States & UTs, smart transport routes, and AI budget planning.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#174B37]/60 text-emerald-300 border border-[#174B37]">
                <ShieldCheck className="w-3.5 h-3.5" /> Responsible India Tourism
              </span>
            </div>
          </div>

          {/* Col 1: Explore Regions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore India
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/explore" className="hover:text-[#FF9933] transition-colors">
                  All 36 States & UTs
                </Link>
              </li>
              <li>
                <Link href="/explore/odisha" className="hover:text-[#FF9933] transition-colors">
                  Odisha (Puri & Konark)
                </Link>
              </li>
              <li>
                <Link href="/explore/kerala" className="hover:text-[#FF9933] transition-colors">
                  Kerala Backwaters
                </Link>
              </li>
              <li>
                <Link href="/explore/rajasthan" className="hover:text-[#FF9933] transition-colors">
                  Rajasthan Forts & Palaces
                </Link>
              </li>
              <li>
                <Link href="/explore/himachal-pradesh" className="hover:text-[#FF9933] transition-colors">
                  Himachal Peaks & Valleys
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-[#FF9933] transition-colors">
                  500+ Verified Destinations
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Travel Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Travel Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/budget-planner" className="hover:text-[#FF9933] transition-colors">
                  AI Budget Calculator
                </Link>
              </li>
              <li>
                <Link href="/transport" className="hover:text-[#FF9933] transition-colors">
                  Transport & Railways
                </Link>
              </li>
              <li>
                <Link href="/connect" className="hover:text-[#FF9933] transition-colors">
                  Find Travel Companions
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-[#FF9933] transition-colors flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" /> AI Trip Assistant
                </Link>
              </li>
              <li>
                <Link href="/completeness" className="hover:text-[#FF9933] transition-colors">
                  Data Registry & Coverage
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Safety & Emergency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF9933] mb-4 flex items-center gap-1.5">
              <span>WAYNEX Safe</span>
            </h4>
            <div className="bg-[#1E334D] border border-[#2B4668] p-3.5 rounded-xl space-y-2">
              <div className="text-xs font-bold text-emerald-300">National Emergency Helpline</div>
              <div className="text-2xl font-black text-white tracking-wide">112</div>
              <div className="text-[11px] text-[#A3B2C6]">Toll-free 24x7 Pan-India Service</div>
            </div>
            <ul className="space-y-2 text-xs text-[#A3B2C6] mt-3">
              <li>Women Helpline: 1091</li>
              <li>Tourist Helpline: 1363</li>
              <li>
                <Link href="/safe" className="text-[#FF9933] hover:underline font-bold">
                  Open Safe Dashboard &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3B2C6]">
          <div>
            &copy; {new Date().getFullYear()} WAYNEX. Indian Heritage Meets Global Travel Technology.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/explore" className="hover:text-white transition-colors">
              Explore 36 Regions
            </Link>
            <Link href="/destinations" className="hover:text-white transition-colors">
              547 Destinations
            </Link>
            <Link href="/safe" className="hover:text-white transition-colors">
              Safety Intelligence
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
