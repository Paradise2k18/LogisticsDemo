import { StyleSheet, View } from 'react-native';

import { StatRow } from './StatRow';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

import type { Route, RouteStats } from '../types';
import { formatDistance } from '../utils/stats';

type RouteStatsPanelProps = {
  route: Route;
  stats: RouteStats | null;
};

export function RouteStatsPanel({ route, stats }: RouteStatsPanelProps) {
  if (!stats) return null;

  return (
    <ThemedView type="backgroundElement" style={styles.panel}>
      <ThemedText type="subtitle">{route.id.replace(/\s+/g, ' ')}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Date: {route.date} · {stats.collectionDays.join(', ')}
      </ThemedText>

      <View style={styles.stats}>
        <StatRow label="Stops" value={`${stats.geocodedCount}/${stats.stopCount}`} />
        <StatRow label="Containers" value={String(stats.totalContainers)} />
        <StatRow label="Volume" value={`${stats.totalVolume.toFixed(1)} m³`} />
        <StatRow label="Route distance" value={formatDistance(stats.totalDistanceKm)} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  panel: {
    margin: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  stats: {
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
});
