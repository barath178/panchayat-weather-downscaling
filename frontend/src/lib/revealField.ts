// Synthetic terrain for the hero "resolution reveal": 3 × 6 coarse 18 km blocks,
// each split into 15 × 15 fine 1.2 km cells. Night-minimum temperature uses the same
// physics as the real engine: lapse rate plus cold-air pooling in concave valleys.

export const BLOCK = 15;
export const NX = BLOCK * 6; // 90 fine cells across (six 18 km blocks, cinematic 2:1)
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
    let amp = 0.6, f = 1, sum = 0;
    for (let o = 0; o < 3; o++) {
      sum += amp * n(x * f + 3.1, y * f + 1.7);
      amp *= 0.42;
      f *= 2.05;
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
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) elev[j * NX + i] = noise(i / 17, j / 17);
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
      const pooling = concavity < 0 ? Math.min(9, -concavity / 8) : 0;
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

// Night thermal ramp: warm valleys glow amber, cooling air turns violet and blue,
// frost pockets burn ice-white.
export const T_LO = -3;
export const T_HI = 17;
const STOPS: [number, [number, number, number]][] = [
  [-3, [255, 255, 255]],
  [0, [200, 242, 255]],
  [2, [118, 214, 255]],
  [4, [64, 164, 245]],
  [6, [66, 108, 222]],
  [8, [96, 74, 196]],
  [10, [138, 64, 168]],
  [12, [184, 70, 128]],
  [14, [224, 100, 90]],
  [17, [246, 185, 76]],
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

export const RAMP_CSS = `linear-gradient(90deg, ${STOPS.map(([t, c]) => `rgb(${c.join(',')}) ${((t - T_LO) / (T_HI - T_LO)) * 100}%`).join(', ')})`;

// ---------- smooth raster rendering ----------

const cr = (p0: number, p1: number, p2: number, p3: number, t: number) =>
  p1 + 0.5 * t * (p2 - p0 + t * (2 * p0 - 5 * p1 + 4 * p2 - p3 + t * (3 * (p1 - p2) + p3 - p0)));

/** Catmull-Rom bicubic sample of an NX × NY grid at fractional cell coordinates. */
export function bicubic(a: Float32Array, x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const tx = x - xi, ty = y - yi;
  const at = (i: number, j: number) => a[Math.min(NY - 1, Math.max(0, j)) * NX + Math.min(NX - 1, Math.max(0, i))];
  const row = (j: number) => cr(at(xi - 1, j), at(xi, j), at(xi + 1, j), at(xi + 2, j), tx);
  return cr(row(yi - 1), row(yi), row(yi + 1), row(yi + 2), ty);
}

export interface RevealRaster {
  w: number;
  h: number;
  /** smooth 1.2 km view: thermal colour × relief shading */
  fine: ImageData;
  /** 18 km view: flat block colour with faint relief */
  coarse: ImageData;
  /** elevation raster, for contour lines */
  elev: Float32Array;
}

export function rasterize(f: RevealField, w: number, h: number): RevealRaster {
  const elev = new Float32Array(w * h);
  const temp = new Float32Array(w * h);
  const gx = (px: number) => ((px + 0.5) / w) * NX - 0.5;
  const gy = (py: number) => ((py + 0.5) / h) * NY - 0.5;
  for (let py = 0; py < h; py++)
    for (let px = 0; px < w; px++) {
      elev[py * w + px] = bicubic(f.elev, gx(px), gy(py));
      temp[py * w + px] = bicubic(f.fine, gx(px), gy(py));
    }

  const fine = new ImageData(w, h);
  const coarse = new ImageData(w, h);
  const metresPerPx = (NX * 1200) / w;
  for (let py = 0; py < h; py++)
    for (let px = 0; px < w; px++) {
      const k = py * w + px;
      const e = (x: number, y: number) => elev[Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))];
      // relief shading, light from the north-west, vertical exaggeration ×3
      const dx = ((e(px + 1, py) - e(px - 1, py)) / (2 * metresPerPx)) * 3;
      const dy = ((e(px, py + 1) - e(px, py - 1)) / (2 * metresPerPx)) * 3;
      const lit = (dx * 0.62 + dy * 0.62 + 0.48) / Math.hypot(dx, dy, 1);
      const shade = Math.min(1.25, Math.max(0.28, 0.35 + lit * 0.95));

      const [r, g, b] = tempColor(temp[k]);
      fine.data.set([Math.min(255, r * shade), Math.min(255, g * shade), Math.min(255, b * shade), 255], k * 4);

      // the block model ignores terrain: one flat colour, relief only as a ghost
      const i = Math.min(NX - 1, Math.floor((px / w) * NX));
      const j = Math.min(NY - 1, Math.floor((py / h) * NY));
      const [cr_, cg, cb] = tempColor(f.coarse[j * NX + i]);
      const ghost = 0.9 + (shade - 0.9) * 0.18;
      coarse.data.set([cr_ * ghost, cg * ghost, cb * ghost, 255], k * 4);
    }
  return { w, h, fine, coarse, elev };
}

/** Marching-squares contour segments on the elevation raster, every `step` metres. */
export function contourSegments(r: RevealRaster, step: number, stride = 3) {
  const out: { major: boolean; seg: number[] }[] = [];
  const { w, h, elev } = r;
  const E = (x: number, y: number) => elev[Math.min(h - 1, y) * w + Math.min(w - 1, x)];
  for (let level = step; level < 2000; level += step) {
    const seg: number[] = [];
    for (let y = 0; y < h - stride; y += stride)
      for (let x = 0; x < w - stride; x += stride) {
        const a = E(x, y), b = E(x + stride, y), c = E(x + stride, y + stride), d = E(x, y + stride);
        const pts: number[] = [];
        const edge = (v0: number, v1: number, x0: number, y0: number, x1: number, y1: number) => {
          if ((v0 < level) !== (v1 < level)) {
            const t = (level - v0) / (v1 - v0);
            pts.push(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t);
          }
        };
        edge(a, b, x, y, x + stride, y);
        edge(b, c, x + stride, y, x + stride, y + stride);
        edge(c, d, x + stride, y + stride, x, y + stride);
        edge(d, a, x, y + stride, x, y);
        if (pts.length >= 4) seg.push(pts[0], pts[1], pts[2], pts[3]);
        if (pts.length === 8) seg.push(pts[4], pts[5], pts[6], pts[7]);
      }
    out.push({ major: level % (step * 5) === 0, seg });
  }
  return out;
}
