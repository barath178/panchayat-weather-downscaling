'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Layers, LocateFixed, Loader2, RefreshCw, X, Check, Satellite } from 'lucide-react';
import L from 'leaflet';
import type { PanchayatData } from '@/data/all_india_regions';
import type { WeatherMetrics } from '@/lib/microclimate';
import type { MapVariable } from '@/app/page';
import { getPosition, nearestRegion } from '@/lib/geo';

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

const ACCENT = '#C8F169';
const SUN = '#F6B94C';
const INDIA_CENTER: [number, number] = [22.5937, 80.5];

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

const IMD_SATELLITE_BOUNDS: [[number, number], [number, number]] = [
  [-4.0, 52.0],
  [39.5, 101.5],
];

const IMD_OVERLAY_CHANNELS: Record<string, { url: string; label: string }> = {
  ir1: { url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_ir1.jpg', label: 'Infrared' },
  vis: { url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_vis.jpg', label: 'Visible' },
  wv: { url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_wv.jpg', label: 'Water vapour' },
  ctbt: { url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_ctbt.jpg', label: 'Cloud tops' },
};

// ---------- colour scales ----------
const BLUE = ['#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#256abf', '#184f95', '#0d366b'];
const ORANGE = ['#fde0cf', '#f9b995', '#f2915c', '#eb6834', '#c4501f', '#9a3c14', '#6e2a0c'];
const DIVERGING = ['#104281', '#2a78d6', '#86b6ef', '#9a9993', '#f0a3a3', '#e34948', '#a52626'];

interface Scale {
  title: string;
  unit: string;
  stops: number[];
  colors: string[];
  value: (m: WeatherMetrics) => number;
  sequential: boolean;
}

const SCALES: Record<MapVariable, Scale> = {
  rainfall: { title: 'Rainfall', unit: 'mm', stops: [0, 1, 5, 10, 20, 40, 70], colors: BLUE, value: (m) => m.rainfallMm, sequential: true },
  wind: { title: 'Wind', unit: 'km/h', stops: [0, 5, 10, 15, 20, 30, 40], colors: ORANGE, value: (m) => m.windSpeedKmh, sequential: true },
  tempMin: { title: 'Night low', unit: '°C', stops: [-50, 4, 10, 16, 20, 24, 28], colors: DIVERGING, value: (m) => m.tempMin, sequential: false },
  tempMax: { title: 'Day high', unit: '°C', stops: [-50, 16, 22, 28, 32, 36, 40], colors: DIVERGING, value: (m) => m.tempMax, sequential: false },
};

const VARIABLE_TABS: { id: MapVariable; label: string; short: string }[] = [
  { id: 'rainfall', label: 'Rain', short: 'Rain' },
  { id: 'tempMin', label: 'Night low', short: 'Low' },
  { id: 'tempMax', label: 'Day high', short: 'High' },
  { id: 'wind', label: 'Wind', short: 'Wind' },
];

const BASEMAPS: { id: MapType; label: string }[] = [
  { id: 'dark', label: 'Dark' },
  { id: 'terrain', label: 'Terrain' },
  { id: 'satellite', label: 'Satellite' },
  { id: 'roadmap', label: 'Roads' },
];

function colorFor(scale: Scale, v: number, darkBase: boolean) {
  let i = 0;
  while (i + 1 < scale.stops.length && v >= scale.stops[i + 1]) i++;
  // On a dark basemap a sequential ramp runs dark→light so "more" stays the most prominent.
  const colors = scale.sequential && darkBase ? [...scale.colors].reverse() : scale.colors;
  return colors[i];
}

function tileLayer(type: MapType): L.Layer {
  const common = { maxZoom: 20, keepBuffer: 4 };
  const google = (lyrs: string) =>
    L.tileLayer(`https://mt{s}.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}`, { subdomains: ['0', '1', '2', '3'], attribution: '© Google', ...common });
  if (type === 'terrain') return google('p');
  if (type === 'satellite') return google('y');
  if (type === 'roadmap') return google('m');
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
  const layersRef = useRef<HTMLDivElement>(null);

  const [mapType, setMapType] = useState<MapType>('dark');
  const [activeStateFilter, setActiveStateFilter] = useState('all');
  const [filterType, setFilterType] = useState<'all' | 'urban' | 'rural'>('all');
  const [hovered, setHovered] = useState<PanchayatData | null>(null);
  const [layersOpen, setLayersOpen] = useState(false);

  const [showImdOverlay, setShowImdOverlay] = useState(false);
  const [imdChannel, setImdChannel] = useState('ir1');
  const [imdOpacity, setImdOpacity] = useState(0.6);
  const [imdError, setImdError] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(() => Date.now());

  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'found' | 'denied' | 'error'>('idle');
  const [nearest, setNearest] = useState<{ name: string; km: number } | null>(null);

  const scale = SCALES[activeVariable];
  const darkBase = mapType === 'dark' || mapType === 'satellite';

  const activePanchayat = useMemo(() => panchayats.find((p) => p.id === selectedId) || panchayats[0], [panchayats, selectedId]);
  const availableStates = useMemo(() => Array.from(new Set(panchayats.map((p) => p.state))).sort(), [panchayats]);

  const onSelectRef = useRef(onSelectPanchayat);
  onSelectRef.current = onSelectPanchayat;

  // Close the layers menu on outside click / Escape
  useEffect(() => {
    if (!layersOpen) return;
    const close = (e: MouseEvent) => !layersRef.current?.contains(e.target as Node) && setLayersOpen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setLayersOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [layersOpen]);

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
    L.control.zoom({ position: 'bottomright' }).addTo(map);
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
        radius: isSelected ? 10 : zoomedState ? 7.5 : 6,
        fillColor: fill,
        fillOpacity: 1,
        color: isSelected ? ACCENT : darkBase ? 'rgba(236,242,238,0.85)' : '#ffffff',
        weight: isSelected ? 4 : 1.5,
      });
      marker.bindTooltip(p.name, { direction: 'top', offset: [0, -8], opacity: 1 });
      marker.on('click', () => onSelectRef.current(p.id));
      marker.on('mouseover', () => setHovered(p));
      marker.on('mouseout', () => setHovered((h) => (h?.id === p.id ? null : h)));
      markers.addLayer(marker);
      if (isSelected) selectedMarker = marker;

      if (isSelected || zoomedState) {
        const polygon = L.polygon(p.polygonCoords, {
          color: isSelected ? ACCENT : '#7DC4FF',
          weight: isSelected ? 2 : 1,
          opacity: isSelected ? 0.9 : 0.35,
          fillColor: isSelected ? ACCENT : '#7DC4FF',
          fillOpacity: isSelected ? 0.12 : 0.04,
        });
        polygon.on('click', () => onSelectRef.current(p.id));
        polygons.addLayer(polygon);
      }
    });
    (selectedMarker as L.CircleMarker | null)?.bringToFront();

    // Coarse 18 km block footprint around the selected region
    if (coarseRectRef.current) map.removeLayer(coarseRectRef.current);
    const dLat = 9 / 111;
    const dLng = 9 / (111 * Math.cos((activePanchayat.lat * Math.PI) / 180));
    coarseRectRef.current = L.rectangle(
      [
        [activePanchayat.lat - dLat, activePanchayat.lng - dLng],
        [activePanchayat.lat + dLat, activePanchayat.lng + dLng],
      ],
      {
        color: SUN,
        weight: viewMode === 'coarse' ? 2.5 : 1.5,
        dashArray: viewMode === 'coarse' ? undefined : '4 6',
        fillColor: SUN,
        fillOpacity: viewMode === 'coarse' ? 0.18 : 0.03,
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

  const handleLocateUser = async () => {
    setLocationStatus('detecting');
    try {
      const { coords } = await getPosition();
      const { latitude, longitude, accuracy } = coords;
      const { region, distanceKm } = nearestRegion(panchayats, latitude, longitude);
      setNearest({ name: region.name, km: distanceKm });
      setLocationStatus('found');
      setActiveStateFilter('all');
      onSelectRef.current(region.id);

      const map = mapRef.current;
      if (!map) return;
      if (userLayerRef.current) map.removeLayer(userLayerRef.current);
      userLayerRef.current = L.layerGroup([
        L.circle([latitude, longitude], { radius: Math.min(accuracy, 5000), color: '#7DC4FF', weight: 1.5, fillOpacity: 0.08, dashArray: '4 6', interactive: false }),
        L.polyline([[latitude, longitude], [region.lat, region.lng]], { color: SUN, weight: 2, dashArray: '6 8', interactive: false }),
        L.circleMarker([latitude, longitude], { radius: 8, fillColor: '#7DC4FF', fillOpacity: 1, color: '#ffffff', weight: 3 }).bindTooltip('You are here'),
      ]).addTo(map);
      map.flyToBounds(L.latLngBounds([[latitude, longitude], [region.lat, region.lng]]).pad(0.5), { duration: 1.2, maxZoom: 10 });
    } catch (e: any) {
      setLocationStatus(e?.code === 1 ? 'denied' : 'error');
    }
  };

  const hoveredMetrics = hovered ? regionMetrics[hovered.id]?.[viewMode] : undefined;
  const activeMetrics = regionMetrics[activePanchayat.id]?.[viewMode];
  const legendColors = scale.sequential && darkBase ? [...scale.colors].reverse() : scale.colors;

  const panel = 'rounded-2xl border border-line/10 bg-surface/90 shadow-pop backdrop-blur-xl';

  return (
    <div className="card relative h-[520px] overflow-hidden p-0 sm:h-[600px]">
      <div ref={mapContainerRef} className="z-0 h-full w-full" aria-label="Map of monitored regions" />

      {/* Top-left: variable + resolution */}
      <div className="pointer-events-none absolute left-3 right-[108px] top-3 z-[1000]">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <div className={`seg ${panel} p-1`} role="group" aria-label="Colour map by">
            {VARIABLE_TABS.map((v) => (
              <button key={v.id} onClick={() => onVariableChange(v.id)} aria-pressed={activeVariable === v.id} className={`seg-btn ${activeVariable === v.id ? 'bg-accent text-accent-ink hover:text-accent-ink' : ''}`}>
                <span className="sm:hidden">{v.short}</span>
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            ))}
          </div>
          <div className={`seg ${panel} p-1`} role="group" aria-label="Resolution">
            <button onClick={() => onViewModeChange('fine')} aria-pressed={viewMode === 'fine'} className={`seg-btn ${viewMode === 'fine' ? 'seg-on' : ''}`}>
              1.2 km
            </button>
            <button onClick={() => onViewModeChange('coarse')} aria-pressed={viewMode === 'coarse'} className={`seg-btn ${viewMode === 'coarse' ? 'bg-sun text-accent-ink hover:text-accent-ink' : ''}`}>
              18 km
            </button>
          </div>
        </div>
      </div>

      {/* Top-right: layers + locate */}
      <div className="absolute right-3 top-3 z-[1000]">
        <div className="flex items-start gap-2">
          <div ref={layersRef} className="relative">
            <button
              onClick={() => setLayersOpen((o) => !o)}
              aria-expanded={layersOpen}
              aria-label="Map layers"
              className={`${panel} grid h-10 w-10 place-items-center text-ink2 hover:text-ink ${showImdOverlay ? 'ring-1 ring-sky/60' : ''}`}
            >
              <Layers className="h-4 w-4" />
            </button>
            {layersOpen && (
              <div className={`${panel} absolute right-0 top-12 w-72 p-4 animate-fade-in`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">Map layers</span>
                  <button onClick={() => setLayersOpen(false)} aria-label="Close" className="text-muted hover:text-ink">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 text-xs text-muted">Base map</div>
                <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                  {BASEMAPS.map((b) => (
                    <button key={b.id} onClick={() => setMapType(b.id)} className={`rounded-lg border px-1 py-1.5 text-xs ${mapType === b.id ? 'border-accent text-ink' : 'border-line/10 text-muted hover:text-ink'}`}>
                      {b.label}
                    </button>
                  ))}
                </div>

                <div className="mt-4 text-xs text-muted">Show</div>
                <div className="seg mt-1.5 w-full">
                  {(['all', 'rural', 'urban'] as const).map((t) => (
                    <button key={t} onClick={() => setFilterType(t)} className={`seg-btn flex-1 justify-center ${filterType === t ? 'seg-on' : ''}`}>
                      {t === 'all' ? 'All' : t === 'rural' ? 'Farm areas' : 'Cities'}
                    </button>
                  ))}
                </div>

                <label className="mt-4 block text-xs text-muted" htmlFor="state-jump">
                  Jump to state
                </label>
                <select
                  id="state-jump"
                  value={activeStateFilter}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-line/10 bg-surface2 px-2.5 py-2 text-sm text-ink focus:outline-none"
                >
                  <option value="all">All India ({panchayats.length})</option>
                  {availableStates.map((st) => (
                    <option key={st} value={st}>
                      {st} ({panchayats.filter((p) => p.state === st).length})
                    </option>
                  ))}
                </select>

                <div className="mt-4 border-t border-line/10 pt-4">
                  <button onClick={() => setShowImdOverlay((s) => !s)} className="flex w-full items-center justify-between text-sm text-ink">
                    <span className="flex items-center gap-2">
                      <Satellite className="h-4 w-4 text-sky" /> IMD satellite overlay
                    </span>
                    <span className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${showImdOverlay ? 'bg-sky' : 'bg-raised'}`}>
                      <span className={`h-4 w-4 rounded-full bg-white transition-transform ${showImdOverlay ? 'translate-x-4' : ''}`} />
                    </span>
                  </button>
                  {showImdOverlay && (
                    <div className="mt-3 space-y-2.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        {Object.entries(IMD_OVERLAY_CHANNELS).map(([k, cfg]) => (
                          <button key={k} onClick={() => setImdChannel(k)} className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs ${imdChannel === k ? 'border-sky text-ink' : 'border-line/10 text-muted'}`}>
                            {imdChannel === k && <Check className="h-3 w-3" />} {cfg.label}
                          </button>
                        ))}
                      </div>
                      <label className="flex items-center gap-2 text-xs text-muted">
                        Opacity
                        <input type="range" min="0.2" max="0.95" step="0.05" value={imdOpacity} onChange={(e) => setImdOpacity(parseFloat(e.target.value))} className="flex-1 accent-[#7DC4FF]" />
                        <button onClick={() => setCacheBuster(Date.now())} aria-label="Reload satellite image" className="text-muted hover:text-ink">
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      </label>
                      {imdError && <p className="text-xs text-alert">IMD server is not responding right now.</p>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLocateUser}
            disabled={locationStatus === 'detecting'}
            aria-label="Find my location"
            title="Find the monitored region nearest to me"
            className={`${panel} grid h-10 w-10 place-items-center text-ink2 hover:text-ink disabled:opacity-60`}
          >
            {locationStatus === 'detecting' ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Hover card */}
      {hovered && hoveredMetrics && (
        <div className={`${panel} pointer-events-none absolute left-3 top-[68px] z-[1000] hidden w-60 p-3 sm:block animate-fade-in`}>
          <div className="truncate text-sm font-semibold text-ink">{hovered.name}</div>
          <div className="truncate text-xs text-muted">
            {hovered.district}, {hovered.state} · {hovered.elevationM} m
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 border-t border-line/10 pt-2 text-center tabular">
            <div>
              <div className="text-[10px] text-muted">Rain</div>
              <div className="text-sm font-semibold text-ink">{hoveredMetrics.rainfallMm}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted">Temp °C</div>
              <div className="text-sm font-semibold text-ink">
                {Math.round(hoveredMetrics.tempMin)}–{Math.round(hoveredMetrics.tempMax)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted">Wind</div>
              <div className="text-sm font-semibold text-ink">{hoveredMetrics.windSpeedKmh}</div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className={`${panel} pointer-events-none absolute bottom-3 left-3 z-[1000] w-[230px] p-3`}>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold text-ink">
            {scale.title} <span className="font-normal text-muted">({scale.unit})</span>
          </span>
          <span className={`text-[11px] font-medium ${viewMode === 'fine' ? 'text-accent' : 'text-sun'}`}>{viewMode === 'fine' ? '1.2 km' : '18 km'}</span>
        </div>
        <div className="mt-2 flex h-2 gap-[2px] overflow-hidden rounded-full">
          {legendColors.map((c) => (
            <span key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>
        <div className="mt-1 flex justify-between font-mono text-[10px] text-muted">
          {scale.stops.slice(1).map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
        {activeMetrics && (
          <div className="mt-2 flex items-center justify-between border-t border-line/10 pt-2 text-xs">
            <span className="flex min-w-0 items-center gap-1.5 text-ink2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
              <span className="truncate">{activePanchayat.name}</span>
            </span>
            <strong className="font-mono text-ink">{scale.value(activeMetrics)}</strong>
          </div>
        )}
        {liveLoading && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-warn">
            <Loader2 className="h-3 w-3 animate-spin" /> Loading live data for all regions…
          </div>
        )}
      </div>

      {/* Location feedback */}
      {locationStatus === 'found' && nearest && (
        <div role="status" className={`${panel} absolute right-3 top-16 z-[1000] max-w-[240px] p-3 animate-fade-in`}>
          <div className="text-xs text-muted">Nearest monitored region</div>
          <div className="text-sm font-semibold text-ink">{nearest.name}</div>
          <div className="text-xs text-sun">{nearest.km} km from you</div>
          <button onClick={() => setLocationStatus('idle')} className="mt-1 text-xs text-muted underline hover:text-ink">
            Dismiss
          </button>
        </div>
      )}
      {(locationStatus === 'denied' || locationStatus === 'error') && (
        <div role="alert" className={`${panel} absolute right-3 top-16 z-[1000] max-w-[240px] p-3 animate-fade-in`}>
          <div className="text-sm font-semibold text-alert">{locationStatus === 'denied' ? 'Location access denied' : 'Location unavailable'}</div>
          <div className="text-xs text-muted">{locationStatus === 'denied' ? 'Allow location access in your browser settings.' : 'Could not get a GPS fix. Try again.'}</div>
          <button onClick={() => setLocationStatus('idle')} className="mt-1 text-xs text-muted underline hover:text-ink">
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
