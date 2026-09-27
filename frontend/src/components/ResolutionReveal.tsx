'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MoveHorizontal, Snowflake } from 'lucide-react';
import { buildRevealField, tempColor, NX, NY, BLOCK, RAMP_CSS } from '@/lib/revealField';

const CELL = 8; // canvas px per fine cell (before DPR)
const W = NX * CELL;
const H = NY * CELL;

export default function ResolutionReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const field = useMemo(buildRevealField, []);
  const [split, setSplit] = useState(1); // 0 = all fine, 1 = all coarse
  const [hover, setHover] = useState<{ x: number; y: number; fine: number; coarse: number } | null>(null);
  const dragging = useRef(false);

  const frostCells = useMemo(() => field.fine.reduce((n, v) => n + (v <= 2 ? 1 : 0), 0), [field]);
  const coarseMin = useMemo(() => Math.min(...Array.from(field.coarse)), [field]);

  // Intro sweep: reveal the fine grid once when the hero mounts
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setSplit(0.5);
      return;
    }
    let raf = 0;
    const start = performance.now() + 500;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / 1600));
      const ease = 1 - Math.pow(1 - t, 3);
      if (!dragging.current) setSplit(1 - ease * 0.55);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const splitX = split * W;

    for (let j = 0; j < NY; j++) {
      for (let i = 0; i < NX; i++) {
        const k = j * NX + i;
        const useCoarse = i * CELL + CELL / 2 < splitX;
        const t = useCoarse ? field.coarse[k] : field.fine[k];
        const [r, g, b] = tempColor(t);
        const s = field.shade[k];
        ctx.fillStyle = `rgb(${r * s},${g * s},${b * s})`;
        ctx.fillRect(i * CELL, j * CELL, CELL + 0.5, CELL + 0.5);
      }
    }

    // 18 km block outlines
    ctx.strokeStyle = 'rgba(236,242,238,0.35)';
    ctx.lineWidth = 1;
    for (let bi = 1; bi < NX / BLOCK; bi++) {
      ctx.beginPath();
      ctx.moveTo(bi * BLOCK * CELL + 0.5, 0);
      ctx.lineTo(bi * BLOCK * CELL + 0.5, H);
      ctx.stroke();
    }
    for (let bj = 1; bj < NY / BLOCK; bj++) {
      ctx.beginPath();
      ctx.moveTo(0, bj * BLOCK * CELL + 0.5);
      ctx.lineTo(W, bj * BLOCK * CELL + 0.5);
      ctx.stroke();
    }

    // Frost pockets on the fine side
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    for (let j = 0; j < NY; j++)
      for (let i = 0; i < NX; i++) {
        const k = j * NX + i;
        if (i * CELL + CELL / 2 >= splitX && field.fine[k] <= 0) {
          ctx.beginPath();
          ctx.arc(i * CELL + CELL / 2, j * CELL + CELL / 2, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
  }, [split, field]);

  const setFromClientX = (clientX: number) => {
    const rect = wrapRef.current!.getBoundingClientRect();
    setSplit(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)));
  };

  const onMove = (e: React.PointerEvent) => {
    const rect = wrapRef.current!.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    const fy = (e.clientY - rect.top) / rect.height;
    const i = Math.min(NX - 1, Math.max(0, Math.floor(fx * NX)));
    const j = Math.min(NY - 1, Math.max(0, Math.floor(fy * NY)));
    setHover({ x: fx, y: fy, fine: field.fine[j * NX + i], coarse: field.coarse[j * NX + i] });
    if (dragging.current) setSplit(Math.min(1, Math.max(0, fx)));
  };

  return (
    <figure className="card overflow-hidden p-0">
      <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
        <div>
          <figcaption className="font-display text-lg leading-tight text-ink">Same forecast. Two resolutions.</figcaption>
          <p className="text-xs text-muted">Night-time minimum across twelve 18 km blocks · drag the handle</p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-frost/10 px-3 py-1 text-xs font-semibold text-frost">
          <Snowflake className="h-3.5 w-3.5" /> {frostCells} frost cells found
        </span>
      </div>

      <div
        ref={wrapRef}
        className="relative aspect-[4/3] w-full cursor-ew-resize touch-none select-none"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={onMove}
        onPointerUp={() => (dragging.current = false)}
        onPointerLeave={() => setHover(null)}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ imageRendering: 'pixelated' }} aria-hidden />

        {/* Side labels */}
        <span className="absolute left-3 top-3 rounded-lg bg-bg/80 px-2.5 py-1 text-[11px] font-semibold text-sun backdrop-blur">18 km block forecast</span>
        <span className="absolute right-3 top-3 rounded-lg bg-bg/80 px-2.5 py-1 text-[11px] font-semibold text-accent backdrop-blur">1.2 km AeroAgro</span>

        {/* Divider + handle */}
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-accent shadow-[0_0_12px_rgb(200_241_105/0.8)]" style={{ left: `${split * 100}%` }}>
          <div className="absolute top-1/2 left-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-accent-ink shadow-glow">
            <MoveHorizontal className="h-5 w-5" />
          </div>
        </div>

        {hover && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg bg-bg/90 px-2.5 py-1.5 text-[11px] leading-tight backdrop-blur"
            style={{ left: `calc(${hover.x * 100}% + 14px)`, top: `calc(${hover.y * 100}% + 14px)` }}
          >
            <div className="text-sun">Block: {hover.coarse.toFixed(1)}°C</div>
            <div className="text-accent">Local: {hover.fine.toFixed(1)}°C</div>
          </div>
        )}

        {/* Accessible control */}
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(split * 100)}
          onChange={(e) => setSplit(Number(e.target.value) / 100)}
          aria-label="Compare 18 km block forecast with 1.2 km downscaled view"
          className="absolute inset-x-0 bottom-0 h-6 w-full opacity-0"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-xs text-muted">
        <div className="flex items-center gap-2">
          <span>≤0°</span>
          <span className="h-2 w-28 rounded-full" style={{ background: RAMP_CSS }} />
          <span>17°C</span>
        </div>
        <span>
          Coolest block says <b className="text-ink">{coarseMin.toFixed(1)}°C</b> · valleys reach <b className="text-frost">{field.min.toFixed(1)}°C</b>
        </span>
      </div>
      <p className="px-5 pb-4 text-[11px] text-muted/80">Illustrative terrain, computed with the same lapse-rate and cold-air-pooling physics as the live engine.</p>
    </figure>
  );
}
