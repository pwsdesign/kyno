import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { fonts, getColors, stone, warm } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();
  const c = getColors(isDark);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={toggleTheme}
      style={[
        s.toggle,
        {
          backgroundColor: isDark ? 'rgba(247,241,230,0.08)' : warm[300],
          borderColor: isDark ? 'rgba(212,168,58,0.2)' : stone[300],
        },
      ]}
    >
      <Text style={[s.icon, { color: c.accent }]}>{isDark ? '☾' : '☼'}</Text>
      <Text style={[s.label, { color: c.textPrimary }]}>{isDark ? 'Dark' : 'Light'}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  toggle: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  icon: { fontSize: 13 },
  label: { fontFamily: fonts.sansMedium, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase' },
});
