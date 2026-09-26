from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.services.open_meteo import OpenMeteoService
from app.ml.downscaler import TabularDownscalerML
from app.services.advisory import AgrometAdvisoryService

app = FastAPI(
    title="AeroAgro AI API",
    description="Microclimate Weather Downscaling (Block to Panchayat) & Agromet Advisory Engine",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    }
]

downscaler_ml = TabularDownscalerML()

class AdvisoryRequest(BaseModel):
    panchayat_id: str
    crop_name: str = "Table Grapes"
    language: str = "en"

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
    block_lat: float = Query(18.4520, description="Block Center Latitude"),
    block_lng: float = Query(73.6550, description="Block Center Longitude")
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
