import { useEffect, useRef, useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors, fonts, gold, stone, warm, getColors } from '../../constants/colors';
import { getCurrentDogs, getCurrentProfile, type UserDog, type UserProfile } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';
import { ScreenBackground } from '../../components/ScreenBackground';
import { ThemedCard } from '../../components/ThemedCard';

function renderValue(value?: string | null, fallback = 'Add later') {
  return value?.trim() || fallback;
}

function renderDogSubtitle(dog: UserDog, totalDogs: number) {
  const detailLine = [dog.breed?.trim(), dog.sex?.trim()].filter(Boolean).join(' · ');

  if (detailLine) {
    return detailLine;
  }

  return totalDogs > 1 ? `${totalDogs} dogs on account` : 'Profile still filling in the blanks';
}

function renderVaccineText(dog: UserDog) {
  if (!dog.vaccine_history_name) {
    return 'Upload later';
  }

  return dog.vaccine_history_note?.trim()
    ? `${dog.vaccine_history_name} · ${dog.vaccine_history_note}`
    : dog.vaccine_history_name;
}

export default function ProfileScreen() {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dogs, setDogs] = useState<UserDog[]>([]);
  const [activeDogIndex, setActiveDogIndex] = useState(0);
  const { width } = useWindowDimensions();
  const carouselRef = useRef<ScrollView>(null);
  const cardWidth = Math.max(width - 84, 280);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const [nextProfile, nextDogs] = await Promise.all([getCurrentProfile(), getCurrentDogs()]);
        if (!isMounted) {
          return;
        }

        setProfile(nextProfile);
        setDogs(nextDogs);
        setActiveDogIndex(0);
      } catch {
        if (isMounted) {
          setProfile(null);
          setDogs([]);
          setActiveDogIndex(0);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCarouselEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const interval = cardWidth + 14;
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / interval);

    setActiveDogIndex(Math.min(Math.max(nextIndex, 0), Math.max(dogs.length - 1, 0)));
  };

  const jumpToDog = (index: number) => {
    carouselRef.current?.scrollTo({
      animated: true,
      x: index * (cardWidth + 14),
      y: 0,
    });

    setActiveDogIndex(index);
  };

  const displayName = profile?.first_name?.trim() || 'Account';

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]} edges={['top']}>
      <ScreenBackground isDark={isDark} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View>
            <Text style={[s.label, { color: c.textSecondary }]}>ACCOUNT</Text>
            <Text style={[s.name, { color: c.textPrimary }]}>{displayName}</Text>
          </View>
          <View style={s.headerActions}>
            <TouchableOpacity style={[s.editBtn, { backgroundColor: isDark ? 'rgba(247,241,230,0.08)' : warm[100], borderColor: isDark ? 'rgba(212,168,58,0.16)' : 'transparent' }]} onPress={() => router.push('/dogs')}>
              <Text style={[s.editBtnText, { color: c.textPrimary }]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.settingsBtn, { backgroundColor: isDark ? stone[800] : stone[100] }]} onPress={() => router.push('/settings')}>
              <Text style={[s.settingsIcon, { color: c.textSecondary }]}>⚙</Text>
            </TouchableOpacity>
          </View>
        </View>

        {dogs.length > 0 ? (
          <View style={s.carouselSection}>
            <ScrollView
              ref={carouselRef}
              contentContainerStyle={s.carouselContent}
              decelerationRate="fast"
              disableIntervalMomentum
              horizontal
              onMomentumScrollEnd={handleCarouselEnd}
              pagingEnabled={false}
              showsHorizontalScrollIndicator={false}
              snapToAlignment="start"
              snapToInterval={cardWidth + 14}
            >
              {dogs.map((dog, index) => (
                <ThemedCard
                  key={dog.id}
                  lightBackgroundColor={colors.dark}
                  style={[s.dogCard, { width: cardWidth }, index === dogs.length - 1 && s.lastCard]}
                >
                  <View style={s.cardTopRow}>
                    <Text style={s.cardLabel}>
                      DOG PROFILE {dogs.length > 1 ? `— ${index + 1} OF ${dogs.length}` : '— ACTIVE'}
                    </Text>
                    {dogs.length > 1 ? <Text style={s.cardCount}>{dogs.length} dogs</Text> : null}
                  </View>

                  <View style={s.dogMain}>
                    {dog.profile_photo_data ? (
                      <Image source={{ uri: dog.profile_photo_data }} style={s.dogPhoto} />
                    ) : (
                      <View style={s.dogAvatar}>
                        <Text style={s.dogInitial}>{dog.name.charAt(0).toUpperCase()}</Text>
                      </View>
                    )}
                    <View style={s.dogMeta}>
                      <Text style={s.dogName}>{dog.name}</Text>
                      <Text style={s.dogSubtitle}>{renderDogSubtitle(dog, dogs.length)}</Text>
                    </View>
                  </View>

                  <View style={s.statsGrid}>
                    {[
                      { key: 'DOB', val: renderValue(dog.dob) },
                      { key: 'BREED', val: renderValue(dog.breed) },
                      { key: 'WEIGHT', val: renderValue(dog.weight) },
                      { key: 'STATUS', val: renderValue(dog.altered_status) },
                    ].map(item => (
                      <View key={item.key} style={s.statItem}>
                        <Text style={s.statKey}>{item.key}</Text>
                        <Text style={s.statValue}>{item.val}</Text>
                      </View>
                    ))}
                  </View>

                  {[
                    { key: 'PERSONALITY', val: renderValue(dog.personality, 'Still collecting the vibe report.') },
                    { key: 'CARE NOTES', val: renderValue(dog.care_notes, 'No meds, allergies, or red-flag notes added yet.') },
                    { key: 'VACCINE HISTORY', val: renderVaccineText(dog) },
                  ].map(item => (
                    <View key={item.key} style={s.detailRow}>
                      <Text style={s.statKey}>{item.key}</Text>
                      <Text style={s.statValue}>{item.val}</Text>
                    </View>
                  ))}

                  {dogs.length > 1 ? (
                    <View style={s.detailRow}>
                      <Text style={s.statKey}>DOGS ON ACCOUNT</Text>
                      <View style={s.chipRow}>
                        {dogs.map((accountDog, dogIndex) => (
                          <TouchableOpacity
                            key={accountDog.id}
                            style={[s.nameChip, dogIndex === activeDogIndex && s.nameChipActive]}
                            onPress={() => jumpToDog(dogIndex)}
                          >
                            <Text style={[s.nameChipText, dogIndex === activeDogIndex && s.nameChipTextActive]}>
                              {accountDog.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ) : null}
                </ThemedCard>
              ))}
            </ScrollView>

            {dogs.length > 1 ? (
              <View style={s.pagination}>
                {dogs.map((dog, index) => (
                  <TouchableOpacity
                    key={dog.id}
                    style={[s.paginationDot, index === activeDogIndex && s.paginationDotActive]}
                    onPress={() => jumpToDog(index)}
                  />
                ))}
              </View>
            ) : null}
          </View>
        ) : (
          <ThemedCard lightBackgroundColor={colors.dark} style={s.emptyCard}>
            <Text style={s.cardLabel}>DOG PROFILE — PENDING</Text>
            <Text style={s.emptyTitle}>No dog added yet</Text>
            <Text style={s.emptyText}>
              You skipped dog details during setup. Add the dogs now and they will show up here as swipeable profile cards.
            </Text>
            <TouchableOpacity style={s.emptyAction} onPress={() => router.push('/dogs')}>
              <Text style={s.emptyActionText}>Add Dog Profiles</Text>
            </TouchableOpacity>
          </ThemedCard>
        )}

        <View style={s.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 28, paddingTop: 12 },
  headerActions: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  label: { color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, letterSpacing: 2 },
  name: { color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 26, marginTop: 2 },
  editBtn: { alignItems: 'center', backgroundColor: warm[100], borderRadius: 999, justifyContent: 'center', paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: 'transparent' },
  editBtnText: { color: colors.textPrimary, fontFamily: fonts.sansMedium, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase' },
  settingsBtn: { alignItems: 'center', backgroundColor: stone[100], borderRadius: 21, height: 42, justifyContent: 'center', width: 42 },
  settingsIcon: { color: colors.textSecondary, fontSize: 18 },
  carouselSection: { marginTop: 20 },
  carouselContent: { paddingHorizontal: 28, paddingRight: 42 },
  dogCard: { backgroundColor: stone[700], borderRadius: 24, marginRight: 14, padding: 22 },
  lastCard: { marginRight: 0 },
  cardTopRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  cardLabel: { color: gold[400], fontFamily: fonts.sansMedium, fontSize: 9, letterSpacing: 2.5, opacity: 0.9 },
  cardCount: { color: stone[400], fontFamily: fonts.sansMedium, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase' },
  dogMain: { alignItems: 'center', flexDirection: 'row', gap: 16 },
  dogMeta: { flex: 1 },
  dogAvatar: {
    alignItems: 'center',
    backgroundColor: stone[700],
    borderColor: 'rgba(212,168,58,0.3)',
    borderRadius: 18,
    borderWidth: 2,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  dogPhoto: { borderRadius: 18, height: 68, width: 68 },
  dogInitial: { color: gold[300], fontFamily: fonts.serifMedium, fontSize: 28 },
  dogName: { color: warm[200], fontFamily: fonts.serif, fontSize: 28 },
  dogSubtitle: { color: stone[400], fontFamily: fonts.sansLight, fontSize: 12, marginTop: 4, opacity: 0.8 },
  statsGrid: {
    borderTopColor: 'rgba(212,168,58,0.15)',
    borderTopWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
    paddingTop: 16,
  },
  statItem: {
    backgroundColor: 'rgba(253,251,247,0.06)',
    borderColor: 'rgba(212,168,58,0.12)',
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    width: '47%',
  },
  statKey: { color: stone[500], fontFamily: fonts.sansMedium, fontSize: 9, letterSpacing: 1.5, marginBottom: 5 },
  statValue: { color: warm[100], fontFamily: fonts.sans, fontSize: 12, lineHeight: 17 },
  detailRow: {
    backgroundColor: 'rgba(253,251,247,0.06)',
    borderColor: 'rgba(212,168,58,0.12)',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  nameChip: { backgroundColor: 'rgba(212,168,58,0.18)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  nameChipActive: { backgroundColor: gold[600] },
  nameChipText: { color: warm[100], fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase' },
  nameChipTextActive: { color: '#FFFFFF' },
  pagination: { alignItems: 'center', flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 14 },
  paginationDot: { backgroundColor: stone[300], borderRadius: 999, height: 8, width: 8 },
  paginationDotActive: { backgroundColor: gold[600], width: 22 },
  emptyCard: {
    backgroundColor: stone[700],
    borderRadius: 10,
    marginHorizontal: 28,
    marginTop: 20,
    padding: 20,
  },
  emptyTitle: { color: warm[300], fontFamily: fonts.serif, fontSize: 28, marginTop: 12 },
  emptyText: { color: stone[400], fontFamily: fonts.sans, fontSize: 13, lineHeight: 20, marginTop: 10 },
  emptyAction: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: gold[400], borderRadius: 999, marginTop: 16, paddingHorizontal: 14, paddingVertical: 10 },
  emptyActionText: { color: '#FFFFFF', fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase' },
  bottomSpace: { height: 24 },
});
