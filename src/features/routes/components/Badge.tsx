import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

type BadgeProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function Badge({ label, active, onPress }: BadgeProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.badge,
        { backgroundColor: active ? theme.text : theme.backgroundElement },
      ]}>
      <ThemedText
        type="smallBold"
        style={{ color: active ? theme.background : theme.text }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
});
