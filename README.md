# AeroAgro AI: Microclimate Weather Downscaling Platform
### Inferring High-Resolution Gram Panchayat Weather from Block-Level Forecasts for Precision Agromet Advisories

A full-stack precision agriculture and agro-meteorological advisory platform aligned with the following production architecture:

| Layer | Technology | Role in Project |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14 + Tailwind CSS** | Fast responsive dashboard with glassmorphism aesthetics |
| **Maps** | **Google Maps (JavaScript API)** | Interactive Google Terrain, Satellite Hybrid, and Dark Styled vector maps |
| **Backend API** | **FastAPI (Python)** | High-performance async REST API for downscaling & advisories |
| **ML Engine** | **Python + XGBoost + Random Forest** | Tabular spatial downscaling using terrain & vegetation covariates |
| **Geospatial** | **GeoPandas + Rasterio + Shapely** | Panchayat boundaries, DEM elevation slicing, and spatial joins |
| **Database** | **PostgreSQL + PostGIS** | Native spatial geometry indexing (`GIST`) and timeseries storage |
| **DB Hosting** | **Supabase Free Tier** | Managed PostGIS database, row-level security, and authentication |
| **Weather Ingestion** | **Open-Meteo API** | Free coarse meteorological NWP forecasts (~10–25 km) |
| **Historical Weather** | **Copernicus ERA5-Land** | Gridded training dataset for machine learning models |
| **Satellite Imagery** | **Sentinel-2 & Google Earth Engine** | Normalized Difference Vegetation Index (NDVI) extraction |
| **Terrain Elevation** | **NASA SRTM 30m DEM** | Topographic elevation, slope, and cold-air drainage accumulation |
| **Model Training** | **Google Colab** | Free cloud Python training pipeline for XGBoost & Random Forest |
| **Data Viz / Charts** | **Recharts** | Diurnal temperature/wind curves and hourly spray windows |
| **Deployment** | **Vercel (UI) + Render / Railway (API)** | Production hosting with free/hobby tiers |
| **Farmer Delivery** | **WhatsApp / Telegram Gateway** | Automated regional language (Marathi, Hindi, English) advisories |

---

## Project Structure

```
panchayat-weather-downscaling/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app with downscaling & advisory endpoints
│   │   ├── ml/
│   │   │   └── downscaler.py        # XGBoost & Random Forest tabular inference engine
│   │   └── services/
│   │       ├── open_meteo.py        # Ingestion service for coarse numerical weather
│   │       └── advisory.py          # ICAR-aligned crop spray window & disease rules
│   ├── notebooks/
│   │   └── colab_training.py        # Google Colab training script for ERA5 + SRTM + Sentinel
│   └── requirements.txt             # Python backend dependencies
│
├── frontend/
│   ├── package.json                 # Next.js, Google Maps, Recharts, Tailwind dependencies
│   └── src/
│       └── components/
│           ├── GoogleMapComponent.tsx# Google Maps (Terrain, Satellite, Dark Styled)
│           ├── SprayTimelineChart.tsx# Recharts diurnal spray window visualization
│           ├── ElevationProfile.tsx  # 3D Inversion cross-section profile
│           ├── AcousticSpectrogram.tsx# Web Audio API acoustic rain gauge
│           ├── KisanMobileView.tsx   # Smartphone simulator with voice & WhatsApp share
│           └── PanchayatKioskView.tsx# Gram Panchayat full-screen wallboard mode
│
├── supabase/
│   └── migrations/
│       └── 001_init_postgis.sql     # PostGIS schema (panchayats, forecasts, advisories)
│
└── index.html                       # Standalone zero-dependency Web GIS demonstration
```

---

## Quickstart Guide

### 1. Database Setup (Supabase PostGIS)
1. Create a free project on [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab.
3. Paste and run the contents of [`supabase/migrations/001_init_postgis.sql`](file:///c:/Users/barat/.antigravity-ide/panchayat-weather-downscaling/supabase/migrations/001_init_postgis.sql).
4. Copy your Supabase URL and anon/service key to `.env`.

### 2. Model Training (Google Colab)
1. Open [Google Colab](https://colab.research.google.com).
2. Open [`backend/notebooks/colab_training.py`](file:///c:/Users/barat/.antigravity-ide/panchayat-weather-downscaling/backend/notebooks/colab_training.py).
3. Run all cells to train the `XGBRegressor` (temperature) and `RandomForestRegressor` (precipitation).
4. Download the generated model files (`temp_downscaler_xgb.json` and `rain_downscaler_rf.joblib`).

### 3. Backend API (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- Interactive Swagger docs will be live at: `http://localhost:8000/docs`
- Endpoints:
  - `GET /api/v1/panchayats`: List monitored Panchayats with terrain attributes.
  - `GET /api/v1/downscale`: Ingest coarse Open-Meteo weather and run ML downscaling.
  - `POST /api/v1/advisory`: Generate hourly spray windows and WhatsApp advisories.

### 4. Frontend Dashboard (Next.js + MapLibre GL)
```bash
cd frontend
npm install
npm run dev
```
- Web dashboard live at: `http://localhost:3000`

### 5. Standalone Offline Demonstration
To explore the physics engine, interactive Leaflet map, frost pocket simulator, and tin-roof acoustic rain gauge immediately without installing npm or python:
- Open [`index.html`](file:///c:/Users/barat/.antigravity-ide/panchayat-weather-downscaling/index.html) in your browser.
