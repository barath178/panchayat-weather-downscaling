'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, SendHorizontal, Volume2, VolumeX, Sparkles, ArrowUpRight, Square, RotateCcw, SprayCan, CloudRain, Droplets, BrainCircuit } from 'lucide-react';

// Starter cards shown before the first question: [suggestion index, icon]
const STARTERS: [number, React.ElementType][] = [
  [0, SprayCan],
  [1, CloudRain],
  [2, Droplets],
  [5, BrainCircuit],
];
import { LANGS, Lang, toSpeech } from '@/lib/advisory';
import { Answer, AssistantAction, AssistantContext, SUGGESTIONS, answer } from '@/lib/assistant';

interface Props {
  ctx: AssistantContext;
  lang: Lang;
  onLangChange: (l: Lang) => void;
  onAction: (a: AssistantAction) => void;
}

interface Msg {
  id: number;
  role: 'user' | 'ai';
  text: string;
  answer?: Answer;
}

const THINKING: Record<Lang, string[]> = {
  en: ['Reading the 7-day forecast…', 'Applying terrain physics…', 'Checking crop rules…'],
  hi: ['7 दिन का पूर्वानुमान पढ़ रहा हूँ…', 'भू-भाग का असर जोड़ रहा हूँ…', 'फसल नियम जाँच रहा हूँ…'],
  ta: ['7 நாள் முன்னறிவிப்பைப் படிக்கிறேன்…', 'நிலப்பரப்பு விளைவைக் கணக்கிடுகிறேன்…', 'பயிர் விதிகளைச் சரிபார்க்கிறேன்…'],
};

const PLACEHOLDER: Record<Lang, string> = {
  en: 'Ask about spraying, rain, irrigation, frost…',
  hi: 'छिड़काव, बारिश, सिंचाई, पाले के बारे में पूछें…',
  ta: 'தெளிப்பு, மழை, நீர்ப்பாசனம், பனி பற்றிக் கேளுங்கள்…',
};

type Recognition = {
  lang: string;
  interimResults: boolean;
  onresult: (e: any) => void;
  onend: () => void;
  onerror: () => void;
  start: () => void;
  stop: () => void;
};

