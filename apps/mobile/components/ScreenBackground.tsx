import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { stone } from '../constants/colors';

export function ScreenBackground({ isDark }: { isDark: boolean }) {
  const offset = useSharedValue(-90);

  useEffect(() => {
    if (!isDark) return;
    offset.value = withRepeat(
      withSequence(
        withTiming(-70, { duration: 7000 }),
        withTiming(-90, { duration: 7000 })
      ),
      -1,
      false
    );
  }, [isDark]);

  const glowStyle = useAnimatedStyle(() => ({
    top: offset.value,
    right: offset.value,
  }));

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
      <Animated.View style={[s.goldGlow, glowStyle]}>
        <LinearGradient
          colors={[
            'rgba(212,168,58,0.18)',
            'rgba(212,168,58,0.1)',
            'rgba(212,168,58,0.04)',
            'rgba(212,168,58,0)',
          ]}
          end={{ x: -0.06, y: 0.30 }}
          start={{ x: 0.20, y: -0.06 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
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
    overflow: 'hidden',
    position: 'absolute',
    transform: [{ rotate: '8deg' }],
    width: 440,
  },
});
