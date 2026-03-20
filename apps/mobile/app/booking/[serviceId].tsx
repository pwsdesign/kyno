import { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { colors, fonts, gold, stone, warm, getColors } from '../../constants/colors';
import { services, providerDirectory } from '../../constants/services';
import { computeMatchScore } from '../../services/aiService';
import { getCurrentDogs, type UserDog } from '../../services/authService';
import { createBooking } from '../../services/bookingService';
import { useTheme } from '../../context/ThemeContext';
import { ScreenBackground } from '../../components/ScreenBackground';

const TIMES = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '4:00 PM', '5:00 PM'];

interface DateOption {
  date: string;
  day: string;
  value: Date;
}

function buildDateOptions(): DateOption[] {
  return Array.from({ length: 5 }, (_, index) => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    value.setDate(value.getDate() + index + 1);

    return {
      day: value.toLocaleDateString('en-US', { weekday: 'short' }),
      date: value.getDate().toString(),
      value,
    };
  });
}

function buildScheduledFor(date: Date, timeLabel: string) {
  const [rawTime, meridiem] = timeLabel.split(' ');
  const [rawHours, rawMinutes] = rawTime.split(':');
  const scheduled = new Date(date);
  let hours = Number(rawHours);

  if (meridiem === 'PM' && hours < 12) {
    hours += 12;
  }

  if (meridiem === 'AM' && hours === 12) {
    hours = 0;
  }

  scheduled.setHours(hours, Number(rawMinutes), 0, 0);
  return scheduled.toISOString();
}

function ProviderAvatar({ initials, active }: { initials: string; active: boolean }) {
  return (
    <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: active ? gold[600] : gold[100], alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: fonts.serifMedium, fontSize: 11, color: active ? '#FFFFFF' : gold[700] }}>{initials}</Text>
    </View>
  );
}

