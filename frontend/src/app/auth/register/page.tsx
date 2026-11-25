'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, MapPin, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
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

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-navy-radial">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-navy-800 border border-cyan-500/40 flex items-center justify-center p-1 shadow-glow-cyan">
              <Compass className="w-6 h-6 text-cyan-400 group-hover:rotate-45 transition-transform" />
            </div>
            <span className="text-2xl font-black text-white">
              WAY<span className="text-cyan-400">NEX</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-navy-300">
            Join thousands exploring India with AI-powered discovery and verified safety
          </p>
        </div>

        {/* Register Card */}
        <Card variant="glass" className="p-6 sm:p-8 space-y-6">
          {(error || localError) && (
            <div className="p-3.5 rounded-xl bg-sos-600/20 border border-sos-600/50 text-red-300 text-xs font-semibold">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                name="firstName"
                placeholder="Rohan"
                value={formData.firstName}
                onChange={handleChange}
                leftIcon={<User className="w-4 h-4" />}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                placeholder="Sharma"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="rohan@example.com"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Mobile Number (For SOS Alerts)"
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              leftIcon={<Phone className="w-4 h-4 text-emerald-400" />}
              helperText="Encrypted and used exclusively for emergency contact broadcasting."
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Home City"
                name="city"
                placeholder="Bengaluru"
                value={formData.city}
                onChange={handleChange}
                leftIcon={<MapPin className="w-4 h-4" />}
              />
              <Input
                label="State"
                name="state"
                placeholder="Karnataka"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <Input
              label="Create Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="text-xs text-navy-400 pt-1">
              By creating an account, you agree to the WAYNEX Safety Guidelines and Terms of Service.
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full font-bold shadow-md shadow-cyan-500/20 mt-2"
              isLoading={isLoading}
            >
              Register & Start Traveling
            </Button>
          </form>
        </Card>

        {/* Footer Link */}
        <p className="text-center text-xs text-navy-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-cyan-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
