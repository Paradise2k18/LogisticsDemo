import { ScrollView, StyleSheet, View } from 'react-native';

import { Badge } from './Badge';
import { Spacing } from '@/constants/theme';

import type { WeekDay } from '../types';
import { WEEK_DAYS } from '../types';
import { getActiveDaysForStops } from '../utils/schedule';
import type { RouteStop } from '../types';

type WeekDayPickerProps = {
  stops: RouteStop[];
  selectedDay: WeekDay | null;
  onSelectDay: (day: WeekDay | null) => void;
};

export function WeekDayPicker({ stops, selectedDay, onSelectDay }: WeekDayPickerProps) {
  const activeDays = getActiveDaysForStops(stops);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Badge label="All" active={selectedDay === null} onPress={() => onSelectDay(null)} />
        {WEEK_DAYS.map(({ index, short }) => {
          const isActive = activeDays.includes(index);
          if (!isActive) return null;
          return (
            <Badge
              key={index}
              label={short}
              active={selectedDay === index}
              onPress={() => onSelectDay(index)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.two,
  },
  row: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
});
