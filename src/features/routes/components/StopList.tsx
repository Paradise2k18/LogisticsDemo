import { FlatList, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

import type { RouteStop } from '../types';
import { formatCollectionDays, formatFrequency } from '../utils/schedule';

type StopListProps = {
  stops: RouteStop[];
};

function StopListItem({ stop }: { stop: RouteStop }) {
  return (
    <ThemedView type="backgroundElement" style={styles.item}>
      <View style={styles.header}>
        <ThemedText type="smallBold">#{stop.order}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {stop.binCode}
        </ThemedText>
      </View>
      <ThemedText type="small">{stop.address}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {formatCollectionDays(stop.dayPattern)} · {formatFrequency(stop.frequency)} ·{' '}
        {stop.containers}× ({stop.volume} m³)
      </ThemedText>
    </ThemedView>
  );
}

export function StopList({ stops }: StopListProps) {
  return (
    <FlatList
      data={stops}
      keyExtractor={(item) => `${item.order}-${item.address}`}
      renderItem={({ item }) => <StopListItem stop={item} />}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: Spacing.three,
    paddingTop: 0,
  },
  item: {
    padding: Spacing.two,
    borderRadius: Spacing.two,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    height: Spacing.two,
  },
});
