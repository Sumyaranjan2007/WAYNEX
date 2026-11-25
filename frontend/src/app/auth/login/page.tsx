'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuthStore } from '@/store/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (!email) {
      setLocalError('Please enter your email address');
      return;
    }

    const success = await login({ email, password });
    if (success) {
      router.push('/profile');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('explorer@waynex.in');
    setPassword('demo1234');
    const success = await login({ email: 'explorer@waynex.in', password: 'demo' });
    if (success) {
      router.push('/profile');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-navy-radial">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
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
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-navy-300">
            Sign in to access your saved trips, travel rooms, and safety settings
          </p>
        </div>

        {/* Login Card */}
        <Card variant="glass" className="p-6 sm:p-8 space-y-6">
          {(error || localError) && (
            <div className="p-3.5 rounded-xl bg-sos-600/20 border border-sos-600/50 text-red-300 text-xs font-semibold">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-navy-300">
                <input type="checkbox" className="rounded accent-cyan-400" />
                <span>Remember me</span>
              </label>
              <Link href="#" className="text-cyan-400 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full font-bold shadow-md shadow-cyan-500/20"
              isLoading={isLoading}
            >
              Sign In to WAYNEX
            </Button>
          </form>

          {/* Quick Demo Access */}
          <div className="pt-2">
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-navy-700/80 w-full" />
              <span className="bg-navy-900 px-3 text-[11px] uppercase font-bold text-navy-400 shrink-0">
                Or Quick Test
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleDemoLogin}
              className="w-full text-xs font-semibold border-navy-600 text-cyan-300"
            >
              Log in as Demo Traveler (One Click)
            </Button>
          </div>
        </Card>

        {/* Footer Link */}
        <p className="text-center text-xs text-navy-400">
          Don’t have a WAYNEX account?{' '}
          <Link href="/auth/register" className="text-cyan-400 font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
