'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mic, Volume2, VolumeX, Radio, CheckCircle2 } from 'lucide-react';

export default function AcousticSpectrogram() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const animIdRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [rainMode, setRainMode] = useState<'dry' | 'drizzle' | 'moderate' | 'torrential'>('moderate');

  const modeConfig = {
    dry: { rate: 0.0, conf: 98.4, freq: 800, gain: 0.05, label: 'Dry (0 mm/hr)' },
    drizzle: { rate: 3.6, conf: 94.2, freq: 4800, gain: 0.20, label: 'Drizzle (3.6 mm/hr)' },
    moderate: { rate: 16.8, conf: 96.9, freq: 2800, gain: 0.50, label: 'Moderate (16.8 mm/hr)' },
    torrential: { rate: 52.4, conf: 99.2, freq: 1100, gain: 0.85, label: 'Torrential (52.4 mm/hr)' },
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch (e) {}
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) {}
    }
    if (animIdRef.current) {
      cancelAnimationFrame(animIdRef.current);
    }
    setIsPlaying(false);
    drawIdle();
  };

  const startAudio = (mode: 'dry' | 'drizzle' | 'moderate' | 'torrential') => {
    stopAudio();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // White noise
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      sourceNodeRef.current = source;

      // Bandpass filter simulating corrugated sheet tin roof resonance
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = modeConfig[mode].freq;
      filter.Q.value = 1.3;

      const gain = ctx.createGain();
      gain.gain.value = modeConfig[mode].gain * 0.2;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyserRef.current = analyser;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(analyser);
      gain.connect(ctx.destination);

      source.start(0);
      setIsPlaying(true);
      animateSpectrogram();
    } catch (err) {
      console.warn('AudioContext error:', err);
    }
  };

  const drawIdle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#05070e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 35) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Tap "Start Acoustic Analysis" to stream synthetic tin-roof sound spectrum', canvas.width / 2, canvas.height / 2 + 3);
  };

  const animateSpectrogram = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = 'rgba(5, 7, 14, 0.35)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.2;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

      const r = Math.round(16 + i * 2.5);
      const g = Math.round(185 + i * 0.8);
      const b = Math.round(129 + i * 1.5);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
      x += barWidth;
    }

    animIdRef.current = requestAnimationFrame(animateSpectrogram);
  };

  useEffect(() => {
    drawIdle();
    return () => stopAudio();
  }, []);

  const handleModeSwitch = (mode: 'dry' | 'drizzle' | 'moderate' | 'torrential') => {
    setRainMode(mode);
    if (isPlaying) {
      startAudio(mode);
    }
  };

  return (
    <div className="orchids-glass rounded-2xl p-4 shadow-orchids-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Acoustic Rain Gauge (Tin-Roof Audio AI)
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            ₹0 Hardware ground-truth: classifies rainfall intensity from acoustic frequency vibrations on village tin roofs
          </p>
        </div>

        <button
          onClick={() => (isPlaying ? stopAudio() : startAudio(rainMode))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isPlaying
              ? 'bg-rose-500 hover:bg-rose-400 text-white'
              : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-orchids-glow'
          }`}
        >
          {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          {isPlaying ? 'Stop Audio' : 'Start Acoustic Analysis'}
        </button>
      </div>

      {/* Canvas FFT Visualizer */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#05070e]">
        <canvas ref={canvasRef} width={580} height={110} className="w-full h-28 block" />
        <div className="absolute top-2 right-3 font-mono text-[9px] text-cyan-400">
          FFT 128 BANDS • 0 - 8 kHz
        </div>
      </div>

      {/* Controls & Ground Truth Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
          {(['dry', 'drizzle', 'moderate', 'torrential'] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleModeSwitch(m)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all capitalize ${
                rainMode === m
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div>
            <span className="text-slate-400 text-[10px]">Predicted Rate: </span>
            <strong className="text-cyan-300 font-mono">{modeConfig[rainMode].rate} mm/hr</strong>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            CNN Confidence: {modeConfig[rainMode].conf}%
          </div>
        </div>
      </div>
    </div>
  );
}
