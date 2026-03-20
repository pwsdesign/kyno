import { type ReactNode } from 'react';
import { StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { getColors, stone } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

interface ThemedCardProps {
  children: ReactNode;
  darkBorderColor?: string;
  lightBackgroundColor?: string;
  lightBorderColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function ThemedCard({
  children,
  darkBorderColor = 'rgba(212,168,58,0.12)',
  lightBackgroundColor,
  lightBorderColor,
  style,
}: ThemedCardProps) {
  const { isDark } = useTheme();
  const c = getColors(isDark);

  if (!isDark) {
    return (
      <View
        style={[
          s.base,
          style,
          {
            backgroundColor: lightBackgroundColor ?? c.surface,
            borderColor: lightBorderColor ?? 'rgba(28,26,23,0.08)',
          },
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={[s.base, { borderColor: darkBorderColor }, style]}>
      <LinearGradient
        colors={[stone[900], '#2A2824', stone[800]]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[
          'rgba(212,168,58,0.18)',
          'rgba(212,168,58,0.1)',
          'rgba(212,168,58,0.04)',
          'rgba(212,168,58,0)',
        ]}
        end={{ x: -0.01, y: 0.30 }}
        start={{ x: 0.2, y: -0.20 }}
        style={s.goldGlow}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.025)', 'rgba(255,255,255,0)']}
        end={{ x: 0.5, y: 1 }}
        start={{ x: 0.5, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  base: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  goldGlow: {
    borderRadius: 180,
    height: 240,
    position: 'absolute',
    right: -44,
    top: -42,
    transform: [{ rotate: '8deg' }],
    width: 260,
  },
});
