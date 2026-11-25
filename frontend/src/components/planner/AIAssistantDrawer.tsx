'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  HelpCircle,
  Lightbulb,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { CityHub, AttractionItem, HotelOption, TransportOption } from '@/data/tripPlannerData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  destinationCity: CityHub;
  departureCity: string;
  selectedPlaces: AttractionItem[];
  budgetAmount: number;
  durationDays: number;
  travellerType: string;
  selectedTransport?: TransportOption;
  selectedHotel?: HotelOption;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIAssistantDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  destinationCity,
  departureCity,
  selectedPlaces,
  budgetAmount,
  durationDays,
  travellerType,
  selectedTransport,
  selectedHotel,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello! I am your WAYNEX AI Travel Agent for ${destinationCity.name}. I have access to your planned ${selectedPlaces.length} destination(s), your ₹${budgetAmount.toLocaleString()} budget, and your ${durationDays}-day duration. How can I help optimize your journey?`,
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    'Can I complete all these places in fewer days?',
    'How can I reduce expenses by ₹2,000?',
    'Where should I eat lunch on Day 1?',
    'What if it rains during our visit?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    // Contextual AI answers
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('fewer days') || lower.includes('one day') || lower.includes('complete')) {
        const hours = selectedPlaces.reduce((sum, p) => sum + p.approxVisitingHours, 0);
        reply = `You have selected ${selectedPlaces.length} attractions requiring ~${hours.toFixed(1)} hours of active sightseeing. Packing this into fewer days would require skipping transit buffers and rushed visits. I recommend maintaining ${durationDays} days or prioritizing the top 3 highlights (e.g. ${selectedPlaces.slice(0, 3).map(p => p.name).join(', ')}).`;
      } else if (lower.includes('reduce') || lower.includes('expenses') || lower.includes('cheaper') || lower.includes('budget')) {
        reply = `To trim your expenses: 1) Switch to KSRTC non-AC express or passenger trains (saves ₹300-500/person). 2) Choose backpacker hostels like Zostel or OTDC Panthanivas (saves ~₹1,200/night). 3) Enjoy local heritage tiffins like Vinayaka Mylari rather than hotel room service.`;
      } else if (lower.includes('lunch') || lower.includes('eat') || lower.includes('food')) {
        reply = `For authentic dining near your attractions in ${destinationCity.name}, head to Hotel RRR for an unlimited Andhra-Karnataka meal served on fresh plantain leaves (~₹280/person) or Vinayaka Mylari for cloud-soft butter dosas.`;
      } else if (lower.includes('rain') || lower.includes('weather')) {
        reply = `If rain strikes ${destinationCity.name}, pivot to indoor architectural wonders! Mysore Palace, Jayachamarajendra Art Gallery at Jaganmohan Palace, and the Rail Museum are covered and enjoyable regardless of rainfall.`;
      } else {
        reply = `Based on your ${travellerType} trip to ${destinationCity.name} from ${departureCity || 'Bengaluru'}, I have synchronized your transport arrival times with your Day 1 hotel check-in. Everything is clustered geographically to minimize unnecessary travel!`;
      }

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: reply,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#14243A] text-white shadow-2xl border-l border-white/20 flex flex-col justify-between animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 bg-[#14243A] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FF9933] text-[#14243A] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              WAYNEX AI Travel Agent
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono">● Real-time Context Active</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Trip Context Card */}
      <div className="p-3 bg-white/5 border-b border-white/10 text-[11px] text-white/80 flex items-center justify-between">
        <span>{destinationCity.name} • {durationDays} Days</span>
        <span>₹{budgetAmount.toLocaleString()} Budget</span>
        <span>{selectedPlaces.length} Places</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-[#FF9933] text-[#14243A] flex items-center justify-center shrink-0 text-xs font-bold">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#B85C38] text-white rounded-br-none'
                  : 'bg-white/10 text-white border border-white/10 rounded-bl-none'
              }`}
            >
              <p>{m.text}</p>
              <span className="text-[9px] text-white/50 block mt-1 text-right">{m.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Suggestion Pills & Input Bar */}
      <div className="p-3 bg-[#14243A] border-t border-white/10 space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(qp)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white whitespace-nowrap border border-white/10 transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI anything about your trip..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#FF9933]"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            className="w-9 h-9 rounded-xl bg-[#FF9933] hover:bg-[#B85C38] text-[#14243A] hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
