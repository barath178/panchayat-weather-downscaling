// Export the inferred 1.2 km field as data a GIS or spreadsheet can use: CSV, GeoJSON (cell polygons) or PNG.
import type { PanchayatData } from '@/data/all_india_regions';
import type { BlockField } from './blockGrid';

function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const stamp = () => new Date().toISOString().slice(0, 10);
const base = (p: PanchayatData) => `aeroagro_${p.id}_${stamp()}_1p2km`;

export function exportCsv(p: PanchayatData, f: BlockField) {
  const { grid, values } = f;
  const rows = ['cell,row,col,lat,lng,elevation_m,tmin_c,tmax_c,rain_mm,wind_kmh,is_village_cell'];
  for (let i = 0; i < grid.n * grid.n; i++) {
    const r = Math.floor(i / grid.n), c = i % grid.n;
    rows.push(
      [
        `${String.fromCharCode(65 + c)}${r + 1}`,
        r + 1,
        c + 1,
        grid.lat[i],
        grid.lng[i],
        grid.elev[i],
        values.tempMin[i],
        values.tempMax[i],
        values.rainfall[i],
        values.wind[i],
        i === f.centre ? 1 : 0,
      ].join(',')
    );
  }
  const header = `# AeroAgro AI 1.2 km downscaled field for ${p.name} (${p.district}, ${p.state}); block forecast Tmin ${f.coarse.tempMin} C, Tmax ${f.coarse.tempMax} C, rain ${f.coarse.rainfallMm} mm; terrain ${grid.source === 'dem' ? 'Copernicus GLO-90' : 'offline model'}\n`;
  download(`${base(p)}.csv`, new Blob([header + rows.join('\n')], { type: 'text/csv' }));
}

export function exportGeoJson(p: PanchayatData, f: BlockField) {
  const { grid, values } = f;
  const hl = grid.dLat / 2, hg = grid.dLng / 2;
  const r5 = (n: number) => Math.round(n * 1e5) / 1e5;
  const features = [];
  for (let i = 0; i < grid.n * grid.n; i++) {
    const la = grid.lat[i], lo = grid.lng[i];
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [r5(lo - hg), r5(la - hl)],
            [r5(lo + hg), r5(la - hl)],
            [r5(lo + hg), r5(la + hl)],
            [r5(lo - hg), r5(la + hl)],
            [r5(lo - hg), r5(la - hl)],
          ],
        ],
      },
      properties: {
        cell: `${String.fromCharCode(65 + (i % grid.n))}${Math.floor(i / grid.n) + 1}`,
        elevation_m: grid.elev[i],
        tmin_c: values.tempMin[i],
        tmax_c: values.tempMax[i],
        rain_mm: values.rainfall[i],
        wind_kmh: values.wind[i],
        village_cell: i === f.centre,
      },
    });
  }
  const fc = {
    type: 'FeatureCollection',
    name: `${p.name} · 1.2 km downscaled field`,
    properties: { source: 'AeroAgro AI', region: p.id, block_forecast: f.coarse, terrain: grid.source, generated: new Date().toISOString() },
    features,
  };
  download(`${base(p)}.geojson`, new Blob([JSON.stringify(fc)], { type: 'application/geo+json' }));
}

export function exportPng(p: PanchayatData, canvas: HTMLCanvasElement | null, variable: string) {
  if (!canvas) return;
  canvas.toBlob((b) => b && download(`${base(p)}_${variable}.png`, b), 'image/png');
}
