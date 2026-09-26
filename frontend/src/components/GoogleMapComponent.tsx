'use client';

import React, { useEffect, useRef, useState } from 'react';

interface GoogleMapComponentProps {
  panchayats: any[];
  selectedId: string;
  onSelectPanchayat: (id: string) => void;
  activeVariable: 'rainfall' | 'temp' | 'frost' | 'spray';
  viewMode: 'fine' | 'coarse';
}

// Google Maps Dark Theme styling matching Orchids aesthetic
const GOOGLE_MAPS_DARK_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0d1322' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1322' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#f8fafc' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f172a' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#06182c' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#38bdf8' }] },
];

export default function GoogleMapComponent({
  panchayats,
  selectedId,
  onSelectPanchayat,
  activeVariable,
  viewMode,
}: GoogleMapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const polygonLayersRef = useRef<{ [key: string]: any }>({});
  const coarseRectangleRef = useRef<any>(null);
  const markerLayersRef = useRef<any[]>([]);

  const [mapType, setMapType] = useState<'terrain' | 'hybrid' | 'dark'>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Google Maps JavaScript API
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    const initMap = () => {
      if (!mapContainerRef.current || !window.google || !window.google.maps) return;

      const center = { lat: 18.4520, lng: 73.6550 }; // Western Ghats Pilot

      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: center,
        zoom: 11,
        mapTypeId: 'roadmap',
        styles: GOOGLE_MAPS_DARK_STYLE,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      });

      mapInstanceRef.current = map;
      setIsLoaded(true);
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      const existingScript = document.getElementById('google-maps-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => initMap();
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener('load', () => initMap());
      }
    }
  }, []);

  // Update Map Type (Dark Custom / Google Official Terrain / Satellite Hybrid)
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    const map = mapInstanceRef.current;

    if (mapType === 'dark') {
      map.setMapTypeId('roadmap');
      map.setOptions({ styles: GOOGLE_MAPS_DARK_STYLE });
    } else if (mapType === 'terrain') {
      map.setMapTypeId('terrain');
      map.setOptions({ styles: [] }); // Show rich Google elevation contours
    } else if (mapType === 'hybrid') {
      map.setMapTypeId('hybrid');
      map.setOptions({ styles: [] }); // Show high-res Google Earth satellite
    }
  }, [mapType, isLoaded]);

  // Render Overlays (Panchayat Polygons + Coarse 18km Block Box)
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !window.google) return;
    const map = mapInstanceRef.current;

    // Clear old polygons & markers
    Object.values(polygonLayersRef.current).forEach((poly: any) => poly.setMap(null));
    polygonLayersRef.current = {};

    markerLayersRef.current.forEach((marker: any) => marker.setMap(null));
    markerLayersRef.current = [];

    if (coarseRectangleRef.current) {
      coarseRectangleRef.current.setMap(null);
    }

    // 1. Render Coarse 18km Block Box (Yellow dashed rectangle)
    const coarseRect = new window.google.maps.Rectangle({
      strokeColor: '#f59e0b',
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: '#f59e0b',
      fillOpacity: viewMode === 'coarse' ? 0.45 : 0.06,
      map: map,
      bounds: {
        north: 18.58,
        south: 18.32,
        east: 73.82,
        west: 73.48,
      },
    });
    coarseRectangleRef.current = coarseRect;

    // 2. Render Panchayat Polygons
    panchayats.forEach((p) => {
      const isSelected = p.id === selectedId;
      const coords = p.polygonCoords.map((c: [number, number]) => ({ lat: c[0], lng: c[1] }));

      const fillColor = getPanchayatColor(p, activeVariable, viewMode);

      const polygon = new window.google.maps.Polygon({
        paths: coords,
        strokeColor: isSelected ? '#10b981' : '#ffffff',
        strokeOpacity: isSelected ? 1.0 : 0.6,
        strokeWeight: isSelected ? 3.5 : 1.5,
        fillColor: fillColor,
        fillOpacity: viewMode === 'coarse' ? 0.25 : 0.75,
        map: map,
      });

      polygon.addListener('click', () => {
        onSelectPanchayat(p.id);
      });

      polygon.addListener('mouseover', () => {
        polygon.setOptions({ strokeColor: '#38bdf8', strokeWeight: 3 });
      });

      polygon.addListener('mouseout', () => {
        const selected = p.id === selectedId;
        polygon.setOptions({
          strokeColor: selected ? '#10b981' : '#ffffff',
          strokeWeight: selected ? 3.5 : 1.5,
        });
      });

      polygonLayersRef.current[p.id] = polygon;

      // Elevation Marker
      const centerLat = coords.reduce((acc: number, c: any) => acc + c.lat, 0) / coords.length;
      const centerLng = coords.reduce((acc: number, c: any) => acc + c.lng, 0) / coords.length;

      const marker = new window.google.maps.Marker({
        position: { lat: centerLat, lng: centerLng },
        map: map,
        title: `${p.name} (${p.elevationM}m)`,
        label: {
          text: `${p.name.split(' ')[0]} ${p.elevationM}m`,
          color: '#ffffff',
          fontSize: '10px',
          fontWeight: 'bold',
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: '#0f172a',
          fillOpacity: 0.9,
          strokeColor: p.elevationM > 1000 ? '#06b6d4' : (p.elevationM < 600 ? '#f59e0b' : '#10b981'),
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => onSelectPanchayat(p.id));
      markerLayersRef.current.push(marker);
    });
  }, [panchayats, selectedId, activeVariable, viewMode, isLoaded]);

  // Pan to selected Panchayat
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;
    const target = panchayats.find((p) => p.id === selectedId);
    if (target && target.polygonCoords && target.polygonCoords[0]) {
      const lat = target.polygonCoords[0][0];
      const lng = target.polygonCoords[0][1];
      mapInstanceRef.current.panTo({ lat, lng });
    }
  }, [selectedId, isLoaded]);

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl bg-[#090e18]">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Google Maps View Type Selector (Dark, Terrain, Satellite) */}
      <div className="absolute top-3 left-3 z-10 flex items-center bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 gap-1 text-[11px] shadow-lg">
        <button
          onClick={() => setMapType('dark')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
            mapType === 'dark' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          🌌 Dark Styled
        </button>

        <button
          onClick={() => setMapType('terrain')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
            mapType === 'terrain' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          🏔️ Google Terrain
        </button>

        <button
          onClick={() => setMapType('hybrid')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
            mapType === 'hybrid' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          🛰️ Google Satellite
        </button>
      </div>

      {/* Powered by Google Maps Badge */}
      <div className="absolute bottom-6 left-3 z-10 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] text-slate-300 font-mono flex items-center gap-1.5 shadow-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        Google Maps API • Western Ghats 1.2km²
      </div>
    </div>
  );
}

function getPanchayatColor(p: any, variable: string, viewMode: string): string {
  if (viewMode === 'coarse') {
    return '#f59e0b'; // Uniform coarse block color
  }

  if (variable === 'rainfall') {
    if (p.elevationM > 1000) return '#7c3aed'; // High crest rain
    if (p.elevationM < 600) return '#0284c7';  // Valley
    return '#06b6d4';
  } else if (variable === 'temp') {
    if (p.elevationM > 1000) return '#06b6d4'; // Cool crest
    if (p.drainageAccumulation > 0.8) return '#f43f5e'; // Inversion cold pool
    return '#f59e0b';
  } else if (variable === 'frost') {
    return p.drainageAccumulation > 0.7 ? '#ec4899' : '#1e293b';
  } else if (variable === 'spray') {
    return p.elevationM > 1000 ? '#f43f5e' : '#10b981';
  }
  return '#10b981';
}

// Add TypeScript declaration for window.google
declare global {
  interface Window {
    google: any;
  }
}