export default function AskAeroAgro({ ctx, lang, onLangChange, onAction }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState<number | null>(null); // index into THINKING
  const [typing, setTyping] = useState<{ id: number; n: number } | null>(null);
  const [listening, setListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [canListen, setCanListen] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<Recognition | null>(null);
  const idRef = useRef(1);
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  useEffect(() => {
    setCanListen(!!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
    setCanSpeak('speechSynthesis' in window);
    return () => {
      recRef.current?.stop();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // New village → fresh conversation
  useEffect(() => {
    setMsgs([]);
    setTyping(null);
    setThinking(null);
  }, [ctx.p.id]);

  const greeting = useMemo(() => answer(lang === 'hi' ? 'नमस्ते' : lang === 'ta' ? 'வணக்கம்' : 'hello', ctx, lang), [ctx, lang]);

  // keep the newest message in view without scrolling the page
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing, thinking]);

  const speak = (id: number, a: Answer) => {
    if (!canSpeak) return;
    window.speechSynthesis.cancel();
    if (speakingId === id) {
      setSpeakingId(null);
      return;
    }
    const u = new SpeechSynthesisUtterance(toSpeech(a.text));
    const code = LANGS.find((l) => l.id === a.lang)!.speech;
    u.lang = code;
    const v = window.speechSynthesis.getVoices().find((x) => x.lang === code) || window.speechSynthesis.getVoices().find((x) => x.lang.startsWith(a.lang));
    if (v) u.voice = v;
    u.rate = 0.97;
    u.onend = u.onerror = () => setSpeakingId((s) => (s === id ? null : s));
    window.speechSynthesis.speak(u);
    setSpeakingId(id);
  };

  const ask = (q: string) => {
    const text = q.trim();
    if (!text || thinking != null || typing) return;
    setInput('');
    const uid = idRef.current++;
    setMsgs((m) => [...m, { id: uid, role: 'user', text }]);
    // brief visible "reasoning" phase, then type the grounded answer out
    setThinking(0);
    const steps = THINKING.en.length;
    let k = 0;
    const tick = setInterval(() => {
      k++;
      if (k < steps) setThinking(k);
      else {
        clearInterval(tick);
        const a = answer(text, ctxRef.current, lang);
        const aid = idRef.current++;
        setThinking(null);
        setMsgs((m) => [...m, { id: aid, role: 'ai', text: a.text, answer: a }]);
        setTyping({ id: aid, n: 0 });
      }
    }, 380);
  };

  // typewriter
  useEffect(() => {
    if (!typing) return;
    const msg = msgs.find((m) => m.id === typing.id);
    if (!msg) return;
    if (typing.n >= msg.text.length) {
      setTyping(null);
      if (autoSpeak && msg.answer) speak(msg.id, msg.answer);
      return;
    }
    const t = setTimeout(() => setTyping({ id: typing.id, n: Math.min(msg.text.length, typing.n + 3) }), 12);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typing, msgs]);

  const listen = () => {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec: Recognition = new SR();
    rec.lang = LANGS.find((l) => l.id === lang)!.speech;
    rec.interimResults = true;
    let finalText = '';
    rec.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setInput(finalText || interim);
    };
    rec.onend = () => {
      setListening(false);
      if (finalText) ask(finalText);
    };
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  const all: Msg[] = [{ id: 0, role: 'ai', text: greeting.text, answer: greeting }, ...msgs];
  const busy = thinking != null || !!typing;

  return (
    <section id="ask" className="card relative flex h-[640px] flex-col overflow-hidden scroll-mt-24" aria-labelledby="ask-title">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" aria-hidden />

      <header className="relative flex items-center gap-3 border-b border-line/[0.07] p-4 sm:px-5">
        <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-bg">
          <span className="absolute inset-0 animate-[spin_6s_linear_infinite] rounded-2xl" style={{ background: 'conic-gradient(from 0deg, #C8F169, #7DC4FF, #F6B94C, #C8F169)', padding: 1.5, WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
          <Sparkles className="h-5 w-5 text-accent" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="ask-title" className="font-display text-xl leading-tight text-ink">
            Ask AeroAgro
          </h2>
          <p className="truncate text-xs text-muted">Farm assistant for {ctx.p.name} · answers from the village forecast</p>
        </div>
        {canSpeak && (
          <button
            onClick={() => setAutoSpeak((s) => !s)}
            aria-pressed={autoSpeak}
            title={autoSpeak ? 'Stop reading answers aloud' : 'Read answers aloud'}
            className={`grid h-9 w-9 place-items-center rounded-xl border transition-colors ${autoSpeak ? 'border-accent/60 bg-accent/15 text-accent' : 'border-line/10 text-muted hover:text-ink'}`}
          >
            {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        )}
        {msgs.length > 0 && (
          <button onClick={() => setMsgs([])} disabled={busy} title="New conversation" className="grid h-9 w-9 place-items-center rounded-xl border border-line/10 text-muted hover:text-ink disabled:opacity-40">
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </header>

      <div className="relative flex items-center justify-between gap-2 px-4 pt-3 sm:px-5">
        <div className="seg" role="radiogroup" aria-label="Assistant language">
          {LANGS.map((l) => (
            <button key={l.id} role="radio" aria-checked={lang === l.id} onClick={() => onLangChange(l.id)} className={`seg-btn ${lang === l.id ? 'seg-on' : ''}`}>
              {l.label}
            </button>
          ))}
        </div>
        <span className="hidden items-center gap-1.5 text-[11px] text-muted sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-good" /> Answers computed on-device
        </span>
      </div>

      {/* conversation */}
      <div ref={scrollRef} className="relative flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5" aria-live="polite">
        {all.map((m) => {
          if (m.role === 'user')
            return (
              <div key={m.id} className="flex justify-end animate-fade-in">
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-raised px-3.5 py-2.5 text-sm text-ink">{m.text}</div>
              </div>
            );
          const isTyping = typing?.id === m.id;
          const shown = isTyping ? m.text.slice(0, typing!.n) : m.text;
          const a = m.answer;
          return (
            <div key={m.id} className="flex gap-2.5 animate-fade-in">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent/15">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
              </span>
              <div className="min-w-0 max-w-[88%]">
                <div className="rounded-2xl rounded-tl-md border border-line/[0.08] bg-surface2 px-3.5 py-2.5 text-sm leading-relaxed text-ink2">
                  {shown}
                  {isTyping && <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-accent" />}
                </div>
                {!isTyping && a && m.id !== 0 && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 animate-fade-in">
                    {a.sources.map((s) => (
                      <span key={s} className="rounded-full border border-line/10 px-2 py-0.5 text-[10px] text-muted">
                        {s}
                      </span>
                    ))}
                    {canSpeak && (
                      <button onClick={() => speak(m.id, a)} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] text-ink2 hover:bg-raised hover:text-ink">
                        {speakingId === m.id ? <Square className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                        {speakingId === m.id ? 'Stop' : 'Listen'}
                      </button>
                    )}
                    {a.action && (
                      <button onClick={() => onAction(a.action!.id)} className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-semibold text-accent hover:bg-accent/25">
                        {a.action.label} <ArrowUpRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {msgs.length === 0 && thinking == null && (
          <div className="grid grid-cols-2 gap-2 pl-9 animate-fade-in">
            {STARTERS.map(([i, I]) => (
              <button
                key={i}
                onClick={() => ask(SUGGESTIONS[lang][i])}
                className="group flex min-h-[76px] flex-col justify-between gap-2 rounded-2xl border border-line/[0.08] bg-surface2/60 p-3 text-left text-[13px] leading-snug text-ink2 transition-colors hover:border-accent/40 hover:text-ink"
              >
                <I className="h-4 w-4 text-accent" />
                {SUGGESTIONS[lang][i]}
              </button>
            ))}
          </div>
        )}
        {thinking != null && (
          <div className="flex gap-2.5 animate-fade-in">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent/15">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-accent" />
            </span>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-line/[0.08] bg-surface2 px-3.5 py-2.5 text-xs text-muted">
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </span>
              {THINKING[lang][thinking]}
            </div>
          </div>
        )}
      </div>

      {/* suggestions */}
      <div className="relative flex gap-1.5 overflow-x-auto px-4 pb-2 scrollbar-none sm:px-5">
        {SUGGESTIONS[lang].filter((_, i) => msgs.length > 0 || !STARTERS.some(([k]) => k === i)).map((s) => (
          <button key={s} onClick={() => ask(s)} disabled={busy} className="chip shrink-0 disabled:opacity-50">
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="relative flex items-center gap-2 border-t border-line/[0.07] p-3 sm:px-4"
      >
        {canListen && (
          <button
            type="button"
            onClick={listen}
            aria-label={listening ? 'Stop listening' : 'Ask by voice'}
            className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors ${listening ? 'bg-alert text-accent-ink' : 'border border-line/10 bg-surface2 text-ink2 hover:text-ink'}`}
          >
            {listening && <span className="absolute inset-0 animate-pulse-ring rounded-xl bg-alert/60" />}
            <Mic className="relative h-4 w-4" />
          </button>
        )}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={listening ? '…' : PLACEHOLDER[lang]}
          aria-label="Your question"
          className="h-11 min-w-0 flex-1 rounded-xl border border-line/10 bg-bg/60 px-3.5 text-sm text-ink placeholder:text-muted focus:border-accent/50 focus:outline-none"
        />
        <button type="submit" disabled={!input.trim() || busy} aria-label="Send" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-ink transition hover:brightness-110 disabled:opacity-40">
          <SendHorizontal className="h-4 w-4" />
        </button>
      </form>
    </section>
  );
}
