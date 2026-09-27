'use client';

import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Satellite, Loader2 } from 'lucide-react';
import { PanchayatData } from '@/data/all_india_regions';
import type { WeatherMetrics } from '@/lib/microclimate';

interface IMDSatelliteViewerProps {
  activePanchayat: PanchayatData;
  fineMetrics: WeatherMetrics;
  coarseMetrics: WeatherMetrics;
}

const CHANNELS = [
  {
    id: 'ir1',
    name: 'Infrared',
    url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_ir1.jpg',
    what: 'Heat given off by clouds and land, day and night. The whiter the cloud, the colder and taller it is — tall storm clouds bring heavy rain.',
  },
  {
    id: 'vis',
    name: 'Visible',
    url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_vis.jpg',
    what: 'Sunlight reflected by clouds, like a photo from space. Thick rain clouds look bright white; morning valley fog shows up clearly. Daytime only.',
  },
  {
    id: 'wv',
    name: 'Water vapour',
    url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_wv.jpg',
    what: 'Moisture in the middle atmosphere. Bright plumes flowing in from the Arabian Sea or Bay of Bengal feed monsoon rain.',
  },
  {
    id: 'ctbt',
    name: 'Cloud-top temperature',
    url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_ctbt.jpg',
    what: 'Colour-coded cloud-top coldness. Very cold tops (−60 °C and below) mark thunderstorms, hail and cloudburst risk.',
  },
  {
    id: 'loop',
    name: 'Animation',
    url: 'https://mausam.imd.gov.in/Satellite/Converted/IR1.gif',
    what: 'Recent infrared images played as a loop, showing how storm systems are moving across India.',
  },
];

export default function IMDSatelliteViewer({ activePanchayat, fineMetrics, coarseMetrics }: IMDSatelliteViewerProps) {
  const [channelId, setChannelId] = useState('ir1');
  const [cacheBuster, setCacheBuster] = useState(() => Date.now());
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const channel = CHANNELS.find((c) => c.id === channelId) || CHANNELS[0];
  const src = `${channel.url}?v=${cacheBuster}`;

  const reload = () => {
    setLoaded(false);
    setFailed(false);
    setCacheBuster(Date.now());
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="seg max-w-full overflow-x-auto scrollbar-none" role="radiogroup" aria-label="Satellite channel">
          {CHANNELS.map((c) => (
            <button
              key={c.id}
              role="radio"
              aria-checked={channelId === c.id}
              onClick={() => {
                setChannelId(c.id);
                setLoaded(false);
                setFailed(false);
              }}
              className={`seg-btn ${channelId === c.id ? 'seg-on' : ''}`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={reload} className="btn-ghost h-9 px-3 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <a href="https://mausam.imd.gov.in/imd_latest/contents/satellite.php" target="_blank" rel="noopener noreferrer" className="btn-ghost h-9 px-3 text-xs">
            <ExternalLink className="h-3.5 w-3.5" /> IMD portal
          </a>
        </div>
      </div>

      <div className="relative grid aspect-[16/10] w-full place-items-center overflow-hidden rounded-2xl bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={src}
          src={src}
          alt={`IMD INSAT-3DR ${channel.name} image of the Indian region`}
          className={`h-full w-full object-contain transition-opacity duration-500 ${loaded && !failed ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(true);
            setFailed(true);
          }}
        />
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center text-sm text-muted">
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Fetching latest image from IMD…
            </span>
          </div>
        )}
        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <Satellite className="h-8 w-8 text-muted" />
            <p className="text-sm font-semibold text-ink">The IMD image server did not respond</p>
            <p className="max-w-sm text-xs text-muted">It sometimes blocks embedding or is under maintenance. Try Refresh, or open the image directly.</p>
            <a href={channel.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent underline">
              Open {channel.name.toLowerCase()} image
            </a>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-lg bg-bg/80 px-2.5 py-1 text-[11px] text-ink2 backdrop-blur">INSAT-3DR · India Meteorological Department</span>
      </div>

      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl bg-surface2 p-4">
          <div className="text-sm font-semibold text-ink">What the {channel.name.toLowerCase()} image shows</div>
          <p className="mt-1 text-sm leading-relaxed text-ink2">{channel.what}</p>
        </div>
        <div className="rounded-2xl bg-surface2 p-4 text-sm">
          <div className="font-semibold text-ink">From satellite to {activePanchayat.name}</div>
          <p className="mt-1 leading-relaxed text-ink2">
            Satellites and forecast models see India in 4–18 km squares. AeroAgro adds terrain: rain here is{' '}
            <b className="text-ink">{fineMetrics.rainfallMm} mm</b> vs {coarseMetrics.rainfallMm} mm for the block, and the night low{' '}
            <b className="text-ink">{fineMetrics.tempMin}°C</b> vs {coarseMetrics.tempMin}°C.
          </p>
        </div>
      </div>
    </div>
  );
}
