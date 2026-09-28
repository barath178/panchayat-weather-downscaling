# AeroAgro · Field Instrument (Figma plugin)

Generates the complete AeroAgro design as **native, editable Figma layers**. No screenshots of the whole UI and no SVG dump: real auto-layout frames, colour variables, text styles and variant components, filled with a live data snapshot from the downscaling engine.

## Run it (2 minutes, Figma desktop app)

1. Open the **Figma desktop app** and create a new design file.
2. Menu → **Plugins → Development → Import plugin from manifest…**
3. Choose `design/figma-plugin/manifest.json` from this repo.
4. Run it: **Plugins → Development → AeroAgro · Field Instrument**.

It takes about 10–20 s and builds six pages:

| Page | Contents |
|---|---|
| **Cover** | Title, MoES problem statement, snapshot metadata, thermal-map art |
| **Foundations** | 17 colour **variables** (collection "AeroAgro · Field Instrument"), the night thermal data ramp, 12 **text styles** (`AeroAgro/display/*`, `body/*`, `mono/*`), spacing and radius scale |
| **Components** | Button (Primary / Ghost), Chip (Off / On), Verdict tile (Good / Warn / Bad) as **variant sets**; Section head, Readout, Scale bar, North arrow, HUD panel with corner ticks pinned by constraints |
| **Desktop** | 1440 px dashboard: header, telemetry strip, hero with the resolution comparison, 01 Live dashboard (map, today card, 7-day strip), 02 Downscaling engine (pipeline, 1.2 km DEM grid with A–O / 1–15 references, explainable waterfall with equations), 03 Ask AeroAgro chat |
| **Mobile** | 390 px farmer view: today card, spray verdict, next 3 days, assistant |
| **Architecture** | Data → physics → farmer diagram with the model equations |

Every number is real: `data.json` is a snapshot of the live Open-Meteo forecast and Copernicus GLO-90 DEM for **Munnar Tea High-Range**, run through the same engine as the website (block 17.2 °C → village 16.8 °C; 10.5 °C spread across the 225 cells). The chat bubbles are genuine answers from the on-device assistant, including Hindi.

Fonts: Fraunces, Plus Jakarta Sans and JetBrains Mono (all Google Fonts, available in Figma). If one is missing the plugin falls back to Inter / Roboto Mono automatically. Hindi uses Poppins or Mukta; Malayalam uses Noto Sans Malayalam when present.

## Rebuild after changes

```bash
node scripts/build_figma_plugin.mjs   # bundles src/plugin.js + data.json + assets/*.png → code.js
```

- `src/plugin.js`: generator logic (edit this, not `code.js`)
- `data.json`: live engine snapshot
- `assets/`: PNG renders of the live canvases (thermal comparison, 1.2 km DEM grid, national map)
