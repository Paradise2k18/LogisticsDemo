import { useEffect, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, type Region } from 'react-native-maps';

import { MapStopPin } from './MapStopPin';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import type { GeocodedStop } from '../types';
import { formatCollectionDays, formatFrequency } from '../utils/schedule';

type RouteMapViewProps = {
  stops: GeocodedStop[];
  geocodedCount: number;
  totalCount: number;
};

const MIN_DELTA = 0.002;
const MAX_DELTA = 2;
const ZOOM_FACTOR = 0.5;

function fitRegion(stops: GeocodedStop[]): Region {
  if (!stops.length) {
    return { latitude: 56.9496, longitude: 24.1052, latitudeDelta: 0.15, longitudeDelta: 0.15 };
  }
  const lats = stops.map((s) => s.lat);
  const lngs = stops.map((s) => s.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const pad = 0.02;

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(maxLat - minLat + pad, 0.05),
    longitudeDelta: Math.max(maxLng - minLng + pad, 0.05),
  };
}

function ZoomButton({ label, onPress }: { label: string; onPress: () => void }) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.zoomButton, { backgroundColor: theme.background }]}
      accessibilityRole="button"
      accessibilityLabel={label === '+' ? 'Zoom in' : 'Zoom out'}>
      <ThemedText type="smallBold">{label}</ThemedText>
    </Pressable>
  );
}

export function RouteMapView({ stops, geocodedCount, totalCount }: RouteMapViewProps) {
  const mapRef = useRef<MapView>(null);
  const regionRef = useRef<Region>(fitRegion(stops));

  const stopsKey = useMemo(
    () => stops.map((s) => `${s.order}:${s.lat}:${s.lng}`).join('|'),
    [stops],
  );

  const initialRegion = useMemo(() => fitRegion(stops), [stopsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const next = fitRegion(stops);
    regionRef.current = next;
    mapRef.current?.animateToRegion(next, 300);
  }, [stopsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const zoom = (direction: 'in' | 'out') => {
    const current = regionRef.current;
    const factor = direction === 'in' ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;

    const next: Region = {
      latitude: current.latitude,
      longitude: current.longitude,
      latitudeDelta: Math.min(Math.max(current.latitudeDelta * factor, MIN_DELTA), MAX_DELTA),
      longitudeDelta: Math.min(Math.max(current.longitudeDelta * factor, MIN_DELTA), MAX_DELTA),
    };

    regionRef.current = next;
    mapRef.current?.animateToRegion(next, 200);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        onRegionChangeComplete={(next) => {
          regionRef.current = next;
        }}>
        {stops.map((stop) => (
          <Marker
            key={`${stop.order}-${stop.address}`}
            coordinate={{ latitude: stop.lat, longitude: stop.lng }}
            title={`#${stop.order} ${stop.address}`}
            description={`${formatCollectionDays(stop.dayPattern)} · ${formatFrequency(stop.frequency)} · ${stop.containers} bin(s)`}
            tracksViewChanges={false}
            anchor={{ x: 0.5, y: 1 }}>
            <MapStopPin order={stop.order} />
          </Marker>
        ))}
        {stops.length > 1 ? (
          <Polyline
            coordinates={stops.map((s) => ({ latitude: s.lat, longitude: s.lng }))}
            strokeColor="#007AFF"
            strokeWidth={3}
          />
        ) : null}
      </MapView>

      <View style={styles.zoomControls} pointerEvents="box-none">
        <ZoomButton label="+" onPress={() => zoom('in')} />
        <ZoomButton label="−" onPress={() => zoom('out')} />
      </View>

      {geocodedCount < totalCount ? (
        <View style={styles.banner} pointerEvents="none">
          <ThemedText type="small">
            {geocodedCount}/{totalCount} stops on map · run{' '}
            <ThemedText type="code">npm run geocode</ThemedText> for more
          </ThemedText>
        </View>
      ) : null}

      {!stops.length ? (
        <View style={styles.empty} pointerEvents="none">
          <ThemedText type="small" themeColor="textSecondary">
            No geocoded stops — run npm run geocode
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 360,
  },
  map: {
    flex: 1,
  },
  zoomControls: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    gap: 8,
    zIndex: 10,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  banner: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 56,
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: 8,
    borderRadius: 8,
  },
  empty: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
