'use client';

import React, { useEffect, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
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
    <div className="flex items-center justify-between gap-2">
      <div className="seg" role="radiogroup" aria-label="Advisory language">
        {LANGS.map((l) => (
          <button key={l.id} role="radio" aria-checked={lang === l.id} onClick={() => onLangChange(l.id)} className={`seg-btn ${lang === l.id ? 'seg-on' : ''}`}>
            {l.label}
          </button>
        ))}
      </div>

      {supported && (
        <button
          onClick={handleSpeak}
          title={voice ? `Voice: ${voice.name}` : 'No matching voice installed; the browser default will be used'}
          className={`btn h-9 px-3 ${isSpeaking ? 'bg-alert text-accent-ink' : 'border border-line/10 bg-surface2 text-ink hover:bg-raised'}`}
        >
          {isSpeaking ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-4 w-4" />}
          {isSpeaking ? 'Stop' : 'Listen'}
        </button>
      )}
    </div>
  );
}
