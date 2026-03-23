import { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import Constants from 'expo-constants';
import { colors, fonts, gold, stone, getColors } from '../../constants/colors';
import { getCurrentProfile, signOut, type UserProfile } from '../../services/authService';
import { getMembershipPlanLabel, isKynoPlusPlan } from '../../services/kynoPlusService';
import { useTheme } from '../../context/ThemeContext';
import { ScreenBackground } from '../../components/ScreenBackground';

interface SettingsRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
}

function SettingsRow({ label, value, onPress, destructive }: SettingsRowProps) {
  const { isDark } = useTheme();
  const c = getColors(isDark);

  return (
    <TouchableOpacity style={[s.row, { borderBottomColor: c.borderSubtle }]} activeOpacity={0.7} onPress={onPress} disabled={!onPress}>
      <Text style={[s.rowLabel, { color: destructive ? colors.emergencyAccent : c.textPrimary }]}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {value && <Text style={[s.rowValue, { color: c.textTertiary }]}>{value}</Text>}
        {onPress && <Text style={[s.rowChevron, { color: c.textTertiary }]}>›</Text>}
      </View>
    </TouchableOpacity>
  );
}

function SectionHeader({ title }: { title: string }) {
  const { isDark } = useTheme();
  const c = getColors(isDark);

  return <Text style={[s.sectionHeader, { color: c.textTertiary }]}>{title}</Text>;
}

export default function SettingsScreen() {
  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { isDark, toggleTheme, theme } = useTheme();
  const c = getColors(isDark);

  useFocusEffect(useCallback(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const nextProfile = await getCurrentProfile();
        if (isMounted) {
          setProfile(nextProfile);
        }
      } catch {
        if (isMounted) {
          setProfile(null);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []));

  const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Account';

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(onboarding)/welcome');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]} edges={['top']}>
      <ScreenBackground isDark={isDark} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[s.backText, { color: c.textSecondary }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[s.title, { color: c.textPrimary }]}>Settings</Text>
        </View>

        {/* Account */}
        <SectionHeader title="ACCOUNT" />
        <View style={[s.card, { borderColor: c.border, backgroundColor: c.surface }]}>
          <SettingsRow label="Owner Profile" value={displayName} onPress={() => router.push('/account')} />
          <SettingsRow label="Email" value={profile?.email ?? 'Not set'} />
          <SettingsRow label="Phone" value={profile?.phone ?? 'Not set'} />
          <SettingsRow label="Dog Profiles" value="Edit" onPress={() => router.push('/dogs')} />
        </View>

        {/* Appearance */}
        <SectionHeader title="APPEARANCE" />
        <View style={[s.card, { borderColor: c.border, backgroundColor: c.surface }]}>
          <SettingsRow label="Theme" value={isDark ? 'Dark' : 'Light'} onPress={toggleTheme} />
        </View>

        {/* Membership */}
        <SectionHeader title="MEMBERSHIP" />
        <View style={[s.card, { borderColor: c.border, backgroundColor: c.surface }]}>
          <SettingsRow label="Membership Plan" value={getMembershipPlanLabel(profile)} onPress={() => router.push('/membership')} />
          <SettingsRow label="Membership Card" value={profile?.membership_id ?? 'Generating'} onPress={() => router.push('/membership')} />
          <SettingsRow label="Community Chat" value={isKynoPlusPlan(profile) ? 'Open' : 'KYNO+ only'} onPress={() => router.push('/community')} />
        </View>

        {/* Support */}
        <SectionHeader title="SUPPORT" />
        <View style={[s.card, { borderColor: c.border, backgroundColor: c.surface }]}>
          <SettingsRow label="Contact Us" value="hello@kyno.pet" />
        </View>

        {/* Legal */}
        <SectionHeader title="LEGAL" />
        <View style={[s.card, { borderColor: c.border, backgroundColor: c.surface }]}>
          <SettingsRow label="Terms of Service" onPress={() => router.push('/settings/terms')} />
          <SettingsRow label="Privacy Policy" onPress={() => router.push('/settings/privacy')} />
        </View>

        {/* Sign Out */}
        <View style={[s.card, { marginTop: 24, borderColor: c.border, backgroundColor: c.surface }]}>
          <SettingsRow label="Sign Out" destructive onPress={handleSignOut} />
        </View>

        {/* Version */}
        <Text style={[s.version, { color: c.textTertiary }]}>Kyno v{appVersion}</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  header: { paddingHorizontal: 28, paddingTop: 12, paddingBottom: 24 },
  backText: { fontFamily: fonts.sans, fontSize: 14, color: colors.textSecondary, marginBottom: 16 },
  title: { fontFamily: fonts.serif, fontSize: 28, color: colors.textPrimary },
  sectionHeader: { fontFamily: fonts.sansMedium, fontSize: 9, letterSpacing: 2, color: colors.textTertiary, paddingHorizontal: 28, marginTop: 24, marginBottom: 8 },
  card: { marginHorizontal: 28, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  rowLabel: { fontFamily: fonts.sans, fontSize: 15, color: colors.textPrimary },
  rowValue: { fontFamily: fonts.sans, fontSize: 13, color: colors.textTertiary },
  rowChevron: { fontSize: 18, color: colors.textTertiary },
  version: { fontFamily: fonts.sans, fontSize: 11, color: colors.textTertiary, textAlign: 'center', marginTop: 24, letterSpacing: 0.5 },
});
