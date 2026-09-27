import type { PanchayatData } from '@/data/all_india_regions';

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function nearestRegion(regions: PanchayatData[], lat: number, lng: number) {
  let best = regions[0];
  let dist = Infinity;
  for (const r of regions) {
    const d = haversineKm(lat, lng, r.lat, r.lng);
    if (d < dist) {
      dist = d;
      best = r;
    }
  }
  return { region: best, distanceKm: Math.round(dist * 10) / 10 };
}

/** Promise wrapper around the browser geolocation API. */
export function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  });
}
