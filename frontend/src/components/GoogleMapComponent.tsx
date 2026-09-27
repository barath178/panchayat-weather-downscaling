'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Building2, Trees, Compass, RotateCcw, Radio, RefreshCw, Crosshair, LocateFixed, Loader2 } from 'lucide-react';
import L from 'leaflet';
import type { PanchayatData } from '@/data/all_india_regions';
import type { WeatherMetrics } from '@/lib/microclimate';
import type { MapVariable } from '@/app/page';

interface GoogleMapComponentProps {
  panchayats: PanchayatData[];
  selectedId: string;
  onSelectPanchayat: (id: string) => void;
  activeVariable: MapVariable;
  onVariableChange: (v: MapVariable) => void;
  viewMode: 'fine' | 'coarse';
  onViewModeChange: (m: 'fine' | 'coarse') => void;
  regionMetrics: Record<string, { coarse: WeatherMetrics; fine: WeatherMetrics }>;
  liveLoading?: boolean;
}

type MapType = 'terrain' | 'satellite' | 'roadmap' | 'dark';

const INDIA_CENTER: [number, number] = [22.5937, 78.9629];

const STATE_CENTERS: Record<string, { center: [number, number]; zoom: number }> = {
  all: { center: INDIA_CENTER, zoom: 5 },
  'Tamil Nadu': { center: [11.1271, 78.6569], zoom: 7 },
  Maharashtra: { center: [19.7515, 75.7139], zoom: 6.75 },
  Gujarat: { center: [22.2587, 71.1924], zoom: 7 },
  Rajasthan: { center: [26.8, 73.8], zoom: 6.5 },
  Karnataka: { center: [14.8, 76.0], zoom: 7 },
  'Uttar Pradesh': { center: [26.8467, 80.9462], zoom: 6.75 },
  'Delhi NCR': { center: [28.6139, 77.209], zoom: 9.5 },
  Kerala: { center: [10.3, 76.4], zoom: 7.5 },
  'West Bengal': { center: [23.8, 88.0], zoom: 7 },
  'Punjab & Haryana': { center: [30.2, 75.9], zoom: 7.5 },
  'Andhra Pradesh': { center: [15.9129, 79.74], zoom: 7 },
  Telangana: { center: [17.9, 79.0], zoom: 7.5 },
  'Andhra Pradesh & Telangana': { center: [16.5, 79.5], zoom: 6.75 },
  'Madhya Pradesh & Chhattisgarh': { center: [22.9734, 79.5], zoom: 6.5 },
  'Himachal Pradesh, J&K, Uttarakhand': { center: [32.0, 77.0], zoom: 6.75 },
  'Bihar & Jharkhand': { center: [24.8, 85.5], zoom: 7 },
  'Assam, North-East & Odisha': { center: [23.5, 89.0], zoom: 6 },
};

// IMD INSAT-3D Asia-sector image bounds [lat, lng]
const IMD_SATELLITE_BOUNDS: [[number, number], [number, number]] = [
  [-4.0, 52.0],
  [39.5, 101.5],
];

