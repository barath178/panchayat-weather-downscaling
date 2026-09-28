# AeroAgro AI: problem-statement compliance, judging criteria and security audit

**Problem statement (Ministry of Earth Sciences, Agriculture · FoodTech · Rural Development)**
> Downscaling of weather forecast from Block level to Panchayat level: inferring high-resolution plots / data / information from low-resolution plot / data / information / variables for agro-meteorological advisory services.

Live: https://aeroagro.vercel.app · Mirror: https://barath178.github.io/panchayat-weather-downscaling/

---

## 1. Requirement-by-requirement compliance

| # | What the statement asks | Status | Where to see it |
|---|---|---|---|
| 1 | **Input: block-level (low-resolution) forecast** | ✅ Met | Live Open-Meteo forecast requested with `elevation=nan`, i.e. the raw ~11–25 km grid-cell value, the same scale as an IMD block forecast. Ticker and pipeline strip show the model cell height. |
| 2 | **Output: panchayat-level (high-resolution) forecast** | ✅ Met | *(01) Your village*: night low, day high, rain, wind and humidity at 1.2 km for 303 regions, side by side with the block value. |
| 3 | **Inferring high-resolution *plots*** | ✅ Met | *(03) Engine*, Fig 2.1: the 18 km block resolved into a 15 × 15 grid of 1.2 km cells from live Copernicus GLO-90 heights, also painted on the national map; *Fig 1* resolution comparison. |
| 4 | **Inferring high-resolution *data*** | ✅ Met | Download the 225-cell field as **CSV**, **GeoJSON** (cell polygons, GIS-ready) or **PNG** from Fig 2.1. |
| 5 | **Inferring high-resolution *information*** | ✅ Met | Explainable waterfall with the substituted equation for every physical step; plain-language reason; per-cell hazard counts (frost, heat, drift). |
| 6 | **From low-resolution *variables*** | ✅ Met | Temperature (max/min), rainfall, wind and humidity all downscaled; humidity conserves vapour pressure. |
| 7 | **For agro-meteorological advisory services** | ✅ Met | Spray window (hourly, ICAR drift/wash-off rules), irrigation (FAO-56 Hargreaves ET₀ water balance), crop-specific disease rules, 7-day outlook, **GKMS-format bulletin** (print/PDF, SMS text, QR). |
| 8 | **Reaching farmers** *(implicit: advisory must be usable)* | ✅ Met | Ask AeroAgro (voice/text, English · हिन्दी · தமிழ்), WhatsApp share, farmer phone view, panchayat kiosk with QR. |
| 9 | **Scale** *(implicit: national service)* | ✅ Met | 303 regions downscaled live in one batched request; AI scan counts hazards and the alerts the district forecast misses. |
| 10 | **Operational value beyond forecast** | ✅ Extra | PMFBY/WBCIS weather-index evidence report with SHA-256 checksum; IMD INSAT-3DR satellite overlay. |

## 2. Typical evaluation criteria

