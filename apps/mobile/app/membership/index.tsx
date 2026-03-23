import { useCallback, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { MembershipCard } from '../../components/MembershipCard';
import { colors, fonts, gold, stone, getColors } from '../../constants/colors';
import { getCurrentProfile, type UserProfile } from '../../services/authService';
import { ensureWalletPassUrl } from '../../services/membershipService';
import {
  UPGRADE_REQUEST_NOTE_MAX_LENGTH,
  getLatestUpgradeRequest,
  getMembershipPlanLabel,
  getUpgradeRequestStatusLabel,
  isKynoPlusPlan,
  submitUpgradeRequest,
} from '../../services/kynoPlusService';
import { useTheme } from '../../context/ThemeContext';
import { ScreenBackground } from '../../components/ScreenBackground';
import { ThemedCard } from '../../components/ThemedCard';
import type { Database } from '../../types/database';

type MembershipUpgradeRequest = Database['public']['Tables']['membership_upgrade_requests']['Row'];

const appleWalletEnabled = process.env.EXPO_PUBLIC_ENABLE_APPLE_WALLET === 'true';
const plusBenefits = [
  'Members-only live community chat',
  'Priority premium access moments',
  'A tighter membership layer inside Kyno',
];

function formatRequestMessage(request: MembershipUpgradeRequest | null) {
  if (!request?.status) {
    return 'Tell us how you would use KYNO+ and we will review the request manually.';
  }

  if (request.status === 'pending') {
    return 'Your request is in review. Access turns on as soon as the premium plan is activated on your profile.';
  }

  if (request.status === 'approved') {
    return 'Your request has been approved. We are waiting on the final manual activation step.';
  }

  return 'Your previous request was declined. You can submit another request with more context.';
}

function formatTimestamp(value?: string | null) {
  if (!value) {
    return '';
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function MembershipScreen() {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const { fromSignup } = useLocalSearchParams<{ fromSignup?: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [request, setRequest] = useState<MembershipUpgradeRequest | null>(null);
  const [requestNote, setRequestNote] = useState('');
  const [screenLoading, setScreenLoading] = useState(true);
  const [requestError, setRequestError] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [isRegisteringPass, setIsRegisteringPass] = useState(false);

  useFocusEffect(useCallback(() => {
    let isMounted = true;

    async function loadState() {
      setScreenLoading(true);

      try {
        const [nextProfile, nextRequest] = await Promise.all([
          getCurrentProfile(),
          getLatestUpgradeRequest().catch(() => null),
        ]);

        if (!isMounted) {
          return;
        }

        setProfile(nextProfile);
        setRequest(nextRequest);

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
      } finally {
        if (isMounted) {
          setScreenLoading(false);
        }
      }
    }

    void loadState();

    return () => {
      isMounted = false;
    };
  }, []));

  const isPlus = isKynoPlusPlan(profile);
  const canSubmitRequest = !isPlus && request?.status !== 'pending' && request?.status !== 'approved';

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

  const handleUpgradeRequest = async () => {
    if (!canSubmitRequest || submittingRequest) {
      return;
    }

    setSubmittingRequest(true);
    setRequestError('');

    try {
      const nextRequest = await submitUpgradeRequest(requestNote);
      setRequest(nextRequest);
      setRequestNote('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit your KYNO+ request.';
      setRequestError(message);
      Alert.alert('Upgrade request failed', message);
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]} edges={['top']}>
      <ScreenBackground isDark={isDark} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={s.header}>
          <TouchableOpacity onPress={() => (fromSignup ? router.replace('/(tabs)') : router.back())}>
            <Text style={[s.backText, { color: c.textSecondary }]}>{fromSignup ? 'Skip for now' : '← Back'}</Text>
          </TouchableOpacity>
          <Text style={[s.title, { color: c.textPrimary }]}>Membership</Text>
          <Text style={[s.subtitle, { color: c.textSecondary }]}>
            {screenLoading
              ? 'Loading your membership details.'
              : isPlus
              ? 'KYNO+ is active on this account.'
              : 'Your Kyno member card is live. KYNO+ can be requested from this screen.'}
          </Text>
        </View>

        <MembershipCard profile={profile} />

        <ThemedCard lightBackgroundColor={c.surface} lightBorderColor={c.border} style={s.panel}>
            <View style={s.planRow}>
              <View>
                <Text style={[s.panelLabel, { color: c.textSecondary }]}>CURRENT PLAN</Text>
                <Text style={[s.panelTitle, { color: c.textPrimary }]}>{getMembershipPlanLabel(profile)}</Text>
              </View>
              <View style={[s.planPill, isPlus && s.planPillPlus]}>
                <Text style={[s.planPillText, isPlus && s.planPillTextPlus]}>{getMembershipPlanLabel(profile).toUpperCase()}</Text>
              </View>
            </View>
          </ThemedCard>

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

        {isPlus ? (
          <ThemedCard lightBackgroundColor={c.surface} lightBorderColor={c.border} style={s.panel}>
            <Text style={[s.panelLabel, { color: gold[500] }]}>KYNO+ ACTIVE</Text>
            <Text style={[s.panelTitle, { color: c.textPrimary }]}>Premium access is turned on.</Text>
            <Text style={[s.panelText, { color: c.textSecondary }]}>
              The members-only community room is now available in the app for recommendations, travel planning, and owner-to-owner advice.
            </Text>
            <View style={s.benefitWrap}>
              {plusBenefits.map((benefit) => (
                <View key={benefit} style={[s.benefitChip, { borderColor: c.border, backgroundColor: isDark ? stone[800] : stone[50] }]}>
                  <Text style={[s.benefitChipText, { color: c.textSecondary }]}>{benefit}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={() => router.push('/community')}>
              <Text style={s.primaryBtnText}>OPEN COMMUNITY</Text>
            </TouchableOpacity>
          </ThemedCard>
        ) : (
          <ThemedCard lightBackgroundColor={c.surface} lightBorderColor={c.border} style={s.panel}>
            <Text style={[s.panelLabel, { color: gold[500] }]}>UPGRADE TO KYNO+</Text>
            <Text style={[s.panelTitle, { color: c.textPrimary }]}>Unlock the premium membership layer.</Text>
            <Text style={[s.panelText, { color: c.textSecondary }]}>
              KYNO+ adds the members-only community chat and priority access to premium owner experiences. Requests are reviewed manually at launch.
            </Text>

            <View style={s.benefitWrap}>
              {plusBenefits.map((benefit) => (
                <View key={benefit} style={[s.benefitChip, { borderColor: c.border, backgroundColor: isDark ? stone[800] : stone[50] }]}>
                  <Text style={[s.benefitChipText, { color: c.textSecondary }]}>{benefit}</Text>
                </View>
              ))}
            </View>

            <ThemedCard lightBackgroundColor={isDark ? stone[800] : stone[50]} lightBorderColor={c.border} style={s.requestCard}>
              <View style={s.planRow}>
                <View>
                  <Text style={[s.panelLabel, { color: c.textSecondary }]}>REQUEST STATUS</Text>
                  <Text style={[s.requestTitle, { color: c.textPrimary }]}>{getUpgradeRequestStatusLabel(request)}</Text>
                </View>
                {request?.status ? (
                  <View style={[s.statusPill, { backgroundColor: request.status === 'pending' ? (isDark ? stone[700] : gold[50]) : request.status === 'approved' ? (isDark ? 'rgba(74,102,56,0.28)' : '#F4F7F2') : '#FEF2F2' }]}>
                    <Text style={[s.statusPillText, { color: request.status === 'declined' ? colors.emergencyAccent : c.textPrimary }]}>
                      {request.status.toUpperCase()}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text style={[s.panelText, { color: c.textSecondary }]}>{formatRequestMessage(request)}</Text>
              {request?.created_at ? (
                <Text style={[s.metaText, { color: c.textTertiary }]}>Latest update: {formatTimestamp(request.created_at)}</Text>
              ) : null}
            </ThemedCard>

            <TextInput
              multiline
              placeholder="Optional: tell us what kind of community or premium access would be most useful."
              placeholderTextColor={c.textTertiary}
              style={[s.input, { backgroundColor: isDark ? stone[800] : stone[50], borderColor: c.border, color: c.textPrimary }]}
              value={requestNote}
              onChangeText={(text) => setRequestNote(text.slice(0, UPGRADE_REQUEST_NOTE_MAX_LENGTH))}
              editable={canSubmitRequest}
            />
            <View style={s.formFooter}>
              <Text style={[s.metaText, { color: c.textTertiary, marginTop: 0 }]}>{requestNote.length}/{UPGRADE_REQUEST_NOTE_MAX_LENGTH}</Text>
            </View>

            {requestError ? <Text style={s.error}>{requestError}</Text> : null}

            <TouchableOpacity style={[s.primaryBtn, (!canSubmitRequest || submittingRequest) && s.disabledBtn]} onPress={() => void handleUpgradeRequest()} disabled={!canSubmitRequest || submittingRequest}>
              <Text style={s.primaryBtnText}>
                {submittingRequest ? 'SUBMITTING...' : request?.status === 'declined' ? 'REQUEST KYNO+ AGAIN' : 'REQUEST KYNO+'}
              </Text>
            </TouchableOpacity>
          </ThemedCard>
        )}

        <ThemedCard lightBackgroundColor={c.surface} lightBorderColor={c.border} style={s.panel}>
          <Text style={[s.panelTitle, { color: c.textPrimary }]}>Community</Text>
          <Text style={[s.panelText, { color: c.textSecondary }]}>
            {isPlus
              ? 'The members-only room is unlocked on this account.'
              : 'The community chat is reserved for KYNO+ members only.'}
          </Text>
          <TouchableOpacity style={s.secondaryBtn} onPress={() => router.push('/community')}>
            <Text style={[s.secondaryBtnText, { color: c.textPrimary }]}>{isPlus ? 'OPEN COMMUNITY' : 'VIEW COMMUNITY ACCESS'}</Text>
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
  panelLabel: { fontFamily: fonts.sansMedium, fontSize: 10, letterSpacing: 1.8, marginBottom: 6 },
  panelTitle: { color: colors.textPrimary, fontFamily: fonts.serifMedium, fontSize: 20, marginBottom: 8 },
  panelText: { color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, lineHeight: 19 },
  planRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  planPill: {
    alignItems: 'center',
    backgroundColor: stone[100],
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  planPillPlus: {
    backgroundColor: gold[400],
  },
  planPillText: { color: stone[800], fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 1.5 },
  planPillTextPlus: { color: '#FFFFFF' },
  walletBtn: {
    alignItems: 'center',
    backgroundColor: stone[800],
    borderRadius: 14,
    marginTop: 16,
    paddingVertical: 15,
  },
  walletBtnText: { color: '#FFFFFF', fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 1.8 },
  benefitWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  benefitChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  benefitChipText: { fontFamily: fonts.sansMedium, fontSize: 11, letterSpacing: 0.4 },
  requestCard: { marginTop: 18, padding: 16 },
  requestTitle: { fontFamily: fonts.serifMedium, fontSize: 18 },
  statusPill: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  statusPillText: { fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 1.4 },
  metaText: { fontFamily: fonts.sans, fontSize: 11, lineHeight: 17, marginTop: 12 },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 16,
    minHeight: 112,
    padding: 14,
    textAlignVertical: 'top',
  },
  formFooter: { alignItems: 'flex-end', marginTop: 10 },
  error: { color: colors.emergencyAccent, fontFamily: fonts.sans, fontSize: 12, lineHeight: 18, marginTop: 14 },
  primaryBtn: {
    alignItems: 'center',
    backgroundColor: gold[400],
    borderRadius: 14,
    marginTop: 16,
    paddingVertical: 16,
  },
  primaryBtnText: { color: '#FFFFFF', fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 2 },
  secondaryBtn: {
    alignItems: 'center',
    borderColor: stone[300],
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
    paddingVertical: 15,
  },
  secondaryBtnText: { fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 1.8 },
  continueBtn: {
    alignItems: 'center',
    backgroundColor: gold[400],
    borderRadius: 14,
    marginHorizontal: 28,
    marginTop: 16,
    paddingVertical: 16,
  },
  continueBtnText: { color: '#FFFFFF', fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 2 },
  disabledBtn: { opacity: 0.5 },
  bottomSpace: { height: 28 },
});
