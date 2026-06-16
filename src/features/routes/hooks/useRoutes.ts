import { useMemo, useState } from 'react';

import geocacheData from '@/data/geocache.json';
import { routeModules } from '@/data/route-modules';
import routesIndex from '@/data/routes-index.json';

import type { Coordinates, GeocodedStop, Route, RouteSummary, WeekDay } from '../types';
import { isCollectedOnDay } from '../utils/schedule';
import { computeRouteStats } from '../utils/stats';

type Geocache = Record<string, Coordinates | null>;

export function useRoutes() {
  const summaries = routesIndex.routes as RouteSummary[];
  const geocache = geocacheData as Geocache;
  const [selectedSlug, setSelectedSlug] = useState(summaries[0]?.slug ?? '');
  const [selectedDay, setSelectedDay] = useState<WeekDay | null>(null);

  const selectedRoute = useMemo(
    (): Route | null => routeModules[selectedSlug] ?? null,
    [selectedSlug],
  );

  const filteredStops = useMemo(() => {
    if (!selectedRoute) return [];
    if (selectedDay === null) return selectedRoute.stops;
    return selectedRoute.stops.filter((s) => isCollectedOnDay(s, selectedDay));
  }, [selectedRoute, selectedDay]);

  const geocodedStops = useMemo((): GeocodedStop[] => {
    return filteredStops
      .map((stop) => {
        const coords = geocache[stop.address];
        if (!coords) return null;
        return { ...stop, ...coords };
      })
      .filter((s): s is GeocodedStop => s !== null)
      .sort((a, b) => a.order - b.order);
  }, [filteredStops, geocache]);

  const stats = useMemo(() => {
    if (!selectedRoute) return null;
    const routeGeocoded = selectedRoute.stops
      .map((stop) => {
        const coords = geocache[stop.address];
        return coords ? { ...stop, ...coords } : null;
      })
      .filter((s): s is GeocodedStop => s !== null)
      .sort((a, b) => a.order - b.order);
    return computeRouteStats(selectedRoute, routeGeocoded);
  }, [selectedRoute, geocache]);

  const geocodedCount = useMemo(() => {
    if (!selectedRoute) return 0;
    return selectedRoute.stops.filter((s) => geocache[s.address]).length;
  }, [selectedRoute, geocache]);

  return {
    summaries,
    selectedRoute,
    selectedSlug,
    setSelectedSlug,
    selectedDay,
    setSelectedDay,
    filteredStops,
    geocodedStops,
    stats,
    geocodedCount,
  };
}
