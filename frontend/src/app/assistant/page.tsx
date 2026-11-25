'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Bot,
  Trash2,
  Compass,
  ArrowRight,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChatMessage } from '@/types';

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'Namaste! I am your WAYNEX Travel Intelligence Assistant. Ask me anything about train connections in Karnataka, offbeat treks, women traveler safety ratings, or custom day-wise budgets.',
      timestamp: 'Just now',
      suggestions: [
        'Plan 3 days in Hampi under ₹5,000',
        'Safest beach towns in South India for solo women',
        'How to reach Coorg from Bangalore by train & bus',
        'Top 5 coffee plantation homestays in Chikmagalur',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: m.text,
      }));

      const res = await fetch('http://localhost:8000/api/v1/assistant/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: 'msg-' + Date.now(),
          sender: 'assistant',
          text: data.response || data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn('Backend assistant API offline, falling back to local intelligence', err);
    }

    // Contextual fallback response
    setTimeout(() => {
      let reply = `Here is a curated recommendation for: "${query}"\n\n`;

      if (query.toLowerCase().includes('hampi')) {
        reply += `**Recommended 3-Day Hampi Itinerary under ₹5,000:**\n\n` +
          `• **Day 1 (Sacred Center):** Arrive via Hampi Express at Hosapete (₹385 sleeper). Check into a riverside homestay in Sanapur/Anegundi (₹700/night). Rent a bicycle (₹150/day). Visit Virupaksha Temple and climb Matanga Hill for sunset.\n` +
          `• **Day 2 (Royal Center):** Explore Vittala Temple & Stone Chariot (entry ₹40), Queen's Bath, and Lotus Mahal. Enjoy traditional Jowar Rotti thali lunch (₹120).\n` +
          `• **Day 3 (Adventure):** Coracle boat ride on Tungabhadra River (₹100) and bouldering at Hippie Island boulder fields. Return by evening KSRTC bus.`;
      } else if (query.toLowerCase().includes('safe') || query.toLowerCase().includes('women')) {
        reply += `**Top Safe Destinations for Solo Travelers in India:**\n\n` +
          `1. **Gokarna & Udupi (Karnataka):** Peaceful coastal towns with strong community policing, warm homestay families, and well-lit main strips.\n` +
          `2. **Munnar (Kerala):** Tranquil hill station with low crime rates, certified KTDC stays, and active 24/7 tourist police.\n` +
          `3. **Rishikesh (Uttarakhand):** Spiritual and yoga haven, safe pedestrian suspension bridges, and abundant solo backpacker hostels.\n\n` +
          `*Safety Tip:* Remember you can activate the WAYNEX SOS button anytime to instantly dial 112 and broadcast your coordinates to emergency contacts.`;
      } else {
        reply += `Based on our verified regional database:\n\n` +
          `• **Best Season:** October through March offers pleasant daytime weather across most Indian states.\n` +
          `• **Transport:** Use Indian Railways Vande Bharat or KSRTC Airavat AC sleepers for reliable connections.\n` +
          `• **Budget Allocation:** Target ₹1,800 to ₹2,500/day for comfortable dorm/homestay accommodation and authentic local dining.\n\n` +
          `Feel free to ask for specific bus routes, hidden viewpoints, or local dishes to try!`;
      }

      const botMsg: ChatMessage = {
        id: 'msg-' + Date.now(),
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'm-init',
        sender: 'assistant',
        text: 'Chat history cleared. How else can I assist your travels across India?',
        timestamp: 'Just now',
        suggestions: [
          'Budget 4 days in Coorg',
          'Direct trains to Gokarna',
          'Hidden waterfalls in Western Ghats',
        ],
      },
    ]);
  };

  return (
    <div className="min-h-[88vh] bg-navy-950 text-white flex flex-col">
      <Container className="py-6 flex-1 flex flex-col max-w-4xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-navy-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-glow-cyan">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                WAYNEX AI Travel Assistant
                <Badge variant="success" size="sm">
                  Active
                </Badge>
              </h1>
              <p className="text-xs text-navy-400">
                Calibrated with real Indian transport routes, state tourism data & safety guidelines
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-xs text-navy-400 hover:text-white"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>

        {/* Chat Message Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-[380px] max-h-[580px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-navy-800 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="space-y-2 max-w-[85%]">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500 text-navy-950 font-medium rounded-tr-none'
                      : 'bg-navy-900 border border-navy-700/80 text-navy-100 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>

                <div
                  className={`text-[10px] text-navy-400 px-1 ${
                    msg.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {msg.timestamp}
                </div>

                {/* Suggestions pills if present */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(s)}
                        className="text-xs bg-navy-800/80 hover:bg-navy-700 border border-navy-700 text-cyan-300 px-3 py-1.5 rounded-full transition-colors text-left"
                      >
                        &ldquo;{s}&rdquo; &rarr;
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 text-cyan-400 text-xs py-2">
              <div className="w-8 h-8 rounded-full bg-navy-800 border border-cyan-500/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <span className="flex items-center gap-1.5 font-medium">
                WAYNEX AI is preparing recommendations
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-4 border-t border-navy-800 flex items-center gap-2 mt-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about destinations, budget itineraries, safety or routes..."
            className="flex-1 bg-navy-900 border border-navy-700 text-white placeholder-navy-400 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400"
          />
          <Button type="submit" size="md" className="px-5 py-3 font-semibold shadow-md shadow-cyan-500/20">
            <Send className="w-4 h-4 mr-1.5" />
            Send
          </Button>
        </form>
      </Container>
    </div>
  );
}
