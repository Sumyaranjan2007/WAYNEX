'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  BatteryCharging,
  Plus,
  Trash2,
  Volume2,
  Lock,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { TrustedContact } from '@/types';

export default function SafeDashboardPage() {
  const [sosActive, setSosActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: 'parent' });

  const [contacts, setContacts] = useState<TrustedContact[]>([
    {
      id: 'tc-1',
      name: 'Ramesh Sharma',
      phone: '+91 98765 12340',
      relationship: 'parent',
      is_primary: true,
      is_verified: true,
    },
    {
      id: 'tc-2',
      name: 'Ananya Rao',
      phone: '+91 98765 56780',
      relationship: 'friend',
      is_primary: false,
      is_verified: true,
    },
  ]);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;

    setContacts([
      ...contacts,
      {
        id: 'tc-' + Date.now(),
        name: newContact.name,
        phone: newContact.phone,
        relationship: newContact.relationship as any,
        is_primary: contacts.length === 0,
        is_verified: true,
      },
    ]);
    setNewContact({ name: '', phone: '', relationship: 'parent' });
    setIsModalOpen(false);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const triggerSOS = () => {
    setSosActive(true);
  };

  const cancelSOS = () => {
    setSosActive(false);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <Badge variant="danger" className="mb-2 bg-red-600/20 text-red-300 border-red-500/40">
            Emergency & Safety Protection
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            WAYNEX Safe Dashboard
          </h1>
          <p className="text-navy-200 text-sm sm:text-base leading-relaxed">
            Your 24/7 travel safety command center. Trigger immediate emergency notifications to trusted guardians, dial national 112 services, and manage your security status.
          </p>
        </div>

        {/* SOS ACTIVE BANNER */}
        {sosActive && (
          <div className="mb-8 p-6 rounded-3xl bg-sos-600/30 border-2 border-sos-600 text-white shadow-glow-red animate-pulse">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <ShieldAlert className="w-10 h-10 text-red-400 shrink-0" />
                <div>
                  <h3 className="text-xl font-black">SOS ALERT ACTIVE</h3>
                  <p className="text-xs sm:text-sm text-red-200">
                    Your real-time GPS coordinates are being transmitted to your {contacts.length} trusted contacts. Emergency services are being alerted.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="md"
                onClick={cancelSOS}
                className="bg-navy-900 border-red-400 text-white hover:bg-navy-800 shrink-0"
              >
                Cancel SOS (False Alarm)
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main SOS Trigger Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Big SOS Button Card */}
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-navy-900 to-navy-950 border border-navy-700/80 text-center shadow-2xl flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Emergency SOS Button</h2>
                <p className="text-xs sm:text-sm text-navy-300 mt-1">
                  Press below in case of any safety emergency, harassment, medical need, or breakdown
                </p>
              </div>

              {/* Massive Red SOS Button */}
              <button
                type="button"
                onClick={triggerSOS}
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-sos-700 via-sos-600 to-red-500 border-4 border-red-400/60 shadow-glow-red flex flex-col items-center justify-center text-white active:scale-95 transition-all duration-200 group cursor-pointer"
              >
                <ShieldAlert className="w-14 h-14 sm:w-16 sm:h-16 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-3xl sm:text-4xl font-black tracking-widest">SOS</span>
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">Press to Alert</span>
              </button>

              <div className="text-xs text-navy-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                Broadcasts encrypted location to {contacts.length} guardian contacts instantly
              </div>
            </div>

            {/* Direct Helplines Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="tel:112"
                className="p-5 rounded-2xl bg-sos-600/10 border border-sos-600/40 hover:bg-sos-600/20 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs text-red-300 font-bold uppercase">National Emergency</div>
                  <div className="text-2xl font-black text-white font-mono mt-0.5">112</div>
                  <div className="text-[10px] text-navy-400">Police, Fire, Ambulance</div>
                </div>
                <div className="p-3 rounded-xl bg-sos-600 text-white">
                  <PhoneCall className="w-5 h-5" />
                </div>
              </a>

              <a
                href="tel:1091"
                className="p-5 rounded-2xl bg-navy-900 border border-navy-700 hover:border-cyan-400 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs text-cyan-300 font-bold uppercase">Women Safety Helpline</div>
                  <div className="text-2xl font-black text-white font-mono mt-0.5">1091</div>
                  <div className="text-[10px] text-navy-400">24x7 Dedicated Women Support</div>
                </div>
                <div className="p-3 rounded-xl bg-navy-800 text-cyan-400">
                  <PhoneCall className="w-5 h-5" />
                </div>
              </a>
            </div>
          </div>

          {/* Trusted Contacts & GPS status column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live GPS & Battery Telemetry */}
            <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Live Travel Telemetry
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  Simulated GPS
                </span>
              </div>
              <div className="text-xs text-navy-200">
                Coordinates: <span className="font-mono text-white">15.3350° N, 76.4600° E (Hampi, KA)</span>
              </div>
              <div className="flex items-center justify-between text-xs text-navy-400 pt-2 border-t border-navy-800">
                <span className="flex items-center gap-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" /> Device Battery: 88%
                </span>
                <span className="text-emerald-400 font-semibold">Network: 5G Strong</span>
              </div>
            </div>

            {/* Trusted Contacts Manager */}
            <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-4">
              <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Trusted Guardians ({contacts.length})
                </h3>
                <Button size="sm" variant="outline" onClick={() => setIsModalOpen(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Contact
                </Button>
              </div>

              <div className="space-y-3">
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-navy-950 border border-navy-800"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{c.name}</span>
                        <span className="text-[10px] bg-navy-800 text-cyan-300 px-1.5 py-0.5 rounded uppercase">
                          {c.relationship}
                        </span>
                        {c.is_primary && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-navy-400 font-mono mt-0.5">{c.phone}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteContact(c.id)}
                      className="p-1.5 text-navy-500 hover:text-red-400 transition-colors"
                      title="Remove contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist */}
            <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2 text-xs text-navy-300">
              <div className="font-bold text-white text-sm mb-1">Travel Safety Checklist</div>
              <div>&bull; Always share your live bus/cab number with a trusted contact.</div>
              <div>&bull; Keep emergency offline cash (₹1,000) inside your daypack.</div>
              <div>&bull; Keep offline maps downloaded on your smartphone.</div>
            </div>
          </div>
        </div>

        {/* Modal: Add Contact */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Trusted Emergency Contact"
          description="This contact will receive SMS & location coordinates during an SOS trigger."
        >
          <form onSubmit={handleAddContact} className="space-y-4 pt-2">
            <Input
              label="Contact Name"
              placeholder="e.g. Ramesh Sharma"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              required
            />
            <Input
              label="Mobile Number (with country code)"
              type="tel"
              placeholder="+91 98765 43210"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              required
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-200 mb-1.5">
                Relationship
              </label>
              <select
                value={newContact.relationship}
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                className="w-full bg-navy-900 border border-navy-700 text-white text-sm rounded-lg p-2.5"
              >
                <option value="parent">Parent</option>
                <option value="spouse">Spouse</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
                <option value="colleague">Colleague</option>
              </select>
            </div>
            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Emergency Contact
              </Button>
            </div>
          </form>
        </Modal>
      </Container>
    </div>
  );
}
