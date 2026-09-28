# AeroAgro · Monsoon Almanac (Figma plugin)

Generates the complete AeroAgro design as **native, editable Figma layers**: a colour-variable collection with **Paper and Night modes**, text styles, variant components and full screens, filled with a live data snapshot from the downscaling engine. This file is the design source of truth for the website.

## Run it (2 minutes, Figma desktop app)

1. Open the **Figma desktop app** and create a new design file.
2. Menu → **Plugins → Development → Import plugin from manifest…**
3. Choose `design/figma-plugin/manifest.json` from this repo.
4. Run **Plugins → Development → AeroAgro · Monsoon Almanac**.

It takes about 15–30 s and builds six pages:

| Page | Contents |
|---|---|
| **Cover** | Poster headline with the highlighter, MoES statement, Fig 1 thermal comparison |
| **Foundations** | 20 colour **variables** in collection "AeroAgro · Monsoon Almanac" with **Paper** and **Night** modes (swatches show both); the night thermal data ramp; 12 **text styles** (Instrument Serif / Inter Tight / JetBrains Mono); space and shape scale |
| **Components** | **Button** (Primary / Ghost), **Chip** (Off / On), **Verdict tile** (Good / Warn / Bad) as variant sets; Section head, Card; a Night-mode specimen proving the same instances re-theme by mode |
| **Desktop** | 1440 px: live ticker, navigation, poster hero, Fig 1 night band, numbers row, (01) village sheet + what-to-do + 7-day outlook, (02) AI scan + map, (03) engine pipeline + DEM grid + explainable waterfall, (04) Ask AeroAgro + reach cards, footer wordmark |
| **Mobile** | 390 px: ticker, compact nav, poster, Fig 1, village sheet, spray verdict, assistant |
| **Architecture** | Sources → physics downscaler → outputs, with the model equations |

**How theming works:** night bands are ordinary frames whose variable mode is set to *Night*; every fill and stroke is bound to a variable, so moving a component into a night band re-themes it with no detaching. On Figma plans without extra variable modes the plugin falls back to raw night colours automatically.

**Real numbers:** `data.json` is a snapshot of the live Open-Meteo forecast and Copernicus GLO-90 DEM for **Munnar Tea High-Range**, run through the same engine as the website (block 17.2 °C → village 16.8 °C; 10.5 °C spread across 225 cells). Chat bubbles are genuine answers from the on-device assistant, including Hindi.

**Fonts:** Instrument Serif, Inter Tight and JetBrains Mono (Google Fonts, built into Figma). Missing fonts fall back to Fraunces / Inter / Roboto Mono. Hindi uses Poppins or Mukta; Malayalam uses Noto Sans Malayalam when present.

## Rebuild after changes

```bash
node scripts/build_figma_plugin.mjs   # bundles src/plugin.js + data.json + assets/*.png → code.js
```
