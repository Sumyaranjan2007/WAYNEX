'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Home,
  Compass,
  MapPin,
  Calculator,
  Train,
  Users,
  Bot,
  ShieldAlert,
  User,
  LogIn,
  Languages,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();

  const menuItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Explore India', href: '/explore', icon: Compass },
    { label: 'Destinations', href: '/destinations', icon: MapPin },
    { label: 'AI Budget Planner', href: '/budget-planner', icon: Calculator },
    { label: 'Transport & Routes', href: '/transport', icon: Train },
    { label: 'Connect (Travel Rooms)', href: '/connect', icon: Users },
    { label: 'AI Travel Assistant', href: '/assistant', icon: Bot },
    { label: 'Language Assistant', href: '/language', icon: Languages },
    { label: 'My Trips', href: '/trips', icon: Briefcase },
    { label: 'WAYNEX Safe & SOS', href: '/safe', icon: ShieldAlert, highlight: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm"
          />

          {/* Slide-out Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-navy-900 border-l border-navy-700/80 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-navy-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl font-black text-white">
                    WAY<span className="text-cyan-400">NEX</span>
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-navy-400 hover:text-white hover:bg-navy-800"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SOS Quick Banner */}
              <div className="my-5">
                <Link
                  href="/safe"
                  onClick={onClose}
                  className="flex items-center justify-between p-3.5 bg-sos-600/20 border border-sos-600/50 rounded-xl text-red-200 hover:bg-sos-600/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6 text-sos-500 animate-pulse" />
                    <div>
                      <div className="text-sm font-bold text-white">Emergency Assistance</div>
                      <div className="text-xs text-red-300">Police, Ambulance, 112 Helpline</div>
                    </div>
                  </div>
                  <span className="bg-sos-600 text-white text-xs font-black px-2.5 py-1 rounded-md">
                    SOS
                  </span>
                </Link>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-cyan-500 text-navy-950 shadow-md shadow-cyan-500/20'
                          : 'text-navy-200 hover:text-white hover:bg-navy-800/60'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-navy-950' : 'text-cyan-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Auth Section */}
            <div className="pt-6 border-t border-navy-800 mt-6">
              {isAuthenticated && user ? (
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 bg-navy-800/60 rounded-xl hover:bg-navy-800 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center font-bold text-cyan-300">
                      {user.first_name ? user.first_name[0] : user.username[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">
                        {user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.username}
                      </div>
                      <div className="text-xs text-navy-400 truncate">{user.email}</div>
                    </div>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                  >
                    Log Out
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/auth/login" onClick={onClose}>
                    <Button variant="outline" size="md" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={onClose}>
                    <Button variant="primary" size="md" className="w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
