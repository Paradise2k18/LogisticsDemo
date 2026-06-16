import type { GeocodedStop, Route, RouteStats } from '../types';
import { WEEK_DAYS } from '../types';
import { getActiveDaysForStops } from './schedule';

function haversineKm(a: GeocodedStop, b: GeocodedStop): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function computeRouteStats(route: Route, geocoded: GeocodedStop[]): RouteStats {
  let totalDistanceKm = 0;
  for (let i = 1; i < geocoded.length; i++) {
    totalDistanceKm += haversineKm(geocoded[i - 1], geocoded[i]);
  }

  const activeDays = getActiveDaysForStops(route.stops);

  return {
    stopCount: route.stops.length,
    geocodedCount: geocoded.length,
    totalVolume: route.totalVolume,
    totalContainers: route.totalContainers,
    totalDistanceKm,
    collectionDays: activeDays.map((d) => WEEK_DAYS[d].label),
  };
}

export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}
