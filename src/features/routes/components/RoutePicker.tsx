import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { RouteSummary } from '../types';

type RoutePickerProps = {
  routes: RouteSummary[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
};

function formatRouteLabel(id: string) {
  return id.replace(/\s+/g, ' ').trim();
}

export function RoutePicker({ routes, selectedSlug, onSelect }: RoutePickerProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');

  const selected = routes.find((r) => r.slug === selectedSlug);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return routes;
    return routes.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.date.includes(q) ||
        String(r.stopCount).includes(q),
    );
  }, [routes, query]);

  const pick = (slug: string) => {
    onSelect(slug);
    setVisible(false);
    setQuery('');
  };

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={({ pressed }) => [
          styles.trigger,
          { backgroundColor: theme.backgroundElement },
          pressed && styles.triggerPressed,
        ]}>
        <View style={styles.triggerContent}>
          <ThemedText type="small" themeColor="textSecondary">
            Route
          </ThemedText>
          <ThemedText type="smallBold" numberOfLines={1} style={styles.triggerValue}>
            {selected ? formatRouteLabel(selected.id) : 'Select route'}
          </ThemedText>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          ›
        </ThemedText>
      </Pressable>

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
        onRequestClose={() => setVisible(false)}>
        <ThemedView style={styles.modal}>
          <SafeAreaView style={styles.modalSafe} edges={['top', 'bottom']}>
            <View style={[styles.header, { borderBottomColor: theme.backgroundSelected }]}>
              <ThemedText type="smallBold" style={styles.headerTitle}>
                Select Route
              </ThemedText>
              <Pressable onPress={() => setVisible(false)} hitSlop={8}>
                <ThemedText type="smallBold" style={styles.doneButton}>
                  Done
                </ThemedText>
              </Pressable>
            </View>

            <View style={[styles.searchWrap, { backgroundColor: theme.backgroundElement }]}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search routes"
                placeholderTextColor={theme.textSecondary}
                style={[styles.searchInput, { color: theme.text }]}
                clearButtonMode="while-editing"
                autoCorrect={false}
              />
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.slug}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.list}
              renderItem={({ item }) => {
                const active = item.slug === selectedSlug;
                return (
                  <Pressable
                    onPress={() => pick(item.slug)}
                    style={({ pressed }) => [
                      styles.row,
                      { borderBottomColor: theme.backgroundSelected },
                      pressed && { backgroundColor: theme.backgroundSelected },
                    ]}>
                    <View style={styles.rowText}>
                      <ThemedText type="smallBold">{formatRouteLabel(item.id)}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {item.date} · {item.stopCount} stops · {item.totalContainers} bins
                      </ThemedText>
                    </View>
                    {active ? (
                      <ThemedText type="smallBold" style={styles.checkmark}>
                        ✓
                      </ThemedText>
                    ) : null}
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
                  No routes match your search
                </ThemedText>
              }
            />
          </SafeAreaView>
        </ThemedView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.two,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerPressed: {
    opacity: 0.85,
  },
  triggerContent: {
    flex: 1,
    gap: 2,
    marginRight: Spacing.two,
  },
  triggerValue: {
    flexShrink: 1,
  },
  modal: {
    flex: 1,
  },
  modalSafe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 17,
  },
  doneButton: {
    color: '#007AFF',
    fontSize: 17,
  },
  searchWrap: {
    margin: Spacing.three,
    borderRadius: 10,
    paddingHorizontal: Spacing.two,
  },
  searchInput: {
    fontSize: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
  },
  list: {
    paddingBottom: Spacing.four,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  checkmark: {
    color: '#007AFF',
    fontSize: 18,
  },
  empty: {
    textAlign: 'center',
    padding: Spacing.four,
  },
});
