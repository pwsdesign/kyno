import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ScreenBackground } from '../../components/ScreenBackground';
import { colors, fonts, getColors, gold, stone, warm } from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';

export default function WelcomeScreen() {
  const { isDark } = useTheme();
  const c = getColors(isDark);

  return (
    <View style={[s.container, { backgroundColor: c.background }]}>
      <ScreenBackground isDark={isDark} />
      {!isDark ? <View style={s.glowLight} /> : null}

      <View style={s.content}>
        {/* Brand monogram */}
        <View style={[s.monogram, { borderColor: gold[600], backgroundColor: isDark ? 'transparent' : warm[50] }]}>
          <Text style={s.monogramText}>K</Text>
        </View>

        <Text style={[s.wordmark, { color: c.textPrimary }]}>Kyno</Text>
        <Text style={s.tagline}>ELEVATED DOG CARE</Text>
        <Text style={[s.subtitle, { color: c.textSecondary }]}>Miami, FL</Text>
      </View>

      <View style={s.actions}>
        <TouchableOpacity style={s.primaryBtn} activeOpacity={0.85} onPress={() => router.push('/(onboarding)/create-account')}>
          <Text style={s.primaryBtnText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.secondaryBtn, { borderColor: isDark ? stone[600] : stone[300], backgroundColor: isDark ? 'transparent' : warm[50] }]} activeOpacity={0.85} onPress={() => router.push('/(onboarding)/sign-in')}>
          <Text style={[s.secondaryBtnText, { color: isDark ? warm[200] : c.textPrimary }]}>SIGN IN</Text>
        </TouchableOpacity>
      </View>

      <Text style={[s.footer, { color: isDark ? 'rgba(212,168,58,0.25)' : 'rgba(150,111,31,0.42)' }]}>MIAMI, FL · 2026</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: stone[900], alignItems: 'center', justifyContent: 'center' },
  glowLight: { position: 'absolute', top: '10%', right: '10%', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(212,168,58,0.08)' },
  content: { alignItems: 'center', marginBottom: 60 },
  monogram: { width: 72, height: 72, borderRadius: 20, backgroundColor: 'transparent', borderWidth: 1.5, borderColor: gold[600], alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  monogramText: { fontFamily: fonts.serif, fontSize: 36, color: gold[400] },
  wordmark: { fontFamily: fonts.serif, fontSize: 56, color: warm[100], letterSpacing: -1, marginBottom: 16 },
  tagline: { fontFamily: fonts.sansMedium, fontSize: 10, letterSpacing: 4, color: gold[400], marginBottom: 8 },
  subtitle: { fontFamily: fonts.sansLight, fontSize: 13, color: stone[500] },
  actions: { width: '100%', paddingHorizontal: 40, gap: 12 },
  primaryBtn: { backgroundColor: gold[400], borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  primaryBtnText: { fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 2, color: '#FFFFFF' },
  secondaryBtn: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: stone[600], borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  secondaryBtnText: { fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: 2, color: warm[200] },
  footer: { position: 'absolute', bottom: 44, fontFamily: fonts.sans, fontSize: 9, letterSpacing: 3, color: 'rgba(212,168,58,0.25)' },
});
