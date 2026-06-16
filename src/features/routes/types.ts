export type Coordinates = { lat: number; lng: number };

export type RouteStop = {
  order: number;
  address: string;
  binCode: string;
  dayPattern: string;
  frequency: string;
  timeSpent: number | null;
  volume: number;
  containers: number;
};

export type Route = {
  id: string;
  date: string;
  totalVolume: number;
  totalContainers: number;
  stops: RouteStop[];
};

export type RouteSummary = {
  id: string;
  slug: string;
  date: string;
  stopCount: number;
  totalVolume: number;
  totalContainers: number;
};

export type GeocodedStop = RouteStop & Coordinates;

export type RouteStats = {
  stopCount: number;
  geocodedCount: number;
  totalVolume: number;
  totalContainers: number;
  totalDistanceKm: number;
  collectionDays: string[];
};

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const WEEK_DAYS: { index: WeekDay; label: string; short: string }[] = [
  { index: 0, label: 'Monday', short: 'Mon' },
  { index: 1, label: 'Tuesday', short: 'Tue' },
  { index: 2, label: 'Wednesday', short: 'Wed' },
  { index: 3, label: 'Thursday', short: 'Thu' },
  { index: 4, label: 'Friday', short: 'Fri' },
  { index: 5, label: 'Saturday', short: 'Sat' },
  { index: 6, label: 'Sunday', short: 'Sun' },
];
