/**
 * AeroAgro AI - Pan-India Comprehensive Dataset
 * Geographic boundaries, Topography, Scenarios, and Crop Models across All Indian States
 */

window.AgroData = {
  region: {
    name: "All-India Agro-Climatic Downscaling Platform",
    state: "All India",
    country: "India",
    center: [22.5937, 78.9629], // Geographic Center of India
    defaultZoom: 5,
    coarseResolutionKm: 18,
    fineResolutionKm: 1.2
  },

  // Coarse Weather Prediction Grid (Simulating IMD National NWP model output)
  coarseGrid: {
    id: "IMD-WRF-NATIONAL-GRID",
    bounds: [
      [8.0000, 68.0000],
      [36.0000, 97.0000]
    ],
    meanElevation: 350,
    aspectAngleDeg: 225
  },

  // Three Weather Scenarios demonstrating different physical meteorological effects
  scenarios: {
    monsoon: {
      id: "monsoon",
      name: "Monsoon Surge (Orographic Rainfall & Delta Runoff)",
      description: "Moisture-laden monsoon winds trigger intense orographic rainfall along the Western Ghats and Himalayan foothills, while coastal deltas face waterlogging risks.",
      coarseForecast: {
        tempMax: 31.5,
        tempMin: 23.5,
        rainfallMm: 30.0,
        relativeHumidity: 82,
        windSpeedKmh: 16.0,
        windDirectionDeg: 240,
        solarRadiationWm2: 320,
        dewPointC: 22.0
      }
    },
    winter_frost: {
      id: "winter_frost",
      name: "Winter Cold Wave (Nocturnal Radiational Cooling & Frost)",
      description: "Under cloudless nocturnal skies, radiational cooling causes dense cold air to drain into mountain basins (Nilgiris, Shimla, Darjeeling), creating dangerous sub-5°C frost hollows.",
      coarseForecast: {
        tempMax: 26.0,
        tempMin: 12.0,
        rainfallMm: 0.5,
        relativeHumidity: 55,
        windSpeedKmh: 5.0,
        windDirectionDeg: 30,
        solarRadiationWm2: 680,
        dewPointC: 5.0
      }
    },
    pre_monsoon: {
      id: "pre_monsoon",
      name: "Pre-Monsoon Convective Heat & Wind Drift",
      description: "Intense daytime surface heating creates high vapor pressure deficits. Afternoon convective cells trigger localized squalls and extreme chemical drift.",
      coarseForecast: {
        tempMax: 39.5,
        tempMin: 25.0,
        rainfallMm: 8.0,
        relativeHumidity: 45,
        windSpeedKmh: 18.0,
        windDirectionDeg: 290,
        solarRadiationWm2: 920,
        dewPointC: 16.0
      }
    }
  },

  // Gram Panchayats across All Indian States
  panchayats: [
    // 1. TAMIL NADU
    {
      id: "tn_thiruvaiyaru",
      name: "Thiruvaiyaru Cauvery Delta",
      state: "Tamil Nadu",
      district: "Thanjavur",
      regionalName: "திருவையாறு காவிரி டெல்டா",
      lat: 10.8845,
      lng: 79.1065,
      elevationM: 38,
      terrainType: "Alluvial River Delta Basin",
      drainageAccumulation: 0.85,
      slopeDeg: 0.8,
      primaryCrops: ["Samba Paddy", "Poovan Banana", "Blackgram"],
      soilType: "Deep Cauvery Alluvium & Clay",
      polygonCoords: [
        [10.902, 79.088], [10.905, 79.128], [10.868, 79.125], [10.864, 79.085]
      ]
    },
    {
      id: "tn_ooty",
      name: "Ooty Valley Basin",
      state: "Tamil Nadu",
      district: "The Nilgiris",
      regionalName: "உதகமண்டலம் அவலாஞ்சி",
      lat: 11.4102,
      lng: 76.6950,
      elevationM: 2240,
      terrainType: "High Mountain Frost Hollow",
      drainageAccumulation: 0.94,
      slopeDeg: 6.8,
      primaryCrops: ["Nilgiri Orthodox Tea", "Hill Potato", "Eucalyptus"],
      soilType: "Laterite & Peaty Clay",
      polygonCoords: [
        [11.425, 76.680], [11.430, 76.715], [11.395, 76.712], [11.390, 76.678]
      ]
    },
    {
      id: "tn_pollachi",
      name: "Pollachi Coconut Basin",
      state: "Tamil Nadu",
      district: "Coimbatore",
      regionalName: "பொள்ளாச்சி ஆனைமலை தென்னை",
      lat: 10.6609,
      lng: 77.0048,
      elevationM: 293,
      terrainType: "Palghat Wind Gap Plain",
      drainageAccumulation: 0.42,
      slopeDeg: 2.1,
      primaryCrops: ["Pollachi Coconut (GI)", "Cocoa", "Nutmeg"],
      soilType: "Red Gravelly Loam",
      polygonCoords: [
        [10.678, 76.988], [10.682, 77.025], [10.645, 77.022], [10.640, 76.985]
      ]
    },

    // 2. MAHARASHTRA
    {
      id: "mh_nashik_dindori",
      name: "Dindori Vineyard Plateau",
      state: "Maharashtra",
      district: "Nashik",
      regionalName: "दिंडोरी द्राक्ष बागायत",
      lat: 20.1980,
      lng: 73.8320,
      elevationM: 615,
      terrainType: "Deccan Volcanic Basalt Plateau",
      drainageAccumulation: 0.55,
      slopeDeg: 3.5,
      primaryCrops: ["Table & Wine Grapes", "Pomegranate", "Onion"],
      soilType: "Black Cotton Basalt Clay",
      polygonCoords: [
        [20.215, 73.815], [20.218, 73.850], [20.180, 73.848], [20.176, 73.812]
      ]
    },
    {
      id: "mh_paud",
      name: "Paud River Valley",
      state: "Maharashtra",
      district: "Pune",
      regionalName: "पौड मुळा नदी खोरे",
      lat: 18.5312,
      lng: 73.6124,
      elevationM: 595,
      terrainType: "Western Ghats Valley Basin",
      drainageAccumulation: 0.88,
      slopeDeg: 3.2,
      primaryCrops: ["Indrayani Paddy", "Sugarcane", "Tomato"],
      soilType: "Clay Loam Alluvium",
      polygonCoords: [
        [18.545, 73.595], [18.550, 73.625], [18.520, 73.630], [18.515, 73.600]
      ]
    },

    // 3. HIMACHAL PRADESH & KASHMIR
    {
      id: "hp_shimla_kotgarh",
      name: "Kotgarh Apple Valley",
      state: "Himachal Pradesh",
      district: "Shimla",
      regionalName: "कोटगढ़ सेब घाटी",
      lat: 31.3050,
      lng: 77.4950,
      elevationM: 2050,
      terrainType: "Inner Himalayan Escarpment & Frost Basin",
      drainageAccumulation: 0.92,
      slopeDeg: 18.5,
      primaryCrops: ["Royal Delicious Apple", "Almond", "Cherry"],
      soilType: "Brown Forest Podzol",
      polygonCoords: [
        [31.320, 77.480], [31.325, 77.515], [31.290, 77.512], [31.285, 77.478]
      ]
    },
    {
      id: "jk_pampore_saffron",
      name: "Pampore Saffron Karewa",
      state: "Jammu & Kashmir",
      district: "Pulwama",
      regionalName: "پامپور زعفران کھیت",
      lat: 34.0080,
      lng: 74.9350,
      elevationM: 1610,
      terrainType: "Lacustrine Karewa Terraced Plateau",
      drainageAccumulation: 0.35,
      slopeDeg: 2.8,
      primaryCrops: ["Kashmiri Mongra Saffron (GI)", "Walnut", "Mustard"],
      soilType: "Silty Clay Loam",
      polygonCoords: [
        [34.025, 74.920], [34.028, 74.955], [33.992, 74.952], [33.988, 74.918]
      ]
    },

    // 4. PUNJAB & HARYANA
    {
      id: "pb_ludhiana_jagraon",
      name: "Jagraon Wheat-Paddy Belt",
      state: "Punjab",
      district: "Ludhiana",
      regionalName: "ਜਗਰਾਉਂ ਕਣਕ ਬਾਸਮਤੀ",
      lat: 30.7800,
      lng: 75.4800,
      elevationM: 238,
      terrainType: "Indo-Gangetic Deep Alluvial Plain",
      drainageAccumulation: 0.50,
      slopeDeg: 0.4,
      primaryCrops: ["Sharbati Wheat", "Pusa Basmati 1121", "Maize"],
      soilType: "Deep Alluvial Loam",
      polygonCoords: [
        [30.795, 75.465], [30.800, 75.500], [30.765, 75.498], [30.760, 75.462]
      ]
    },

    // 5. KERALA
    {
      id: "kl_kuttanad",
      name: "Kuttanad Below-Sea Basin",
      state: "Kerala",
      district: "Alappuzha",
      regionalName: "കുട്ടനാട് പാടശേഖരം",
      lat: 9.4700,
      lng: 76.4500,
      elevationM: 2,
      terrainType: "Lowland Delta & Backwater Basin",
      drainageAccumulation: 0.98,
      slopeDeg: 0.1,
      primaryCrops: ["Below-Sea Paddy", "Coconut", "Duck Farming"],
      soilType: "Acid Saline Marine Alluvium",
      polygonCoords: [
        [9.485, 76.435], [9.490, 76.470], [9.455, 76.468], [9.450, 76.432]
      ]
    },
    {
      id: "kl_munnar_highrange",
      name: "Munnar High-Range Plateau",
      state: "Kerala",
      district: "Idukki",
      regionalName: "മൂന്നാർ മലനിരകൾ",
      lat: 10.0800,
      lng: 77.0650,
      elevationM: 1600,
      terrainType: "Western Ghats Misty Highland Crest",
      drainageAccumulation: 0.22,
      slopeDeg: 26.0,
      primaryCrops: ["Orthodox Tea", "Green Cardamom", "Pepper"],
      soilType: "Humus Rich Laterite",
      polygonCoords: [
        [10.095, 77.050], [10.100, 77.085], [10.065, 77.082], [10.060, 77.048]
      ]
    },

    // 6. KARNATAKA
    {
      id: "ka_chikmagalur",
      name: "Baba Budan Giri Coffee Slope",
      state: "Karnataka",
      district: "Chikmagalur",
      regionalName: "ಬಾಬಾ ಬುಡನ್‌ಗಿರಿ ಕಾಫಿ",
      lat: 13.4050,
      lng: 75.7750,
      elevationM: 1090,
      terrainType: "Malnad Shaded Forest Ridge",
      drainageAccumulation: 0.25,
      slopeDeg: 20.0,
      primaryCrops: ["Shade Arabica Coffee (GI)", "Black Pepper", "Arecanut"],
      soilType: "Red Clay Loam Forest Soils",
      polygonCoords: [
        [13.420, 75.760], [13.425, 75.795], [13.390, 75.792], [13.385, 75.758]
      ]
    },

    // 7. RAJASTHAN & GUJARAT
    {
      id: "rj_jodhpur_marwar",
      name: "Jodhpur Marwar Arid Tract",
      state: "Rajasthan",
      district: "Jodhpur",
      regionalName: "जोधपुर मारवाड़ शुष्क क्षेत्र",
      lat: 26.2800,
      lng: 73.0250,
      elevationM: 231,
      terrainType: "Thar Desert Sandy Fringe",
      drainageAccumulation: 0.30,
      slopeDeg: 0.8,
      primaryCrops: ["Pearl Millet (Bajra)", "Cumin (Jeera)", "Cluster Bean"],
      soilType: "Desert Sandy Soil",
      polygonCoords: [
        [26.295, 73.010], [26.300, 73.045], [26.265, 73.042], [26.260, 73.008]
      ]
    },

    // 8. WEST BENGAL & ASSAM
    {
      id: "wb_darjeeling_kurseong",
      name: "Darjeeling Mist Ridge",
      state: "West Bengal",
      district: "Darjeeling",
      regionalName: "দার্জিলিং চা বাগান",
      lat: 27.0300,
      lng: 78.2700,
      elevationM: 2045,
      terrainType: "Eastern Himalayan Cloud Escarpment",
      drainageAccumulation: 0.18,
      slopeDeg: 32.0,
      primaryCrops: ["Darjeeling Tea (GI)", "Cardamom", "Mandarin"],
      soilType: "Brown Forest Loam",
      polygonCoords: [
        [27.045, 88.255], [27.050, 88.290], [27.015, 88.288], [27.010, 88.252]
      ]
    },
    {
      id: "as_jorhat_brahmaputra",
      name: "Jorhat Tea & Silt Basin",
      state: "Assam",
      district: "Jorhat",
      regionalName: "যোৰহাট ব্ৰহ্মপুত্ৰ উপত্যকা",
      lat: 26.7400,
      lng: 94.2300,
      elevationM: 96,
      terrainType: "Brahmaputra Valley Alluvial Plain",
      drainageAccumulation: 0.88,
      slopeDeg: 0.5,
      primaryCrops: ["Assam CTC Tea", "Boro Paddy", "Jute"],
      soilType: "Brahmaputra Alluvial Loam",
      polygonCoords: [
        [26.755, 94.215], [26.760, 94.250], [26.725, 94.248], [26.720, 94.212]
      ]
    },

    // 9. ANDHRA PRADESH
    {
      id: "ap_guntur_mirchi",
      name: "Guntur Chilli Belt",
      state: "Andhra Pradesh",
      district: "Guntur",
      regionalName: "గుంటూరు మిర్చి బెల్ట్",
      lat: 16.2900,
      lng: 80.4500,
      elevationM: 33,
      terrainType: "Krishna Delta Vertisol Plain",
      drainageAccumulation: 0.55,
      slopeDeg: 0.7,
      primaryCrops: ["Guntur Sannam Chilli (GI)", "Cotton", "Tobacco"],
      soilType: "Deep Black Cotton Clay",
      polygonCoords: [
        [16.305, 80.435], [16.310, 80.470], [16.275, 80.468], [16.270, 80.432]
      ]
    }
  ],

  // Crop database across India
  crops: {
    "Samba Paddy": {
      name: "Samba Paddy",
      stage: "Active Tillering to Panicle Initiation",
      safeSprayHours: { morning: [6, 10.5], evening: [17, 19] },
      maxSafeWindKmh: 18,
      minSafeTempC: 18,
      maxSafeTempC: 34,
      rainFreeHoursRequired: 3,
      diseaseThresholds: { highHumidityRh: 80, tempOptimalC: [22, 28] }
    },
    "Table & Wine Grapes": {
      name: "Table & Wine Grapes",
      stage: "Berry Development / Veraison",
      safeSprayHours: { morning: [6, 10], evening: [17.5, 19] },
      maxSafeWindKmh: 14,
      minSafeTempC: 12,
      maxSafeTempC: 32,
      rainFreeHoursRequired: 4,
      diseaseThresholds: { highHumidityRh: 75, tempOptimalC: [20, 26] }
    },
    "Sharbati Wheat": {
      name: "Sharbati Wheat",
      stage: "Grain Filling",
      safeSprayHours: { morning: [6.5, 11], evening: [16.5, 18.5] },
      maxSafeWindKmh: 16,
      minSafeTempC: 10,
      maxSafeTempC: 30,
      rainFreeHoursRequired: 2,
      diseaseThresholds: { highHumidityRh: 70, tempOptimalC: [18, 24] }
    },
    "Royal Delicious Apple": {
      name: "Royal Delicious Apple",
      stage: "Blossom / Fruit Setting",
      safeSprayHours: { morning: [7, 11], evening: [16, 18] },
      maxSafeWindKmh: 12,
      minSafeTempC: 4,
      maxSafeTempC: 25,
      rainFreeHoursRequired: 5,
      diseaseThresholds: { highHumidityRh: 85, tempOptimalC: [15, 22] }
    }
  }
};

// Automatically integrate expanded 300+ All-India districts if loaded
if (typeof window !== 'undefined' && window.AllIndiaData && window.AllIndiaData.panchayats && window.AllIndiaData.panchayats.length > 0) {
  window.AgroData.panchayats = window.AllIndiaData.panchayats;
}

