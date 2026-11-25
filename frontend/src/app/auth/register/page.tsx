'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (!formData.email) {
      setLocalError('Please enter a valid email address');
      return;
    }
    if (!formData.firstName) {
      setLocalError('Please enter your first name');
      return;
    }

    const success = await registerUser({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      password: formData.password,
    });

    if (success) {
      router.push('/profile');
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-white border-2 border-[#E2D9C8] text-[#14243A] text-sm placeholder-[#A8B8C0] focus:outline-none focus:border-[#B85C38] transition-colors shadow-sm';
  const labelClass = 'block text-xs font-bold text-[#14243A] uppercase tracking-wider mb-1.5';

  return (
    <div className="min-h-screen flex bg-[#F7F4EC]">

      {/* ── LEFT PANEL: Brand visual ── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-2/5 relative flex-col justify-between overflow-hidden bg-[#14243A]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=1600&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#14243A]/95 via-[#14243A]/70 to-[#174B37]/30" />
        <div className="absolute top-20 right-10 w-56 h-56 rounded-full bg-[#FF9933]/10 blur-3xl pointer-events-none" />

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
        <div className="relative z-10 px-8 sm:px-10 py-6 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#174B37]/40 border border-[#174B37]/60 text-[#4ADE80] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Free Account
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Join 10,000+
              <span className="block text-[#FF9933]">India Travellers.</span>
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-sm">
              Save your trips, discover travel companions, and explore all 547 verified destinations across India with AI guidance.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            {[
              '✓  Save & resume your AI trip plans',
              '✓  Create & join travel rooms',
              '✓  SOS & emergency safety alerts',
              '✓  Personalised destination picks',
              '✓  Offline trip access',
            ].map((item) => (
              <div key={item} className="text-sm text-[#CBD5E1] font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 p-8 sm:p-10">
          <div className="border-l-2 border-[#174B37] pl-4">
            <p className="text-sm text-white/80 italic">
              &ldquo;The world is a book. Those who do not travel read only one page.&rdquo;
            </p>
            <p className="text-xs text-[#4ADE80] font-bold mt-1">— Saint Augustine</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Register form ── */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6">

          {/* Mobile brand */}
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
              Create Your Account
            </h1>
            <p className="text-sm text-[#64748B]">
              Join thousands exploring India with AI-powered travel planning
            </p>
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

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>First Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <input
                    name="firstName"
                    placeholder="Rohan"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input
                  name="lastName"
                  placeholder="Sharma"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  name="email"
                  type="email"
                  placeholder="rohan@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#174B37]" />
                <input
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                />
              </div>
              <p className="text-[11px] text-[#94A3B8] mt-1 ml-1">
                Used only for SOS emergency alerts — fully encrypted.
              </p>
            </div>

            {/* City + State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Home City</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B85C38]" />
                  <input
                    name="city"
                    placeholder="Bengaluru"
                    value={formData.city}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input
                  name="state"
                  placeholder="Karnataka"
                  value={formData.state}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Create Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputClass} pl-10 pr-11`}
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

            {/* Terms */}
            <p className="text-xs text-[#64748B] leading-relaxed">
              By creating an account, you agree to the{' '}
              <span className="text-[#B85C38] font-bold">WAYNEX Safety Guidelines</span> and{' '}
              <span className="text-[#B85C38] font-bold">Terms of Service</span>.
            </p>

            {/* Submit */}
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
                  Creating Account...
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Register &amp; Start Travelling
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-sm text-[#64748B]">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-[#B85C38] font-black hover:text-[#9A4928] hover:underline transition-colors"
            >
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
