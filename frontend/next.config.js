/** @type {import('next').NextConfig} */

// `npm run build:pages` exports a static site for GitHub Pages, served under /<repo-name>/.
// Normal `npm run build` (local, Vercel) is unaffected.
const isPages = process.env.GITHUB_PAGES === '1' || process.env.npm_lifecycle_event === 'build:pages';
const basePath = isPages ? '/panchayat-weather-downscaling' : '';

module.exports = {
  reactStrictMode: true,
  ...(isPages && { output: 'export', trailingSlash: true }),
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};
