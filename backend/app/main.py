import os
import time
from collections import defaultdict, deque
from typing import Deque, Dict, Literal

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from app.services.open_meteo import OpenMeteoService
from app.ml.downscaler import TabularDownscalerML
from app.services.advisory import AgrometAdvisoryService

IS_PRODUCTION = os.getenv("AEROAGRO_ENV", "development") == "production"

app = FastAPI(
    title="AeroAgro AI API",
    description="Microclimate Weather Downscaling (Block to Panchayat) & Agromet Advisory Engine",
    version="1.0.0",
    # Interactive docs are handy locally but are reconnaissance surface in production.
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    openapi_url=None if IS_PRODUCTION else "/openapi.json",
)

# CORS: an explicit allowlist, no credentials. ("*" together with credentials makes Starlette
# reflect any Origin, letting any website make credentialed calls.)
ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv(
        "AEROAGRO_ALLOWED_ORIGINS",
        "https://aeroagro.vercel.app,https://barath178.github.io,http://localhost:3000",
    ).split(",")
    if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
    max_age=600,
)

# Per-IP sliding-window rate limit: each request can trigger an outbound Open-Meteo call,
# so unbounded traffic would both exhaust the free quota and slow every user down.
RATE_LIMIT = int(os.getenv("AEROAGRO_RATE_LIMIT_PER_MIN", "60"))
_hits: Dict[str, Deque[float]] = defaultdict(deque)
MAX_BODY_BYTES = 4096


@app.middleware("http")
async def guard(request: Request, call_next):
    if request.url.path != "/health":
        ip = request.client.host if request.client else "unknown"
        now = time.monotonic()
        q = _hits[ip]
        while q and now - q[0] > 60:
            q.popleft()
        if len(q) >= RATE_LIMIT:
            return JSONResponse({"detail": "Too many requests"}, status_code=429, headers={"Retry-After": "60"})
        q.append(now)
    if int(request.headers.get("content-length") or 0) > MAX_BODY_BYTES:
        return JSONResponse({"detail": "Request body too large"}, status_code=413)

    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Cache-Control"] = "no-store"
    response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'"
    return response

# In-memory spatial catalog of Panchayats (Synced with Supabase PostGIS)
PILOT_PANCHAYATS = [
    {
        "id": "panchayat_paud",
        "name": "Paud Gram Panchayat",
        "lat": 18.5312,
        "lng": 73.6124,
        "elevationM": 595.0,
        "terrainType": "River Valley Basin",
        "drainageAccumulation": 0.88,
        "slopeDeg": 3.2,
        "slopeAspect": "Valley Floor",
        "ndvi": 0.65
    },
    {
        "id": "panchayat_dasve",
        "name": "Dasve Ridge Panchayat",
        "lat": 18.4110,
        "lng": 73.5040,
        "elevationM": 1045.0,
        "terrainType": "High Escarpment Crest",
        "drainageAccumulation": 0.08,
        "slopeDeg": 22.5,
        "slopeAspect": "Windward (SW)",
        "ndvi": 0.78
    },
    {
        "id": "panchayat_male",
        "name": "Male Valley Basin",
        "lat": 18.4680,
        "lng": 73.5550,
        "elevationM": 558.0,
        "terrainType": "Enclosed Deep Depression",
        "drainageAccumulation": 0.95,
        "slopeDeg": 1.8,
        "slopeAspect": "Enclosed Basin",
        "ndvi": 0.58
    },
    {
        "id": "panchayat_sinhagad",
        "name": "Sinhagad Ridge Peak",
        "lat": 18.3664,
        "lng": 73.7558,
        "elevationM": 1315.0,
        "terrainType": "Basalt Cliff & Ridge Peak",
        "drainageAccumulation": 0.02,
        "slopeDeg": 34.0,
        "slopeAspect": "Crest Line",
        "ndvi": 0.45
    },
    {
        "id": "tn_thiruvaiyaru",
        "name": "Thiruvaiyaru Cauvery Delta",
        "state": "Tamil Nadu",
        "lat": 10.8845,
        "lng": 79.1065,
        "elevationM": 38.0,
        "terrainType": "Alluvial River Delta Basin",
        "drainageAccumulation": 0.85,
        "slopeDeg": 0.8,
        "slopeAspect": "Delta Flat Floor",
        "ndvi": 0.82
    },
    {
        "id": "tn_ooty",
        "name": "Ooty Valley Basin",
        "state": "Tamil Nadu",
        "lat": 11.4102,
        "lng": 76.6950,
        "elevationM": 2240.0,
        "terrainType": "High Altitude Valley Basin (Frost Hollow)",
        "drainageAccumulation": 0.94,
        "slopeDeg": 6.8,
        "slopeAspect": "Valley Basin Floor",
        "ndvi": 0.88
    },
    {
        "id": "dl_new_delhi",
        "name": "New Delhi Capital Core",
        "state": "Delhi NCR",
        "lat": 28.6139,
        "lng": 77.2090,
        "elevationM": 216.0,
        "terrainType": "National Capital Urban Zone",
        "drainageAccumulation": 0.65,
        "slopeDeg": 0.5,
        "slopeAspect": "Urban Canopy",
        "ndvi": 0.32
    },
    {
        "id": "ka_bengaluru",
        "name": "Bengaluru Urban Tech Core",
        "state": "Karnataka",
        "lat": 12.9716,
        "lng": 77.5946,
        "elevationM": 920.0,
        "terrainType": "High Deccan Ridge Plateau",
        "drainageAccumulation": 0.45,
        "slopeDeg": 1.2,
        "slopeAspect": "Ridge Plateau",
        "ndvi": 0.42
    },
    {
        "id": "kl_kuttanad",
        "name": "Kuttanad Below-Sea Basin",
        "state": "Kerala",
        "lat": 9.4700,
        "lng": 76.4500,
        "elevationM": 2.0,
        "terrainType": "Sub-Sea-Level Backwater Delta",
        "drainageAccumulation": 0.98,
        "slopeDeg": 0.1,
        "slopeAspect": "Delta Flat",
        "ndvi": 0.89
    }
]

