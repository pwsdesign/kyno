import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fonts, stone, gold, getColors } from '../../constants/colors';
import { services } from '../../constants/services';
import { listBookings, type BookingRecord } from '../../services/bookingService';
import { useTheme } from '../../context/ThemeContext';
import { ScreenBackground } from '../../components/ScreenBackground';
import { ThemedCard } from '../../components/ThemedCard';

function getServiceMeta(serviceId: string) {
  return services.find(service => service.id === serviceId);
}

function formatBookingDate(booking: BookingRecord) {
  return new Date(booking.scheduled_for).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatBookingTime(booking: BookingRecord) {
  return new Date(booking.scheduled_for).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function ActivityScreen() {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [history, setHistory] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      try {
        const nextHistory = await listBookings();
        if (isMounted) {
          setHistory(nextHistory);
        }
      } catch {
        if (isMounted) {
          setHistory([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]} edges={['top']}>
      <ScreenBackground isDark={isDark} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={[s.label, { color: c.textSecondary }]}>ACTIVITY</Text>
          <Text style={[s.title, { color: c.textPrimary }]}>Recent</Text>
        </View>

        {loading ? (
          <ThemedCard lightBackgroundColor={stone[100]} style={s.emptyState}>
            <ActivityIndicator color={c.accent} />
            <Text style={[s.emptyTitle, { color: c.textPrimary }]}>Loading bookings...</Text>
          </ThemedCard>
        ) : history.length === 0 ? (
          <ThemedCard lightBackgroundColor={stone[100]} style={s.emptyState}>
            <Text style={[s.emptyTitle, { color: c.textPrimary }]}>No bookings yet</Text>
            <Text style={[s.emptyText, { color: c.textSecondary }]}>Your confirmed bookings will appear here once you reserve a service.</Text>
          </ThemedCard>
        ) : (
          history.map(booking => {
            const service = getServiceMeta(booking.service_id);

            return (
              <ThemedCard key={booking.id} lightBackgroundColor={stone[200]} style={s.card}>
                <View style={s.iconWrap}>
                  <Text style={s.icon}>{service?.icon ?? 'K'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.cardTitle, { color: c.textPrimary }]}>{service?.name ?? 'Booking'}</Text>
                  <Text style={[s.cardProvider, { color: c.textSecondary }]}>{booking.provider_name}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[s.cardDate, { color: c.textSecondary }]}>{formatBookingDate(booking)}</Text>
                  <Text style={[s.cardTime, { color: c.textTertiary }]}>{formatBookingTime(booking)}</Text>
                  <View style={[s.statusBadge, { backgroundColor: isDark ? stone[800] : stone[200] }]}>
                    <Text style={[s.statusText, { color: c.textPrimary }]}>{booking.status}</Text>
                  </View>
                </View>
              </ThemedCard>
            );
          })
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  header: { paddingHorizontal: 28, paddingTop: 12, paddingBottom: 20 },
  label: { fontFamily: fonts.sans, fontSize: 11, letterSpacing: 2, color: colors.textSecondary },
  title: { fontFamily: fonts.serif, fontSize: 26, color: colors.textPrimary, marginTop: 2 },
  card: { marginHorizontal: 28, marginBottom: 10, backgroundColor: stone[700], borderRadius: 22, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'transparent' },
  iconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: gold[50], alignItems: 'center', justifyContent: 'center' },
  icon: { fontFamily: fonts.serifMedium, fontSize: 18, color: gold[600] },
  cardTitle: { fontFamily: fonts.serifMedium, fontSize: 15, color: colors.textPrimary },
  cardProvider: { fontFamily: fonts.sansLight, fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  cardDate: { fontFamily: fonts.sans, fontSize: 11, color: colors.textSecondary },
  cardTime: { fontFamily: fonts.sansLight, fontSize: 10, color: colors.textTertiary, marginTop: 2 },
  statusBadge: { marginTop: 6, backgroundColor: stone[700], borderRadius: 10, paddingVertical: 2, paddingHorizontal: 8 },
  statusText: { fontFamily: fonts.sansMedium, fontSize: 8, letterSpacing: 0.8, color: colors.textPrimary, textTransform: 'uppercase' },
  emptyState: { marginHorizontal: 28, marginTop: 10, backgroundColor: stone[700], borderRadius: 22, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  emptyTitle: { fontFamily: fonts.serifMedium, fontSize: 18, color: colors.textPrimary, marginTop: 8 },
  emptyText: { fontFamily: fonts.sansLight, fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: 6, lineHeight: 18 },
});
