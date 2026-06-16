import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';

export default function AboutScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="title">About</ThemedText>
          <ThemedText type="default">
            Waste collection route viewer built from Excel route data. Addresses are geocoded via
            OpenStreetMap Nominatim and displayed on a map with route order polylines.
          </ThemedText>
          <ThemedText type="subtitle">Schedule codes</ThemedText>
          <ThemedText type="small">xx3xxx7 — collected Wed & Sun</ThemedText>
          <ThemedText type="small">xxx4xxx — collected Thu</ThemedText>
          <ThemedText type="small">1xn — once per week</ThemedText>
          <ThemedText type="small">1x2n — once every 2 weeks</ThemedText>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
  },
});
