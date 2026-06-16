# LogisticsDemo — Waste Collection Routes

A React Native app that reads waste collection routes from an Excel file, geocodes addresses, and displays them on a map with route order, schedule info, and statistics.

## Tech stack

| Layer | Library |
|---|---|
| Framework | [Expo SDK 56](https://docs.expo.dev/) + [Expo Router](https://docs.expo.dev/router/introduction/) |
| UI | React Native 0.85, TypeScript |
| Maps | [react-native-maps](https://github.com/react-native-maps/react-native-maps) |
| Excel parsing | [xlsx](https://www.npmjs.com/package/xlsx) (build scripts only) |
| Geocoding | [OpenStreetMap Nominatim](https://nominatim.org/) (build scripts only) |

## Features

- Parse route data from Excel (`assets/data/routes.xlsx`)
- Display stops on a map with markers and route polylines
- Filter stops by collection day (Mon–Sun)
- Show route stats: stops, containers, volume, distance
- Show bin schedule and frequency per stop

### Schedule codes

| Code | Meaning |
|---|---|
| `xx3xxx7` | Collected Wed & Sun |
| `xxx4xxx` | Collected Thu |
| `1xn` | Once per week |
| `1x2n` | Once every 2 weeks |

Day patterns use 7 characters (Mon–Sun); a digit means collection on that day.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Process route data (if Excel file changed)

Converts the Excel file into JSON route files:

```bash
npm run process-routes
```

This generates:
- `src/data/routes-index.json` — route list
- `src/data/route-modules.ts` — route loader
- `assets/data/routes/*.json` — per-route stop data

### 3. Geocode addresses

Coordinates are stored in `src/data/geocache.json`. The app reads this file at startup — it does **not** geocode at runtime.

```bash
# First route only (~119 addresses, ~2 min)
npm run geocode

# Specific route(s) by ID fragment
npm run geocode 11841

# All 430 routes (~14,500 unique addresses, several hours)
npm run geocode:all
```

Scripts skip addresses already in the cache, so re-running is safe.

After geocoding, restart the app to load the updated cache.

### 4. Run the app

```bash
npm start
```

Then press:
- `i` — iOS Simulator
- `a` — Android Emulator
- `w` — Web browser

Or scan the QR code with Expo Go on a physical device.

## Project structure

```
assets/data/
  routes.xlsx              # Source Excel file
  routes/*.json            # Per-route stop data

src/
  data/
    geocache.json          # Geocoded coordinates
    routes-index.json      # Route summaries
    route-modules.ts       # Auto-generated route loader

  features/routes/         # Main feature module
    components/            # Badge, MapStopPin, RouteMapView, etc.
    hooks/                 # useRoutes
    utils/                 # Schedule parsing, stats
    screens/               # RoutesScreen

  components/              # Shared app shell (tabs, themed text)

scripts/
  process-routes.mjs       # Excel → JSON
  geocode.mjs              # Nominatim geocoding
```

## Available scripts

| Script | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run ios` | Start and open iOS simulator |
| `npm run android` | Start and open Android emulator |
| `npm run web` | Start web version |
| `npm run process-routes` | Parse Excel into route JSON |
| `npm run geocode` | Geocode first route |
| `npm run geocode:all` | Geocode all routes |
| `npm run lint` | Run ESLint |

## Notes

- Geocoding uses Nominatim's public API with a ~1 req/sec rate limit. Be respectful of their [usage policy](https://operations.osmfoundation.org/policies/nominatim/).
- Maps work best on iOS Simulator or a physical device. Web map support is limited.
- If a route has partial geocoding, the map shows a banner with the count of mapped stops.