const IMD_OVERLAY_CHANNELS: Record<string, { url: string; label: string }> = {
  ir1: { url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_ir1.jpg', label: 'IR-1' },
  vis: { url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_vis.jpg', label: 'Visible' },
  wv: { url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_wv.jpg', label: 'Water vapour' },
  ctbt: { url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_ctbt.jpg', label: 'CTBT' },
};

// ---------- colour scales (single-hue sequential; blue↔red diverging for temperature) ----------

const BLUE = ['#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#256abf', '#184f95', '#0d366b'];
const ORANGE = ['#fde0cf', '#f9b995', '#f2915c', '#eb6834', '#c4501f', '#9a3c14', '#6e2a0c'];
const DIVERGING = ['#104281', '#2a78d6', '#86b6ef', '#9a9993', '#f0a3a3', '#e34948', '#a52626'];

interface Scale {
  title: string;
  unit: string;
  stops: number[]; // lower bound for each colour
  colors: string[];
  value: (m: WeatherMetrics) => number;
  sequential: boolean;
}

const SCALES: Record<MapVariable, Scale> = {
  rainfall: { title: 'Rainfall', unit: 'mm/day', stops: [0, 1, 5, 10, 20, 40, 70], colors: BLUE, value: (m) => m.rainfallMm, sequential: true },
  wind: { title: 'Wind', unit: 'km/h', stops: [0, 5, 10, 15, 20, 30, 40], colors: ORANGE, value: (m) => m.windSpeedKmh, sequential: true },
  tempMin: { title: 'Night minimum', unit: '°C', stops: [-50, 4, 10, 16, 20, 24, 28], colors: DIVERGING, value: (m) => m.tempMin, sequential: false },
  tempMax: { title: 'Day maximum', unit: '°C', stops: [-50, 16, 22, 28, 32, 36, 40], colors: DIVERGING, value: (m) => m.tempMax, sequential: false },
};

const VARIABLE_TABS: { id: MapVariable; label: string }[] = [
  { id: 'rainfall', label: 'Rain' },
  { id: 'tempMin', label: 'Min °C' },
  { id: 'tempMax', label: 'Max °C' },
  { id: 'wind', label: 'Wind' },
];

function colorFor(scale: Scale, v: number, darkBase: boolean) {
  let i = 0;
  while (i + 1 < scale.stops.length && v >= scale.stops[i + 1]) i++;
  // On a dark basemap a sequential ramp runs dark→light so "more" stays the most prominent.
  const colors = scale.sequential && darkBase ? [...scale.colors].reverse() : scale.colors;
  return colors[i];
}

const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

function tileLayer(type: MapType): L.Layer {
  const common = { maxZoom: 20, keepBuffer: 4 };
  const google = (lyrs: string, attribution: string) =>
    L.tileLayer(`https://mt{s}.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}`, { subdomains: ['0', '1', '2', '3'], attribution, ...common });
  if (type === 'terrain') return google('p', '© Google');
  if (type === 'satellite') return google('y', '© Google');
  if (type === 'roadmap') return google('m', '© Google');
  // Esri dark canvas: keyless (CARTO basemaps now require an API key)
  const esri = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas';
  return L.layerGroup([
    L.tileLayer(`${esri}/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`, { attribution: 'Tiles © Esri', maxNativeZoom: 16, ...common }),
    L.tileLayer(`${esri}/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`, { maxNativeZoom: 16, ...common }),
  ]);
}

export default function GoogleMapComponent({
  panchayats,
  selectedId,
  onSelectPanchayat,
  activeVariable,
  onVariableChange,
  viewMode,
  onViewModeChange,
  regionMetrics,
  liveLoading,
}: GoogleMapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.Layer | null>(null);
  const imdOverlayRef = useRef<L.ImageOverlay | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const polygonsRef = useRef<L.LayerGroup | null>(null);
  const coarseRectRef = useRef<L.Rectangle | null>(null);
  const userLayerRef = useRef<L.LayerGroup | null>(null);

  const [mapType, setMapType] = useState<MapType>('dark');
  const [activeStateFilter, setActiveStateFilter] = useState('all');
  const [filterType, setFilterType] = useState<'all' | 'urban' | 'rural'>('all');
  const [hovered, setHovered] = useState<PanchayatData | null>(null);

  const [showImdOverlay, setShowImdOverlay] = useState(false);
  const [imdChannel, setImdChannel] = useState('ir1');
  const [imdOpacity, setImdOpacity] = useState(0.65);
  const [imdError, setImdError] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(() => Date.now());

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'found' | 'denied' | 'error'>('idle');
  const [nearest, setNearest] = useState<(PanchayatData & { distanceKm: number }) | null>(null);

  const scale = SCALES[activeVariable];
  const darkBase = mapType === 'dark' || mapType === 'satellite';

  const activePanchayat = useMemo(() => panchayats.find((p) => p.id === selectedId) || panchayats[0], [panchayats, selectedId]);
  const availableStates = useMemo(() => Array.from(new Set(panchayats.map((p) => p.state))).sort(), [panchayats]);

  // Keep the latest callback in a ref so Leaflet handlers never go stale.
  const onSelectRef = useRef(onSelectPanchayat);
  onSelectRef.current = onSelectPanchayat;

  // 1. Initialise the map once
  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el || mapRef.current) return;

    const map = L.map(el, {
      center: INDIA_CENTER,
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false,
      preferCanvas: true,
      renderer: L.canvas({ padding: 0.5, tolerance: 8 }),
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 120,
    });
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    polygonsRef.current = L.layerGroup().addTo(map);
    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // 2. Base layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
    tileLayerRef.current = tileLayer(mapType).addTo(map);
  }, [mapType]);

  // 3. IMD satellite overlay
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (imdOverlayRef.current) {
      map.removeLayer(imdOverlayRef.current);
      imdOverlayRef.current = null;
    }
    if (!showImdOverlay) return;
    setImdError(false);
    const cfg = IMD_OVERLAY_CHANNELS[imdChannel] || IMD_OVERLAY_CHANNELS.ir1;
    const overlay = L.imageOverlay(`${cfg.url}?v=${cacheBuster}`, IMD_SATELLITE_BOUNDS, { opacity: imdOpacity, interactive: false });
    overlay.on('error', () => setImdError(true));
    overlay.addTo(map);
    imdOverlayRef.current = overlay;
    // Only rebuild when the image changes; opacity is handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showImdOverlay, imdChannel, cacheBuster]);

  useEffect(() => {
    imdOverlayRef.current?.setOpacity(imdOpacity);
  }, [imdOpacity]);

  // 4. Markers coloured by the active variable
  useEffect(() => {
    const map = mapRef.current;
    const markers = markersRef.current;
    const polygons = polygonsRef.current;
    if (!map || !markers || !polygons) return;

    markers.clearLayers();
    polygons.clearLayers();
    const zoomedState = activeStateFilter !== 'all';

    let selectedMarker: L.CircleMarker | null = null;
    panchayats.forEach((p) => {
      if (zoomedState && p.state !== activeStateFilter) return;
      if (filterType === 'urban' && !p.isUrban) return;
      if (filterType === 'rural' && p.isUrban) return;

      const m = regionMetrics[p.id]?.[viewMode];
      const isSelected = p.id === selectedId;
      const fill = m ? colorFor(scale, scale.value(m), darkBase) : '#64748b';

      const marker = L.circleMarker([p.lat, p.lng], {
        radius: isSelected ? 11 : zoomedState ? 7 : 5.5,
        fillColor: fill,
        fillOpacity: 0.95,
        color: isSelected ? '#34d399' : darkBase ? 'rgba(226,232,240,0.55)' : '#ffffff',
        weight: isSelected ? 4 : 1.5,
      });
      marker.on('click', () => onSelectRef.current(p.id));
      marker.on('mouseover', () => setHovered(p));
      marker.on('mouseout', () => setHovered((h) => (h?.id === p.id ? null : h)));
      markers.addLayer(marker);
      if (isSelected) selectedMarker = marker;

      if (isSelected || zoomedState) {
        const polygon = L.polygon(p.polygonCoords, {
          color: isSelected ? '#34d399' : '#38bdf8',
          weight: isSelected ? 2 : 1,
          opacity: isSelected ? 0.9 : 0.4,
          fillColor: isSelected ? '#10b981' : '#0284c7',
          fillOpacity: isSelected ? 0.15 : 0.05,
        });
        polygon.on('click', () => onSelectRef.current(p.id));
        polygons.addLayer(polygon);
      }
    });
    (selectedMarker as L.CircleMarker | null)?.bringToFront();

    // Coarse 18 km block footprint around the selected region
    if (coarseRectRef.current) map.removeLayer(coarseRectRef.current);
    const dLat = 9 / 111; // ±9 km
    const dLng = 9 / (111 * Math.cos((activePanchayat.lat * Math.PI) / 180));
    coarseRectRef.current = L.rectangle(
      [
        [activePanchayat.lat - dLat, activePanchayat.lng - dLng],
        [activePanchayat.lat + dLat, activePanchayat.lng + dLng],
      ],
      {
        color: '#f59e0b',
        weight: viewMode === 'coarse' ? 2.5 : 1.5,
        dashArray: viewMode === 'coarse' ? undefined : '4 6',
        fillColor: '#f59e0b',
        fillOpacity: viewMode === 'coarse' ? 0.2 : 0.04,
        interactive: false,
      }
    ).addTo(map);
  }, [panchayats, selectedId, activeStateFilter, filterType, viewMode, regionMetrics, scale, darkBase, activePanchayat]);

  // 5. Follow the selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const c = map.getCenter();
    if (Math.hypot(c.lat - activePanchayat.lat, c.lng - activePanchayat.lng) > 0.01) {
      map.flyTo([activePanchayat.lat, activePanchayat.lng], Math.max(map.getZoom(), 8), { duration: 0.7 });
    }
  }, [activePanchayat]);

  const handleStateChange = (stateName: string) => {
    setActiveStateFilter(stateName);
    const target = STATE_CENTERS[stateName] || STATE_CENTERS.all;
    mapRef.current?.flyTo(target.center, target.zoom, { duration: 0.9 });
  };

  const handleLocateUser = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude, accuracy } }) => {
        setUserLocation({ lat: latitude, lng: longitude, accuracy });
        setLocationStatus('found');

        let best: PanchayatData | null = null;
        let minDist = Infinity;
        for (const p of panchayats) {
          const d = haversineKm(latitude, longitude, p.lat, p.lng);
          if (d < minDist) {
            minDist = d;
            best = p;
          }
        }
        const map = mapRef.current;
        if (!best || !map) return;
        const dist = Math.round(minDist * 10) / 10;
        setNearest({ ...best, distanceKm: dist });
        setActiveStateFilter('all');
        onSelectRef.current(best.id);

        if (userLayerRef.current) map.removeLayer(userLayerRef.current);
        const group = L.layerGroup([
          L.circle([latitude, longitude], { radius: Math.min(accuracy, 5000), color: '#3b82f6', weight: 1.5, fillOpacity: 0.08, dashArray: '4 6', interactive: false }),
          L.polyline([[latitude, longitude], [best.lat, best.lng]], { color: '#f97316', weight: 2, dashArray: '6 8', interactive: false }),
          L.circleMarker([latitude, longitude], { radius: 8, fillColor: '#3b82f6', fillOpacity: 1, color: '#ffffff', weight: 3 }).bindTooltip('You are here'),
        ]).addTo(map);
        userLayerRef.current = group;
        map.flyToBounds(L.latLngBounds([[latitude, longitude], [best.lat, best.lng]]).pad(0.5), { duration: 1.2, maxZoom: 10 });
      },
      (error) => setLocationStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'error'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  }, [panchayats]);

  const hoveredMetrics = hovered ? regionMetrics[hovered.id]?.[viewMode] : undefined;
  const activeMetrics = regionMetrics[activePanchayat.id]?.[viewMode];
  const legendColors = scale.sequential && darkBase ? [...scale.colors].reverse() : scale.colors;

  const segBtn = (on: boolean, onCls: string) =>
    `px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${on ? onCls : 'text-slate-400 hover:text-white'}`;

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden border border-white/10 shadow-[0_24px_50px_rgba(0,0,0,0.6)] bg-[#080d1a]">
      <div ref={mapContainerRef} className="w-full h-full z-0" aria-label="Map of monitored regions" />

      {/* Toolbar */}
      <div className="absolute top-3 inset-x-3 z-[1000] flex flex-col items-center gap-2 pointer-events-none">
        <div className="pointer-events-auto max-w-full overflow-x-auto scrollbar-none rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.7)]">
          <div className="flex items-center gap-1.5 p-1.5 text-xs text-white w-max">
            <div className="flex items-center gap-1.5 pl-2 pr-1 border-r border-white/10">
              <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                value={activeStateFilter}
                aria-label="Filter by state"
                onChange={(e) => handleStateChange(e.target.value)}
                className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer max-w-[170px]"
              >
                <option value="all" className="bg-slate-900">All India ({panchayats.length})</option>
                {availableStates.map((st) => (
                  <option key={st} value={st} className="bg-slate-900">
                    {st} ({panchayats.filter((p) => p.state === st).length})
                  </option>
                ))}
              </select>
              {activeStateFilter !== 'all' && (
                <button onClick={() => handleStateChange('all')} aria-label="Reset to all India" className="p-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300">
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center bg-black/40 p-0.5 rounded-xl border border-white/5" role="group" aria-label="Map variable">
              {VARIABLE_TABS.map((v) => (
                <button key={v.id} onClick={() => onVariableChange(v.id)} aria-pressed={activeVariable === v.id} className={segBtn(activeVariable === v.id, 'bg-emerald-500 text-slate-950 font-bold')}>
                  {v.label}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-black/40 p-0.5 rounded-xl border border-white/5" role="group" aria-label="Resolution">
              <button onClick={() => onViewModeChange('fine')} aria-pressed={viewMode === 'fine'} className={segBtn(viewMode === 'fine', 'bg-emerald-500 text-slate-950 font-bold')}>
                1.2 km
              </button>
              <button onClick={() => onViewModeChange('coarse')} aria-pressed={viewMode === 'coarse'} className={segBtn(viewMode === 'coarse', 'bg-amber-500 text-slate-950 font-bold')}>
                18 km
              </button>
            </div>

            <div className="flex items-center bg-black/40 p-0.5 rounded-xl border border-white/5" role="group" aria-label="Filter type">
              <button onClick={() => setFilterType('all')} className={segBtn(filterType === 'all', 'bg-white/15 text-white')}>All</button>
              <button onClick={() => setFilterType('urban')} className={segBtn(filterType === 'urban', 'bg-white/15 text-white')}>
                <Building2 className="w-3 h-3" /> Metro
              </button>
              <button onClick={() => setFilterType('rural')} className={segBtn(filterType === 'rural', 'bg-white/15 text-white')}>
                <Trees className="w-3 h-3" /> Agro
              </button>
            </div>

            <div className="flex items-center bg-black/40 p-0.5 rounded-xl border border-white/5" role="group" aria-label="Base map">
              {(['dark', 'terrain', 'satellite', 'roadmap'] as MapType[]).map((t) => (
                <button key={t} onClick={() => setMapType(t)} aria-pressed={mapType === t} className={segBtn(mapType === t, 'bg-white/15 text-white')}>
                  {t === 'dark' ? 'Dark' : t === 'terrain' ? 'Relief' : t === 'satellite' ? 'Satellite' : 'Roads'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowImdOverlay((s) => !s)}
              aria-pressed={showImdOverlay}
              title="Overlay IMD INSAT-3DR satellite imagery (mausam.imd.gov.in)"
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap ${
                showImdOverlay ? 'bg-cyan-500 text-slate-950 border-cyan-300' : 'bg-blue-950/60 border-blue-500/30 text-blue-200 hover:bg-blue-900/50'
              }`}
            >
              <Radio className="w-3.5 h-3.5" /> IMD Satellite
            </button>

            <button
              onClick={handleLocateUser}
              disabled={locationStatus === 'detecting'}
              title="Use my GPS location to find the nearest monitored region"
              className="px-3 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 border whitespace-nowrap bg-rose-950/60 border-rose-500/30 text-rose-200 hover:bg-rose-900/50 disabled:opacity-70"
            >
              {locationStatus === 'detecting' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LocateFixed className="w-3.5 h-3.5" />}
              {locationStatus === 'detecting' ? 'Locating…' : 'My location'}
            </button>
          </div>
        </div>

        {showImdOverlay && (
          <div className="pointer-events-auto max-w-full overflow-x-auto scrollbar-none rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/40 animate-fade-in">
            <div className="flex items-center gap-2 p-1.5 px-3 text-xs text-white w-max">
              <span className="text-[10px] font-mono text-cyan-300 font-bold">INSAT-3DR</span>
              <div className="flex items-center gap-1 bg-black/50 p-0.5 rounded-xl">
                {Object.entries(IMD_OVERLAY_CHANNELS).map(([k, cfg]) => (
                  <button key={k} onClick={() => setImdChannel(k)} className={segBtn(imdChannel === k, 'bg-cyan-500 text-slate-950 font-bold')}>
                    {cfg.label}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-1.5 pl-2 border-l border-white/10 text-[10px] text-slate-400">
                Opacity
                <input type="range" min="0.2" max="0.95" step="0.05" value={imdOpacity} onChange={(e) => setImdOpacity(parseFloat(e.target.value))} className="w-16 accent-cyan-400" />
              </label>
              <button onClick={() => setCacheBuster(Date.now())} aria-label="Reload satellite image" className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300">
                <RefreshCw className="w-3 h-3" />
              </button>
              {imdError && <span className="text-[10px] text-rose-300">IMD server unreachable – try again later</span>}
            </div>
          </div>
        )}
      </div>

      {/* Hover card */}
      {hovered && (
        <div className="hidden sm:block absolute top-24 left-4 z-[1000] pointer-events-none bg-slate-950/95 backdrop-blur-2xl border border-white/15 p-3 rounded-2xl shadow-2xl w-64 animate-fade-in">
          <div className="flex items-center justify-between gap-2">
            <strong className="text-white text-xs font-bold truncate">{hovered.name}</strong>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-white/10 text-slate-200">{hovered.isUrban ? 'Metro' : 'Agro'}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {hovered.district}, {hovered.state} · {hovered.elevationM} m
          </div>
          {hoveredMetrics && (
            <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-white/10 text-center">
              <div><div className="text-[9px] text-slate-500">Rain</div><div className="text-xs font-bold text-white">{hoveredMetrics.rainfallMm} mm</div></div>
              <div><div className="text-[9px] text-slate-500">Temp</div><div className="text-xs font-bold text-white">{hoveredMetrics.tempMin}–{hoveredMetrics.tempMax}°</div></div>
              <div><div className="text-[9px] text-slate-500">Wind</div><div className="text-xs font-bold text-white">{hoveredMetrics.windSpeedKmh}</div></div>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-slate-950/90 backdrop-blur-xl px-3 py-2 rounded-2xl border border-white/10 text-[10px] text-slate-300 w-[210px] pointer-events-none">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-white">
            {scale.title} <span className="font-normal text-slate-400">({scale.unit})</span>
          </span>
          <span className={viewMode === 'fine' ? 'text-emerald-300' : 'text-amber-300'}>{viewMode === 'fine' ? '1.2 km' : '18 km'}</span>
        </div>
        <div className="flex h-2.5 rounded overflow-hidden">
          {legendColors.map((c) => (
            <span key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>
        <div className="flex justify-between mt-0.5 font-mono text-slate-400">
          {scale.stops.slice(1).map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
        {activeMetrics && (
          <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between">
            <span className="truncate">{activePanchayat.name}</span>
            <strong className="text-white font-mono">{scale.value(activeMetrics)}</strong>
          </div>
        )}
        {liveLoading && (
          <div className="mt-1 flex items-center gap-1 text-amber-300">
            <Loader2 className="w-3 h-3 animate-spin" /> Loading live national grid…
          </div>
        )}
      </div>

      {/* Geolocation result */}
      {locationStatus === 'found' && userLocation && nearest && (
        <div className="absolute bottom-3 left-14 z-[1000] bg-slate-950/95 backdrop-blur-2xl border border-blue-500/40 p-3 rounded-2xl shadow-2xl max-w-[240px] animate-fade-in">
          <div className="text-[10px] text-slate-400">Nearest monitored region</div>
          <div className="text-white text-xs font-bold">{nearest.name}</div>
          <div className="text-[10px] text-slate-400">{nearest.district}, {nearest.state}</div>
          <div className="text-[10px] text-orange-300 mt-1 font-semibold">{nearest.distanceKm} km from you (±{Math.round(userLocation.accuracy)} m)</div>
          <button onClick={() => setLocationStatus('idle')} className="mt-1.5 text-[10px] text-slate-400 hover:text-white underline">Dismiss</button>
        </div>
      )}

      {(locationStatus === 'denied' || locationStatus === 'error') && (
        <div role="alert" className="absolute bottom-3 left-14 z-[1000] bg-slate-950/95 border border-rose-500/40 p-3 rounded-2xl shadow-2xl max-w-[240px] animate-fade-in">
          <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
            <Crosshair className="w-3.5 h-3.5" />
            {locationStatus === 'denied' ? 'Location access denied' : 'Location unavailable'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {locationStatus === 'denied' ? 'Allow location access in your browser settings.' : 'Could not get a GPS fix. Try again.'}
          </div>
          <button onClick={() => setLocationStatus('idle')} className="mt-1.5 text-[10px] text-slate-400 hover:text-white underline">Dismiss</button>
        </div>
      )}
    </div>
  );
}
