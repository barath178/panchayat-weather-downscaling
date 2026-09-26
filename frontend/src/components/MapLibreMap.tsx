'use client';

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapLibreMapProps {
  panchayats: any[];
  selectedId: string;
  onSelectPanchayat: (id: string) => void;
  activeVariable: 'rainfall' | 'temp' | 'frost' | 'spray';
  viewMode: 'fine' | 'coarse';
}

export default function MapLibreMap({
  panchayats,
  selectedId,
  onSelectPanchayat,
  activeVariable,
  viewMode,
}: MapLibreMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize MapLibre GL instance with free open-source vector tiles
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [73.6550, 18.4520], // Western Ghats Pilot
      zoom: 10.5,
      pitch: 35, // 3D perspective
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      // Add Coarse IMD Block bounding box
      map.addSource('coarse-block-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [73.48, 18.32],
              [73.82, 18.32],
              [73.82, 18.58],
              [73.48, 18.58],
              [73.48, 18.32],
            ]],
          },
          properties: { name: 'IMD 18km Coarse Grid' },
        },
      });

      map.addLayer({
        id: 'coarse-block-outline',
        type: 'line',
        source: 'coarse-block-source',
        paint: {
          'line-color': '#f59e0b',
          'line-width': 2,
          'line-dasharray': [3, 2],
        },
      });

      // Add Panchayats GeoJSON source
      const features = panchayats.map((p) => ({
        type: 'Feature',
        id: p.id,
        geometry: {
          type: 'Polygon',
          coordinates: [p.polygonCoords.map((c: [number, number]) => [c[1], c[0]])], // convert lat/lng to lng/lat
        },
        properties: {
          id: p.id,
          name: p.name,
          elevation: p.elevationM,
          terrain: p.terrainType,
        },
      }));

      map.addSource('panchayats-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: features as any },
      });

      // Fill Layer (Choropleth)
      map.addLayer({
        id: 'panchayats-fill',
        type: 'fill',
        source: 'panchayats-source',
        paint: {
          'fill-color': '#10b981',
          'fill-opacity': 0.75,
        },
      });

      // Border Layer
      map.addLayer({
        id: 'panchayats-line',
        type: 'line',
        source: 'panchayats-source',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.5,
        },
      });

      // Click Event on Panchayat
      map.on('click', 'panchayats-fill', (e) => {
        if (e.features && e.features[0]) {
          const id = e.features[0].properties?.id;
          if (id) onSelectPanchayat(id);
        }
      });
    });

    mapRef.current = map;
    return () => map.remove();
  }, []);

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-emerald-400">
        MapLibre GL JS • 3D Terrain
      </div>
    </div>
  );
}
