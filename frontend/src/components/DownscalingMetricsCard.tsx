'use client';

import React from 'react';
import { CloudRain, Thermometer, Wind, Droplets, ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';

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
  const deltaRain = fine.rainfallMm - coarse.rainfallMm;
  const deltaTempMin = (fine.tempMin - coarse.tempMin).toFixed(1);
  const rainRatio = coarse.rainfallMm > 0 ? (fine.rainfallMm / coarse.rainfallMm).toFixed(1) : '1.0';

  return (
    <div className="orchids-glass rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-white/10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Downscaled Ground-Truth Focus</span>
          </div>
          <h2 className="text-base font-extrabold text-white leading-tight">{panchayatName}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {elevationM}m MSL • <span className="text-slate-300 font-medium">{terrainType}</span>
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 font-mono shrink-0">
          1.2 km² Physics
        </span>
      </div>

      {/* Before vs After Metric Comparison Rows */}
      <div className="flex flex-col gap-2.5">
        
        {/* Metric 1: Precipitation (Rainfall) */}
        <div className="bg-black/35 border border-white/5 rounded-2xl p-3 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-semibold text-slate-200">
              <CloudRain className="w-4 h-4 text-cyan-400" /> 24h Precipitation
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
              {deltaRain >= 0 ? `+${deltaRain.toFixed(1)} mm (+${rainRatio}x)` : `${deltaRain.toFixed(1)} mm`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">18km Block Baseline</span>
              <span className="text-sm font-semibold text-slate-400">{coarse.rainfallMm} mm</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-cyan-400 block font-bold uppercase">1.2km Downscaled</span>
              <span className="text-base font-black text-cyan-300 font-mono">{fine.rainfallMm} mm</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Temperature Range */}
        <div className="bg-black/35 border border-white/5 rounded-2xl p-3 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Thermometer className="w-4 h-4 text-amber-400" /> Diurnal Temperature
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
              {isWinter ? `Inversion: ${deltaTempMin}°C` : `Lapse: -6.5°C/km`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">18km Block Forecast</span>
              <span className="text-sm font-semibold text-slate-400">{coarse.tempMin}° - {coarse.tempMax}°C</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-amber-400 block font-bold uppercase">1.2km Downscaled</span>
              <span className="text-base font-black text-amber-300 font-mono">{fine.tempMin}° - {fine.tempMax}°C</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Wind & Relative Humidity Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Wind */}
          <div className="bg-black/35 border border-white/5 rounded-2xl p-2.5">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
              <Wind className="w-3.5 h-3.5 text-slate-300" />
              <span>Wind Speed</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500">{coarse.windSpeedKmh} km/h</span>
              <span className="text-sm font-extrabold text-white font-mono">{fine.windSpeedKmh} km/h</span>
            </div>
            <div className="text-[9px] text-emerald-400 font-mono mt-1">
              Terrain Roughness Adjusted
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-black/35 border border-white/5 rounded-2xl p-2.5">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
              <Droplets className="w-3.5 h-3.5 text-emerald-400" />
              <span>Humidity (RH)</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500">{coarse.relativeHumidity}%</span>
              <span className="text-sm font-extrabold text-emerald-300 font-mono">{fine.relativeHumidity}%</span>
            </div>
            <div className="text-[9px] text-cyan-400 font-mono mt-1">
              Magnus Vapor Equilibrium
            </div>
          </div>
        </div>

      </div>

      {/* Physics-Informed Formulation Chip */}
      <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-3 font-mono text-[10px] text-slate-300">
        <div className="text-slate-500 mb-1 flex items-center justify-between">
          <span>// Topographic Downscaling Physics:</span>
          <span className="text-emerald-400">NASA SRTM 30m</span>
        </div>
        <div className="text-white font-semibold leading-relaxed">
          {isWinter
            ? `T_local = T_coarse - (DA × 7.4°C) [Katabatic Drainage Pooling]`
            : `P_local = P_coarse × [1 + (Δz / 300) × 0.95 × sin(θ)]`}
        </div>
      </div>
    </div>
  );
}
