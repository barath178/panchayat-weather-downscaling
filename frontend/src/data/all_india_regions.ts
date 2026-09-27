// Pan-India Comprehensive Coverage: 30+ Districts for Major States & 100% Urban Areas
export interface PanchayatData {
  id: string;
  name: string;
  state: string;
  district: string;
  isUrban: boolean;
  regionalName?: string;
  lat: number;
  lng: number;
  elevationM: number;
  terrainType: string;
  drainageAccumulation: number;
  slopeDeg: number;
  primaryCrops: string[];
  polygonCoords: [number, number][];
}

export const ALL_INDIA_PANCHAYATS: PanchayatData[] = [
  {
    "id": "tamilnadu_chennai_1",
    "name": "Chennai Central Metro",
    "state": "Tamil Nadu",
    "district": "Chennai",
    "isUrban": true,
    "regionalName": "சென்னை பெருநகரம்",
    "lat": 13.0827,
    "lng": 80.2707,
    "elevationM": 6,
    "terrainType": "Coastal Megacity Basin",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Urban Heat Island Mitigation",
      "Rooftop Greenhouses",
      "Coastal Stormwater"
    ],
    "polygonCoords": [
      [
        13.1177,
        80.2357
      ],
      [
        13.1177,
        80.3057
      ],
      [
        13.0477,
        80.3057
      ],
      [
        13.0477,
        80.2357
      ]
    ]
  },
  {
    "id": "tamilnadu_coimbatore_2",
    "name": "Coimbatore Industrial Belt",
    "state": "Tamil Nadu",
    "district": "Coimbatore",
    "isUrban": true,
    "regionalName": "கோயம்புத்தூர் பெருநகரம்",
    "lat": 11.0168,
    "lng": 76.9558,
    "elevationM": 411,
    "terrainType": "Foothill Urban Plateau",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Peri-Urban Greens",
      "Cotton Research",
      "Floriculture"
    ],
    "polygonCoords": [
      [
        11.0518,
        76.9208
      ],
      [
        11.0518,
        76.9908
      ],
      [
        10.9818,
        76.9908
      ],
      [
        10.9818,
        76.9208
      ]
    ]
  },
  {
    "id": "tamilnadu_madurai_3",
    "name": "Madurai City Center",
    "state": "Tamil Nadu",
    "district": "Madurai",
    "isUrban": true,
    "regionalName": "மதுரை மாநகரம்",
    "lat": 9.9252,
    "lng": 78.1198,
    "elevationM": 136,
    "terrainType": "Vaigai River Plain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Madurai Malli (Jasmine)",
      "Urban Horticulture"
    ],
    "polygonCoords": [
      [
        9.9602,
        78.0848
      ],
      [
        9.9602,
        78.1548
      ],
      [
        9.8902,
        78.1548
      ],
      [
        9.8902,
        78.0848
      ]
    ]
  },
  {
    "id": "tamilnadu_tiruchirappalli_4",
    "name": "Tiruchirappalli Rock City",
    "state": "Tamil Nadu",
    "district": "Tiruchirappalli",
    "isUrban": true,
    "regionalName": "திருச்சிராப்பள்ளி",
    "lat": 10.7905,
    "lng": 78.7047,
    "elevationM": 85,
    "terrainType": "Cauvery Central Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Banana (Poovan)",
      "Urban Flood Buffer"
    ],
    "polygonCoords": [
      [
        10.8255,
        78.6697
      ],
      [
        10.8255,
        78.7397
      ],
      [
        10.7555,
        78.7397
      ],
      [
        10.7555,
        78.6697
      ]
    ]
  },
  {
    "id": "tamilnadu_salem_5",
    "name": "Salem Steel City",
    "state": "Tamil Nadu",
    "district": "Salem",
    "isUrban": true,
    "regionalName": "சேலம் மாநகரம்",
    "lat": 11.6643,
    "lng": 78.146,
    "elevationM": 278,
    "terrainType": "Eastern Ghats Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Malgoa Mango",
      "Sericulture"
    ],
    "polygonCoords": [
      [
        11.6993,
        78.111
      ],
      [
        11.6993,
        78.181
      ],
      [
        11.6293,
        78.181
      ],
      [
        11.6293,
        78.111
      ]
    ]
  },
  {
    "id": "tamilnadu_thanjavur_6",
    "name": "Thiruvaiyaru Cauvery Delta",
    "state": "Tamil Nadu",
    "district": "Thanjavur",
    "isUrban": false,
    "regionalName": "திருவையாறு காவிரி டெல்டா",
    "lat": 10.8845,
    "lng": 79.1065,
    "elevationM": 38,
    "terrainType": "Alluvial River Delta Basin",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Samba Paddy",
      "Poovan Banana",
      "Blackgram"
    ],
    "polygonCoords": [
      [
        10.9295,
        79.0615
      ],
      [
        10.9295,
        79.1515
      ],
      [
        10.8395,
        79.1515
      ],
      [
        10.8395,
        79.0615
      ]
    ]
  },
  {
    "id": "tamilnadu_thenilgiris_7",
    "name": "Ooty Valley Basin",
    "state": "Tamil Nadu",
    "district": "The Nilgiris",
    "isUrban": false,
    "regionalName": "உதகமண்டலம் அவலாஞ்சி",
    "lat": 11.4102,
    "lng": 76.695,
    "elevationM": 2240,
    "terrainType": "High Mountain Frost Hollow",
    "drainageAccumulation": 0.92,
    "slopeDeg": 18.5,
    "primaryCrops": [
      "Nilgiri Orthodox Tea",
      "Hill Potato",
      "Eucalyptus"
    ],
    "polygonCoords": [
      [
        11.4552,
        76.65
      ],
      [
        11.4552,
        76.74
      ],
      [
        11.3652,
        76.74
      ],
      [
        11.3652,
        76.65
      ]
    ]
  },
  {
    "id": "tamilnadu_coimbatore_8",
    "name": "Pollachi Coconut Basin",
    "state": "Tamil Nadu",
    "district": "Coimbatore",
    "isUrban": false,
    "regionalName": "பொள்ளாச்சி ஆனைமலை",
    "lat": 10.6609,
    "lng": 77.0048,
    "elevationM": 293,
    "terrainType": "Palghat Wind Gap Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Pollachi Coconut (GI)",
      "Cocoa",
      "Nutmeg"
    ],
    "polygonCoords": [
      [
        10.7059,
        76.9598
      ],
      [
        10.7059,
        77.0498
      ],
      [
        10.6159,
        77.0498
      ],
      [
        10.6159,
        76.9598
      ]
    ]
  },
  {
    "id": "tamilnadu_theni_9",
    "name": "Cumbum Valley Basin",
    "state": "Tamil Nadu",
    "district": "Theni",
    "isUrban": false,
    "regionalName": "கம்பம் பள்ளத்தாக்கு",
    "lat": 9.734,
    "lng": 77.281,
    "elevationM": 390,
    "terrainType": "Western Ghats Rain-Shadow Valley",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cumbum Panneer Grapes (GI)",
      "Robusta Banana"
    ],
    "polygonCoords": [
      [
        9.779,
        77.236
      ],
      [
        9.779,
        77.326
      ],
      [
        9.689,
        77.326
      ],
      [
        9.689,
        77.236
      ]
    ]
  },
  {
    "id": "tamilnadu_tirunelveli_10",
    "name": "Tirunelveli Tamirabarani",
    "state": "Tamil Nadu",
    "district": "Tirunelveli",
    "isUrban": false,
    "regionalName": "திருநெல்வேலி தாமிரபரணி",
    "lat": 8.7139,
    "lng": 77.7567,
    "elevationM": 47,
    "terrainType": "River Alluvial Basin",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy (ASD 16)",
      "Banana"
    ],
    "polygonCoords": [
      [
        8.7589,
        77.7117
      ],
      [
        8.7589,
        77.8017
      ],
      [
        8.6689,
        77.8017
      ],
      [
        8.6689,
        77.7117
      ]
    ]
  },
  {
    "id": "tamilnadu_dindigul_11",
    "name": "Kodaikanal Mannavanur",
    "state": "Tamil Nadu",
    "district": "Dindigul",
    "isUrban": false,
    "regionalName": "கொடைக்கானல் மன்னவனூர்",
    "lat": 10.2381,
    "lng": 77.4892,
    "elevationM": 2133,
    "terrainType": "Palani Hills High Basin",
    "drainageAccumulation": 0.92,
    "slopeDeg": 18.5,
    "primaryCrops": [
      "Malai Poondu (Hill Garlic)",
      "Plums"
    ],
    "polygonCoords": [
      [
        10.2831,
        77.4442
      ],
      [
        10.2831,
        77.5342
      ],
      [
        10.1931,
        77.5342
      ],
      [
        10.1931,
        77.4442
      ]
    ]
  },
  {
    "id": "tamilnadu_erode_12",
    "name": "Erode Bhavani Basin",
    "state": "Tamil Nadu",
    "district": "Erode",
    "isUrban": false,
    "regionalName": "ஈரோடு மஞ்சள் மண்டலம்",
    "lat": 11.341,
    "lng": 77.7172,
    "elevationM": 183,
    "terrainType": "Canal Irrigated Valley",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Erode Turmeric (GI)",
      "Sugarcane"
    ],
    "polygonCoords": [
      [
        11.386,
        77.6722
      ],
      [
        11.386,
        77.7622
      ],
      [
        11.296,
        77.7622
      ],
      [
        11.296,
        77.6722
      ]
    ]
  },
  {
    "id": "tamilnadu_tiruppur_13",
    "name": "Tiruppur Knitwear Basin",
    "state": "Tamil Nadu",
    "district": "Tiruppur",
    "isUrban": true,
    "regionalName": "திருப்பூர் மாநகரம்",
    "lat": 11.1085,
    "lng": 77.3411,
    "elevationM": 295,
    "terrainType": "Semi-Arid Industrial Plain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cotton",
      "Maize",
      "Effluent Mitigation"
    ],
    "polygonCoords": [
      [
        11.1435,
        77.3061
      ],
      [
        11.1435,
        77.3761
      ],
      [
        11.0735,
        77.3761
      ],
      [
        11.0735,
        77.3061
      ]
    ]
  },
  {
    "id": "tamilnadu_kanyakumari_14",
    "name": "Kanyakumari Coastal Cape",
    "state": "Tamil Nadu",
    "district": "Kanyakumari",
    "isUrban": false,
    "regionalName": "கன்னியாகுமரி",
    "lat": 8.0883,
    "lng": 77.5385,
    "elevationM": 10,
    "terrainType": "Convergent Coastal Cape",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Rubber",
      "Red Banana",
      "Pichhi Flowers"
    ],
    "polygonCoords": [
      [
        8.1333,
        77.4935
      ],
      [
        8.1333,
        77.5835
      ],
      [
        8.0433,
        77.5835
      ],
      [
        8.0433,
        77.4935
      ]
    ]
  },
  {
    "id": "tamilnadu_vellore_15",
    "name": "Vellore Palar Basin",
    "state": "Tamil Nadu",
    "district": "Vellore",
    "isUrban": true,
    "regionalName": "வேலூர் மாநகரம்",
    "lat": 12.9165,
    "lng": 79.1325,
    "elevationM": 216,
    "terrainType": "Palar Valley Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Banana",
      "Groundnut",
      "Tomato"
    ],
    "polygonCoords": [
      [
        12.9515,
        79.0975
      ],
      [
        12.9515,
        79.1675
      ],
      [
        12.8815,
        79.1675
      ],
      [
        12.8815,
        79.0975
      ]
    ]
  },
  {
    "id": "tamilnadu_cuddalore_16",
    "name": "Panruti Jackfruit Belt",
    "state": "Tamil Nadu",
    "district": "Cuddalore",
    "isUrban": false,
    "regionalName": "பண்ருட்டி முந்திரி",
    "lat": 11.772,
    "lng": 79.554,
    "elevationM": 45,
    "terrainType": "Coastal Lateritic Uplands",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Panruti Jackfruit (GI)",
      "Cashew",
      "Tapioca"
    ],
    "polygonCoords": [
      [
        11.817,
        79.509
      ],
      [
        11.817,
        79.599
      ],
      [
        11.727,
        79.599
      ],
      [
        11.727,
        79.509
      ]
    ]
  },
  {
    "id": "tamilnadu_kanchipuram_17",
    "name": "Kanchipuram Silk Belt",
    "state": "Tamil Nadu",
    "district": "Kanchipuram",
    "isUrban": false,
    "regionalName": "காஞ்சிபுரம்",
    "lat": 12.8342,
    "lng": 79.7036,
    "elevationM": 83,
    "terrainType": "Tank Irrigation Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Mulberry",
      "Watermelon"
    ],
    "polygonCoords": [
      [
        12.8792,
        79.6586
      ],
      [
        12.8792,
        79.7486
      ],
      [
        12.7892,
        79.7486
      ],
      [
        12.7892,
        79.6586
      ]
    ]
  },
  {
    "id": "tamilnadu_chengalpattu_18",
    "name": "Chengalpattu Coastal Tract",
    "state": "Tamil Nadu",
    "district": "Chengalpattu",
    "isUrban": true,
    "regionalName": "செங்கல்பட்டு",
    "lat": 12.6841,
    "lng": 79.9836,
    "elevationM": 36,
    "terrainType": "Suburban Industrial Plain",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Vegetables",
      "Peri-Urban Greenery"
    ],
    "polygonCoords": [
      [
        12.7191,
        79.9486
      ],
      [
        12.7191,
        80.0186
      ],
      [
        12.6491,
        80.0186
      ],
      [
        12.6491,
        79.9486
      ]
    ]
  },
  {
    "id": "tamilnadu_tiruvannamalai_19",
    "name": "Tiruvannamalai Hill Foothills",
    "state": "Tamil Nadu",
    "district": "Tiruvannamalai",
    "isUrban": false,
    "regionalName": "திருவண்ணாமலை",
    "lat": 12.2253,
    "lng": 79.0747,
    "elevationM": 171,
    "terrainType": "Isolated Granitic Foot-Slope",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Groundnut",
      "Paddy",
      "Sesame"
    ],
    "polygonCoords": [
      [
        12.2703,
        79.0297
      ],
      [
        12.2703,
        79.1197
      ],
      [
        12.1803,
        79.1197
      ],
      [
        12.1803,
        79.0297
      ]
    ]
  },
  {
    "id": "tamilnadu_krishnagiri_20",
    "name": "Hosur Floriculture Plateau",
    "state": "Tamil Nadu",
    "district": "Krishnagiri",
    "isUrban": true,
    "regionalName": "ஓசூர் தொழிற்பேட்டை",
    "lat": 12.7409,
    "lng": 77.8253,
    "elevationM": 879,
    "terrainType": "Deccan Foothill Plateau",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Polyhouse Cut Roses",
      "Alphonso Mango",
      "Capsicum"
    ],
    "polygonCoords": [
      [
        12.7759,
        77.7903
      ],
      [
        12.7759,
        77.8603
      ],
      [
        12.7059,
        77.8603
      ],
      [
        12.7059,
        77.7903
      ]
    ]
  },
  {
    "id": "tamilnadu_dharmapuri_21",
    "name": "Dharmapuri Palacode Basin",
    "state": "Tamil Nadu",
    "district": "Dharmapuri",
    "isUrban": false,
    "regionalName": "தர்மபுரி பாலக்கோடு",
    "lat": 12.1211,
    "lng": 78.1582,
    "elevationM": 468,
    "terrainType": "Semi-Arid Granitic Plateau",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Processing Tomato",
      "Finger Millet (Ragi)"
    ],
    "polygonCoords": [
      [
        12.1661,
        78.1132
      ],
      [
        12.1661,
        78.2032
      ],
      [
        12.0761,
        78.2032
      ],
      [
        12.0761,
        78.1132
      ]
    ]
  },
  {
    "id": "tamilnadu_ramanathapuram_22",
    "name": "Ramanathapuram Arid Coast",
    "state": "Tamil Nadu",
    "district": "Ramanathapuram",
    "isUrban": false,
    "regionalName": "ராமநாதபுரம் குண்டு மிளகாய்",
    "lat": 9.3639,
    "lng": 78.8395,
    "elevationM": 10,
    "terrainType": "Saline Coastal Plain",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Ramnad Mundu Chilli (GI)",
      "Cotton"
    ],
    "polygonCoords": [
      [
        9.4089,
        78.7945
      ],
      [
        9.4089,
        78.8845
      ],
      [
        9.3189,
        78.8845
      ],
      [
        9.3189,
        78.7945
      ]
    ]
  },
  {
    "id": "tamilnadu_thoothukudi_23",
    "name": "Thoothukudi Pearl Port",
    "state": "Tamil Nadu",
    "district": "Thoothukudi",
    "isUrban": true,
    "regionalName": "தூத்துக்குடி துறைமுகம்",
    "lat": 8.7642,
    "lng": 78.1348,
    "elevationM": 4,
    "terrainType": "Arid Coastal Port",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Black Cotton Crop",
      "Salt Pans",
      "Pearl Millet"
    ],
    "polygonCoords": [
      [
        8.7992,
        78.0998
      ],
      [
        8.7992,
        78.1698
      ],
      [
        8.7292,
        78.1698
      ],
      [
        8.7292,
        78.0998
      ]
    ]
  },
  {
    "id": "tamilnadu_virudhunagar_24",
    "name": "Virudhunagar Cotton Belt",
    "state": "Tamil Nadu",
    "district": "Virudhunagar",
    "isUrban": false,
    "regionalName": "விருதுநகர்",
    "lat": 9.568,
    "lng": 77.9624,
    "elevationM": 117,
    "terrainType": "Black Cotton Soil Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cotton",
      "Millets",
      "Oilseeds"
    ],
    "polygonCoords": [
      [
        9.613,
        77.9174
      ],
      [
        9.613,
        78.0074
      ],
      [
        9.523,
        78.0074
      ],
      [
        9.523,
        77.9174
      ]
    ]
  },
  {
    "id": "tamilnadu_sivaganga_25",
    "name": "Sivaganga Chettinad Tract",
    "state": "Tamil Nadu",
    "district": "Sivaganga",
    "isUrban": false,
    "regionalName": "சிவகங்கை செட்டிநாடு",
    "lat": 9.8433,
    "lng": 78.4809,
    "elevationM": 102,
    "terrainType": "Laterite Red Scrub Plateau",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Groundnut",
      "Rainfed Paddy"
    ],
    "polygonCoords": [
      [
        9.8883,
        78.4359
      ],
      [
        9.8883,
        78.5259
      ],
      [
        9.7983,
        78.5259
      ],
      [
        9.7983,
        78.4359
      ]
    ]
  },
  {
    "id": "tamilnadu_nagapattinam_26",
    "name": "Nagapattinam Cyclone Coast",
    "state": "Tamil Nadu",
    "district": "Nagapattinam",
    "isUrban": false,
    "regionalName": "நாகப்பட்டினம் கடலோரம்",
    "lat": 10.7672,
    "lng": 79.8449,
    "elevationM": 9,
    "terrainType": "Cyclone-Prone Delta Front",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Salt-Tolerant Paddy",
      "Casuarina"
    ],
    "polygonCoords": [
      [
        10.8122,
        79.7999
      ],
      [
        10.8122,
        79.8899
      ],
      [
        10.7222,
        79.8899
      ],
      [
        10.7222,
        79.7999
      ]
    ]
  },
  {
    "id": "tamilnadu_tiruvarur_27",
    "name": "Tiruvarur Clay Plains",
    "state": "Tamil Nadu",
    "district": "Tiruvarur",
    "isUrban": false,
    "regionalName": "திருவாரூர் நெல் களம்",
    "lat": 10.772,
    "lng": 79.6366,
    "elevationM": 14,
    "terrainType": "Deltaic Lowland Clay Basin",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Thaladi Paddy",
      "Greengram"
    ],
    "polygonCoords": [
      [
        10.817,
        79.5916
      ],
      [
        10.817,
        79.6816
      ],
      [
        10.727,
        79.6816
      ],
      [
        10.727,
        79.5916
      ]
    ]
  },
  {
    "id": "tamilnadu_mayiladuthurai_28",
    "name": "Mayiladuthurai Sirkazhi",
    "state": "Tamil Nadu",
    "district": "Mayiladuthurai",
    "isUrban": false,
    "regionalName": "மயிலாடுதுறை சீர்காழி",
    "lat": 11.1018,
    "lng": 79.6522,
    "elevationM": 12,
    "terrainType": "Alluvial River Mouth",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Betel Vine",
      "Coconut"
    ],
    "polygonCoords": [
      [
        11.1468,
        79.6072
      ],
      [
        11.1468,
        79.6972
      ],
      [
        11.0568,
        79.6972
      ],
      [
        11.0568,
        79.6072
      ]
    ]
  },
  {
    "id": "tamilnadu_pudukkottai_29",
    "name": "Pudukkottai Vellar Basin",
    "state": "Tamil Nadu",
    "district": "Pudukkottai",
    "isUrban": false,
    "regionalName": "புதுக்கோட்டை",
    "lat": 10.3797,
    "lng": 78.8208,
    "elevationM": 100,
    "terrainType": "Semi-Dry Tank Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Groundnut",
      "Cashew",
      "Pulses"
    ],
    "polygonCoords": [
      [
        10.4247,
        78.7758
      ],
      [
        10.4247,
        78.8658
      ],
      [
        10.3347,
        78.8658
      ],
      [
        10.3347,
        78.7758
      ]
    ]
  },
  {
    "id": "tamilnadu_karur_30",
    "name": "Karur Textile Plain",
    "state": "Tamil Nadu",
    "district": "Karur",
    "isUrban": true,
    "regionalName": "கரூர் ஜவுளி நகரம்",
    "lat": 10.9601,
    "lng": 78.0766,
    "elevationM": 122,
    "terrainType": "Amaravathi-Cauvery Confluence",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sugarcane",
      "Moringa (Drumstick)",
      "Paddy"
    ],
    "polygonCoords": [
      [
        10.9951,
        78.0416
      ],
      [
        10.9951,
        78.1116
      ],
      [
        10.9251,
        78.1116
      ],
      [
        10.9251,
        78.0416
      ]
    ]
  },
  {
    "id": "tamilnadu_namakkal_31",
    "name": "Namakkal Poultry Hub",
    "state": "Tamil Nadu",
    "district": "Namakkal",
    "isUrban": true,
    "regionalName": "நாமக்கல் முட்டை நகரம்",
    "lat": 11.2189,
    "lng": 78.1674,
    "elevationM": 218,
    "terrainType": "Central Granitic Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Tapioca",
      "Turmeric",
      "Poultry Farming"
    ],
    "polygonCoords": [
      [
        11.2539,
        78.1324
      ],
      [
        11.2539,
        78.2024
      ],
      [
        11.1839,
        78.2024
      ],
      [
        11.1839,
        78.1324
      ]
    ]
  },
  {
    "id": "tamilnadu_perambalur_32",
    "name": "Perambalur Maize Belt",
    "state": "Tamil Nadu",
    "district": "Perambalur",
    "isUrban": false,
    "regionalName": "பெரம்பலூர் மக்காச்சோளம்",
    "lat": 11.2342,
    "lng": 78.882,
    "elevationM": 143,
    "terrainType": "Rainfed Vertisol Tract",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Hybrid Maize",
      "Cotton",
      "Shallots"
    ],
    "polygonCoords": [
      [
        11.2792,
        78.837
      ],
      [
        11.2792,
        78.927
      ],
      [
        11.1892,
        78.927
      ],
      [
        11.1892,
        78.837
      ]
    ]
  },
  {
    "id": "tamilnadu_ariyalur_33",
    "name": "Ariyalur Fossil Basin",
    "state": "Tamil Nadu",
    "district": "Ariyalur",
    "isUrban": false,
    "regionalName": "அரியலூர்",
    "lat": 11.1401,
    "lng": 79.0786,
    "elevationM": 76,
    "terrainType": "Cretaceous Limestone Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cashew",
      "Sugarcane",
      "Groundnut"
    ],
    "polygonCoords": [
      [
        11.1851,
        79.0336
      ],
      [
        11.1851,
        79.1236
      ],
      [
        11.0951,
        79.1236
      ],
      [
        11.0951,
        79.0336
      ]
    ]
  },
  {
    "id": "tamilnadu_kallakurichi_34",
    "name": "Kallakurichi Gomukhi Basin",
    "state": "Tamil Nadu",
    "district": "Kallakurichi",
    "isUrban": false,
    "regionalName": "கள்ளக்குறிச்சி",
    "lat": 11.7383,
    "lng": 78.9639,
    "elevationM": 162,
    "terrainType": "Kalrayan Foot-Slope",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Sugarcane",
      "Tapioca"
    ],
    "polygonCoords": [
      [
        11.7833,
        78.9189
      ],
      [
        11.7833,
        79.0089
      ],
      [
        11.6933,
        79.0089
      ],
      [
        11.6933,
        78.9189
      ]
    ]
  },
  {
    "id": "tamilnadu_ranipet_35",
    "name": "Ranipet Industrial Corridor",
    "state": "Tamil Nadu",
    "district": "Ranipet",
    "isUrban": true,
    "regionalName": "இராணிப்பேட்டை",
    "lat": 12.9224,
    "lng": 79.3323,
    "elevationM": 160,
    "terrainType": "Industrial Valley Plain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Vegetables",
      "Industrial Buffer"
    ],
    "polygonCoords": [
      [
        12.9574,
        79.2973
      ],
      [
        12.9574,
        79.3673
      ],
      [
        12.8874,
        79.3673
      ],
      [
        12.8874,
        79.2973
      ]
    ]
  },
  {
    "id": "tamilnadu_tirupattur_36",
    "name": "Tirupattur Yelagiri Foothills",
    "state": "Tamil Nadu",
    "district": "Tirupattur",
    "isUrban": false,
    "regionalName": "திருப்பத்தூர் ஏலகிரி",
    "lat": 12.4925,
    "lng": 78.5677,
    "elevationM": 388,
    "terrainType": "Yelagiri Hill Foot-Slope",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Mangoes",
      "Tomato",
      "Groundnut"
    ],
    "polygonCoords": [
      [
        12.5375,
        78.5227
      ],
      [
        12.5375,
        78.6127
      ],
      [
        12.4475,
        78.6127
      ],
      [
        12.4475,
        78.5227
      ]
    ]
  },
  {
    "id": "tamilnadu_tenkasi_37",
    "name": "Tenkasi Courtallam Cascade",
    "state": "Tamil Nadu",
    "district": "Tenkasi",
    "isUrban": false,
    "regionalName": "தென்காசி குற்றாலம்",
    "lat": 8.9594,
    "lng": 77.315,
    "elevationM": 143,
    "terrainType": "Western Ghats Microclimate Cascade",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Spices",
      "Nutmeg",
      "Paddy"
    ],
    "polygonCoords": [
      [
        9.0044,
        77.27
      ],
      [
        9.0044,
        77.36
      ],
      [
        8.9144,
        77.36
      ],
      [
        8.9144,
        77.27
      ]
    ]
  },
  {
    "id": "tamilnadu_villupuram_38",
    "name": "Villupuram Gingee Basin",
    "state": "Tamil Nadu",
    "district": "Villupuram",
    "isUrban": false,
    "regionalName": "விழுப்புரம் செஞ்சி",
    "lat": 11.9401,
    "lng": 79.4861,
    "elevationM": 70,
    "terrainType": "Northern Alluvial Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sugarcane",
      "Groundnut",
      "Paddy"
    ],
    "polygonCoords": [
      [
        11.9851,
        79.4411
      ],
      [
        11.9851,
        79.5311
      ],
      [
        11.8951,
        79.5311
      ],
      [
        11.8951,
        79.4411
      ]
    ]
  },
  {
    "id": "maharashtra_mumbaicity_39",
    "name": "Mumbai City South",
    "state": "Maharashtra",
    "district": "Mumbai City",
    "isUrban": true,
    "regionalName": "मुंबई शहर",
    "lat": 18.9388,
    "lng": 72.8354,
    "elevationM": 8,
    "terrainType": "Coastal Megacity Island",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Urban Heat Island Mitigation",
      "Rooftop Farming"
    ],
    "polygonCoords": [
      [
        18.9738,
        72.8004
      ],
      [
        18.9738,
        72.8704
      ],
      [
        18.9038,
        72.8704
      ],
      [
        18.9038,
        72.8004
      ]
    ]
  },
  {
    "id": "maharashtra_mumbaisuburban_40",
    "name": "Mumbai Suburban BKC",
    "state": "Maharashtra",
    "district": "Mumbai Suburban",
    "isUrban": true,
    "regionalName": "मुंबई उपनगर",
    "lat": 19.0657,
    "lng": 72.8687,
    "elevationM": 11,
    "terrainType": "Estuarine Metropolitan Basin",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Mithi River Catchment",
      "Urban Green Cover"
    ],
    "polygonCoords": [
      [
        19.1007,
        72.8337
      ],
      [
        19.1007,
        72.9037
      ],
      [
        19.0307,
        72.9037
      ],
      [
        19.0307,
        72.8337
      ]
    ]
  },
  {
    "id": "maharashtra_pune_41",
    "name": "Pune Metro Deccan",
    "state": "Maharashtra",
    "district": "Pune",
    "isUrban": true,
    "regionalName": "पुणे महानगर",
    "lat": 18.5204,
    "lng": 73.8567,
    "elevationM": 560,
    "terrainType": "Mula-Mutha Confluence Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Urban Canopy Cooling",
      "Floriculture"
    ],
    "polygonCoords": [
      [
        18.5554,
        73.8217
      ],
      [
        18.5554,
        73.8917
      ],
      [
        18.4854,
        73.8917
      ],
      [
        18.4854,
        73.8217
      ]
    ]
  },
  {
    "id": "maharashtra_nagpur_42",
    "name": "Nagpur Zero Mile",
    "state": "Maharashtra",
    "district": "Nagpur",
    "isUrban": true,
    "regionalName": "नागपूर महानगर",
    "lat": 21.1458,
    "lng": 79.0882,
    "elevationM": 310,
    "terrainType": "Central Peninsular Plateau",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Nagpur Mandarin Orange (GI)",
      "Urban Green Corridors"
    ],
    "polygonCoords": [
      [
        21.1808,
        79.0532
      ],
      [
        21.1808,
        79.1232
      ],
      [
        21.1108,
        79.1232
      ],
      [
        21.1108,
        79.0532
      ]
    ]
  },
  {
    "id": "maharashtra_nashik_43",
    "name": "Nashik Dindori Vineyard",
    "state": "Maharashtra",
    "district": "Nashik",
    "isUrban": false,
    "regionalName": "नाशिक दिंडोरी द्राक्षे",
    "lat": 20.198,
    "lng": 73.832,
    "elevationM": 615,
    "terrainType": "Deccan Volcanic Basalt Plateau",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Table & Wine Grapes",
      "Pomegranate",
      "Nashik Red Onion"
    ],
    "polygonCoords": [
      [
        20.243,
        73.787
      ],
      [
        20.243,
        73.877
      ],
      [
        20.153,
        73.877
      ],
      [
        20.153,
        73.787
      ]
    ]
  },
  {
    "id": "maharashtra_thane_44",
    "name": "Thane Ghodbunder Basin",
    "state": "Maharashtra",
    "district": "Thane",
    "isUrban": true,
    "regionalName": "ठाणे शहर",
    "lat": 19.2183,
    "lng": 72.9781,
    "elevationM": 15,
    "terrainType": "Ulhas Creek Basin",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Mangrove Buffer",
      "Urban Agroforestry"
    ],
    "polygonCoords": [
      [
        19.2533,
        72.9431
      ],
      [
        19.2533,
        73.0131
      ],
      [
        19.1833,
        73.0131
      ],
      [
        19.1833,
        72.9431
      ]
    ]
  },
  {
    "id": "maharashtra_aurangabad_45",
    "name": "Chhatrapati Sambhajinagar",
    "state": "Maharashtra",
    "district": "Aurangabad",
    "isUrban": true,
    "regionalName": "छत्रपती संभाजीनगर",
    "lat": 19.8762,
    "lng": 75.3433,
    "elevationM": 569,
    "terrainType": "Kham River Basalt Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Himroo Cotton",
      "Sweet Orange (Mosambi)"
    ],
    "polygonCoords": [
      [
        19.9112,
        75.3083
      ],
      [
        19.9112,
        75.3783
      ],
      [
        19.8412,
        75.3783
      ],
      [
        19.8412,
        75.3083
      ]
    ]
  },
  {
    "id": "maharashtra_solapur_46",
    "name": "Solapur Textile Basin",
    "state": "Maharashtra",
    "district": "Solapur",
    "isUrban": true,
    "regionalName": "सोलापूर डाळिंब",
    "lat": 17.6599,
    "lng": 75.9064,
    "elevationM": 458,
    "terrainType": "Semi-Arid Sina River Plain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Solapur Pomegranate (GI)",
      "Jowar (Sorghum)"
    ],
    "polygonCoords": [
      [
        17.6949,
        75.8714
      ],
      [
        17.6949,
        75.9414
      ],
      [
        17.6249,
        75.9414
      ],
      [
        17.6249,
        75.8714
      ]
    ]
  },
  {
    "id": "maharashtra_kolhapur_47",
    "name": "Kolhapur Panchganga Basin",
    "state": "Maharashtra",
    "district": "Kolhapur",
    "isUrban": false,
    "regionalName": "कोल्हापूर ऊस पट्टा",
    "lat": 16.705,
    "lng": 74.2433,
    "elevationM": 569,
    "terrainType": "Rich River Floodplain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Sugarcane (Kolhapuri Gur)",
      "Paddy",
      "Soybean"
    ],
    "polygonCoords": [
      [
        16.75,
        74.1983
      ],
      [
        16.75,
        74.2883
      ],
      [
        16.66,
        74.2883
      ],
      [
        16.66,
        74.1983
      ]
    ]
  },
  {
    "id": "maharashtra_amravati_48",
    "name": "Amravati Cotton Belt",
    "state": "Maharashtra",
    "district": "Amravati",
    "isUrban": false,
    "regionalName": "अमरावती कापूस",
    "lat": 20.932,
    "lng": 77.7523,
    "elevationM": 343,
    "terrainType": "Vidarbha Vertisol Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "BT Cotton",
      "Soybean",
      "Pigeonpea"
    ],
    "polygonCoords": [
      [
        20.977,
        77.7073
      ],
      [
        20.977,
        77.7973
      ],
      [
        20.887,
        77.7973
      ],
      [
        20.887,
        77.7073
      ]
    ]
  },
  {
    "id": "maharashtra_nanded_49",
    "name": "Nanded Godavari Basin",
    "state": "Maharashtra",
    "district": "Nanded",
    "isUrban": false,
    "regionalName": "नांदेड केळी",
    "lat": 19.1383,
    "lng": 77.321,
    "elevationM": 362,
    "terrainType": "Sacred Godavari Valley",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Banana",
      "Cotton",
      "Soybean"
    ],
    "polygonCoords": [
      [
        19.1833,
        77.276
      ],
      [
        19.1833,
        77.366
      ],
      [
        19.0933,
        77.366
      ],
      [
        19.0933,
        77.276
      ]
    ]
  },
  {
    "id": "maharashtra_sangli_50",
    "name": "Sangli Turmeric Tract",
    "state": "Maharashtra",
    "district": "Sangli",
    "isUrban": false,
    "regionalName": "सांगली हळद",
    "lat": 16.8524,
    "lng": 74.5815,
    "elevationM": 549,
    "terrainType": "Krishna River Valley",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Sangli Turmeric (GI)",
      "Raisin Grapes",
      "Sugarcane"
    ],
    "polygonCoords": [
      [
        16.8974,
        74.5365
      ],
      [
        16.8974,
        74.6265
      ],
      [
        16.8074,
        74.6265
      ],
      [
        16.8074,
        74.5365
      ]
    ]
  },
  {
    "id": "maharashtra_jalgaon_51",
    "name": "Jalgaon Banana Hub",
    "state": "Maharashtra",
    "district": "Jalgaon",
    "isUrban": false,
    "regionalName": "जळगाव केळी शहर",
    "lat": 21.0077,
    "lng": 75.5626,
    "elevationM": 209,
    "terrainType": "Tapi River Alluvial Valley",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Jalgaon Banana (GI)",
      "Cotton",
      "Pulses"
    ],
    "polygonCoords": [
      [
        21.0527,
        75.5176
      ],
      [
        21.0527,
        75.6076
      ],
      [
        20.9627,
        75.6076
      ],
      [
        20.9627,
        75.5176
      ]
    ]
  },
  {
    "id": "maharashtra_akola_52",
    "name": "Akola Pulses Capital",
    "state": "Maharashtra",
    "district": "Akola",
    "isUrban": false,
    "regionalName": "अकोला डाळी",
    "lat": 20.7002,
    "lng": 77.0082,
    "elevationM": 282,
    "terrainType": "Purna Basin Black Soil",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cotton",
      "Soybean",
      "Gram"
    ],
    "polygonCoords": [
      [
        20.7452,
        76.9632
      ],
      [
        20.7452,
        77.0532
      ],
      [
        20.6552,
        77.0532
      ],
      [
        20.6552,
        76.9632
      ]
    ]
  },
  {
    "id": "maharashtra_latur_53",
    "name": "Latur Marathwada Plateau",
    "state": "Maharashtra",
    "district": "Latur",
    "isUrban": false,
    "regionalName": "लातूर सोयाबीन",
    "lat": 18.4088,
    "lng": 76.5604,
    "elevationM": 631,
    "terrainType": "Balaghat Basalt Plateau",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Soybean",
      "Pigeonpea (Tur)",
      "Sugarcane"
    ],
    "polygonCoords": [
      [
        18.4538,
        76.5154
      ],
      [
        18.4538,
        76.6054
      ],
      [
        18.3638,
        76.6054
      ],
      [
        18.3638,
        76.5154
      ]
    ]
  },
  {
    "id": "maharashtra_dhule_54",
    "name": "Dhule Khandesh Plain",
    "state": "Maharashtra",
    "district": "Dhule",
    "isUrban": false,
    "regionalName": "धुळे",
    "lat": 20.9042,
    "lng": 74.7749,
    "elevationM": 240,
    "terrainType": "Panzara River Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cotton",
      "Groundnut",
      "Onion"
    ],
    "polygonCoords": [
      [
        20.9492,
        74.7299
      ],
      [
        20.9492,
        74.8199
      ],
      [
        20.8592,
        74.8199
      ],
      [
        20.8592,
        74.7299
      ]
    ]
  },
  {
    "id": "maharashtra_ahmednagar_55",
    "name": "Ahmednagar Shirdi Belt",
    "state": "Maharashtra",
    "district": "Ahmednagar",
    "isUrban": false,
    "regionalName": "अहमदनगर",
    "lat": 19.0948,
    "lng": 74.748,
    "elevationM": 649,
    "terrainType": "Pravara Basin Irrigation",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Sugarcane",
      "Pomegranate",
      "Guava"
    ],
    "polygonCoords": [
      [
        19.1398,
        74.703
      ],
      [
        19.1398,
        74.793
      ],
      [
        19.0498,
        74.793
      ],
      [
        19.0498,
        74.703
      ]
    ]
  },
  {
    "id": "maharashtra_chandrapur_56",
    "name": "Chandrapur Mineral Belt",
    "state": "Maharashtra",
    "district": "Chandrapur",
    "isUrban": true,
    "regionalName": "चंद्रपूर",
    "lat": 19.9615,
    "lng": 79.2961,
    "elevationM": 189,
    "terrainType": "Erai-Wardha Confluence",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Soybean",
      "Forestry Buffer"
    ],
    "polygonCoords": [
      [
        19.9965,
        79.2611
      ],
      [
        19.9965,
        79.3311
      ],
      [
        19.9265,
        79.3311
      ],
      [
        19.9265,
        79.2611
      ]
    ]
  },
  {
    "id": "maharashtra_parbhani_57",
    "name": "Parbhani Marathwada Basin",
    "state": "Maharashtra",
    "district": "Parbhani",
    "isUrban": false,
    "regionalName": "परभणी",
    "lat": 19.2608,
    "lng": 76.7749,
    "elevationM": 407,
    "terrainType": "Godavari Semi-Arid Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cotton",
      "Sorghum",
      "Pigeonpea"
    ],
    "polygonCoords": [
      [
        19.3058,
        76.7299
      ],
      [
        19.3058,
        76.8199
      ],
      [
        19.2158,
        76.8199
      ],
      [
        19.2158,
        76.7299
      ]
    ]
  },
  {
    "id": "maharashtra_jalna_58",
    "name": "Jalna Seed Capital",
    "state": "Maharashtra",
    "district": "Jalna",
    "isUrban": true,
    "regionalName": "जालना बियाणे",
    "lat": 19.8347,
    "lng": 75.8816,
    "elevationM": 508,
    "terrainType": "Kundalika River Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Hybrid Seeds",
      "Sweet Orange",
      "Pomegranate"
    ],
    "polygonCoords": [
      [
        19.8697,
        75.8466
      ],
      [
        19.8697,
        75.9166
      ],
      [
        19.7997,
        75.9166
      ],
      [
        19.7997,
        75.8466
      ]
    ]
  },
  {
    "id": "maharashtra_beed_59",
    "name": "Beed Balaghat Plateau",
    "state": "Maharashtra",
    "district": "Beed",
    "isUrban": false,
    "regionalName": "बीड",
    "lat": 18.9891,
    "lng": 75.7601,
    "elevationM": 515,
    "terrainType": "Drought-Prone Plateau",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Bajra",
      "Cotton"
    ],
    "polygonCoords": [
      [
        19.0341,
        75.7151
      ],
      [
        19.0341,
        75.8051
      ],
      [
        18.9441,
        75.8051
      ],
      [
        18.9441,
        75.7151
      ]
    ]
  },
  {
    "id": "maharashtra_satara_60",
    "name": "Satara Krishna Valley",
    "state": "Maharashtra",
    "district": "Satara",
    "isUrban": false,
    "regionalName": "सातारा स्ट्रॉबेरी",
    "lat": 17.6805,
    "lng": 73.9997,
    "elevationM": 742,
    "terrainType": "Western Ghats Foothills",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Mahabaleshwar Strawberry (GI)",
      "Sugarcane",
      "Ginger"
    ],
    "polygonCoords": [
      [
        17.7255,
        73.9547
      ],
      [
        17.7255,
        74.0447
      ],
      [
        17.6355,
        74.0447
      ],
      [
        17.6355,
        73.9547
      ]
    ]
  },
  {
    "id": "maharashtra_yavatmal_61",
    "name": "Yavatmal White Gold Basin",
    "state": "Maharashtra",
    "district": "Yavatmal",
    "isUrban": false,
    "regionalName": "यवतमाळ पांढरे सोने",
    "lat": 20.3888,
    "lng": 78.1204,
    "elevationM": 445,
    "terrainType": "Vidarbha Deep Vertisol",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cotton (White Gold)",
      "Soybean"
    ],
    "polygonCoords": [
      [
        20.4338,
        78.0754
      ],
      [
        20.4338,
        78.1654
      ],
      [
        20.3438,
        78.1654
      ],
      [
        20.3438,
        78.0754
      ]
    ]
  },
  {
    "id": "maharashtra_raigad_62",
    "name": "Raigad Alibag Coast",
    "state": "Maharashtra",
    "district": "Raigad",
    "isUrban": false,
    "regionalName": "रायगड अलिबाग",
    "lat": 18.6414,
    "lng": 72.8722,
    "elevationM": 12,
    "terrainType": "Konkan Estuarine Coastline",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Alibag White Onion (GI)",
      "Alphonso Mango",
      "Rice"
    ],
    "polygonCoords": [
      [
        18.6864,
        72.8272
      ],
      [
        18.6864,
        72.9172
      ],
      [
        18.5964,
        72.9172
      ],
      [
        18.5964,
        72.8272
      ]
    ]
  },
  {
    "id": "maharashtra_buldhana_63",
    "name": "Buldhana Lonar Crater",
    "state": "Maharashtra",
    "district": "Buldhana",
    "isUrban": false,
    "regionalName": "बुलढाणा लोणार",
    "lat": 20.5303,
    "lng": 76.1843,
    "elevationM": 639,
    "terrainType": "Basalt Plateau & Basins",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Cotton",
      "Soybean",
      "Maize"
    ],
    "polygonCoords": [
      [
        20.5753,
        76.1393
      ],
      [
        20.5753,
        76.2293
      ],
      [
        20.4853,
        76.2293
      ],
      [
        20.4853,
        76.1393
      ]
    ]
  },
  {
    "id": "maharashtra_ratnagiri_64",
    "name": "Ratnagiri Alphonso Coast",
    "state": "Maharashtra",
    "district": "Ratnagiri",
    "isUrban": false,
    "regionalName": "रत्नागिरी हापूस",
    "lat": 16.9902,
    "lng": 73.312,
    "elevationM": 35,
    "terrainType": "Konkan Lateritic Sea Bluffs",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Ratnagiri Alphonso Mango (GI)",
      "Cashew",
      "Arecanut"
    ],
    "polygonCoords": [
      [
        17.0352,
        73.267
      ],
      [
        17.0352,
        73.357
      ],
      [
        16.9452,
        73.357
      ],
      [
        16.9452,
        73.267
      ]
    ]
  },
  {
    "id": "maharashtra_sindhudurg_65",
    "name": "Sindhudurg Malvan Bay",
    "state": "Maharashtra",
    "district": "Sindhudurg",
    "isUrban": false,
    "regionalName": "सिंधुदुर्ग मालवण",
    "lat": 16.0667,
    "lng": 73.55,
    "elevationM": 42,
    "terrainType": "Biodiverse Konkan Lowlands",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sindhudurg Alphonso Mango",
      "Kokum",
      "Cashew"
    ],
    "polygonCoords": [
      [
        16.1117,
        73.505
      ],
      [
        16.1117,
        73.595
      ],
      [
        16.0217,
        73.595
      ],
      [
        16.0217,
        73.505
      ]
    ]
  },
  {
    "id": "maharashtra_wardha_66",
    "name": "Wardha Sevagram Basin",
    "state": "Maharashtra",
    "district": "Wardha",
    "isUrban": false,
    "regionalName": "वर्धा सेवाग्राम",
    "lat": 20.7453,
    "lng": 78.6022,
    "elevationM": 234,
    "terrainType": "Wardha River Catchment",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Organic Cotton",
      "Soybean",
      "Oranges"
    ],
    "polygonCoords": [
      [
        20.7903,
        78.5572
      ],
      [
        20.7903,
        78.6472
      ],
      [
        20.7003,
        78.6472
      ],
      [
        20.7003,
        78.5572
      ]
    ]
  },
  {
    "id": "maharashtra_osmanabad_67",
    "name": "Osmanabad Dharashiv Basin",
    "state": "Maharashtra",
    "district": "Osmanabad",
    "isUrban": false,
    "regionalName": "धाराशिव",
    "lat": 18.1757,
    "lng": 76.0407,
    "elevationM": 668,
    "terrainType": "Balaghat High Plateau",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Soybean",
      "Pigeonpea",
      "Dairy Grasses"
    ],
    "polygonCoords": [
      [
        18.2207,
        75.9957
      ],
      [
        18.2207,
        76.0857
      ],
      [
        18.1307,
        76.0857
      ],
      [
        18.1307,
        75.9957
      ]
    ]
  },
  {
    "id": "maharashtra_bhandara_68",
    "name": "Bhandara Rice City",
    "state": "Maharashtra",
    "district": "Bhandara",
    "isUrban": false,
    "regionalName": "भंडारा तांदूळ",
    "lat": 21.1714,
    "lng": 79.6548,
    "elevationM": 244,
    "terrainType": "Wainganga River Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Fragrant Chinnor Rice",
      "Lake Fisheries"
    ],
    "polygonCoords": [
      [
        21.2164,
        79.6098
      ],
      [
        21.2164,
        79.6998
      ],
      [
        21.1264,
        79.6998
      ],
      [
        21.1264,
        79.6098
      ]
    ]
  },
  {
    "id": "maharashtra_gondia_69",
    "name": "Gondia Lake District",
    "state": "Maharashtra",
    "district": "Gondia",
    "isUrban": false,
    "regionalName": "गोंदिया तलावांचा जिल्हा",
    "lat": 21.4624,
    "lng": 80.1961,
    "elevationM": 300,
    "terrainType": "Forested Tank Irrigation Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Minor Forest Produce"
    ],
    "polygonCoords": [
      [
        21.5074,
        80.1511
      ],
      [
        21.5074,
        80.2411
      ],
      [
        21.4174,
        80.2411
      ],
      [
        21.4174,
        80.1511
      ]
    ]
  },
  {
    "id": "maharashtra_gadchiroli_70",
    "name": "Gadchiroli Tribal Forest",
    "state": "Maharashtra",
    "district": "Gadchiroli",
    "isUrban": false,
    "regionalName": "गडचिरोली",
    "lat": 20.1804,
    "lng": 80.0035,
    "elevationM": 217,
    "terrainType": "Dense Teak Forest Watershed",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Forest Rice",
      "Tendu Leaves",
      "Bamboo"
    ],
    "polygonCoords": [
      [
        20.2254,
        79.9585
      ],
      [
        20.2254,
        80.0485
      ],
      [
        20.1354,
        80.0485
      ],
      [
        20.1354,
        79.9585
      ]
    ]
  },
  {
    "id": "maharashtra_palghar_71",
    "name": "Palghar Dahanu Chiku Belt",
    "state": "Maharashtra",
    "district": "Palghar",
    "isUrban": false,
    "regionalName": "पालघर डहाणू चिकू",
    "lat": 19.6967,
    "lng": 72.7699,
    "elevationM": 18,
    "terrainType": "North Konkan Coastal Plain",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Dahanu Gholvad Sapota (Chiku GI)",
      "Wada Kolam Rice"
    ],
    "polygonCoords": [
      [
        19.7417,
        72.7249
      ],
      [
        19.7417,
        72.8149
      ],
      [
        19.6517,
        72.8149
      ],
      [
        19.6517,
        72.7249
      ]
    ]
  },
  {
    "id": "maharashtra_washim_72",
    "name": "Washim Penganga Basin",
    "state": "Maharashtra",
    "district": "Washim",
    "isUrban": false,
    "regionalName": "वाशीम",
    "lat": 20.1112,
    "lng": 77.135,
    "elevationM": 546,
    "terrainType": "Central Vidarbha Plateau",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Soybean",
      "Wheat",
      "Gram"
    ],
    "polygonCoords": [
      [
        20.1562,
        77.09
      ],
      [
        20.1562,
        77.18
      ],
      [
        20.0662,
        77.18
      ],
      [
        20.0662,
        77.09
      ]
    ]
  },
  {
    "id": "maharashtra_hingoli_73",
    "name": "Hingoli Marathwada Valley",
    "state": "Maharashtra",
    "district": "Hingoli",
    "isUrban": false,
    "regionalName": "हिंगोली",
    "lat": 19.7173,
    "lng": 77.1488,
    "elevationM": 457,
    "terrainType": "Isapur Dam Catchment",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Turmeric",
      "Soybean",
      "Cotton"
    ],
    "polygonCoords": [
      [
        19.7623,
        77.1038
      ],
      [
        19.7623,
        77.1938
      ],
      [
        19.6723,
        77.1938
      ],
      [
        19.6723,
        77.1038
      ]
    ]
  },
  {
    "id": "maharashtra_nandurbar_74",
    "name": "Nandurbar Tribal Hills",
    "state": "Maharashtra",
    "district": "Nandurbar",
    "isUrban": false,
    "regionalName": "नंदुरबार सातपुडा",
    "lat": 21.3697,
    "lng": 74.2409,
    "elevationM": 210,
    "terrainType": "Satpura Hill Ranges",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Red Chillies",
      "Paddy",
      "Millets"
    ],
    "polygonCoords": [
      [
        21.4147,
        74.1959
      ],
      [
        21.4147,
        74.2859
      ],
      [
        21.3247,
        74.2859
      ],
      [
        21.3247,
        74.1959
      ]
    ]
  },
  {
    "id": "karnataka_bengaluruurban_75",
    "name": "Bengaluru Urban Tech Core",
    "state": "Karnataka",
    "district": "Bengaluru Urban",
    "isUrban": true,
    "regionalName": "ಬೆಂಗಳೂರು ನಗರ",
    "lat": 12.9716,
    "lng": 77.5946,
    "elevationM": 920,
    "terrainType": "High Deccan Ridge Plateau",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Urban Heat Island Mitigation",
      "Rooftop Hydroponics",
      "Lake Buffers"
    ],
    "polygonCoords": [
      [
        13.0066,
        77.5596
      ],
      [
        13.0066,
        77.6296
      ],
      [
        12.9366,
        77.6296
      ],
      [
        12.9366,
        77.5596
      ]
    ]
  },
  {
    "id": "karnataka_mysuru_76",
    "name": "Mysuru Heritage Basin",
    "state": "Karnataka",
    "district": "Mysuru",
    "isUrban": true,
    "regionalName": "ಮೈಸೂರು ಮಹಾನಗರ",
    "lat": 12.2958,
    "lng": 76.6394,
    "elevationM": 763,
    "terrainType": "Chamundi Foot-Slope Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Mysore Mallige (Jasmine)",
      "Nanjangud Rasabale (Banana GI)",
      "Betel Leaf"
    ],
    "polygonCoords": [
      [
        12.3308,
        76.6044
      ],
      [
        12.3308,
        76.6744
      ],
      [
        12.2608,
        76.6744
      ],
      [
        12.2608,
        76.6044
      ]
    ]
  },
  {
    "id": "karnataka_dakshinakannada_77",
    "name": "Mangaluru Coastal Port",
    "state": "Karnataka",
    "district": "Dakshina Kannada",
    "isUrban": true,
    "regionalName": "ಮಂಗಳೂರು ಕರಾವಳಿ",
    "lat": 12.9141,
    "lng": 74.856,
    "elevationM": 22,
    "terrainType": "Netravati Estuarine Coast",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Arecanut",
      "Cashew",
      "Coconut",
      "Paddy"
    ],
    "polygonCoords": [
      [
        12.9491,
        74.821
      ],
      [
        12.9491,
        74.891
      ],
      [
        12.8791,
        74.891
      ],
      [
        12.8791,
        74.821
      ]
    ]
  },
  {
    "id": "karnataka_dharwad_78",
    "name": "Hubballi-Dharwad Twin City",
    "state": "Karnataka",
    "district": "Dharwad",
    "isUrban": true,
    "regionalName": "ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ",
    "lat": 15.3647,
    "lng": 75.124,
    "elevationM": 671,
    "terrainType": "Deccan Transition Plain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Byadagi Chilli",
      "Dharwad Peda Milk Hub",
      "Cotton"
    ],
    "polygonCoords": [
      [
        15.3997,
        75.089
      ],
      [
        15.3997,
        75.159
      ],
      [
        15.3297,
        75.159
      ],
      [
        15.3297,
        75.089
      ]
    ]
  },
  {
    "id": "karnataka_belagavi_79",
    "name": "Belagavi Sugar Bowl",
    "state": "Karnataka",
    "district": "Belagavi",
    "isUrban": true,
    "regionalName": "ಬೆಳಗಾವಿ",
    "lat": 15.8497,
    "lng": 74.4977,
    "elevationM": 751,
    "terrainType": "Malaprabha Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Sugarcane",
      "Soybean",
      "Vegetables"
    ],
    "polygonCoords": [
      [
        15.8847,
        74.4627
      ],
      [
        15.8847,
        74.5327
      ],
      [
        15.8147,
        74.5327
      ],
      [
        15.8147,
        74.4627
      ]
    ]
  },
  {
    "id": "karnataka_chikkamagaluru_80",
    "name": "Chikkamagaluru Coffee Slopes",
    "state": "Karnataka",
    "district": "Chikkamagaluru",
    "isUrban": false,
    "regionalName": "ಚಿಕ್ಕಮಗಳೂರು ಕಾಫಿ",
    "lat": 13.3153,
    "lng": 75.7754,
    "elevationM": 1090,
    "terrainType": "Western Ghats Baba Budan Slopes",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Arabica & Robusta Coffee (GI)",
      "Black Pepper",
      "Cardamom"
    ],
    "polygonCoords": [
      [
        13.3603,
        75.7304
      ],
      [
        13.3603,
        75.8204
      ],
      [
        13.2703,
        75.8204
      ],
      [
        13.2703,
        75.7304
      ]
    ]
  },
  {
    "id": "karnataka_kodagu_81",
    "name": "Kodagu Madikeri Hills",
    "state": "Karnataka",
    "district": "Kodagu",
    "isUrban": false,
    "regionalName": "ಕೊಡಗು ಮಡಿಕೇರಿ",
    "lat": 12.4244,
    "lng": 75.7382,
    "elevationM": 1150,
    "terrainType": "High Ghats Rainforest Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Coorg Orange (GI)",
      "Specialty Coffee",
      "Cardamom"
    ],
    "polygonCoords": [
      [
        12.4694,
        75.6932
      ],
      [
        12.4694,
        75.7832
      ],
      [
        12.3794,
        75.7832
      ],
      [
        12.3794,
        75.6932
      ]
    ]
  },
  {
    "id": "karnataka_mandya_82",
    "name": "Mandya Cauvery Basin",
    "state": "Karnataka",
    "district": "Mandya",
    "isUrban": false,
    "regionalName": "ಮಂಡ್ಯ ಕಬ್ಬು",
    "lat": 12.525,
    "lng": 76.885,
    "elevationM": 678,
    "terrainType": "KRS Dam Irrigated Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Sugarcane (Mandya Jaggery)",
      "Finger Millet (Ragi)",
      "Paddy"
    ],
    "polygonCoords": [
      [
        12.57,
        76.84
      ],
      [
        12.57,
        76.93
      ],
      [
        12.48,
        76.93
      ],
      [
        12.48,
        76.84
      ]
    ]
  },
  {
    "id": "karnataka_shivamogga_83",
    "name": "Shivamogga Malnad Gateway",
    "state": "Karnataka",
    "district": "Shivamogga",
    "isUrban": false,
    "regionalName": "ಶಿವಮೊಗ್ಗ ಮಲೆನಾಡು",
    "lat": 13.9299,
    "lng": 75.5681,
    "elevationM": 580,
    "terrainType": "Tunga River Valley",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Arecanut",
      "Paddy",
      "Ginger"
    ],
    "polygonCoords": [
      [
        13.9749,
        75.5231
      ],
      [
        13.9749,
        75.6131
      ],
      [
        13.8849,
        75.6131
      ],
      [
        13.8849,
        75.5231
      ]
    ]
  },
  {
    "id": "karnataka_ballari_84",
    "name": "Ballari Mining & Cotton",
    "state": "Karnataka",
    "district": "Ballari",
    "isUrban": true,
    "regionalName": "ಬಳ್ಳಾರಿ",
    "lat": 15.1394,
    "lng": 76.9214,
    "elevationM": 495,
    "terrainType": "Arid Granitic Plains",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cotton",
      "Sunflower",
      "Paddy (TBP Canal)"
    ],
    "polygonCoords": [
      [
        15.1744,
        76.8864
      ],
      [
        15.1744,
        76.9564
      ],
      [
        15.1044,
        76.9564
      ],
      [
        15.1044,
        76.8864
      ]
    ]
  },
  {
    "id": "karnataka_tumakuru_85",
    "name": "Tumakuru Coconut Belt",
    "state": "Karnataka",
    "district": "Tumakuru",
    "isUrban": true,
    "regionalName": "ತುಮಕೂರು ತೆಂಗು",
    "lat": 13.3379,
    "lng": 77.101,
    "elevationM": 822,
    "terrainType": "Eastern Dry Deccan Plateau",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Tumakuru Coconut",
      "Ragi",
      "Groundnut"
    ],
    "polygonCoords": [
      [
        13.3729,
        77.066
      ],
      [
        13.3729,
        77.136
      ],
      [
        13.3029,
        77.136
      ],
      [
        13.3029,
        77.066
      ]
    ]
  },
  {
    "id": "karnataka_kalaburagi_86",
    "name": "Kalaburagi Red Gram Hub",
    "state": "Karnataka",
    "district": "Kalaburagi",
    "isUrban": true,
    "regionalName": "ಕಲಬುರಗಿ ತೊಗರಿ",
    "lat": 17.3297,
    "lng": 76.8343,
    "elevationM": 454,
    "terrainType": "Bhima Basin Black Soil",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Kalaburagi Red Gram / Toor (GI)",
      "Bengaluru Gram"
    ],
    "polygonCoords": [
      [
        17.3647,
        76.7993
      ],
      [
        17.3647,
        76.8693
      ],
      [
        17.2947,
        76.8693
      ],
      [
        17.2947,
        76.7993
      ]
    ]
  },
  {
    "id": "karnataka_udupi_87",
    "name": "Udupi Temple Coast",
    "state": "Karnataka",
    "district": "Udupi",
    "isUrban": false,
    "regionalName": "ಉಡುಪಿ ಮಟ್ಟಗುಳ್ಳ",
    "lat": 13.3409,
    "lng": 74.7421,
    "elevationM": 15,
    "terrainType": "Coastal Alluvial Sands",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Udupi Mattu Gulla (Brinjal GI)",
      "Coconut",
      "Paddy"
    ],
    "polygonCoords": [
      [
        13.3859,
        74.6971
      ],
      [
        13.3859,
        74.7871
      ],
      [
        13.2959,
        74.7871
      ],
      [
        13.2959,
        74.6971
      ]
    ]
  },
  {
    "id": "karnataka_hassan_88",
    "name": "Hassan Malnad Edge",
    "state": "Karnataka",
    "district": "Hassan",
    "isUrban": false,
    "regionalName": "ಹಾಸನ ಆಲೂಗಡ್ಡೆ",
    "lat": 13.0033,
    "lng": 76.1004,
    "elevationM": 957,
    "terrainType": "Hemavathi Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Potato",
      "Coffee",
      "Ginger",
      "Coconut"
    ],
    "polygonCoords": [
      [
        13.0483,
        76.0554
      ],
      [
        13.0483,
        76.1454
      ],
      [
        12.9583,
        76.1454
      ],
      [
        12.9583,
        76.0554
      ]
    ]
  },
  {
    "id": "karnataka_vijayapura_89",
    "name": "Vijayapura Grape Bowl",
    "state": "Karnataka",
    "district": "Vijayapura",
    "isUrban": false,
    "regionalName": "ವಿಜಯಪುರ ದ್ರಾಕ್ಷಿ",
    "lat": 16.8302,
    "lng": 75.71,
    "elevationM": 606,
    "terrainType": "Krishna River Valley",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Raisin Grapes",
      "Pomegranate",
      "Lime (Nimbu)"
    ],
    "polygonCoords": [
      [
        16.8752,
        75.665
      ],
      [
        16.8752,
        75.755
      ],
      [
        16.7852,
        75.755
      ],
      [
        16.7852,
        75.665
      ]
    ]
  },
  {
    "id": "karnataka_davanagere_90",
    "name": "Davanagere Benne Plain",
    "state": "Karnataka",
    "district": "Davanagere",
    "isUrban": true,
    "regionalName": "ದಾವಣಗೆರೆ",
    "lat": 14.4644,
    "lng": 75.9218,
    "elevationM": 602,
    "terrainType": "Bhadra Canal Valley",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Maize",
      "Paddy",
      "Cotton"
    ],
    "polygonCoords": [
      [
        14.4994,
        75.8868
      ],
      [
        14.4994,
        75.9568
      ],
      [
        14.4294,
        75.9568
      ],
      [
        14.4294,
        75.8868
      ]
    ]
  },
  {
    "id": "karnataka_bagalkote_91",
    "name": "Bagalkote Krishna Basin",
    "state": "Karnataka",
    "district": "Bagalkote",
    "isUrban": false,
    "regionalName": "ಬಾಗಲಕೋಟೆ",
    "lat": 16.1875,
    "lng": 75.698,
    "elevationM": 533,
    "terrainType": "Ghataprabha River Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Sugarcane",
      "Ilkal Handloom Greens",
      "Maize"
    ],
    "polygonCoords": [
      [
        16.2325,
        75.653
      ],
      [
        16.2325,
        75.743
      ],
      [
        16.1425,
        75.743
      ],
      [
        16.1425,
        75.653
      ]
    ]
  },
  {
    "id": "karnataka_bidar_92",
    "name": "Bidar Crown Plateau",
    "state": "Karnataka",
    "district": "Bidar",
    "isUrban": false,
    "regionalName": "ಬೀದರ್",
    "lat": 17.9104,
    "lng": 77.5199,
    "elevationM": 615,
    "terrainType": "Lateritic High Plateau",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Soybean",
      "Pulses",
      "Ginger"
    ],
    "polygonCoords": [
      [
        17.9554,
        77.4749
      ],
      [
        17.9554,
        77.5649
      ],
      [
        17.8654,
        77.5649
      ],
      [
        17.8654,
        77.4749
      ]
    ]
  },
  {
    "id": "karnataka_raichur_93",
    "name": "Raichur Doab",
    "state": "Karnataka",
    "district": "Raichur",
    "isUrban": false,
    "regionalName": "ರಾಯಚೂರು ಸೋನಾ ಮಸೂರಿ",
    "lat": 16.2076,
    "lng": 77.3463,
    "elevationM": 407,
    "terrainType": "Krishna-Tungabhadra Doab",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sona Masoori Rice (GI)",
      "Cotton"
    ],
    "polygonCoords": [
      [
        16.2526,
        77.3013
      ],
      [
        16.2526,
        77.3913
      ],
      [
        16.1626,
        77.3913
      ],
      [
        16.1626,
        77.3013
      ]
    ]
  },
  {
    "id": "karnataka_koppal_94",
    "name": "Koppal Rice Mill Hub",
    "state": "Karnataka",
    "district": "Koppal",
    "isUrban": false,
    "regionalName": "ಕೊಪ್ಪಳ",
    "lat": 15.3456,
    "lng": 76.1558,
    "elevationM": 530,
    "terrainType": "Tungabhadra Left Bank",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Paddy",
      "Maize",
      "Pomegranate"
    ],
    "polygonCoords": [
      [
        15.3906,
        76.1108
      ],
      [
        15.3906,
        76.2008
      ],
      [
        15.3006,
        76.2008
      ],
      [
        15.3006,
        76.1108
      ]
    ]
  },
  {
    "id": "karnataka_gadag_95",
    "name": "Gadag Wind Energy Belt",
    "state": "Karnataka",
    "district": "Gadag",
    "isUrban": false,
    "regionalName": "ಗದಗ",
    "lat": 15.4298,
    "lng": 75.6318,
    "elevationM": 669,
    "terrainType": "Wind Gap Semi-Arid Plains",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Byadagi Chillies",
      "Onion",
      "Bengal Gram"
    ],
    "polygonCoords": [
      [
        15.4748,
        75.5868
      ],
      [
        15.4748,
        75.6768
      ],
      [
        15.3848,
        75.6768
      ],
      [
        15.3848,
        75.5868
      ]
    ]
  },
  {
    "id": "karnataka_haveri_96",
    "name": "Haveri Cardamom City",
    "state": "Karnataka",
    "district": "Haveri",
    "isUrban": false,
    "regionalName": "ಹಾವೇರಿ ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ",
    "lat": 14.7958,
    "lng": 75.3995,
    "elevationM": 572,
    "terrainType": "Varada River Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Byadagi Chilli (GI)",
      "Maize",
      "Cotton"
    ],
    "polygonCoords": [
      [
        14.8408,
        75.3545
      ],
      [
        14.8408,
        75.4445
      ],
      [
        14.7508,
        75.4445
      ],
      [
        14.7508,
        75.3545
      ]
    ]
  },
  {
    "id": "karnataka_uttarakannada_97",
    "name": "Uttara Kannada Karwar",
    "state": "Karnataka",
    "district": "Uttara Kannada",
    "isUrban": false,
    "regionalName": "ಉತ್ತರ ಕನ್ನಡ ಕಾರವಾರ",
    "lat": 14.8136,
    "lng": 74.1298,
    "elevationM": 8,
    "terrainType": "Kali Estuarine Coastline",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Arecanut",
      "Spices",
      "Fish Farming"
    ],
    "polygonCoords": [
      [
        14.8586,
        74.0848
      ],
      [
        14.8586,
        74.1748
      ],
      [
        14.7686,
        74.1748
      ],
      [
        14.7686,
        74.0848
      ]
    ]
  },
  {
    "id": "karnataka_chitradurga_98",
    "name": "Chitradurga Fort Basin",
    "state": "Karnataka",
    "district": "Chitradurga",
    "isUrban": false,
    "regionalName": "ಚಿತ್ರದುರ್ಗ ದಾಳಿಂಬೆ",
    "lat": 14.2251,
    "lng": 76.398,
    "elevationM": 732,
    "terrainType": "Granitic Boulder Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Pomegranate",
      "Arecanut",
      "Onion"
    ],
    "polygonCoords": [
      [
        14.2701,
        76.353
      ],
      [
        14.2701,
        76.443
      ],
      [
        14.1801,
        76.443
      ],
      [
        14.1801,
        76.353
      ]
    ]
  },
  {
    "id": "karnataka_chamarajanagar_99",
    "name": "Chamarajanagar Border",
    "state": "Karnataka",
    "district": "Chamarajanagar",
    "isUrban": false,
    "regionalName": "ಚಾಮರಾಜನಗರ",
    "lat": 11.9261,
    "lng": 76.9437,
    "elevationM": 662,
    "terrainType": "Biligiriranga Foothills",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Turmeric",
      "Banana",
      "Sugarcane"
    ],
    "polygonCoords": [
      [
        11.9711,
        76.8987
      ],
      [
        11.9711,
        76.9887
      ],
      [
        11.8811,
        76.9887
      ],
      [
        11.8811,
        76.8987
      ]
    ]
  },
  {
    "id": "karnataka_kolar_100",
    "name": "Kolar Gold & Tomato",
    "state": "Karnataka",
    "district": "Kolar",
    "isUrban": false,
    "regionalName": "ಕೋಲಾರ ಟೊಮ್ಯಾಟೊ",
    "lat": 13.1367,
    "lng": 78.1291,
    "elevationM": 822,
    "terrainType": "Drought-Resilient Tank Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Processing Tomato (Asia's Hub)",
      "Mulberry",
      "Dairy"
    ],
    "polygonCoords": [
      [
        13.1817,
        78.0841
      ],
      [
        13.1817,
        78.1741
      ],
      [
        13.0917,
        78.1741
      ],
      [
        13.0917,
        78.0841
      ]
    ]
  },
  {
    "id": "karnataka_chikkaballapura_101",
    "name": "Chikkaballapura Vineyards",
    "state": "Karnataka",
    "district": "Chikkaballapura",
    "isUrban": false,
    "regionalName": "ಚಿಕ್ಕಬಳ್ಳಾಪುರ ದ್ರಾಕ್ಷಿ",
    "lat": 13.4325,
    "lng": 77.7275,
    "elevationM": 914,
    "terrainType": "Nandi Hills Ridge Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Bangalore Blue Grapes (GI)",
      "Floriculture",
      "Potato"
    ],
    "polygonCoords": [
      [
        13.4775,
        77.6825
      ],
      [
        13.4775,
        77.7725
      ],
      [
        13.3875,
        77.7725
      ],
      [
        13.3875,
        77.6825
      ]
    ]
  },
  {
    "id": "karnataka_ramanagara_102",
    "name": "Ramanagara Silk City",
    "state": "Karnataka",
    "district": "Ramanagara",
    "isUrban": false,
    "regionalName": "ರಾಮನಗರ ರೇಷ್ಮೆ",
    "lat": 12.7209,
    "lng": 77.2799,
    "elevationM": 747,
    "terrainType": "Granitic Sholay Hills",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Mulberry Silk (Asia's Largest Cocoon)",
      "Mango"
    ],
    "polygonCoords": [
      [
        12.7659,
        77.2349
      ],
      [
        12.7659,
        77.3249
      ],
      [
        12.6759,
        77.3249
      ],
      [
        12.6759,
        77.2349
      ]
    ]
  },
  {
    "id": "karnataka_yadgir_103",
    "name": "Yadgir Bhima Valley",
    "state": "Karnataka",
    "district": "Yadgir",
    "isUrban": false,
    "regionalName": "ಯಾದಗಿರಿ",
    "lat": 16.763,
    "lng": 77.135,
    "elevationM": 389,
    "terrainType": "Bhima-Krishna Lowlands",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Red Gram",
      "Paddy",
      "Cotton"
    ],
    "polygonCoords": [
      [
        16.808,
        77.09
      ],
      [
        16.808,
        77.18
      ],
      [
        16.718,
        77.18
      ],
      [
        16.718,
        77.09
      ]
    ]
  },
  {
    "id": "karnataka_vijayanagara_104",
    "name": "Vijayanagara Hampi Basin",
    "state": "Karnataka",
    "district": "Vijayanagara",
    "isUrban": false,
    "regionalName": "ವಿಜಯನಗರ ಹಂಪಿ",
    "lat": 15.275,
    "lng": 76.39,
    "elevationM": 470,
    "terrainType": "Tungabhadra Heritage Valley",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sugarcane",
      "Banana",
      "Paddy"
    ],
    "polygonCoords": [
      [
        15.32,
        76.345
      ],
      [
        15.32,
        76.435
      ],
      [
        15.23,
        76.435
      ],
      [
        15.23,
        76.345
      ]
    ]
  },
  {
    "id": "karnataka_bengalururural_105",
    "name": "Bengaluru Rural Nelamangala",
    "state": "Karnataka",
    "district": "Bengaluru Rural",
    "isUrban": true,
    "regionalName": "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ",
    "lat": 13.097,
    "lng": 77.391,
    "elevationM": 890,
    "terrainType": "Peri-Urban Agro-Logistics",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Organic Vegetables",
      "Poultry",
      "Dairy"
    ],
    "polygonCoords": [
      [
        13.132,
        77.356
      ],
      [
        13.132,
        77.426
      ],
      [
        13.062,
        77.426
      ],
      [
        13.062,
        77.356
      ]
    ]
  },
  {
    "id": "uttarpradesh_lucknow_106",
    "name": "Lucknow Gomti Basin",
    "state": "Uttar Pradesh",
    "district": "Lucknow",
    "isUrban": true,
    "regionalName": "लखनऊ महानगर",
    "lat": 26.8467,
    "lng": 80.9462,
    "elevationM": 123,
    "terrainType": "Gomti River Alluvial Floodplain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Malihabadi Dussehri Mango (GI)",
      "Urban Flood Buffer"
    ],
    "polygonCoords": [
      [
        26.8817,
        80.9112
      ],
      [
        26.8817,
        80.9812
      ],
      [
        26.8117,
        80.9812
      ],
      [
        26.8117,
        80.9112
      ]
    ]
  },
  {
    "id": "uttarpradesh_kanpurnagar_107",
    "name": "Kanpur Nagar Industrial Core",
    "state": "Uttar Pradesh",
    "district": "Kanpur Nagar",
    "isUrban": true,
    "regionalName": "कानपुर नगर",
    "lat": 26.4499,
    "lng": 80.3319,
    "elevationM": 126,
    "terrainType": "Ganga Industrial Plain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Wheat",
      "Vegetables",
      "Industrial Buffer"
    ],
    "polygonCoords": [
      [
        26.4849,
        80.2969
      ],
      [
        26.4849,
        80.3669
      ],
      [
        26.4149,
        80.3669
      ],
      [
        26.4149,
        80.2969
      ]
    ]
  },
  {
    "id": "uttarpradesh_varanasi_108",
    "name": "Varanasi Holy Ghats Basin",
    "state": "Uttar Pradesh",
    "district": "Varanasi",
    "isUrban": true,
    "regionalName": "वाराणसी गंगा कछार",
    "lat": 25.3176,
    "lng": 82.9739,
    "elevationM": 81,
    "terrainType": "Middle Ganga Floodplain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Banarasi Paan (GI)",
      "Green Pea",
      "Mustard"
    ],
    "polygonCoords": [
      [
        25.3526,
        82.9389
      ],
      [
        25.3526,
        83.0089
      ],
      [
        25.2826,
        83.0089
      ],
      [
        25.2826,
        82.9389
      ]
    ]
  },
  {
    "id": "uttarpradesh_agra_109",
    "name": "Agra Yamuna Basin",
    "state": "Uttar Pradesh",
    "district": "Agra",
    "isUrban": true,
    "regionalName": "आगरा ताज बेसिन",
    "lat": 27.1767,
    "lng": 78.0081,
    "elevationM": 169,
    "terrainType": "Yamuna Semi-Arid Alluvium",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Potato (Cold Storage Hub)",
      "Mustard",
      "Wheat"
    ],
    "polygonCoords": [
      [
        27.2117,
        77.9731
      ],
      [
        27.2117,
        78.0431
      ],
      [
        27.1417,
        78.0431
      ],
      [
        27.1417,
        77.9731
      ]
    ]
  },
  {
    "id": "uttarpradesh_prayagraj_110",
    "name": "Prayagraj Sangam Basin",
    "state": "Uttar Pradesh",
    "district": "Prayagraj",
    "isUrban": true,
    "regionalName": "प्रयागराज संगम",
    "lat": 25.4358,
    "lng": 81.8463,
    "elevationM": 98,
    "terrainType": "Ganga-Yamuna Confluence",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Allahabad Surkha Guava (GI)",
      "Wheat",
      "Paddy"
    ],
    "polygonCoords": [
      [
        25.4708,
        81.8113
      ],
      [
        25.4708,
        81.8813
      ],
      [
        25.4008,
        81.8813
      ],
      [
        25.4008,
        81.8113
      ]
    ]
  },
  {
    "id": "uttarpradesh_gautambuddhanagar_111",
    "name": "Noida NCR Tech Corridor",
    "state": "Uttar Pradesh",
    "district": "Gautam Buddha Nagar",
    "isUrban": true,
    "regionalName": "नोएडा एनसीआर",
    "lat": 28.5355,
    "lng": 77.391,
    "elevationM": 200,
    "terrainType": "Hindon-Yamuna Floodplain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Urban Heat Island Mitigation",
      "Peri-Urban Dairy",
      "Vertical Greens"
    ],
    "polygonCoords": [
      [
        28.5705,
        77.356
      ],
      [
        28.5705,
        77.426
      ],
      [
        28.5005,
        77.426
      ],
      [
        28.5005,
        77.356
      ]
    ]
  },
  {
    "id": "uttarpradesh_ghaziabad_112",
    "name": "Ghaziabad Industrial Belt",
    "state": "Uttar Pradesh",
    "district": "Ghaziabad",
    "isUrban": true,
    "regionalName": "गाजियाबाद",
    "lat": 28.6692,
    "lng": 77.4538,
    "elevationM": 214,
    "terrainType": "Upper Doab Alluvial Plain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Vegetables",
      "Wheat",
      "Urban Canopy"
    ],
    "polygonCoords": [
      [
        28.7042,
        77.4188
      ],
      [
        28.7042,
        77.4888
      ],
      [
        28.6342,
        77.4888
      ],
      [
        28.6342,
        77.4188
      ]
    ]
  },
  {
    "id": "uttarpradesh_meerut_113",
    "name": "Meerut Sports & Sugar",
    "state": "Uttar Pradesh",
    "district": "Meerut",
    "isUrban": true,
    "regionalName": "मेरठ",
    "lat": 28.9845,
    "lng": 77.7064,
    "elevationM": 224,
    "terrainType": "Fertile Ganga-Yamuna Doab",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sugarcane",
      "Wheat",
      "Mustard"
    ],
    "polygonCoords": [
      [
        29.0195,
        77.6714
      ],
      [
        29.0195,
        77.7414
      ],
      [
        28.9495,
        77.7414
      ],
      [
        28.9495,
        77.6714
      ]
    ]
  },
  {
    "id": "uttarpradesh_bareilly_114",
    "name": "Bareilly Zari Basin",
    "state": "Uttar Pradesh",
    "district": "Bareilly",
    "isUrban": true,
    "regionalName": "बरेली",
    "lat": 28.367,
    "lng": 79.4304,
    "elevationM": 166,
    "terrainType": "Ramganga Alluvial Plain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sugarcane",
      "Paddy",
      "Wheat"
    ],
    "polygonCoords": [
      [
        28.402,
        79.3954
      ],
      [
        28.402,
        79.4654
      ],
      [
        28.332,
        79.4654
      ],
      [
        28.332,
        79.3954
      ]
    ]
  },
  {
    "id": "uttarpradesh_aligarh_115",
    "name": "Aligarh Lock City",
    "state": "Uttar Pradesh",
    "district": "Aligarh",
    "isUrban": true,
    "regionalName": "अलीगढ़",
    "lat": 27.8974,
    "lng": 78.088,
    "elevationM": 178,
    "terrainType": "Ganga Canal Plain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Wheat",
      "Mustard",
      "Barley"
    ],
    "polygonCoords": [
      [
        27.9324,
        78.053
      ],
      [
        27.9324,
        78.123
      ],
      [
        27.8624,
        78.123
      ],
      [
        27.8624,
        78.053
      ]
    ]
  },
  {
    "id": "uttarpradesh_moradabad_116",
    "name": "Moradabad Brass & Mint",
    "state": "Uttar Pradesh",
    "district": "Moradabad",
    "isUrban": true,
    "regionalName": "मुरादाबाद",
    "lat": 28.8386,
    "lng": 78.7733,
    "elevationM": 193,
    "terrainType": "Ramganga Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Mentha (Peppermint Oil)",
      "Sugarcane",
      "Rice"
    ],
    "polygonCoords": [
      [
        28.8736,
        78.7383
      ],
      [
        28.8736,
        78.8083
      ],
      [
        28.8036,
        78.8083
      ],
      [
        28.8036,
        78.7383
      ]
    ]
  },
  {
    "id": "uttarpradesh_saharanpur_117",
    "name": "Saharanpur Woodcraft & Mango",
    "state": "Uttar Pradesh",
    "district": "Saharanpur",
    "isUrban": true,
    "regionalName": "सहारनपुर",
    "lat": 29.9671,
    "lng": 77.551,
    "elevationM": 269,
    "terrainType": "Shivalik Foot-Slope Doab",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Chausa & Langra Mangoes",
      "Sugarcane",
      "Basmati"
    ],
    "polygonCoords": [
      [
        30.0021,
        77.516
      ],
      [
        30.0021,
        77.586
      ],
      [
        29.9321,
        77.586
      ],
      [
        29.9321,
        77.516
      ]
    ]
  },
  {
    "id": "uttarpradesh_gorakhpur_118",
    "name": "Gorakhpur Rapti Basin",
    "state": "Uttar Pradesh",
    "district": "Gorakhpur",
    "isUrban": true,
    "regionalName": "गोरखपुर कालानमक",
    "lat": 26.7606,
    "lng": 83.3732,
    "elevationM": 84,
    "terrainType": "Terai Alluvial Floodplain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Kala Namak Rice (Buddha Rice GI)",
      "Sugarcane"
    ],
    "polygonCoords": [
      [
        26.7956,
        83.3382
      ],
      [
        26.7956,
        83.4082
      ],
      [
        26.7256,
        83.4082
      ],
      [
        26.7256,
        83.3382
      ]
    ]
  },
  {
    "id": "uttarpradesh_jhansi_119",
    "name": "Jhansi Bundelkhand Gateway",
    "state": "Uttar Pradesh",
    "district": "Jhansi",
    "isUrban": true,
    "regionalName": "झांसी बुंदेलखंड",
    "lat": 25.4484,
    "lng": 78.5685,
    "elevationM": 284,
    "terrainType": "Granitic Bundelkhand Uplands",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Pulses (Chickpea/Gram)",
      "Wheat",
      "Mustard"
    ],
    "polygonCoords": [
      [
        25.4834,
        78.5335
      ],
      [
        25.4834,
        78.6035
      ],
      [
        25.4134,
        78.6035
      ],
      [
        25.4134,
        78.5335
      ]
    ]
  },
  {
    "id": "uttarpradesh_muzaffarnagar_120",
    "name": "Muzaffarnagar Jaggery Hub",
    "state": "Uttar Pradesh",
    "district": "Muzaffarnagar",
    "isUrban": false,
    "regionalName": "मुजफ्फरनगर गुड़ मंडी",
    "lat": 29.4727,
    "lng": 77.7085,
    "elevationM": 249,
    "terrainType": "Ganga Canal Doab",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sugarcane (Sugar Capital)",
      "Wheat"
    ],
    "polygonCoords": [
      [
        29.5177,
        77.6635
      ],
      [
        29.5177,
        77.7535
      ],
      [
        29.4277,
        77.7535
      ],
      [
        29.4277,
        77.6635
      ]
    ]
  },
  {
    "id": "uttarpradesh_mathura_121",
    "name": "Mathura Braj Pastoral Basin",
    "state": "Uttar Pradesh",
    "district": "Mathura",
    "isUrban": false,
    "regionalName": "मथुरा ब्रज भूमि",
    "lat": 27.4924,
    "lng": 77.6737,
    "elevationM": 174,
    "terrainType": "Yamuna Flood Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Dairy Fodder",
      "Wheat",
      "Mustard"
    ],
    "polygonCoords": [
      [
        27.5374,
        77.6287
      ],
      [
        27.5374,
        77.7187
      ],
      [
        27.4474,
        77.7187
      ],
      [
        27.4474,
        77.6287
      ]
    ]
  },
  {
    "id": "uttarpradesh_ayodhya_122",
    "name": "Ayodhya Saryu Basin",
    "state": "Uttar Pradesh",
    "district": "Ayodhya",
    "isUrban": true,
    "regionalName": "अयोध्या सरयू बेसिन",
    "lat": 26.7922,
    "lng": 82.1998,
    "elevationM": 96,
    "terrainType": "Saryu River Plain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Sugarcane",
      "Vegetables"
    ],
    "polygonCoords": [
      [
        26.8272,
        82.1648
      ],
      [
        26.8272,
        82.2348
      ],
      [
        26.7572,
        82.2348
      ],
      [
        26.7572,
        82.1648
      ]
    ]
  },
  {
    "id": "uttarpradesh_budaun_123",
    "name": "Budaun Mint Basin",
    "state": "Uttar Pradesh",
    "district": "Budaun",
    "isUrban": false,
    "regionalName": "बदायूं मेंथा",
    "lat": 28.0333,
    "lng": 79.1167,
    "elevationM": 169,
    "terrainType": "Sot-Ganga Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Mentha Oil",
      "Wheat",
      "Paddy"
    ],
    "polygonCoords": [
      [
        28.0783,
        79.0717
      ],
      [
        28.0783,
        79.1617
      ],
      [
        27.9883,
        79.1617
      ],
      [
        27.9883,
        79.0717
      ]
    ]
  },
  {
    "id": "uttarpradesh_rampur_124",
    "name": "Rampur Nawab Basin",
    "state": "Uttar Pradesh",
    "district": "Rampur",
    "isUrban": false,
    "regionalName": "रामपुर",
    "lat": 28.8154,
    "lng": 79.0257,
    "elevationM": 192,
    "terrainType": "Kosi River Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Mentha",
      "Rice",
      "Sugarcane"
    ],
    "polygonCoords": [
      [
        28.8604,
        78.9807
      ],
      [
        28.8604,
        79.0707
      ],
      [
        28.7704,
        79.0707
      ],
      [
        28.7704,
        78.9807
      ]
    ]
  },
  {
    "id": "uttarpradesh_shahjahanpur_125",
    "name": "Shahjahanpur Rice Hub",
    "state": "Uttar Pradesh",
    "district": "Shahjahanpur",
    "isUrban": false,
    "regionalName": "शाहजहांपुर",
    "lat": 27.8814,
    "lng": 79.9103,
    "elevationM": 153,
    "terrainType": "Garrah Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Wheat",
      "Sugarcane"
    ],
    "polygonCoords": [
      [
        27.9264,
        79.8653
      ],
      [
        27.9264,
        79.9553
      ],
      [
        27.8364,
        79.9553
      ],
      [
        27.8364,
        79.8653
      ]
    ]
  },
  {
    "id": "uttarpradesh_farrukhabad_126",
    "name": "Farrukhabad Potato Capital",
    "state": "Uttar Pradesh",
    "district": "Farrukhabad",
    "isUrban": false,
    "regionalName": "फर्रुखाबाद आलू",
    "lat": 27.3826,
    "lng": 79.5843,
    "elevationM": 167,
    "terrainType": "Ganga-Ramganga Confluence",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Potato (Asia's Big Belt)",
      "Watermelon"
    ],
    "polygonCoords": [
      [
        27.4276,
        79.5393
      ],
      [
        27.4276,
        79.6293
      ],
      [
        27.3376,
        79.6293
      ],
      [
        27.3376,
        79.5393
      ]
    ]
  },
  {
    "id": "uttarpradesh_raebareli_127",
    "name": "Rae Bareli Canal Plains",
    "state": "Uttar Pradesh",
    "district": "Rae Bareli",
    "isUrban": false,
    "regionalName": "रायबरेली",
    "lat": 26.2236,
    "lng": 81.2409,
    "elevationM": 111,
    "terrainType": "Sai River Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Wheat",
      "Mustard"
    ],
    "polygonCoords": [
      [
        26.2686,
        81.1959
      ],
      [
        26.2686,
        81.2859
      ],
      [
        26.1786,
        81.2859
      ],
      [
        26.1786,
        81.1959
      ]
    ]
  },
  {
    "id": "uttarpradesh_mirzapur_128",
    "name": "Mirzapur Vindhyan Foothills",
    "state": "Uttar Pradesh",
    "district": "Mirzapur",
    "isUrban": false,
    "regionalName": "मिर्जापुर",
    "lat": 25.146,
    "lng": 82.569,
    "elevationM": 80,
    "terrainType": "Ganga-Vindhyan Escarpment",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Sesame",
      "Mustard"
    ],
    "polygonCoords": [
      [
        25.191,
        82.524
      ],
      [
        25.191,
        82.614
      ],
      [
        25.101,
        82.614
      ],
      [
        25.101,
        82.524
      ]
    ]
  },
  {
    "id": "uttarpradesh_sitapur_129",
    "name": "Sitapur Sugar Belt",
    "state": "Uttar Pradesh",
    "district": "Sitapur",
    "isUrban": false,
    "regionalName": "सीतापुर",
    "lat": 27.5684,
    "lng": 80.6829,
    "elevationM": 138,
    "terrainType": "Sarayan River Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sugarcane",
      "Paddy",
      "Mentha"
    ],
    "polygonCoords": [
      [
        27.6134,
        80.6379
      ],
      [
        27.6134,
        80.7279
      ],
      [
        27.5234,
        80.7279
      ],
      [
        27.5234,
        80.6379
      ]
    ]
  },
  {
    "id": "uttarpradesh_bulandshahr_130",
    "name": "Bulandshahr Dairy Plain",
    "state": "Uttar Pradesh",
    "district": "Bulandshahr",
    "isUrban": false,
    "regionalName": "बुलंदशहर",
    "lat": 28.4069,
    "lng": 77.8498,
    "elevationM": 208,
    "terrainType": "Upper Doab Canal Belt",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Dairy Fodder",
      "Maize",
      "Wheat"
    ],
    "polygonCoords": [
      [
        28.4519,
        77.8048
      ],
      [
        28.4519,
        77.8948
      ],
      [
        28.3619,
        77.8948
      ],
      [
        28.3619,
        77.8048
      ]
    ]
  },
  {
    "id": "uttarpradesh_sambhal_131",
    "name": "Sambhal Mentha Belt",
    "state": "Uttar Pradesh",
    "district": "Sambhal",
    "isUrban": false,
    "regionalName": "संभल",
    "lat": 28.5833,
    "lng": 78.55,
    "elevationM": 193,
    "terrainType": "Alluvial Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Mentha Oil",
      "Paddy",
      "Watermelon"
    ],
    "polygonCoords": [
      [
        28.6283,
        78.505
      ],
      [
        28.6283,
        78.595
      ],
      [
        28.5383,
        78.595
      ],
      [
        28.5383,
        78.505
      ]
    ]
  },
  {
    "id": "uttarpradesh_amroha_132",
    "name": "Amroha Dholak & Mango",
    "state": "Uttar Pradesh",
    "district": "Amroha",
    "isUrban": false,
    "regionalName": "अमरोहा",
    "lat": 28.9044,
    "lng": 78.4674,
    "elevationM": 211,
    "terrainType": "Ganga-Sot Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Mangoes",
      "Sugarcane",
      "Poplar Tree"
    ],
    "polygonCoords": [
      [
        28.9494,
        78.4224
      ],
      [
        28.9494,
        78.5124
      ],
      [
        28.8594,
        78.5124
      ],
      [
        28.8594,
        78.4224
      ]
    ]
  },
  {
    "id": "uttarpradesh_hardoi_133",
    "name": "Hardoi Alluvial Basin",
    "state": "Uttar Pradesh",
    "district": "Hardoi",
    "isUrban": false,
    "regionalName": "हरदोई",
    "lat": 27.3995,
    "lng": 80.1319,
    "elevationM": 143,
    "terrainType": "Sai River Valley",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sugarcane",
      "Wheat",
      "Paddy"
    ],
    "polygonCoords": [
      [
        27.4445,
        80.0869
      ],
      [
        27.4445,
        80.1769
      ],
      [
        27.3545,
        80.1769
      ],
      [
        27.3545,
        80.0869
      ]
    ]
  },
  {
    "id": "uttarpradesh_fatehpur_134",
    "name": "Fatehpur Doab Basin",
    "state": "Uttar Pradesh",
    "district": "Fatehpur",
    "isUrban": false,
    "regionalName": "फतेहपुर",
    "lat": 25.9284,
    "lng": 80.813,
    "elevationM": 110,
    "terrainType": "Ganga-Yamuna Interfluve",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Wheat",
      "Chickpea"
    ],
    "polygonCoords": [
      [
        25.9734,
        80.768
      ],
      [
        25.9734,
        80.858
      ],
      [
        25.8834,
        80.858
      ],
      [
        25.8834,
        80.768
      ]
    ]
  },
  {
    "id": "uttarpradesh_jaunpur_135",
    "name": "Jaunpur Corn & Radish",
    "state": "Uttar Pradesh",
    "district": "Jaunpur",
    "isUrban": false,
    "regionalName": "जौनपुर मूली",
    "lat": 25.7464,
    "lng": 82.6837,
    "elevationM": 86,
    "terrainType": "Gomti Valley",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Jaunpuri Mooli (Giant Radish)",
      "Maize",
      "Paddy"
    ],
    "polygonCoords": [
      [
        25.7914,
        82.6387
      ],
      [
        25.7914,
        82.7287
      ],
      [
        25.7014,
        82.7287
      ],
      [
        25.7014,
        82.6387
      ]
    ]
  },
  {
    "id": "uttarpradesh_deoria_136",
    "name": "Deoria Sugar Belt",
    "state": "Uttar Pradesh",
    "district": "Deoria",
    "isUrban": false,
    "regionalName": "देवरिया",
    "lat": 26.5024,
    "lng": 83.7791,
    "elevationM": 75,
    "terrainType": "Bhat Alluvial Soil",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sugarcane",
      "Paddy",
      "Wheat"
    ],
    "polygonCoords": [
      [
        26.5474,
        83.7341
      ],
      [
        26.5474,
        83.8241
      ],
      [
        26.4574,
        83.8241
      ],
      [
        26.4574,
        83.7341
      ]
    ]
  },
  {
    "id": "uttarpradesh_ghazipur_137",
    "name": "Ghazipur Rosewater Basin",
    "state": "Uttar Pradesh",
    "district": "Ghazipur",
    "isUrban": false,
    "regionalName": "गाजीपुर गुलाब",
    "lat": 25.584,
    "lng": 83.577,
    "elevationM": 73,
    "terrainType": "Ganga Meander Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Damask Rose",
      "Opium Buffer",
      "Vegetables"
    ],
    "polygonCoords": [
      [
        25.629,
        83.532
      ],
      [
        25.629,
        83.622
      ],
      [
        25.539,
        83.622
      ],
      [
        25.539,
        83.532
      ]
    ]
  },
  {
    "id": "uttarpradesh_basti_138",
    "name": "Basti Terai Foothills",
    "state": "Uttar Pradesh",
    "district": "Basti",
    "isUrban": false,
    "regionalName": "बस्ती",
    "lat": 26.8044,
    "lng": 82.7634,
    "elevationM": 85,
    "terrainType": "Kuano Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sugarcane",
      "Paddy",
      "Wheat"
    ],
    "polygonCoords": [
      [
        26.8494,
        82.7184
      ],
      [
        26.8494,
        82.8084
      ],
      [
        26.7594,
        82.8084
      ],
      [
        26.7594,
        82.7184
      ]
    ]
  },
  {
    "id": "uttarpradesh_ballia_139",
    "name": "Ballia Surha Tal Basin",
    "state": "Uttar Pradesh",
    "district": "Ballia",
    "isUrban": false,
    "regionalName": "बलिया",
    "lat": 25.76,
    "lng": 84.15,
    "elevationM": 68,
    "terrainType": "Ganga-Ghaghara Confluence",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Wheat",
      "Vegetables"
    ],
    "polygonCoords": [
      [
        25.805,
        84.105
      ],
      [
        25.805,
        84.195
      ],
      [
        25.715,
        84.195
      ],
      [
        25.715,
        84.105
      ]
    ]
  },
  {
    "id": "uttarpradesh_azamgarh_140",
    "name": "Azamgarh Black Soil Plain",
    "state": "Uttar Pradesh",
    "district": "Azamgarh",
    "isUrban": false,
    "regionalName": "आजमगढ़",
    "lat": 26.0685,
    "lng": 83.184,
    "elevationM": 77,
    "terrainType": "Tons River Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Sugarcane",
      "Mustard"
    ],
    "polygonCoords": [
      [
        26.1135,
        83.139
      ],
      [
        26.1135,
        83.229
      ],
      [
        26.0235,
        83.229
      ],
      [
        26.0235,
        83.139
      ]
    ]
  },
  {
    "id": "delhincr_newdelhi_141",
    "name": "New Delhi Capital Core",
    "state": "Delhi NCR",
    "district": "New Delhi",
    "isUrban": true,
    "regionalName": "नई दिल्ली केंद्र",
    "lat": 28.6139,
    "lng": 77.209,
    "elevationM": 216,
    "terrainType": "National Capital Lutyens Zone",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Urban Heat Island Mitigation",
      "Vertical Farming",
      "Air Quality Bio-Shields"
    ],
    "polygonCoords": [
      [
        28.6489,
        77.174
      ],
      [
        28.6489,
        77.244
      ],
      [
        28.5789,
        77.244
      ],
      [
        28.5789,
        77.174
      ]
    ]
  },
  {
    "id": "delhincr_northdelhi_142",
    "name": "North Delhi Ridge Basin",
    "state": "Delhi NCR",
    "district": "North Delhi",
    "isUrban": true,
    "regionalName": "उत्तर दिल्ली",
    "lat": 28.718,
    "lng": 77.165,
    "elevationM": 220,
    "terrainType": "Delhi Ridge Forest Fringe",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Urban Agroforestry",
      "Peri-Urban Vegetable"
    ],
    "polygonCoords": [
      [
        28.753,
        77.13
      ],
      [
        28.753,
        77.2
      ],
      [
        28.683,
        77.2
      ],
      [
        28.683,
        77.13
      ]
    ]
  },
  {
    "id": "delhincr_southdelhi_143",
    "name": "South Delhi Mehrauli",
    "state": "Delhi NCR",
    "district": "South Delhi",
    "isUrban": true,
    "regionalName": "दक्षिण दिल्ली",
    "lat": 28.5244,
    "lng": 77.1855,
    "elevationM": 235,
    "terrainType": "Aravalli Quartzite Spur",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Rooftop Greenery",
      "Urban Canopy Retention"
    ],
    "polygonCoords": [
      [
        28.5594,
        77.1505
      ],
      [
        28.5594,
        77.2205
      ],
      [
        28.4894,
        77.2205
      ],
      [
        28.4894,
        77.1505
      ]
    ]
  },
  {
    "id": "delhincr_eastdelhi_144",
    "name": "East Delhi Yamuna Floodplain",
    "state": "Delhi NCR",
    "district": "East Delhi",
    "isUrban": true,
    "regionalName": "पूर्वी दिल्ली यमुना खादर",
    "lat": 28.627,
    "lng": 77.278,
    "elevationM": 205,
    "terrainType": "Yamuna Active Floodplain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Yamuna Khadar Melons",
      "Green Fodder"
    ],
    "polygonCoords": [
      [
        28.662,
        77.243
      ],
      [
        28.662,
        77.313
      ],
      [
        28.592,
        77.313
      ],
      [
        28.592,
        77.243
      ]
    ]
  },
  {
    "id": "delhincr_gurugram_145",
    "name": "Gurugram Cyber City",
    "state": "Delhi NCR",
    "district": "Gurugram",
    "isUrban": true,
    "regionalName": "गुरुग्राम साइबर सिटी",
    "lat": 28.4595,
    "lng": 77.0266,
    "elevationM": 225,
    "terrainType": "Aravalli Piedmont Urban Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Urban Heat Island Mitigation",
      "Rainwater Harvesting"
    ],
    "polygonCoords": [
      [
        28.4945,
        76.9916
      ],
      [
        28.4945,
        77.0616
      ],
      [
        28.4245,
        77.0616
      ],
      [
        28.4245,
        76.9916
      ]
    ]
  },
  {
    "id": "delhincr_faridabad_146",
    "name": "Faridabad Industrial Plain",
    "state": "Delhi NCR",
    "district": "Faridabad",
    "isUrban": true,
    "regionalName": "फरीदाबाद",
    "lat": 28.4089,
    "lng": 77.3178,
    "elevationM": 208,
    "terrainType": "Yamuna Terraced Plain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Mustard",
      "Wheat",
      "Industrial Green Buffers"
    ],
    "polygonCoords": [
      [
        28.4439,
        77.2828
      ],
      [
        28.4439,
        77.3528
      ],
      [
        28.3739,
        77.3528
      ],
      [
        28.3739,
        77.2828
      ]
    ]
  },
  {
    "id": "westbengal_kolkata_147",
    "name": "Kolkata City Central",
    "state": "West Bengal",
    "district": "Kolkata",
    "isUrban": true,
    "regionalName": "কলকাতা মহানগর",
    "lat": 22.5726,
    "lng": 88.3639,
    "elevationM": 9,
    "terrainType": "Hooghly Tidal Delta",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "East Kolkata Wetlands (Sewage Fisheries)",
      "Urban Canopy"
    ],
    "polygonCoords": [
      [
        22.6076,
        88.3289
      ],
      [
        22.6076,
        88.3989
      ],
      [
        22.5376,
        88.3989
      ],
      [
        22.5376,
        88.3289
      ]
    ]
  },
  {
    "id": "westbengal_howrah_148",
    "name": "Howrah Industrial Belt",
    "state": "West Bengal",
    "district": "Howrah",
    "isUrban": true,
    "regionalName": "হাওড়া",
    "lat": 22.5958,
    "lng": 88.2636,
    "elevationM": 12,
    "terrainType": "Lower Hooghly Floodplain",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Betel Leaf",
      "Floriculture",
      "Industrial Buffer"
    ],
    "polygonCoords": [
      [
        22.6308,
        88.2286
      ],
      [
        22.6308,
        88.2986
      ],
      [
        22.5608,
        88.2986
      ],
      [
        22.5608,
        88.2286
      ]
    ]
  },
  {
    "id": "westbengal_darjeeling_149",
    "name": "Darjeeling Mist Ridge",
    "state": "West Bengal",
    "district": "Darjeeling",
    "isUrban": false,
    "regionalName": "দার্জিলিং চা বাগান",
    "lat": 27.036,
    "lng": 88.2627,
    "elevationM": 2045,
    "terrainType": "Eastern Himalayan Cloud Escarpment",
    "drainageAccumulation": 0.92,
    "slopeDeg": 18.5,
    "primaryCrops": [
      "Darjeeling First Flush Tea (GI)",
      "Cardamom",
      "Mandarin"
    ],
    "polygonCoords": [
      [
        27.081,
        88.2177
      ],
      [
        27.081,
        88.3077
      ],
      [
        26.991,
        88.3077
      ],
      [
        26.991,
        88.2177
      ]
    ]
  },
  {
    "id": "westbengal_paschimbardhaman_150",
    "name": "Asansol-Durgapur Steel Belt",
    "state": "West Bengal",
    "district": "Paschim Bardhaman",
    "isUrban": true,
    "regionalName": "আসানসোল-দুর্গাপুর",
    "lat": 23.6889,
    "lng": 86.9661,
    "elevationM": 111,
    "terrainType": "Damodar Valley Industrial Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Vegetables",
      "Mine Reclamation Forestry"
    ],
    "polygonCoords": [
      [
        23.7239,
        86.9311
      ],
      [
        23.7239,
        87.0011
      ],
      [
        23.6539,
        87.0011
      ],
      [
        23.6539,
        86.9311
      ]
    ]
  },
  {
    "id": "westbengal_jalpaiguri_151",
    "name": "Siliguri Foothills Hub",
    "state": "West Bengal",
    "district": "Jalpaiguri",
    "isUrban": true,
    "regionalName": "শিলিগুড়ি",
    "lat": 26.7271,
    "lng": 88.3953,
    "elevationM": 122,
    "terrainType": "Terai-Dooars Confluence",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Dooars CTC Tea",
      "Pineapple",
      "Jute"
    ],
    "polygonCoords": [
      [
        26.7621,
        88.3603
      ],
      [
        26.7621,
        88.4303
      ],
      [
        26.6921,
        88.4303
      ],
      [
        26.6921,
        88.3603
      ]
    ]
  },
  {
    "id": "westbengal_purbabardhaman_152",
    "name": "Bardhaman Rice Bowl",
    "state": "West Bengal",
    "district": "Purba Bardhaman",
    "isUrban": false,
    "regionalName": "বর্ধমান ধানের গোলা",
    "lat": 23.2324,
    "lng": 87.8615,
    "elevationM": 40,
    "terrainType": "Damodar-Bhagirathi Alluvium",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Gobindobhog Rice (GI)",
      "Aman Paddy",
      "Potato"
    ],
    "polygonCoords": [
      [
        23.2774,
        87.8165
      ],
      [
        23.2774,
        87.9065
      ],
      [
        23.1874,
        87.9065
      ],
      [
        23.1874,
        87.8165
      ]
    ]
  },
  {
    "id": "westbengal_malda_153",
    "name": "Malda Mango Basin",
    "state": "West Bengal",
    "district": "Malda",
    "isUrban": false,
    "regionalName": "মালদা আম",
    "lat": 25.0108,
    "lng": 88.1411,
    "elevationM": 27,
    "terrainType": "Mahananda-Ganga Silt Basin",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Fazli & Himsagar Mango (GI)",
      "Jute",
      "Silk"
    ],
    "polygonCoords": [
      [
        25.0558,
        88.0961
      ],
      [
        25.0558,
        88.1861
      ],
      [
        24.9658,
        88.1861
      ],
      [
        24.9658,
        88.0961
      ]
    ]
  },
  {
    "id": "westbengal_murshidabad_154",
    "name": "Murshidabad Silk & Jute",
    "state": "West Bengal",
    "district": "Murshidabad",
    "isUrban": false,
    "regionalName": "মুর্শিদাবাদ রেশম",
    "lat": 24.1759,
    "lng": 88.2802,
    "elevationM": 21,
    "terrainType": "Bhagirathi Delta Plain",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Golden Jute",
      "Mulberry Silk",
      "Mustard"
    ],
    "polygonCoords": [
      [
        24.2209,
        88.2352
      ],
      [
        24.2209,
        88.3252
      ],
      [
        24.1309,
        88.3252
      ],
      [
        24.1309,
        88.2352
      ]
    ]
  },
  {
    "id": "westbengal_northparganas_155",
    "name": "North 24 Parganas Sundarban",
    "state": "West Bengal",
    "district": "North 24 Parganas",
    "isUrban": false,
    "regionalName": "উত্তর ২৪ পরগনা",
    "lat": 22.721,
    "lng": 88.481,
    "elevationM": 8,
    "terrainType": "Estuarine Delta Mangrove Margin",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Tidal Paddy",
      "Black Tiger Prawn",
      "Jute"
    ],
    "polygonCoords": [
      [
        22.766,
        88.436
      ],
      [
        22.766,
        88.526
      ],
      [
        22.676,
        88.526
      ],
      [
        22.676,
        88.436
      ]
    ]
  },
  {
    "id": "westbengal_southparganas_156",
    "name": "South 24 Parganas Delta",
    "state": "West Bengal",
    "district": "South 24 Parganas",
    "isUrban": false,
    "regionalName": "দক্ষিণ ২৪ পরগনা সুন্দরবন",
    "lat": 22.1833,
    "lng": 88.5333,
    "elevationM": 5,
    "terrainType": "Active Sundarbans Mangrove Delta",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sundarban Honey",
      "Saline Paddy",
      "Betel Nut"
    ],
    "polygonCoords": [
      [
        22.2283,
        88.4883
      ],
      [
        22.2283,
        88.5783
      ],
      [
        22.1383,
        88.5783
      ],
      [
        22.1383,
        88.4883
      ]
    ]
  },
  {
    "id": "gujarat_ahmedabad_157",
    "name": "Ahmedabad Sabarmati Metro",
    "state": "Gujarat",
    "district": "Ahmedabad",
    "isUrban": true,
    "regionalName": "અમદાવાદ મહાનગર",
    "lat": 23.0225,
    "lng": 72.5714,
    "elevationM": 53,
    "terrainType": "Sabarmati River Alluvial Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Urban Heat Island Mitigation",
      "Cotton Research",
      "Vertical Greens"
    ],
    "polygonCoords": [
      [
        23.0575,
        72.5364
      ],
      [
        23.0575,
        72.6064
      ],
      [
        22.9875,
        72.6064
      ],
      [
        22.9875,
        72.5364
      ]
    ]
  },
  {
    "id": "gujarat_surat_158",
    "name": "Surat Diamond & Silk Hub",
    "state": "Gujarat",
    "district": "Surat",
    "isUrban": true,
    "regionalName": "સુરત શહેર",
    "lat": 21.1702,
    "lng": 72.8311,
    "elevationM": 13,
    "terrainType": "Tapi Estuarine Floodplain",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sugarcane",
      "Banana",
      "Urban Coastal Buffer"
    ],
    "polygonCoords": [
      [
        21.2052,
        72.7961
      ],
      [
        21.2052,
        72.8661
      ],
      [
        21.1352,
        72.8661
      ],
      [
        21.1352,
        72.7961
      ]
    ]
  },
  {
    "id": "gujarat_vadodara_159",
    "name": "Vadodara Vishwamitri Basin",
    "state": "Gujarat",
    "district": "Vadodara",
    "isUrban": true,
    "regionalName": "વડોદરા",
    "lat": 22.3072,
    "lng": 73.1812,
    "elevationM": 39,
    "terrainType": "Vishwamitri River Basin",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Tobacco",
      "Cotton",
      "Dairy Pasture"
    ],
    "polygonCoords": [
      [
        22.3422,
        73.1462
      ],
      [
        22.3422,
        73.2162
      ],
      [
        22.2722,
        73.2162
      ],
      [
        22.2722,
        73.1462
      ]
    ]
  },
  {
    "id": "gujarat_rajkot_160",
    "name": "Rajkot Saurashtra Hub",
    "state": "Gujarat",
    "district": "Rajkot",
    "isUrban": true,
    "regionalName": "રાજકોટ",
    "lat": 22.3039,
    "lng": 70.8022,
    "elevationM": 132,
    "terrainType": "Aji River Semi-Arid Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Groundnut (Peanut Oil)",
      "Cotton",
      "Cumin"
    ],
    "polygonCoords": [
      [
        22.3389,
        70.7672
      ],
      [
        22.3389,
        70.8372
      ],
      [
        22.2689,
        70.8372
      ],
      [
        22.2689,
        70.7672
      ]
    ]
  },
  {
    "id": "gujarat_gandhinagar_161",
    "name": "Gandhinagar Capital Greens",
    "state": "Gujarat",
    "district": "Gandhinagar",
    "isUrban": true,
    "regionalName": "ગાંધીનગર",
    "lat": 23.2156,
    "lng": 72.6369,
    "elevationM": 81,
    "terrainType": "Planned Forested Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Urban Forest Canopy",
      "Organic Vegetables"
    ],
    "polygonCoords": [
      [
        23.2506,
        72.6019
      ],
      [
        23.2506,
        72.6719
      ],
      [
        23.1806,
        72.6719
      ],
      [
        23.1806,
        72.6019
      ]
    ]
  },
  {
    "id": "gujarat_bhavnagar_162",
    "name": "Bhavnagar Cotton Port",
    "state": "Gujarat",
    "district": "Bhavnagar",
    "isUrban": true,
    "regionalName": "ભાવનગર",
    "lat": 21.7645,
    "lng": 72.1519,
    "elevationM": 24,
    "terrainType": "Gulf of Khambhat Coastal Plain",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Onion (Dehydration Capital)",
      "Cotton",
      "Groundnut"
    ],
    "polygonCoords": [
      [
        21.7995,
        72.1169
      ],
      [
        21.7995,
        72.1869
      ],
      [
        21.7295,
        72.1869
      ],
      [
        21.7295,
        72.1169
      ]
    ]
  },
  {
    "id": "gujarat_jamnagar_163",
    "name": "Jamnagar Reliance Coast",
    "state": "Gujarat",
    "district": "Jamnagar",
    "isUrban": true,
    "regionalName": "જામનગર",
    "lat": 22.4707,
    "lng": 70.0577,
    "elevationM": 20,
    "terrainType": "Marine Coast Plain",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Brassica / Mustard",
      "Groundnut",
      "Dates"
    ],
    "polygonCoords": [
      [
        22.5057,
        70.0227
      ],
      [
        22.5057,
        70.0927
      ],
      [
        22.4357,
        70.0927
      ],
      [
        22.4357,
        70.0227
      ]
    ]
  },
  {
    "id": "gujarat_junagadh_164",
    "name": "Junagadh Gir Kesar Valley",
    "state": "Gujarat",
    "district": "Junagadh",
    "isUrban": false,
    "regionalName": "જૂનાગઢ ગીર કેસર",
    "lat": 21.5222,
    "lng": 70.4579,
    "elevationM": 107,
    "terrainType": "Girnar Foothill Agro-Valley",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Gir Kesar Mango (GI)",
      "Groundnut",
      "Sesame"
    ],
    "polygonCoords": [
      [
        21.5672,
        70.4129
      ],
      [
        21.5672,
        70.5029
      ],
      [
        21.4772,
        70.5029
      ],
      [
        21.4772,
        70.4129
      ]
    ]
  },
  {
    "id": "gujarat_anand_165",
    "name": "Anand Dairy Capital",
    "state": "Gujarat",
    "district": "Anand",
    "isUrban": true,
    "regionalName": "આણંદ ચરોતર",
    "lat": 22.5645,
    "lng": 72.9289,
    "elevationM": 42,
    "terrainType": "Charotar Golden Tobacco Plain",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Amul Dairy Pastures",
      "Tobacco",
      "Banana"
    ],
    "polygonCoords": [
      [
        22.5995,
        72.8939
      ],
      [
        22.5995,
        72.9639
      ],
      [
        22.5295,
        72.9639
      ],
      [
        22.5295,
        72.8939
      ]
    ]
  },
  {
    "id": "gujarat_kutch_166",
    "name": "Kutch Bhuj Salt Plains",
    "state": "Gujarat",
    "district": "Kutch",
    "isUrban": false,
    "regionalName": "કચ્છ ભુજ ખારેક",
    "lat": 23.242,
    "lng": 69.6669,
    "elevationM": 110,
    "terrainType": "Great Rann White Desert Edge",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Kutch Dates (Karek GI)",
      "Castor",
      "Cotton"
    ],
    "polygonCoords": [
      [
        23.287,
        69.6219
      ],
      [
        23.287,
        69.7119
      ],
      [
        23.197,
        69.7119
      ],
      [
        23.197,
        69.6219
      ]
    ]
  },
  {
    "id": "gujarat_bharuch_167",
    "name": "Bharuch Narmada Estuary",
    "state": "Gujarat",
    "district": "Bharuch",
    "isUrban": true,
    "regionalName": "ભરૂચ",
    "lat": 21.7051,
    "lng": 72.9959,
    "elevationM": 15,
    "terrainType": "Narmada River Mouth",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cotton",
      "Sugarcane",
      "Chemical Industry Buffer"
    ],
    "polygonCoords": [
      [
        21.7401,
        72.9609
      ],
      [
        21.7401,
        73.0309
      ],
      [
        21.6701,
        73.0309
      ],
      [
        21.6701,
        72.9609
      ]
    ]
  },
  {
    "id": "gujarat_mehsana_168",
    "name": "Mehsana Dairy & Spices",
    "state": "Gujarat",
    "district": "Mehsana",
    "isUrban": true,
    "regionalName": "મહેસાણા વરિયાળી",
    "lat": 23.588,
    "lng": 72.3693,
    "elevationM": 81,
    "terrainType": "North Gujarat Semi-Arid Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Fennel (Variyali)",
      "Cumin",
      "Isabgol"
    ],
    "polygonCoords": [
      [
        23.623,
        72.3343
      ],
      [
        23.623,
        72.4043
      ],
      [
        23.553,
        72.4043
      ],
      [
        23.553,
        72.3343
      ]
    ]
  },
  {
    "id": "gujarat_navsari_169",
    "name": "Navsari Sugar & Mango",
    "state": "Gujarat",
    "district": "Navsari",
    "isUrban": false,
    "regionalName": "નવસારી",
    "lat": 20.9467,
    "lng": 72.952,
    "elevationM": 12,
    "terrainType": "Purna Coastal Floodplain",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Alphonso Mango",
      "Sugarcane",
      "Chiku"
    ],
    "polygonCoords": [
      [
        20.9917,
        72.907
      ],
      [
        20.9917,
        72.997
      ],
      [
        20.9017,
        72.997
      ],
      [
        20.9017,
        72.907
      ]
    ]
  },
  {
    "id": "gujarat_valsad_170",
    "name": "Valsad Hapus Orchard",
    "state": "Gujarat",
    "district": "Valsad",
    "isUrban": false,
    "regionalName": "વલસાડ હાફૂસ",
    "lat": 20.5992,
    "lng": 72.9342,
    "elevationM": 16,
    "terrainType": "Daman Ganga Basin",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Valsad Alphonso Mango",
      "Chiku",
      "Rice"
    ],
    "polygonCoords": [
      [
        20.6442,
        72.8892
      ],
      [
        20.6442,
        72.9792
      ],
      [
        20.5542,
        72.9792
      ],
      [
        20.5542,
        72.8892
      ]
    ]
  },
  {
    "id": "gujarat_patan_171",
    "name": "Patan Patola & Cumin",
    "state": "Gujarat",
    "district": "Patan",
    "isUrban": false,
    "regionalName": "પાટણ",
    "lat": 23.8493,
    "lng": 72.1266,
    "elevationM": 76,
    "terrainType": "Saraswati Semi-Dry Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cumin (Jeera)",
      "Castor",
      "Mustard"
    ],
    "polygonCoords": [
      [
        23.8943,
        72.0816
      ],
      [
        23.8943,
        72.1716
      ],
      [
        23.8043,
        72.1716
      ],
      [
        23.8043,
        72.0816
      ]
    ]
  },
  {
    "id": "gujarat_surendranagar_172",
    "name": "Surendranagar Cotton Bowl",
    "state": "Gujarat",
    "district": "Surendranagar",
    "isUrban": false,
    "regionalName": "સુરેન્દ્રનગર કપાસ",
    "lat": 22.7279,
    "lng": 71.637,
    "elevationM": 98,
    "terrainType": "Zalawad Cotton Plains",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Shankar Cotton",
      "Sesame",
      "Cumin"
    ],
    "polygonCoords": [
      [
        22.7729,
        71.592
      ],
      [
        22.7729,
        71.682
      ],
      [
        22.6829,
        71.682
      ],
      [
        22.6829,
        71.592
      ]
    ]
  },
  {
    "id": "gujarat_morbi_173",
    "name": "Morbi Ceramic Basin",
    "state": "Gujarat",
    "district": "Morbi",
    "isUrban": true,
    "regionalName": "મોરબી",
    "lat": 22.812,
    "lng": 70.8377,
    "elevationM": 54,
    "terrainType": "Machchhu River Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cotton",
      "Groundnut",
      "Ceramic Buffers"
    ],
    "polygonCoords": [
      [
        22.847,
        70.8027
      ],
      [
        22.847,
        70.8727
      ],
      [
        22.777,
        70.8727
      ],
      [
        22.777,
        70.8027
      ]
    ]
  },
  {
    "id": "gujarat_amreli_174",
    "name": "Amreli Groundnut Tract",
    "state": "Gujarat",
    "district": "Amreli",
    "isUrban": false,
    "regionalName": "અમરેલી મગફળી",
    "lat": 21.6032,
    "lng": 71.2221,
    "elevationM": 128,
    "terrainType": "Shetrunji River Catchment",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Groundnut",
      "Sesame",
      "Cotton"
    ],
    "polygonCoords": [
      [
        21.6482,
        71.1771
      ],
      [
        21.6482,
        71.2671
      ],
      [
        21.5582,
        71.2671
      ],
      [
        21.5582,
        71.1771
      ]
    ]
  },
  {
    "id": "gujarat_porbandar_175",
    "name": "Porbandar Marine Coast",
    "state": "Gujarat",
    "district": "Porbandar",
    "isUrban": true,
    "regionalName": "પોરબંદર",
    "lat": 21.6417,
    "lng": 69.6293,
    "elevationM": 5,
    "terrainType": "Arabian Sea Coastline",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Groundnut",
      "Chalk Mining Buffer",
      "Fisheries"
    ],
    "polygonCoords": [
      [
        21.6767,
        69.5943
      ],
      [
        21.6767,
        69.6643
      ],
      [
        21.6067,
        69.6643
      ],
      [
        21.6067,
        69.5943
      ]
    ]
  },
  {
    "id": "gujarat_girsomnath_176",
    "name": "Gir Somnath Coastal Temple",
    "state": "Gujarat",
    "district": "Gir Somnath",
    "isUrban": false,
    "regionalName": "ગીર સોમનાથ",
    "lat": 20.9042,
    "lng": 70.367,
    "elevationM": 13,
    "terrainType": "Hiran River Coastal Basin",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Kesar Mango",
      "Groundnut",
      "Coconut"
    ],
    "polygonCoords": [
      [
        20.9492,
        70.322
      ],
      [
        20.9492,
        70.412
      ],
      [
        20.8592,
        70.412
      ],
      [
        20.8592,
        70.322
      ]
    ]
  },
  {
    "id": "gujarat_banaskantha_177",
    "name": "Banaskantha Potato Hub",
    "state": "Gujarat",
    "district": "Banaskantha",
    "isUrban": false,
    "regionalName": "બનાસકાંઠા બટાકા",
    "lat": 24.1724,
    "lng": 72.4346,
    "elevationM": 252,
    "terrainType": "Aravalli Foot-Slope Plains",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Processing Potato (Deesa Hub)",
      "Pomegranate",
      "Dairy"
    ],
    "polygonCoords": [
      [
        24.2174,
        72.3896
      ],
      [
        24.2174,
        72.4796
      ],
      [
        24.1274,
        72.4796
      ],
      [
        24.1274,
        72.3896
      ]
    ]
  },
  {
    "id": "gujarat_sabarkantha_178",
    "name": "Sabarkantha Agro Basin",
    "state": "Gujarat",
    "district": "Sabarkantha",
    "isUrban": false,
    "regionalName": "સાબરકાંઠા",
    "lat": 23.5977,
    "lng": 72.9698,
    "elevationM": 127,
    "terrainType": "Hathmati Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Groundnut",
      "Cotton",
      "Wheat"
    ],
    "polygonCoords": [
      [
        23.6427,
        72.9248
      ],
      [
        23.6427,
        73.0148
      ],
      [
        23.5527,
        73.0148
      ],
      [
        23.5527,
        72.9248
      ]
    ]
  },
  {
    "id": "gujarat_kheda_179",
    "name": "Kheda Charotar Plains",
    "state": "Gujarat",
    "district": "Kheda",
    "isUrban": false,
    "regionalName": "ખેડા",
    "lat": 22.7533,
    "lng": 72.6867,
    "elevationM": 42,
    "terrainType": "Vatrak-Shedhi Doab",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Tobacco",
      "Rice",
      "Banana"
    ],
    "polygonCoords": [
      [
        22.7983,
        72.6417
      ],
      [
        22.7983,
        72.7317
      ],
      [
        22.7083,
        72.7317
      ],
      [
        22.7083,
        72.6417
      ]
    ]
  },
  {
    "id": "gujarat_panchmahal_180",
    "name": "Panchmahal Agro Tract",
    "state": "Gujarat",
    "district": "Panchmahal",
    "isUrban": false,
    "regionalName": "પંચમહાલ",
    "lat": 22.7758,
    "lng": 73.6149,
    "elevationM": 119,
    "terrainType": "Mahi Foothill Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Maize",
      "Paddy",
      "Pulses"
    ],
    "polygonCoords": [
      [
        22.8208,
        73.5699
      ],
      [
        22.8208,
        73.6599
      ],
      [
        22.7308,
        73.6599
      ],
      [
        22.7308,
        73.5699
      ]
    ]
  },
  {
    "id": "gujarat_dahod_181",
    "name": "Dahod Tribal Plateau",
    "state": "Gujarat",
    "district": "Dahod",
    "isUrban": false,
    "regionalName": "દાહોદ",
    "lat": 22.8375,
    "lng": 74.253,
    "elevationM": 279,
    "terrainType": "Undulating Tribal Uplands",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Maize",
      "Gram",
      "Soybean"
    ],
    "polygonCoords": [
      [
        22.8825,
        74.208
      ],
      [
        22.8825,
        74.298
      ],
      [
        22.7925,
        74.298
      ],
      [
        22.7925,
        74.208
      ]
    ]
  },
  {
    "id": "gujarat_botad_182",
    "name": "Botad Cotton Hub",
    "state": "Gujarat",
    "district": "Botad",
    "isUrban": false,
    "regionalName": "બોટાદ",
    "lat": 22.1704,
    "lng": 71.6664,
    "elevationM": 70,
    "terrainType": "Bhadar River Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cotton",
      "Groundnut",
      "Guava"
    ],
    "polygonCoords": [
      [
        22.2154,
        71.6214
      ],
      [
        22.2154,
        71.7114
      ],
      [
        22.1254,
        71.7114
      ],
      [
        22.1254,
        71.6214
      ]
    ]
  },
  {
    "id": "gujarat_devbhumidwarka_183",
    "name": "Devbhumi Dwarka Coast",
    "state": "Gujarat",
    "district": "Devbhumi Dwarka",
    "isUrban": false,
    "regionalName": "દેવભૂમિ દ્વારકા",
    "lat": 22.2394,
    "lng": 68.9678,
    "elevationM": 9,
    "terrainType": "Okhamandal Peninsula",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Groundnut",
      "Castor",
      "Marine Salt"
    ],
    "polygonCoords": [
      [
        22.2844,
        68.9228
      ],
      [
        22.2844,
        69.0128
      ],
      [
        22.1944,
        69.0128
      ],
      [
        22.1944,
        68.9228
      ]
    ]
  },
  {
    "id": "gujarat_aravalli_184",
    "name": "Aravalli Modasa Plain",
    "state": "Gujarat",
    "district": "Aravalli",
    "isUrban": false,
    "regionalName": "અરવલ્લી",
    "lat": 23.4632,
    "lng": 73.3006,
    "elevationM": 197,
    "terrainType": "Mazum Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Wheat",
      "Groundnut",
      "Castor"
    ],
    "polygonCoords": [
      [
        23.5082,
        73.2556
      ],
      [
        23.5082,
        73.3456
      ],
      [
        23.4182,
        73.3456
      ],
      [
        23.4182,
        73.2556
      ]
    ]
  },
  {
    "id": "gujarat_mahisagar_185",
    "name": "Mahisagar Kadana Basin",
    "state": "Gujarat",
    "district": "Mahisagar",
    "isUrban": false,
    "regionalName": "મહીસાગર",
    "lat": 23.167,
    "lng": 73.6333,
    "elevationM": 140,
    "terrainType": "Kadana Dam Downstream",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Maize",
      "Sugarcane"
    ],
    "polygonCoords": [
      [
        23.212,
        73.5883
      ],
      [
        23.212,
        73.6783
      ],
      [
        23.122,
        73.6783
      ],
      [
        23.122,
        73.5883
      ]
    ]
  },
  {
    "id": "gujarat_chhotaudaipur_186",
    "name": "Chhota Udaipur Tribal Basin",
    "state": "Gujarat",
    "district": "Chhota Udaipur",
    "isUrban": false,
    "regionalName": "છોટા ઉદેપુર",
    "lat": 22.3045,
    "lng": 74.013,
    "elevationM": 145,
    "terrainType": "Orsang River Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cotton",
      "Maize",
      "Dolomite Buffer"
    ],
    "polygonCoords": [
      [
        22.3495,
        73.968
      ],
      [
        22.3495,
        74.058
      ],
      [
        22.2595,
        74.058
      ],
      [
        22.2595,
        73.968
      ]
    ]
  },
  {
    "id": "gujarat_narmada_187",
    "name": "Narmada Rajpipla Valley",
    "state": "Gujarat",
    "district": "Narmada",
    "isUrban": false,
    "regionalName": "નર્મદા રાજપીપળા",
    "lat": 21.7917,
    "lng": 73.5042,
    "elevationM": 68,
    "terrainType": "Statue of Unity Narmada Valley",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Banana",
      "Sugarcane",
      "Cotton"
    ],
    "polygonCoords": [
      [
        21.8367,
        73.4592
      ],
      [
        21.8367,
        73.5492
      ],
      [
        21.7467,
        73.5492
      ],
      [
        21.7467,
        73.4592
      ]
    ]
  },
  {
    "id": "gujarat_tapi_188",
    "name": "Tapi Vyara Basin",
    "state": "Gujarat",
    "district": "Tapi",
    "isUrban": false,
    "regionalName": "તાપી વ્યારા",
    "lat": 21.1167,
    "lng": 73.4,
    "elevationM": 98,
    "terrainType": "Tapi River Southern Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sugarcane",
      "Paddy",
      "Mango"
    ],
    "polygonCoords": [
      [
        21.1617,
        73.355
      ],
      [
        21.1617,
        73.445
      ],
      [
        21.0717,
        73.445
      ],
      [
        21.0717,
        73.355
      ]
    ]
  },
  {
    "id": "gujarat_dang_189",
    "name": "Dang Saputara Rainforest",
    "state": "Gujarat",
    "district": "Dang",
    "isUrban": false,
    "regionalName": "ડાંગ સાપુતારા",
    "lat": 20.825,
    "lng": 73.7083,
    "elevationM": 875,
    "terrainType": "Western Ghats High Rainforest",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Finger Millet (Ragi/Nagli)",
      "Vari Rice",
      "Teak"
    ],
    "polygonCoords": [
      [
        20.87,
        73.6633
      ],
      [
        20.87,
        73.7533
      ],
      [
        20.78,
        73.7533
      ],
      [
        20.78,
        73.6633
      ]
    ]
  },
  {
    "id": "rajasthan_jaipur_190",
    "name": "Jaipur Pink City Metro",
    "state": "Rajasthan",
    "district": "Jaipur",
    "isUrban": true,
    "regionalName": "जयपुर महानगर",
    "lat": 26.9124,
    "lng": 75.7873,
    "elevationM": 431,
    "terrainType": "Aravalli Valley Semiarid Plain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Urban Heat Island Mitigation",
      "Peri-Urban Coriander",
      "Rose Water"
    ],
    "polygonCoords": [
      [
        26.9474,
        75.7523
      ],
      [
        26.9474,
        75.8223
      ],
      [
        26.8774,
        75.8223
      ],
      [
        26.8774,
        75.7523
      ]
    ]
  },
  {
    "id": "rajasthan_jodhpur_191",
    "name": "Jodhpur Sun City Marwar",
    "state": "Rajasthan",
    "district": "Jodhpur",
    "isUrban": true,
    "regionalName": "जोधपुर मारवाड़",
    "lat": 26.2389,
    "lng": 73.0243,
    "elevationM": 231,
    "terrainType": "Thar Desert Sandy Fringe",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Pearl Millet (Bajra)",
      "Cumin (Jeera)",
      "Cluster Bean (Guar)"
    ],
    "polygonCoords": [
      [
        26.2739,
        72.9893
      ],
      [
        26.2739,
        73.0593
      ],
      [
        26.2039,
        73.0593
      ],
      [
        26.2039,
        72.9893
      ]
    ]
  },
  {
    "id": "rajasthan_kota_192",
    "name": "Kota Chambal Agro Hub",
    "state": "Rajasthan",
    "district": "Kota",
    "isUrban": true,
    "regionalName": "कोटा चंबल कछार",
    "lat": 25.2138,
    "lng": 75.8648,
    "elevationM": 271,
    "terrainType": "Chambal Ravine Irrigated Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Soybean",
      "Mustard",
      "Kota Doria Cotton"
    ],
    "polygonCoords": [
      [
        25.2488,
        75.8298
      ],
      [
        25.2488,
        75.8998
      ],
      [
        25.1788,
        75.8998
      ],
      [
        25.1788,
        75.8298
      ]
    ]
  },
  {
    "id": "rajasthan_udaipur_193",
    "name": "Udaipur Lake Valley",
    "state": "Rajasthan",
    "district": "Udaipur",
    "isUrban": true,
    "regionalName": "उदयपुर मेवाड़",
    "lat": 24.5854,
    "lng": 73.7125,
    "elevationM": 598,
    "terrainType": "Girwa Intermontane Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Maize",
      "Wheat",
      "Amla / Aloe Vera"
    ],
    "polygonCoords": [
      [
        24.6204,
        73.6775
      ],
      [
        24.6204,
        73.7475
      ],
      [
        24.5504,
        73.7475
      ],
      [
        24.5504,
        73.6775
      ]
    ]
  },
  {
    "id": "rajasthan_bikaner_194",
    "name": "Bikaner Thar Oasis",
    "state": "Rajasthan",
    "district": "Bikaner",
    "isUrban": true,
    "regionalName": "बीकानेर",
    "lat": 28.0229,
    "lng": 73.3119,
    "elevationM": 242,
    "terrainType": "Hyper-Arid Sand Dunes",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Moth Bean (Bikaneri Bhujia)",
      "Guar",
      "Groundnut (IGNP)"
    ],
    "polygonCoords": [
      [
        28.0579,
        73.2769
      ],
      [
        28.0579,
        73.3469
      ],
      [
        27.9879,
        73.3469
      ],
      [
        27.9879,
        73.2769
      ]
    ]
  },
  {
    "id": "rajasthan_ajmer_195",
    "name": "Ajmer Dargah Basin",
    "state": "Rajasthan",
    "district": "Ajmer",
    "isUrban": true,
    "regionalName": "अजमेर पुष्कर",
    "lat": 26.4499,
    "lng": 74.6399,
    "elevationM": 486,
    "terrainType": "Aravalli Wind Gap Valley",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Pushkar Rose (Gulkand)",
      "Barley",
      "Jowar"
    ],
    "polygonCoords": [
      [
        26.4849,
        74.6049
      ],
      [
        26.4849,
        74.6749
      ],
      [
        26.4149,
        74.6749
      ],
      [
        26.4149,
        74.6049
      ]
    ]
  },
  {
    "id": "rajasthan_bhilwara_196",
    "name": "Bhilwara Textile Basin",
    "state": "Rajasthan",
    "district": "Bhilwara",
    "isUrban": true,
    "regionalName": "भीलवाड़ा वस्त्र नगरी",
    "lat": 25.3407,
    "lng": 74.6313,
    "elevationM": 421,
    "terrainType": "Banas River Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Maize",
      "Cotton",
      "Mustard"
    ],
    "polygonCoords": [
      [
        25.3757,
        74.5963
      ],
      [
        25.3757,
        74.6663
      ],
      [
        25.3057,
        74.6663
      ],
      [
        25.3057,
        74.5963
      ]
    ]
  },
  {
    "id": "rajasthan_alwar_197",
    "name": "Alwar Mustard Capital",
    "state": "Rajasthan",
    "district": "Alwar",
    "isUrban": false,
    "regionalName": "अलवर सरसों",
    "lat": 27.553,
    "lng": 76.6346,
    "elevationM": 271,
    "terrainType": "Mewat Aravalli Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Yellow & Black Mustard (Sarson)",
      "Wheat",
      "Onion"
    ],
    "polygonCoords": [
      [
        27.598,
        76.5896
      ],
      [
        27.598,
        76.6796
      ],
      [
        27.508,
        76.6796
      ],
      [
        27.508,
        76.5896
      ]
    ]
  },
  {
    "id": "rajasthan_bharatpur_198",
    "name": "Bharatpur Wetland Basin",
    "state": "Rajasthan",
    "district": "Bharatpur",
    "isUrban": false,
    "regionalName": "भरतपुर",
    "lat": 27.2152,
    "lng": 77.503,
    "elevationM": 183,
    "terrainType": "Banganga Wetland Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Mustard (Asia's Big Market)",
      "Paddy",
      "Wheat"
    ],
    "polygonCoords": [
      [
        27.2602,
        77.458
      ],
      [
        27.2602,
        77.548
      ],
      [
        27.1702,
        77.548
      ],
      [
        27.1702,
        77.458
      ]
    ]
  },
  {
    "id": "rajasthan_sikar_199",
    "name": "Sikar Shekhawati Basin",
    "state": "Rajasthan",
    "district": "Sikar",
    "isUrban": true,
    "regionalName": "सीकर शेखावाटी",
    "lat": 27.6094,
    "lng": 75.1398,
    "elevationM": 427,
    "terrainType": "Kantle River Semi-Desert Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Pearl Millet",
      "Gram",
      "Onion"
    ],
    "polygonCoords": [
      [
        27.6444,
        75.1048
      ],
      [
        27.6444,
        75.1748
      ],
      [
        27.5744,
        75.1748
      ],
      [
        27.5744,
        75.1048
      ]
    ]
  },
  {
    "id": "rajasthan_pali_200",
    "name": "Pali Henna Capital",
    "state": "Rajasthan",
    "district": "Pali",
    "isUrban": false,
    "regionalName": "पाली सोजत मेहंदी",
    "lat": 25.7711,
    "lng": 73.3234,
    "elevationM": 214,
    "terrainType": "Bandi River Marwar Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sojat Mehandi / Henna (GI)",
      "Sesame",
      "Mustard"
    ],
    "polygonCoords": [
      [
        25.8161,
        73.2784
      ],
      [
        25.8161,
        73.3684
      ],
      [
        25.7261,
        73.3684
      ],
      [
        25.7261,
        73.2784
      ]
    ]
  },
  {
    "id": "rajasthan_sriganganagar_201",
    "name": "Sri Ganganagar Canal Granary",
    "state": "Rajasthan",
    "district": "Sri Ganganagar",
    "isUrban": false,
    "regionalName": "श्रीगंगानगर किन्नू",
    "lat": 29.9038,
    "lng": 73.8772,
    "elevationM": 178,
    "terrainType": "Indira Gandhi Canal Green Belt",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Kinnow Mandarin (GI)",
      "Cotton",
      "Wheat"
    ],
    "polygonCoords": [
      [
        29.9488,
        73.8322
      ],
      [
        29.9488,
        73.9222
      ],
      [
        29.8588,
        73.9222
      ],
      [
        29.8588,
        73.8322
      ]
    ]
  },
  {
    "id": "rajasthan_barmer_202",
    "name": "Barmer Thar Desert Core",
    "state": "Rajasthan",
    "district": "Barmer",
    "isUrban": false,
    "regionalName": "बाड़मेर ईसबगोल",
    "lat": 25.7521,
    "lng": 71.3967,
    "elevationM": 180,
    "terrainType": "Sandy Deep Desert",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Isabgol (Psyllium Husk)",
      "Cumin",
      "Castor"
    ],
    "polygonCoords": [
      [
        25.7971,
        71.3517
      ],
      [
        25.7971,
        71.4417
      ],
      [
        25.7071,
        71.4417
      ],
      [
        25.7071,
        71.3517
      ]
    ]
  },
  {
    "id": "rajasthan_jaisalmer_203",
    "name": "Jaisalmer Golden Dunes",
    "state": "Rajasthan",
    "district": "Jaisalmer",
    "isUrban": false,
    "regionalName": "जैसलमेर स्वर्ण नगरी",
    "lat": 26.9157,
    "lng": 70.9083,
    "elevationM": 225,
    "terrainType": "Deep Thar Desert Sand Dune Erg",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cluster Bean",
      "Desi Bajra",
      "Desert Solar Buffer"
    ],
    "polygonCoords": [
      [
        26.9607,
        70.8633
      ],
      [
        26.9607,
        70.9533
      ],
      [
        26.8707,
        70.9533
      ],
      [
        26.8707,
        70.8633
      ]
    ]
  },
  {
    "id": "rajasthan_nagaur_204",
    "name": "Nagaur Fenugreek Hub",
    "state": "Rajasthan",
    "district": "Nagaur",
    "isUrban": false,
    "regionalName": "नागौर कसूरी मेथी",
    "lat": 27.2021,
    "lng": 73.7439,
    "elevationM": 302,
    "terrainType": "Semi-Arid Marwar Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Nagauri Kasuri Methi (GI)",
      "Cumin",
      "Moong"
    ],
    "polygonCoords": [
      [
        27.2471,
        73.6989
      ],
      [
        27.2471,
        73.7889
      ],
      [
        27.1571,
        73.7889
      ],
      [
        27.1571,
        73.6989
      ]
    ]
  },
  {
    "id": "rajasthan_jhunjhunu_205",
    "name": "Jhunjhunu Copper Belt",
    "state": "Rajasthan",
    "district": "Jhunjhunu",
    "isUrban": false,
    "regionalName": "झुंझुनूं",
    "lat": 28.1289,
    "lng": 75.3995,
    "elevationM": 318,
    "terrainType": "Northern Shekhawati Sand Plains",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Bajra",
      "Mustard",
      "Wheat"
    ],
    "polygonCoords": [
      [
        28.1739,
        75.3545
      ],
      [
        28.1739,
        75.4445
      ],
      [
        28.0839,
        75.4445
      ],
      [
        28.0839,
        75.3545
      ]
    ]
  },
  {
    "id": "rajasthan_churu_206",
    "name": "Churu Thar Gateway",
    "state": "Rajasthan",
    "district": "Churu",
    "isUrban": false,
    "regionalName": "चूरू",
    "lat": 28.29,
    "lng": 74.96,
    "elevationM": 286,
    "terrainType": "Extreme Temperature Desert Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Moth",
      "Bajra",
      "Guar"
    ],
    "polygonCoords": [
      [
        28.335,
        74.915
      ],
      [
        28.335,
        75.005
      ],
      [
        28.245,
        75.005
      ],
      [
        28.245,
        74.915
      ]
    ]
  },
  {
    "id": "rajasthan_chittorgarh_207",
    "name": "Chittorgarh Fort Valley",
    "state": "Rajasthan",
    "district": "Chittorgarh",
    "isUrban": false,
    "regionalName": "चित्तौड़गढ़",
    "lat": 24.8887,
    "lng": 74.6269,
    "elevationM": 394,
    "terrainType": "Berach-Gambhiri Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Opium Poppy",
      "Maize",
      "Mustard"
    ],
    "polygonCoords": [
      [
        24.9337,
        74.5819
      ],
      [
        24.9337,
        74.6719
      ],
      [
        24.8437,
        74.6719
      ],
      [
        24.8437,
        74.5819
      ]
    ]
  },
  {
    "id": "rajasthan_tonk_208",
    "name": "Tonk Nawab Melon Basin",
    "state": "Rajasthan",
    "district": "Tonk",
    "isUrban": false,
    "regionalName": "टोंक",
    "lat": 26.1667,
    "lng": 75.7833,
    "elevationM": 289,
    "terrainType": "Banas River Floodplain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Watermelon / Muskmelon",
      "Mustard",
      "Guava"
    ],
    "polygonCoords": [
      [
        26.2117,
        75.7383
      ],
      [
        26.2117,
        75.8283
      ],
      [
        26.1217,
        75.8283
      ],
      [
        26.1217,
        75.7383
      ]
    ]
  },
  {
    "id": "rajasthan_banswara_209",
    "name": "Banswara 100 Islands Basin",
    "state": "Rajasthan",
    "district": "Banswara",
    "isUrban": false,
    "regionalName": "बांसवाड़ा माही",
    "lat": 23.5461,
    "lng": 74.4373,
    "elevationM": 302,
    "terrainType": "Mahi River Tribal Archipelago",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Maize",
      "Wheat",
      "Soybean"
    ],
    "polygonCoords": [
      [
        23.5911,
        74.3923
      ],
      [
        23.5911,
        74.4823
      ],
      [
        23.5011,
        74.4823
      ],
      [
        23.5011,
        74.3923
      ]
    ]
  },
  {
    "id": "rajasthan_bundi_210",
    "name": "Bundi Rice & Ravines",
    "state": "Rajasthan",
    "district": "Bundi",
    "isUrban": false,
    "regionalName": "बूंदी बासमती",
    "lat": 25.4415,
    "lng": 75.6441,
    "elevationM": 268,
    "terrainType": "Chambal Left Canal Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Basmati Rice",
      "Mustard",
      "Soybean"
    ],
    "polygonCoords": [
      [
        25.4865,
        75.5991
      ],
      [
        25.4865,
        75.6891
      ],
      [
        25.3965,
        75.6891
      ],
      [
        25.3965,
        75.5991
      ]
    ]
  },
  {
    "id": "rajasthan_dausa_211",
    "name": "Dausa Aravalli Gap",
    "state": "Rajasthan",
    "district": "Dausa",
    "isUrban": false,
    "regionalName": "दौसा",
    "lat": 26.8928,
    "lng": 76.3375,
    "elevationM": 333,
    "terrainType": "Banganga Catchment",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Mustard",
      "Wheat",
      "Bajra"
    ],
    "polygonCoords": [
      [
        26.9378,
        76.2925
      ],
      [
        26.9378,
        76.3825
      ],
      [
        26.8478,
        76.3825
      ],
      [
        26.8478,
        76.2925
      ]
    ]
  },
  {
    "id": "rajasthan_dholpur_212",
    "name": "Dholpur Chambal Ravines",
    "state": "Rajasthan",
    "district": "Dholpur",
    "isUrban": false,
    "regionalName": "धौलपुर",
    "lat": 26.7025,
    "lng": 77.8934,
    "elevationM": 177,
    "terrainType": "Chambal Badland Ravines",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Mustard",
      "Potato",
      "Bajra"
    ],
    "polygonCoords": [
      [
        26.7475,
        77.8484
      ],
      [
        26.7475,
        77.9384
      ],
      [
        26.6575,
        77.9384
      ],
      [
        26.6575,
        77.8484
      ]
    ]
  },
  {
    "id": "rajasthan_dungarpur_213",
    "name": "Dungarpur Tribal Hills",
    "state": "Rajasthan",
    "district": "Dungarpur",
    "isUrban": false,
    "regionalName": "डूंगरपुर",
    "lat": 23.8431,
    "lng": 73.7147,
    "elevationM": 380,
    "terrainType": "Vagad Aravalli Hills",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Maize",
      "Gram",
      "Wheat"
    ],
    "polygonCoords": [
      [
        23.8881,
        73.6697
      ],
      [
        23.8881,
        73.7597
      ],
      [
        23.7981,
        73.7597
      ],
      [
        23.7981,
        73.6697
      ]
    ]
  },
  {
    "id": "rajasthan_hanumangarh_214",
    "name": "Hanumangarh IGNP Plain",
    "state": "Rajasthan",
    "district": "Hanumangarh",
    "isUrban": false,
    "regionalName": "हनुमानगढ़",
    "lat": 29.5817,
    "lng": 74.3294,
    "elevationM": 177,
    "terrainType": "Ghaggar Depression & IGNP Canal",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Cotton",
      "Wheat"
    ],
    "polygonCoords": [
      [
        29.6267,
        74.2844
      ],
      [
        29.6267,
        74.3744
      ],
      [
        29.5367,
        74.3744
      ],
      [
        29.5367,
        74.2844
      ]
    ]
  },
  {
    "id": "rajasthan_jalore_215",
    "name": "Jalore Granite & Isabgol",
    "state": "Rajasthan",
    "district": "Jalore",
    "isUrban": false,
    "regionalName": "जालोर",
    "lat": 25.3444,
    "lng": 72.6156,
    "elevationM": 178,
    "terrainType": "Sukri River Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Isabgol",
      "Cumin",
      "Castor"
    ],
    "polygonCoords": [
      [
        25.3894,
        72.5706
      ],
      [
        25.3894,
        72.6606
      ],
      [
        25.2994,
        72.6606
      ],
      [
        25.2994,
        72.5706
      ]
    ]
  },
  {
    "id": "rajasthan_jhalawar_216",
    "name": "Jhalawar Orange Capital",
    "state": "Rajasthan",
    "district": "Jhalawar",
    "isUrban": false,
    "regionalName": "झालावाड़ संतरा",
    "lat": 24.5973,
    "lng": 76.161,
    "elevationM": 312,
    "terrainType": "Hadoti Black Soil Plateau",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Nagpur Mandarin Orange",
      "Soybean",
      "Coriander"
    ],
    "polygonCoords": [
      [
        24.6423,
        76.116
      ],
      [
        24.6423,
        76.206
      ],
      [
        24.5523,
        76.206
      ],
      [
        24.5523,
        76.116
      ]
    ]
  },
  {
    "id": "rajasthan_karauli_217",
    "name": "Karauli Red Sandstone",
    "state": "Rajasthan",
    "district": "Karauli",
    "isUrban": false,
    "regionalName": "करौली",
    "lat": 26.4947,
    "lng": 77.0203,
    "elevationM": 275,
    "terrainType": "Chambal Tributary Uplands",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Bajra",
      "Mustard",
      "Sesame"
    ],
    "polygonCoords": [
      [
        26.5397,
        76.9753
      ],
      [
        26.5397,
        77.0653
      ],
      [
        26.4497,
        77.0653
      ],
      [
        26.4497,
        76.9753
      ]
    ]
  },
  {
    "id": "rajasthan_pratapgarh_218",
    "name": "Pratapgarh Tribal Highlands",
    "state": "Rajasthan",
    "district": "Pratapgarh",
    "isUrban": false,
    "regionalName": "प्रतापगढ़",
    "lat": 24.0322,
    "lng": 74.7811,
    "elevationM": 491,
    "terrainType": "Jakham River Forest Hills",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Opium Poppy",
      "Maize",
      "Soybean"
    ],
    "polygonCoords": [
      [
        24.0772,
        74.7361
      ],
      [
        24.0772,
        74.8261
      ],
      [
        23.9872,
        74.8261
      ],
      [
        23.9872,
        74.7361
      ]
    ]
  },
  {
    "id": "rajasthan_rajsamand_219",
    "name": "Rajsamand Marble Valley",
    "state": "Rajasthan",
    "district": "Rajsamand",
    "isUrban": false,
    "regionalName": "राजसमंद",
    "lat": 25.0441,
    "lng": 73.8825,
    "elevationM": 547,
    "terrainType": "Gomti Lake Intermontane",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Maize",
      "Barley",
      "Wheat"
    ],
    "polygonCoords": [
      [
        25.0891,
        73.8375
      ],
      [
        25.0891,
        73.9275
      ],
      [
        24.9991,
        73.9275
      ],
      [
        24.9991,
        73.8375
      ]
    ]
  },
  {
    "id": "rajasthan_sawaimadhopur_220",
    "name": "Sawai Madhopur Ranthambore",
    "state": "Rajasthan",
    "district": "Sawai Madhopur",
    "isUrban": false,
    "regionalName": "सवाई माधोपुर अमरूद",
    "lat": 25.9928,
    "lng": 76.3713,
    "elevationM": 257,
    "terrainType": "Ranthambore Tiger Forest Edge",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Guava (Sawai Madhopur GI)",
      "Mustard"
    ],
    "polygonCoords": [
      [
        26.0378,
        76.3263
      ],
      [
        26.0378,
        76.4163
      ],
      [
        25.9478,
        76.4163
      ],
      [
        25.9478,
        76.3263
      ]
    ]
  },
  {
    "id": "rajasthan_sirohi_221",
    "name": "Sirohi Mount Abu Foothill",
    "state": "Rajasthan",
    "district": "Sirohi",
    "isUrban": false,
    "regionalName": "सिरोही माउंट आबू",
    "lat": 24.8853,
    "lng": 72.8625,
    "elevationM": 321,
    "terrainType": "Western Aravalli Foot-Slopes",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Fennel",
      "Castor",
      "Sesame"
    ],
    "polygonCoords": [
      [
        24.9303,
        72.8175
      ],
      [
        24.9303,
        72.9075
      ],
      [
        24.8403,
        72.9075
      ],
      [
        24.8403,
        72.8175
      ]
    ]
  },
  {
    "id": "kerala_thiruvananthapuram_222",
    "name": "Thiruvananthapuram Capital",
    "state": "Kerala",
    "district": "Thiruvananthapuram",
    "isUrban": true,
    "regionalName": "തിരുവനന്തപുരം",
    "lat": 8.5241,
    "lng": 76.9366,
    "elevationM": 16,
    "terrainType": "Coastal Undulating Terraces",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Urban Heat Island Buffer",
      "Coconut",
      "Tapioca"
    ],
    "polygonCoords": [
      [
        8.5591,
        76.9016
      ],
      [
        8.5591,
        76.9716
      ],
      [
        8.4891,
        76.9716
      ],
      [
        8.4891,
        76.9016
      ]
    ]
  },
  {
    "id": "kerala_ernakulam_223",
    "name": "Kochi Marine Metro",
    "state": "Kerala",
    "district": "Ernakulam",
    "isUrban": true,
    "regionalName": "കൊച്ചി മെട്രോ",
    "lat": 9.9312,
    "lng": 76.2673,
    "elevationM": 4,
    "terrainType": "Vembanad Estuarine Island Basin",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Pokkali Saline Rice (GI)",
      "Nutmeg",
      "Pineapple"
    ],
    "polygonCoords": [
      [
        9.9662,
        76.2323
      ],
      [
        9.9662,
        76.3023
      ],
      [
        9.8962,
        76.3023
      ],
      [
        9.8962,
        76.2323
      ]
    ]
  },
  {
    "id": "kerala_kozhikode_224",
    "name": "Kozhikode Malabar Coast",
    "state": "Kerala",
    "district": "Kozhikode",
    "isUrban": true,
    "regionalName": "കോഴിക്കോട്",
    "lat": 11.2588,
    "lng": 75.7804,
    "elevationM": 12,
    "terrainType": "Malabar Coastal Plain",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Malabar Black Pepper (GI)",
      "Coconut",
      "Ginger"
    ],
    "polygonCoords": [
      [
        11.2938,
        75.7454
      ],
      [
        11.2938,
        75.8154
      ],
      [
        11.2238,
        75.8154
      ],
      [
        11.2238,
        75.7454
      ]
    ]
  },
  {
    "id": "kerala_thrissur_225",
    "name": "Thrissur Cultural Basin",
    "state": "Kerala",
    "district": "Thrissur",
    "isUrban": true,
    "regionalName": "തൃശ്ശൂർ കോൾ പാടം",
    "lat": 10.5276,
    "lng": 76.2144,
    "elevationM": 18,
    "terrainType": "Kole Wetland Irrigation Tract",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Kole Wetland Paddy",
      "Banana",
      "Arecanut"
    ],
    "polygonCoords": [
      [
        10.5626,
        76.1794
      ],
      [
        10.5626,
        76.2494
      ],
      [
        10.4926,
        76.2494
      ],
      [
        10.4926,
        76.1794
      ]
    ]
  },
  {
    "id": "kerala_alappuzha_226",
    "name": "Kuttanad Below-Sea Level",
    "state": "Kerala",
    "district": "Alappuzha",
    "isUrban": false,
    "regionalName": "കുട്ടനാട് പാടശേഖരം",
    "lat": 9.47,
    "lng": 76.45,
    "elevationM": 2,
    "terrainType": "Sub-Sea-Level Backwater Delta",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Kuttanad Below-Sea Rice (GI)",
      "Duck Farming",
      "Coconut"
    ],
    "polygonCoords": [
      [
        9.515,
        76.405
      ],
      [
        9.515,
        76.495
      ],
      [
        9.425,
        76.495
      ],
      [
        9.425,
        76.405
      ]
    ]
  },
  {
    "id": "kerala_idukki_227",
    "name": "Munnar Tea High-Range",
    "state": "Kerala",
    "district": "Idukki",
    "isUrban": false,
    "regionalName": "മൂന്നാർ മലനിരകൾ",
    "lat": 10.08,
    "lng": 77.065,
    "elevationM": 1600,
    "terrainType": "Misty Western Ghats Ridge",
    "drainageAccumulation": 0.92,
    "slopeDeg": 18.5,
    "primaryCrops": [
      "High-Altitude Orthodox Tea",
      "Green Cardamom",
      "Clove"
    ],
    "polygonCoords": [
      [
        10.125,
        77.02
      ],
      [
        10.125,
        77.11
      ],
      [
        10.035,
        77.11
      ],
      [
        10.035,
        77.02
      ]
    ]
  },
  {
    "id": "kerala_wayanad_228",
    "name": "Wayanad Coffee Plateau",
    "state": "Kerala",
    "district": "Wayanad",
    "isUrban": false,
    "regionalName": "വയനാട് ജീരകശാല",
    "lat": 11.6854,
    "lng": 76.132,
    "elevationM": 750,
    "terrainType": "High Forested Tableland",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Wayanad Robusta Coffee (GI)",
      "Jeerakasala Scented Rice",
      "Pepper"
    ],
    "polygonCoords": [
      [
        11.7304,
        76.087
      ],
      [
        11.7304,
        76.177
      ],
      [
        11.6404,
        76.177
      ],
      [
        11.6404,
        76.087
      ]
    ]
  },
  {
    "id": "kerala_palakkad_229",
    "name": "Palakkad Gap Granary",
    "state": "Kerala",
    "district": "Palakkad",
    "isUrban": false,
    "regionalName": "പാലക്കാട് മട്ട അരി",
    "lat": 10.7867,
    "lng": 76.6548,
    "elevationM": 84,
    "terrainType": "Palghat Wind Funnel Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Palakkadan Matta Rice (GI)",
      "Groundnut",
      "Coconut"
    ],
    "polygonCoords": [
      [
        10.8317,
        76.6098
      ],
      [
        10.8317,
        76.6998
      ],
      [
        10.7417,
        76.6998
      ],
      [
        10.7417,
        76.6098
      ]
    ]
  },
  {
    "id": "kerala_kollam_230",
    "name": "Kollam Cashew Capital",
    "state": "Kerala",
    "district": "Kollam",
    "isUrban": true,
    "regionalName": "കൊല്ലം കശුවണ്ടി",
    "lat": 8.8932,
    "lng": 76.6141,
    "elevationM": 14,
    "terrainType": "Ashtamudi Lake Coastal Basin",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cashew Processing Hub",
      "Tapioca",
      "Rubber"
    ],
    "polygonCoords": [
      [
        8.9282,
        76.5791
      ],
      [
        8.9282,
        76.6491
      ],
      [
        8.8582,
        76.6491
      ],
      [
        8.8582,
        76.5791
      ]
    ]
  },
  {
    "id": "kerala_kannur_231",
    "name": "Kannur Theyyam Coast",
    "state": "Kerala",
    "district": "Kannur",
    "isUrban": true,
    "regionalName": "കണ്ണൂർ കൈപ്പാട്",
    "lat": 11.8745,
    "lng": 75.3704,
    "elevationM": 16,
    "terrainType": "North Malabar Valley",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Kaipad Organic Rice (GI)",
      "Pepper",
      "Cashew"
    ],
    "polygonCoords": [
      [
        11.9095,
        75.3354
      ],
      [
        11.9095,
        75.4054
      ],
      [
        11.8395,
        75.4054
      ],
      [
        11.8395,
        75.3354
      ]
    ]
  },
  {
    "id": "punjabharyana_ludhiana_232",
    "name": "Ludhiana Industrial Metro",
    "state": "Punjab & Haryana",
    "district": "Ludhiana",
    "isUrban": true,
    "regionalName": "ਲੁਧਿਆਣਾ ਮਹਾਨਗਰ",
    "lat": 30.901,
    "lng": 75.8573,
    "elevationM": 244,
    "terrainType": "Sutlej Alluvial Floodplain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sharbati Wheat (PBW 550)",
      "Pusa Basmati 1121",
      "Urban Heat Island Buffer"
    ],
    "polygonCoords": [
      [
        30.936,
        75.8223
      ],
      [
        30.936,
        75.8923
      ],
      [
        30.866,
        75.8923
      ],
      [
        30.866,
        75.8223
      ]
    ]
  },
  {
    "id": "punjabharyana_amritsar_233",
    "name": "Amritsar Golden Temple Basin",
    "state": "Punjab & Haryana",
    "district": "Amritsar",
    "isUrban": true,
    "regionalName": "ਅੰਮ੍ਰਿਤਸਰ",
    "lat": 31.634,
    "lng": 74.8723,
    "elevationM": 232,
    "terrainType": "Upper Bari Doab Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Aromatic Basmati Rice",
      "Wheat",
      "Maize"
    ],
    "polygonCoords": [
      [
        31.669,
        74.8373
      ],
      [
        31.669,
        74.9073
      ],
      [
        31.599,
        74.9073
      ],
      [
        31.599,
        74.8373
      ]
    ]
  },
  {
    "id": "punjabharyana_chandigarh_234",
    "name": "Chandigarh Planned Capital",
    "state": "Punjab & Haryana",
    "district": "Chandigarh",
    "isUrban": true,
    "regionalName": "ਚੰਡੀਗੜ੍ਹ / चंडीगढ़",
    "lat": 30.7333,
    "lng": 76.7794,
    "elevationM": 321,
    "terrainType": "Shivalik Piedmont Plateau",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Urban Garden City Canopy",
      "Hydroponics"
    ],
    "polygonCoords": [
      [
        30.7683,
        76.7444
      ],
      [
        30.7683,
        76.8144
      ],
      [
        30.6983,
        76.8144
      ],
      [
        30.6983,
        76.7444
      ]
    ]
  },
  {
    "id": "punjabharyana_jalandhar_235",
    "name": "Jalandhar Sports City",
    "state": "Punjab & Haryana",
    "district": "Jalandhar",
    "isUrban": true,
    "regionalName": "ਜਲੰਧਰ ਆਲੂ",
    "lat": 31.326,
    "lng": 75.5762,
    "elevationM": 228,
    "terrainType": "Bist Doab Alluvium",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Seed Potato (Kufri Pukhraj)",
      "Basmati",
      "Sugarcane"
    ],
    "polygonCoords": [
      [
        31.361,
        75.5412
      ],
      [
        31.361,
        75.6112
      ],
      [
        31.291,
        75.6112
      ],
      [
        31.291,
        75.5412
      ]
    ]
  },
  {
    "id": "punjabharyana_patiala_236",
    "name": "Patiala Royal Plains",
    "state": "Punjab & Haryana",
    "district": "Patiala",
    "isUrban": true,
    "regionalName": "ਪਟਿਆਲਾ",
    "lat": 30.3398,
    "lng": 76.3869,
    "elevationM": 250,
    "terrainType": "Ghaggar Catchment Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Wheat",
      "Paddy",
      "Guava"
    ],
    "polygonCoords": [
      [
        30.3748,
        76.3519
      ],
      [
        30.3748,
        76.4219
      ],
      [
        30.3048,
        76.4219
      ],
      [
        30.3048,
        76.3519
      ]
    ]
  },
  {
    "id": "punjabharyana_bathinda_237",
    "name": "Bathinda Malwa Cotton Belt",
    "state": "Punjab & Haryana",
    "district": "Bathinda",
    "isUrban": true,
    "regionalName": "ਬਠਿੰਡਾ ਕਪਾਹ",
    "lat": 30.211,
    "lng": 74.9455,
    "elevationM": 201,
    "terrainType": "Semi-Arid Sand Dune Plain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "American Cotton (White Gold)",
      "Wheat",
      "Kinnow"
    ],
    "polygonCoords": [
      [
        30.246,
        74.9105
      ],
      [
        30.246,
        74.9805
      ],
      [
        30.176,
        74.9805
      ],
      [
        30.176,
        74.9105
      ]
    ]
  },
  {
    "id": "punjabharyana_karnal_238",
    "name": "Karnal Basmati National Hub",
    "state": "Punjab & Haryana",
    "district": "Karnal",
    "isUrban": false,
    "regionalName": "करनाल बासमती कटोरा",
    "lat": 29.6857,
    "lng": 76.9905,
    "elevationM": 252,
    "terrainType": "Western Yamuna Canal Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Taraori Traditional Basmati (CSR 30)",
      "Wheat",
      "Dairy"
    ],
    "polygonCoords": [
      [
        29.7307,
        76.9455
      ],
      [
        29.7307,
        77.0355
      ],
      [
        29.6407,
        77.0355
      ],
      [
        29.6407,
        76.9455
      ]
    ]
  },
  {
    "id": "punjabharyana_panipat_239",
    "name": "Panipat Textile City",
    "state": "Punjab & Haryana",
    "district": "Panipat",
    "isUrban": true,
    "regionalName": "पानीपत",
    "lat": 29.3909,
    "lng": 76.9635,
    "elevationM": 219,
    "terrainType": "Yamuna Floodplain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Wheat",
      "Paddy",
      "Recycled Fiber Buffer"
    ],
    "polygonCoords": [
      [
        29.4259,
        76.9285
      ],
      [
        29.4259,
        76.9985
      ],
      [
        29.3559,
        76.9985
      ],
      [
        29.3559,
        76.9285
      ]
    ]
  },
  {
    "id": "punjabharyana_ambala_240",
    "name": "Ambala Cantonment Plains",
    "state": "Punjab & Haryana",
    "district": "Ambala",
    "isUrban": true,
    "regionalName": "अंबाला",
    "lat": 30.3782,
    "lng": 76.7767,
    "elevationM": 264,
    "terrainType": "Ghaggar Piedmont Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Wheat",
      "Basmati",
      "Mustard"
    ],
    "polygonCoords": [
      [
        30.4132,
        76.7417
      ],
      [
        30.4132,
        76.8117
      ],
      [
        30.3432,
        76.8117
      ],
      [
        30.3432,
        76.7417
      ]
    ]
  },
  {
    "id": "punjabharyana_hisar_241",
    "name": "Hisar Agro-Research Capital",
    "state": "Punjab & Haryana",
    "district": "Hisar",
    "isUrban": true,
    "regionalName": "हिसार कृषि केंद्र",
    "lat": 29.1492,
    "lng": 75.7217,
    "elevationM": 215,
    "terrainType": "Semi-Arid Dry Alluvium",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Mustard",
      "Cotton",
      "Guar",
      "Buffalo Breeding"
    ],
    "polygonCoords": [
      [
        29.1842,
        75.6867
      ],
      [
        29.1842,
        75.7567
      ],
      [
        29.1142,
        75.7567
      ],
      [
        29.1142,
        75.6867
      ]
    ]
  },
  {
    "id": "andhrapradeshtelangana_hyderabad_242",
    "name": "Hyderabad Cyberabad Core",
    "state": "Andhra Pradesh & Telangana",
    "district": "Hyderabad",
    "isUrban": true,
    "regionalName": "హైదరాబాద్ మహానగరం",
    "lat": 17.385,
    "lng": 78.4867,
    "elevationM": 542,
    "terrainType": "Musi River Deccan Granite Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Urban Heat Island Mitigation",
      "Urban Lake Ecology",
      "Rooftop Greenhouses"
    ],
    "polygonCoords": [
      [
        17.42,
        78.4517
      ],
      [
        17.42,
        78.5217
      ],
      [
        17.35,
        78.5217
      ],
      [
        17.35,
        78.4517
      ]
    ]
  },
  {
    "id": "andhrapradeshtelangana_visakhapatnam_243",
    "name": "Visakhapatnam Steel City",
    "state": "Andhra Pradesh & Telangana",
    "district": "Visakhapatnam",
    "isUrban": true,
    "regionalName": "విశాఖపట్నం",
    "lat": 17.6868,
    "lng": 83.2185,
    "elevationM": 15,
    "terrainType": "Dolphin's Nose Coastal Port",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Urban Coastal Greens",
      "Cashew",
      "Oil Palms"
    ],
    "polygonCoords": [
      [
        17.7218,
        83.1835
      ],
      [
        17.7218,
        83.2535
      ],
      [
        17.6518,
        83.2535
      ],
      [
        17.6518,
        83.1835
      ]
    ]
  },
  {
    "id": "andhrapradeshtelangana_ntr_244",
    "name": "Vijayawada Krishna Basin",
    "state": "Andhra Pradesh & Telangana",
    "district": "NTR",
    "isUrban": true,
    "regionalName": "విజయవాడ",
    "lat": 16.5062,
    "lng": 80.648,
    "elevationM": 39,
    "terrainType": "Krishna River Valley Pass",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Mango (Banganapalle GI)",
      "Turmeric"
    ],
    "polygonCoords": [
      [
        16.5412,
        80.613
      ],
      [
        16.5412,
        80.683
      ],
      [
        16.4712,
        80.683
      ],
      [
        16.4712,
        80.613
      ]
    ]
  },
  {
    "id": "andhrapradeshtelangana_guntur_245",
    "name": "Guntur Mirchi Capital",
    "state": "Andhra Pradesh & Telangana",
    "district": "Guntur",
    "isUrban": true,
    "regionalName": "గుంటూరు మిర్చి",
    "lat": 16.3067,
    "lng": 80.4365,
    "elevationM": 33,
    "terrainType": "Krishna Delta Black Vertisol",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Guntur Sannam Chilli (GI)",
      "Cotton",
      "Tobacco"
    ],
    "polygonCoords": [
      [
        16.3417,
        80.4015
      ],
      [
        16.3417,
        80.4715
      ],
      [
        16.2717,
        80.4715
      ],
      [
        16.2717,
        80.4015
      ]
    ]
  },
  {
    "id": "andhrapradeshtelangana_warangal_246",
    "name": "Warangal Kakatiya Plain",
    "state": "Andhra Pradesh & Telangana",
    "district": "Warangal",
    "isUrban": true,
    "regionalName": "వరంగల్",
    "lat": 17.9689,
    "lng": 79.5941,
    "elevationM": 266,
    "terrainType": "Deccan Telangana Granitic Plateau",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Warangal Chapata Chilli",
      "Cotton",
      "Maize"
    ],
    "polygonCoords": [
      [
        18.0039,
        79.5591
      ],
      [
        18.0039,
        79.6291
      ],
      [
        17.9339,
        79.6291
      ],
      [
        17.9339,
        79.5591
      ]
    ]
  },
  {
    "id": "andhrapradeshtelangana_tirupati_247",
    "name": "Tirupati Temple Foothills",
    "state": "Andhra Pradesh & Telangana",
    "district": "Tirupati",
    "isUrban": true,
    "regionalName": "తిరుపతి",
    "lat": 13.6288,
    "lng": 79.4192,
    "elevationM": 162,
    "terrainType": "Seshachalam Biosphere Foothill",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Groundnut",
      "Mango",
      "Sugarcane"
    ],
    "polygonCoords": [
      [
        13.6638,
        79.3842
      ],
      [
        13.6638,
        79.4542
      ],
      [
        13.5938,
        79.4542
      ],
      [
        13.5938,
        79.3842
      ]
    ]
  },
  {
    "id": "andhrapradeshtelangana_eastgodavari_248",
    "name": "Rajamahendravaram Delta",
    "state": "Andhra Pradesh & Telangana",
    "district": "East Godavari",
    "isUrban": true,
    "regionalName": "రాజమండ్రి గోదావరి",
    "lat": 17.0005,
    "lng": 81.804,
    "elevationM": 24,
    "terrainType": "Akhanda Godavari River Bank",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Kadiam Floriculture Nurseries",
      "Paddy",
      "Coconut"
    ],
    "polygonCoords": [
      [
        17.0355,
        81.769
      ],
      [
        17.0355,
        81.839
      ],
      [
        16.9655,
        81.839
      ],
      [
        16.9655,
        81.769
      ]
    ]
  },
  {
    "id": "andhrapradeshtelangana_kurnool_249",
    "name": "Kurnool Tungabhadra Basin",
    "state": "Andhra Pradesh & Telangana",
    "district": "Kurnool",
    "isUrban": true,
    "regionalName": "కర్నూలు",
    "lat": 15.8281,
    "lng": 78.0373,
    "elevationM": 273,
    "terrainType": "Tungabhadra-Handri Confluence",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Kurnool Sona Rice",
      "Bengal Gram",
      "Sunflower"
    ],
    "polygonCoords": [
      [
        15.8631,
        78.0023
      ],
      [
        15.8631,
        78.0723
      ],
      [
        15.7931,
        78.0723
      ],
      [
        15.7931,
        78.0023
      ]
    ]
  },
  {
    "id": "andhrapradeshtelangana_nizamabad_250",
    "name": "Nizamabad Turmeric Bowl",
    "state": "Andhra Pradesh & Telangana",
    "district": "Nizamabad",
    "isUrban": false,
    "regionalName": "నిజామాబాద్ పసుపు",
    "lat": 18.6725,
    "lng": 78.0941,
    "elevationM": 395,
    "terrainType": "Sri Ram Sagar Irrigation Belt",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Armoor Turmeric (National Hub)",
      "Paddy",
      "Soybean"
    ],
    "polygonCoords": [
      [
        18.7175,
        78.0491
      ],
      [
        18.7175,
        78.1391
      ],
      [
        18.6275,
        78.1391
      ],
      [
        18.6275,
        78.0491
      ]
    ]
  },
  {
    "id": "andhrapradeshtelangana_nellore_251",
    "name": "Nellore Coastal Shrimp Basin",
    "state": "Andhra Pradesh & Telangana",
    "district": "Nellore",
    "isUrban": false,
    "regionalName": "నెల్లూరు",
    "lat": 14.4426,
    "lng": 79.9865,
    "elevationM": 19,
    "terrainType": "Pennar River Estuarine Delta",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Nellore Rice",
      "Vannamei Shrimp",
      "Citrus (Acid Lime)"
    ],
    "polygonCoords": [
      [
        14.4876,
        79.9415
      ],
      [
        14.4876,
        80.0315
      ],
      [
        14.3976,
        80.0315
      ],
      [
        14.3976,
        79.9415
      ]
    ]
  },
  {
    "id": "madhyapradeshchhattisgarh_bhopal_252",
    "name": "Bhopal City of Lakes",
    "state": "Madhya Pradesh & Chhattisgarh",
    "district": "Bhopal",
    "isUrban": true,
    "regionalName": "भोपाल झीलों की नगरी",
    "lat": 23.2599,
    "lng": 77.4126,
    "elevationM": 527,
    "terrainType": "Upper Lake Basalt Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Urban Lake Buffer Ecology",
      "Wheat",
      "Soybean"
    ],
    "polygonCoords": [
      [
        23.2949,
        77.3776
      ],
      [
        23.2949,
        77.4476
      ],
      [
        23.2249,
        77.4476
      ],
      [
        23.2249,
        77.3776
      ]
    ]
  },
  {
    "id": "madhyapradeshchhattisgarh_indore_253",
    "name": "Indore Commercial Capital",
    "state": "Madhya Pradesh & Chhattisgarh",
    "district": "Indore",
    "isUrban": true,
    "regionalName": "इंदौर मालवा",
    "lat": 22.7196,
    "lng": 75.8577,
    "elevationM": 553,
    "terrainType": "Malwa Black Soil Plateau",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Sharbati Wheat",
      "Soybean (JS 9560)",
      "Garlic"
    ],
    "polygonCoords": [
      [
        22.7546,
        75.8227
      ],
      [
        22.7546,
        75.8927
      ],
      [
        22.6846,
        75.8927
      ],
      [
        22.6846,
        75.8227
      ]
    ]
  },
  {
    "id": "madhyapradeshchhattisgarh_jabalpur_254",
    "name": "Jabalpur Narmada Marble",
    "state": "Madhya Pradesh & Chhattisgarh",
    "district": "Jabalpur",
    "isUrban": true,
    "regionalName": "जबलपुर मटर",
    "lat": 23.1815,
    "lng": 79.9864,
    "elevationM": 411,
    "terrainType": "Narmada River Gorges",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Green Pea (Matar)",
      "Paddy",
      "Wheat"
    ],
    "polygonCoords": [
      [
        23.2165,
        79.9514
      ],
      [
        23.2165,
        80.0214
      ],
      [
        23.1465,
        80.0214
      ],
      [
        23.1465,
        79.9514
      ]
    ]
  },
  {
    "id": "madhyapradeshchhattisgarh_gwalior_255",
    "name": "Gwalior Chambal Fort Basin",
    "state": "Madhya Pradesh & Chhattisgarh",
    "district": "Gwalior",
    "isUrban": true,
    "regionalName": "ग्वालियर",
    "lat": 26.2183,
    "lng": 78.1828,
    "elevationM": 211,
    "terrainType": "Gird Alluvial Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Mustard",
      "Wheat",
      "Potato"
    ],
    "polygonCoords": [
      [
        26.2533,
        78.1478
      ],
      [
        26.2533,
        78.2178
      ],
      [
        26.1833,
        78.2178
      ],
      [
        26.1833,
        78.1478
      ]
    ]
  },
  {
    "id": "madhyapradeshchhattisgarh_ujjain_256",
    "name": "Ujjain Mahakal Holy Basin",
    "state": "Madhya Pradesh & Chhattisgarh",
    "district": "Ujjain",
    "isUrban": true,
    "regionalName": "उज्जैन क्षिप्रा",
    "lat": 23.1765,
    "lng": 75.7885,
    "elevationM": 494,
    "terrainType": "Shipra River Malwa Plain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Soybean",
      "Wheat",
      "Gram"
    ],
    "polygonCoords": [
      [
        23.2115,
        75.7535
      ],
      [
        23.2115,
        75.8235
      ],
      [
        23.1415,
        75.8235
      ],
      [
        23.1415,
        75.7535
      ]
    ]
  },
  {
    "id": "madhyapradeshchhattisgarh_narmadapuram_257",
    "name": "Narmadapuram Wheat Valley",
    "state": "Madhya Pradesh & Chhattisgarh",
    "district": "Narmadapuram",
    "isUrban": false,
    "regionalName": "नर्मदापुरम शरबती गेहूं",
    "lat": 22.755,
    "lng": 77.725,
    "elevationM": 278,
    "terrainType": "Deep Alluvial Narmada Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "MP Sharbati Wheat (GI)",
      "Soybean",
      "Mung Bean"
    ],
    "polygonCoords": [
      [
        22.8,
        77.68
      ],
      [
        22.8,
        77.77
      ],
      [
        22.71,
        77.77
      ],
      [
        22.71,
        77.68
      ]
    ]
  },
  {
    "id": "madhyapradeshchhattisgarh_raipur_258",
    "name": "Raipur Mahanadi Metro",
    "state": "Madhya Pradesh & Chhattisgarh",
    "district": "Raipur",
    "isUrban": true,
    "regionalName": "रायपुर धान का कटोरा",
    "lat": 21.2514,
    "lng": 81.6296,
    "elevationM": 298,
    "terrainType": "Chhattisgarh Rice Bowl Central",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Dubraj Fragrant Rice",
      "Vegetables",
      "Industrial Buffer"
    ],
    "polygonCoords": [
      [
        21.2864,
        81.5946
      ],
      [
        21.2864,
        81.6646
      ],
      [
        21.2164,
        81.6646
      ],
      [
        21.2164,
        81.5946
      ]
    ]
  },
  {
    "id": "himachalpradeshjkuttarakhand_shimla_259",
    "name": "Shimla Mall Ridge",
    "state": "Himachal Pradesh, J&K, Uttarakhand",
    "district": "Shimla",
    "isUrban": true,
    "regionalName": "शिमला माल रोड",
    "lat": 31.1048,
    "lng": 77.1734,
    "elevationM": 2276,
    "terrainType": "Mid-Himalayan Ridge Crest",
    "drainageAccumulation": 0.92,
    "slopeDeg": 18.5,
    "primaryCrops": [
      "Urban Mountain Slope",
      "Conifer Forest Buffer"
    ],
    "polygonCoords": [
      [
        31.1398,
        77.1384
      ],
      [
        31.1398,
        77.2084
      ],
      [
        31.0698,
        77.2084
      ],
      [
        31.0698,
        77.1384
      ]
    ]
  },
  {
    "id": "himachalpradeshjkuttarakhand_shimla_260",
    "name": "Kotgarh Apple Valley",
    "state": "Himachal Pradesh, J&K, Uttarakhand",
    "district": "Shimla",
    "isUrban": false,
    "regionalName": "कोटगढ़ सेब घाटी",
    "lat": 31.305,
    "lng": 77.495,
    "elevationM": 2050,
    "terrainType": "Inner Himalayan Escarpment & Frost Basin",
    "drainageAccumulation": 0.92,
    "slopeDeg": 18.5,
    "primaryCrops": [
      "Royal Delicious Apple",
      "Almond",
      "Cherry"
    ],
    "polygonCoords": [
      [
        31.35,
        77.45
      ],
      [
        31.35,
        77.54
      ],
      [
        31.26,
        77.54
      ],
      [
        31.26,
        77.45
      ]
    ]
  },
  {
    "id": "himachalpradeshjkuttarakhand_kangra_261",
    "name": "Dharamshala Kangra Tea",
    "state": "Himachal Pradesh, J&K, Uttarakhand",
    "district": "Kangra",
    "isUrban": false,
    "regionalName": "धर्मशाला कांगड़ा चाय",
    "lat": 32.219,
    "lng": 76.3234,
    "elevationM": 1457,
    "terrainType": "Dhauladhar Snow Range Foothills",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Kangra Orthodox Tea (GI)",
      "Basmati",
      "Citrus"
    ],
    "polygonCoords": [
      [
        32.264,
        76.2784
      ],
      [
        32.264,
        76.3684
      ],
      [
        32.174,
        76.3684
      ],
      [
        32.174,
        76.2784
      ]
    ]
  },
  {
    "id": "himachalpradeshjkuttarakhand_kullu_262",
    "name": "Kullu Valley of Gods",
    "state": "Himachal Pradesh, J&K, Uttarakhand",
    "district": "Kullu",
    "isUrban": false,
    "regionalName": "कुल्लू घाटी",
    "lat": 31.9579,
    "lng": 77.1095,
    "elevationM": 1279,
    "terrainType": "Beas River Alpine Valley",
    "drainageAccumulation": 0.45,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Kullu Red Apple",
      "Plums",
      "Trout Fish"
    ],
    "polygonCoords": [
      [
        32.0029,
        77.0645
      ],
      [
        32.0029,
        77.1545
      ],
      [
        31.9129,
        77.1545
      ],
      [
        31.9129,
        77.0645
      ]
    ]
  },
  {
    "id": "himachalpradeshjkuttarakhand_dehradun_263",
    "name": "Dehradun Doon Valley",
    "state": "Himachal Pradesh, J&K, Uttarakhand",
    "district": "Dehradun",
    "isUrban": true,
    "regionalName": "देहरादून दून घाटी",
    "lat": 30.3165,
    "lng": 78.0322,
    "elevationM": 640,
    "terrainType": "Intermontane Shivalik Syncline",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Dehraduni Type 3 Basmati",
      "Litchi",
      "Urban Greens"
    ],
    "polygonCoords": [
      [
        30.3515,
        77.9972
      ],
      [
        30.3515,
        78.0672
      ],
      [
        30.2815,
        78.0672
      ],
      [
        30.2815,
        77.9972
      ]
    ]
  },
  {
    "id": "himachalpradeshjkuttarakhand_haridwar_264",
    "name": "Haridwar Ganga Entry",
    "state": "Himachal Pradesh, J&K, Uttarakhand",
    "district": "Haridwar",
    "isUrban": true,
    "regionalName": "हरिद्वार",
    "lat": 29.9457,
    "lng": 78.1642,
    "elevationM": 314,
    "terrainType": "Ganga Himalayan Exit Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sugarcane",
      "Wheat",
      "Ayurvedic Herbs"
    ],
    "polygonCoords": [
      [
        29.9807,
        78.1292
      ],
      [
        29.9807,
        78.1992
      ],
      [
        29.9107,
        78.1992
      ],
      [
        29.9107,
        78.1292
      ]
    ]
  },
  {
    "id": "himachalpradeshjkuttarakhand_srinagar_265",
    "name": "Srinagar Dal Lake Basin",
    "state": "Himachal Pradesh, J&K, Uttarakhand",
    "district": "Srinagar",
    "isUrban": true,
    "regionalName": "سرینگر ڈل جھیل",
    "lat": 34.0837,
    "lng": 74.7973,
    "elevationM": 1585,
    "terrainType": "Jhelum Lacustrine Valley",
    "drainageAccumulation": 0.92,
    "slopeDeg": 18.5,
    "primaryCrops": [
      "Floating Vegetable Gardens (Radh)",
      "Almond",
      "Kashmiri Apple"
    ],
    "polygonCoords": [
      [
        34.1187,
        74.7623
      ],
      [
        34.1187,
        74.8323
      ],
      [
        34.0487,
        74.8323
      ],
      [
        34.0487,
        74.7623
      ]
    ]
  },
  {
    "id": "himachalpradeshjkuttarakhand_pulwama_266",
    "name": "Pampore Saffron Karewa",
    "state": "Himachal Pradesh, J&K, Uttarakhand",
    "district": "Pulwama",
    "isUrban": false,
    "regionalName": "پامپور زعفران",
    "lat": 34.008,
    "lng": 74.935,
    "elevationM": 1610,
    "terrainType": "Karewa Terraced Tableland",
    "drainageAccumulation": 0.92,
    "slopeDeg": 18.5,
    "primaryCrops": [
      "Kashmiri Mongra Saffron (GI)",
      "Walnut",
      "Mustard"
    ],
    "polygonCoords": [
      [
        34.053,
        74.89
      ],
      [
        34.053,
        74.98
      ],
      [
        33.963,
        74.98
      ],
      [
        33.963,
        74.89
      ]
    ]
  },
  {
    "id": "himachalpradeshjkuttarakhand_jammu_267",
    "name": "Jammu Tawi Basin",
    "state": "Himachal Pradesh, J&K, Uttarakhand",
    "district": "Jammu",
    "isUrban": true,
    "regionalName": "जम्मू तवी",
    "lat": 32.7266,
    "lng": 74.857,
    "elevationM": 327,
    "terrainType": "Shivalik Piedmont Alluvial Plains",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "RS Pura Basmati Rice (World Famous)",
      "Wheat"
    ],
    "polygonCoords": [
      [
        32.7616,
        74.822
      ],
      [
        32.7616,
        74.892
      ],
      [
        32.6916,
        74.892
      ],
      [
        32.6916,
        74.822
      ]
    ]
  },
  {
    "id": "assamnortheastodisha_kamrupmetro_268",
    "name": "Guwahati Kamrup Metro",
    "state": "Assam, North-East & Odisha",
    "district": "Kamrup Metro",
    "isUrban": true,
    "regionalName": "গুৱাহাটী মহানগৰ",
    "lat": 26.1445,
    "lng": 91.7362,
    "elevationM": 55,
    "terrainType": "Brahmaputra South Bank Hills",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Urban Flood Retention",
      "Arecanut",
      "Tea"
    ],
    "polygonCoords": [
      [
        26.1795,
        91.7012
      ],
      [
        26.1795,
        91.7712
      ],
      [
        26.1095,
        91.7712
      ],
      [
        26.1095,
        91.7012
      ]
    ]
  },
  {
    "id": "assamnortheastodisha_jorhat_269",
    "name": "Jorhat Tea Research Hub",
    "state": "Assam, North-East & Odisha",
    "district": "Jorhat",
    "isUrban": false,
    "regionalName": "যোৰহাট চাহ কেন্দ্ৰ",
    "lat": 26.7509,
    "lng": 94.2037,
    "elevationM": 96,
    "terrainType": "Upper Assam Alluvial Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Assam CTC Tea",
      "Boro Rice",
      "Bhut Jolokia (Ghost Pepper GI)"
    ],
    "polygonCoords": [
      [
        26.7959,
        94.1587
      ],
      [
        26.7959,
        94.2487
      ],
      [
        26.7059,
        94.2487
      ],
      [
        26.7059,
        94.1587
      ]
    ]
  },
  {
    "id": "assamnortheastodisha_khordha_270",
    "name": "Bhubaneswar Smart City",
    "state": "Assam, North-East & Odisha",
    "district": "Khordha",
    "isUrban": true,
    "regionalName": "ଭୁବନେଶ୍ୱର ସ୍ମାର୍ଟ ସିଟି",
    "lat": 20.2961,
    "lng": 85.8245,
    "elevationM": 45,
    "terrainType": "Mahanadi South Delta Plain",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Cashew",
      "Urban Bioswales"
    ],
    "polygonCoords": [
      [
        20.3311,
        85.7895
      ],
      [
        20.3311,
        85.8595
      ],
      [
        20.2611,
        85.8595
      ],
      [
        20.2611,
        85.7895
      ]
    ]
  },
  {
    "id": "assamnortheastodisha_cuttack_271",
    "name": "Cuttack Silver City",
    "state": "Assam, North-East & Odisha",
    "district": "Cuttack",
    "isUrban": true,
    "regionalName": "କଟକ ମହାନଦୀ",
    "lat": 20.4625,
    "lng": 85.8828,
    "elevationM": 36,
    "terrainType": "Mahanadi-Kathajodi Delta Island",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy (CRRI Research)",
      "Betel Leaf",
      "Vegetables"
    ],
    "polygonCoords": [
      [
        20.4975,
        85.8478
      ],
      [
        20.4975,
        85.9178
      ],
      [
        20.4275,
        85.9178
      ],
      [
        20.4275,
        85.8478
      ]
    ]
  },
  {
    "id": "assamnortheastodisha_puri_272",
    "name": "Puri Coastal Jagannath",
    "state": "Assam, North-East & Odisha",
    "district": "Puri",
    "isUrban": false,
    "regionalName": "ପୁରୀ ବେଳାଭୂମି",
    "lat": 19.8135,
    "lng": 85.8312,
    "elevationM": 9,
    "terrainType": "Bay of Bengal Saline Shore",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Coconut",
      "Betel Leaf",
      "Casuarina"
    ],
    "polygonCoords": [
      [
        19.8585,
        85.7862
      ],
      [
        19.8585,
        85.8762
      ],
      [
        19.7685,
        85.8762
      ],
      [
        19.7685,
        85.7862
      ]
    ]
  },
  {
    "id": "biharjharkhand_patna_273",
    "name": "Patna Ganga Capital",
    "state": "Bihar & Jharkhand",
    "district": "Patna",
    "isUrban": true,
    "regionalName": "पटना गंगा कछार",
    "lat": 25.5941,
    "lng": 85.1376,
    "elevationM": 53,
    "terrainType": "Ganga-Son-Gandak Confluence",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Digha Malda Mango",
      "Vegetables",
      "River Diara Melons"
    ],
    "polygonCoords": [
      [
        25.6291,
        85.1026
      ],
      [
        25.6291,
        85.1726
      ],
      [
        25.5591,
        85.1726
      ],
      [
        25.5591,
        85.1026
      ]
    ]
  },
  {
    "id": "biharjharkhand_muzaffarpur_274",
    "name": "Muzaffarpur Litchi Basin",
    "state": "Bihar & Jharkhand",
    "district": "Muzaffarpur",
    "isUrban": false,
    "regionalName": "मुजफ्फरपुर शाही लीची",
    "lat": 26.1209,
    "lng": 85.3647,
    "elevationM": 60,
    "terrainType": "Burhi Gandak Silt Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Shahi Litchi (GI)",
      "Maize",
      "Summer Rice"
    ],
    "polygonCoords": [
      [
        26.1659,
        85.3197
      ],
      [
        26.1659,
        85.4097
      ],
      [
        26.0759,
        85.4097
      ],
      [
        26.0759,
        85.3197
      ]
    ]
  },
  {
    "id": "biharjharkhand_bhagalpur_275",
    "name": "Bhagalpur Silk City",
    "state": "Bihar & Jharkhand",
    "district": "Bhagalpur",
    "isUrban": true,
    "regionalName": "भागलपुर रेशम",
    "lat": 25.2425,
    "lng": 86.9842,
    "elevationM": 52,
    "terrainType": "South Ganga River Bank",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Bhagalpuri Zardalu Mango (GI)",
      "Katarni Chawal (GI)",
      "Tussar Silk"
    ],
    "polygonCoords": [
      [
        25.2775,
        86.9492
      ],
      [
        25.2775,
        87.0192
      ],
      [
        25.2075,
        87.0192
      ],
      [
        25.2075,
        86.9492
      ]
    ]
  },
  {
    "id": "biharjharkhand_gaya_276",
    "name": "Gaya Falgu Basin",
    "state": "Bihar & Jharkhand",
    "district": "Gaya",
    "isUrban": true,
    "regionalName": "गया",
    "lat": 24.7955,
    "lng": 85.0002,
    "elevationM": 111,
    "terrainType": "Falgu River Sandy Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Wheat",
      "Gram",
      "Vegetables"
    ],
    "polygonCoords": [
      [
        24.8305,
        84.9652
      ],
      [
        24.8305,
        85.0352
      ],
      [
        24.7605,
        85.0352
      ],
      [
        24.7605,
        84.9652
      ]
    ]
  },
  {
    "id": "biharjharkhand_ranchi_277",
    "name": "Ranchi Chota Nagpur Core",
    "state": "Bihar & Jharkhand",
    "district": "Ranchi",
    "isUrban": true,
    "regionalName": "राँची पठार",
    "lat": 23.3441,
    "lng": 85.3096,
    "elevationM": 651,
    "terrainType": "Chota Nagpur Granite Plateau",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Off-Season Vegetables",
      "Pea",
      "Urban Plateau Canopy"
    ],
    "polygonCoords": [
      [
        23.3791,
        85.2746
      ],
      [
        23.3791,
        85.3446
      ],
      [
        23.3091,
        85.3446
      ],
      [
        23.3091,
        85.2746
      ]
    ]
  },
  {
    "id": "biharjharkhand_eastsinghbhum_278",
    "name": "Jamshedpur Steel Metro",
    "state": "Bihar & Jharkhand",
    "district": "East Singhbhum",
    "isUrban": true,
    "regionalName": "जमशेदपुर",
    "lat": 22.8046,
    "lng": 86.2029,
    "elevationM": 135,
    "terrainType": "Subarnarekha River Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Tomato",
      "Paddy",
      "Industrial Green Belts"
    ],
    "polygonCoords": [
      [
        22.8396,
        86.1679
      ],
      [
        22.8396,
        86.2379
      ],
      [
        22.7696,
        86.2379
      ],
      [
        22.7696,
        86.1679
      ]
    ]
  },
  {
    "id": "andhrapradesh_visakhapatnam_279",
    "name": "Visakhapatnam Steel City",
    "state": "Andhra Pradesh",
    "district": "Visakhapatnam",
    "isUrban": true,
    "regionalName": "విశాఖపట్నం",
    "lat": 17.6868,
    "lng": 83.2185,
    "elevationM": 15,
    "terrainType": "Dolphin's Nose Coastal Port",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Urban Coastal Greens",
      "Cashew",
      "Oil Palms"
    ],
    "polygonCoords": [
      [
        17.7218,
        83.1835
      ],
      [
        17.7218,
        83.2535
      ],
      [
        17.6518,
        83.2535
      ],
      [
        17.6518,
        83.1835
      ]
    ]
  },
  {
    "id": "andhrapradesh_ntr_280",
    "name": "Vijayawada Krishna Basin",
    "state": "Andhra Pradesh",
    "district": "NTR",
    "isUrban": true,
    "regionalName": "విజయవాడ",
    "lat": 16.5062,
    "lng": 80.648,
    "elevationM": 39,
    "terrainType": "Krishna River Valley Pass",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Mango (Banganapalle GI)",
      "Turmeric"
    ],
    "polygonCoords": [
      [
        16.5412,
        80.613
      ],
      [
        16.5412,
        80.683
      ],
      [
        16.4712,
        80.683
      ],
      [
        16.4712,
        80.613
      ]
    ]
  },
  {
    "id": "andhrapradesh_guntur_281",
    "name": "Guntur Mirchi Capital",
    "state": "Andhra Pradesh",
    "district": "Guntur",
    "isUrban": true,
    "regionalName": "గుంటూరు మిర్చి",
    "lat": 16.3067,
    "lng": 80.4365,
    "elevationM": 33,
    "terrainType": "Krishna Delta Black Vertisol",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Guntur Sannam Chilli (GI)",
      "Cotton",
      "Tobacco"
    ],
    "polygonCoords": [
      [
        16.3417,
        80.4015
      ],
      [
        16.3417,
        80.4715
      ],
      [
        16.2717,
        80.4715
      ],
      [
        16.2717,
        80.4015
      ]
    ]
  },
  {
    "id": "andhrapradesh_tirupati_282",
    "name": "Tirupati Temple Foothills",
    "state": "Andhra Pradesh",
    "district": "Tirupati",
    "isUrban": true,
    "regionalName": "తిరుపతి",
    "lat": 13.6288,
    "lng": 79.4192,
    "elevationM": 162,
    "terrainType": "Seshachalam Biosphere Foothill",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Groundnut",
      "Mango",
      "Sugarcane"
    ],
    "polygonCoords": [
      [
        13.6638,
        79.3842
      ],
      [
        13.6638,
        79.4542
      ],
      [
        13.5938,
        79.4542
      ],
      [
        13.5938,
        79.3842
      ]
    ]
  },
  {
    "id": "andhrapradesh_eastgodavari_283",
    "name": "Rajamahendravaram Delta",
    "state": "Andhra Pradesh",
    "district": "East Godavari",
    "isUrban": true,
    "regionalName": "రాజమండ్రి గోదావరి",
    "lat": 17.0005,
    "lng": 81.804,
    "elevationM": 24,
    "terrainType": "Akhanda Godavari River Bank",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Kadiam Floriculture Nurseries",
      "Paddy",
      "Coconut"
    ],
    "polygonCoords": [
      [
        17.0355,
        81.769
      ],
      [
        17.0355,
        81.839
      ],
      [
        16.9655,
        81.839
      ],
      [
        16.9655,
        81.769
      ]
    ]
  },
  {
    "id": "andhrapradesh_kurnool_284",
    "name": "Kurnool Tungabhadra Basin",
    "state": "Andhra Pradesh",
    "district": "Kurnool",
    "isUrban": true,
    "regionalName": "కర్నూలు",
    "lat": 15.8281,
    "lng": 78.0373,
    "elevationM": 273,
    "terrainType": "Tungabhadra-Handri Confluence",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Kurnool Sona Rice",
      "Bengal Gram",
      "Sunflower"
    ],
    "polygonCoords": [
      [
        15.8631,
        78.0023
      ],
      [
        15.8631,
        78.0723
      ],
      [
        15.7931,
        78.0723
      ],
      [
        15.7931,
        78.0023
      ]
    ]
  },
  {
    "id": "andhrapradesh_nellore_285",
    "name": "Nellore Coastal Shrimp Basin",
    "state": "Andhra Pradesh",
    "district": "Nellore",
    "isUrban": false,
    "regionalName": "నెల్లూరు",
    "lat": 14.4426,
    "lng": 79.9865,
    "elevationM": 19,
    "terrainType": "Pennar River Estuarine Delta",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Nellore Rice",
      "Vannamei Shrimp",
      "Acid Lime"
    ],
    "polygonCoords": [
      [
        14.4876,
        79.9415
      ],
      [
        14.4876,
        80.0315
      ],
      [
        14.3976,
        80.0315
      ],
      [
        14.3976,
        79.9415
      ]
    ]
  },
  {
    "id": "andhrapradesh_ysrkadapa_286",
    "name": "Kadapa Red Sandstone Basin",
    "state": "Andhra Pradesh",
    "district": "YSR Kadapa",
    "isUrban": true,
    "regionalName": "కడప",
    "lat": 14.4673,
    "lng": 78.8242,
    "elevationM": 138,
    "terrainType": "Rayalaseema Semi-Arid Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Bengal Gram",
      "Sunflower",
      "Banana"
    ],
    "polygonCoords": [
      [
        14.5023,
        78.7892
      ],
      [
        14.5023,
        78.8592
      ],
      [
        14.4323,
        78.8592
      ],
      [
        14.4323,
        78.7892
      ]
    ]
  },
  {
    "id": "andhrapradesh_anantapur_287",
    "name": "Anantapur Arid Groundnut Tract",
    "state": "Andhra Pradesh",
    "district": "Anantapur",
    "isUrban": false,
    "regionalName": "అనంతపురం",
    "lat": 14.6819,
    "lng": 77.6006,
    "elevationM": 335,
    "terrainType": "Drought-Prone Rainshadow Plateau",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Rainfed Groundnut",
      "Sweet Orange",
      "Pomegranate"
    ],
    "polygonCoords": [
      [
        14.7269,
        77.5556
      ],
      [
        14.7269,
        77.6456
      ],
      [
        14.6369,
        77.6456
      ],
      [
        14.6369,
        77.5556
      ]
    ]
  },
  {
    "id": "andhrapradesh_chittoor_288",
    "name": "Chittoor Mango & Jaggery",
    "state": "Andhra Pradesh",
    "district": "Chittoor",
    "isUrban": false,
    "regionalName": "చిత్తూరు",
    "lat": 13.2172,
    "lng": 79.1003,
    "elevationM": 315,
    "terrainType": "Palar Catchment Foot-Slope",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Totapuri Mango Pulp",
      "Sugarcane",
      "Tomato"
    ],
    "polygonCoords": [
      [
        13.2622,
        79.0553
      ],
      [
        13.2622,
        79.1453
      ],
      [
        13.1722,
        79.1453
      ],
      [
        13.1722,
        79.0553
      ]
    ]
  },
  {
    "id": "andhrapradesh_kakinada_289",
    "name": "Kakinada Deep Sea Port",
    "state": "Andhra Pradesh",
    "district": "Kakinada",
    "isUrban": true,
    "regionalName": "కాకినాడ",
    "lat": 16.9891,
    "lng": 82.2475,
    "elevationM": 2,
    "terrainType": "Godavari Estuary Coastline",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Aquaculture Shrimp",
      "Paddy",
      "Coconut"
    ],
    "polygonCoords": [
      [
        17.0241,
        82.2125
      ],
      [
        17.0241,
        82.2825
      ],
      [
        16.9541,
        82.2825
      ],
      [
        16.9541,
        82.2125
      ]
    ]
  },
  {
    "id": "andhrapradesh_eluru_290",
    "name": "Eluru Kolleru Lake Plain",
    "state": "Andhra Pradesh",
    "district": "Eluru",
    "isUrban": false,
    "regionalName": "ఏలూరు",
    "lat": 16.7107,
    "lng": 81.0952,
    "elevationM": 22,
    "terrainType": "Kolleru Freshwater Lake Basin",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Freshwater Carp",
      "Tobacco"
    ],
    "polygonCoords": [
      [
        16.7557,
        81.0502
      ],
      [
        16.7557,
        81.1402
      ],
      [
        16.6657,
        81.1402
      ],
      [
        16.6657,
        81.0502
      ]
    ]
  },
  {
    "id": "andhrapradesh_prakasam_291",
    "name": "Ongole Cattle Tract",
    "state": "Andhra Pradesh",
    "district": "Prakasam",
    "isUrban": true,
    "regionalName": "ఒంగోలు",
    "lat": 15.5057,
    "lng": 80.0499,
    "elevationM": 24,
    "terrainType": "Semi-Arid Coastal Plain",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Virginia Tobacco",
      "Cotton",
      "Bengal Gram"
    ],
    "polygonCoords": [
      [
        15.5407,
        80.0149
      ],
      [
        15.5407,
        80.0849
      ],
      [
        15.4707,
        80.0849
      ],
      [
        15.4707,
        80.0149
      ]
    ]
  },
  {
    "id": "andhrapradesh_srikakulam_292",
    "name": "Srikakulam Nagavali Basin",
    "state": "Andhra Pradesh",
    "district": "Srikakulam",
    "isUrban": false,
    "regionalName": "శ్రీకాకుళం",
    "lat": 18.2949,
    "lng": 83.8938,
    "elevationM": 10,
    "terrainType": "Eastern Ghats Coastal Strip",
    "drainageAccumulation": 0.85,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cashew",
      "Coconut",
      "Paddy"
    ],
    "polygonCoords": [
      [
        18.3399,
        83.8488
      ],
      [
        18.3399,
        83.9388
      ],
      [
        18.2499,
        83.9388
      ],
      [
        18.2499,
        83.8488
      ]
    ]
  },
  {
    "id": "andhrapradesh_vizianagaram_293",
    "name": "Vizianagaram Heritage Plains",
    "state": "Andhra Pradesh",
    "district": "Vizianagaram",
    "isUrban": false,
    "regionalName": "విజయనగరం",
    "lat": 18.1067,
    "lng": 83.3956,
    "elevationM": 66,
    "terrainType": "Gosthani Catchment",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sugarcane",
      "Maize",
      "Groundnut"
    ],
    "polygonCoords": [
      [
        18.1517,
        83.3506
      ],
      [
        18.1517,
        83.4406
      ],
      [
        18.0617,
        83.4406
      ],
      [
        18.0617,
        83.3506
      ]
    ]
  },
  {
    "id": "telangana_hyderabad_294",
    "name": "Hyderabad Cyberabad Core",
    "state": "Telangana",
    "district": "Hyderabad",
    "isUrban": true,
    "regionalName": "హైదరాబాద్ మహానగరం",
    "lat": 17.385,
    "lng": 78.4867,
    "elevationM": 542,
    "terrainType": "Musi River Deccan Granite Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 5.2,
    "primaryCrops": [
      "Urban Heat Island Mitigation",
      "Rooftop Greenhouses"
    ],
    "polygonCoords": [
      [
        17.42,
        78.4517
      ],
      [
        17.42,
        78.5217
      ],
      [
        17.35,
        78.5217
      ],
      [
        17.35,
        78.4517
      ]
    ]
  },
  {
    "id": "telangana_warangal_295",
    "name": "Warangal Kakatiya Plain",
    "state": "Telangana",
    "district": "Warangal",
    "isUrban": true,
    "regionalName": "వరంగల్",
    "lat": 17.9689,
    "lng": 79.5941,
    "elevationM": 266,
    "terrainType": "Deccan Telangana Granitic Plateau",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Warangal Chapata Chilli",
      "Cotton",
      "Maize"
    ],
    "polygonCoords": [
      [
        18.0039,
        79.5591
      ],
      [
        18.0039,
        79.6291
      ],
      [
        17.9339,
        79.6291
      ],
      [
        17.9339,
        79.5591
      ]
    ]
  },
  {
    "id": "telangana_nizamabad_296",
    "name": "Nizamabad Turmeric Bowl",
    "state": "Telangana",
    "district": "Nizamabad",
    "isUrban": false,
    "regionalName": "నిజామాబాద్ పసుపు",
    "lat": 18.6725,
    "lng": 78.0941,
    "elevationM": 395,
    "terrainType": "Sri Ram Sagar Irrigation Belt",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Armoor Turmeric (National Hub)",
      "Paddy",
      "Soybean"
    ],
    "polygonCoords": [
      [
        18.7175,
        78.0491
      ],
      [
        18.7175,
        78.1391
      ],
      [
        18.6275,
        78.1391
      ],
      [
        18.6275,
        78.0491
      ]
    ]
  },
  {
    "id": "telangana_karimnagar_297",
    "name": "Karimnagar Rice Bowl",
    "state": "Telangana",
    "district": "Karimnagar",
    "isUrban": true,
    "regionalName": "కరీంనగర్",
    "lat": 18.4386,
    "lng": 79.1288,
    "elevationM": 265,
    "terrainType": "Manair Dam Irrigated Plain",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Telangana Sona Rice",
      "Cotton",
      "Maize"
    ],
    "polygonCoords": [
      [
        18.4736,
        79.0938
      ],
      [
        18.4736,
        79.1638
      ],
      [
        18.4036,
        79.1638
      ],
      [
        18.4036,
        79.0938
      ]
    ]
  },
  {
    "id": "telangana_khammam_298",
    "name": "Khammam Chilli & Granite",
    "state": "Telangana",
    "district": "Khammam",
    "isUrban": true,
    "regionalName": "ఖమ్మం మిర్చి",
    "lat": 17.2473,
    "lng": 80.1514,
    "elevationM": 107,
    "terrainType": "Munneru River Basin",
    "drainageAccumulation": 0.65,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Teja Red Chilli (Export Quality)",
      "Cotton",
      "Mango"
    ],
    "polygonCoords": [
      [
        17.2823,
        80.1164
      ],
      [
        17.2823,
        80.1864
      ],
      [
        17.2123,
        80.1864
      ],
      [
        17.2123,
        80.1164
      ]
    ]
  },
  {
    "id": "telangana_mahbubnagar_299",
    "name": "Mahbubnagar Palamuru Tract",
    "state": "Telangana",
    "district": "Mahbubnagar",
    "isUrban": false,
    "regionalName": "మహబూబ్‌నగర్",
    "lat": 16.7488,
    "lng": 77.984,
    "elevationM": 498,
    "terrainType": "Krishna Semi-Arid Plateau",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Castor",
      "Groundnut",
      "Paddy"
    ],
    "polygonCoords": [
      [
        16.7938,
        77.939
      ],
      [
        16.7938,
        78.029
      ],
      [
        16.7038,
        78.029
      ],
      [
        16.7038,
        77.939
      ]
    ]
  },
  {
    "id": "telangana_nalgonda_300",
    "name": "Nalgonda Nagarjuna Plain",
    "state": "Telangana",
    "district": "Nalgonda",
    "isUrban": false,
    "regionalName": "నల్గొండ బత్తాయి",
    "lat": 17.0575,
    "lng": 79.2684,
    "elevationM": 221,
    "terrainType": "Krishna Basin Left Canal",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Sweet Orange (Batavia)",
      "Cotton",
      "Paddy"
    ],
    "polygonCoords": [
      [
        17.1025,
        79.2234
      ],
      [
        17.1025,
        79.3134
      ],
      [
        17.0125,
        79.3134
      ],
      [
        17.0125,
        79.2234
      ]
    ]
  },
  {
    "id": "telangana_adilabad_301",
    "name": "Adilabad Cotton Belt",
    "state": "Telangana",
    "district": "Adilabad",
    "isUrban": false,
    "regionalName": "ఆదిలాబాద్",
    "lat": 19.6641,
    "lng": 78.532,
    "elevationM": 264,
    "terrainType": "Northern Deccan Forested Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Cotton",
      "Soybean",
      "Pigeonpea"
    ],
    "polygonCoords": [
      [
        19.7091,
        78.487
      ],
      [
        19.7091,
        78.577
      ],
      [
        19.6191,
        78.577
      ],
      [
        19.6191,
        78.487
      ]
    ]
  },
  {
    "id": "telangana_siddipet_302",
    "name": "Siddipet Ranganayaka Sagar",
    "state": "Telangana",
    "district": "Siddipet",
    "isUrban": false,
    "regionalName": "సిద్దిపేట",
    "lat": 18.1018,
    "lng": 78.852,
    "elevationM": 475,
    "terrainType": "Kaleshwaram Lift Canal Basin",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Vegetables",
      "Cotton"
    ],
    "polygonCoords": [
      [
        18.1468,
        78.807
      ],
      [
        18.1468,
        78.897
      ],
      [
        18.0568,
        78.897
      ],
      [
        18.0568,
        78.807
      ]
    ]
  },
  {
    "id": "telangana_suryapet_303",
    "name": "Suryapet Granary Basin",
    "state": "Telangana",
    "district": "Suryapet",
    "isUrban": false,
    "regionalName": "సూర్యాపేట",
    "lat": 17.1439,
    "lng": 79.6239,
    "elevationM": 182,
    "terrainType": "Musiriver Irrigated Plain",
    "drainageAccumulation": 0.45,
    "slopeDeg": 0.8,
    "primaryCrops": [
      "Paddy",
      "Cotton",
      "Chilli"
    ],
    "polygonCoords": [
      [
        17.1889,
        79.5789
      ],
      [
        17.1889,
        79.6689
      ],
      [
        17.0989,
        79.6689
      ],
      [
        17.0989,
        79.5789
      ]
    ]
  }
];
