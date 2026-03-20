import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, stone, warm, gold, getColors } from '../../constants/colors';
import { services } from '../../constants/services';
import { useTheme } from '../../context/ThemeContext';
import { ScreenBackground } from '../../components/ScreenBackground';
import { ThemedCard } from '../../components/ThemedCard';

function IconBadge({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: fonts.serifMedium, fontSize: 20, color: fg }}>{label}</Text>
    </View>
  );
}

export default function ServicesScreen() {
  const { isDark } = useTheme();
  const c = getColors(isDark);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]} edges={['top']}>
      <ScreenBackground isDark={isDark} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={[s.title, { color: c.textPrimary }]}>Services</Text>
          <Text style={[s.subtitle, { color: c.textSecondary }]}>Premium care in Miami</Text>
        </View>

        {services.map(service => (
          <TouchableOpacity
            key={service.id}
            activeOpacity={0.85}
            onPress={() => router.push(`/booking/${service.id}`)}
          >
            {service.isEmergency ? (
              <View style={[s.card, s.emergencyCard]}>
                <View style={s.cardInner}>
                  <IconBadge
                    label={service.icon}
                    bg="rgba(239,107,107,0.12)"
                    fg={colors.emergencyAccent}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[s.cardName, { color: warm[100] }]}>{service.name}</Text>
                    <Text style={[s.cardDesc, { color: stone[400] }]}>{service.desc}</Text>
                  </View>
                </View>
                <View style={[s.cardMeta, { borderTopColor: 'rgba(239,107,107,0.12)' }]}>
                  <Text style={[s.cardCount, { color: stone[400] }]}>{service.count}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={[s.cardRange, { color: warm[100] }]}>{service.range}</Text>
                    <Text style={{ color: colors.emergencyAccent, fontSize: 16 }}>→</Text>
                  </View>
                </View>
              </View>
            ) : (
              <ThemedCard lightBackgroundColor={stone[100]} style={s.card}>
                <View style={s.cardInner}>
                  <IconBadge
                    label={service.icon}
                    bg={isDark ? stone[700] : gold[50]}
                    fg={isDark ? warm[200] : gold[600]}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[s.cardName, { color: c.textPrimary }]}>{service.name}</Text>
                    <Text style={[s.cardDesc, { color: c.textSecondary }]}>{service.desc}</Text>
                  </View>
                </View>
                <View style={[s.cardMeta, { borderTopColor: isDark ? 'rgba(212,168,58,0.12)' : colors.borderSubtle }]}>
                  <Text style={[s.cardCount, { color: c.textSecondary }]}>{service.count}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={[s.cardRange, { color: c.textPrimary }]}>{service.range}</Text>
                    <Text style={{ color: c.accent, fontSize: 16 }}>→</Text>
                  </View>
                </View>
              </ThemedCard>
            )}
          </TouchableOpacity>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  header: { paddingHorizontal: 28, paddingTop: 16, paddingBottom: 8 },
  title: { fontFamily: fonts.serif, fontSize: 32, color: colors.textPrimary, marginBottom: 6 },
  subtitle: { fontFamily: fonts.sansLight, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.3, marginBottom: 24 },
  card: { backgroundColor: stone[700], borderRadius: 22, marginHorizontal: 28, marginBottom: 12, overflow: 'hidden' },
  emergencyCard: { backgroundColor: colors.emergencyBg },
  cardInner: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20 },
  cardName: { fontFamily: fonts.serifMedium, fontSize: 18, color: colors.textPrimary },
  cardDesc: { fontFamily: fonts.sansLight, fontSize: 11, color: colors.textSecondary, marginTop: 3, lineHeight: 16 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  cardCount: { fontFamily: fonts.sans, fontSize: 10, color: colors.textSecondary, letterSpacing: 0.5 },
  cardRange: { fontFamily: fonts.serif, fontSize: 15, color: colors.textPrimary },
});
