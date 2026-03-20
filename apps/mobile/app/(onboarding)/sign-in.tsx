import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, getColors, gold } from '../../constants/colors';
import { ScreenBackground } from '../../components/ScreenBackground';
import { useTheme } from '../../context/ThemeContext';
import { signIn } from '../../services/authService';

export default function SignInScreen() {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]}>
      <ScreenBackground isDark={isDark} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Text style={[s.backText, { color: c.textSecondary }]}>← Back</Text>
          </TouchableOpacity>

          <Text style={[s.title, { color: c.textPrimary }]}>Welcome back</Text>
          <Text style={[s.subtitle, { color: c.textSecondary }]}>Sign in to your Kyno account.</Text>

          <View style={s.form}>
            <Text style={[s.fieldLabel, { color: c.textSecondary }]}>EMAIL</Text>
            <TextInput style={[s.input, { backgroundColor: c.surface, borderColor: c.border, color: c.textPrimary }]} value={email} onChangeText={setEmail} placeholder="andrea@kyno.pet" placeholderTextColor={c.textTertiary} keyboardType="email-address" autoCapitalize="none" />

            <Text style={[s.fieldLabel, { color: c.textSecondary }]}>PASSWORD</Text>
            <TextInput style={[s.input, { backgroundColor: c.surface, borderColor: c.border, color: c.textPrimary }]} value={password} onChangeText={setPassword} placeholder="Enter password" placeholderTextColor={c.textTertiary} secureTextEntry />

            <TouchableOpacity style={[s.signInBtn, loading && { opacity: 0.5 }]} activeOpacity={0.85} onPress={handleSignIn} disabled={loading}>
              <Text style={s.signInBtnText}>{loading ? 'SIGNING IN...' : 'SIGN IN'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(onboarding)/create-account')} style={s.linkBtn}>
              <Text style={[s.linkText, { color: c.textSecondary }]}>Don't have an account? <Text style={{ color: gold[400], fontFamily: fonts.sansMedium }}>Create one</Text></Text>
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
  title: { fontFamily: fonts.serif, fontSize: 28, color: colors.textPrimary, marginBottom: 6 },
  subtitle: { fontFamily: fonts.sansLight, fontSize: 14, color: colors.textSecondary, marginBottom: 32 },
  form: { gap: 4 },
  fieldLabel: { fontFamily: fonts.sansMedium, fontSize: 9, letterSpacing: 1.5, color: colors.textSecondary, marginBottom: 6, marginTop: 16 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, fontFamily: fonts.sans, fontSize: 15, color: colors.textPrimary },
  signInBtn: { backgroundColor: gold[600], borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 28 },
  signInBtnText: { fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 2, color: '#FFFFFF' },
  linkBtn: { alignItems: 'center', marginTop: 20 },
  linkText: { fontFamily: fonts.sans, fontSize: 13, color: colors.textSecondary },
});
