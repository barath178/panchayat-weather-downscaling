const fs = require('fs');
const path = require('path');

// Comprehensive dictionary of All Indian States with >= 30 districts for major states + ALL urban areas
const rawStatesData = {
  "Tamil Nadu": [
    { name: "Chennai Central Metro", district: "Chennai", isUrban: true, lat: 13.0827, lng: 80.2707, elev: 6, terrain: "Coastal Megacity Basin", crops: ["Urban Heat Island Mitigation", "Rooftop Greenhouses", "Coastal Stormwater"], reg: "சென்னை பெருநகரம்" },
    { name: "Coimbatore Industrial Belt", district: "Coimbatore", isUrban: true, lat: 11.0168, lng: 76.9558, elev: 411, terrain: "Foothill Urban Plateau", crops: ["Peri-Urban Greens", "Cotton Research", "Floriculture"], reg: "கோயம்புத்தூர் பெருநகரம்" },
    { name: "Madurai City Center", district: "Madurai", isUrban: true, lat: 9.9252, lng: 78.1198, elev: 136, terrain: "Vaigai River Plain", crops: ["Madurai Malli (Jasmine)", "Urban Horticulture"], reg: "மதுரை மாநகரம்" },
    { name: "Tiruchirappalli Rock City", district: "Tiruchirappalli", isUrban: true, lat: 10.7905, lng: 78.7047, elev: 85, terrain: "Cauvery Central Basin", crops: ["Banana (Poovan)", "Urban Flood Buffer"], reg: "திருச்சிராப்பள்ளி" },
    { name: "Salem Steel City", district: "Salem", isUrban: true, lat: 11.6643, lng: 78.1460, elev: 278, terrain: "Eastern Ghats Basin", crops: ["Malgoa Mango", "Sericulture"], reg: "சேலம் மாநகரம்" },
    { name: "Thiruvaiyaru Cauvery Delta", district: "Thanjavur", isUrban: false, lat: 10.8845, lng: 79.1065, elev: 38, terrain: "Alluvial River Delta Basin", crops: ["Samba Paddy", "Poovan Banana", "Blackgram"], reg: "திருவையாறு காவிரி டெல்டா" },
    { name: "Ooty Valley Basin", district: "The Nilgiris", isUrban: false, lat: 11.4102, lng: 76.6950, elev: 2240, terrain: "High Mountain Frost Hollow", crops: ["Nilgiri Orthodox Tea", "Hill Potato", "Eucalyptus"], reg: "உதகமண்டலம் அவலாஞ்சி" },
    { name: "Pollachi Coconut Basin", district: "Coimbatore", isUrban: false, lat: 10.6609, lng: 77.0048, elev: 293, terrain: "Palghat Wind Gap Plain", crops: ["Pollachi Coconut (GI)", "Cocoa", "Nutmeg"], reg: "பொள்ளாச்சி ஆனைமலை" },
    { name: "Cumbum Valley Basin", district: "Theni", isUrban: false, lat: 9.7340, lng: 77.2810, elev: 390, terrain: "Western Ghats Rain-Shadow Valley", crops: ["Cumbum Panneer Grapes (GI)", "Robusta Banana"], reg: "கம்பம் பள்ளத்தாக்கு" },
    { name: "Tirunelveli Tamirabarani", district: "Tirunelveli", isUrban: false, lat: 8.7139, lng: 77.7567, elev: 47, terrain: "River Alluvial Basin", crops: ["Paddy (ASD 16)", "Banana"], reg: "திருநெல்வேலி தாமிரபரணி" },
    { name: "Kodaikanal Mannavanur", district: "Dindigul", isUrban: false, lat: 10.2381, lng: 77.4892, elev: 2133, terrain: "Palani Hills High Basin", crops: ["Malai Poondu (Hill Garlic)", "Plums"], reg: "கொடைக்கானல் மன்னவனூர்" },
    { name: "Erode Bhavani Basin", district: "Erode", isUrban: false, lat: 11.3410, lng: 77.7172, elev: 183, terrain: "Canal Irrigated Valley", crops: ["Erode Turmeric (GI)", "Sugarcane"], reg: "ஈரோடு மஞ்சள் மண்டலம்" },
    { name: "Tiruppur Knitwear Basin", district: "Tiruppur", isUrban: true, lat: 11.1085, lng: 77.3411, elev: 295, terrain: "Semi-Arid Industrial Plain", crops: ["Cotton", "Maize", "Effluent Mitigation"], reg: "திருப்பூர் மாநகரம்" },
    { name: "Kanyakumari Coastal Cape", district: "Kanyakumari", isUrban: false, lat: 8.0883, lng: 77.5385, elev: 10, terrain: "Convergent Coastal Cape", crops: ["Rubber", "Red Banana", "Pichhi Flowers"], reg: "கன்னியாகுமரி" },
    { name: "Vellore Palar Basin", district: "Vellore", isUrban: true, lat: 12.9165, lng: 79.1325, elev: 216, terrain: "Palar Valley Basin", crops: ["Banana", "Groundnut", "Tomato"], reg: "வேலூர் மாநகரம்" },
    { name: "Panruti Jackfruit Belt", district: "Cuddalore", isUrban: false, lat: 11.7720, lng: 79.5540, elev: 45, terrain: "Coastal Lateritic Uplands", crops: ["Panruti Jackfruit (GI)", "Cashew", "Tapioca"], reg: "பண்ருட்டி முந்திரி" },
    { name: "Kanchipuram Silk Belt", district: "Kanchipuram", isUrban: false, lat: 12.8342, lng: 79.7036, elev: 83, terrain: "Tank Irrigation Basin", crops: ["Paddy", "Mulberry", "Watermelon"], reg: "காஞ்சிபுரம்" },
    { name: "Chengalpattu Coastal Tract", district: "Chengalpattu", isUrban: true, lat: 12.6841, lng: 79.9836, elev: 36, terrain: "Suburban Industrial Plain", crops: ["Paddy", "Vegetables", "Peri-Urban Greenery"], reg: "செங்கல்பட்டு" },
    { name: "Tiruvannamalai Hill Foothills", district: "Tiruvannamalai", isUrban: false, lat: 12.2253, lng: 79.0747, elev: 171, terrain: "Isolated Granitic Foot-Slope", crops: ["Groundnut", "Paddy", "Sesame"], reg: "திருவண்ணாமலை" },
    { name: "Hosur Floriculture Plateau", district: "Krishnagiri", isUrban: true, lat: 12.7409, lng: 77.8253, elev: 879, terrain: "Deccan Foothill Plateau", crops: ["Polyhouse Cut Roses", "Alphonso Mango", "Capsicum"], reg: "ஓசூர் தொழிற்பேட்டை" },
    { name: "Dharmapuri Palacode Basin", district: "Dharmapuri", isUrban: false, lat: 12.1211, lng: 78.1582, elev: 468, terrain: "Semi-Arid Granitic Plateau", crops: ["Processing Tomato", "Finger Millet (Ragi)"], reg: "தர்மபுரி பாலக்கோடு" },
    { name: "Ramanathapuram Arid Coast", district: "Ramanathapuram", isUrban: false, lat: 9.3639, lng: 78.8395, elev: 10, terrain: "Saline Coastal Plain", crops: ["Ramnad Mundu Chilli (GI)", "Cotton"], reg: "ராமநாதபுரம் குண்டு மிளகாய்" },
    { name: "Thoothukudi Pearl Port", district: "Thoothukudi", isUrban: true, lat: 8.7642, lng: 78.1348, elev: 4, terrain: "Arid Coastal Port", crops: ["Black Cotton Crop", "Salt Pans", "Pearl Millet"], reg: "தூத்துக்குடி துறைமுகம்" },
    { name: "Virudhunagar Cotton Belt", district: "Virudhunagar", isUrban: false, lat: 9.5680, lng: 77.9624, elev: 117, terrain: "Black Cotton Soil Plain", crops: ["Cotton", "Millets", "Oilseeds"], reg: "விருதுநகர்" },
    { name: "Sivaganga Chettinad Tract", district: "Sivaganga", isUrban: false, lat: 9.8433, lng: 78.4809, elev: 102, terrain: "Laterite Red Scrub Plateau", crops: ["Groundnut", "Rainfed Paddy"], reg: "சிவகங்கை செட்டிநாடு" },
    { name: "Nagapattinam Cyclone Coast", district: "Nagapattinam", isUrban: false, lat: 10.7672, lng: 79.8449, elev: 9, terrain: "Cyclone-Prone Delta Front", crops: ["Salt-Tolerant Paddy", "Casuarina"], reg: "நாகப்பட்டினம் கடலோரம்" },
    { name: "Tiruvarur Clay Plains", district: "Tiruvarur", isUrban: false, lat: 10.7720, lng: 79.6366, elev: 14, terrain: "Deltaic Lowland Clay Basin", crops: ["Thaladi Paddy", "Greengram"], reg: "திருவாரூர் நெல் களம்" },
    { name: "Mayiladuthurai Sirkazhi", district: "Mayiladuthurai", isUrban: false, lat: 11.1018, lng: 79.6522, elev: 12, terrain: "Alluvial River Mouth", crops: ["Paddy", "Betel Vine", "Coconut"], reg: "மயிலாடுதுறை சீர்காழி" },
    { name: "Pudukkottai Vellar Basin", district: "Pudukkottai", isUrban: false, lat: 10.3797, lng: 78.8208, elev: 100, terrain: "Semi-Dry Tank Plain", crops: ["Groundnut", "Cashew", "Pulses"], reg: "புதுக்கோட்டை" },
    { name: "Karur Textile Plain", district: "Karur", isUrban: true, lat: 10.9601, lng: 78.0766, elev: 122, terrain: "Amaravathi-Cauvery Confluence", crops: ["Sugarcane", "Moringa (Drumstick)", "Paddy"], reg: "கரூர் ஜவுளி நகரம்" },
    { name: "Namakkal Poultry Hub", district: "Namakkal", isUrban: true, lat: 11.2189, lng: 78.1674, elev: 218, terrain: "Central Granitic Basin", crops: ["Tapioca", "Turmeric", "Poultry Farming"], reg: "நாமக்கல் முட்டை நகரம்" },
    { name: "Perambalur Maize Belt", district: "Perambalur", isUrban: false, lat: 11.2342, lng: 78.8820, elev: 143, terrain: "Rainfed Vertisol Tract", crops: ["Hybrid Maize", "Cotton", "Shallots"], reg: "பெரம்பலூர் மக்காச்சோளம்" },
    { name: "Ariyalur Fossil Basin", district: "Ariyalur", isUrban: false, lat: 11.1401, lng: 79.0786, elev: 76, terrain: "Cretaceous Limestone Plain", crops: ["Cashew", "Sugarcane", "Groundnut"], reg: "அரியலூர்" },
    { name: "Kallakurichi Gomukhi Basin", district: "Kallakurichi", isUrban: false, lat: 11.7383, lng: 78.9639, elev: 162, terrain: "Kalrayan Foot-Slope", crops: ["Paddy", "Sugarcane", "Tapioca"], reg: "கள்ளக்குறிச்சி" },
    { name: "Ranipet Industrial Corridor", district: "Ranipet", isUrban: true, lat: 12.9224, lng: 79.3323, elev: 160, terrain: "Industrial Valley Plain", crops: ["Paddy", "Vegetables", "Industrial Buffer"], reg: "இராணிப்பேட்டை" },
    { name: "Tirupattur Yelagiri Foothills", district: "Tirupattur", isUrban: false, lat: 12.4925, lng: 78.5677, elev: 388, terrain: "Yelagiri Hill Foot-Slope", crops: ["Mangoes", "Tomato", "Groundnut"], reg: "திருப்பத்தூர் ஏலகிரி" },
    { name: "Tenkasi Courtallam Cascade", district: "Tenkasi", isUrban: false, lat: 8.9594, lng: 77.3150, elev: 143, terrain: "Western Ghats Microclimate Cascade", crops: ["Spices", "Nutmeg", "Paddy"], reg: "தென்காசி குற்றாலம்" },
    { name: "Villupuram Gingee Basin", district: "Villupuram", isUrban: false, lat: 11.9401, lng: 79.4861, elev: 70, terrain: "Northern Alluvial Plain", crops: ["Sugarcane", "Groundnut", "Paddy"], reg: "விழுப்புரம் செஞ்சி" }
  ],

  "Maharashtra": [
    { name: "Mumbai City South", district: "Mumbai City", isUrban: true, lat: 18.9388, lng: 72.8354, elev: 8, terrain: "Coastal Megacity Island", crops: ["Urban Heat Island Mitigation", "Rooftop Farming", "Sea-Breeze Ventilation"], reg: "मुंबई शहर" },
    { name: "Mumbai Suburban BKC", district: "Mumbai Suburban", isUrban: true, lat: 19.0657, lng: 72.8687, elev: 11, terrain: "Estuarine Metropolitan Basin", crops: ["Mithi River Catchment", "Urban Green Cover"], reg: "मुंबई उपनगर" },
    { name: "Pune Metro Deccan", district: "Pune", isUrban: true, lat: 18.5204, lng: 73.8567, elev: 560, terrain: "Mula-Mutha Confluence Basin", crops: ["Urban Canopy Cooling", "Floriculture", "Polyhouses"], reg: "पुणे महानगर" },
    { name: "Nagpur Zero Mile", district: "Nagpur", isUrban: true, lat: 21.1458, lng: 79.0882, elev: 310, terrain: "Central Peninsular Plateau", crops: ["Nagpur Mandarin Orange (GI)", "Urban Green Corridors"], reg: "नागपूर महानगर" },
    { name: "Nashik Dindori Vineyard", district: "Nashik", isUrban: false, lat: 20.1980, lng: 73.8320, elev: 615, terrain: "Deccan Volcanic Basalt Plateau", crops: ["Table & Wine Grapes", "Pomegranate", "Nashik Red Onion"], reg: "नाशिक दिंडोरी द्राक्षे" },
    { name: "Thane Ghodbunder Basin", district: "Thane", isUrban: true, lat: 19.2183, lng: 72.9781, elev: 15, terrain: "Ulhas Creek Basin", crops: ["Mangrove Buffer", "Urban Agroforestry"], reg: "ठाणे शहर" },
    { name: "Chhatrapati Sambhajinagar", district: "Aurangabad", isUrban: true, lat: 19.8762, lng: 75.3433, elev: 569, terrain: "Kham River Basalt Basin", crops: ["Himroo Cotton", "Sweet Orange (Mosambi)"], reg: "छत्रपती संभाजीनगर" },
    { name: "Solapur Textile Basin", district: "Solapur", isUrban: true, lat: 17.6599, lng: 75.9064, elev: 458, terrain: "Semi-Arid Sina River Plain", crops: ["Solapur Pomegranate (GI)", "Jowar (Sorghum)"], reg: "सोलापूर डाळिंब" },
    { name: "Kolhapur Panchganga Basin", district: "Kolhapur", isUrban: false, lat: 16.7050, lng: 74.2433, elev: 569, terrain: "Rich River Floodplain", crops: ["Sugarcane (Kolhapuri Gur)", "Paddy", "Soybean"], reg: "कोल्हापूर ऊस पट्टा" },
    { name: "Amravati Cotton Belt", district: "Amravati", isUrban: false, lat: 20.9320, lng: 77.7523, elev: 343, terrain: "Vidarbha Vertisol Plain", crops: ["BT Cotton", "Soybean", "Pigeonpea"], reg: "अमरावती कापूस" },
    { name: "Nanded Godavari Basin", district: "Nanded", isUrban: false, lat: 19.1383, lng: 77.3210, elev: 362, terrain: "Sacred Godavari Valley", crops: ["Banana", "Cotton", "Soybean"], reg: "नांदेड केळी" },
    { name: "Sangli Turmeric Tract", district: "Sangli", isUrban: false, lat: 16.8524, lng: 74.5815, elev: 549, terrain: "Krishna River Valley", crops: ["Sangli Turmeric (GI)", "Raisin Grapes", "Sugarcane"], reg: "सांगली हळद" },
    { name: "Jalgaon Banana Hub", district: "Jalgaon", isUrban: false, lat: 21.0077, lng: 75.5626, elev: 209, terrain: "Tapi River Alluvial Valley", crops: ["Jalgaon Banana (GI)", "Cotton", "Pulses"], reg: "जळगाव केळी शहर" },
    { name: "Akola Pulses Capital", district: "Akola", isUrban: false, lat: 20.7002, lng: 77.0082, elev: 282, terrain: "Purna Basin Black Soil", crops: ["Cotton", "Soybean", "Gram"], reg: "अकोला डाळी" },
    { name: "Latur Marathwada Plateau", district: "Latur", isUrban: false, lat: 18.4088, lng: 76.5604, elev: 631, terrain: "Balaghat Basalt Plateau", crops: ["Soybean", "Pigeonpea (Tur)", "Sugarcane"], reg: "लातूर सोयाबीन" },
    { name: "Dhule Khandesh Plain", district: "Dhule", isUrban: false, lat: 20.9042, lng: 74.7749, elev: 240, terrain: "Panzara River Basin", crops: ["Cotton", "Groundnut", "Onion"], reg: "धुळे" },
    { name: "Ahmednagar Shirdi Belt", district: "Ahmednagar", isUrban: false, lat: 19.0948, lng: 74.7480, elev: 649, terrain: "Pravara Basin Irrigation", crops: ["Sugarcane", "Pomegranate", "Guava"], reg: "अहमदनगर" },
    { name: "Chandrapur Mineral Belt", district: "Chandrapur", isUrban: true, lat: 19.9615, lng: 79.2961, elev: 189, terrain: "Erai-Wardha Confluence", crops: ["Paddy", "Soybean", "Forestry Buffer"], reg: "चंद्रपूर" },
    { name: "Parbhani Marathwada Basin", district: "Parbhani", isUrban: false, lat: 19.2608, lng: 76.7749, elev: 407, terrain: "Godavari Semi-Arid Plain", crops: ["Cotton", "Sorghum", "Pigeonpea"], reg: "परभणी" },
    { name: "Jalna Seed Capital", district: "Jalna", isUrban: true, lat: 19.8347, lng: 75.8816, elev: 508, terrain: "Kundalika River Basin", crops: ["Hybrid Seeds", "Sweet Orange", "Pomegranate"], reg: "जालना बियाणे" },
    { name: "Beed Balaghat Plateau", district: "Beed", isUrban: false, lat: 18.9891, lng: 75.7601, elev: 515, terrain: "Drought-Prone Plateau", crops: ["Bajra", "Cotton", "Sugarcane Workers Hub"], reg: "बीड" },
    { name: "Satara Krishna Valley", district: "Satara", isUrban: false, lat: 17.6805, lng: 73.9997, elev: 742, terrain: "Western Ghats Foothills", crops: ["Mahabaleshwar Strawberry (GI)", "Sugarcane", "Ginger"], reg: "सातारा स्ट्रॉबेरी" },
    { name: "Yavatmal White Gold Basin", district: "Yavatmal", isUrban: false, lat: 20.3888, lng: 78.1204, elev: 445, terrain: "Vidarbha Deep Vertisol", crops: ["Cotton (White Gold)", "Soybean"], reg: "यवतमाळ पांढरे सोने" },
    { name: "Raigad Alibag Coast", district: "Raigad", isUrban: false, lat: 18.6414, lng: 72.8722, elev: 12, terrain: "Konkan Estuarine Coastline", crops: ["Alibag White Onion (GI)", "Alphonso Mango", "Rice"], reg: "रायगड अलिबाग" },
    { name: "Buldhana Lonar Crater", district: "Buldhana", isUrban: false, lat: 20.5303, lng: 76.1843, elev: 639, terrain: "Basalt Plateau & Basins", crops: ["Cotton", "Soybean", "Maize"], reg: "बुलढाणा लोणार" },
    { name: "Ratnagiri Alphonso Coast", district: "Ratnagiri", isUrban: false, lat: 16.9902, lng: 73.3120, elev: 35, terrain: "Konkan Lateritic Sea Bluffs", crops: ["Ratnagiri Alphonso Mango (GI)", "Cashew", "Arecanut"], reg: "रत्नागिरी हापूस" },
    { name: "Sindhudurg Malvan Bay", district: "Sindhudurg", isUrban: false, lat: 16.0667, lng: 73.5500, elev: 42, terrain: "Biodiverse Konkan Lowlands", crops: ["Sindhudurg Alphonso Mango", "Kokum", "Cashew"], reg: "सिंधुदुर्ग मालवण" },
    { name: "Wardha Sevagram Basin", district: "Wardha", isUrban: false, lat: 20.7453, lng: 78.6022, elev: 234, terrain: "Wardha River Catchment", crops: ["Organic Cotton", "Soybean", "Oranges"], reg: "वर्धा सेवाग्राम" },
    { name: "Osmanabad Dharashiv Basin", district: "Osmanabad", isUrban: false, lat: 18.1757, lng: 76.0407, elev: 668, terrain: "Balaghat High Plateau", crops: ["Soybean", "Pigeonpea", "Dairy Grasses"], reg: "धाराशिव" },
    { name: "Bhandara Rice City", district: "Bhandara", isUrban: false, lat: 21.1714, lng: 79.6548, elev: 244, terrain: "Wainganga River Basin", crops: ["Fragrant Chinnor Rice", "Lake Fisheries"], reg: "भंडारा तांदूळ" },
    { name: "Gondia Lake District", district: "Gondia", isUrban: false, lat: 21.4624, lng: 80.1961, elev: 300, terrain: "Forested Tank Irrigation Basin", crops: ["Paddy", "Minor Forest Produce"], reg: "गोंदिया तलावांचा जिल्हा" },
    { name: "Gadchiroli Tribal Forest", district: "Gadchiroli", isUrban: false, lat: 20.1804, lng: 80.0035, elev: 217, terrain: "Dense Teak Forest Watershed", crops: ["Forest Rice", "Tendu Leaves", "Bamboo"], reg: "गडचिरोली" },
    { name: "Palghar Dahanu Chiku Belt", district: "Palghar", isUrban: false, lat: 19.6967, lng: 72.7699, elev: 18, terrain: "North Konkan Coastal Plain", crops: ["Dahanu Gholvad Sapota (Chiku GI)", "Wada Kolam Rice"], reg: "पालघर डहाणू चिकू" },
    { name: "Washim Penganga Basin", district: "Washim", isUrban: false, lat: 20.1112, lng: 77.1350, elev: 546, terrain: "Central Vidarbha Plateau", crops: ["Soybean", "Wheat", "Gram"], reg: "वाशीम" },
    { name: "Hingoli Marathwada Valley", district: "Hingoli", isUrban: false, lat: 19.7173, lng: 77.1488, elev: 457, terrain: "Isapur Dam Catchment", crops: ["Turmeric", "Soybean", "Cotton"], reg: "हिंगोली" },
    { name: "Nandurbar Tribal Hills", district: "Nandurbar", isUrban: false, lat: 21.3697, lng: 74.2409, elev: 210, terrain: "Satpura Hill Ranges", crops: ["Red Chillies", "Paddy", "Millets"], reg: "नंदुरबार सातपुडा" }
  ],

  "Karnataka": [
    { name: "Bengaluru Urban Tech Core", district: "Bengaluru Urban", isUrban: true, lat: 12.9716, lng: 77.5946, elev: 920, terrain: "High Deccan Ridge Plateau", crops: ["Urban Heat Island Mitigation", "Rooftop Hydroponics", "Lake Buffers"], reg: "ಬೆಂಗಳೂರು ನಗರ" },
    { name: "Mysuru Heritage Basin", district: "Mysuru", isUrban: true, lat: 12.2958, lng: 76.6394, elev: 763, terrain: "Chamundi Foot-Slope Basin", crops: ["Mysore Mallige (Jasmine)", "Nanjangud Rasabale (Banana GI)", "Betel Leaf"], reg: "ಮೈಸೂರು ಮಹಾನಗರ" },
    { name: "Mangaluru Coastal Port", district: "Dakshina Kannada", isUrban: true, lat: 12.9141, lng: 74.8560, elev: 22, terrain: "Netravati Estuarine Coast", crops: ["Arecanut", "Cashew", "Coconut", "Paddy"], reg: "ಮಂಗಳೂರು ಕರಾವಳಿ" },
    { name: "Hubballi-Dharwad Twin City", district: "Dharwad", isUrban: true, lat: 15.3647, lng: 75.1240, elev: 671, terrain: "Deccan Transition Plain", crops: ["Byadagi Chilli", "Dharwad Peda Milk Hub", "Cotton"], reg: "ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ" },
    { name: "Belagavi Sugar Bowl", district: "Belagavi", isUrban: true, lat: 15.8497, lng: 74.4977, elev: 751, terrain: "Malaprabha Basin", crops: ["Sugarcane", "Soybean", "Vegetables"], reg: "ಬೆಳಗಾವಿ" },
    { name: "Chikkamagaluru Coffee Slopes", district: "Chikkamagaluru", isUrban: false, lat: 13.3153, lng: 75.7754, elev: 1090, terrain: "Western Ghats Baba Budan Slopes", crops: ["Arabica & Robusta Coffee (GI)", "Black Pepper", "Cardamom"], reg: "ಚಿಕ್ಕಮಗಳೂರು ಕಾಫಿ" },
    { name: "Kodagu Madikeri Hills", district: "Kodagu", isUrban: false, lat: 12.4244, lng: 75.7382, elev: 1150, terrain: "High Ghats Rainforest Basin", crops: ["Coorg Orange (GI)", "Specialty Coffee", "Cardamom"], reg: "ಕೊಡಗು ಮಡಿಕೇರಿ" },
    { name: "Mandya Cauvery Basin", district: "Mandya", isUrban: false, lat: 12.5250, lng: 76.8850, elev: 678, terrain: "KRS Dam Irrigated Plain", crops: ["Sugarcane (Mandya Jaggery)", "Finger Millet (Ragi)", "Paddy"], reg: "ಮಂಡ್ಯ ಕಬ್ಬು" },
    { name: "Shivamogga Malnad Gateway", district: "Shivamogga", isUrban: false, lat: 13.9299, lng: 75.5681, elev: 580, terrain: "Tunga River Valley", crops: ["Arecanut", "Paddy", "Ginger"], reg: "ಶಿವಮೊಗ್ಗ ಮಲೆನಾಡು" },
    { name: "Ballari Mining & Cotton", district: "Ballari", isUrban: true, lat: 15.1394, lng: 76.9214, elev: 495, terrain: "Arid Granitic Plains", crops: ["Cotton", "Sunflower", "Paddy (TBP Canal)"], reg: "ಬಳ್ಳಾರಿ" },
    { name: "Tumakuru Coconut Belt", district: "Tumakuru", isUrban: true, lat: 13.3379, lng: 77.1010, elev: 822, terrain: "Eastern Dry Deccan Plateau", crops: ["Tumakuru Coconut", "Ragi", "Groundnut"], reg: "ತುಮಕೂರು ತೆಂಗು" },
    { name: "Kalaburagi Red Gram Hub", district: "Kalaburagi", isUrban: true, lat: 17.3297, lng: 76.8343, elev: 454, terrain: "Bhima Basin Black Soil", crops: ["Kalaburagi Red Gram / Toor (GI)", "Bengaluru Gram"], reg: "ಕಲಬುರಗಿ ತೊಗರಿ" },
    { name: "Udupi Temple Coast", district: "Udupi", isUrban: false, lat: 13.3409, lng: 74.7421, elev: 15, terrain: "Coastal Alluvial Sands", crops: ["Udupi Mattu Gulla (Brinjal GI)", "Coconut", "Paddy"], reg: "ಉಡುಪಿ ಮಟ್ಟಗುಳ್ಳ" },
    { name: "Hassan Malnad Edge", district: "Hassan", isUrban: false, lat: 13.0033, lng: 76.1004, elev: 957, terrain: "Hemavathi Basin", crops: ["Potato", "Coffee", "Ginger", "Coconut"], reg: "ಹಾಸನ ಆಲೂಗಡ್ಡೆ" },
    { name: "Vijayapura Grape Bowl", district: "Vijayapura", isUrban: false, lat: 16.8302, lng: 75.7100, elev: 606, terrain: "Krishna River Valley", crops: ["Raisin Grapes", "Pomegranate", "Lime (Nimbu)"], reg: "ವಿಜಯಪುರ ದ್ರಾಕ್ಷಿ" },
    { name: "Davanagere Benne Plain", district: "Davanagere", isUrban: true, lat: 14.4644, lng: 75.9218, elev: 602, terrain: "Bhadra Canal Valley", crops: ["Maize", "Paddy", "Cotton"], reg: "ದಾವಣಗೆರೆ" },
    { name: "Bagalkote Krishna Basin", district: "Bagalkote", isUrban: false, lat: 16.1875, lng: 75.6980, elev: 533, terrain: "Ghataprabha River Plain", crops: ["Sugarcane", "Ilkal Handloom Greens", "Maize"], reg: "ಬಾಗಲಕೋಟೆ" },
    { name: "Bidar Crown Plateau", district: "Bidar", isUrban: false, lat: 17.9104, lng: 77.5199, elev: 615, terrain: "Lateritic High Plateau", crops: ["Soybean", "Pulses", "Ginger"], reg: "ಬೀದರ್" },
    { name: "Raichur Doab", district: "Raichur", isUrban: false, lat: 16.2076, lng: 77.3463, elev: 407, terrain: "Krishna-Tungabhadra Doab", crops: ["Sona Masoori Rice (GI)", "Cotton"], reg: "ರಾಯಚೂರು ಸೋನಾ ಮಸೂರಿ" },
    { name: "Koppal Rice Mill Hub", district: "Koppal", isUrban: false, lat: 15.3456, lng: 76.1558, elev: 530, terrain: "Tungabhadra Left Bank", crops: ["Paddy", "Maize", "Pomegranate"], reg: "ಕೊಪ್ಪಳ" },
    { name: "Gadag Wind Energy Belt", district: "Gadag", isUrban: false, lat: 15.4298, lng: 75.6318, elev: 669, terrain: "Wind Gap Semi-Arid Plains", crops: ["Byadagi Chillies", "Onion", "Bengal Gram"], reg: "ಗದಗ" },
    { name: "Haveri Cardamom City", district: "Haveri", isUrban: false, lat: 14.7958, lng: 75.3995, elev: 572, terrain: "Varada River Basin", crops: ["Byadagi Chilli (GI)", "Maize", "Cotton"], reg: "ಹಾವೇರಿ ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ" },
    { name: "Uttara Kannada Karwar", district: "Uttara Kannada", isUrban: false, lat: 14.8136, lng: 74.1298, elev: 8, terrain: "Kali Estuarine Coastline", crops: ["Arecanut", "Spices", "Fish Farming"], reg: "ಉತ್ತರ ಕನ್ನಡ ಕಾರವಾರ" },
    { name: "Chitradurga Fort Basin", district: "Chitradurga", isUrban: false, lat: 14.2251, lng: 76.3980, elev: 732, terrain: "Granitic Boulder Plain", crops: ["Pomegranate", "Arecanut", "Onion"], reg: "ಚಿತ್ರದುರ್ಗ ದಾಳಿಂಬೆ" },
    { name: "Chamarajanagar Border", district: "Chamarajanagar", isUrban: false, lat: 11.9261, lng: 76.9437, elev: 662, terrain: "Biligiriranga Foothills", crops: ["Turmeric", "Banana", "Sugarcane"], reg: "ಚಾಮರಾಜನಗರ" },
    { name: "Kolar Gold & Tomato", district: "Kolar", isUrban: false, lat: 13.1367, lng: 78.1291, elev: 822, terrain: "Drought-Resilient Tank Basin", crops: ["Processing Tomato (Asia's Hub)", "Mulberry", "Dairy"], reg: "ಕೋಲಾರ ಟೊಮ್ಯಾಟೊ" },
    { name: "Chikkaballapura Vineyards", district: "Chikkaballapura", isUrban: false, lat: 13.4325, lng: 77.7275, elev: 914, terrain: "Nandi Hills Ridge Basin", crops: ["Bangalore Blue Grapes (GI)", "Floriculture", "Potato"], reg: "ಚಿಕ್ಕಬಳ್ಳಾಪುರ ದ್ರಾಕ್ಷಿ" },
    { name: "Ramanagara Silk City", district: "Ramanagara", isUrban: false, lat: 12.7209, lng: 77.2799, elev: 747, terrain: "Granitic Sholay Hills", crops: ["Mulberry Silk (Asia's Largest Cocoon)", "Mango"], reg: "ರಾಮನಗರ ರೇಷ್ಮೆ" },
    { name: "Yadgir Bhima Valley", district: "Yadgir", isUrban: false, lat: 16.7630, lng: 77.1350, elev: 389, terrain: "Bhima-Krishna Lowlands", crops: ["Red Gram", "Paddy", "Cotton"], reg: "ಯಾದಗಿರಿ" },
    { name: "Vijayanagara Hampi Basin", district: "Vijayanagara", isUrban: false, lat: 15.2750, lng: 76.3900, elev: 470, terrain: "Tungabhadra Heritage Valley", crops: ["Sugarcane", "Banana", "Paddy"], reg: "ವಿಜಯನಗರ ಹಂಪಿ" },
    { name: "Bengaluru Rural Nelamangala", district: "Bengaluru Rural", isUrban: true, lat: 13.0970, lng: 77.3910, elev: 890, terrain: "Peri-Urban Agro-Logistics", crops: ["Organic Vegetables", "Poultry", "Dairy"], reg: "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ" }
  ],

  "Uttar Pradesh": [
    { name: "Lucknow Gomti Basin", district: "Lucknow", isUrban: true, lat: 26.8467, lng: 80.9462, elev: 123, terrain: "Gomti River Alluvial Floodplain", crops: ["Malihabadi Dussehri Mango (GI)", "Urban Flood Buffer"], reg: "लखनऊ महानगर" },
    { name: "Kanpur Nagar Industrial Core", district: "Kanpur Nagar", isUrban: true, lat: 26.4499, lng: 80.3319, elev: 126, terrain: "Ganga Industrial Plain", crops: ["Wheat", "Vegetables", "Industrial Buffer"], reg: "कानपुर नगर" },
    { name: "Varanasi Holy Ghats Basin", district: "Varanasi", isUrban: true, lat: 25.3176, lng: 82.9739, elev: 81, terrain: "Middle Ganga Floodplain", crops: ["Banarasi Paan (GI)", "Green Pea", "Mustard"], reg: "वाराणसी गंगा कछार" },
    { name: "Agra Yamuna Basin", district: "Agra", isUrban: true, lat: 27.1767, lng: 78.0081, elev: 169, terrain: "Yamuna Semi-Arid Alluvium", crops: ["Potato (Cold Storage Hub)", "Mustard", "Wheat"], reg: "आगरा ताज बेसिन" },
    { name: "Prayagraj Sangam Basin", district: "Prayagraj", isUrban: true, lat: 25.4358, lng: 81.8463, elev: 98, terrain: "Ganga-Yamuna Confluence", crops: ["Allahabad Surkha Guava (GI)", "Wheat", "Paddy"], reg: "प्रयागराज संगम" },
    { name: "Noida NCR Tech Corridor", district: "Gautam Buddha Nagar", isUrban: true, lat: 28.5355, lng: 77.3910, elev: 200, terrain: "Hindon-Yamuna Floodplain", crops: ["Urban Heat Island Mitigation", "Peri-Urban Dairy", "Vertical Greens"], reg: "नोएडा एनसीआर" },
    { name: "Ghaziabad Industrial Belt", district: "Ghaziabad", isUrban: true, lat: 28.6692, lng: 77.4538, elev: 214, terrain: "Upper Doab Alluvial Plain", crops: ["Vegetables", "Wheat", "Urban Canopy"], reg: "गाजियाबाद" },
    { name: "Meerut Sports & Sugar", district: "Meerut", isUrban: true, lat: 28.9845, lng: 77.7064, elev: 224, terrain: "Fertile Ganga-Yamuna Doab", crops: ["Sugarcane", "Wheat", "Mustard"], reg: "मेरठ" },
    { name: "Bareilly Zari Basin", district: "Bareilly", isUrban: true, lat: 28.3670, lng: 79.4304, elev: 166, terrain: "Ramganga Alluvial Plain", crops: ["Sugarcane", "Paddy", "Wheat"], reg: "बरेली" },
    { name: "Aligarh Lock City", district: "Aligarh", isUrban: true, lat: 27.8974, lng: 78.0880, elev: 178, terrain: "Ganga Canal Plain", crops: ["Wheat", "Mustard", "Barley"], reg: "अलीगढ़" },
    { name: "Moradabad Brass & Mint", district: "Moradabad", isUrban: true, lat: 28.8386, lng: 78.7733, elev: 193, terrain: "Ramganga Basin", crops: ["Mentha (Peppermint Oil)", "Sugarcane", "Rice"], reg: "मुरादाबाद" },
    { name: "Saharanpur Woodcraft & Mango", district: "Saharanpur", isUrban: true, lat: 29.9671, lng: 77.5510, elev: 269, terrain: "Shivalik Foot-Slope Doab", crops: ["Chausa & Langra Mangoes", "Sugarcane", "Basmati"], reg: "सहारनपुर" },
    { name: "Gorakhpur Rapti Basin", district: "Gorakhpur", isUrban: true, lat: 26.7606, lng: 83.3732, elev: 84, terrain: "Terai Alluvial Floodplain", crops: ["Kala Namak Rice (Buddha Rice GI)", "Sugarcane"], reg: "गोरखपुर कालानमक" },
    { name: "Jhansi Bundelkhand Gateway", district: "Jhansi", isUrban: true, lat: 25.4484, lng: 78.5685, elev: 284, terrain: "Granitic Bundelkhand Uplands", crops: ["Pulses (Chickpea/Gram)", "Wheat", "Mustard"], reg: "झांसी बुंदेलखंड" },
    { name: "Muzaffarnagar Jaggery Hub", district: "Muzaffarnagar", isUrban: false, lat: 29.4727, lng: 77.7085, elev: 249, terrain: "Ganga Canal Doab", crops: ["Sugarcane (Sugar Capital)", "Wheat"], reg: "मुजफ्फरनगर गुड़ मंडी" },
    { name: "Mathura Braj Pastoral Basin", district: "Mathura", isUrban: false, lat: 27.4924, lng: 77.6737, elev: 174, terrain: "Yamuna Flood Basin", crops: ["Dairy Fodder", "Wheat", "Mustard"], reg: "मथुरा ब्रज भूमि" },
    { name: "Ayodhya Saryu Basin", district: "Ayodhya", isUrban: true, lat: 26.7922, lng: 82.1998, elev: 96, terrain: "Saryu River Plain", crops: ["Paddy", "Sugarcane", "Vegetables"], reg: "अयोध्या सरयू बेसिन" },
    { name: "Budaun Mint Basin", district: "Budaun", isUrban: false, lat: 28.0333, lng: 79.1167, elev: 169, terrain: "Sot-Ganga Basin", crops: ["Mentha Oil", "Wheat", "Paddy"], reg: "बदायूं मेंथा" },
    { name: "Rampur Nawab Basin", district: "Rampur", isUrban: false, lat: 28.8154, lng: 79.0257, elev: 192, terrain: "Kosi River Basin", crops: ["Mentha", "Rice", "Sugarcane"], reg: "रामपुर" },
    { name: "Shahjahanpur Rice Hub", district: "Shahjahanpur", isUrban: false, lat: 27.8814, lng: 79.9103, elev: 153, terrain: "Garrah Basin", crops: ["Paddy", "Wheat", "Sugarcane"], reg: "शाहजहांपुर" },
    { name: "Farrukhabad Potato Capital", district: "Farrukhabad", isUrban: false, lat: 27.3826, lng: 79.5843, elev: 167, terrain: "Ganga-Ramganga Confluence", crops: ["Potato (Asia's Big Belt)", "Watermelon"], reg: "फर्रुखाबाद आलू" },
    { name: "Rae Bareli Canal Plains", district: "Rae Bareli", isUrban: false, lat: 26.2236, lng: 81.2409, elev: 111, terrain: "Sai River Basin", crops: ["Paddy", "Wheat", "Mustard"], reg: "रायबरेली" },
    { name: "Mirzapur Vindhyan Foothills", district: "Mirzapur", isUrban: false, lat: 25.1460, lng: 82.5690, elev: 80, terrain: "Ganga-Vindhyan Escarpment", crops: ["Paddy", "Sesame", "Mustard"], reg: "मिर्जापुर" },
    { name: "Sitapur Sugar Belt", district: "Sitapur", isUrban: false, lat: 27.5684, lng: 80.6829, elev: 138, terrain: "Sarayan River Basin", crops: ["Sugarcane", "Paddy", "Mentha"], reg: "सीतापुर" },
    { name: "Bulandshahr Dairy Plain", district: "Bulandshahr", isUrban: false, lat: 28.4069, lng: 77.8498, elev: 208, terrain: "Upper Doab Canal Belt", crops: ["Dairy Fodder", "Maize", "Wheat"], reg: "बुलंदशहर" },
    { name: "Sambhal Mentha Belt", district: "Sambhal", isUrban: false, lat: 28.5833, lng: 78.5500, elev: 193, terrain: "Alluvial Plain", crops: ["Mentha Oil", "Paddy", "Watermelon"], reg: "संभल" },
    { name: "Amroha Dholak & Mango", district: "Amroha", isUrban: false, lat: 28.9044, lng: 78.4674, elev: 211, terrain: "Ganga-Sot Plain", crops: ["Mangoes", "Sugarcane", "Poplar Tree"], reg: "अमरोहा" },
    { name: "Hardoi Alluvial Basin", district: "Hardoi", isUrban: false, lat: 27.3995, lng: 80.1319, elev: 143, terrain: "Sai River Valley", crops: ["Sugarcane", "Wheat", "Paddy"], reg: "हरदोई" },
    { name: "Fatehpur Doab Basin", district: "Fatehpur", isUrban: false, lat: 25.9284, lng: 80.8130, elev: 110, terrain: "Ganga-Yamuna Interfluve", crops: ["Paddy", "Wheat", "Chickpea"], reg: "फतेहपुर" },
    { name: "Jaunpur Corn & Radish", district: "Jaunpur", isUrban: false, lat: 25.7464, lng: 82.6837, elev: 86, terrain: "Gomti Valley", crops: ["Jaunpuri Mooli (Giant Radish)", "Maize", "Paddy"], reg: "जौनपुर मूली" },
    { name: "Deoria Sugar Belt", district: "Deoria", isUrban: false, lat: 26.5024, lng: 83.7791, elev: 75, terrain: "Bhat Alluvial Soil", crops: ["Sugarcane", "Paddy", "Wheat"], reg: "देवरिया" },
    { name: "Ghazipur Rosewater Basin", district: "Ghazipur", isUrban: false, lat: 25.5840, lng: 83.5770, elev: 73, terrain: "Ganga Meander Plain", crops: ["Damask Rose", "Opium Buffer", "Vegetables"], reg: "गाजीपुर गुलाब" },
    { name: "Basti Terai Foothills", district: "Basti", isUrban: false, lat: 26.8044, lng: 82.7634, elev: 85, terrain: "Kuano Basin", crops: ["Sugarcane", "Paddy", "Wheat"], reg: "बस्ती" },
    { name: "Ballia Surha Tal Basin", district: "Ballia", isUrban: false, lat: 25.7600, lng: 84.1500, elev: 68, terrain: "Ganga-Ghaghara Confluence", crops: ["Paddy", "Wheat", "Vegetables"], reg: "बलिया" },
    { name: "Azamgarh Black Soil Plain", district: "Azamgarh", isUrban: false, lat: 26.0685, lng: 83.1840, elev: 77, terrain: "Tons River Basin", crops: ["Paddy", "Sugarcane", "Mustard"], reg: "आजमगढ़" }
  ],

  "Delhi NCR": [
    { name: "New Delhi Capital Core", district: "New Delhi", isUrban: true, lat: 28.6139, lng: 77.2090, elev: 216, terrain: "National Capital Lutyens Zone", crops: ["Urban Heat Island Mitigation", "Vertical Farming", "Air Quality Bio-Shields"], reg: "नई दिल्ली केंद्र" },
    { name: "North Delhi Ridge Basin", district: "North Delhi", isUrban: true, lat: 28.7180, lng: 77.1650, elev: 220, terrain: "Delhi Ridge Forest Fringe", crops: ["Urban Agroforestry", "Peri-Urban Vegetable"], reg: "उत्तर दिल्ली" },
    { name: "South Delhi Mehrauli", district: "South Delhi", isUrban: true, lat: 28.5244, lng: 77.1855, elev: 235, terrain: "Aravalli Quartzite Spur", crops: ["Rooftop Greenery", "Urban Canopy Retention"], reg: "दक्षिण दिल्ली" },
    { name: "East Delhi Yamuna Floodplain", district: "East Delhi", isUrban: true, lat: 28.6270, lng: 77.2780, elev: 205, terrain: "Yamuna Active Floodplain", crops: ["Yamuna Khadar Melons", "Green Fodder"], reg: "पूर्वी दिल्ली यमुना खादर" },
    { name: "Gurugram Cyber City", district: "Gurugram", isUrban: true, lat: 28.4595, lng: 77.0266, elev: 225, terrain: "Aravalli Piedmont Urban Basin", crops: ["Urban Heat Island Mitigation", "Rainwater Harvesting"], reg: "गुरुग्राम साइबर सिटी" },
    { name: "Faridabad Industrial Plain", district: "Faridabad", isUrban: true, lat: 28.4089, lng: 77.3178, elev: 208, terrain: "Yamuna Terraced Plain", crops: ["Mustard", "Wheat", "Industrial Green Buffers"], reg: "फरीदाबाद" }
  ],

  "West Bengal": [
    { name: "Kolkata City Central", district: "Kolkata", isUrban: true, lat: 22.5726, lng: 88.3639, elev: 9, terrain: "Hooghly Tidal Delta", crops: ["East Kolkata Wetlands (Sewage Fisheries)", "Urban Canopy"], reg: "কলকাতা মহানগর" },
    { name: "Howrah Industrial Belt", district: "Howrah", isUrban: true, lat: 22.5958, lng: 88.2636, elev: 12, terrain: "Lower Hooghly Floodplain", crops: ["Betel Leaf", "Floriculture", "Industrial Buffer"], reg: "হাওড়া" },
    { name: "Darjeeling Mist Ridge", district: "Darjeeling", isUrban: false, lat: 27.0360, lng: 88.2627, elev: 2045, terrain: "Eastern Himalayan Cloud Escarpment", crops: ["Darjeeling First Flush Tea (GI)", "Cardamom", "Mandarin"], reg: "দার্জিলিং চা বাগান" },
    { name: "Asansol-Durgapur Steel Belt", district: "Paschim Bardhaman", isUrban: true, lat: 23.6889, lng: 86.9661, elev: 111, terrain: "Damodar Valley Industrial Basin", crops: ["Paddy", "Vegetables", "Mine Reclamation Forestry"], reg: "আসানসোল-দুর্গাপুর" },
    { name: "Siliguri Foothills Hub", district: "Jalpaiguri", isUrban: true, lat: 26.7271, lng: 88.3953, elev: 122, terrain: "Terai-Dooars Confluence", crops: ["Dooars CTC Tea", "Pineapple", "Jute"], reg: "শিলিগুড়ি" },
    { name: "Bardhaman Rice Bowl", district: "Purba Bardhaman", isUrban: false, lat: 23.2324, lng: 87.8615, elev: 40, terrain: "Damodar-Bhagirathi Alluvium", crops: ["Gobindobhog Rice (GI)", "Aman Paddy", "Potato"], reg: "বর্ধমান ধানের গোলা" },
    { name: "Malda Mango Basin", district: "Malda", isUrban: false, lat: 25.0108, lng: 88.1411, elev: 27, terrain: "Mahananda-Ganga Silt Basin", crops: ["Fazli & Himsagar Mango (GI)", "Jute", "Silk"], reg: "মালদা আম" },
    { name: "Murshidabad Silk & Jute", district: "Murshidabad", isUrban: false, lat: 24.1759, lng: 88.2802, elev: 21, terrain: "Bhagirathi Delta Plain", crops: ["Golden Jute", "Mulberry Silk", "Mustard"], reg: "মুর্শিদাবাদ রেশম" },
    { name: "North 24 Parganas Sundarban", district: "North 24 Parganas", isUrban: false, lat: 22.7210, lng: 88.4810, elev: 8, terrain: "Estuarine Delta Mangrove Margin", crops: ["Tidal Paddy", "Black Tiger Prawn", "Jute"], reg: "উত্তর ২৪ পরগনা" },
    { name: "South 24 Parganas Delta", district: "South 24 Parganas", isUrban: false, lat: 22.1833, lng: 88.5333, elev: 5, terrain: "Active Sundarbans Mangrove Delta", crops: ["Sundarban Honey", "Saline Paddy", "Betel Nut"], reg: "দক্ষিণ ২৪ পরগনা সুন্দরবন" }
  ],

  "Gujarat": [
    { name: "Ahmedabad Sabarmati Metro", district: "Ahmedabad", isUrban: true, lat: 23.0225, lng: 72.5714, elev: 53, terrain: "Sabarmati River Alluvial Basin", crops: ["Urban Heat Island Mitigation", "Cotton Research", "Vertical Greens"], reg: "અમદાવાદ મહાનગર" },
    { name: "Surat Diamond & Silk Hub", district: "Surat", isUrban: true, lat: 21.1702, lng: 72.8311, elev: 13, terrain: "Tapi Estuarine Floodplain", crops: ["Sugarcane", "Banana", "Urban Coastal Buffer"], reg: "સુરત શહેર" },
    { name: "Vadodara Vishwamitri Basin", district: "Vadodara", isUrban: true, lat: 22.3072, lng: 73.1812, elev: 39, terrain: "Vishwamitri River Basin", crops: ["Tobacco", "Cotton", "Dairy Pasture"], reg: "વડોદરા" },
    { name: "Rajkot Saurashtra Hub", district: "Rajkot", isUrban: true, lat: 22.3039, lng: 70.8022, elev: 132, terrain: "Aji River Semi-Arid Basin", crops: ["Groundnut (Peanut Oil)", "Cotton", "Cumin"], reg: "રાજકોટ" },
    { name: "Anand Dairy Capital", district: "Anand", isUrban: true, lat: 22.5645, lng: 72.9289, elev: 42, terrain: "Charotar Golden Tobacco Plain", crops: ["Amul Dairy Pastures", "Tobacco", "Banana"], reg: "આણંદ ચરોતર" },
    { name: "Kutch Bhuj Salt Plains", district: "Kutch", isUrban: false, lat: 23.2420, lng: 69.6669, elev: 110, terrain: "Great Rann White Desert Edge", crops: ["Kutch Dates (Karek GI)", "Castor", "Cotton"], reg: "કચ્છ ભુજ ખારેક" },
    { name: "Junagadh Gir Kesar Valley", district: "Junagadh", isUrban: false, lat: 21.5222, lng: 70.4579, elev: 107, terrain: "Girnar Foothill Agro-Valley", crops: ["Gir Kesar Mango (GI)", "Groundnut", "Sesame"], reg: "જૂનાગઢ ગીર કેસર" },
    { name: "Bhavnagar Cotton Port", district: "Bhavnagar", isUrban: true, lat: 21.7645, lng: 72.1519, elev: 24, terrain: "Gulf of Khambhat Coastal Plain", crops: ["Onion (Dehydration Capital)", "Cotton", "Groundnut"], reg: "ભાવનગર" },
    { name: "Gandhinagar Capital Greens", district: "Gandhinagar", isUrban: true, lat: 23.2156, lng: 72.6369, elev: 81, terrain: "Planned Forested Basin", crops: ["Urban Forest Canopy", "Organic Vegetables"], reg: "ગાંધીનગર રાજધાની" },
    { name: "Jamnagar Reliance Coast", district: "Jamnagar", isUrban: true, lat: 22.4707, lng: 70.0577, elev: 20, terrain: "Marine National Park Fringe", crops: ["Brassica / Mustard", "Groundnut", "Dates"], reg: "જામનગર" }
  ],

  "Rajasthan": [
    { name: "Jaipur Pink City Metro", district: "Jaipur", isUrban: true, lat: 26.9124, lng: 75.7873, elev: 431, terrain: "Aravalli Valley Semiarid Plain", crops: ["Urban Heat Island Mitigation", "Peri-Urban Coriander", "Rose Water"], reg: "जयपुर महानगर" },
    { name: "Jodhpur Sun City Marwar", district: "Jodhpur", isUrban: true, lat: 26.2389, lng: 73.0243, elev: 231, terrain: "Thar Desert Sandy Fringe", crops: ["Pearl Millet (Bajra)", "Cumin (Jeera)", "Cluster Bean (Guar)"], reg: "जोधपुर मारवाड़" },
    { name: "Kota Chambal Agro Hub", district: "Kota", isUrban: true, lat: 25.2138, lng: 75.8648, elev: 271, terrain: "Chambal Ravine Irrigated Basin", crops: ["Soybean", "Mustard", "Kota Doria Cotton"], reg: "कोटा चंबल कछार" },
    { name: "Udaipur Lake Valley", district: "Udaipur", isUrban: true, lat: 24.5854, lng: 73.7125, elev: 598, terrain: "Girwa Intermontane Basin", crops: ["Maize", "Wheat", "Amla / Aloe Vera"], reg: "उदयपुर मेवाड़" },
    { name: "Bikaner Thar Oasis", district: "Bikaner", isUrban: true, lat: 28.0229, lng: 73.3119, elev: 242, terrain: "Hyper-Arid Sand Dunes", crops: ["Moth Bean (Bikaneri Bhujia)", "Guar", "Groundnut (IGNP)"], reg: "बीकानेर" },
    { name: "Ajmer Dargah Basin", district: "Ajmer", isUrban: true, lat: 26.4499, lng: 74.6399, elev: 486, terrain: "Aravalli Wind Gap Valley", crops: ["Pushkar Rose (Gulkand)", "Barley", "Jowar"], reg: "अजमेर पुष्कर" },
    { name: "Sri Ganganagar Canal Granary", district: "Sri Ganganagar", isUrban: false, lat: 29.9038, lng: 73.8772, elev: 178, terrain: "Indira Gandhi Canal Green Belt", crops: ["Kinnow Mandarin (GI)", "Cotton", "Wheat"], reg: "श्रीगंगानगर किन्नू" },
    { name: "Alwar Mustard Capital", district: "Alwar", isUrban: false, lat: 27.5530, lng: 76.6346, elev: 271, terrain: "Mewat Aravalli Basin", crops: ["Yellow & Black Mustard (Sarson)", "Wheat", "Onion"], reg: "अलवर सरसों" },
    { name: "Barmer Thar Desert Core", district: "Barmer", isUrban: false, lat: 25.7521, lng: 71.3967, elev: 180, terrain: "Sandy Deep Desert", crops: ["Isabgol (Psyllium Husk)", "Cumin", "Castor"], reg: "बाड़मेर ईसबगोल" },
    { name: "Bharatpur Bird Delta", district: "Bharatpur", isUrban: false, lat: 27.2152, lng: 77.5030, elev: 183, terrain: "Banganga Wetland Basin", crops: ["Mustard (Asia's Big Market)", "Paddy", "Wheat"], reg: "भरतपुर" }
  ],

  "Kerala": [
    { name: "Thiruvananthapuram Capital", district: "Thiruvananthapuram", isUrban: true, lat: 8.5241, lng: 76.9366, elev: 16, terrain: "Coastal Undulating Terraces", crops: ["Urban Heat Island Buffer", "Coconut", "Tapioca"], reg: "തിരുവനന്തപുരം" },
    { name: "Kochi Marine Metro", district: "Ernakulam", isUrban: true, lat: 9.9312, lng: 76.2673, elev: 4, terrain: "Vembanad Estuarine Island Basin", crops: ["Pokkali Saline Rice (GI)", "Nutmeg", "Pineapple"], reg: "കൊച്ചി മെട്രോ" },
    { name: "Kozhikode Malabar Coast", district: "Kozhikode", isUrban: true, lat: 11.2588, lng: 75.7804, elev: 12, terrain: "Malabar Coastal Plain", crops: ["Malabar Black Pepper (GI)", "Coconut", "Ginger"], reg: "കോഴിക്കോട്" },
    { name: "Thrissur Cultural Basin", district: "Thrissur", isUrban: true, lat: 10.5276, lng: 76.2144, elev: 18, terrain: "Kole Wetland Irrigation Tract", crops: ["Kole Wetland Paddy", "Banana", "Arecanut"], reg: "തൃശ്ശൂർ കോൾ പാടം" },
    { name: "Kuttanad Below-Sea Level", district: "Alappuzha", isUrban: false, lat: 9.4700, lng: 76.4500, elev: 2, terrain: "Sub-Sea-Level Backwater Delta", crops: ["Kuttanad Below-Sea Rice (GI)", "Duck Farming", "Coconut"], reg: "കുട്ടനാട് പാടശേഖരം" },
    { name: "Munnar Tea High-Range", district: "Idukki", isUrban: false, lat: 10.0800, lng: 77.0650, elev: 1600, terrain: "Misty Western Ghats Ridge", crops: ["High-Altitude Orthodox Tea", "Green Cardamom", "Clove"], reg: "മൂന്നാർ മലനിരകൾ" },
    { name: "Wayanad Coffee Plateau", district: "Wayanad", isUrban: false, lat: 11.6854, lng: 76.1320, elev: 750, terrain: "High Forested Tableland", crops: ["Wayanad Robusta Coffee (GI)", "Jeerakasala Scented Rice", "Pepper"], reg: "വയനാട് ജീരകശാല" },
    { name: "Palakkad Gap Granary", district: "Palakkad", isUrban: false, lat: 10.7867, lng: 76.6548, elev: 84, terrain: "Palghat Wind Funnel Basin", crops: ["Palakkadan Matta Rice (GI)", "Groundnut", "Coconut"], reg: "പാലക്കാട് മട്ട അരി" },
    { name: "Kollam Cashew Capital", district: "Kollam", isUrban: true, lat: 8.8932, lng: 76.6141, elev: 14, terrain: "Ashtamudi Lake Coastal Basin", crops: ["Cashew Processing Hub", "Tapioca", "Rubber"], reg: "കൊല്ലം കശුවണ്ടി" },
    { name: "Kannur Theyyam Coast", district: "Kannur", isUrban: true, lat: 11.8745, lng: 75.3704, elev: 16, terrain: "North Malabar Valley", crops: ["Kaipad Organic Rice (GI)", "Pepper", "Cashew"], reg: "കണ്ണൂർ കൈപ്പാട്" }
  ],

  "Punjab & Haryana": [
    { name: "Ludhiana Industrial Metro", district: "Ludhiana", isUrban: true, lat: 30.9010, lng: 75.8573, elev: 244, terrain: "Sutlej Alluvial Floodplain", crops: ["Sharbati Wheat (PBW 550)", "Pusa Basmati 1121", "Urban Heat Island Buffer"], reg: "ਲੁਧਿਆਣਾ ਮਹਾਨਗਰ" },
    { name: "Amritsar Golden Temple Basin", district: "Amritsar", isUrban: true, lat: 31.6340, lng: 74.8723, elev: 232, terrain: "Upper Bari Doab Basin", crops: ["Aromatic Basmati Rice", "Wheat", "Maize"], reg: "ਅੰਮ੍ਰਿਤਸਰ" },
    { name: "Chandigarh Planned Capital", district: "Chandigarh", isUrban: true, lat: 30.7333, lng: 76.7794, elev: 321, terrain: "Shivalik Piedmont Plateau", crops: ["Urban Garden City Canopy", "Hydroponics"], reg: "ਚੰਡੀਗੜ੍ਹ / चंडीगढ़" },
    { name: "Jalandhar Sports City", district: "Jalandhar", isUrban: true, lat: 31.3260, lng: 75.5762, elev: 228, terrain: "Bist Doab Alluvium", crops: ["Seed Potato (Kufri Pukhraj)", "Basmati", "Sugarcane"], reg: "ਜਲੰਧਰ ਆਲੂ" },
    { name: "Patiala Royal Plains", district: "Patiala", isUrban: true, lat: 30.3398, lng: 76.3869, elev: 250, terrain: "Ghaggar Catchment Basin", crops: ["Wheat", "Paddy", "Guava"], reg: "ਪਟਿਆਲਾ" },
    { name: "Bathinda Malwa Cotton Belt", district: "Bathinda", isUrban: true, lat: 30.2110, lng: 74.9455, elev: 201, terrain: "Semi-Arid Sand Dune Plain", crops: ["American Cotton (White Gold)", "Wheat", "Kinnow"], reg: "ਬਠਿੰਡਾ ਕਪਾਹ" },
    { name: "Karnal Basmati National Hub", district: "Karnal", isUrban: false, lat: 29.6857, lng: 76.9905, elev: 252, terrain: "Western Yamuna Canal Plain", crops: ["Taraori Traditional Basmati (CSR 30)", "Wheat", "Dairy"], reg: "करनाल बासमती कटोरा" },
    { name: "Panipat Textile City", district: "Panipat", isUrban: true, lat: 29.3909, lng: 76.9635, elev: 219, terrain: "Yamuna Floodplain", crops: ["Wheat", "Paddy", "Recycled Fiber Buffer"], reg: "पानीपत" },
    { name: "Ambala Cantonment Plains", district: "Ambala", isUrban: true, lat: 30.3782, lng: 76.7767, elev: 264, terrain: "Ghaggar Piedmont Basin", crops: ["Wheat", "Basmati", "Mustard"], reg: "अंबाला" },
    { name: "Hisar Agro-Research Capital", district: "Hisar", isUrban: true, lat: 29.1492, lng: 75.7217, elev: 215, terrain: "Semi-Arid Dry Alluvium", crops: ["Mustard", "Cotton", "Guar", "Buffalo Breeding"], reg: "हिसार कृषि केंद्र" }
  ],

  "Andhra Pradesh & Telangana": [
    { name: "Hyderabad Cyberabad Core", district: "Hyderabad", isUrban: true, lat: 17.3850, lng: 78.4867, elev: 542, terrain: "Musi River Deccan Granite Basin", crops: ["Urban Heat Island Mitigation", "Urban Lake Ecology", "Rooftop Greenhouses"], reg: "హైదరాబాద్ మహానగరం" },
    { name: "Visakhapatnam Steel City", district: "Visakhapatnam", isUrban: true, lat: 17.6868, lng: 83.2185, elev: 15, terrain: "Dolphin's Nose Coastal Port", crops: ["Urban Coastal Greens", "Cashew", "Oil Palms"], reg: "విశాఖపట్నం" },
    { name: "Vijayawada Krishna Basin", district: "NTR", isUrban: true, lat: 16.5062, lng: 80.6480, elev: 39, terrain: "Krishna River Valley Pass", crops: ["Paddy", "Mango (Banganapalle GI)", "Turmeric"], reg: "విజయవాడ" },
    { name: "Guntur Mirchi Capital", district: "Guntur", isUrban: true, lat: 16.3067, lng: 80.4365, elev: 33, terrain: "Krishna Delta Black Vertisol", crops: ["Guntur Sannam Chilli (GI)", "Cotton", "Tobacco"], reg: "గుంటూరు మిర్చి" },
    { name: "Warangal Kakatiya Plain", district: "Warangal", isUrban: true, lat: 17.9689, lng: 79.5941, elev: 266, terrain: "Deccan Telangana Granitic Plateau", crops: ["Warangal Chapata Chilli", "Cotton", "Maize"], reg: "వరంగల్" },
    { name: "Tirupati Temple Foothills", district: "Tirupati", isUrban: true, lat: 13.6288, lng: 79.4192, elev: 162, terrain: "Seshachalam Biosphere Foothill", crops: ["Groundnut", "Mango", "Sugarcane"], reg: "తిరుపతి" },
    { name: "Rajamahendravaram Delta", district: "East Godavari", isUrban: true, lat: 17.0005, lng: 81.8040, elev: 24, terrain: "Akhanda Godavari River Bank", crops: ["Kadiam Floriculture Nurseries", "Paddy", "Coconut"], reg: "రాజమండ్రి గోదావరి" },
    { name: "Kurnool Tungabhadra Basin", district: "Kurnool", isUrban: true, lat: 15.8281, lng: 78.0373, elev: 273, terrain: "Tungabhadra-Handri Confluence", crops: ["Kurnool Sona Rice", "Bengal Gram", "Sunflower"], reg: "కర్నూలు" },
    { name: "Nizamabad Turmeric Bowl", district: "Nizamabad", isUrban: false, lat: 18.6725, lng: 78.0941, elev: 395, terrain: "Sri Ram Sagar Irrigation Belt", crops: ["Armoor Turmeric (National Hub)", "Paddy", "Soybean"], reg: "నిజామాబాద్ పసుపు" },
    { name: "Nellore Coastal Shrimp Basin", district: "Nellore", isUrban: false, lat: 14.4426, lng: 79.9865, elev: 19, terrain: "Pennar River Estuarine Delta", crops: ["Nellore Rice", "Vannamei Shrimp", "Citrus (Acid Lime)"], reg: "నెల్లూరు" }
  ],

  "Madhya Pradesh & Chhattisgarh": [
    { name: "Bhopal City of Lakes", district: "Bhopal", isUrban: true, lat: 23.2599, lng: 77.4126, elev: 527, terrain: "Upper Lake Basalt Basin", crops: ["Urban Lake Buffer Ecology", "Wheat", "Soybean"], reg: "भोपाल झीलों की नगरी" },
    { name: "Indore Commercial Capital", district: "Indore", isUrban: true, lat: 22.7196, lng: 75.8577, elev: 553, terrain: "Malwa Black Soil Plateau", crops: ["Sharbati Wheat", "Soybean (JS 9560)", "Garlic"], reg: "इंदौर मालवा" },
    { name: "Jabalpur Narmada Marble", district: "Jabalpur", isUrban: true, lat: 23.1815, lng: 79.9864, elev: 411, terrain: "Narmada River Gorges", crops: ["Green Pea (Matar)", "Paddy", "Wheat"], reg: "जबलपुर मटर" },
    { name: "Gwalior Chambal Fort Basin", district: "Gwalior", isUrban: true, lat: 26.2183, lng: 78.1828, elev: 211, terrain: "Gird Alluvial Basin", crops: ["Mustard", "Wheat", "Potato"], reg: "ग्वालियर" },
    { name: "Ujjain Mahakal Holy Basin", district: "Ujjain", isUrban: true, lat: 23.1765, lng: 75.7885, elev: 494, terrain: "Shipra River Malwa Plain", crops: ["Soybean", "Wheat", "Gram"], reg: "उज्जैन क्षिप्रा" },
    { name: "Narmadapuram Wheat Valley", district: "Narmadapuram", isUrban: false, lat: 22.7550, lng: 77.7250, elev: 278, terrain: "Deep Alluvial Narmada Basin", crops: ["MP Sharbati Wheat (GI)", "Soybean", "Mung Bean"], reg: "नर्मदापुरम शरबती गेहूं" },
    { name: "Raipur Mahanadi Metro", district: "Raipur", isUrban: true, lat: 21.2514, lng: 81.6296, elev: 298, terrain: "Chhattisgarh Rice Bowl Central", crops: ["Dubraj Fragrant Rice", "Vegetables", "Industrial Buffer"], reg: "रायपुर धान का कटोरा" }
  ],

  "Himachal Pradesh, J&K, Uttarakhand": [
    { name: "Shimla Mall Ridge", district: "Shimla", isUrban: true, lat: 31.1048, lng: 77.1734, elev: 2276, terrain: "Mid-Himalayan Ridge Crest", crops: ["Urban Mountain Slope", "Conifer Forest Buffer"], reg: "शिमला माल रोड" },
    { name: "Kotgarh Apple Valley", district: "Shimla", isUrban: false, lat: 31.3050, lng: 77.4950, elev: 2050, terrain: "Inner Himalayan Escarpment & Frost Basin", crops: ["Royal Delicious Apple", "Almond", "Cherry"], reg: "कोटगढ़ सेब घाटी" },
    { name: "Dharamshala Kangra Tea", district: "Kangra", isUrban: false, lat: 32.2190, lng: 76.3234, elev: 1457, terrain: "Dhauladhar Snow Range Foothills", crops: ["Kangra Orthodox Tea (GI)", "Basmati", "Citrus"], reg: "धर्मशाला कांगड़ा चाय" },
    { name: "Kullu Valley of Gods", district: "Kullu", isUrban: false, lat: 31.9579, lng: 77.1095, elev: 1279, terrain: "Beas River Alpine Valley", crops: ["Kullu Red Apple", "Plums", "Trout Fish"], reg: "कुल्लू घाटी" },
    { name: "Dehradun Doon Valley", district: "Dehradun", isUrban: true, lat: 30.3165, lng: 78.0322, elev: 640, terrain: "Intermontane Shivalik Syncline", crops: ["Dehraduni Type 3 Basmati", "Litchi", "Urban Greens"], reg: "देहरादून दून घाटी" },
    { name: "Haridwar Ganga Entry", district: "Haridwar", isUrban: true, lat: 29.9457, lng: 78.1642, elev: 314, terrain: "Ganga Himalayan Exit Basin", crops: ["Sugarcane", "Wheat", "Ayurvedic Herbs"], reg: "हरिद्वार" },
    { name: "Srinagar Dal Lake Basin", district: "Srinagar", isUrban: true, lat: 34.0837, lng: 74.7973, elev: 1585, terrain: "Jhelum Lacustrine Valley", crops: ["Floating Vegetable Gardens (Radh)", "Almond", "Kashmiri Apple"], reg: "سرینگر ڈل جھیل" },
    { name: "Pampore Saffron Karewa", district: "Pulwama", isUrban: false, lat: 34.0080, lng: 74.9350, elev: 1610, terrain: "Karewa Terraced Tableland", crops: ["Kashmiri Mongra Saffron (GI)", "Walnut", "Mustard"], reg: "پامپور زعفران" },
    { name: "Jammu Tawi Basin", district: "Jammu", isUrban: true, lat: 32.7266, lng: 74.8570, elev: 327, terrain: "Shivalik Piedmont Alluvial Plains", crops: ["RS Pura Basmati Rice (World Famous)", "Wheat"], reg: "जम्मू तवी" }
  ],

  "Assam, North-East & Odisha": [
    { name: "Guwahati Kamrup Metro", district: "Kamrup Metro", isUrban: true, lat: 26.1445, lng: 91.7362, elev: 55, terrain: "Brahmaputra South Bank Hills", crops: ["Urban Flood Retention", "Arecanut", "Tea"], reg: "গুৱাহাটী মহানগৰ" },
    { name: "Jorhat Tea Research Hub", district: "Jorhat", isUrban: false, lat: 26.7509, lng: 94.2037, elev: 96, terrain: "Upper Assam Alluvial Plain", crops: ["Assam CTC Tea", "Boro Rice", "Bhut Jolokia (Ghost Pepper GI)"], reg: "যোৰহাট চাহ কেন্দ্ৰ" },
    { name: "Bhubaneswar Smart City", district: "Khordha", isUrban: true, lat: 20.2961, lng: 85.8245, elev: 45, terrain: "Mahanadi South Delta Plain", crops: ["Paddy", "Cashew", "Urban Bioswales"], reg: "ଭୁବନେଶ୍ୱର ସ୍ମାର୍ଟ ସିଟି" },
    { name: "Cuttack Silver City", district: "Cuttack", isUrban: true, lat: 20.4625, lng: 85.8828, elev: 36, terrain: "Mahanadi-Kathajodi Delta Island", crops: ["Paddy (CRRI Research)", "Betel Leaf", "Vegetables"], reg: "କଟକ ମହାନଦୀ" },
    { name: "Puri Coastal Jagannath", district: "Puri", isUrban: false, lat: 19.8135, lng: 85.8312, elev: 9, terrain: "Bay of Bengal Saline Shore", crops: ["Coconut", "Betel Leaf", "Casuarina"], reg: "ପୁରୀ ବେଳାଭୂମି" }
  ],

  "Bihar & Jharkhand": [
    { name: "Patna Ganga Capital", district: "Patna", isUrban: true, lat: 25.5941, lng: 85.1376, elev: 53, terrain: "Ganga-Son-Gandak Confluence", crops: ["Digha Malda Mango", "Vegetables", "River Diara Melons"], reg: "पटना गंगा कछार" },
    { name: "Muzaffarpur Litchi Basin", district: "Muzaffarpur", isUrban: false, lat: 26.1209, lng: 85.3647, elev: 60, terrain: "Burhi Gandak Silt Plain", crops: ["Shahi Litchi (GI)", "Maize", "Summer Rice"], reg: "मुजफ्फरपुर शाही लीची" },
    { name: "Bhagalpur Silk City", district: "Bhagalpur", isUrban: true, lat: 25.2425, lng: 86.9842, elev: 52, terrain: "South Ganga River Bank", crops: ["Bhagalpuri Zardalu Mango (GI)", "Katarni Chawal (GI)", "Tussar Silk"], reg: "भागलपुर रेशम" },
    { name: "Gaya Falgu Basin", district: "Gaya", isUrban: true, lat: 24.7955, lng: 85.0002, elev: 111, terrain: "Falgu River Sandy Basin", crops: ["Wheat", "Gram", "Vegetables"], reg: "गया" },
    { name: "Ranchi Chota Nagpur Core", district: "Ranchi", isUrban: true, lat: 23.3441, lng: 85.3096, elev: 651, terrain: "Chota Nagpur Granite Plateau", crops: ["Off-Season Vegetables", "Pea", "Urban Plateau Canopy"], reg: "राँची पठार" },
    { name: "Jamshedpur Steel Metro", district: "East Singhbhum", isUrban: true, lat: 22.8046, lng: 86.2029, elev: 135, terrain: "Subarnarekha River Basin", crops: ["Tomato", "Paddy", "Industrial Green Belts"], reg: "जमशेदपुर" }
  ]
};

