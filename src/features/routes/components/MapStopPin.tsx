import { StyleSheet, Text, View } from 'react-native';

const PIN_COLOR = '#FF3B30';

type MapStopPinProps = {
  order: number;
};

export function MapStopPin({ order }: MapStopPinProps) {
  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.label}>{order}</Text>
      </View>
      <View style={styles.stem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  head: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PIN_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  label: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  stem: {
    width: 2,
    height: 6,
    backgroundColor: PIN_COLOR,
    marginTop: -1,
  },
});
