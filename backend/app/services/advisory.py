from typing import Dict, Any, List

class AgrometAdvisoryService:
    """
    ICAR-aligned Agro-Meteorological Advisory Service.
    Computes hourly spraying suitability, disease risk indices,
    and multilingual WhatsApp advisories.
    """

    @classmethod
    def generate_advisory(cls, downscaled: Dict[str, Any], crop_name: str = "Table Grapes", lang: str = "en") -> Dict[str, Any]:
        tmax = downscaled.get("temp_max_c", 30.0)
        tmin = downscaled.get("temp_min_c", 20.0)
        rain = downscaled.get("rainfall_mm", 0.0)
        wind = downscaled.get("wind_speed_kmh", 12.0)
        rh = downscaled.get("relative_humidity_pct", 70)
        p_name = downscaled.get("panchayat_name", "Gram Panchayat")

        # 1. Hourly Spray Windows (06:00 to 19:00)
        spray_hours = []
        safe_hours = []

        hours_profile = [
            ("06:00", 0.6, 0.7), ("07:00", 0.7, 0.75), ("08:00", 0.8, 0.82),
            ("09:00", 0.9, 0.88), ("10:00", 1.0, 0.94), ("11:00", 1.15, 0.98),
            ("12:00", 1.25, 1.0), ("13:00", 1.3, 1.0), ("14:00", 1.35, 0.98),
            ("15:00", 1.4, 0.95), ("16:00", 1.3, 0.92), ("17:00", 1.1, 0.88),
            ("18:00", 0.85, 0.82), ("19:00", 0.7, 0.78)
        ]

        for time_str, w_mod, t_mod in hours_profile:
            h_wind = wind * w_mod
            h_temp = tmax * t_mod

            if rain > 5.0:
                status = "DANGER"
                reason = "Imminent wash-off"
            elif h_wind > 15.0:
                status = "DANGER"
                reason = f"High wind drift ({round(h_wind, 1)} km/h)"
            elif h_temp > 34.0:
                status = "CAUTION"
                reason = "Evaporation & leaf scorch"
            else:
                status = "SAFE"
                reason = "Optimal microclimate"
                safe_hours.append(time_str)

            spray_hours.append({
                "time": time_str,
                "status": status,
                "wind_kmh": round(h_wind, 1),
                "temp_c": round(h_temp, 1),
                "reason": reason
            })

        spray_summary = f"{safe_hours[0]} to {safe_hours[-1]}" if safe_hours else "NO SAFE WINDOW TODAY"

        # 2. Disease Trigger Analysis
        disease_alerts = []
        if crop_name == "Table Grapes":
            if rh > 80 and 16 <= tmin <= 24:
                disease_alerts.append({
                    "pathogen": "Downy Mildew (Plasmopara viticola)",
                    "risk": "HIGH",
                    "action": "Spray copper oxychloride or metalaxyl preventative within 24 hours."
                })
        elif crop_name == "Paddy":
            if rh > 85 and rain > 10.0:
                disease_alerts.append({
                    "pathogen": "Blast Disease (Pyricularia oryzae)",
                    "risk": "HIGH",
                    "action": "Withhold top-dressing of urea. Maintain water depth below 5 cm."
                })

        if not disease_alerts:
            disease_alerts.append({
                "pathogen": "Common Pathogens",
                "risk": "LOW",
                "action": "Standard field monitoring sufficient."
            })

        # 3. Irrigation Recommendation
        if rain > 20.0:
            irrigation = "SUSPEND IRRIGATION (Rainfall Surplus)"
        elif tmax > 35.0:
            irrigation = "INCREASE DRIP DURATION (High Evaporative Demand)"
        else:
            irrigation = "NORMAL IRRIGATION SCHEDULE"

        # 4. Multilingual WhatsApp Formats
        en_msg = (
            f"🌱 *AGROMET ADVISORY: {p_name.upper()}*\n"
            f"🌾 Crop: {crop_name}\n"
            f"📊 Forecast: {tmin}°C to {tmax}°C | Rain: {rain} mm | Wind: {wind} km/h\n"
            f"🚜 *ACTIONS:*\n"
            f"• Spray Window: {spray_summary}\n"
            f"• Irrigation: {irrigation}\n"
            f"• Disease Risk: {disease_alerts[0]['pathogen']} ({disease_alerts[0]['risk']})"
        )

        mr_msg = (
            f"🌱 *ग्रामपंचायत कृषी हवामान सल्ला: {p_name}*\n"
            f"🌾 पीक: {crop_name}\n"
            f"📊 सूक्ष्म अंदाज: {tmin}°C ते {tmax}°C | पाऊस: {rain} मिमी | वारा: {wind} किमी/तास\n"
            f"🚜 *कृती सल्ला:*\n"
            f"• फवारणी वेळ: {spray_summary if safe_hours else 'आज फवारणी करू नका'}\n"
            f"• पाणी नियोजन: {irrigation}\n"
            f"• रोग धोका: {disease_alerts[0]['pathogen']} ({disease_alerts[0]['risk']})"
        )

        return {
            "panchayat_name": p_name,
            "crop_name": crop_name,
            "spray_summary": spray_summary,
            "hourly_spray_window": spray_hours,
            "disease_alerts": disease_alerts,
            "irrigation_action": irrigation,
            "whatsapp_message": mr_msg if lang == "mr" else en_msg
        }
