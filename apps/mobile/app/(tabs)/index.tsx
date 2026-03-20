import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, fonts, gold, stone, warm, getColors } from '../../constants/colors';
import { fetchCareInsights } from '../../services/aiService';
import { serviceIcons } from '../../constants/icons';
import { getCurrentProfile } from '../../services/authService';
import { listBookings, type BookingRecord } from '../../services/bookingService';
import { services } from '../../constants/services';
import { useTheme } from '../../context/ThemeContext';
import { ScreenBackground } from '../../components/ScreenBackground';
import { ThemedCard } from '../../components/ThemedCard';
import { ThemeToggleButton } from '../../components/ThemeToggleButton';

function IconBadge({ label, size = 36, bg = gold[50], fg = gold[600] }: { label: string; size?: number; bg?: string; fg?: string }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.3, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: fonts.serifMedium, fontSize: size * 0.42, color: fg }}>{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [insights, setInsights] = useState<string[] | null>(null);
  const [greetingName, setGreetingName] = useState('Friend');
  const [upcomingBooking, setUpcomingBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadScreen() {
      try {
        const [nextInsights, profile, upcoming] = await Promise.all([
          fetchCareInsights(),
          getCurrentProfile(),
          listBookings({ upcomingOnly: true, limit: 1 }),
        ]);

        if (!isMounted) {
          return;
        }

        setInsights(nextInsights);
        setGreetingName(profile?.first_name?.trim() || 'Friend');
        setUpcomingBooking(upcoming[0] ?? null);
      } catch {
        if (isMounted) {
          setInsights(null);
          setUpcomingBooking(null);
        }
      }
    }

    void loadScreen();

    return () => {
      isMounted = false;
    };
  }, []);

  const openBooking = (serviceId: string) => {
    router.push(`/booking/${serviceId}`);
  };

  const upcomingService = upcomingBooking
    ? services.find(service => service.id === upcomingBooking.service_id)
    : null;
  const upcomingDate = upcomingBooking ? new Date(upcomingBooking.scheduled_for) : null;
  const upcomingDay = upcomingDate
    ? upcomingDate.toLocaleDateString('en-US', { day: 'numeric' })
    : null;
  const upcomingMonth = upcomingDate
    ? upcomingDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    : null;
  const upcomingTime = upcomingDate
    ? upcomingDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : null;
  const greetingInitial = greetingName.charAt(0).toUpperCase() || 'K';

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]} edges={['top']}>
      <ScreenBackground isDark={isDark} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={[s.greetingLabel, { color: c.textSecondary }]}>GOOD MORNING</Text>
            <Text style={[s.greetingName, { color: c.textPrimary }]}>{greetingName}</Text>
          </View>
          <View style={s.headerActions}>
            <ThemeToggleButton />
            <TouchableOpacity style={[s.avatar, { backgroundColor: isDark ? stone[700] : stone[200], borderColor: isDark ? stone[600] : stone[300] }]} onPress={() => router.push('/settings')} activeOpacity={0.8}>
              <Text style={[s.avatarText, { color: c.textPrimary }]}>{greetingInitial}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Services */}
        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: c.textPrimary }]}>Services</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/services')}>
            <Text style={[s.sectionLink, { color: c.textSecondary }]}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={s.servicesGrid}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => openBooking('walk')}>
            <ThemedCard lightBackgroundColor={colors.dark} style={s.featuredCard}>
              <IconBadge label={serviceIcons.walk} size={44} bg={gold[100]} fg={gold[600]} />
              <View style={{ flex: 1 }}>
                <Text style={s.featuredName}>Walkers</Text>
                <Text style={s.featuredSub}>6 available near you</Text>
              </View>
              <Text style={{ color: colors.accent, fontSize: 20 }}>→</Text>
            </ThemedCard>
          </TouchableOpacity>

          <View style={s.gridRow}>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.85} onPress={() => openBooking('groom')}>
              <ThemedCard lightBackgroundColor={stone[100]} style={s.gridCard}>
                <View style={s.popularBadge}><Text style={s.popularText}>Popular</Text></View>
                <IconBadge label={serviceIcons.groom} size={36} bg={isDark ? stone[700] : warm[200]} fg={isDark ? warm[200] : stone[700]} />
                <Text style={[s.gridName, { color: c.textPrimary }]}>Groomers</Text>
                <Text style={[s.gridSub, { color: c.textSecondary }]}>4 available</Text>
              </ThemedCard>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.85} onPress={() => openBooking('hotel')}>
              <ThemedCard lightBackgroundColor={stone[100]} style={s.gridCard}>
                <IconBadge label={serviceIcons.hotel} size={36} bg={isDark ? stone[700] : warm[200]} fg={isDark ? warm[200] : stone[700]} />
                <Text style={[s.gridName, { color: c.textPrimary }]}>Hotels</Text>
                <Text style={[s.gridSub, { color: c.textSecondary }]}>3 dog hotels</Text>
              </ThemedCard>
            </TouchableOpacity>
          </View>

          <View style={s.gridRow}>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.85} onPress={() => openBooking('vet')}>
              <ThemedCard lightBackgroundColor={stone[100]} style={s.gridCard}>
                <IconBadge label={serviceIcons.vet} size={36} bg={isDark ? stone[700] : warm[200]} fg={isDark ? warm[200] : stone[700]} />
                <Text style={[s.gridName, { color: c.textPrimary }]}>Vets</Text>
                <Text style={[s.gridSub, { color: c.textSecondary }]}>2 vet hospitals</Text>
              </ThemedCard>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.85} onPress={() => openBooking('shop')}>
              <ThemedCard lightBackgroundColor={stone[100]} style={s.gridCard}>
                <IconBadge label={serviceIcons.shop} size={36} bg={isDark ? stone[700] : warm[200]} fg={isDark ? warm[200] : stone[700]} />
                <Text style={[s.gridName, { color: c.textPrimary }]}>Shop</Text>
                <Text style={[s.gridSub, { color: c.textSecondary }]}>Chewy + Farmer's Dog</Text>
              </ThemedCard>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.emergencyCard} activeOpacity={0.85} onPress={() => openBooking('emergency')}>
            <IconBadge label={serviceIcons.emergency} size={36} bg="rgba(239,107,107,0.15)" fg={colors.emergencyAccent} />
            <Text style={[s.gridName, { color: warm[100], marginTop: 8 }]}>Emergency</Text>
            <Text style={[s.gridSub, { color: colors.emergencyAccent }]}>24/7 urgent care</Text>
          </TouchableOpacity>
        </View>

        {/* AI Insights */}
        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: c.textPrimary }]}>AI Insights</Text>
          <Text style={s.aiLabel}>FOR MANGO</Text>
        </View>

        <ThemedCard lightBackgroundColor={colors.dark} style={s.aiCard}>
          <Text style={s.aiCardLabel}>◆  KYNO AI · CARE INTELLIGENCE</Text>
          {!insights ? (
            <View>
              <View style={[s.shimmerBar, { width: '100%' }]} />
              <View style={[s.shimmerBar, { width: '82%' }]} />
              <View style={[s.shimmerBar, { width: '66%' }]} />
            </View>
          ) : (
            insights.map((insight, i) => (
              <View key={i} style={[s.aiInsightRow, i === insights.length - 1 && { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}>
                <Text style={s.aiDot}>◆</Text>
                <Text style={s.aiText}>{insight}</Text>
              </View>
            ))
          )}
        </ThemedCard>

        {/* Upcoming */}
        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: c.textPrimary }]}>Upcoming</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/activity')}>
            <Text style={[s.sectionLink, { color: c.textSecondary }]}>View all</Text>
          </TouchableOpacity>
        </View>

        {upcomingBooking && upcomingDate ? (
          <ThemedCard lightBackgroundColor={stone[100]} style={s.upcomingCard}>
            <View style={s.upcomingDate}>
              <Text style={s.upcomingDay}>{upcomingDay}</Text>
              <Text style={s.upcomingMonth}>{upcomingMonth}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.upcomingTitle, { color: c.textPrimary }]}>{upcomingService?.name ?? 'Booking'}</Text>
              <Text style={[s.upcomingProvider, { color: c.textSecondary }]}>{upcomingBooking.provider_name}</Text>
            </View>
            <View>
              <Text style={[s.upcomingTime, { color: c.textSecondary }]}>{upcomingTime}</Text>
              <Text style={[s.upcomingTime, { color: c.textSecondary }]}>{upcomingBooking.status}</Text>
            </View>
          </ThemedCard>
        ) : (
          <ThemedCard lightBackgroundColor={stone[100]} style={s.upcomingEmpty}>
            <Text style={[s.upcomingTitle, { color: c.textPrimary }]}>No upcoming bookings</Text>
            <Text style={[s.upcomingProvider, { color: c.textSecondary }]}>Reserve a service to see it here.</Text>
            <TouchableOpacity style={s.upcomingAction} onPress={() => router.push('/(tabs)/services')}>
              <Text style={s.upcomingActionText}>Browse services</Text>
            </TouchableOpacity>
          </ThemedCard>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 28, paddingTop: 12 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  greetingLabel: { fontFamily: fonts.sans, fontSize: 11, letterSpacing: 2, color: colors.textSecondary },
  greetingName: { fontFamily: fonts.serif, fontSize: 26, color: colors.textPrimary, marginTop: 2 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: stone[200], borderWidth: 2, borderColor: stone[300], alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.serif, fontSize: 16, color: colors.dark },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 28, paddingTop: 28, paddingBottom: 14 },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.textPrimary },
  sectionLink: { fontFamily: fonts.sans, fontSize: 11, color: colors.textSecondary, letterSpacing: 0.5 },
  servicesGrid: { paddingHorizontal: 28, gap: 12 },
  featuredCard: { backgroundColor: stone[700], borderRadius: 18, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  featuredName: { fontFamily: fonts.serifMedium, fontSize: 18, color: warm[300] },
  featuredSub: { fontFamily: fonts.sansLight, fontSize: 10, color: stone[400], marginTop: 3, letterSpacing: 0.3 },
  gridRow: { flexDirection: 'row', gap: 12 },
  gridCard: { backgroundColor: stone[700], borderRadius: 18, padding: 18 },
  gridName: { fontFamily: fonts.serifMedium, fontSize: 16, color: colors.textPrimary, marginTop: 10 },
  gridSub: { fontFamily: fonts.sansLight, fontSize: 10, color: colors.textSecondary, marginTop: 3, letterSpacing: 0.3 },
  emergencyCard: { backgroundColor: colors.emergencyBg, borderRadius: 18, padding: 18 },
  popularBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: colors.accent, borderRadius: 20, paddingVertical: 3, paddingHorizontal: 7 },
  popularText: { fontFamily: fonts.sansBold, fontSize: 8, letterSpacing: 0.8, color: '#FFFFFF', textTransform: 'uppercase' },
  aiLabel: { fontFamily: fonts.sansBold, fontSize: 9, color: colors.accent, letterSpacing: 1.2 },
  aiCard: { marginHorizontal: 28, backgroundColor: stone[700], borderRadius: 20, padding: 18 },
  aiCardLabel: { fontFamily: fonts.sansMedium, fontSize: 9, letterSpacing: 2.5, color: gold[400], marginBottom: 14 },
  aiInsightRow: { flexDirection: 'row', gap: 10, paddingBottom: 10, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(212,168,58,0.12)' },
  aiDot: { color: gold[400], fontSize: 7, marginTop: 4, opacity: 0.7 },
  aiText: { fontFamily: fonts.sansLight, fontSize: 12, color: warm[100], lineHeight: 19, flex: 1 },
  shimmerBar: { height: 10, backgroundColor: 'rgba(212,168,58,0.2)', borderRadius: 5, marginBottom: 10 },
  upcomingCard: { marginHorizontal: 28, backgroundColor: stone[100], borderRadius: 15, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  upcomingDate: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, alignItems: 'center', minWidth: 44 },
  upcomingDay: { fontFamily: fonts.serif, fontSize: 22, color: '#FFFFFF' },
  upcomingMonth: { fontFamily: fonts.sansBold, fontSize: 8, letterSpacing: 1, color: '#FFFFFF', opacity: 0.8, marginTop: 2 },
  upcomingTitle: { fontFamily: fonts.serifMedium, fontSize: 16, color: colors.textPrimary },
  upcomingProvider: { fontFamily: fonts.sansLight, fontSize: 11, color: colors.textSecondary, marginTop: 3 },
  upcomingTime: { fontFamily: fonts.sans, fontSize: 11, color: colors.textSecondary, textAlign: 'right', lineHeight: 18 },
  upcomingEmpty: { marginHorizontal: 28, backgroundColor: stone[700], borderRadius: 18, padding: 18 },
  upcomingAction: { marginTop: 14, alignSelf: 'flex-start', backgroundColor: colors.dark, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 14 },
  upcomingActionText: { fontFamily: fonts.sansMedium, fontSize: 11, letterSpacing: 0.8, color: warm[100], textTransform: 'uppercase' },
});
