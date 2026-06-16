import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';

import { RouteMapView } from '../components/RouteMapView';
import { RoutePicker } from '../components/RoutePicker';
import { RouteStatsPanel } from '../components/RouteStatsPanel';
import { StopList } from '../components/StopList';
import { WeekDayPicker } from '../components/WeekDayPicker';
import { useRoutes } from '../hooks/useRoutes';

export function RoutesScreen() {
  const {
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
  } = useRoutes();

  if (!selectedRoute) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>No route data loaded</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedText type="subtitle" style={styles.title}>
            Waste Routes
          </ThemedText>

          <RoutePicker routes={summaries} selectedSlug={selectedSlug} onSelect={setSelectedSlug} />

          <WeekDayPicker
            stops={selectedRoute.stops}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />

          <RouteMapView
            stops={geocodedStops}
            geocodedCount={geocodedCount}
            totalCount={selectedRoute.stops.length}
          />
          <RouteStatsPanel route={selectedRoute} stats={stats} />

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Stops ({filteredStops.length})
          </ThemedText>
          <StopList stops={filteredStops.slice(0, 30)} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    paddingBottom: BottomTabInset + Spacing.four,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.two,
  },
});
