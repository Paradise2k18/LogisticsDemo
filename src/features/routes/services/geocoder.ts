import type { Coordinates } from '../types';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const DEFAULT_COUNTRY = 'Latvia';
const REQUEST_TIMEOUT_MS = 15_000;
const RATE_LIMIT_MS = 1100;

function simplifyAddress(address: string): string {
  return address.replace(/\/[^/]+\/?/g, '').trim();
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  const queries = [`${address}, ${DEFAULT_COUNTRY}`, `${simplifyAddress(address)}, ${DEFAULT_COUNTRY}`];

  for (const query of [...new Set(queries)]) {
    try {
      const params = new URLSearchParams({ q: query, format: 'json', limit: '1' });
      const res = await fetchWithTimeout(`${NOMINATIM_URL}?${params}`, {
        headers: { 'User-Agent': 'LogisticsDemo/1.0' },
      });

      if (!res.ok) continue;

      const data = await res.json();
      if (data.length) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch {
      continue;
    }
  }

  return null;
}

export async function geocodeAddresses(
  addresses: string[],
  onProgress?: (done: number, total: number) => void,
  isCancelled?: () => boolean,
): Promise<Record<string, Coordinates | null>> {
  const result: Record<string, Coordinates | null> = {};

  for (let i = 0; i < addresses.length; i++) {
    if (isCancelled?.()) break;

    const address = addresses[i];
    result[address] = await geocodeAddress(address);
    onProgress?.(i + 1, addresses.length);

    if (i < addresses.length - 1 && !isCancelled?.()) {
      await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
    }
  }

  return result;
}
