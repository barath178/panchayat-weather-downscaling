/**
 * AeroAgro AI - Scientific Downscaling Engine
 * Implements Physics-Informed Microclimate Equations:
 * 1. Environmental Lapse Rate & Nocturnal Cold-Air Drainage (Thermal Inversion)
 * 2. Orographic Precipitation Multiplier (Windward vs. Leeward Föhn Rainshadow)
 * 3. Magnus-Tetens Formula for Localized Relative Humidity & Dew Point
 * 4. Crest Topographic Wind Speedup
 * 5. Frost Pocket & Cold Air Pool Index
 */

window.DownscalingEngine = {
  // Constants
  LAPSE_RATE_STANDARD: -0.0065, // -6.5 °C per 1000m
  LAPSE_RATE_DRY: -0.0098,      // -9.8 °C per 1000m
  LAPSE_RATE_MOIST: -0.0050,    // -5.0 °C per 1000m (Monsoon saturated air)

  /**
   * Downscale coarse weather variables to a specific Panchayat
   * @param {Object} panchayat - Panchayat GIS metadata
   * @param {Object} scenario - Current meteorological scenario
   * @param {Object} coarseGrid - Regional coarse grid metadata
   * @returns {Object} Downscaled microclimate parameters + explainability breakdown
   */
  downscaleForPanchayat: function(panchayat, scenario, coarseGrid) {
    const coarse = scenario.coarseForecast;
    const deltaZ = panchayat.elevationM - coarseGrid.meanElevation; // Elevation difference in meters
    const isWinterInversion = scenario.id === "winter_frost";
    const isMonsoon = scenario.id === "monsoon";

    // 1. Calculate Localized Temperature (Lapse rate + Thermal Inversion dynamics)
    let lapseRate = this.LAPSE_RATE_STANDARD;
    if (isMonsoon) lapseRate = this.LAPSE_RATE_MOIST;

    // Daytime Max Temperature
    let lapseAdjustmentDay = deltaZ * lapseRate;
    // Topographic solar exposure correction (slight cooling in narrow valleys, warming on open plateaus)
    let solarBonus = (panchayat.slopeAspect === "Leeward (East)") ? 0.6 : -0.3;
    let localTempMax = coarse.tempMax + lapseAdjustmentDay + solarBonus;

    // Nighttime Min Temperature with Cold Air Drainage
    let localTempMin;
    let inversionAdjustment = 0;

    if (isWinterInversion) {
      // Clear sky, low wind (< 5 km/h) creates intense nocturnal radiational cooling
      // Cold, dense air drains downhill and pools in valleys (high drainageAccumulation)
      // Ridges experience "Thermal Belt" effect where they remain warmer than valley floors!
      if (panchayat.drainageAccumulation > 0.5) {
        // Valley cold air pool
        inversionAdjustment = -(panchayat.drainageAccumulation * 7.4); // Down to -7.0°C drop in deep basins
        localTempMin = coarse.tempMin + inversionAdjustment;
      } else {
        // High ridges above the inversion boundary
        inversionAdjustment = +2.2 + (deltaZ * 0.002); // Ridge remains surprisingly warm
        localTempMin = coarse.tempMin + inversionAdjustment;
      }
    } else {
      // Standard night lapse rate
      localTempMin = coarse.tempMin + (deltaZ * lapseRate);
    }

    // 2. Calculate Orographic Precipitation Multiplier
    let orographicMultiplier = 1.0;
    let rainShadowDampening = 1.0;

    if (isMonsoon && coarse.rainfallMm > 0) {
      if (panchayat.slopeAspect.includes("Windward") || panchayat.elevationM > 900) {
        // Upslope windward expansion (Arabian Sea moisture lifting)
        // High ridges trigger severe orographic precipitation amplification
        const elevationFactor = Math.max(0, deltaZ / 300);
        orographicMultiplier = 1.0 + (elevationFactor * 0.95) + (Math.sin(panchayat.slopeDeg * Math.PI / 180) * 0.7);
      } else if (panchayat.slopeAspect.includes("Leeward") || panchayat.terrainType.includes("Plains")) {
        // Föhn / Rain Shadow effect on the Deccan plateau eastern descent
        rainShadowDampening = 0.42; // Up to 58% reduction compared to block average
        orographicMultiplier = rainShadowDampening;
      } else {
        // Valley interior
        orographicMultiplier = 1.15;
      }
    } else if (scenario.id === "pre_monsoon") {
      // Isolated convective thunderstorms triggered by elevated heating
      if (panchayat.elevationM > 800) {
        orographicMultiplier = 2.4; // Localized thunderstorm storm cell
      } else {
        orographicMultiplier = 0.5; // Dry pocket
      }
    }

    const localRainfallMm = parseFloat((coarse.rainfallMm * orographicMultiplier).toFixed(1));

    // 3. Calculate Localized Wind Speed (Ridge crest acceleration vs. Valley shielding)
    let windSpeedup = 1.0;
    if (panchayat.elevationM > 800 || panchayat.terrainType.includes("Crest")) {
      // Topographic speedup: S = 1 + 2 * (h / L)
      windSpeedup = 1.0 + (deltaZ / 400) * 0.8;
    } else if (panchayat.terrainType.includes("Depression") || panchayat.terrainType.includes("Valley")) {
      // Valley sheltering
      windSpeedup = 0.65;
    }
    const localWindSpeedKmh = parseFloat((coarse.windSpeedKmh * windSpeedup).toFixed(1));

    // 4. Local Relative Humidity via Magnus-Tetens Equation
    // e_s(T) = 6.1078 * exp((17.27 * T) / (T + 237.3))
    const calcSatVaporPressure = (T) => 6.1078 * Math.exp((17.27 * T) / (T + 237.3));
    const coarseSatVP = calcSatVaporPressure(coarse.tempMax);
    const coarseActualVP = (coarse.relativeHumidity / 100) * coarseSatVP;

    // Valley moisture enhancement (proximity to rivers/dams like Panshet or Mula river)
    let moistureAddition = 0;
    if (panchayat.terrainType.includes("Shoreline") || panchayat.terrainType.includes("Valley")) {
      moistureAddition = 1.2; // hPa vapor addition
    }

    const localActualVP = coarseActualVP + moistureAddition;
    const localSatVP = calcSatVaporPressure(localTempMin); // Saturated at coolest hour
    let localRH = Math.min(99, Math.max(20, Math.round((localActualVP / localSatVP) * 100)));

    // 5. Compute Frost Pocket Hazard Index (0 - 100)
    let frostIndex = 0;
    if (localTempMin < 4.5) {
      frostIndex = 95; // Extreme frost danger
    } else if (localTempMin < 7.0) {
      frostIndex = 65; // Moderate frost danger
    } else if (localTempMin < 9.0) {
      frostIndex = 30; // Low caution
    }

    // 6. Compute Crop Waterlogging Hazard Index
    let waterlogIndex = 0;
    if (localRainfallMm > 50 && panchayat.drainageAccumulation > 0.6) {
      waterlogIndex = 90; // High flash pooling
    } else if (localRainfallMm > 30 && panchayat.drainageAccumulation > 0.5) {
      waterlogIndex = 60;
    } else {
      waterlogIndex = 15;
    }

    return {
      panchayatId: panchayat.id,
      panchayatName: panchayat.name,
      elevationM: panchayat.elevationM,
      downscaled: {
        tempMax: parseFloat(localTempMax.toFixed(1)),
        tempMin: parseFloat(localTempMin.toFixed(1)),
        tempMean: parseFloat(((localTempMax + localTempMin) / 2).toFixed(1)),
        rainfallMm: localRainfallMm,
        relativeHumidity: localRH,
        windSpeedKmh: localWindSpeedKmh,
        frostHazardIndex: frostIndex,
        waterlogHazardIndex: waterlogIndex
      },
      coarseBaseline: coarse,
      explainability: {
        deltaZ: deltaZ,
        lapseRateUsed: lapseRate,
        lapseDeltaT: parseFloat(lapseAdjustmentDay.toFixed(2)),
        inversionDeltaT: parseFloat(inversionAdjustment.toFixed(2)),
        orographicMultiplier: parseFloat(orographicMultiplier.toFixed(2)),
        windSpeedupFactor: parseFloat(windSpeedup.toFixed(2)),
        drainageAccumulation: panchayat.drainageAccumulation,
        scientificRationale: this._getRationale(panchayat, scenario, localTempMin, localRainfallMm)
      }
    };
  },

  /**
   * Downscale for all Panchayats in the region
   */
  downscaleAll: function(data) {
    const results = {};
    data.panchayats.forEach(p => {
      results[p.id] = this.downscaleForPanchayat(p, data.scenarios[data.currentScenario || "monsoon"], data.coarseGrid);
    });
    return results;
  },

  _getRationale: function(panchayat, scenario, tMin, rain) {
    if (scenario.id === "winter_frost" && tMin < 6.0) {
      return `Severe cold-air pooling detected. Katabatic winds drain down surrounding slopes into the ${panchayat.name} depression (Drainage Accumulation: ${(panchayat.drainageAccumulation * 100).toFixed(0)}%). Temperature drops ${Math.abs(tMin - scenario.coarseForecast.tempMin).toFixed(1)}°C below coarse block forecast.`;
    }
    if (scenario.id === "monsoon" && rain > 45.0) {
      return `Orographic mechanical lift active. Windward SW monsoonal airflow ascends ${panchayat.name} elevation (+${panchayat.elevationM}m), accelerating condensation. Local precipitation is ${(rain / scenario.coarseForecast.rainfallMm).toFixed(1)}x greater than block average.`;
    }
    if (scenario.id === "monsoon" && rain < 15.0) {
      return `Föhn rainshadow effect. Air descending the leeward eastern slope undergoes adiabatic warming and drying, dampening rainfall to ${(rain / scenario.coarseForecast.rainfallMm).toFixed(1)}x of block forecast.`;
    }
    return `Standard environmental lapse rate (-6.5°C/km) with slope solar irradiation weighting applied to baseline IMD grid.`;
  }
};
