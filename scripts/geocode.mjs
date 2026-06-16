import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const routesPath = join(root, 'src/data/routes-index.json');
const cachePath = join(root, 'src/data/geocache.json');

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const DELAY_MS = 1100;
const DEFAULT_COUNTRY = 'Latvia';

const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, 'utf8')) : {};
const { routes: indexRoutes } = JSON.parse(readFileSync(routesPath, 'utf8'));

const routeFilter = process.argv[2];
const geocodeAll = routeFilter === '--all' || routeFilter === 'all';
const routesDir = join(root, 'assets/data/routes');

const selectedSummaries = geocodeAll
  ? indexRoutes
  : routeFilter
    ? indexRoutes.filter((r) => r.id.includes(routeFilter))
    : indexRoutes.slice(0, 1);

console.log(
  geocodeAll
    ? `All ${selectedSummaries.length} routes`
    : routeFilter
      ? `Routes matching "${routeFilter}" (${selectedSummaries.length})`
      : `First route only (${selectedSummaries[0]?.id ?? 'none'})`,
);

const selectedRoutes = selectedSummaries.map((r) =>
  JSON.parse(readFileSync(join(routesDir, `${r.slug}.json`), 'utf8')),
);

const addresses = [...new Set(selectedRoutes.flatMap((r) => r.stops.map((s) => s.address)))];
const pending = addresses.filter((a) => !(a in cache));

console.log(`Geocoding ${pending.length} of ${addresses.length} addresses (${Object.keys(cache).length} cached)`);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function simplifyAddress(address) {
  return address.replace(/\/[^/]+\/?/g, '').trim();
}

async function geocode(address) {
  const queries = [`${address}, ${DEFAULT_COUNTRY}`, `${simplifyAddress(address)}, ${DEFAULT_COUNTRY}`];

  for (const query of [...new Set(queries)]) {
    const params = new URLSearchParams({ q: query, format: 'json', limit: '1' });
    const res = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { 'User-Agent': 'LogisticsDemo/1.0 (waste collection route demo)' },
    });

    if (!res.ok) continue;

    const data = await res.json();
    if (data.length) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  }

  console.warn(`  No result: ${address}`);
  return null;
}

for (let i = 0; i < pending.length; i++) {
  const address = pending[i];
  process.stdout.write(`[${i + 1}/${pending.length}] ${address}... `);
  try {
    cache[address] = await geocode(address);
    console.log(cache[address] ? 'ok' : 'miss');
  } catch (err) {
    console.log('error:', err.message);
    cache[address] = null;
  }
  writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  if (i < pending.length - 1) await sleep(DELAY_MS);
}

const geocoded = addresses.filter((a) => cache[a]).length;
console.log(`Done. ${geocoded}/${addresses.length} addresses geocoded.`);
