'use client';

import React from 'react';
import { Layers, Droplets, Thermometer, Wind, Compass } from 'lucide-react';

interface MetricsCardProps {
  panchayatName: string;
  elevationM: number;
  terrainType: string;
  coarse: {
    tempMax: number;
    tempMin: number;
    rainfallMm: number;
    windSpeedKmh: number;
    relativeHumidity: number;
  };
  fine: {
    tempMax: number;
    tempMin: number;
    rainfallMm: number;
    windSpeedKmh: number;
    relativeHumidity: number;
  };
  scenario: string;
}

export default function DownscalingMetricsCard({
  panchayatName,
  elevationM,
  terrainType,
  coarse,
  fine,
  scenario,
}: MetricsCardProps) {
  const isWinter = scenario === 'winter_frost';
  const deltaT = (fine.tempMin - coarse.tempMin).toFixed(1);
  const rainRatio = coarse.rainfallMm > 0 ? (fine.rainfallMm / coarse.rainfallMm).toFixed(1) : '1.0';

  return (
    <div className="orchids-glass rounded-2xl p-4 shadow-orchids-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Focus</span>
          <h2 className="text-sm font-bold text-white">{panchayatName}</h2>
          <p className="text-[11px] text-slate-400">{elevationM}m • {terrainType}</p>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400 font-mono">
          XGBoost + RF Downscaled
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        
        {/* Rainfall Card */}
        <div className="bg-black/30 border border-white/5 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-cyan-400" /> Precipitation</span>
            <span className="text-[9px] text-slate-500 font-mono">18km vs 1.2km</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400 line-through">{coarse.rainfallMm} mm</span>
            <span className="text-sm font-extrabold text-cyan-300">{fine.rainfallMm} mm</span>
          </div>
          <div className="text-[9px] text-emerald-400 mt-1 font-mono">
            Orographic Lift: {rainRatio}x
          </div>
        </div>

        {/* Temperature Card */}
        <div className="bg-black/30 border border-white/5 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1"><Thermometer className="w-3 h-3 text-amber-400" /> Temperature</span>
            <span className="text-[9px] text-slate-500 font-mono">Min / Max</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400">{coarse.tempMin}° - {coarse.tempMax}°</span>
            <span className="text-sm font-extrabold text-amber-300">{fine.tempMin}° - {fine.tempMax}°C</span>
          </div>
          <div className="text-[9px] text-cyan-400 mt-1 font-mono">
            {isWinter ? `Inversion: ${deltaT}°C` : `Lapse Rate: -6.5°C/km`}
          </div>
        </div>

        {/* Wind Speed Card */}
        <div className="bg-black/30 border border-white/5 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-slate-300" /> Wind Velocity</span>
            <span className="text-[9px] text-slate-500 font-mono">10m Speed</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400">{coarse.windSpeedKmh} k/h</span>
            <span className="text-sm font-extrabold text-white">{fine.windSpeedKmh} km/h</span>
          </div>
          <div className="text-[9px] text-slate-400 mt-1 font-mono">
            Ridge Speedup S = 1.0 + 2(h/L)
          </div>
        </div>

        {/* Relative Humidity Card */}
        <div className="bg-black/30 border border-white/5 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1"><Compass className="w-3 h-3 text-emerald-400" /> Relative Humidity</span>
            <span className="text-[9px] text-slate-500 font-mono">Magnus Sat</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400">{coarse.relativeHumidity}%</span>
            <span className="text-sm font-extrabold text-emerald-400">{fine.relativeHumidity}%</span>
          </div>
          <div className="text-[9px] text-emerald-400 mt-1 font-mono">
            Canopy Vapor Adjusted
          </div>
        </div>

      </div>

      {/* Physics Equation Pill */}
      <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2.5 mt-1 font-mono text-[10px] text-cyan-300">
        <span className="text-slate-500">// Physics-Informed ML Equation:</span>
        <div className="mt-0.5 text-white">
          {isWinter
            ? `T_min = T_coarse - (DA × 7.4°C) [Nocturnal Katabatic Drainage]`
            : `P_local = P_coarse × [1 + (Δz / 300) × 0.95 × sin(θ)]`}
        </div>
      </div>
    </div>
  );
}
