import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors, fonts, gold, stone, getColors } from '../../constants/colors';
import { getCurrentProfile, updateCurrentProfile, type UserProfile } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';
import { ScreenBackground } from '../../components/ScreenBackground';

export default function AccountScreen() {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const nextProfile = await getCurrentProfile();

        if (!isMounted || !nextProfile) {
          return;
        }

        setProfile(nextProfile);
        setFirstName(nextProfile.first_name ?? '');
        setLastName(nextProfile.last_name ?? '');
        setPhone(nextProfile.phone ?? '');
        setCity(nextProfile.city ?? '');
        setAddressLine1(nextProfile.address_line1 ?? '');
        setAddressLine2(nextProfile.address_line2 ?? '');
        setEmergencyContactName(nextProfile.emergency_contact_name ?? '');
        setEmergencyContactPhone(nextProfile.emergency_contact_phone ?? '');
      } catch (error) {
        Alert.alert('Unable to load profile', error instanceof Error ? error.message : 'Please try again.');
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);

    try {
      await updateCurrentProfile({
        addressLine1,
        addressLine2,
        city,
        emergencyContactName,
        emergencyContactPhone,
        firstName,
        lastName,
        phone,
      });

      router.back();
    } catch (error) {
      Alert.alert('Save failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]} edges={['top']}>
      <ScreenBackground isDark={isDark} />
      <KeyboardAvoidingView style={s.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={s.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[s.backText, { color: c.textSecondary }]}>← Back</Text>
            </TouchableOpacity>
            <Text style={[s.title, { color: c.textPrimary }]}>Owner Profile</Text>
            <Text style={[s.subtitle, { color: c.textSecondary }]}>Edit the dog owner details that providers and support may need.</Text>
          </View>

          <View style={[s.card, { backgroundColor: c.surface, borderColor: c.border }]}>
            <View style={s.row}>
              <View style={s.half}>
                <Text style={[s.label, { color: c.textSecondary }]}>FIRST NAME</Text>
                <TextInput style={[s.input, { backgroundColor: c.surfaceRaised, borderColor: c.border, color: c.textPrimary }]} value={firstName} onChangeText={setFirstName} placeholder="Andrea" placeholderTextColor={stone[400]} />
              </View>
              <View style={s.half}>
                <Text style={[s.label, { color: c.textSecondary }]}>LAST NAME</Text>
                <TextInput style={[s.input, { backgroundColor: c.surfaceRaised, borderColor: c.border, color: c.textPrimary }]} value={lastName} onChangeText={setLastName} placeholder="Leon" placeholderTextColor={stone[400]} />
              </View>
            </View>

            <Text style={[s.label, { color: c.textSecondary }]}>EMAIL</Text>
            <View style={[s.readOnlyField, { backgroundColor: c.surfaceRaised, borderColor: c.border }]}>
              <Text style={[s.readOnlyText, { color: c.textSecondary }]}>{profile?.email ?? 'Not set'}</Text>
            </View>

            <Text style={[s.label, { color: c.textSecondary }]}>PHONE</Text>
            <TextInput style={[s.input, { backgroundColor: c.surfaceRaised, borderColor: c.border, color: c.textPrimary }]} value={phone} onChangeText={setPhone} placeholder="+1 (305) 555-0100" placeholderTextColor={stone[400]} />

            <Text style={[s.label, { color: c.textSecondary }]}>CITY</Text>
            <TextInput style={[s.input, { backgroundColor: c.surfaceRaised, borderColor: c.border, color: c.textPrimary }]} value={city} onChangeText={setCity} placeholder="Miami" placeholderTextColor={stone[400]} />

            <Text style={[s.label, { color: c.textSecondary }]}>ADDRESS</Text>
            <TextInput style={[s.input, { backgroundColor: c.surfaceRaised, borderColor: c.border, color: c.textPrimary }]} value={addressLine1} onChangeText={setAddressLine1} placeholder="123 Biscayne Blvd" placeholderTextColor={stone[400]} />

            <Text style={[s.label, { color: c.textSecondary }]}>APARTMENT / NOTES</Text>
            <TextInput style={[s.input, { backgroundColor: c.surfaceRaised, borderColor: c.border, color: c.textPrimary }]} value={addressLine2} onChangeText={setAddressLine2} placeholder="Unit 9A" placeholderTextColor={stone[400]} />

            <Text style={[s.label, { color: c.textSecondary }]}>EMERGENCY CONTACT</Text>
            <TextInput
              style={[s.input, { backgroundColor: c.surfaceRaised, borderColor: c.border, color: c.textPrimary }]}
              value={emergencyContactName}
              onChangeText={setEmergencyContactName}
              placeholder="Name"
              placeholderTextColor={stone[400]}
            />

            <Text style={[s.label, { color: c.textSecondary }]}>EMERGENCY CONTACT PHONE</Text>
            <TextInput
              style={[s.input, { backgroundColor: c.surfaceRaised, borderColor: c.border, color: c.textPrimary }]}
              value={emergencyContactPhone}
              onChangeText={setEmergencyContactPhone}
              placeholder="+1 (305) 555-0123"
              placeholderTextColor={stone[400]}
            />
          </View>

          <TouchableOpacity style={[s.saveBtn, saving && s.disabledBtn]} onPress={() => void handleSave()} disabled={saving}>
            <Text style={s.saveBtnText}>{saving ? 'SAVING...' : 'SAVE OWNER PROFILE'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  keyboard: { flex: 1 },
  scroll: { flex: 1, paddingHorizontal: 28 },
  header: { paddingBottom: 24, paddingTop: 12 },
  backText: { color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, marginBottom: 16 },
  title: { color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 28 },
  subtitle: { color: colors.textSecondary, fontFamily: fonts.sansLight, fontSize: 14, lineHeight: 20, marginTop: 6 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  label: { color: colors.textSecondary, fontFamily: fonts.sansMedium, fontSize: 9, letterSpacing: 1.5, marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.textPrimary,
    fontFamily: fonts.sans,
    fontSize: 15,
    padding: 14,
  },
  readOnlyField: {
    backgroundColor: '#F4F1EB',
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  readOnlyText: { color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 15 },
  saveBtn: {
    alignItems: 'center',
    backgroundColor: gold[400],
    borderRadius: 14,
    marginBottom: 24,
    marginTop: 18,
    paddingVertical: 16,
  },
  saveBtnText: { color: '#FFFFFF', fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 2 },
  disabledBtn: { opacity: 0.5 },
});
