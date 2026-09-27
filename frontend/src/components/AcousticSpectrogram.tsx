'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Square, Home } from 'lucide-react';

type RainMode = 'dry' | 'drizzle' | 'moderate' | 'torrential';

const MODES: Record<RainMode, { rate: number; freq: number; gain: number; label: string }> = {
  dry: { rate: 0, freq: 800, gain: 0.05, label: 'Dry' },
  drizzle: { rate: 3.6, freq: 4800, gain: 0.2, label: 'Drizzle' },
  moderate: { rate: 16.8, freq: 2800, gain: 0.5, label: 'Moderate' },
  torrential: { rate: 52.4, freq: 1100, gain: 0.85, label: 'Torrential' },
};

export default function AcousticSpectrogram() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const animIdRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [rainMode, setRainMode] = useState<RainMode>('moderate');

  const drawIdle = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#0d1210';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(226,240,231,0.06)';
    for (let x = 0; x < canvas.width; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    ctx.fillStyle = '#808E86';
    ctx.font = '13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Press “Play rain sound” to hear and see the tin-roof spectrum', canvas.width / 2, canvas.height / 2 + 4);
  };

  const stopAudio = () => {
    try {
      sourceNodeRef.current?.stop();
    } catch {}
    try {
      audioCtxRef.current?.close();
    } catch {}
    if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    setIsPlaying(false);
    drawIdle();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !analyser || !ctx) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    ctx.fillStyle = 'rgba(13,18,16,0.35)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const barW = (canvas.width / data.length) * 2.2;
    let x = 0;
    for (let i = 0; i < data.length; i++) {
      const h = (data[i] / 255) * canvas.height * 0.9;
      const t = i / data.length;
      // lime → sky along the frequency axis
      ctx.fillStyle = `rgb(${Math.round(200 - 75 * t)}, ${Math.round(241 - 45 * t)}, ${Math.round(105 + 150 * t)})`;
      ctx.fillRect(x, canvas.height - h, barW - 2, h);
      x += barW;
    }
    animIdRef.current = requestAnimationFrame(animate);
  };

  const startAudio = (mode: RainMode) => {
    stopAudio();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx: AudioContext = new AudioCtx();
      audioCtxRef.current = ctx;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const ch = buffer.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      sourceNodeRef.current = source;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = MODES[mode].freq;
      filter.Q.value = 1.3;
      const gain = ctx.createGain();
      gain.gain.value = MODES[mode].gain * 0.2;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyserRef.current = analyser;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(analyser);
      gain.connect(ctx.destination);
      source.start(0);
      setIsPlaying(true);
      animate();
    } catch (err) {
      console.warn('AudioContext error:', err);
    }
  };

  useEffect(() => {
    drawIdle();
    return () => stopAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchMode = (m: RainMode) => {
    setRainMode(m);
    if (isPlaying) startAudio(m);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-lg text-sm text-ink2">
          Rain gauges are scarce, but tin roofs are everywhere. A phone microphone can estimate rainfall from the sound of rain on a roof, giving free ground truth to
          check the forecast against.
        </p>
        <button onClick={() => (isPlaying ? stopAudio() : startAudio(rainMode))} className={isPlaying ? 'btn bg-alert text-accent-ink' : 'btn-primary'}>
          {isPlaying ? <Square className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          {isPlaying ? 'Stop' : 'Play rain sound'}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-[#0d1210]">
        <canvas ref={canvasRef} width={720} height={160} className="block h-40 w-full" />
        <span className="absolute right-3 top-3 text-[11px] text-muted">Frequency spectrum · 0–8 kHz</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="seg" role="radiogroup" aria-label="Rain intensity">
          {(Object.keys(MODES) as RainMode[]).map((m) => (
            <button key={m} role="radio" aria-checked={rainMode === m} onClick={() => switchMode(m)} className={`seg-btn ${rainMode === m ? 'seg-on' : ''}`}>
              {MODES[m].label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-surface2 px-4 py-2">
          <Home className="h-4 w-4 text-sky" />
          <span className="text-sm text-ink2">Estimated rate</span>
          <span className="font-display text-xl text-ink tabular">{MODES[rainMode].rate}</span>
          <span className="text-sm text-muted">mm/h</span>
        </div>
      </div>
      <p className="text-xs text-muted">Demo uses synthesised rain sound; a trained audio classifier would run on the farmer’s phone.</p>
    </div>
  );
}
