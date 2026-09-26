/**
 * AeroAgro AI - Agro-Meteorological Advisory Engine
 * Converts downscaled microclimate forecasts into crop-specific farming operations:
 * 1. Hourly "Smart Spray Window" (Safe / Caution / Do Not Spray)
 * 2. Pest & Disease Micro-Risk Index (Downy Mildew, Blast, Blight)
 * 3. Irrigation Water Deficit ($ET_0$)
 * 4. Multilingual Advisory Generator (English, Hindi, Marathi)
 */

window.AdvisoryEngine = {
  /**
   * Generate comprehensive agronomic advisory for a panchayat
   */
  generateAdvisory: function(panchayat, downscaledResult, cropName, language = "en") {
    const d = downscaledResult.downscaled;
    const crop = window.AgroData.crops[cropName] || window.AgroData.crops["Table Grapes"];

    // 1. Calculate Hourly Spray Window (06:00 AM to 08:00 PM)
    const hourlySprayWindow = this._calculateSprayHours(d, crop);

    // 2. Assess Pest & Disease Threats
    const diseaseThreats = this._assessDiseases(d, cropName);

    // 3. Assess Irrigation Needs
    const irrigationStatus = this._assessIrrigation(d, cropName);

    // 4. Assess Frost Threat (Special microclimate feature)
    const frostThreat = this._assessFrost(d, crop);

    // 5. Generate Text Advisories & WhatsApp Formats
    const formattedMessages = this._formatAdvisories(
      panchayat,
      d,
      cropName,
      hourlySprayWindow,
      diseaseThreats,
      irrigationStatus,
      frostThreat,
      language
    );

    return {
      panchayatId: panchayat.id,
      cropName: cropName,
      hourlySprayWindow: hourlySprayWindow,
      diseaseThreats: diseaseThreats,
      irrigationStatus: irrigationStatus,
      frostThreat: frostThreat,
      messages: formattedMessages
    };
  },

  /**
   * Calculate 15-hour daylight spraying suitability timeline
   */
  _calculateSprayHours: function(d, crop) {
    const hours = [];
    const baseRain = d.rainfallMm;
    const baseWind = d.windSpeedKmh;
    const baseTemp = d.tempMax;

    // Simulate hourly diurnal curve (wind rises in afternoon, rain peaks in late afternoon)
    const diurnalFactors = [
      { time: "06:00", windMod: 0.6, tempMod: 0.7, rainProb: 0.1 },
      { time: "07:00", windMod: 0.7, tempMod: 0.75, rainProb: 0.1 },
      { time: "08:00", windMod: 0.8, tempMod: 0.82, rainProb: 0.15 },
      { time: "09:00", windMod: 0.9, tempMod: 0.88, rainProb: 0.2 },
      { time: "10:00", windMod: 1.0, tempMod: 0.94, rainProb: 0.25 },
      { time: "11:00", windMod: 1.15, tempMod: 0.98, rainProb: 0.3 },
      { time: "12:00", windMod: 1.25, tempMod: 1.0, rainProb: 0.35 },
      { time: "13:00", windMod: 1.3, tempMod: 1.0, rainProb: 0.45 },
      { time: "14:00", windMod: 1.35, tempMod: 0.98, rainProb: 0.6 },
      { time: "15:00", windMod: 1.4, tempMod: 0.95, rainProb: 0.75 }, // Convective showers peak
      { time: "16:00", windMod: 1.3, tempMod: 0.92, rainProb: 0.7 },
      { time: "17:00", windMod: 1.1, tempMod: 0.88, rainProb: 0.5 },
      { time: "18:00", windMod: 0.85, tempMod: 0.82, rainProb: 0.3 },
      { time: "19:00", windMod: 0.7, tempMod: 0.78, rainProb: 0.2 }
    ];

    diurnalFactors.forEach(f => {
      const hWind = baseWind * f.windMod;
      const hTemp = baseTemp * f.tempMod;
      const hasRain = (baseRain > 10.0 && f.rainProb > 0.4) || (baseRain > 0 && f.rainProb > 0.6);

      let status = "safe"; // safe | caution | danger
      let reason = "Optimal conditions";

      if (hasRain) {
        status = "danger";
        reason = "Imminent localized rainfall (Chemical wash-off risk)";
      } else if (hWind > crop.idealSprayWindMaxKmh + 5) {
        status = "danger";
        reason = `High wind (${hWind.toFixed(1)} km/h): Severe chemical spray drift`;
      } else if (hTemp > 34.0) {
        status = "caution";
        reason = `High heat (${hTemp.toFixed(1)}°C): Risk of droplet evaporation and leaf scorch`;
      } else if (hWind > crop.idealSprayWindMaxKmh) {
        status = "caution";
        reason = `Breezy (${hWind.toFixed(1)} km/h): Use low-drift nozzles`;
      }

      hours.push({
        time: f.time,
        status: status,
        windKmh: parseFloat(hWind.toFixed(1)),
        tempC: parseFloat(hTemp.toFixed(1)),
        reason: reason
      });
    });

    return hours;
  },

  _assessDiseases: function(d, cropName) {
    const threats = [];

    if (cropName === "Table Grapes" || cropName === "Vegetables (Tomato)") {
      if (d.relativeHumidity > 80 && d.tempMin > 14 && d.tempMin < 24) {
        threats.push({
          name: "Downy Mildew & Early Blight",
          risk: "HIGH",
          color: "#f43f5e",
          description: "Sustained high microclimate humidity (>80%) and cool night temperatures create prime sporulation conditions. Apply preventative copper or metalaxyl fungicide within 24 hours."
        });
      }
    }

    if (cropName === "Paddy (Indrayani)") {
      if (d.relativeHumidity > 88 && d.rainfallMm > 20) {
        threats.push({
          name: "Paddy Blast & Bacterial Leaf Blight",
          risk: "HIGH",
          color: "#f43f5e",
          description: "High leaf wetness duration (>10 hrs) and cloud cover promote rapid blast fungal spread. Delay nitrogen/urea application."
        });
      }
    }

    if (threats.length === 0) {
      threats.push({
        name: "Fungal & Bacterial Pathogens",
        risk: "LOW",
        color: "#10b981",
        description: "Dry microclimate conditions are unfavorable for fungal spore proliferation. Standard monitoring advised."
      });
    }

    return threats;
  },

  _assessIrrigation: function(d, cropName) {
    if (d.rainfallMm > 25.0) {
      return {
        action: "SUSPEND IRRIGATION",
        status: "surplus",
        message: `Downscaled rainfall (${d.rainfallMm} mm) exceeds daily crop water requirement. Ensure field drainage channels are open to prevent root asphyxiation.`
      };
    } else if (d.rainfallMm > 8.0) {
      return {
        action: "REDUCE IRRIGATION BY 50%",
        status: "moderate",
        message: `Light localized precipitation (${d.rainfallMm} mm) will supplement soil moisture. Reduce scheduled drip irrigation duration by half.`
      };
    } else if (d.tempMax > 35.0) {
      return {
        action: "INCREASE IRRIGATION (EVAPORATION DEMAND)",
        status: "deficit",
        message: `High daytime temperature (${d.tempMax}°C) and low relative humidity (${d.relativeHumidity}%) will accelerate evapotranspiration ($ET_0 \\approx 6.8$ mm/day). Irrigate before 9:00 AM.`
      };
    } else {
      return {
        action: "NORMAL IRRIGATION SCHEDULE",
        status: "normal",
        message: `Atmospheric demand is moderate. Maintain standard crop water schedule (approx 4–5 mm/day).`
      };
    }
  },

  _assessFrost: function(d, crop) {
    if (d.tempMin <= 4.5) {
      return {
        active: true,
        severity: "CRITICAL",
        message: `CRITICAL COLD-AIR POOLING ALERT: Nocturnal temperature predicted to drop to ${d.tempMin}°C in this depression! Run light sprinkler irrigation or create evening biomass smoke mulch between 02:00 AM – 06:00 AM to preserve crop blossoms.`
      };
    } else if (d.tempMin <= 7.0) {
      return {
        active: true,
        severity: "WARNING",
        message: `COLD STRESS CAUTION: Temperature will reach ${d.tempMin}°C. Tender vegetable shoots and young grape bunches are at risk of chilling injury.`
      };
    }
    return {
      active: false,
      severity: "NONE",
      message: `No frost hazard detected (Min Temp: ${d.tempMin}°C).`
    };
  },

  /**
   * Multilingual text and WhatsApp broadcast generators
   */
  _formatAdvisories: function(panchayat, d, cropName, sprayHours, diseases, irrigation, frost, lang) {
    const pName = lang === "mr" ? panchayat.marathiName : (lang === "hi" ? panchayat.hindiName : panchayat.name);
    const safeSpraySlots = sprayHours.filter(h => h.status === "safe").map(h => h.time);
    const spraySummary = safeSpraySlots.length > 0 
      ? `${safeSpraySlots[0]} - ${safeSpraySlots[safeSpraySlots.length - 1]}`
      : "NO SAFE SPRAY WINDOW TODAY";

    // English Template
    const enText = `🌱 *AGROMET ADVISORY: ${panchayat.name.toUpperCase()}*
📍 Elevation: ${panchayat.elevationM}m | Terrain: ${panchayat.terrainType}
🌾 Crop Focus: ${cropName}

📊 *Downscaled 24h Forecast:*
• Temp: ${d.tempMin}°C to ${d.tempMax}°C
• Rainfall: ${d.rainfallMm} mm
• Wind: ${d.windSpeedKmh} km/h | RH: ${d.relativeHumidity}%

🚜 *FARM ACTIONS:*
• *Spray Window:* ${spraySummary}
• *Irrigation:* ${irrigation.action}
• *Pest Risk:* ${diseases[0].name} (${diseases[0].risk})
${frost.active ? `⚠️ *FROST ALERT:* ${frost.message}` : ''}`;

    // Marathi Template (Local State Language)
    const mrText = `🌱 *ग्रामपंचायत कृषी-हवामान सल्लागार: ${pName}*
📍 उंची: ${panchayat.elevationM} मी | भूभाग: ${panchayat.terrainType}
🌾 पीक: ${cropName}

📊 *सूक्ष्म हवामान अंदाज (पुढील २४ तास):*
• तापमान: ${d.tempMin}°C ते ${d.tempMax}°C
• पाऊस: ${d.rainfallMm} मिमी
• वारा: ${d.windSpeedKmh} किमी/तास | आर्द्रता: ${d.relativeHumidity}%

🚜 *शेतकरी कृती सल्ला:*
• *फवारणी वेळ:* ${safeSpraySlots.length > 0 ? `${spraySummary} दरम्यान फवारणी सुरक्षित` : 'आज फवारणी करू नका'}
• *पाणी नियोजन:* ${irrigation.action}
• *रोग धोका:* ${diseases[0].name} (${diseases[0].risk})
${frost.active ? `⚠️ *थंडीचा इशारा:* रात्री तापमान ${d.tempMin}°C पर्यंत घसरू शकते. हलके पाणी द्या किंवा धूर करा.` : ''}`;

    // Hindi Template
    const hiText = `🌱 *ग्राम पंचायत कृषि मौसम सलाह: ${pName}*
📍 ऊंचाई: ${panchayat.elevationM} मी | भूभाग: ${panchayat.terrainType}
🌾 फसल: ${cropName}

📊 *डाउनस्केल्ड मौसम पूर्वानुमान (24 घंटे):*
• तापमान: ${d.tempMin}°C से ${d.tempMax}°C
• वर्षा: ${d.rainfallMm} मिमी
• हवा: ${d.windSpeedKmh} किमी/घंटा | आर्द्रता: ${d.relativeHumidity}%

🚜 *किसान कार्य सलाह:*
• *छिड़काव खिड़की:* ${safeSpraySlots.length > 0 ? `${spraySummary} सुरक्षित समय` : 'आज छिड़काव न करें'}
• *सिंचाई:* ${irrigation.action}
• *रोग चेतावनी:* ${diseases[0].name} (${diseases[0].risk})
${frost.active ? `⚠️ *शीत लहर/पाला चेतावनी:* न्यूनतम तापमान ${d.tempMin}°C तक गिर सकता है। बचाव हेतु हल्की सिंचाई करें।` : ''}`;

    return {
      en: enText,
      mr: mrText,
      hi: hiText,
      activeLanguageText: lang === "mr" ? mrText : (lang === "hi" ? hiText : enText)
    };
  }
};
