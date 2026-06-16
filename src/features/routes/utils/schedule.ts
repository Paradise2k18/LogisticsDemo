import type { RouteStop, WeekDay } from '../types';
import { WEEK_DAYS } from '../types';

/** Day pattern: 7 chars Mon–Sun; digit = collection day (e.g. xx3xxx7 → Wed, Sun). */
export function parseCollectionDays(pattern: string): WeekDay[] {
  if (!pattern || pattern.length < 7) return [];

  const days: WeekDay[] = [];
  for (let i = 0; i < 7; i++) {
    const char = pattern[i];
    if (char >= '1' && char <= '7') {
      days.push((Number(char) - 1) as WeekDay);
    }
  }
  return days;
}

export function formatCollectionDays(pattern: string): string {
  const days = parseCollectionDays(pattern);
  if (!days.length) return 'No schedule';
  return days.map((d) => WEEK_DAYS[d].short).join(', ');
}

export function formatFrequency(frequency: string): string {
  switch (frequency) {
    case '1xn':
      return 'Once per week';
    case '1x2n':
      return 'Once every 2 weeks';
    case '1x4n':
      return 'Once every 4 weeks';
    default:
      return frequency || 'Not specified';
  }
}

export function isCollectedOnDay(stop: RouteStop, day: WeekDay): boolean {
  return parseCollectionDays(stop.dayPattern).includes(day);
}

export function getActiveDaysForStops(stops: RouteStop[]): WeekDay[] {
  const set = new Set<WeekDay>();
  stops.forEach((stop) => parseCollectionDays(stop.dayPattern).forEach((d) => set.add(d)));
  return [...set].sort((a, b) => a - b);
}