downscaler_ml = TabularDownscalerML()

class AdvisoryRequest(BaseModel):
    # Strictly shaped inputs: ids are slugs, crop names are short plain text, languages are an allowlist.
    panchayat_id: str = Field(..., min_length=1, max_length=64, pattern=r"^[a-z0-9_]+$")
    crop_name: str = Field("Table Grapes", min_length=1, max_length=64, pattern=r"^[A-Za-z0-9 ()\-.,']+$")
    language: Literal["en", "mr"] = "en"

@app.get("/health")
def health_check():
    return {"status": "online", "system": "AeroAgro AI FastAPI Backend", "version": "1.0.0"}

@app.get("/api/v1/panchayats")
def get_panchayats():
    """
    Returns list of monitored Panchayats with terrain covariates
    """
    return {"status": "success", "count": len(PILOT_PANCHAYATS), "data": PILOT_PANCHAYATS}

@app.get("/api/v1/downscale")
def downscale_block(
    # Bounded to India's extent: rejects junk and stops the API being used as a global proxy.
    block_lat: float = Query(18.4520, ge=6.0, le=37.5, description="Block Center Latitude"),
    block_lng: float = Query(73.6550, ge=68.0, le=97.5, description="Block Center Longitude")
):
    """
    1. Ingests coarse weather from Open-Meteo
    2. Runs XGBoost/Random Forest spatial downscaling for each Panchayat
    """
    coarse = OpenMeteoService.fetch_coarse_forecast(block_lat, block_lng)
    
    # Extract coarse values
    daily = coarse.get("daily", {})
    coarse_weather = {
        "tempMax": daily.get("temperature_2m_max", [30.0])[0],
        "tempMin": daily.get("temperature_2m_min", [20.0])[0],
        "rainfallMm": daily.get("precipitation_sum", [15.0])[0],
        "windSpeedKmh": daily.get("wind_speed_10m_max", [16.0])[0],
        "relativeHumidity": 75.0
    }

    downscaled_results = []
    for p in PILOT_PANCHAYATS:
        pred = downscaler_ml.predict_panchayat_weather(coarse_weather, p)
        downscaled_results.append(pred)

    return {
        "status": "success",
        "block_coarse_baseline": coarse_weather,
        "downscaled_panchayats": downscaled_results
    }

@app.post("/api/v1/advisory")
def generate_advisory(req: AdvisoryRequest):
    """
    Computes crop spray window, disease triggers, and WhatsApp advisory
    """
    # Find targeted panchayat
    target_p = next((p for p in PILOT_PANCHAYATS if p["id"] == req.panchayat_id), None)
    if not target_p:
        raise HTTPException(status_code=404, detail="Panchayat not found")

    # Fetch live weather & downscale
    coarse = OpenMeteoService.fetch_coarse_forecast(target_p["lat"], target_p["lng"])
    daily = coarse.get("daily", {})
    coarse_weather = {
        "tempMax": daily.get("temperature_2m_max", [30.0])[0],
        "tempMin": daily.get("temperature_2m_min", [20.0])[0],
        "rainfallMm": daily.get("precipitation_sum", [15.0])[0],
        "windSpeedKmh": daily.get("wind_speed_10m_max", [16.0])[0],
        "relativeHumidity": 75.0
    }

    downscaled = downscaler_ml.predict_panchayat_weather(coarse_weather, target_p)
    advisory = AgrometAdvisoryService.generate_advisory(downscaled, req.crop_name, req.language)

    return {
        "status": "success",
        "downscaled_weather": downscaled,
        "advisory": advisory
    }
