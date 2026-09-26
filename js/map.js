/**
 * AeroAgro AI - Google Maps GIS Controller
 * Manages Google Maps (Terrain, Satellite, Dark Styled),
 * Polygon Choropleth layers, Coarse vs Fine resolution overlays,
 * Elevation markers, and interactive selection.
 */

window.MapController = {
  map: null,
  panchayatPolygons: {},
  coarseRectangle: null,
  markers: [],
  currentVariable: "rainfall", // rainfall | temp | frost | spray
  viewMode: "fine", // fine (downscaled) | coarse (flat block)
  selectedPanchayatId: null,

  darkStyle: [
    { elementType: 'geometry', stylers: [{ color: '#0d1322' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1322' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#f8fafc' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f172a' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#06182c' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#38bdf8' }] },
  ],

  /**
   * Initialize Google Map
   */
  init: function(mapElementId, initialPanchayatId) {
    const region = window.AgroData.region;
    this.selectedPanchayatId = initialPanchayatId || window.AgroData.panchayats[0].id;
    const mapElement = document.getElementById(mapElementId);
    if (!mapElement) return;

    const startMap = () => {
      if (!window.google || !window.google.maps) return;

      this.map = new window.google.maps.Map(mapElement, {
        center: { lat: region.center[0], lng: region.center[1] },
        zoom: region.defaultZoom,
        styles: this.darkStyle,
        mapTypeId: 'roadmap',
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
      });

      this.renderCoarseGrid();
      this.renderPanchayats();
      this.updateChoropleth();
    };

    if (window.google && window.google.maps) {
      startMap();
    } else {
      window.initGoogleMapStandalone = startMap;
    }
  },

  /**
   * Set Google Map Type (Dark Styled, Official Terrain, Satellite Hybrid)
   */
  setMapType: function(type) {
    if (!this.map) return;
    if (type === 'dark') {
      this.map.setMapTypeId('roadmap');
      this.map.setOptions({ styles: this.darkStyle });
    } else if (type === 'terrain') {
      this.map.setMapTypeId('terrain');
      this.map.setOptions({ styles: [] }); // Google elevation contours
    } else if (type === 'hybrid') {
      this.map.setMapTypeId('hybrid');
      this.map.setOptions({ styles: [] }); // Google Earth satellite
    }
  },

  /**
   * Render Coarse 18km Block Bounding Box
   */
  renderCoarseGrid: function() {
    const coarse = window.AgroData.coarseGrid;
    this.coarseRectangle = new window.google.maps.Rectangle({
      strokeColor: '#f59e0b',
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: '#f59e0b',
      fillOpacity: this.viewMode === 'coarse' ? 0.45 : 0.06,
      map: this.map,
      bounds: {
        north: coarse.bounds[1][0],
        south: coarse.bounds[0][0],
        east: coarse.bounds[1][1],
        west: coarse.bounds[0][1],
      },
    });
  },

  /**
   * Render Panchayat polygons and elevation markers
   */
  renderPanchayats: function() {
    window.AgroData.panchayats.forEach(p => {
      const coords = p.polygonCoords.map(c => ({ lat: c[0], lng: c[1] }));
      const isSelected = p.id === this.selectedPanchayatId;

      const poly = new window.google.maps.Polygon({
        paths: coords,
        strokeColor: isSelected ? '#10b981' : '#ffffff',
        strokeOpacity: isSelected ? 1.0 : 0.6,
        strokeWeight: isSelected ? 3.5 : 1.5,
        fillColor: '#10b981',
        fillOpacity: this.viewMode === 'coarse' ? 0.25 : 0.75,
        map: this.map,
      });

      poly.addListener('click', () => {
        window.App.selectPanchayat(p.id);
      });

      poly.addListener('mouseover', () => {
        poly.setOptions({ strokeColor: '#38bdf8', strokeWeight: 3 });
      });

      poly.addListener('mouseout', () => {
        const selected = p.id === this.selectedPanchayatId;
        poly.setOptions({
          strokeColor: selected ? '#10b981' : '#ffffff',
          strokeWeight: selected ? 3.5 : 1.5,
        });
      });

      this.panchayatPolygons[p.id] = poly;

      // Elevation Marker
      const centerLat = coords.reduce((acc, c) => acc + c.lat, 0) / coords.length;
      const centerLng = coords.reduce((acc, c) => acc + c.lng, 0) / coords.length;

      const marker = new window.google.maps.Marker({
        position: { lat: centerLat, lng: centerLng },
        map: this.map,
        title: `${p.name} (${p.elevationM}m)`,
        label: {
          text: `${p.name.split(' ')[0]} ${p.elevationM}m`,
          color: '#ffffff',
          fontSize: '10px',
          fontWeight: 'bold',
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: '#0f172a',
          fillOpacity: 0.9,
          strokeColor: p.elevationM > 1000 ? '#06b6d4' : (p.elevationM < 600 ? '#f59e0b' : '#10b981'),
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => window.App.selectPanchayat(p.id));
      this.markers.push(marker);
    });
  },

  /**
   * Update polygon colors dynamically
   */
  updateChoropleth: function() {
    if (!this.map) return;
    const downscaledData = window.DownscalingEngine.downscaleAll(window.AgroData);
    const coarse = window.AgroData.scenarios[window.AgroData.currentScenario || "monsoon"].coarseForecast;

    if (this.coarseRectangle) {
      this.coarseRectangle.setOptions({
        fillOpacity: this.viewMode === 'coarse' ? 0.45 : 0.06
      });
    }

    window.AgroData.panchayats.forEach(p => {
      const poly = this.panchayatPolygons[p.id];
      if (!poly) return;

      const isSelected = this.selectedPanchayatId === p.id;
      const d = downscaledData[p.id].downscaled;

      let color = '#10b981';
      if (this.viewMode === 'coarse') {
        color = this._getColorForValue(this.currentVariable, {
          rainfallMm: coarse.rainfallMm,
          tempMax: coarse.tempMax,
          frostHazardIndex: coarse.tempMin < 5 ? 80 : 10,
          windSpeedKmh: coarse.windSpeedKmh
        });
      } else {
        color = this._getColorForValue(this.currentVariable, d);
      }

      poly.setOptions({
        fillColor: color,
        fillOpacity: this.viewMode === 'coarse' ? 0.25 : 0.78,
        strokeColor: isSelected ? '#10b981' : '#ffffff',
        strokeWeight: isSelected ? 3.5 : 1.5,
      });
    });

    this.updateLegend();
  },

  _getColorForValue: function(variable, values) {
    if (variable === "rainfall") {
      const r = values.rainfallMm;
      if (r > 60) return "#7c3aed";
      if (r > 40) return "#2563eb";
      if (r > 25) return "#0284c7";
      if (r > 15) return "#06b6d4";
      if (r > 5)  return "#34d399";
      return "#475569";
    } else if (variable === "temp") {
      const t = values.tempMax;
      if (t > 36) return "#ef4444";
      if (t > 32) return "#f97316";
      if (t > 28) return "#f59e0b";
      if (t > 24) return "#10b981";
      return "#06b6d4";
    } else if (variable === "frost") {
      const f = values.frostHazardIndex;
      if (f > 80) return "#ec4899";
      if (f > 50) return "#8b5cf6";
      if (f > 20) return "#3b82f6";
      return "#1e293b";
    } else if (variable === "spray") {
      const safe = values.windSpeedKmh < 14 && values.rainfallMm < 5;
      return safe ? "#10b981" : "#f43f5e";
    }
    return "#10b981";
  },

  updateLegend: function() {
    const titleEl = document.getElementById("legend-title");
    const barEl = document.getElementById("legend-bar");
    const labelsEl = document.getElementById("legend-labels");
    if (!titleEl || !barEl || !labelsEl) return;

    if (this.currentVariable === "rainfall") {
      titleEl.textContent = "Precipitation (mm/day)";
      barEl.style.background = "linear-gradient(to right, #475569, #06b6d4, #0284c7, #2563eb, #7c3aed)";
      labelsEl.innerHTML = `<span>0 mm</span><span>25 mm</span><span>70+ mm</span>`;
    } else if (this.currentVariable === "temp") {
      titleEl.textContent = "Max Temperature (°C)";
      barEl.style.background = "linear-gradient(to right, #06b6d4, #10b981, #f59e0b, #f97316, #ef4444)";
      labelsEl.innerHTML = `<span>20°C</span><span>28°C</span><span>38°C</span>`;
    } else if (this.currentVariable === "frost") {
      titleEl.textContent = "Thermal Inversion Frost Hazard";
      barEl.style.background = "linear-gradient(to right, #1e293b, #3b82f6, #8b5cf6, #ec4899)";
      labelsEl.innerHTML = `<span>Safe (10°C+)</span><span>Moderate</span><span>Severe (<4°C)</span>`;
    } else if (this.currentVariable === "spray") {
      titleEl.textContent = "Chemical Spray Feasibility";
      barEl.style.background = "linear-gradient(to right, #10b981, #f43f5e)";
      labelsEl.innerHTML = `<span>🟢 Safe</span><span>🔴 High Risk</span>`;
    }
  },

  setVariable: function(variable) {
    this.currentVariable = variable;
    this.updateChoropleth();
  },

  setViewMode: function(mode) {
    this.viewMode = mode;
    this.updateChoropleth();
  },

  highlightPanchayat: function(panchayatId) {
    this.selectedPanchayatId = panchayatId;
    this.updateChoropleth();

    const p = window.AgroData.panchayats.find(item => item.id === panchayatId);
    if (p && this.map) {
      this.map.panTo({ lat: p.lat, lng: p.lng });
    }
  }
};