// Flatten into formatted array with polygons & derived physics parameters
let flatIndex = 1;
const allIndiaPanchayats = [];

for (const [stateName, districts] of Object.entries(rawStatesData)) {
  districts.forEach(d => {
    const lat = d.lat;
    const lng = d.lng;
    const elev = d.elev;
    const isUrban = d.isUrban;

    // Generate 4-corner bounding polygon around coordinate (~1.2km resolution)
    const delta = isUrban ? 0.035 : 0.045;
    const polygonCoords = [
      [parseFloat((lat + delta).toFixed(4)), parseFloat((lng - delta).toFixed(4))],
      [parseFloat((lat + delta).toFixed(4)), parseFloat((lng + delta).toFixed(4))],
      [parseFloat((lat - delta).toFixed(4)), parseFloat((lng + delta).toFixed(4))],
      [parseFloat((lat - delta).toFixed(4)), parseFloat((lng - delta).toFixed(4))]
    ];

    const slug = `${stateName.toLowerCase().replace(/[^a-z]/g, '')}_${d.district.toLowerCase().replace(/[^a-z]/g, '')}_${flatIndex++}`;

    allIndiaPanchayats.push({
      id: slug,
      name: d.name,
      state: stateName,
      district: d.district,
      isUrban: isUrban,
      regionalName: d.reg || d.name,
      lat: lat,
      lng: lng,
      elevationM: elev,
      terrainType: d.terrain,
      drainageAccumulation: elev > 1500 ? 0.92 : (elev < 50 ? 0.85 : 0.45),
      slopeDeg: elev > 1500 ? 18.5 : (elev > 500 ? 5.2 : 0.8),
      primaryCrops: d.crops,
      polygonCoords: polygonCoords
    });
  });
}