| Criterion | Evidence |
|---|---|
| **Novelty** | Physics-informed downscaling you can *see working*: live DEM grid, equation-level explainability, elevation-aware optimal-interpolation blend (as in MET Norway's gridpp), "alerts the district forecast misses" metric. |
| **Technical depth** | Lapse rates (day 5.0, night 6.5/4.5 K/km), topographic-position cold-air pooling, orographic rain lift, ridge exposure, vapour-pressure-conserving humidity, FAO-56 ET₀, IMD rain classes. All client-side in TypeScript. |
| **Feasibility & cost** | Free, keyless open data (Open-Meteo, Copernicus DEM, IMD imagery); static site on a CDN; ₹0 running cost. |
| **Impact** | Spray timing avoids wash-off and drift; frost-hollow and heat warnings at village scale; insurance evidence for localised calamities under PMFBY. |
| **Scalability** | Any lat/lon in India works: the grid and engine are location-agnostic; 303 regions today, batched fetch design scales to all ~2.5 lakh panchayats with a region registry. |
| **UI / UX** | "Monsoon Almanac" editorial design; paper sections for people, night bands for instruments; accessible controls (keyboard slider, ARIA roles, reduced motion); responsive to 390 px with no horizontal scroll. |
| **Inclusivity** | Three languages with speech output and speech input; large-type kiosk; WhatsApp delivery. |
| **Design system** | Figma plugin generates the design natively (variables, text styles, variant components, screens) from a live data snapshot. |

## 3. Security audit (2026-09-28)

| Area | Finding | Action |
|---|---|---|
| Frontend dependencies | `npm audit`: Next.js 14.2.35 affected by 23 advisories incl. **2 critical** (unauthenticated RCE) and several high (SSRF, middleware bypass, DoS); 14.x receives no further fixes. | **Upgraded to Next.js 15.5.26** (patched line) + React 19; PostCSS pinned to 8.5.28 via `overrides`; removed 4 unused packages (`@supabase/supabase-js`, `maplibre-gl`, `clsx`, `tailwind-merge`). **`npm audit`: 0 vulnerabilities.** |
| Hosting architecture | Vercel ran a Next.js server (image optimiser, request handling) | Switched to a **pure static export** everywhere: no Node server, API routes, server actions or middleware exist to attack. |
| HTTP security headers | None set | `vercel.json`: strict **Content-Security-Policy** (only Open-Meteo, Esri/Google tiles, IMD images allowed), HSTS (2 years, preload), `X-Frame-Options: DENY` + `frame-ancestors 'none'`, `nosniff`, strict referrer, Permissions-Policy (geolocation/microphone self-only, camera/payment off), COOP. Same CSP as `<meta>` for GitHub Pages. Verified in a real browser: **0 CSP violations**, maps/data load. |
| XSS | Searched for `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, `document.write`: **none**. User/assistant text is rendered by React (escaped); WhatsApp text is `encodeURIComponent`-ed. | No change needed. |
| Secrets | Scanned the repo for API keys, tokens, `.env` files: **none committed**; `.env*` ignored; Vercel's local token file is git-ignored. The app needs no keys. | No change needed. |
| Privacy | Geolocation and microphone are only requested on an explicit tap; location is used locally to pick the nearest region and never sent anywhere; assistant runs on-device. | No change needed. |
| Backend CORS | `allow_origins=["*"]` **with** `allow_credentials=True`: Starlette reflects any Origin, letting any site make credentialed requests. | Explicit allowlist (env `AEROAGRO_ALLOWED_ORIGINS`), credentials off, only GET/POST and `Content-Type`. |
| Backend input validation | Free-form strings and unbounded coordinates | Pydantic constraints: slug-only `panchayat_id`, length- and charset-limited `crop_name`, language allowlist; lat/lon bounded to India. |
| Backend abuse | No rate limit or body limit; every call fans out to Open-Meteo | Per-IP sliding-window limit (60/min, env-tunable) with `429 Retry-After`; 4 KB body cap; security headers on every response; `/docs` and OpenAPI disabled when `AEROAGRO_ENV=production`. |
| Outbound calls | Open-Meteo requests use a 10 s timeout | No change needed. |

## 4. Honest limitations and next steps

- **Validation against observations.** The physics is standard and transparent, but it has not yet been scored against IMD AWS / ARG station data. Next step: a hold-out evaluation (RMSE and bias of block vs village values) at stations in hilly districts.
- **The backend "XGBoost/RF" service is a demonstrator** with fixed coefficients; the live site uses the client-side physics engine. A trained model needs station targets (see above).
- **The hero comparison (Fig 1) uses illustrative terrain.** Everything in *(01)–(05)* uses live forecasts and the real DEM.
- **Region covariates** (slope, drainage index, terrain class) come from the project's region registry; deriving them per panchayat directly from the DEM is the natural next step when scaling to every panchayat.
- **Assistant** is a grounded, rule-based on-device engine (no cloud LLM): reliable and private, but it only understands farming and weather questions.
