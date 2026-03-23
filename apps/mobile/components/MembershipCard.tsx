import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, fonts, gold, stone, warm } from '../constants/colors';
import type { UserProfile } from '../services/authService';
import { getMembershipPlanLabel, isKynoPlusPlan } from '../services/kynoPlusService';

function formatMemberSince(createdAt?: string | null) {
  if (!createdAt) {
    return 'Since now';
  }

  const createdDate = new Date(createdAt);

  return `Since ${createdDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })}`;
}

export function MembershipCard({ profile }: { profile: UserProfile | null }) {
  const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Kyno Member';
  const initial = displayName.charAt(0).toUpperCase() || 'K';
  const membershipId = profile?.membership_id ?? 'KYN-2026-0000';
  const isPlus = isKynoPlusPlan(profile);
  const planLabel = getMembershipPlanLabel(profile);

  // Card entrance
  const cardScale = useSharedValue(0.97);
  const cardOpacity = useSharedValue(0);
  const cardAnimStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  // Gold glow pulse
  const glowOpacity = useSharedValue(0.7);
  const glowAnimStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  useEffect(() => {
    cardScale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    cardOpacity.value = withTiming(1, { duration: 400 });
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2800, easing: Easing.inOut(Easing.sine) }),
        withTiming(0.7, { duration: 2800, easing: Easing.inOut(Easing.sine) })
      ),
      -1,
      false
    );
  }, []);

  return (
    <Animated.View style={[s.wrapper, cardAnimStyle]}>
      <Text style={s.eyebrow}>MEMBERSHIP CARD</Text>
      <View style={s.card}>
        <LinearGradient
          colors={[stone[900], '#2A2824', stone[900]]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={[s.goldGlow, glowAnimStyle]}>
          <LinearGradient
            colors={[
              'rgba(212,168,58,0.2)',
              'rgba(212,168,58,0.12)',
              'rgba(212,168,58,0.05)',
              'rgba(212,168,58,0)',
            ]}
            end={{ x: -0.1, y: 0.20 }}
            start={{ x: 0.10, y: -0.4 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <View style={s.brandRow}>
          <View style={s.brandLockup}>
            <Text style={s.brandInitial}>{initial}</Text>
            <Text style={s.brandWord}>KYNO</Text>
          </View>
          <View style={[s.planPill, isPlus && s.planPillPlus]}>
            <Text style={[s.memberLabel, isPlus && s.memberLabelPlus]}>{planLabel}</Text>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.memberName}>{displayName}</Text>
          <Text style={s.memberMeta}>
            {membershipId}  ·  {formatMemberSince(profile?.created_at)}
          </Text>
          <Text style={[s.memberStatus, { color: isPlus ? gold[300] : stone[500] }]}>
            {isPlus ? 'Premium community unlocked' : 'Standard member access'}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrapper: { marginHorizontal: 28 },
  eyebrow: { color: colors.textSecondary, fontFamily: fonts.sansMedium, fontSize: 10, letterSpacing: 2.5, marginBottom: 10 },
  card: {
    borderRadius: 28,
    minHeight: 220,
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingVertical: 22,
  },
  goldGlow: {
    borderRadius: 180,
    height: 250,
    position: 'absolute',
    right: -36,
    top: -34,
    transform: [{ rotate: '8deg' }],
    width: 290,
  },
  brandRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  brandLockup: { alignItems: 'center', flexDirection: 'row' },
  brandInitial: { color: gold[500], fontFamily: fonts.serifMedium, fontSize: 42, marginRight: 12 },
  brandWord: { color: warm[300], fontFamily: fonts.serif, fontSize: 22, letterSpacing: 4 },
  planPill: {
    borderColor: 'rgba(212,168,58,0.18)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  planPillPlus: {
    backgroundColor: gold[400],
    borderColor: 'transparent',
  },
  memberLabel: { color: gold[500], fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: 2.4 },
  memberLabelPlus: { color: '#FFFFFF' },
  footer: { marginTop: 'auto', paddingTop: 72 },
  memberName: { color: warm[300], fontFamily: fonts.serif, fontSize: 30, marginBottom: 10 },
  memberMeta: { color: stone[600], fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: 1.2 },
  memberStatus: { fontFamily: fonts.sansMedium, fontSize: 11, letterSpacing: 1, marginTop: 14, textTransform: 'uppercase' },
});
