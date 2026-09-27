import requests
from typing import Dict, Any

class OpenMeteoService:
    """
    Ingests coarse numerical weather predictions from Open-Meteo's free meteorological API
    (No API key required. Uses GFS / ECMWF ensemble at ~10-25km grid).
    """
    BASE_URL = "https://api.open-meteo.com/v1/forecast"

    @classmethod
    def fetch_coarse_forecast(cls, lat: float, lng: float) -> Dict[str, Any]:
        """
        Fetch 7-day hourly and daily coarse forecast for a Block center point
        """
        params = {
            "latitude": lat,
            "longitude": lng,
            # Open-Meteo expects comma-separated variable lists
            "hourly": ",".join([
                "temperature_2m",
                "relative_humidity_2m",
                "precipitation",
                "wind_speed_10m",
                "wind_direction_10m",
                "direct_normal_irradiance"
            ]),
            "daily": ",".join([
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_sum",
                "wind_speed_10m_max"
            ]),
            "timezone": "Asia/Kolkata",
            "forecast_days": 3
        }

        try:
            response = requests.get(cls.BASE_URL, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            return {
                "status": "success",
                "source": "Open-Meteo GFS/ECMWF Coarse",
                "latitude": data.get("latitude"),
                "longitude": data.get("longitude"),
                "elevation": data.get("elevation"),
                "hourly": data.get("hourly", {}),
                "daily": data.get("daily", {})
            }
        except Exception as e:
            # Fallback to realistic mock if offline
            return {
                "status": "fallback_mock",
                "error": str(e),
                "latitude": lat,
                "longitude": lng,
                "daily": {
                    "temperature_2m_max": [31.5, 32.0, 30.8],
                    "temperature_2m_min": [21.0, 20.5, 21.2],
                    "precipitation_sum": [24.0, 18.5, 5.0],
                    "wind_speed_10m_max": [19.5, 21.0, 14.0]
                }
            }
