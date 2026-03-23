import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
} from '@expo-google-fonts/playfair-display';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { initializeSupabaseAuth } from '../services/supabase';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    initializeSupabaseAuth();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider>
      <RootContent fontsLoaded={fontsLoaded} fontError={fontError} />
    </ThemeProvider>
  );
}

function RootContent({ fontsLoaded, fontError }: { fontsLoaded: boolean; fontError: Error | null }) {
  const { isDark } = useTheme();

  if (!fontsLoaded && !fontError) return null;

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: isDark ? '#1C1A17' : '#FDFBF7' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="booking/[serviceId]"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="settings/index"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="dogs/index"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="account/index"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="membership/index"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="community/index"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="settings/terms"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="settings/privacy"
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </>
  );
}

// Keep the default export as-is for Expo Router
