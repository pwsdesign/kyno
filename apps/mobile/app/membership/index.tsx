import { useEffect, useState } from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { MembershipCard } from '../../components/MembershipCard';
import { colors, fonts, gold, stone, getColors } from '../../constants/colors';
import { getCurrentProfile, type UserProfile } from '../../services/authService';
import { ensureWalletPassUrl } from '../../services/membershipService';
import { useTheme } from '../../context/ThemeContext';
import { ScreenBackground } from '../../components/ScreenBackground';
import { ThemedCard } from '../../components/ThemedCard';

const appleWalletEnabled = process.env.EXPO_PUBLIC_ENABLE_APPLE_WALLET === 'true';

export default function MembershipScreen() {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const { fromSignup } = useLocalSearchParams<{ fromSignup?: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isRegisteringPass, setIsRegisteringPass] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const nextProfile = await getCurrentProfile();

        if (!isMounted) {
          return;
        }

        setProfile(nextProfile);

        if (appleWalletEnabled && !nextProfile?.wallet_pass_url) {
          setIsRegisteringPass(true);

          try {
            await ensureWalletPassUrl();
            const refreshedProfile = await getCurrentProfile();

            if (isMounted) {
              setProfile(refreshedProfile);
            }
          } catch (error) {
            if (isMounted) {
              Alert.alert('Wallet setup pending', error instanceof Error ? error.message : 'Please try again.');
            }
          } finally {
            if (isMounted) {
              setIsRegisteringPass(false);
            }
          }
        }
      } catch (error) {
        if (isMounted) {
          Alert.alert('Unable to load membership', error instanceof Error ? error.message : 'Please try again.');
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleWalletPress = async () => {
    if (!appleWalletEnabled) {
      Alert.alert(
        'Apple Wallet coming soon',
        'The membership card is ready in-app. We will enable Apple Wallet once the Apple Developer account and signing certificates are set up.'
      );
      return;
    }

    if (Platform.OS !== 'ios') {
      Alert.alert('Apple Wallet only', 'The Wallet pass is only available on iPhone.');
      return;
    }

    if (!profile?.wallet_pass_url) {
      Alert.alert(
        'Wallet pass not configured yet',
        'The membership card UI is ready, but Apple Wallet still needs a signed .pkpass URL from the backend before this button can add it.'
      );
      return;
    }

    const canOpen = await Linking.canOpenURL(profile.wallet_pass_url);

    if (!canOpen) {
      Alert.alert('Unable to open pass', 'The configured Wallet pass URL could not be opened.');
      return;
    }

    await Linking.openURL(profile.wallet_pass_url);
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]} edges={['top']}>
      <ScreenBackground isDark={isDark} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => (fromSignup ? router.replace('/(tabs)') : router.back())}>
            <Text style={[s.backText, { color: c.textSecondary }]}>{fromSignup ? 'Skip for now' : '← Back'}</Text>
          </TouchableOpacity>
          <Text style={[s.title, { color: c.textPrimary }]}>Membership</Text>
          <Text style={[s.subtitle, { color: c.textSecondary }]}>Your Kyno member card is generated automatically after signup.</Text>
        </View>

        <MembershipCard profile={profile} />

        <ThemedCard lightBackgroundColor={c.surface} lightBorderColor={c.border} style={s.panel}>
          <Text style={[s.panelTitle, { color: c.textPrimary }]}>Apple Wallet</Text>
          <Text style={[s.panelText, { color: c.textSecondary }]}>
            {!appleWalletEnabled
              ? 'Apple Wallet is staged as a future upgrade. The in-app membership card is live now, and the Wallet pass will turn on once the Apple Developer account is ready.'
              : profile?.wallet_pass_url
              ? 'Your membership pass is ready to be opened in Apple Wallet on iPhone.'
              : 'We are generating the secure Wallet pass URL for this member profile.'}
          </Text>
          <TouchableOpacity
            style={[s.walletBtn, { backgroundColor: isDark ? stone[800] : colors.dark }, (!appleWalletEnabled || isRegisteringPass) && s.disabledBtn]}
            onPress={() => void handleWalletPress()}
            disabled={!appleWalletEnabled || isRegisteringPass}
          >
            <Text style={s.walletBtnText}>
              {!appleWalletEnabled ? 'APPLE WALLET COMING SOON' : isRegisteringPass ? 'GENERATING PASS...' : 'ADD TO APPLE WALLET'}
            </Text>
          </TouchableOpacity>
        </ThemedCard>

        {fromSignup ? (
          <TouchableOpacity style={s.continueBtn} onPress={() => router.replace('/(tabs)')}>
            <Text style={s.continueBtnText}>CONTINUE TO KYNO</Text>
          </TouchableOpacity>
        ) : null}

        <View style={s.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  header: { paddingHorizontal: 28, paddingTop: 12, paddingBottom: 24 },
  backText: { color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, marginBottom: 16 },
  title: { color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 28 },
  subtitle: { color: colors.textSecondary, fontFamily: fonts.sansLight, fontSize: 14, lineHeight: 20, marginTop: 6 },
  panel: {
    backgroundColor: colors.surface,
    borderColor: stone[700],
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 28,
    marginTop: 18,
    padding: 18,
  },
  panelTitle: { color: colors.textPrimary, fontFamily: fonts.serifMedium, fontSize: 18, marginBottom: 8 },
  panelText: { color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, lineHeight: 19 },
  walletBtn: {
    alignItems: 'center',
    backgroundColor: stone[800],
    borderRadius: 14,
    marginTop: 16,
    paddingVertical: 15,
  },
  walletBtnText: { color: '#FFFFFF', fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 1.8 },
  disabledBtn: { opacity: 0.5 },
  continueBtn: {
    alignItems: 'center',
    backgroundColor: gold[400],
    borderRadius: 14,
    marginHorizontal: 28,
    marginTop: 16,
    paddingVertical: 16,
  },
  continueBtnText: { color: '#FFFFFF', fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 2 },
  bottomSpace: { height: 28 },
});
