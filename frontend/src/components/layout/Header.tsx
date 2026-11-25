'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  MapPin,
  Calculator,
  Train,
  Users,
  Search,
  Menu,
  X,
  User as UserIcon,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { MobileNav } from './MobileNav';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  const navLinks = [
    { label: 'Explore', href: '/explore' },
    { label: 'Destinations', href: '/destinations' },
    { label: 'Plan Trip', href: '/trips' },
    { label: 'Transport', href: '/transport' },
    { label: 'Connect', href: '/connect' },
    { label: 'AI Assistant', href: '/assistant', icon: Sparkles },
    { label: 'Safe', href: '/safe', icon: ShieldCheck },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#F7F4EC]/95 backdrop-blur-md border-b border-[#E2D9C8] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-10 h-10 rounded-xl bg-[#14243A] border border-[#B85C38]/40 flex items-center justify-center p-1.5 shadow-md shadow-[#14243A]/10 group-hover:border-[#B85C38] transition-colors">
              <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                <circle cx="32" cy="32" r="28" stroke="#B85C38" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="3 3" />
                <path d="M 16 22 L 25 50 L 32 32 L 39 50 L 48 22" stroke="#FF9933" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <polygon points="32,10 35,28 29,28" fill="#138808" />
                <circle cx="32" cy="32" r="2.5" fill="#ffffff" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-wider text-[#14243A]">
                WAY<span className="text-[#B85C38]">NEX</span>
              </span>
              <span className="text-[9px] font-bold tracking-widest text-[#64748B] uppercase -mt-1 hidden sm:block">
                EXPLORE INDIA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#EFE9DC]/80 p-1.5 rounded-full border border-[#E2D9C8] shadow-2xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full transition-all duration-200',
                    isActive
                      ? 'bg-[#B85C38] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#14243A] hover:bg-[#E2D9C8]/60'
                  )}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Area: Search, Safe, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Shortcut */}
            <Link
              href="/destinations"
              className="p-2 sm:p-2.5 rounded-xl text-[#64748B] hover:text-[#B85C38] hover:bg-[#EFE9DC] transition-colors"
              title="Search destinations across India"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            {/* Emergency Safe Quick Pill */}
            <Link
              href="/safe"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EFE9DC] hover:bg-[#E2D9C8] border border-[#E2D9C8] text-[#14243A] text-xs font-bold transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#174B37]" />
              <span>Safe 112</span>
            </Link>

            {/* Auth / Profile */}
            {isAuthenticated ? (
              <Link href="/profile">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex border-[#E2D9C8] text-[#14243A] hover:bg-[#EFE9DC]">
                  <UserIcon className="w-3.5 h-3.5 mr-1 text-[#B85C38]" />
                  <span>{user?.first_name || 'My Profile'}</span>
                </Button>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-[#14243A] hover:bg-[#EFE9DC] font-bold">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-[#B85C38] hover:bg-[#9A4928] text-white font-bold">
                    Join WAYNEX
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden p-2 rounded-xl text-[#14243A] hover:bg-[#EFE9DC] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
