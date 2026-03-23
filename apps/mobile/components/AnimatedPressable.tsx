import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedPressableProps {
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  children: React.ReactNode;
}

export function AnimatedPressable({ onPress, style, disabled, children }: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withTiming(0.96, { duration: 100, easing: Easing.out(Easing.quad) });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) });
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View style={[animStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
}
