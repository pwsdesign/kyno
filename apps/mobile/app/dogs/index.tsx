import { useEffect, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DogProfileFormCard, createDraftDog, hasDogDetails, type DogFormValue } from '../../components/DogProfileFormCard';
import { colors, fonts, gold, getColors } from '../../constants/colors';
import { getCurrentDogs, saveCurrentDogs, type DogProfileInput, type UserDog } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';
import { ScreenBackground } from '../../components/ScreenBackground';

function mapDogToDraft(dog: UserDog): DogFormValue {
  return {
    alteredStatus: dog.altered_status ?? '',
    breed: dog.breed ?? '',
    careNotes: dog.care_notes ?? '',
    dob: dog.dob ?? '',
    id: dog.id,
    name: dog.name,
    personality: dog.personality ?? '',
    profilePhotoData: dog.profile_photo_data,
    profilePhotoName: dog.profile_photo_name,
    sex: dog.sex ?? '',
    vaccineHistoryName: dog.vaccine_history_name,
    vaccineHistoryNote: dog.vaccine_history_note ?? '',
    weight: dog.weight ?? '',
  };
}

export default function DogProfilesScreen() {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const [dogs, setDogs] = useState<DogFormValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDogs() {
      try {
        const nextDogs = await getCurrentDogs();

        if (!isMounted) {
          return;
        }

        setDogs(nextDogs.length > 0 ? nextDogs.map(mapDogToDraft) : []);
      } catch (nextError) {
        if (isMounted) {
          setError(nextError instanceof Error ? nextError.message : 'Unable to load dog profiles.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadDogs();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const startedDogs = dogs.filter(hasDogDetails);

      if (startedDogs.some(dog => !dog.name.trim())) {
        throw new Error('Every dog card you keep needs a name.');
      }

      await saveCurrentDogs(
        startedDogs.map<DogProfileInput>(dog => ({
          alteredStatus: dog.alteredStatus,
          breed: dog.breed,
          careNotes: dog.careNotes,
          dob: dog.dob,
          id: dog.id,
          name: dog.name,
          personality: dog.personality,
          profilePhotoData: dog.profilePhotoData,
          profilePhotoName: dog.profilePhotoName,
          sex: dog.sex,
          vaccineHistoryName: dog.vaccineHistoryName,
          vaccineHistoryNote: dog.vaccineHistoryNote,
          weight: dog.weight,
        }))
      );

      router.back();
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Unable to save dog profiles.';
      setError(message);
      Alert.alert('Save failed', message);
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
            <Text style={[s.title, { color: c.textPrimary }]}>Edit Dog Profiles</Text>
            <Text style={[s.subtitle, { color: c.textSecondary }]}>Update every dog on the account from one place.</Text>
          </View>

          {loading ? (
            <View style={[s.emptyCard, { backgroundColor: c.surface, borderColor: c.border }]}>
              <Text style={[s.emptyTitle, { color: c.textPrimary }]}>Loading dog profiles…</Text>
            </View>
          ) : dogs.length > 0 ? (
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
              <Text style={[s.emptyTitle, { color: c.textPrimary }]}>No dogs on the account</Text>
              <Text style={[s.emptyText, { color: c.textSecondary }]}>Add a dog below and it will appear on the profile carousel.</Text>
            </View>
          )}

          <TouchableOpacity style={[s.addBtn, { borderColor: c.border }]} onPress={addDog}>
            <Text style={s.addBtnText}>+ Add another dog</Text>
          </TouchableOpacity>

          {error ? <Text style={s.error}>{error}</Text> : null}

          <TouchableOpacity style={[s.saveBtn, saving && s.disabledBtn]} activeOpacity={0.85} onPress={() => void handleSave()} disabled={saving}>
            <Text style={s.saveBtnText}>{saving ? 'SAVING...' : 'SAVE CHANGES'}</Text>
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
  addBtnText: { color: gold[500], fontFamily: fonts.sansMedium, fontSize: 13 },
  error: { color: colors.emergencyAccent, fontFamily: fonts.sans, fontSize: 12, lineHeight: 18, marginTop: 14 },
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
