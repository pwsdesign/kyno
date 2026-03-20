import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../constants/colors';
import { getAuthBootstrapState } from '../services/authService';

export default function EntryRedirect() {
  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const { session } = await getAuthBootstrapState();
        if (!isMounted) {
          return;
        }

        router.replace(session ? '/(tabs)' : '/(onboarding)/welcome');
      } catch {
        if (!isMounted) {
          return;
        }

        router.replace('/(onboarding)/welcome');
      }
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={colors.accent} />
      <Text style={{ marginTop: 12, color: colors.textSecondary }}>Loading Kyno...</Text>
    </View>
  );
}
