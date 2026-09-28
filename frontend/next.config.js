/** @type {import('next').NextConfig} */

// Always a pure static export: no Node server runs anywhere, so there is no server-side attack
// surface (no API routes, server actions, image optimiser or middleware to exploit).
// `npm run build:pages` serves it under /<repo-name>/ for GitHub Pages; `npm run build` serves it at / (Vercel).
const isPages = process.env.GITHUB_PAGES === '1' || process.env.npm_lifecycle_event === 'build:pages';
const basePath = isPages ? '/panchayat-weather-downscaling' : '';

module.exports = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  poweredByHeader: false,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};
