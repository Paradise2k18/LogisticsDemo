import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const input = join(root, 'assets/data/routes.xlsx');
const indexOutput = join(root, 'src/data/routes-index.json');
const routesDir = join(root, 'assets/data/routes');

function toSlug(id) {
  return id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const wb = XLSX.readFile(input);
const rows = XLSX.utils.sheet_to_json(wb.Sheets['TDSheet'], { header: 1, defval: '' });

const index = [];
let current = null;

rmSync(routesDir, { recursive: true, force: true });
mkdirSync(routesDir, { recursive: true });

for (let i = 3; i < rows.length; i++) {
  const row = rows[i];
  const label = row[0];

  if (label && typeof label === 'string' && label.includes('no')) {
    if (current?.stops.length) {
      const slug = toSlug(current.id);
      index.push({
        id: current.id,
        slug,
        date: current.date,
        stopCount: current.stops.length,
        totalVolume: current.totalVolume,
        totalContainers: current.totalContainers,
      });
      writeFileSync(join(routesDir, `${slug}.json`), JSON.stringify(current));
    }
    current = {
      id: label.replace(/\s+/g, ' ').trim(),
      date: row[1] || '',
      totalVolume: row[7] === 'Total:' ? Number(row[8]) || 0 : 0,
      totalContainers: row[7] === 'Total:' ? Number(row[9]) || 0 : 0,
      stops: [],
    };
    continue;
  }

  if (!current) continue;

  if (row[7] === 'Total:') {
    current.totalVolume = Number(row[8]) || 0;
    current.totalContainers = Number(row[9]) || 0;
    continue;
  }

  if (!row[7] || !row[6]) continue;

  current.stops.push({
    order: Number(row[6]),
    address: String(row[7]).trim(),
    binCode: String(row[3] || ''),
    dayPattern: String(row[4] || ''),
    frequency: String(row[5] || ''),
    timeSpent: row[2] !== '' ? Number(row[2]) : null,
    volume: Number(row[8]) || 0,
    containers: Number(row[9]) || 0,
  });
}

if (current?.stops.length) {
  const slug = toSlug(current.id);
  index.push({
    id: current.id,
    slug,
    date: current.date,
    stopCount: current.stops.length,
    totalVolume: current.totalVolume,
    totalContainers: current.totalContainers,
  });
  writeFileSync(join(routesDir, `${slug}.json`), JSON.stringify(current));
}

writeFileSync(indexOutput, JSON.stringify({ routes: index }, null, 0));

const loaderOutput = join(root, 'src/data/route-modules.ts');
const loaderLines = index.map(
  (r) => `  '${r.slug}': require('../../assets/data/routes/${r.slug}.json'),`,
);
writeFileSync(
  loaderOutput,
  `import type { Route } from '@/features/routes/types';\n\nexport const routeModules: Record<string, Route> = {\n${loaderLines.join('\n')}\n};\n`,
);

console.log(`Processed ${index.length} routes into assets/data/routes/`);
