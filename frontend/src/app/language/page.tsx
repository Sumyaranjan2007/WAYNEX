'use client';

import React, { useState } from 'react';
import {
  Languages,
  Volume2,
  Copy,
  Check,
  Search,
  Sparkles,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Phrase {
  id: string;
  category: 'greetings' | 'directions' | 'food' | 'bargaining' | 'emergency';
  english: string;
  native: string;
  phonetic: string;
}

export default function LanguagePage() {
  const [selectedLanguage, setSelectedLanguage] = useState<'Kannada' | 'Hindi' | 'Tamil' | 'Telugu' | 'Malayalam' | 'Bengali' | 'Marathi'>('Kannada');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const phrasesByLanguage: Record<string, Phrase[]> = {
    Kannada: [
      { id: 'kn-1', category: 'greetings', english: 'Hello / Greetings', native: 'ನಮಸ್ಕಾರ', phonetic: 'Namaskara' },
      { id: 'kn-2', category: 'greetings', english: 'Thank you very much', native: 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು', phonetic: 'Tumba Dhanyavadagalu' },
      { id: 'kn-3', category: 'directions', english: 'Where is this place?', native: 'ಈ ಸ್ಥಳ ಎಲ್ಲಿದೆ?', phonetic: 'Ee sthala ellide?' },
      { id: 'kn-4', category: 'directions', english: 'Please go straight', native: 'ದಯವಿಟ್ಟು ನೇರವಾಗಿ ಹೋಗಿ', phonetic: 'Dayavittu neravaagi hogi' },
      { id: 'kn-5', category: 'bargaining', english: 'How much does this cost?', native: 'ಇದು ಎಷ್ಟು ರೂಪಾಯಿ?', phonetic: 'Idu eshtu roopayi?' },
      { id: 'kn-6', category: 'bargaining', english: 'Please reduce the price a little', native: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ', phonetic: 'Svalpa kadime maadi' },
      { id: 'kn-7', category: 'food', english: 'One filter coffee, please', native: 'ಒಂದು ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ', phonetic: 'Ondu filter coffee kodi' },
      { id: 'kn-8', category: 'food', english: 'Is this food spicy?', native: 'ಇದು ಖಾರವಾಗಿದೆಯೇ?', phonetic: 'Idu khaaravaagideye?' },
      { id: 'kn-9', category: 'emergency', english: 'Please help me!', native: 'ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ!', phonetic: 'Dayavittu nanage sahaaya maadi!' },
      { id: 'kn-10', category: 'emergency', english: 'Where is the hospital / police station?', native: 'ಆಸ್ಪತ್ರೆ / ಪೊಲೀಸ್ ಠಾಣೆ ಎಲ್ಲಿದೆ?', phonetic: 'Aaspatre / Police thaane ellide?' },
    ],
    Hindi: [
      { id: 'hi-1', category: 'greetings', english: 'Hello', native: 'नमस्ते', phonetic: 'Namaste' },
      { id: 'hi-2', category: 'greetings', english: 'Thank you', native: 'धन्यवाद', phonetic: 'Dhanyavaad' },
      { id: 'hi-3', category: 'directions', english: 'Where does this road lead?', native: 'यह रास्ता कहाँ जाता है?', phonetic: 'Yeh raasta kahan jaata hai?' },
      { id: 'hi-4', category: 'bargaining', english: 'What is the price?', native: 'यह कितने का है?', phonetic: 'Yeh kitne ka hai?' },
      { id: 'hi-5', category: 'bargaining', english: 'Make it a fair price', native: 'थोड़ा सही लगाइए', phonetic: 'Thoda sahi lagaiye' },
      { id: 'hi-6', category: 'food', english: 'Please give water', native: 'कृपया पानी दीजिए', phonetic: 'Kripya paani deejiye' },
      { id: 'hi-7', category: 'emergency', english: 'Help! Call the police', native: 'मदद! पुलिस को बुलाइए', phonetic: 'Madad! Police ko bulaiye' },
    ],
    Tamil: [
      { id: 'ta-1', category: 'greetings', english: 'Hello / Greetings', native: 'வணக்கம்', phonetic: 'Vanakkam' },
      { id: 'ta-2', category: 'greetings', english: 'Thank you', native: 'நன்றி', phonetic: 'Nandri' },
      { id: 'ta-3', category: 'directions', english: 'Where is the bus stop?', native: 'பேருந்து நிறுத்தம் எங்கே?', phonetic: 'Perundhu nirutham enge?' },
      { id: 'ta-4', category: 'bargaining', english: 'How much is this?', native: 'இது என்ன விலை?', phonetic: 'Idhu enna vilai?' },
      { id: 'ta-5', category: 'food', english: 'Very delicious food', native: 'ரொம்ப சுவையாக இருக்கிறது', phonetic: 'Romba suvaiyaaga irukkiradhu' },
      { id: 'ta-6', category: 'emergency', english: 'Please help me', native: 'தயவுசெய்து எனக்கு உதவுங்கள்', phonetic: 'Dayavuseidhu enakku udhavungal' },
    ],
    Telugu: [
      { id: 'te-1', category: 'greetings', english: 'Hello', native: 'నమస్కారం', phonetic: 'Namaskaram' },
      { id: 'te-2', category: 'greetings', english: 'Thank you', native: 'ధన్యవాదాలు', phonetic: 'Dhanyavaadalu' },
      { id: 'te-3', category: 'directions', english: 'Where is this place?', native: 'ఈ ప్రదేశం ఎక్కడ ఉంది?', phonetic: 'Ee pradesham ekkada undi?' },
      { id: 'te-4', category: 'bargaining', english: 'How much money?', native: 'ఎంత ధర?', phonetic: 'Entha dhara?' },
      { id: 'te-5', category: 'emergency', english: 'Please help me', native: 'దయచేసి సహాయం చేయండి', phonetic: 'Dayachesi sahaayam cheyandi' },
    ],
    Malayalam: [
      { id: 'ml-1', category: 'greetings', english: 'Hello', native: 'നമസ്കാരം', phonetic: 'Namaskaram' },
      { id: 'ml-2', category: 'greetings', english: 'Thank you', native: 'നന്ദി', phonetic: 'Nandi' },
      { id: 'ml-3', category: 'directions', english: 'Where is this?', native: 'ഇത് എവിടെയാണ്?', phonetic: 'Ithu evideyaanu?' },
      { id: 'ml-4', category: 'bargaining', english: 'What is the price?', native: 'എത്ര രൂപയാണ്?', phonetic: 'Ethra roopayaanu?' },
      { id: 'ml-5', category: 'emergency', english: 'Help me', native: 'സഹായിക്കൂ', phonetic: 'Sahaayikku' },
    ],
    Bengali: [
      { id: 'bn-1', category: 'greetings', english: 'Hello', native: 'নমস্কার', phonetic: 'Nomoshkar' },
      { id: 'bn-2', category: 'greetings', english: 'Thank you', native: 'ধন্যবাদ', phonetic: 'Dhonnobaad' },
      { id: 'bn-3', category: 'directions', english: 'Where is this place?', native: 'এই জায়গাটা কোথায়?', phonetic: 'Ei jaigata kothay?' },
      { id: 'bn-4', category: 'bargaining', english: 'How much is it?', native: 'এটার দাম কত?', phonetic: 'Etar daam koto?' },
    ],
    Marathi: [
      { id: 'mr-1', category: 'greetings', english: 'Hello', native: 'नमस्कार', phonetic: 'Namaskar' },
      { id: 'mr-2', category: 'greetings', english: 'Thank you', native: 'धन्यवाद', phonetic: 'Dhanyavaad' },
      { id: 'mr-3', category: 'directions', english: 'Where is the road to here?', native: 'हा रस्ता कुठे जातो?', phonetic: 'Haa rasta kuthe jaato?' },
      { id: 'mr-4', category: 'bargaining', english: 'How much does it cost?', native: 'हे कितीचे आहे?', phonetic: 'He kitiche aahe?' },
    ],
  };

  const currentPhrases = phrasesByLanguage[selectedLanguage] || [];
  const filteredPhrases = currentPhrases.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  const handleCopy = (phrase: Phrase) => {
    navigator.clipboard.writeText(`${phrase.native} (${phrase.phonetic})`);
    setCopiedId(phrase.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const playSimulatedAudio = (phonetic: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phonetic);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white py-12">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <Badge variant="info" className="mb-2">
            Linguistic Companion
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            Indian Language Assistant
          </h1>
          <p className="text-navy-200 text-sm sm:text-base leading-relaxed">
            Communicate easily with local auto drivers, street vendors, and homestay hosts in their native mother tongue with clear phonetic guides and pronunciation.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-4 mb-6 scrollbar-none">
          {Object.keys(phrasesByLanguage).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                selectedLanguage === lang
                  ? 'bg-cyan-500 text-navy-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-navy-900 border-navy-700 text-navy-300 hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {[
            ['all', 'All Phrases'],
            ['greetings', 'Greetings & Courtesy'],
            ['directions', 'Directions & Taxi'],
            ['bargaining', 'Shopping & Prices'],
            ['food', 'Food & Dining'],
            ['emergency', 'Emergency & Help'],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setActiveCategory(val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === val
                  ? 'bg-amber-500 text-navy-950'
                  : 'bg-navy-900 border border-navy-800 text-navy-300 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Phrases List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPhrases.map((phrase) => (
            <Card key={phrase.id} variant="default" className="p-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-navy-400">
                    {phrase.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => playSimulatedAudio(phrase.phonetic)}
                      className="p-1.5 rounded-lg text-cyan-400 hover:bg-navy-800 transition-colors"
                      title="Listen Pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(phrase)}
                      className="p-1.5 rounded-lg text-navy-400 hover:text-white hover:bg-navy-800 transition-colors"
                      title="Copy text"
                    >
                      {copiedId === phrase.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-sm text-navy-300 mb-2">{phrase.english}</div>

                {/* Native script */}
                <div className="text-2xl font-bold text-white tracking-wide">
                  {phrase.native}
                </div>

                {/* Phonetics */}
                <div className="text-sm font-semibold text-cyan-300 font-mono mt-1">
                  &ldquo;{phrase.phonetic}&rdquo;
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
