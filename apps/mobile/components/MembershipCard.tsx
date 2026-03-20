import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, fonts, gold, stone, warm } from '../constants/colors';
import type { UserProfile } from '../services/authService';

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

  return (
    <View style={s.wrapper}>
      <Text style={s.eyebrow}>MEMBERSHIP CARD</Text>
      <View style={s.card}>
        <LinearGradient
          colors={[stone[900], '#2A2824', stone[900]]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={[
            'rgba(212,168,58,0.2)',
            'rgba(212,168,58,0.12)',
            'rgba(212,168,58,0.05)',
            'rgba(212,168,58,0)',
          ]}
        end={{ x: -0.1, y: 0.20 }}
        start={{ x: 0.10, y: -0.4 }}
        style={s.goldGlow}
        />
        <View style={s.brandRow}>
          <View style={s.brandLockup}>
            <Text style={s.brandInitial}>{initial}</Text>
            <Text style={s.brandWord}>KYNO</Text>
          </View>
          <Text style={s.memberLabel}>MEMBER</Text>
        </View>

        <View style={s.footer}>
          <Text style={s.memberName}>{displayName}</Text>
          <Text style={s.memberMeta}>
            {membershipId}  ·  {formatMemberSince(profile?.created_at)}
          </Text>
        </View>
      </View>
    </View>
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
  memberLabel: { color: gold[500], fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: 2.4 },
  footer: { marginTop: 'auto', paddingTop: 72 },
  memberName: { color: warm[300], fontFamily: fonts.serif, fontSize: 30, marginBottom: 10 },
  memberMeta: { color: stone[600], fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: 1.2 },
});
