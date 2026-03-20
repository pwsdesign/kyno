import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, router } from 'expo-router';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DogProfileFormCard, createDraftDog, hasDogDetails, type DogFormValue } from '../../components/DogProfileFormCard';
import { ScreenBackground } from '../../components/ScreenBackground';
import { colors, fonts, getColors, gold, stone } from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';
import { createAccount, type DogProfileInput } from '../../services/authService';

export default function AddDogScreen() {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const { firstName, lastName, phone, email, password } = useLocalSearchParams<{
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phone: string;
  }>();

  const [dogs, setDogs] = useState<DogFormValue[]>([createDraftDog()]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateDog = (id: string, patch: Partial<DogFormValue>) => {
    setDogs(current => current.map(dog => (dog.id === id ? { ...dog, ...patch } : dog)));
  };

  const addDog = () => setDogs(current => [...current, createDraftDog()]);

  const removeDog = (id: string) => {
    setDogs(current => current.filter(dog => dog.id !== id));
  };

  const pickProfilePhoto = async (dogId: string) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Photo access needed', 'Please allow photo library access to upload your dog profile photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    const mimeType = asset.mimeType ?? 'image/jpeg';

    updateDog(dogId, {
      profilePhotoData: asset.base64 ? `data:${mimeType};base64,${asset.base64}` : null,
      profilePhotoName: asset.fileName ?? `dog-profile-${Date.now()}.jpg`,
    });
  };

  const pickVaccineHistory = async (dogId: string) => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
      type: ['application/pdf', 'image/*'],
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];

    updateDog(dogId, {
      vaccineHistoryName: asset.name,
      vaccineHistoryNote: asset.mimeType ?? '',
    });
  };

  const buildDogPayload = () => {
    const startedDogs = dogs.filter(hasDogDetails);

    if (startedDogs.length === 0) {
      throw new Error('Add at least one dog or tap skip for now.');
    }

    if (startedDogs.some(dog => !dog.name.trim())) {
      throw new Error('Every dog you add needs a name so we know who the chaos belongs to.');
    }

    return startedDogs.map<DogProfileInput>(dog => ({
      alteredStatus: dog.alteredStatus,
      breed: dog.breed,
      careNotes: dog.careNotes,
      dob: dog.dob,
      name: dog.name,
      personality: dog.personality,
      profilePhotoData: dog.profilePhotoData,
      profilePhotoName: dog.profilePhotoName,
      sex: dog.sex,
      vaccineHistoryName: dog.vaccineHistoryName,
      vaccineHistoryNote: dog.vaccineHistoryNote,
      weight: dog.weight,
    }));
  };

  const handleFinish = async (skipDogs = false) => {
    setLoading(true);
    setError('');

    try {
      await createAccount({
        firstName: firstName ?? '',
        lastName: lastName ?? '',
        email: email ?? '',
        password: password ?? '',
        phone: phone ?? '',
        dogs: skipDogs ? [] : buildDogPayload(),
      });

      router.replace('/membership?fromSignup=1');
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Something went wrong. Please try again.';
      setError(message);
      Alert.alert('Unable to finish setup', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]}>
      <ScreenBackground isDark={isDark} />
      <KeyboardAvoidingView style={s.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Text style={[s.backText, { color: c.textSecondary }]}>← Back</Text>
          </TouchableOpacity>

          <Text style={s.stepLabel}>STEP 2 OF 2</Text>
          <Text style={[s.title, { color: c.textPrimary }]}>Build your dog profile</Text>
          <Text style={[s.subtitle, { color: c.textSecondary }]}>Add the essentials now, or skip and clean it up later.</Text>

          <View style={[s.noticeCard, { backgroundColor: isDark ? 'rgba(247,241,230,0.06)' : '#F7F1E8', borderColor: isDark ? 'rgba(212,168,58,0.16)' : 'rgba(212,168,58,0.18)' }]}>
            <Text style={[s.noticeTitle, { color: c.textPrimary }]}>What we should know</Text>
            <Text style={[s.noticeText, { color: c.textSecondary }]}>
              Breed, DOB, weight, personality, photo, vaccine record, and any notes about meds, allergies, or quirks help providers stop guessing.
            </Text>
          </View>

          {dogs.length > 0 ? (
            dogs.map((dog, index) => (
              <DogProfileFormCard
                key={dog.id}
                dog={dog}
                index={index}
                totalDogs={dogs.length}
                onChange={patch => updateDog(dog.id, patch)}
                onPickProfilePhoto={() => void pickProfilePhoto(dog.id)}
                onPickVaccineHistory={() => void pickVaccineHistory(dog.id)}
                onRemove={() => removeDog(dog.id)}
              />
            ))
          ) : (
            <View style={[s.emptyCard, { backgroundColor: c.surface, borderColor: c.border }]}>
              <Text style={[s.emptyTitle, { color: c.textPrimary }]}>No dog profile added yet</Text>
              <Text style={[s.emptyText, { color: c.textSecondary }]}>Add one below or skip for now and come back later.</Text>
            </View>
          )}

          <TouchableOpacity style={[s.addBtn, { borderColor: c.border }]} onPress={addDog}>
            <Text style={s.addBtnText}>+ Add another dog</Text>
          </TouchableOpacity>

          {error ? <Text style={s.error}>{error}</Text> : null}

          <TouchableOpacity style={[s.skipBtn, { backgroundColor: c.surface, borderColor: c.border }, loading && s.disabledBtn]} activeOpacity={0.85} onPress={() => void handleFinish(true)} disabled={loading}>
            <Text style={[s.skipBtnText, { color: c.textSecondary }]}>SKIP FOR NOW</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.finishBtn, loading && s.disabledBtn]} activeOpacity={0.85} onPress={() => void handleFinish(false)} disabled={loading}>
            <Text style={s.finishBtnText}>{loading ? 'SETTING UP...' : 'GET STARTED'}</Text>
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
  backBtn: { marginBottom: 24, marginTop: 8 },
  backText: { color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14 },
  stepLabel: { color: gold[500], fontFamily: fonts.sansMedium, fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  title: { color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 30, marginBottom: 6 },
  subtitle: { color: colors.textSecondary, fontFamily: fonts.sansLight, fontSize: 14, lineHeight: 20, marginBottom: 20 },
  noticeCard: {
    backgroundColor: '#F7F1E8',
    borderColor: 'rgba(212,168,58,0.18)',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 24,
    padding: 16,
  },
  noticeTitle: { color: colors.textPrimary, fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: 1.2, marginBottom: 6 },
  noticeText: { color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, lineHeight: 19 },
  emptyCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 18,
    padding: 18,
  },
  emptyTitle: { color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 22, marginBottom: 8 },
  emptyText: { color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, lineHeight: 18 },
  addBtn: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 14,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginTop: 4,
    paddingVertical: 14,
  },
  addBtnText: { color: gold[600], fontFamily: fonts.sansMedium, fontSize: 13 },
  error: { color: colors.emergencyAccent, fontFamily: fonts.sans, fontSize: 12, lineHeight: 18, marginTop: 14 },
  skipBtn: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 18,
    paddingVertical: 16,
  },
  skipBtnText: { color: colors.textSecondary, fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 1.5 },
  finishBtn: {
    alignItems: 'center',
    backgroundColor: gold[600],
    borderRadius: 14,
    marginBottom: 24,
    marginTop: 12,
    paddingVertical: 16,
  },
  finishBtnText: { color: '#FFFFFF', fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 2 },
  disabledBtn: { opacity: 0.5 },
});
