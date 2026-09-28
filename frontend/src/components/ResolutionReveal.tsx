'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MoveHorizontal, Snowflake } from 'lucide-react';
import { buildRevealField, contourSegments, rasterize, NX, NY, BLOCK, RAMP_CSS, T_LO, T_HI } from '@/lib/revealField';
import { NorthArrow, ScaleBar } from './Instrument';

const RW = 960; // colour raster (the field is smooth, so it scales up cleanly)
const RH = 480;

/** 1 decimal with a true minus sign and no "−0.0" */
const deg = (v: number) => (Math.abs(v) < 0.05 ? '0.0' : v < 0 ? `−${Math.abs(v).toFixed(1)}` : v.toFixed(1));

interface Layers {
  fine: HTMLCanvasElement;
  coarse: HTMLCanvasElement;
  sprite: HTMLCanvasElement;
  contours: ReturnType<typeof contourSegments>;
  frost: { x: number; y: number; s: number }[]; // x, y in 0..1
}

function glowSprite() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(210,245,255,0.75)');
  grad.addColorStop(0.6, 'rgba(120,210,255,0.22)');
  grad.addColorStop(1, 'rgba(120,210,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

export default function ResolutionReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const contourRef = useRef<HTMLCanvasElement | null>(null);
  const layersRef = useRef<Layers | null>(null);
  const field = useMemo(buildRevealField, []);
  const [split, setSplit] = useState(1); // 0 = all 1.2 km, 1 = all 18 km
  const splitRef = useRef(1);
  splitRef.current = split;
  const [ready, setReady] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hover, setHover] = useState<{ x: number; y: number; fine: number; coarse: number } | null>(null);
  const dragging = useRef(false);

  const stats = useMemo(() => {
    // coldest hollow in the half revealed by the intro sweep, away from the edges and corner labels
    const i0 = Math.ceil(NX * 0.55);
    let coldest = 5 * NX + i0;
    for (let j = 5; j < NY - 6; j++)
      for (let i = i0; i < NX - 6; i++) if (field.fine[j * NX + i] < field.fine[coldest]) coldest = j * NX + i;
    const blocks: { x: number; y: number; t: number }[] = [];
    for (let bj = 0; bj < NY / BLOCK; bj++)
      for (let bi = 0; bi < NX / BLOCK; bi++)
        blocks.push({ x: ((bi + 0.5) * BLOCK) / NX, y: ((bj + 0.5) * BLOCK) / NY, t: field.coarse[bj * BLOCK * NX + bi * BLOCK] });
    return {
      frost: field.fine.reduce((n, v) => n + (v <= 2 ? 1 : 0), 0),
      coarseMin: Math.min(...blocks.map((b) => b.t)),
      coldest: { x: ((coldest % NX) + 0.5) / NX, y: (Math.floor(coldest / NX) + 0.5) / NY, t: field.fine[coldest] },
      blocks,
    };
  }, [field]);

  // Build the colour layers off the critical path, after first paint
  useEffect(() => {
    const id = window.setTimeout(() => {
      const r = rasterize(field, RW, RH);
      const mk = (img: ImageData) => {
        const c = document.createElement('canvas');
        c.width = RW;
        c.height = RH;
        c.getContext('2d')!.putImageData(img, 0, 0);
        return c;
      };
      const frost: Layers['frost'] = [];
      field.fine.forEach((t, k) => {
        if (t <= 1) frost.push({ x: ((k % NX) + 0.5) / NX, y: (Math.floor(k / NX) + 0.5) / NY, s: Math.min(1, Math.max(0.3, (1 - t) / 4)) });
      });
      layersRef.current = { fine: mk(r.fine), coarse: mk(r.coarse), sprite: glowSprite(), contours: contourSegments(r, 120), frost };
      setReady(true);
    }, 60);
    return () => clearTimeout(id);
  }, [field]);

  // Canvas follows its box; contour lines are re-drawn crisp at display resolution
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const L = layersRef.current;
    if (!ready || !L || !size.w) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const c = document.createElement('canvas');
    c.width = Math.round(size.w * dpr);
    c.height = Math.round(size.h * dpr);
    const g = c.getContext('2d')!;
    const sx = c.width / RW, sy = c.height / RH;
    g.lineJoin = g.lineCap = 'round';
    for (const { major, seg } of L.contours) {
      g.strokeStyle = major ? 'rgba(255,255,255,0.34)' : 'rgba(255,255,255,0.13)';
      g.lineWidth = (major ? 1.2 : 0.7) * dpr;
      g.beginPath();
      for (let i = 0; i < seg.length; i += 4) {
        g.moveTo(seg[i] * sx, seg[i + 1] * sy);
        g.lineTo(seg[i + 2] * sx, seg[i + 3] * sy);
      }
      g.stroke();
    }
    contourRef.current = c;
  }, [ready, size]);

  // Render loop: frost pockets breathe while the hero is on screen
  useEffect(() => {
    const cv = canvasRef.current;
    const L = layersRef.current;
    if (!ready || !cv || !L || !size.w) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(size.w * dpr);
    cv.height = Math.round(size.h * dpr);
    const ctx = cv.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const W = cv.width, H = cv.height;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    let raf = 0;

    const draw = (time: number) => {
      const x = splitRef.current * W;
      ctx.clearRect(0, 0, W, H);

      // 1.2 km side: thermal relief + contours + glowing frost pockets
      ctx.drawImage(L.fine, 0, 0, W, H);
      if (contourRef.current) ctx.drawImage(contourRef.current, 0, 0);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, 0, W - x, H);
      ctx.clip();
      ctx.globalCompositeOperation = 'lighter';
      const pulse = reduce ? 1 : 0.72 + 0.28 * Math.sin(time / 650);
      const base = (W / NX) * 2.6;
      for (const f of L.frost) {
        const r = base * (0.7 + f.s * 0.8);
        ctx.globalAlpha = 0.34 * f.s * pulse;
        ctx.drawImage(L.sprite, f.x * W - r / 2, f.y * H - r / 2, r, r);
      }
      ctx.restore();

      // 18 km side: flat blocks
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, x, H);
      ctx.clip();
      ctx.drawImage(L.coarse, 0, 0, W, H);
      ctx.restore();

      // block boundaries
      ctx.strokeStyle = 'rgba(10,14,12,0.55)';
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      for (let bi = 1; bi < NX / BLOCK; bi++) {
        const bx = Math.round((bi * BLOCK * W) / NX);
        ctx.moveTo(bx, 0);
        ctx.lineTo(bx, H);
      }
      for (let bj = 1; bj < NY / BLOCK; bj++) {
        const by = Math.round((bj * BLOCK * H) / NY);
        ctx.moveTo(0, by);
        ctx.lineTo(W, by);
      }
      ctx.stroke();

      // scanner light spilling onto the revealed side
      const sweep = ctx.createLinearGradient(x, 0, x + 90 * dpr, 0);
      sweep.addColorStop(0, 'rgba(200,241,105,0.22)');
      sweep.addColorStop(1, 'rgba(200,241,105,0)');
      ctx.fillStyle = sweep;
      ctx.fillRect(x, 0, 90 * dpr, H);

      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    });
    io.observe(cv);
    raf = requestAnimationFrame(draw);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ready, size]);

  // With reduced motion there is no loop, so repaint on every drag
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setSize((s) => ({ ...s }));
  }, [split]);

  // Intro sweep once the layers exist
  useEffect(() => {
    if (!ready) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSplit(0.5);
      return;
    }
    let raf = 0;
    const start = performance.now() + 250;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / 1700));
      const ease = 1 - Math.pow(1 - t, 3);
      if (!dragging.current) setSplit(1 - ease * 0.55);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  const onMove = (e: React.PointerEvent) => {
    const rect = wrapRef.current!.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    const fy = (e.clientY - rect.top) / rect.height;
    const i = Math.min(NX - 1, Math.max(0, Math.floor(fx * NX)));
    const j = Math.min(NY - 1, Math.max(0, Math.floor(fy * NY)));
    setHover({ x: fx, y: fy, fine: field.fine[j * NX + i], coarse: field.coarse[j * NX + i] });
    if (dragging.current) setSplit(Math.min(1, Math.max(0, fx)));
  };

  const cold = stats.coldest;
  const coldShown = ready && cold.x > split + 0.02;
  const diff = hover ? hover.fine - hover.coarse : 0;



  return (
    <figure className="w-full">
      {/* caption row */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Fig. 1 — Night minimum, six district blocks</div>
          <figcaption className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
            The same night, <em className="text-accent">at two resolutions.</em>
          </figcaption>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="text-frost">{T_LO}°</span>
          <span className="h-2 w-40 rounded-full" style={{ background: RAMP_CSS }} />
          <span className="text-sun">{T_HI}°C</span>
          <span className="ml-2 hidden items-center gap-1.5 rounded-full border border-frost/30 px-3 py-1 font-semibold text-frost sm:inline-flex">
            <Snowflake className="h-3.5 w-3.5" /> {stats.frost} hidden frost cells
          </span>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="relative aspect-[2/1] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-[22px] bg-[#1a1540] ring-1 ring-white/10"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          const rect = wrapRef.current!.getBoundingClientRect();
          setSplit(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
        }}
        onPointerMove={onMove}
        onPointerUp={() => (dragging.current = false)}
        onPointerLeave={() => setHover(null)}
      >
        {!ready && <div className="absolute inset-0 animate-pulse" style={{ background: RAMP_CSS, opacity: 0.25 }} />}
        <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`} aria-hidden />

        {/* one number per block on the 18 km side */}
        {ready &&
          stats.blocks.map((b, i) => (
            <div
              key={i}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center transition-opacity duration-300"
              style={{ left: `${b.x * 100}%`, top: `${b.y * 100}%`, opacity: b.x < split - 0.05 ? 1 : 0 }}
            >
              <div className="font-display text-base leading-none text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] sm:text-[34px]">{deg(b.t)}°</div>
              <div className="mt-1.5 hidden font-mono text-[9px] uppercase tracking-[0.18em] text-white/55 md:block">whole block</div>
            </div>
          ))}

        {/* the coldest hollow, only visible at 1.2 km */}
        <div className="pointer-events-none absolute transition-opacity duration-300" style={{ left: `${cold.x * 100}%`, top: `${cold.y * 100}%`, opacity: coldShown ? 1 : 0 }}>
          <span className="absolute -left-2 -top-2 h-4 w-4 animate-pulse-ring rounded-full bg-white/70" />
          <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full border-2 border-white bg-frost" />
          <span className={`absolute top-3 whitespace-nowrap rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white shadow-pop backdrop-blur ${cold.x > 0.75 ? 'right-2' : 'left-2'}`}>
            Frost hollow {deg(cold.t)}°C
          </span>
        </div>

        {/* cartographic furniture */}
        <ScaleBar km={18} widthPct={100 / 6} className="absolute left-3 top-3 hidden sm:block" />
        <NorthArrow className="absolute right-3 top-2.5" />

        <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold text-[#F6B94C] backdrop-blur">District forecast · 18 km</span>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold text-[#D4F25A] backdrop-blur">AeroAgro · 1.2 km</span>

        {/* divider + handle */}
        <div className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-[#D4F25A] shadow-[0_0_24px_6px_rgb(212_242_90/0.45)]" style={{ left: `${split * 100}%` }}>
          <div className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#D4F25A] text-[#0C120A] shadow-[0_0_0_6px_rgb(0_0_0/0.25)]">
            <MoveHorizontal className="h-5 w-5" />
          </div>
        </div>

        {hover && (
          <div
            className="pointer-events-none absolute z-10 min-w-[140px] rounded-2xl border border-white/10 bg-black/70 px-3.5 py-2.5 text-[11px] leading-snug text-white shadow-pop backdrop-blur"
            style={{
              left: hover.x > 0.72 ? undefined : `calc(${hover.x * 100}% + 16px)`,
              right: hover.x > 0.72 ? `calc(${(1 - hover.x) * 100}% + 16px)` : undefined,
              top: `calc(${Math.min(hover.y, 0.75) * 100}% + 12px)`,
            }}
          >
            <div className="flex justify-between gap-3 text-[#F6B94C]">
              <span>District</span>
              <b className="tabular">{deg(hover.coarse)}°C</b>
            </div>
            <div className="flex justify-between gap-3 text-[#D4F25A]">
              <span>Village</span>
              <b className="tabular">{deg(hover.fine)}°C</b>
            </div>
            {Math.abs(diff) >= 0.5 && (
              <div className={`mt-1 border-t border-white/10 pt-1 font-semibold ${diff < 0 ? 'text-[#A5D8FF]' : 'text-[#F6B94C]'}`}>
                {Math.abs(diff).toFixed(1)}° {diff < 0 ? 'colder' : 'warmer'} than forecast
              </div>
            )}
          </div>
        )}

        {/* keyboard / screen-reader control */}
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(split * 100)}
          onChange={(e) => setSplit(Number(e.target.value) / 100)}
          aria-label="Compare 18 km district forecast with the 1.2 km AeroAgro view"
          className="absolute inset-x-0 bottom-0 h-6 w-full opacity-0"
        />
      </div>

      {/* three-part caption, magazine style */}
      <div className="mt-6 grid gap-6 border-t border-line/[0.14] pt-6 sm:grid-cols-3">
        {[
          ['18 km', 'What the district forecast sees', `One number for 324 km². The coldest block says ${deg(stats.coarseMin)} °C: no frost warning.`],
          ['1.2 km', 'What AeroAgro sees', 'Lapse rate and cold-air pooling on real terrain: 225 cells inside every block.'],
          [`${deg(cold.t)} °C`, 'What the farmer needed to know', `${stats.frost} cells fall to frost range in hollows the district number averages away.`],
        ].map(([big, k, v], i) => (
          <div key={k}>
            <div className={`font-display text-4xl ${i === 2 ? 'text-frost' : i === 1 ? 'text-accent' : 'text-sun'}`}>{big}</div>
            <div className="mt-1 text-sm font-semibold text-ink">{k}</div>
            <p className="mt-1 text-sm leading-relaxed text-ink2">{v}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}