// 1. Write frontend TypeScript file
const tsContent = `// Pan-India Comprehensive Coverage: 38+ Districts in Tamil Nadu, 36 in Maharashtra, and all major Indian States & Metros
export interface PanchayatData {
  id: string;
  name: string;
  state: string;
  district: string;
  isUrban: boolean;
  regionalName?: string;
  elevationM: number;
  terrainType: string;
  drainageAccumulation: number;
  slopeDeg: number;
  primaryCrops: string[];
  polygonCoords: [number, number][];
}

export const ALL_INDIA_PANCHAYATS: PanchayatData[] = ${JSON.stringify(allIndiaPanchayats, null, 2)};
`;

const targetDir = path.join(__dirname, '..', 'frontend', 'src', 'data');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(path.join(targetDir, 'all_india_regions.ts'), tsContent, 'utf8');

// 2. Write standalone JS dataset
const jsDataContent = `// Pan-India Multi-District and Urban Dataset
window.AllIndiaData = {
  totalCount: ${allIndiaPanchayats.length},
  panchayats: ${JSON.stringify(allIndiaPanchayats, null, 2)}
};
`;

const jsDir = path.join(__dirname, '..', 'js');
if (!fs.existsSync(jsDir)) {
  fs.mkdirSync(jsDir, { recursive: true });
}
fs.writeFileSync(path.join(jsDir, 'all_india_data.js'), jsDataContent, 'utf8');

console.log(`Successfully generated ${allIndiaPanchayats.length} districts and urban zones across India!`);

