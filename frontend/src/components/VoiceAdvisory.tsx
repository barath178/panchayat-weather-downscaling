'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Square, Sparkles } from 'lucide-react';

interface VoiceAdvisoryProps {
  textToSpeak: string;
}

export default function VoiceAdvisory({ textToSpeak }: VoiceAdvisoryProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
    }
  }, []);

  const handleSpeak = () => {
    if (!supported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = textToSpeak
      .replace(/[*_#•🌱🌾📊🚜⚠️📍]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.lang = 'en-US';

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  if (!supported) return null;

  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-white">AI Voice Advisory Reader</div>
          <div className="text-[9px] text-slate-400">
            English Text-to-Speech Accessibility
          </div>
        </div>
      </div>

      <button
        onClick={handleSpeak}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          isSpeaking
            ? 'bg-rose-500 hover:bg-rose-400 text-white animate-pulse'
            : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-orchids-glow'
        }`}
      >
        {isSpeaking ? <Square className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
        {isSpeaking ? 'Stop Speech' : 'Listen Aloud'}
      </button>
    </div>
  );
}
