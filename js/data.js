/**
 * AeroAgro AI - Comprehensive Dataset
 * Geographic boundaries, Topography, Scenarios, and Crop Models
 * Region: Mulshi-Velhe-Haveli Block (Western Ghats, Maharashtra)
 */

window.AgroData = {
  region: {
    name: "Mulshi-Velhe Agro-Climatic Zone",
    district: "Pune",
    state: "Maharashtra",
    country: "India",
    center: [18.4520, 73.6550],
    defaultZoom: 11,
    coarseResolutionKm: 18,
    fineResolutionKm: 1.2
  },

  // 12km Coarse Weather Prediction Grid (Simulating IMD / GFS NWP model output)
  coarseGrid: {
    id: "IMD-WRF-GRID-411038",
    bounds: [
      [18.3200, 73.4800],
      [18.5800, 73.8200]
    ],
    meanElevation: 680, // meters
    aspectAngleDeg: 245 // Facing West-Southwest into Arabian Sea winds
  },

  // Three Weather Scenarios demonstrating different physical meteorological effects
  scenarios: {
    monsoon: {
      id: "monsoon",
      name: "Monsoon Surge (Orographic Rainfall & Flash Runoff)",
      description: "Moisture-laden Arabian Sea winds hit the Western Ghats escarpment, causing extreme orographic rainfall amplification on windward slopes while valley basins face waterlogging.",
      coarseForecast: {
        tempMax: 26.5,
        tempMin: 22.0,
        rainfallMm: 28.0,
        relativeHumidity: 82,
        windSpeedKmh: 22.0,
        windDirectionDeg: 240, // WSW
        solarRadiationWm2: 280,
        dewPointC: 21.0
      }
    },
    winter_frost: {
      id: "winter_frost",
      name: "Winter Clear Night (Thermal Inversion & Frost Pockets)",
      description: "Under cloudless nocturnal skies, radiational cooling causes dense cold air to drain into river basins and depressions, creating dangerous sub-5°C frost pockets while ridges remain warm.",
      coarseForecast: {
        tempMax: 27.0,
        tempMin: 11.5,
        rainfallMm: 0.0,
        relativeHumidity: 58,
        windSpeedKmh: 4.0,
        windDirectionDeg: 45, // NE calm
        solarRadiationWm2: 650,
        dewPointC: 4.0
      }
    },
    pre_monsoon: {
      id: "pre_monsoon",
      name: "Pre-Monsoon Heat & Convective Spray Window",
      description: "Intense daytime surface heating creates high vapor pressure deficits. Afternoon convective cumulus clouds trigger localized squalls and high chemical drift risks.",
      coarseForecast: {
        tempMax: 38.2,
        tempMin: 23.5,
        rainfallMm: 6.5,
        relativeHumidity: 45,
        windSpeedKmh: 14.0,
        windDirectionDeg: 290, // WNW
        solarRadiationWm2: 880,
        dewPointC: 15.0
      }
    }
  },

  // Gram Panchayats with rich real-world geographical coordinates, elevations, and crop distributions
  panchayats: [
    {
      id: "panchayat_paud",
      name: "Paud Gram Panchayat",
      marathiName: "पौड ग्रामपंचायत",
      hindiName: "पौड ग्राम पंचायत",
      lat: 18.5312,
      lng: 73.6124,
      elevationM: 595,
      terrainType: "River Valley (Mula Basin)",
      drainageAccumulation: 0.88, // High cold air drainage accumulation index
      slopeDeg: 3.2,
      slopeAspect: "Valley Floor",
      primaryCrops: ["Sugarcane", "Paddy (Indrayani)", "Vegetables (Tomato)"],
      soilType: "Clay Loam (Deep Alluvial)",
      polygonCoords: [
        [18.545, 73.595],
        [18.550, 73.625],
        [18.520, 73.630],
        [18.515, 73.600]
      ]
    },
    {
      id: "panchayat_dasve",
      name: "Dasve Ridge Panchayat",
      marathiName: "दासवे माथा ग्रामपंचायत",
      hindiName: "दासवे रिज ग्राम पंचायत",
      lat: 18.4110,
      lng: 73.5040,
      elevationM: 1045,
      terrainType: "High Escarpment Crest",
      drainageAccumulation: 0.08, // Crest - cold air sheds away
      slopeDeg: 22.5,
      slopeAspect: "Windward (SW)",
      primaryCrops: ["Floriculture (Greenhouse)", "Coffee/Spice Trials", "Finger Millet"],
      soilType: "Lateritic Red Soil",
      polygonCoords: [
        [18.425, 73.490],
        [18.428, 73.520],
        [18.398, 73.518],
        [18.395, 73.488]
      ]
    },
    {
      id: "panchayat_male",
      name: "Male Valley Basin",
      marathiName: "माले खोरे ग्रामपंचायत",
      hindiName: "माले घाटी ग्राम पंचायत",
      lat: 18.4680,
      lng: 73.5550,
      elevationM: 558, // Lowest depression! Prime frost pocket!
      terrainType: "Enclosed Deep Depression",
      drainageAccumulation: 0.95, // Maximum cold-air pooling!
      slopeDeg: 1.8,
      slopeAspect: "Enclosed Basin",
      primaryCrops: ["Table Grapes", "Tomato", "Exotic Vegetables"],
      soilType: "Rich Valley Silt Loam",
      polygonCoords: [
        [18.480, 73.540],
        [18.485, 73.570],
        [18.455, 73.572],
        [18.450, 73.542]
      ]
    },
    {
      id: "panchayat_pirangut",
      name: "Pirangut Plateau Panchayat",
      marathiName: "पिरंगुट पठार ग्रामपंचायत",
      hindiName: "पिरंगुट पठार ग्राम पंचायत",
      lat: 18.5120,
      lng: 73.6820,
      elevationM: 645,
      terrainType: "Transitional Tableland",
      drainageAccumulation: 0.35,
      slopeDeg: 4.5,
      slopeAspect: "East Facing",
      primaryCrops: ["Floriculture (Dutch Roses)", "Vegetables (Capsicum)", "Soybean"],
      soilType: "Medium Black Soil",
      polygonCoords: [
        [18.528, 73.665],
        [18.530, 73.700],
        [18.498, 73.702],
        [18.495, 73.668]
      ]
    },
    {
      id: "panchayat_panshet",
      name: "Panshet Lake Catchment",
      marathiName: "पानशेत जलमय ग्रामपंचायत",
      hindiName: "पानशेत जलाशय ग्राम पंचायत",
      lat: 18.3840,
      lng: 73.6200,
      elevationM: 622,
      terrainType: "Reservoir Shoreline",
      drainageAccumulation: 0.62,
      slopeDeg: 8.0,
      slopeAspect: "Waterfront Valley",
      primaryCrops: ["Paddy", "Freshwater Agro-Forestry", "Marigold"],
      soilType: "Sub-humid Brown Forest Soil",
      polygonCoords: [
        [18.398, 73.602],
        [18.400, 73.638],
        [18.370, 73.640],
        [18.368, 73.605]
      ]
    },
    {
      id: "panchayat_sinhagad",
      name: "Sinhagad Ridge Peak",
      marathiName: "सिंहगड शिखर ग्रामपंचायत",
      hindiName: "सिंहगढ़ शिखर ग्राम पंचायत",
      lat: 18.3664,
      lng: 73.7558,
      elevationM: 1315, // Highest peak!
      terrainType: "Basalt Cliff & Ridge Peak",
      drainageAccumulation: 0.02,
      slopeDeg: 34.0,
      slopeAspect: "Crest Line",
      primaryCrops: ["Rainfed Millets", "Custard Apple", "Herbal / Spices"],
      soilType: "Shallow Stony Lithosol",
      polygonCoords: [
        [18.378, 73.740],
        [18.380, 73.772],
        [18.352, 73.770],
        [18.350, 73.738]
      ]
    },
    {
      id: "panchayat_velhe",
      name: "Velhe Budruk Foothills",
      marathiName: "वेल्हे बुद्रुक ग्रामपंचायत",
      hindiName: "वेल्हे बुद्रुक ग्राम पंचायत",
      lat: 18.3000,
      lng: 73.6350,
      elevationM: 710,
      terrainType: "Torna Base Slopes",
      drainageAccumulation: 0.45,
      slopeDeg: 12.0,
      slopeAspect: "Windward Gap",
      primaryCrops: ["Traditional Paddy (Ambemohar)", "Finger Millet", "Ginger"],
      soilType: "Red-Brown Hill Soils",
      polygonCoords: [
        [18.315, 73.618],
        [18.318, 73.652],
        [18.285, 73.650],
        [18.282, 73.620]
      ]
    },
    {
      id: "panchayat_khed_shivapur",
      name: "Khed Shivapur (Rain Shadow)",
      marathiName: "खेड शिवापूर ग्रामपंचायत",
      hindiName: "खेड शिवापुर ग्राम पंचायत",
      lat: 18.3450,
      lng: 73.8320,
      elevationM: 635,
      terrainType: "Eastern Leeward Plains",
      drainageAccumulation: 0.28,
      slopeDeg: 2.1,
      slopeAspect: "Leeward (East)",
      primaryCrops: ["Pomegranate", "Onion", "Fodder Sorghum"],
      soilType: "Deep Vertisol (Black Cotton Soil)",
      polygonCoords: [
        [18.360, 73.815],
        [18.362, 73.850],
        [18.330, 73.848],
        [18.328, 73.812]
      ]
    }
  ],

  // Crop Phenology & Meteorological Sensitivity Rules
  crops: {
    "Table Grapes": {
      criticalMinTempC: 6.0, // Frost kill threshold
      idealSprayWindMaxKmh: 12.0,
      rainFreeHoursNeeded: 4,
      diseaseTriggers: [
        {
          name: "Downy Mildew (Plasmopara viticola)",
          rule: "Relative Humidity > 85% AND Temp between 18°C and 25°C for > 4 consecutive hours"
        }
      ]
    },
    "Paddy (Indrayani)": {
      criticalMinTempC: 12.0,
      idealSprayWindMaxKmh: 15.0,
      rainFreeHoursNeeded: 3,
      diseaseTriggers: [
        {
          name: "Paddy Blast (Pyricularia oryzae)",
          rule: "Relative Humidity > 90% with night temperatures 20-24°C"
        }
      ]
    },
    "Vegetables (Tomato)": {
      criticalMinTempC: 5.5,
      idealSprayWindMaxKmh: 10.0,
      rainFreeHoursNeeded: 3,
      diseaseTriggers: [
        {
          name: "Early & Late Blight",
          rule: "Prolonged leaf wetness with temperatures between 15°C and 22°C"
        }
      ]
    },
    "Sugarcane": {
      criticalMinTempC: 8.0,
      idealSprayWindMaxKmh: 18.0,
      rainFreeHoursNeeded: 2,
      diseaseTriggers: [
        {
          name: "Red Rot / Woolly Aphid",
          rule: "High relative humidity > 75% with high canopy temperature"
        }
      ]
    }
  }
};