export default function BookingScreen() {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(0);
  const [dogs, setDogs] = useState<UserDog[]>([]);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const dateOptions = useMemo(() => buildDateOptions(), []);
  const providers = useMemo(() => providerDirectory[serviceId ?? 'walk'] || providerDirectory.walk, [serviceId]);
  const service = useMemo(() => services.find(s => s.id === serviceId), [serviceId]);
  const current = providers[selectedProvider] || providers[0];

  useEffect(() => {
    let isMounted = true;

    async function loadDogs() {
      try {
        const nextDogs = await getCurrentDogs();
        if (!isMounted) {
          return;
        }

        setDogs(nextDogs);
        if (nextDogs[0]) {
          setSelectedDogId(nextDogs[0].id);
        }
      } catch {
        if (isMounted) {
          setDogs([]);
        }
      }
    }

    void loadDogs();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!current) return null;

  const handleBook = async () => {
    const selectedSlot = dateOptions[selectedDate];

    if (!service || !selectedSlot) {
      Alert.alert('Unavailable', 'This booking slot is no longer available.');
      return;
    }

    setSubmitting(true);

    try {
      await createBooking({
        dogId: selectedDogId,
        priceLabel: current.price,
        providerCategory: current.category,
        providerName: current.name,
        scheduledFor: buildScheduledFor(selectedSlot.value, TIMES[selectedTime]),
        serviceId: service.id,
      });

      Alert.alert(
        'Booking confirmed',
        `${service.name} with ${current.name} has been saved to your account.`,
        [{ text: 'View activity', onPress: () => router.replace('/(tabs)/activity') }]
      );
    } catch (error) {
      Alert.alert('Booking failed', error instanceof Error ? error.message : 'Unable to save your booking right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]} edges={['top']}>
      <ScreenBackground isDark={isDark} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[s.hero, { backgroundColor: isDark ? '#181614' : colors.dark }]}>
          <TouchableOpacity style={[s.backBtn, { backgroundColor: isDark ? 'rgba(247,241,230,0.12)' : 'rgba(253,251,247,0.15)' }]} onPress={() => router.back()}>
            <Text style={s.backText}>←</Text>
          </TouchableOpacity>
          <View style={s.heroIcon}>
            <Text style={s.heroInitials}>{current.icon || service?.icon || 'K'}</Text>
          </View>
        </View>

        <View style={s.body}>
          <Text style={[s.sectionTitle, { color: c.textPrimary }]}>Choose {service?.name || 'Provider'}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.pickerScroll} contentContainerStyle={{ gap: 8 }}>
            {providers.map((provider, idx) => {
              const active = selectedProvider === idx;
              const matchScore = computeMatchScore(provider);
              return (
                <TouchableOpacity key={provider.name} style={[s.pickerCard, { backgroundColor: isDark ? stone[800] : stone[100], borderColor: isDark ? c.border : 'transparent' }, active && s.pickerCardActive]} activeOpacity={0.85} onPress={() => setSelectedProvider(idx)}>
                  <View style={s.pickerTop}>
                    <ProviderAvatar initials={provider.icon} active={active} />
                    {provider.brandBadge && (
                      <View style={[s.brandBadge, active && { backgroundColor: warm[100] }]}>
                        <Text style={s.brandText}>{provider.brandBadge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[s.pickerName, { color: c.textPrimary }, active && { color: warm[100] }]}>{provider.name}</Text>
                  <Text style={[s.pickerMeta, { color: c.textSecondary }, active && { color: stone[400] }]}>{provider.category}</Text>
                  <Text style={[s.pickerPrice, { color: c.textPrimary }, active && { color: warm[100] }]}>{provider.price}</Text>
                  <Text style={[s.matchBadge, active && { color: gold[300] }]}>{matchScore}% match</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Info */}
          <View style={s.infoHeader}>
            <View style={{ flex: 1 }}>
              <Text style={s.providerName}>{current.name}</Text>
              <Text style={s.providerCategory}>{current.category}</Text>
            </View>
            <View style={s.ratingBadge}>
              <Text style={s.ratingStars}>★★★★★</Text>
              <Text style={s.ratingNum}>{current.rating}</Text>
            </View>
          </View>

          <View style={s.tagsRow}>
            {current.tags.map(tag => (
              <View key={tag} style={s.tag}><Text style={s.tagText}>{tag}</Text></View>
            ))}
          </View>

          {dogs.length > 0 ? (
            <>
              <Text style={[s.sectionTitle, { color: c.textPrimary }]}>Select a dog</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} contentContainerStyle={{ gap: 8 }}>
                {dogs.map(dog => {
                  const active = selectedDogId === dog.id;
                  return (
                    <TouchableOpacity key={dog.id} style={[s.dogChip, active && s.dogChipActive]} onPress={() => setSelectedDogId(dog.id)}>
                      <Text style={[s.dogChipText, active && s.dogChipTextActive]}>{dog.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          ) : null}

          {/* Date */}
          <Text style={[s.sectionTitle, { color: c.textPrimary }]}>Select a date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} contentContainerStyle={{ gap: 8 }}>
            {dateOptions.map((d, i) => (
              <TouchableOpacity key={i} style={[s.dateSlot, selectedDate === i && s.dateSlotActive]} onPress={() => setSelectedDate(i)}>
                <Text style={[s.dateDay, selectedDate === i && { color: stone[400] }]}>{d.day}</Text>
                <Text style={[s.dateNum, selectedDate === i && { color: warm[100] }]}>{d.date}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Time */}
          <Text style={[s.sectionTitle, { color: c.textPrimary }]}>Select a time</Text>
          <View style={s.timeGrid}>
            {TIMES.map((t, i) => (
              <TouchableOpacity key={i} style={[s.timeChip, selectedTime === i && s.timeChipActive]} onPress={() => setSelectedTime(i)}>
                <Text style={[s.timeText, selectedTime === i && s.timeTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[s.bookBtn, submitting && { opacity: 0.7 }]}
            activeOpacity={0.85}
            onPress={handleBook}
            disabled={submitting}
          >
            <Text style={s.bookBtnText}>{submitting ? 'Saving Booking...' : `Book ${service?.name || 'Service'}`}</Text>
            <Text style={s.bookBtnPrice}>{current.price}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  hero: { height: 200, backgroundColor: colors.dark, alignItems: 'center', justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 18, left: 20, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(253,251,247,0.15)', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  backText: { fontSize: 16, color: warm[100] },
  heroIcon: { width: 80, height: 80, borderRadius: 24, backgroundColor: stone[700], alignItems: 'center', justifyContent: 'center' },
  heroInitials: { fontFamily: fonts.serifMedium, fontSize: 32, color: gold[300] },
  body: { padding: 22 },
  sectionTitle: { fontFamily: fonts.serifMedium, fontSize: 16, color: colors.textPrimary, marginBottom: 12 },
  pickerScroll: { marginBottom: 18 },
  pickerCard: { minWidth: 168, backgroundColor: stone[100], borderRadius: 14, padding: 12, borderWidth: 1, borderColor: 'transparent' },
  pickerCardActive: { backgroundColor: colors.dark, borderColor: gold[600]},
  pickerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  brandBadge: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 4, paddingHorizontal: 7 },
  brandText: { fontFamily: fonts.sansBold, fontSize: 8, letterSpacing: 1, color: '#FFFFFF', textTransform: 'uppercase' },
  pickerName: { fontFamily: fonts.serif, fontSize: 17, color: colors.textPrimary },
  pickerMeta: { fontFamily: fonts.sans, fontSize: 10, color: colors.textSecondary, marginTop: 3, lineHeight: 14 },
  pickerPrice: { fontFamily: fonts.serif, fontSize: 16, color: colors.dark, marginTop: 8 },
  matchBadge: { fontFamily: fonts.sansBold, fontSize: 10, color: colors.accent, marginTop: 6, letterSpacing: 0.2 },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  providerName: { fontFamily: fonts.serif, fontSize: 28, color: gold[600] },
  providerCategory: { fontFamily: fonts.sans, fontSize: 10, letterSpacing: 2, color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 16 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: stone[100], borderRadius: 20, paddingVertical: 5, paddingHorizontal: 10, marginTop: 4 },
  ratingStars: { fontSize: 10, letterSpacing: 1, color: colors.accent },
  ratingNum: { fontFamily: fonts.serifMedium, fontSize: 15, color: colors.textPrimary },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: { backgroundColor: stone[100], borderRadius: 20, paddingVertical: 5, paddingHorizontal: 11 },
  tagText: { fontFamily: fonts.sans, fontSize: 10, color: colors.textPrimary, letterSpacing: 0.3 },
  dogChip: { backgroundColor: stone[100], borderRadius: 20, paddingVertical: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: 'transparent' },
  dogChipActive: { backgroundColor: colors.dark, borderColor: gold[600]},
  dogChipText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.textPrimary },
  dogChipTextActive: { color: warm[300] },
  dateSlot: { backgroundColor: stone[100], borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  dateSlotActive: { backgroundColor: stone[500], borderColor: gold[600] },
  dateDay: { fontFamily: fonts.sansMedium, fontSize: 9, letterSpacing: 1, color: colors.textSecondary, textTransform: 'uppercase' },
  dateNum: { fontFamily: fonts.serif, fontSize: 20, color: colors.textPrimary },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  timeChip: { backgroundColor: stone[100], borderRadius: 20, paddingVertical: 7, paddingHorizontal: 14, borderWidth: 1, borderColor: 'transparent' },
  timeChipActive: { backgroundColor: gold[600] },
  timeText: { fontFamily: fonts.sans, fontSize: 12, color: colors.textPrimary },
  timeTextActive: { color: '#FFFFFF', fontFamily: fonts.sansMedium },
  bookBtn: { backgroundColor: colors.dark, borderRadius: 18, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  bookBtnText: { fontFamily: fonts.sansMedium, fontSize: 13, letterSpacing: 1.5, color: warm[100], textTransform: 'uppercase' },
  bookBtnPrice: { fontFamily: fonts.serif, fontSize: 18, color: gold[400] },
});
