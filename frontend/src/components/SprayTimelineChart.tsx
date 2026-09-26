'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface SprayTimelineChartProps {
  hourlyData: Array<{
    time: string;
    tempC: number;
    windKmh: number;
    status: 'safe' | 'caution' | 'danger';
    reason: string;
  }>;
}

export default function SprayTimelineChart({ hourlyData }: SprayTimelineChartProps) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <span>🚜</span> Hourly Diurnal Microclimate & Spraying Feasibility
        </h3>
        <span className="text-xs text-slate-400 font-medium">Recharts Analytics</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
            <YAxis yAxisId="temp" orientation="left" stroke="#38bdf8" fontSize={11} domain={[15, 40]} />
            <YAxis yAxisId="wind" orientation="right" stroke="#f59e0b" fontSize={11} domain={[0, 30]} />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: '#475569',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: any, name: string) => [
                `${value} ${name === 'Temperature (°C)' ? '°C' : 'km/h'}`,
                name,
              ]}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="tempC"
              name="Temperature (°C)"
              stroke="#38bdf8"
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />
            <Bar
              yAxisId="wind"
              dataKey="windKmh"
              name="Wind Speed (km/h)"
              fill="#f59e0b"
              opacity={0.65}
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Safe (&lt;14 km/h)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Caution (14-18 km/h)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High Drift (&gt;18 km/h)</span>
        </div>
      </div>
    </div>
  );
}
