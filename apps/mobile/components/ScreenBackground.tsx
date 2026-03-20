import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { stone } from '../constants/colors';

export function ScreenBackground({ isDark }: { isDark: boolean }) {
  if (!isDark) {
    return null;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[stone[900], '#2A2824', stone[900]]}
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
        end={{ x: -0.06, y: 0.30 }}
        start={{ x: 0.20, y: -0.06 }}
        style={s.goldGlow}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.02)', 'rgba(255,255,255,0)']}
        end={{ x: 0.7, y: 1 }}
        start={{ x: 0.7, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const s = StyleSheet.create({
  goldGlow: {
    borderRadius: 440,
    height: 440,
    position: 'absolute',
    right: -90,
    top: -90,
    transform: [{ rotate: '8deg' }],
    width: 440,
  },
});
