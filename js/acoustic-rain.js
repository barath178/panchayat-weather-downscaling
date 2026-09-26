/**
 * AeroAgro AI - Acoustic Rain Gauge Engine
 * Frugal Innovation Ground-Truthing Module:
 * Demonstrates AI classification of rainfall sound on corrugated tin roofs
 * Uses Web Audio API for synthetic audio generation & Real-time FFT Frequency Analysis
 */

window.AcousticRainGauge = {
  audioCtx: null,
  analyser: null,
  sourceNode: null,
  gainNode: null,
  canvas: null,
  canvasCtx: null,
  animationId: null,
  isPlaying: false,
  currentMode: "moderate", // drizzle | moderate | heavy | dry

  modes: {
    dry: {
      label: "Dry / Ambient Village (0 mm/hr)",
      gain: 0.05,
      filterFreq: 800,
      predictedRate: 0.0,
      confidence: 98.4,
      statusBadge: "NO RAIN"
    },
    drizzle: {
      label: "Light Drizzle (2-5 mm/hr)",
      gain: 0.22,
      filterFreq: 4500, // High-frequency tin plinking
      predictedRate: 3.8,
      confidence: 94.2,
      statusBadge: "LIGHT RAIN"
    },
    moderate: {
      label: "Moderate Rain (12-20 mm/hr)",
      gain: 0.55,
      filterFreq: 2800,
      predictedRate: 16.4,
      confidence: 96.8,
      statusBadge: "MODERATE RAIN"
    },
    heavy: {
      label: "Torrential Downpour (40+ mm/hr)",
      gain: 0.90,
      filterFreq: 1200, // Heavy low-frequency metal resonance
      predictedRate: 48.2,
      confidence: 99.1,
      statusBadge: "HEAVY CLOUDBURST"
    }
  },

  /**
   * Initialize Web Audio & Canvas visualizer
   */
  init: function(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.canvasCtx = this.canvas.getContext("2d");

    // Fix retina canvas scaling
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio || 500;
    this.canvas.height = (rect.height || 120) * window.devicePixelRatio;
    this.canvasCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    this.drawIdleCanvas();
  },

  drawIdleCanvas: function() {
    if (!this.canvasCtx) return;
    const w = this.canvas.width / (window.devicePixelRatio || 1);
    const h = this.canvas.height / (window.devicePixelRatio || 1);

    this.canvasCtx.fillStyle = "#030712";
    this.canvasCtx.fillRect(0, 0, w, h);

    // Draw grid lines
    this.canvasCtx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    this.canvasCtx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      this.canvasCtx.beginPath();
      this.canvasCtx.moveTo(x, 0);
      this.canvasCtx.lineTo(x, h);
      this.canvasCtx.stroke();
    }
    for (let y = 0; y < h; y += 25) {
      this.canvasCtx.beginPath();
      this.canvasCtx.moveTo(0, y);
      this.canvasCtx.lineTo(w, y);
      this.canvasCtx.stroke();
    }

    this.canvasCtx.fillStyle = "#64748b";
    this.canvasCtx.font = "11px 'Plus Jakarta Sans', sans-serif";
    this.canvasCtx.textAlign = "center";
    this.canvasCtx.fillText("Tap 'Test Acoustic Detection' to simulate tin-roof rain frequency spectrum", w / 2, h / 2 + 4);
  },

  /**
   * Start / Toggle Sound Synthesis & Spectrogram
   */
  togglePlayback: function(mode = "moderate") {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(mode);
      return true;
    }
  },

  start: function(mode = "moderate") {
    this.currentMode = mode;
    const config = this.modes[mode];

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();

      // Create white noise buffer for realistic rain droplets
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      this.sourceNode = this.audioCtx.createBufferSource();
      this.sourceNode.buffer = noiseBuffer;
      this.sourceNode.loop = true;

      // Bandpass / Peaking Filter to simulate metal tin roof resonance
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = config.filterFreq;
      filter.Q.value = 1.2;

      // Analyser for real-time FFT
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 128;

      // Master Gain
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = config.gain * 0.25; // Gentle volume

      // Connect graph: Noise -> Filter -> Gain -> Analyser -> Destination
      this.sourceNode.connect(filter);
      filter.connect(this.gainNode);
      this.gainNode.connect(this.analyser);
      this.gainNode.connect(this.audioCtx.destination);

      this.sourceNode.start(0);
      this.isPlaying = true;

      this._animateVisualizer();
      this._updateUI(config);
    } catch (e) {
      console.warn("AudioContext error or blocked autoplay:", e);
    }
  },

  stop: function() {
    if (this.sourceNode) {
      try { this.sourceNode.stop(); } catch (e) {}
    }
    if (this.audioCtx) {
      try { this.audioCtx.close(); } catch (e) {}
    }
    cancelAnimationFrame(this.animationId);
    this.isPlaying = false;
    this.drawIdleCanvas();
  },

  setMode: function(mode) {
    if (!this.modes[mode]) return;
    this.currentMode = mode;
    if (this.isPlaying) {
      this.stop();
      this.start(mode);
    } else {
      this._updateUI(this.modes[mode]);
    }
  },

  _animateVisualizer: function() {
    if (!this.isPlaying || !this.analyser || !this.canvasCtx) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    const w = this.canvas.width / (window.devicePixelRatio || 1);
    const h = this.canvas.height / (window.devicePixelRatio || 1);

    this.canvasCtx.fillStyle = "rgba(3, 7, 18, 0.25)";
    this.canvasCtx.fillRect(0, 0, w, h);

    const barWidth = (w / bufferLength) * 2.2;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * h * 0.85;

      // Tech color gradient: Emerald to Cyan
      const r = Math.round(16 + (i * 2));
      const g = Math.round(185 + (i * 0.8));
      const b = Math.round(129 + (i * 1.5));

      this.canvasCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      this.canvasCtx.shadowBlur = 8;
      this.canvasCtx.shadowColor = "rgba(6, 182, 212, 0.4)";
      this.canvasCtx.fillRect(x, h - barHeight, barWidth - 1, barHeight);

      x += barWidth;
    }

    this.animationId = requestAnimationFrame(() => this._animateVisualizer());
  },

  _updateUI: function(config) {
    const rateEl = document.getElementById("acoustic-rate-display");
    const confEl = document.getElementById("acoustic-conf-display");
    const badgeEl = document.getElementById("acoustic-badge-display");

    if (rateEl) rateEl.textContent = `${config.predictedRate.toFixed(1)} mm/hr`;
    if (confEl) confEl.textContent = `${config.confidence}% Confidence`;
    if (badgeEl) {
      badgeEl.textContent = config.statusBadge;
      badgeEl.className = `p-badge ${config.predictedRate > 20 ? 'rain-hotspot' : ''}`;
    }
  }
};
