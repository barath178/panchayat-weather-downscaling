// Synthetic terrain for the hero "resolution reveal": 3 × 4 coarse 18 km blocks,
// each split into 15 × 15 fine 1.2 km cells. Night-minimum temperature uses the same
// physics as the real engine: lapse rate plus cold-air pooling in concave valleys.

export const BLOCK = 15;
export const NX = BLOCK * 4; // 60 fine cells across
export const NY = BLOCK * 3; // 45 fine cells down

let seed = 7;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

function makeNoise() {
  seed = 7;
  const G = 32;
  const lat = Array.from({ length: G * G }, rand);
  const s = (t: number) => t * t * (3 - 2 * t);
  const n = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = s(x - xi), yf = s(y - yi);
    const v = (i: number, j: number) => lat[((yi + j) % G) * G + ((xi + i) % G)];
    const a = v(0, 0) + (v(1, 0) - v(0, 0)) * xf;
    const b = v(0, 1) + (v(1, 1) - v(0, 1)) * xf;
    return a + (b - a) * yf;
  };
  return (x: number, y: number) => {
    let amp = 0.55, f = 1, sum = 0;
    for (let o = 0; o < 4; o++) {
      sum += amp * n(x * f + 3.1, y * f + 1.7);
      amp *= 0.5;
      f *= 2.1;
    }
    return sum;
  };
}

export interface RevealField {
  elev: Float32Array; // metres
  fine: Float32Array; // °C night minimum at 1.2 km
  coarse: Float32Array; // °C block mean, broadcast to each fine cell
  shade: Float32Array; // 0–1 hillshade
  min: number;
  max: number;
}

export function buildRevealField(): RevealField {
  const noise = makeNoise();
  const N = NX * NY;
  const elev = new Float32Array(N);
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) elev[j * NX + i] = noise(i / 13, j / 13);
  // Stretch to a hill-country relief of ~100–1900 m
  let lo = Infinity, hi = -Infinity;
  elev.forEach((v) => {
    lo = Math.min(lo, v);
    hi = Math.max(hi, v);
  });
  elev.forEach((v, k) => (elev[k] = 100 + Math.pow((v - lo) / (hi - lo), 1.2) * 1800));

  // Local concavity: elevation minus neighbourhood mean (negative = valley floor)
  const R = 4;
  const fine = new Float32Array(N);
  for (let j = 0; j < NY; j++)
    for (let i = 0; i < NX; i++) {
      let s = 0, c = 0;
      for (let dj = -R; dj <= R; dj++)
        for (let di = -R; di <= R; di++) {
          const x = i + di, y = j + dj;
          if (x < 0 || y < 0 || x >= NX || y >= NY) continue;
          s += elev[y * NX + x];
          c++;
        }
      const e = elev[j * NX + i];
      const concavity = e - s / c;
      const pooling = concavity < 0 ? Math.min(9, -concavity / 14) : 0;
      fine[j * NX + i] = 16 - (6.5 * e) / 1000 - pooling;
    }

  // Coarse: one mean per block
  const coarse = new Float32Array(N);
  for (let bj = 0; bj < NY / BLOCK; bj++)
    for (let bi = 0; bi < NX / BLOCK; bi++) {
      let s = 0;
      for (let j = 0; j < BLOCK; j++) for (let i = 0; i < BLOCK; i++) s += fine[(bj * BLOCK + j) * NX + bi * BLOCK + i];
      const m = s / (BLOCK * BLOCK);
      for (let j = 0; j < BLOCK; j++) for (let i = 0; i < BLOCK; i++) coarse[(bj * BLOCK + j) * NX + bi * BLOCK + i] = m;
    }

  // Hillshade (light from the north-west)
  const shade = new Float32Array(N);
  const [lx, ly, lz] = [-0.6, -0.6, 0.53];
  for (let j = 0; j < NY; j++)
    for (let i = 0; i < NX; i++) {
      const e = (x: number, y: number) => elev[Math.min(NY - 1, Math.max(0, y)) * NX + Math.min(NX - 1, Math.max(0, x))];
      const dx = (e(i + 1, j) - e(i - 1, j)) / 2400;
      const dy = (e(i, j + 1) - e(i, j - 1)) / 2400;
      const len = Math.hypot(dx, dy, 1);
      const dot = (-dx * lx - dy * ly + lz) / len;
      shade[j * NX + i] = Math.min(1, Math.max(0.35, 0.35 + dot * 0.9));
    }

  let min = Infinity, max = -Infinity;
  fine.forEach((v) => {
    min = Math.min(min, v);
    max = Math.max(max, v);
  });
  return { elev, fine, coarse, shade, min, max };
}

// Night-minimum colour ramp: warm nights recede (deep navy), cold nights glow (ice).
const STOPS: [number, [number, number, number]][] = [
  [0, [236, 246, 255]],
  [2, [205, 226, 251]],
  [4, [158, 197, 244]],
  [6, [109, 167, 236]],
  [8, [57, 135, 229]],
  [10, [37, 106, 191]],
  [12, [24, 79, 149]],
  [14, [13, 54, 107]],
  [17, [10, 34, 66]],
];

export function tempColor(t: number): [number, number, number] {
  if (t <= STOPS[0][0]) return STOPS[0][1];
  for (let k = 1; k < STOPS.length; k++) {
    if (t <= STOPS[k][0]) {
      const [t0, c0] = STOPS[k - 1];
      const [t1, c1] = STOPS[k];
      const f = (t - t0) / (t1 - t0);
      return [c0[0] + (c1[0] - c0[0]) * f, c0[1] + (c1[1] - c0[1]) * f, c0[2] + (c1[2] - c0[2]) * f];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

export const RAMP_CSS = `linear-gradient(90deg, ${STOPS.map(([t, c]) => `rgb(${c.join(',')}) ${(t / 17) * 100}%`).join(', ')})`;
