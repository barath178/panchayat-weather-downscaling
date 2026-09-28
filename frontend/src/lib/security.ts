// Content Security Policy: the only third parties the app talks to.
//   connect: Open-Meteo (forecast + elevation APIs)
//   images:  Esri & Google map tiles, IMD INSAT-3DR satellite images, canvas data/blob URLs
// Kept in one place so vercel.json and the <meta> fallback (GitHub Pages cannot send headers) agree.
export const CSP_DIRECTIVES: [string, string][] = [
  ['default-src', "'self'"],
  ['script-src', "'self' 'unsafe-inline'"], // Next.js static export inlines its hydration payload
  ['style-src', "'self' 'unsafe-inline'"],
  ['img-src', "'self' data: blob: https://server.arcgisonline.com https://mt0.google.com https://mt1.google.com https://mt2.google.com https://mt3.google.com https://mausam.imd.gov.in"],
  ['font-src', "'self' data:"],
  ['connect-src', "'self' https://api.open-meteo.com"],
  ['media-src', "'self' blob:"],
  ['worker-src', "'self' blob:"],
  ['object-src', "'none'"],
  ['base-uri', "'self'"],
  ['form-action', "'self'"],
  ['upgrade-insecure-requests', ''],
];

export const CSP_META = CSP_DIRECTIVES.map(([k, v]) => (v ? `${k} ${v}` : k)).join('; ');
