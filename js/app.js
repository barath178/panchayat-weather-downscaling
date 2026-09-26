/**
 * AeroAgro AI - Main Application Controller
 * Orchestrates Map, Downscaling Engine, Agromet Advisories,
 * Multilingual Translation, and Audio Spectrogram Demonstrations.
 */

window.App = {
  state: {
    selectedPanchayatId: "panchayat_male",
    currentScenario: "monsoon",
    selectedCrop: "Table Grapes",
    language: "en", // en | mr | hi
    activeTab: "spray" // spray | frost | acoustic | xai
  },

  init: function() {
    window.AgroData.currentScenario = this.state.currentScenario;

    // 1. Initialize Map
    window.MapController.init("leaflet-map", this.state.selectedPanchayatId);

    // 2. Initialize Acoustic Rain Gauge Canvas
    window.AcousticRainGauge.init("acoustic-canvas");

    // 3. Render Panchayat List
    this.renderPanchayatList();

    // 4. Attach Event Listeners
    this.attachEventListeners();

    // 5. Update Full View for initially selected Panchayat
    this.updateView();
  },

  renderPanchayatList: function() {
    const listEl = document.getElementById("panchayat-list-container");
    if (!listEl) return;

    listEl.innerHTML = "";
    window.AgroData.panchayats.forEach(p => {
      const isSelected = p.id === this.state.selectedPanchayatId;
      const isFrostProne = p.drainageAccumulation > 0.7;
      const isRidge = p.elevationM > 1000;

      const item = document.createElement("div");
      item.className = `panchayat-item ${isSelected ? "active" : ""}`;
      item.onclick = () => this.selectPanchayat(p.id);

      item.innerHTML = `
        <div class="p-info">
          <h4>${p.name}</h4>
          <span>${p.elevationM}m • ${p.terrainType.split('(')[0]}</span>
        </div>
        <div>
          ${isFrostProne ? `<span class="p-badge frost-risk">Frost Basin</span>` : ''}
          ${isRidge ? `<span class="p-badge rain-hotspot">High Crest</span>` : ''}
        </div>
      `;
      listEl.appendChild(item);
    });
  },

  selectPanchayat: function(panchayatId) {
    this.state.selectedPanchayatId = panchayatId;
    this.renderPanchayatList();
    window.MapController.highlightPanchayat(panchayatId);
    this.updateView();
  },

  setScenario: function(scenarioId) {
    this.state.currentScenario = scenarioId;
    window.AgroData.currentScenario = scenarioId;

    // If winter scenario, switch map to frost or temp
    if (scenarioId === "winter_frost") {
      this.switchFeatureTab("frost");
      window.MapController.setVariable("frost");
    } else if (scenarioId === "monsoon") {
      this.switchFeatureTab("spray");
      window.MapController.setVariable("rainfall");
    }

    window.MapController.updateChoropleth();
    this.updateView();
  },

  setLanguage: function(lang) {
    this.state.language = lang;
    this.updateView();
  },

  setCrop: function(cropName) {
    this.state.selectedCrop = cropName;
    document.querySelectorAll(".crop-tag").forEach(tag => {
      tag.classList.toggle("active", tag.getAttribute("data-crop") === cropName);
    });
    this.updateView();
  },

  switchFeatureTab: function(tabName) {
    this.state.activeTab = tabName;
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
    });

    document.querySelectorAll(".feature-panel").forEach(panel => {
      panel.style.display = panel.id === `tab-${tabName}` ? "block" : "none";
    });
  },

  updateView: function() {
    const currentPanchayat = window.AgroData.panchayats.find(p => p.id === this.state.selectedPanchayatId);
    const scenario = window.AgroData.scenarios[this.state.currentScenario];
    const downscaledResults = window.DownscalingEngine.downscaleForPanchayat(
      currentPanchayat,
      scenario,
      window.AgroData.coarseGrid
    );

    const advisory = window.AdvisoryEngine.generateAdvisory(
      currentPanchayat,
      downscaledResults,
      this.state.selectedCrop,
      this.state.language
    );

    // 1. Update Coarse vs Downscaled Metric Boxes (Left Sidebar)
    this._updateMetricCards(downscaledResults, currentPanchayat);

    // 2. Update Explainable AI Physics Card (Left Sidebar)
    this._updatePhysicsCard(downscaledResults);

    // 3. Update Spray Window Timeline (Right Sidebar / Center Tab)
    this._updateSprayTimeline(advisory.hourlySprayWindow);

    // 4. Update Disease, Irrigation & Frost Cards (Right Sidebar)
    this._updateAdvisoryCards(advisory, currentPanchayat);

    // 5. Update WhatsApp Preview Card
    this._updateWhatsAppPreview(advisory.messages.activeLanguageText);

    // 6. Update Frost Pocket Tab Content
    this._updateFrostTab(downscaledResults, currentPanchayat);
  },

  _updateMetricCards: function(res, panchayat) {
    const d = res.downscaled;
    const c = res.coarseBaseline;

    document.getElementById("selected-panchayat-name").textContent = panchayat.name;
    document.getElementById("selected-panchayat-elev").textContent = `${panchayat.elevationM} m (${panchayat.terrainType})`;

    // Rain
    document.getElementById("coarse-rain").textContent = `${c.rainfallMm} mm`;
    document.getElementById("fine-rain").textContent = `${d.rainfallMm} mm`;

    // Temp
    document.getElementById("coarse-temp").textContent = `${c.tempMin}° to ${c.tempMax}°C`;
    document.getElementById("fine-temp").textContent = `${d.tempMin}° to ${d.tempMax}°C`;

    // Wind & RH
    document.getElementById("coarse-wind-rh").textContent = `${c.windSpeedKmh} km/h | ${c.relativeHumidity}%`;
    document.getElementById("fine-wind-rh").textContent = `${d.windSpeedKmh} km/h | ${d.relativeHumidity}%`;
  },

  _updatePhysicsCard: function(res) {
    const exp = res.explainability;
    const formulaEl = document.getElementById("active-formula-display");
    const rationaleEl = document.getElementById("scientific-rationale-text");

    if (this.state.currentScenario === "winter_frost") {
      formulaEl.innerHTML = `T<sub>min</sub> = T<sub>coarse</sub> - (DA &times; 7.4&deg;C)<br><span style="color:#67e8f9">&Delta;T = ${exp.inversionDeltaT}&deg;C</span> (Cold Air Pooling)`;
    } else {
      formulaEl.innerHTML = `P<sub>local</sub> = P<sub>coarse</sub> &times; [1 + (&Delta;z/300)&times;0.95 &times; sin(&theta;)]<br><span style="color:#6ee7b7">Multiplier = ${exp.orographicMultiplier}x</span>`;
    }

    rationaleEl.textContent = exp.scientificRationale;
  },

  _updateSprayTimeline: function(hours) {
    const timelineEl = document.getElementById("spray-timeline-container");
    if (!timelineEl) return;

    timelineEl.innerHTML = "";
    hours.forEach(h => {
      const item = document.createElement("div");
      item.className = `timeline-hour ${h.status}`;
      item.title = `${h.time}: ${h.reason} (Wind: ${h.windKmh}km/h, Temp: ${h.tempC}°C)`;
      item.innerHTML = `
        <span>${h.time}</span>
        <span>${h.status === 'safe' ? '🟢' : (h.status === 'caution' ? '🟡' : '🔴')}</span>
        <span>${h.windKmh}k</span>
      `;
      timelineEl.appendChild(item);
    });
  },

  _updateAdvisoryCards: function(advisory, panchayat) {
    // Spray Badge
    const safeSlots = advisory.hourlySprayWindow.filter(h => h.status === "safe");
    const sprayBadge = document.getElementById("spray-status-badge");
    const spraySummaryText = document.getElementById("spray-summary-text");

    if (safeSlots.length > 0) {
      sprayBadge.className = "advisory-badge-pill badge-spray-safe";
      sprayBadge.textContent = "🟢 FAVORABLE SPRAY WINDOW";
      spraySummaryText.textContent = `Safe chemical application between ${safeSlots[0].time} and ${safeSlots[safeSlots.length - 1].time}. Low wind drift risk.`;
    } else {
      sprayBadge.className = "advisory-badge-pill badge-spray-danger";
      sprayBadge.textContent = "🔴 DO NOT SPRAY TODAY";
      spraySummaryText.textContent = `High risk of chemical wash-off or drift. Postpone all spray operations until microclimate stabilizes.`;
    }

    // Disease Warning
    const diseaseContainer = document.getElementById("disease-warning-container");
    if (diseaseContainer) {
      const d = advisory.diseaseThreats[0];
      diseaseContainer.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <h4 style="font-size:0.85rem; font-weight:700; color:#f8fafc;">${d.name}</h4>
          <span class="p-badge" style="background:${d.risk === 'HIGH' ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.2)'}; color:${d.color};">Risk: ${d.risk}</span>
        </div>
        <p class="advisory-text" style="font-size:0.78rem;">${d.description}</p>
      `;
    }

    // Irrigation
    const irrMsgEl = document.getElementById("irrigation-action-text");
    if (irrMsgEl) {
      irrMsgEl.textContent = advisory.irrigationStatus.message;
    }
  },

  _updateWhatsAppPreview: function(messageText) {
    const bubbleEl = document.getElementById("whatsapp-bubble-content");
    if (bubbleEl) {
      bubbleEl.textContent = messageText;
    }
  },

  _updateFrostTab: function(res, panchayat) {
    const d = res.downscaled;
    const frostAlertBox = document.getElementById("frost-tab-alert");
    if (!frostAlertBox) return;

    if (d.tempMin <= 5.0) {
      frostAlertBox.innerHTML = `
        <div style="background: rgba(244,63,94,0.15); border: 1px solid rgba(244,63,94,0.4); border-radius: 10px; padding: 12px;">
          <h4 style="color:#fda4af; font-size:0.9rem; font-weight:700; margin-bottom:4px;">🚨 SEVERE COLD-AIR POOLING ALERT (${d.tempMin}°C)</h4>
          <p style="font-size:0.8rem; color:#fecdd3; line-height:1.5;">
            Katabatic cold air draining into the <strong>${panchayat.name}</strong> depression will pool between 02:00 AM – 06:00 AM. 
            Tender flower blossoms and young shoots in grape/vegetable vineyards will face irreversible freezing necrosis without intervention.
          </p>
          <div style="margin-top:8px; font-size:0.75rem; color:#ffffff; font-weight:600;">
            Recommended Action: Turn on drip/overhead misting to release latent heat of fusion (+1.5°C protection).
          </div>
        </div>
      `;
    } else {
      frostAlertBox.innerHTML = `
        <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 10px; padding: 12px;">
          <h4 style="color:#a7f3d0; font-size:0.9rem; font-weight:700; margin-bottom:4px;">✅ No Frost Inversion Hazard (${d.tempMin}°C)</h4>
          <p style="font-size:0.8rem; color:#cbd5e1;">Thermal inversion temperatures are safely above the chilling threshold. Night radiative cooling is normal.</p>
        </div>
      `;
    }
  },

  copyWhatsAppText: function() {
    const bubbleEl = document.getElementById("whatsapp-bubble-content");
    if (bubbleEl) {
      navigator.clipboard.writeText(bubbleEl.textContent);
      const copyBtn = document.getElementById("btn-copy-wa");
      if (copyBtn) {
        copyBtn.textContent = "Copied to Clipboard!";
        setTimeout(() => { copyBtn.textContent = "Copy Advisory"; }, 2000);
      }
    }
  },

  attachEventListeners: function() {
    // Scenario Dropdown
    const scenarioSelect = document.getElementById("scenario-select");
    if (scenarioSelect) {
      scenarioSelect.addEventListener("change", (e) => this.setScenario(e.target.value));
    }

    // Language Dropdown
    const langSelect = document.getElementById("lang-select");
    if (langSelect) {
      langSelect.addEventListener("change", (e) => this.setLanguage(e.target.value));
    }

    // Map Variable Buttons
    document.querySelectorAll(".toolbar-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".toolbar-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        window.MapController.setVariable(btn.getAttribute("data-var"));
      });
    });

    // View Mode Switcher (Coarse vs Fine)
    document.querySelectorAll(".switch-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".switch-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        window.MapController.setViewMode(btn.getAttribute("data-mode"));
      });
    });

    // Tab Buttons
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.switchFeatureTab(btn.getAttribute("data-tab"));
      });
    });

    // Crop Tags
    document.querySelectorAll(".crop-tag").forEach(tag => {
      tag.addEventListener("click", () => {
        this.setCrop(tag.getAttribute("data-crop"));
      });
    });

    // Acoustic Rain Mode Buttons
    document.querySelectorAll(".acoustic-mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".acoustic-mode-btn").forEach(b => b.classList.remove("btn-primary"));
        btn.classList.add("btn-primary");
        window.AcousticRainGauge.setMode(btn.getAttribute("data-mode"));
      });
    });

    // Acoustic Playback Toggle
    const playBtn = document.getElementById("btn-toggle-acoustic");
    if (playBtn) {
      playBtn.addEventListener("click", () => {
        const isPlaying = window.AcousticRainGauge.togglePlayback(window.AcousticRainGauge.currentMode);
        playBtn.textContent = isPlaying ? "⏹ Stop Sound Analysis" : "▶ Start Acoustic Audio Stream";
        playBtn.className = isPlaying ? "btn btn-primary" : "btn btn-glass";
      });
    }

    // WhatsApp Copy Button
    const copyBtn = document.getElementById("btn-copy-wa");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => this.copyWhatsAppText());
    }
  }
};

// Auto-boot when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.App.init();
});
