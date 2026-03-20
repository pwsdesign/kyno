import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, getColors, gold } from '../../constants/colors';
import { ScreenBackground } from '../../components/ScreenBackground';
import { useTheme } from '../../context/ThemeContext';

export default function CreateAccountScreen() {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isValid =
    firstName.trim() &&
    lastName.trim() &&
    phone.trim() &&
    email.trim() &&
    password.trim().length >= 8;

  const handleContinue = () => {
    if (!isValid) {
      setError('All fields are required, and your password must be at least 8 characters.');
      return;
    }
    setError('');
    router.push({
      pathname: '/(onboarding)/add-dog',
      params: { firstName, lastName, phone, email, password },
    });
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]}>
      <ScreenBackground isDark={isDark} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Text style={[s.backText, { color: c.textSecondary }]}>← Back</Text>
          </TouchableOpacity>

          <Text style={s.stepLabel}>STEP 1 OF 2</Text>
          <Text style={[s.title, { color: c.textPrimary }]}>Create your account</Text>
          <Text style={[s.subtitle, { color: c.textSecondary }]}>Tell us about yourself.</Text>

          <View style={s.form}>
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Text style={[s.fieldLabel, { color: c.textSecondary }]}>FIRST NAME</Text>
                <TextInput style={[s.input, { backgroundColor: c.surface, borderColor: c.border, color: c.textPrimary }]} value={firstName} onChangeText={setFirstName} placeholder="Victoria" placeholderTextColor={c.textTertiary} autoCapitalize="words" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.fieldLabel, { color: c.textSecondary }]}>LAST NAME</Text>
                <TextInput style={[s.input, { backgroundColor: c.surface, borderColor: c.border, color: c.textPrimary }]} value={lastName} onChangeText={setLastName} placeholder="Smith" placeholderTextColor={c.textTertiary} autoCapitalize="words" />
              </View>
            </View>

            <Text style={[s.fieldLabel, { color: c.textSecondary }]}>PHONE NUMBER</Text>
            <TextInput style={[s.input, { backgroundColor: c.surface, borderColor: c.border, color: c.textPrimary }]} value={phone} onChangeText={setPhone} placeholder="+1 (305) 555-0100" placeholderTextColor={c.textTertiary} keyboardType="phone-pad" />

            <Text style={[s.fieldLabel, { color: c.textSecondary }]}>EMAIL</Text>
            <TextInput style={[s.input, { backgroundColor: c.surface, borderColor: c.border, color: c.textPrimary }]} value={email} onChangeText={setEmail} placeholder="victoria@kyno.pet" placeholderTextColor={c.textTertiary} keyboardType="email-address" autoCapitalize="none" />

            <Text style={[s.fieldLabel, { color: c.textSecondary }]}>PASSWORD</Text>
            <TextInput
              style={[s.input, { backgroundColor: c.surface, borderColor: c.border, color: c.textPrimary }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Minimum 8 characters"
              placeholderTextColor={c.textTertiary}
              secureTextEntry
              autoCapitalize="none"
            />

            {error ? <Text style={s.error}>{error}</Text> : null}

            <TouchableOpacity style={[s.continueBtn, !isValid && s.continueBtnDisabled]} activeOpacity={0.85} onPress={handleContinue}>
              <Text style={s.continueBtnText}>CONTINUE</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(onboarding)/sign-in')} style={s.linkBtn}>
              <Text style={[s.linkText, { color: c.textSecondary }]}>Already have an account? <Text style={{ color: gold[400], fontFamily: fonts.sansMedium }}>Sign In</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1, padding: 28 },
  backBtn: { marginBottom: 24 },
  backText: { fontFamily: fonts.sans, fontSize: 14, color: colors.textSecondary },
  stepLabel: { fontFamily: fonts.sansMedium, fontSize: 10, letterSpacing: 2, color: gold[500], marginBottom: 8 },
  title: { fontFamily: fonts.serif, fontSize: 28, color: colors.textPrimary, marginBottom: 6 },
  subtitle: { fontFamily: fonts.sansLight, fontSize: 14, color: colors.textSecondary, marginBottom: 32 },
  form: { gap: 4 },
  row: { flexDirection: 'row', gap: 12 },
  fieldLabel: { fontFamily: fonts.sansMedium, fontSize: 9, letterSpacing: 1.5, color: colors.textSecondary, marginBottom: 6, marginTop: 16 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, fontFamily: fonts.sans, fontSize: 15, color: colors.textPrimary },
  error: { fontFamily: fonts.sans, fontSize: 12, color: colors.emergencyAccent, marginTop: 8 },
  continueBtn: { backgroundColor: gold[400], borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 28 },
  continueBtnDisabled: { opacity: 0.5 },
  continueBtnText: { fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 2, color: '#FFFFFF' },
  linkBtn: { alignItems: 'center', marginTop: 20 },
  linkText: { fontFamily: fonts.sans, fontSize: 13, color: colors.textSecondary },
});
