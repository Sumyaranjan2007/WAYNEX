'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  MapPin,
  Sparkles,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

// Security: only allow internal redirects
const ALLOWED_REDIRECT_PREFIXES = [
  '/',
  '/trips',
  '/connect',
  '/profile',
  '/safe',
  '/explore',
  '/destinations',
  '/assistant',
  '/transport',
  '/budget-planner',
  '/hotels',
  '/language',
];

function isAllowedRedirect(url: string): boolean {
  if (!url) return false;
  return ALLOWED_REDIRECT_PREFIXES.some(
    (prefix) =>
      url === prefix ||
      url.startsWith(prefix + '?') ||
      url.startsWith(prefix + '/')
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get('from') || '';

  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const redirectAfterLogin = () => {
    const target = isAllowedRedirect(fromPath) ? fromPath : '/';
    router.push(target);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    if (!email) { setLocalError('Please enter your email address'); return; }
    if (!password) { setLocalError('Please enter your password'); return; }
    const success = await login({ email, password });
    if (success) redirectAfterLogin();
  };

  const handleDemoLogin = async () => {
    clearError();
    setLocalError('');
    const success = await login({ email: 'explorer@waynex.in', password: 'demo' });
    if (success) redirectAfterLogin();
  };

  return (
    <div className="min-h-screen flex bg-[#F7F4EC]">

      {/* ── LEFT PANEL: India travel visual ── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative flex-col justify-between overflow-hidden bg-[#14243A]">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=1600&fit=crop')",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#14243A]/90 via-[#14243A]/60 to-[#B85C38]/30" />

        {/* Decorative saffron orb */}
        <div className="absolute top-20 right-10 w-56 h-56 rounded-full bg-[#FF9933]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-32 left-10 w-72 h-72 rounded-full bg-[#B85C38]/10 blur-3xl pointer-events-none" />

        {/* Top brand */}
        <div className="relative z-10 p-8 sm:p-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-[#B85C38] flex items-center justify-center shadow-lg shadow-[#B85C38]/30">
              <svg viewBox="0 0 64 64" fill="none" className="w-7 h-7">
                <path d="M 16 22 L 25 50 L 32 32 L 39 50 L 48 22" stroke="#FF9933" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <polygon points="32,10 35,28 29,28" fill="#138808" />
                <circle cx="32" cy="32" r="2.5" fill="#ffffff" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-black text-white tracking-wider">
                WAY<span className="text-[#FF9933]">NEX</span>
              </span>
              <div className="text-[9px] font-bold tracking-widest text-[#94A3B8] uppercase -mt-0.5">
                Explore India
              </div>
            </div>
          </Link>
        </div>

        {/* Middle content */}
        <div className="relative z-10 px-8 sm:px-10 py-6 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF9933]/20 border border-[#FF9933]/30 text-[#FF9933] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Travel
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Your India Journey
              <span className="block text-[#FF9933]">Starts Here.</span>
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-sm">
              Plan complete trips with AI, discover hidden gems across all 36 regions, and travel safely across incredible India.
            </p>
          </div>

          {/* Feature pills */}
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: Sparkles, label: 'AI Trip Planner', sub: '8-step intelligent planning', color: '#FF9933' },
              { icon: MapPin, label: '547 Destinations', sub: 'All 36 states & union territories', color: '#B85C38' },
              { icon: Users, label: 'Travel Together', sub: 'Create rooms, find companions', color: '#174B37' },
              { icon: ShieldCheck, label: 'WAYNEX Safe', sub: 'SOS, helplines & safety alerts', color: '#14243A' },
            ].map(({ icon: Icon, label, sub, color }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}25`, border: `1px solid ${color}40` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{label}</div>
                  <div className="text-[11px] text-[#94A3B8]">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 p-8 sm:p-10">
          <div className="border-l-2 border-[#FF9933] pl-4">
            <p className="text-sm text-white/80 italic leading-relaxed">
              &ldquo;Exploration is not a choice, it&rsquo;s an imperative.&rdquo;
            </p>
            <p className="text-xs text-[#FF9933] font-bold mt-1">— WAYNEX Travel Philosophy</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Login form ── */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-7">

          {/* Mobile brand (shown only on small screens) */}
          <div className="lg:hidden flex justify-center">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#14243A] flex items-center justify-center">
                <svg viewBox="0 0 64 64" fill="none" className="w-6 h-6">
                  <path d="M 16 22 L 25 50 L 32 32 L 39 50 L 48 22" stroke="#FF9933" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <polygon points="32,10 35,28 29,28" fill="#138808" />
                  <circle cx="32" cy="32" r="2.5" fill="#ffffff" />
                </svg>
              </div>
              <span className="text-2xl font-black text-[#14243A]">
                WAY<span className="text-[#B85C38]">NEX</span>
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black text-[#14243A] tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-[#64748B]">
              Sign in to your WAYNEX account to continue your journey
            </p>
            {fromPath && isAllowedRedirect(fromPath) && (
              <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-[#174B37]/10 border border-[#174B37]/20 text-[#174B37] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>You&apos;ll be taken to <strong>{fromPath}</strong> after signing in</span>
              </div>
            )}
          </div>

          {/* Error */}
          {(error || localError) && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
              <span className="mt-0.5">⚠</span>
              <span>{error || localError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#14243A] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 border-[#E2D9C8] text-[#14243A] text-sm placeholder-[#A8B8C0] focus:outline-none focus:border-[#B85C38] transition-colors shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#14243A] uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white border-2 border-[#E2D9C8] text-[#14243A] text-sm placeholder-[#A8B8C0] focus:outline-none focus:border-[#B85C38] transition-colors shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#B85C38] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[#64748B] font-medium">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#E2D9C8] accent-[#B85C38]"
                />
                <span>Remember me</span>
              </label>
              <Link
                href="#"
                className="text-[#B85C38] font-bold hover:text-[#9A4928] hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#B85C38] hover:bg-[#9A4928] active:scale-[0.98] text-white font-black text-sm shadow-lg shadow-[#B85C38]/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In to WAYNEX
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E2D9C8]" />
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest shrink-0">
              or
            </span>
            <div className="flex-1 h-px bg-[#E2D9C8]" />
          </div>

          {/* Demo Login */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#F7F4EC] hover:bg-[#EFE9DC] border-2 border-[#E2D9C8] hover:border-[#B85C38]/40 text-[#14243A] font-bold text-xs transition-all disabled:opacity-70"
          >
            <Sparkles className="w-4 h-4 text-[#FF9933]" />
            Continue as Demo Traveler
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-[#64748B]">
            New to WAYNEX?{' '}
            <Link
              href="/auth/register"
              className="text-[#B85C38] font-black hover:text-[#9A4928] hover:underline transition-colors"
            >
              Create a free account
            </Link>
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 pt-2 border-t border-[#E2D9C8]">
            {[
              { icon: ShieldCheck, label: 'Secure Login', color: '#174B37' },
              { icon: MapPin, label: '36 Regions', color: '#B85C38' },
              { icon: Users, label: 'Travellers', color: '#14243A' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="w-4 h-4" style={{ color }} />
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F4EC]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-[#B85C38] border-t-transparent animate-spin" />
            <span className="text-sm font-bold text-[#64748B]">Loading...</span>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
