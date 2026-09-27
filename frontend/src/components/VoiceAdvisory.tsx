'use client';

import React, { useEffect, useState } from 'react';
import { Volume2, Square, Languages } from 'lucide-react';
import { LANGS, Lang, toSpeech } from '@/lib/advisory';

interface VoiceAdvisoryProps {
  textToSpeak: string;
  lang: Lang;
  onLangChange: (l: Lang) => void;
}

export default function VoiceAdvisory({ textToSpeak, lang, onLangChange }: VoiceAdvisoryProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    setSupported(true);
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load);
      window.speechSynthesis.cancel();
    };
  }, []);

  // Stop reading when the advisory changes underneath us.
  useEffect(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [textToSpeak, supported]);

  const speechLang = LANGS.find((l) => l.id === lang)!.speech;
  const voice = voices.find((v) => v.lang === speechLang) || voices.find((v) => v.lang.startsWith(lang));

  const handleSpeak = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(toSpeech(textToSpeak));
    utterance.lang = speechLang;
    if (voice) utterance.voice = voice;
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Advisory language">
        <Languages className="w-3.5 h-3.5 text-emerald-400" />
        {LANGS.map((l) => (
          <button
            key={l.id}
            role="radio"
            aria-checked={lang === l.id}
            onClick={() => onLangChange(l.id)}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              lang === l.id ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {supported && (
        <button
          onClick={handleSpeak}
          title={voice ? `Voice: ${voice.name}` : 'No matching voice installed; the browser default will be used'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isSpeaking ? 'bg-rose-500 hover:bg-rose-400 text-white' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
          }`}
        >
          {isSpeaking ? <Square className="w-3 h-3" /> : <Volume2 className="w-3.5 h-3.5" />}
          {isSpeaking ? 'Stop' : 'Listen'}
        </button>
      )}
    </div>
  );
}
