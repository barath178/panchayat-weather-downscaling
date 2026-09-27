/**
 * AeroAgro AI - Pan-India GIS Controller
 * High-performance hardware-accelerated mapping engine with direct Google Maps tile layers
 * (Physical Relief, Hybrid Satellite, Standard Roadmap, CartoDB Dark Matter).
 * Zero auth popups, zero watermarks, zero 404s, zero blank space, and 60 FPS Canvas rendering.
 */

window.MapController = {
  map: null,
  currentTileLayer: null,
  tileLayers: {},
  markersLayerGroup: null,
  polygonsLayerGroup: null,
  coarseRectangle: null,
  markersMap: {},
  polygonsMap: {},
  currentVariable: "rainfall", // rainfall | temp | frost | spray
  viewMode: "fine", // fine (downscaled) | coarse (flat block)
  selectedPanchayatId: null,
  activeState: "all",
  activeTypeFilter: "all", // all | urban | rural
  currentZoom: 5,

  stateCenters: {
    all: { lat: 22.5937, lng: 78.9629, zoom: 5, name: "All India" },
    "Tamil Nadu": { lat: 11.1271, lng: 78.6569, zoom: 7.2, name: "Tamil Nadu (38 Districts)" },
    "Maharashtra": { lat: 19.7515, lng: 75.7139, zoom: 7, name: "Maharashtra (36 Districts)" },
    "Karnataka": { lat: 15.3173, lng: 75.7139, zoom: 7.2, name: "Karnataka (31 Districts)" },
    "Uttar Pradesh": { lat: 26.8467, lng: 80.9462, zoom: 7, name: "Uttar Pradesh (32 Districts)" },
    "Kerala": { lat: 10.8505, lng: 76.2711, zoom: 8, name: "Kerala (14 Districts)" },
    "West Bengal": { lat: 22.9868, lng: 87.8550, zoom: 7.2, name: "West Bengal (23 Districts)" },
    "Rajasthan": { lat: 27.0238, lng: 74.2179, zoom: 6.8, name: "Rajasthan (33 Districts)" },
    "Gujarat": { lat: 22.2587, lng: 71.1924, zoom: 7, name: "Gujarat (25 Districts)" },
    "Punjab": { lat: 31.1471, lng: 75.3412, zoom: 7.5, name: "Punjab & Haryana (22 Districts)" },
    "Haryana": { lat: 29.0588, lng: 76.0856, zoom: 7.5, name: "Haryana (22 Districts)" },
    "Madhya Pradesh": { lat: 22.9734, lng: 78.6569, zoom: 6.8, name: "Madhya Pradesh (20 Districts)" },
    "Andhra Pradesh": { lat: 15.9129, lng: 79.7400, zoom: 7, name: "Andhra Pradesh (18 Districts)" },
    "Telangana": { lat: 18.1124, lng: 79.0193, zoom: 7.5, name: "Telangana (15 Districts)" },
    "Bihar": { lat: 25.0961, lng: 85.3131, zoom: 7.2, name: "Bihar (16 Districts)" },
    "Odisha": { lat: 20.9517, lng: 85.0985, zoom: 7, name: "Odisha (15 Districts)" },
    "Assam": { lat: 26.2006, lng: 92.9376, zoom: 7, name: "Assam & NE (14 Districts)" },
    "Himachal Pradesh": { lat: 31.1048, lng: 77.1734, zoom: 7.5, name: "Himachal Pradesh (12 Districts)" },
    "Jammu and Kashmir": { lat: 33.7782, lng: 76.5762, zoom: 7, name: "Jammu & Kashmir (10 Districts)" },
    "Uttarakhand": { lat: 30.0668, lng: 79.0193, zoom: 7.5, name: "Uttarakhand (10 Districts)" },
    "Delhi": { lat: 28.6139, lng: 77.2090, zoom: 10, name: "Delhi NCR Urban Metros" }
  },

  /**
   * Initialize Leaflet with Google Maps Direct Tile Layers
   */
  init: function(mapElementId, initialPanchayatId) {
    const mapElement = document.getElementById(mapElementId);
    if (!mapElement) return;

    const region = window.AgroData.region;
    this.selectedPanchayatId = initialPanchayatId || window.AgroData.panchayats[0].id;

    if (window.L) {
      this.map = L.map(mapElementId, {
        center: [region.center[0], region.center[1]],
        zoom: region.defaultZoom || 5,
        minZoom: 4,
        maxZoom: 18,
        preferCanvas: true, // 60 FPS hardware accelerated canvas
        attributionControl: true,
      });

      // Register Clean Direct Google Maps XYZ Raster Layers (No Watermark!)
      this.tileLayers = {
        terrain: L.tileLayer('https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: '© Google Maps (Physical Relief)'
        }),
        hybrid: L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: '© Google Maps (Hybrid Satellite)'
        }),
        roadmap: L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
          subdomains: ['0', '1', '2', '3'],
          maxZoom: 20,
          attribution: '© Google Maps (Roadmap)'
        }),
        dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          subdomains: 'abcd',
          maxZoom: 20,
          attribution: '© CARTO Dark Matter'
        }),
      };

      // Default to Google Maps Physical Terrain
      this.currentTileLayer = this.tileLayers.terrain;
      this.currentTileLayer.addTo(this.map);

      this.polygonsLayerGroup = L.layerGroup().addTo(this.map);
      this.markersLayerGroup = L.layerGroup().addTo(this.map);

      this.map.on('zoomend', () => {
        this.currentZoom = this.map.getZoom();
        this.renderPanchayats();
      });

      // Avoid blank spaces on initial render
      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);

      window.addEventListener('resize', () => {
        if (this.map) this.map.invalidateSize();
      });

      this.renderCoarseGrid();
      this.renderPanchayats();
      this.updateChoropleth();

      const selected = window.AgroData.panchayats.find(p => p.id === this.selectedPanchayatId);
      if (selected && selected.lat && selected.lng) {
        this.map.setView([selected.lat, selected.lng], 8);
      }
    }
  },

  zoomToWholeIndia: function() {
    this.activeState = "all";
    if (this.map) {
      this.map.flyTo([22.5937, 78.9629], 5, { duration: 0.8 });
    }
    this.renderPanchayats();
    if (window.App && window.App.onStateFilterChanged) {
      window.App.onStateFilterChanged("all");
    }
  },

  setMapType: function(type) {
    if (!this.map || !this.tileLayers[type]) return;
    if (this.currentTileLayer) {
      this.map.removeLayer(this.currentTileLayer);
    }
    this.currentTileLayer = this.tileLayers[type];
    this.currentTileLayer.addTo(this.map);
  },

  imdOverlay: null,
  showImdOverlay: false,
  toggleImdOverlay: function() {
    this.showImdOverlay = !this.showImdOverlay;
    if (this.imdOverlay && this.map) {
      this.map.removeLayer(this.imdOverlay);
      this.imdOverlay = null;
    }
    if (this.showImdOverlay && this.map) {
      const bounds = [[-4.0, 52.0], [39.5, 101.5]];
      this.imdOverlay = L.imageOverlay('https://mausam.imd.gov.in/Satellite/3Dasiasec_ir1.jpg?v=' + Date.now(), bounds, {
        opacity: 0.65,
        interactive: false
      }).addTo(this.map);
      if (this.polygonsLayerGroup) this.polygonsLayerGroup.bringToFront();
      if (this.markersLayerGroup) this.markersLayerGroup.bringToFront();
    }
    const btn = document.getElementById('btn-imd-sat');
    if (btn) {
      btn.classList.toggle('active', this.showImdOverlay);
      btn.style.background = this.showImdOverlay ? '#0284c7' : '';
      btn.style.color = this.showImdOverlay ? '#ffffff' : '#38bdf8';
    }
  },

  filterByState: function(stateName) {
    this.activeState = stateName;
    if (this.map && this.stateCenters[stateName]) {
      const cfg = this.stateCenters[stateName];
      this.map.flyTo([cfg.lat, cfg.lng], cfg.zoom, { duration: 0.8 });
    }
    this.renderPanchayats();
    this.updateChoropleth();
  },

  filterByType: function(type) {
    this.activeTypeFilter = type;
    this.renderPanchayats();
    this.updateChoropleth();
  },

  renderCoarseGrid: function() {
    if (this.coarseRectangle && this.map) {
      this.map.removeLayer(this.coarseRectangle);
      this.coarseRectangle = null;
    }
    if (!this.map) return;

    const current = window.AgroData.panchayats.find(p => p.id === this.selectedPanchayatId) || window.AgroData.panchayats[0];
    const cLat = current.lat || 22.59;
    const cLng = current.lng || 78.96;

    const bounds = [
      [cLat - 0.1, cLng - 0.1],
      [cLat + 0.1, cLng + 0.1],
    ];

    this.coarseRectangle = L.rectangle(bounds, {
      color: '#f59e0b',
      weight: this.viewMode === 'coarse' ? 2.5 : 1.5,
      dashArray: this.viewMode === 'coarse' ? undefined : '4, 6',
      fillColor: '#f59e0b',
      fillOpacity: this.viewMode === 'coarse' ? 0.35 : 0.08,
    }).addTo(this.map);
  },

  renderPanchayats: function() {
    if (!this.map || !this.markersLayerGroup || !this.polygonsLayerGroup) return;

    this.markersLayerGroup.clearLayers();
    this.polygonsLayerGroup.clearLayers();
    this.panchayatPolygons = {};

    const visiblePanchayats = window.AgroData.panchayats.filter(p => {
      const matchState = this.activeState === "all" || p.state === this.activeState;
      const matchType = this.activeTypeFilter === "all" ||
        (this.activeTypeFilter === "urban" && p.isUrban) ||
        (this.activeTypeFilter === "rural" && !p.isUrban);
      return matchState && matchType;
    });

    const isStateZoomed = this.activeState !== "all" || this.currentZoom >= 8;

    visiblePanchayats.forEach(p => {
      const isSelected = p.id === this.selectedPanchayatId;
      const coords = (p.polygonCoords || []).map(c => [c[0], c[1]]);

      // Render polygon boundary
      if ((isStateZoomed || isSelected) && coords.length > 0) {
        const polygon = L.polygon(coords, {
          color: isSelected ? '#10b981' : '#38bdf8',
          weight: isSelected ? 2.5 : 1,
          opacity: isSelected ? 0.9 : 0.4,
          fillColor: isSelected ? '#10b981' : '#0284c7',
          fillOpacity: this.viewMode === 'coarse' ? 0.25 : (isSelected ? 0.6 : 0.15),
        });

        polygon.on('click', () => {
          window.App.selectPanchayat(p.id);
        });

        polygon.on('mouseover', (e) => {
          this.showTooltip(p, e);
          polygon.setStyle({ color: '#f59e0b', weight: 2.5 });
        });

        polygon.on('mouseout', () => {
          this.hideTooltip();
          polygon.setStyle({
            color: isSelected ? '#10b981' : '#38bdf8',
            weight: isSelected ? 2.5 : 1,
          });
        });

        this.polygonsLayerGroup.addLayer(polygon);
        this.panchayatPolygons[p.id] = polygon;
      }

      // Determine glowing color palette based on terrain and elevation
      let markerColor = '#10b981';
      let strokeColor = '#34d399';
      let radius = isSelected ? 10 : (isStateZoomed ? 6 : 4.5);

      if (p.isUrban) {
        markerColor = '#06b6d4';
        strokeColor = '#38bdf8';
      } else if (p.elevationM > 1200) {
        markerColor = '#8b5cf6';
        strokeColor = '#a78bfa';
      } else if (p.elevationM > 350) {
        markerColor = '#f59e0b';
        strokeColor = '#fbbf24';
      }

      if (isSelected) {
        markerColor = '#10b981';
        strokeColor = '#ffffff';
      }

      const circleMarker = L.circleMarker([p.lat, p.lng], {
        radius: radius,
        fillColor: markerColor,
        fillOpacity: isSelected ? 1.0 : 0.85,
        color: strokeColor,
        weight: isSelected ? 3.5 : (isStateZoomed ? 2 : 1.2),
      });

      circleMarker.on('click', () => {
        window.App.selectPanchayat(p.id);
        if (this.map) {
          this.map.flyTo([p.lat, p.lng], Math.max(this.map.getZoom(), 8), { duration: 0.6 });
        }
      });

      circleMarker.on('mouseover', (e) => {
        this.showTooltip(p, e);
      });

      circleMarker.on('mouseout', () => {
        this.hideTooltip();
      });

      this.markersLayerGroup.addLayer(circleMarker);
    });
  },

  showTooltip: function(p, event) {
    let tooltip = document.getElementById('map-hover-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'map-hover-tooltip';
      tooltip.className = 'map-hover-card';
      document.body.appendChild(tooltip);
    }

    const typeTag = p.isUrban ? '🏙️ Urban Metro' : '🌾 Agro District';
    const crops = p.primaryCrops ? p.primaryCrops.slice(0, 2).join(', ') : 'Paddy, Vegetables';

    tooltip.innerHTML = `
      <div class="hover-card-header">
        <strong>${p.name}</strong>
        <span class="hover-tag ${p.isUrban ? 'urban' : 'agro'}">${typeTag}</span>
      </div>
      <div class="hover-card-body">
        <div><strong>State:</strong> ${p.state}</div>
        <div><strong>Elevation:</strong> ${p.elevationM} m MSL</div>
        <div><strong>Terrain:</strong> ${p.terrainType.split('(')[0]}</div>
        <div><strong>Key Crops:</strong> ${crops}</div>
      </div>
      <div class="hover-card-hint">Click to inspect downscaled microclimate &rarr;</div>
    `;

    tooltip.style.display = 'block';

    if (event && event.originalEvent) {
      const x = event.originalEvent.clientX + 16;
      const y = event.originalEvent.clientY - 20;
      tooltip.style.left = Math.min(x, window.innerWidth - 260) + 'px';
      tooltip.style.top = Math.max(10, Math.min(y, window.innerHeight - 140)) + 'px';
    }
  },

  hideTooltip: function() {
    const tooltip = document.getElementById('map-hover-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  },

  updateChoropleth: function() {
    const downscaledData = window.DownscalingEngine ? window.DownscalingEngine.downscaleAll(window.AgroData) : {};

    window.AgroData.panchayats.forEach(p => {
      const poly = this.panchayatPolygons[p.id];
      if (!poly) return;

      const data = downscaledData[p.id] || {};
      let color = '#10b981';

      if (this.viewMode === 'coarse') {
        color = '#f59e0b';
      } else {
        if (this.currentVariable === 'rainfall') {
          const val = data.rainfallMm !== undefined ? data.rainfallMm : (p.elevationM > 1500 ? 80 : 30);
          color = val > 70 ? '#7c3aed' : (val > 40 ? '#2563eb' : (val > 15 ? '#06b6d4' : '#475569'));
        } else if (this.currentVariable === 'temp') {
          const val = data.tempMin !== undefined ? data.tempMin : (p.elevationM > 1500 ? 3 : 22);
          color = val < 5 ? '#ec4899' : (val < 15 ? '#06b6d4' : (val < 25 ? '#10b981' : '#f59e0b'));
        } else if (this.currentVariable === 'frost') {
          color = p.drainageAccumulation > 0.8 && p.elevationM > 1500 ? '#ec4899' : '#1e293b';
        } else if (this.currentVariable === 'spray') {
          color = p.elevationM > 1500 ? '#f43f5e' : '#10b981';
        }
      }

      poly.setStyle({
        fillColor: color,
        fillOpacity: this.viewMode === 'coarse' ? 0.25 : 0.65,
      });
    });
  },

  setVariable: function(variableName) {
    this.currentVariable = variableName;
    this.updateChoropleth();
  },

  setViewMode: function(mode) {
    this.viewMode = mode;
    this.renderCoarseGrid();
    this.updateChoropleth();
  },

  highlightPanchayat: function(panchayatId) {
    this.selectedPanchayatId = panchayatId;
    this.renderCoarseGrid();
    this.renderPanchayats();

    const target = window.AgroData.panchayats.find(item => item.id === panchayatId);
    if (target && this.map) {
      this.map.flyTo([target.lat, target.lng], Math.max(this.map.getZoom(), 8), { duration: 0.6 });
    }
  },

  // 📍 Geolocation: Detect user's current GPS location
  locateUser: function() {
    if (!navigator.geolocation || !this.map) return;

    const map = this.map;
    const panchayats = window.AgroData?.panchayats || [];

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        // Remove previous location layer
        if (this._userLocationLayer) {
          map.removeLayer(this._userLocationLayer);
        }

        const locationGroup = L.layerGroup();

        // Haversine distance
        const toRad = (d) => (d * Math.PI) / 180;
        const haversine = (lat1, lng1, lat2, lng2) => {
          const R = 6371;
          const dLat = toRad(lat2 - lat1);
          const dLng = toRad(lng2 - lng1);
          const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
          return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        };

        // Find nearest panchayat
        let minDist = Infinity, nearest = null;
        panchayats.forEach((p) => {
          const d = haversine(latitude, longitude, p.lat, p.lng);
          if (d < minDist) { minDist = d; nearest = p; }
        });

        // Accuracy circle
        L.circle([latitude, longitude], {
          radius: Math.min(accuracy, 5000),
          color: '#3b82f6', weight: 1.5, opacity: 0.6,
          fillColor: '#3b82f6', fillOpacity: 0.08, dashArray: '4, 6',
        }).addTo(locationGroup);

        // Pulse ring
        L.circleMarker([latitude, longitude], {
          radius: 18, fillColor: '#3b82f6', fillOpacity: 0.15,
          color: '#60a5fa', weight: 2, opacity: 0.5,
        }).addTo(locationGroup);

        // GPS dot with popup
        const dot = L.circleMarker([latitude, longitude], {
          radius: 8, fillColor: '#3b82f6', fillOpacity: 1,
          color: '#ffffff', weight: 3, opacity: 1,
        });
        dot.bindPopup(
          `<div style="font-family:system-ui;padding:4px 0;">
            <div style="font-weight:700;font-size:13px;color:#1e293b;margin-bottom:4px;">📍 Your Location</div>
            <div style="font-size:11px;color:#475569;">
              <b>Lat:</b> ${latitude.toFixed(5)}°N<br/>
              <b>Lng:</b> ${longitude.toFixed(5)}°E<br/>
              <b>Accuracy:</b> ±${Math.round(accuracy)}m
            </div>
            ${nearest ? `<div style="margin-top:6px;padding-top:6px;border-top:1px solid #e2e8f0;font-size:11px;color:#0f766e;">
              <b>Nearest:</b> ${nearest.name}<br/><b>Distance:</b> ${Math.round(minDist * 10) / 10} km
            </div>` : ''}
          </div>`, { maxWidth: 220 }
        );
        dot.addTo(locationGroup);

        // Connection line to nearest station
        if (nearest) {
          L.polyline([[latitude, longitude], [nearest.lat, nearest.lng]], {
            color: '#f97316', weight: 2, opacity: 0.7, dashArray: '6, 8',
          }).addTo(locationGroup);
        }

        locationGroup.addTo(map);
        this._userLocationLayer = locationGroup;

        // Fly to user
        map.flyTo([latitude, longitude], 10, { duration: 1.2 });
        setTimeout(() => dot.openPopup(), 1400);

        // Auto-select nearest panchayat
        if (nearest && typeof this.highlightPanchayat === 'function') {
          this.highlightPanchayat(nearest.id);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        alert(err.code === 1
          ? 'Location access denied. Please enable GPS in your browser settings.'
          : 'Unable to detect your location. Please try again.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  }
};
