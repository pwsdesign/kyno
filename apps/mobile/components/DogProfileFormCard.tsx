import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { colors, fonts, getColors, gold, sage, stone, warm } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import type { DogProfileInput } from '../services/authService';

export interface DogFormValue extends DogProfileInput {
  id: string;
}

interface DogProfileFormCardProps {
  dog: DogFormValue;
  index: number;
  totalDogs: number;
  onChange: (patch: Partial<DogFormValue>) => void;
  onPickProfilePhoto: () => void;
  onPickVaccineHistory: () => void;
  onRemove?: () => void;
}

export function createDraftDog(): DogFormValue {
  return {
    alteredStatus: '',
    breed: '',
    careNotes: '',
    dob: '',
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: '',
    personality: '',
    profilePhotoData: null,
    profilePhotoName: null,
    sex: '',
    vaccineHistoryName: null,
    vaccineHistoryNote: '',
    weight: '',
  };
}

export function hasDogDetails(dog: DogFormValue) {
  return [
    dog.name,
    dog.dob,
    dog.breed,
    dog.weight,
    dog.personality,
    dog.sex,
    dog.alteredStatus,
    dog.careNotes,
    dog.vaccineHistoryName,
    dog.profilePhotoName,
  ].some(value => (value ?? '').toString().trim().length > 0);
}

export function getAlteredStatusOptions(sex?: string | null) {
  switch ((sex ?? '').toLowerCase()) {
    case 'male':
      return ['Neutered', 'Intact', 'Not sure'];
    case 'female':
      return ['Spayed', 'Intact', 'Not sure'];
    default:
      return ['Altered', 'Intact', 'Not sure'];
  }
}

const sexOptions = ['Male', 'Female'] as const;

export function DogProfileFormCard({
  dog,
  index,
  totalDogs,
  onChange,
  onPickProfilePhoto,
  onPickVaccineHistory,
  onRemove,
}: DogProfileFormCardProps) {
  const { isDark } = useTheme();
  const c = getColors(isDark);
  const alteredStatusOptions = getAlteredStatusOptions(dog.sex);

  return (
    <View style={[s.dogCard, { backgroundColor: c.surface, borderColor: c.border }]}>
      <View style={s.cardHeader}>
        <View>
          <Text style={[s.cardLabel, { color: c.textSecondary }]}>DOG {index + 1}</Text>
          <Text style={[s.cardTitle, { color: c.textPrimary }]}>{dog.name.trim() || `Dog ${index + 1}`}</Text>
        </View>
        {totalDogs > 1 && onRemove ? (
          <TouchableOpacity style={[s.removeBtn, { backgroundColor: isDark ? stone[700] : warm[100] }]} onPress={onRemove}>
            <Text style={[s.removeText, { color: c.textSecondary }]}>Remove</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={s.photoSection}>
        <View style={s.photoWrap}>
          {dog.profilePhotoData ? (
            <Image source={{ uri: dog.profilePhotoData }} style={s.photoPreview} />
          ) : (
            <View style={s.photoPlaceholder}>
              <Text style={s.photoInitial}>{dog.name.trim().charAt(0).toUpperCase() || '?'}</Text>
            </View>
          )}
        </View>
        <View style={s.photoCopy}>
          <Text style={[s.fieldLabel, { color: c.textSecondary }]}>PROFILE PHOTO</Text>
          <Text style={[s.helperText, { color: c.textSecondary }]}>A square headshot helps walkers, groomers, and vets know they have the right dog.</Text>
          <TouchableOpacity style={[s.uploadBtn, { backgroundColor: isDark ? warm[100] : colors.dark }]} onPress={onPickProfilePhoto}>
            <Text style={[s.uploadBtnText, { color: isDark ? colors.dark : '#FFFFFF' }]}>{dog.profilePhotoName ? 'REPLACE PHOTO' : 'UPLOAD PHOTO'}</Text>
          </TouchableOpacity>
          {dog.profilePhotoName ? <Text style={[s.selectedFile, { color: c.textSecondary }]}>{dog.profilePhotoName}</Text> : null}
        </View>
      </View>

      <Text style={[s.fieldLabel, { color: c.textSecondary }]}>DOG NAME</Text>
      <TextInput
        style={[s.input, { backgroundColor: c.surfaceRaised, borderColor: c.border, color: c.textPrimary }]}
        value={dog.name}
        onChangeText={value => onChange({ name: value })}
        placeholder="Skye"
        placeholderTextColor={c.textTertiary}
        autoCapitalize="words"
      />

      <View style={s.row}>
        <View style={s.half}>
          <Text style={[s.fieldLabel, { color: c.textSecondary }]}>DATE OF BIRTH</Text>
          <TextInput
            style={[s.input, { backgroundColor: c.surfaceRaised, borderColor: c.border, color: c.textPrimary }]}
            value={dog.dob}
            onChangeText={value => onChange({ dob: value })}
            placeholder="05/14/2022"
            placeholderTextColor={c.textTertiary}
          />
        </View>
        <View style={s.half}>
          <Text style={[s.fieldLabel, { color: c.textSecondary }]}>BREED</Text>
          <TextInput
            style={[s.input, { backgroundColor: c.surfaceRaised, borderColor: c.border, color: c.textPrimary }]}
            value={dog.breed}
            onChangeText={value => onChange({ breed: value })}
            placeholder="Golden Retriever"
            placeholderTextColor={c.textTertiary}
          />
        </View>
      </View>

      <View style={s.row}>
        <View style={s.half}>
          <Text style={[s.fieldLabel, { color: c.textSecondary }]}>WEIGHT</Text>
          <TextInput
            style={[s.input, { backgroundColor: c.surfaceRaised, borderColor: c.border, color: c.textPrimary }]}
            value={dog.weight}
            onChangeText={value => onChange({ weight: value })}
            placeholder="68 lb"
            placeholderTextColor={c.textTertiary}
          />
        </View>
        <View style={s.half}>
          <Text style={[s.fieldLabel, { color: c.textSecondary }]}>PERSONALITY</Text>
          <TextInput
            style={[s.input, { backgroundColor: c.surfaceRaised, borderColor: c.border, color: c.textPrimary }]}
            value={dog.personality}
            onChangeText={value => onChange({ personality: value })}
            placeholder="Friendly, social, food-motivated"
            placeholderTextColor={c.textTertiary}
          />
        </View>
      </View>

      <Text style={[s.fieldLabel, { color: c.textSecondary }]}>SEX</Text>
      <View style={s.choiceRow}>
        {sexOptions.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              s.choicePill,
              { backgroundColor: isDark ? stone[700] : warm[50], borderColor: c.border },
              dog.sex === option && s.choicePillActive,
            ]}
            onPress={() =>
              onChange({
                sex: option,
                alteredStatus: getAlteredStatusOptions(option).includes(dog.alteredStatus ?? '') ? dog.alteredStatus : '',
              })
            }
          >
            <Text style={[s.choiceText, { color: c.textSecondary }, dog.sex === option && s.choiceTextActive]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[s.fieldLabel, { color: c.textSecondary }]}>{dog.sex === 'Female' ? 'SPAY STATUS' : dog.sex === 'Male' ? 'NEUTER STATUS' : 'ALTERED STATUS'}</Text>
      <View style={s.choiceRow}>
        {alteredStatusOptions.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              s.choicePill,
              { backgroundColor: isDark ? stone[700] : warm[50], borderColor: c.border },
              dog.alteredStatus === option && s.choicePillActive,
            ]}
            onPress={() => onChange({ alteredStatus: option })}
          >
            <Text style={[s.choiceText, { color: c.textSecondary }, dog.alteredStatus === option && s.choiceTextActive]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[s.fieldLabel, { color: c.textSecondary }]}>CARE NOTES</Text>
      <TextInput
        style={[s.input, s.textArea, { backgroundColor: c.surfaceRaised, borderColor: c.border, color: c.textPrimary }]}
        value={dog.careNotes}
        onChangeText={value => onChange({ careNotes: value })}
        placeholder="Allergies, meds, triggers, dietary rules, or anything a provider should not learn the hard way."
        placeholderTextColor={c.textTertiary}
        multiline
        textAlignVertical="top"
      />

      <Text style={[s.fieldLabel, { color: c.textSecondary }]}>VACCINE HISTORY</Text>
      <TouchableOpacity style={[s.uploadPanel, { backgroundColor: isDark ? 'rgba(247,241,230,0.06)' : '#F9F5EE', borderColor: isDark ? 'rgba(212,168,58,0.16)' : 'rgba(212,168,58,0.2)' }]} onPress={onPickVaccineHistory}>
        <Text style={[s.uploadPanelTitle, { color: c.textPrimary }]}>{dog.vaccineHistoryName ? 'Replace vaccine file' : 'Upload vaccine history'}</Text>
        <Text style={[s.uploadPanelText, { color: c.textSecondary }]}>
          {dog.vaccineHistoryName
            ? dog.vaccineHistoryName
            : 'PDF or image. Rabies, DHPP, Bordetella, whatever your vet handed you.'}
        </Text>
      </TouchableOpacity>
      <Text style={[s.vaccineNote, { color: isDark ? stone[400] : stone[600] }]}>
        Upload it once and we will keep it on file, so you never have to exhume the same vaccine paperwork for every new service.
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  dogCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 18,
    padding: 18,
  },
  cardHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  cardLabel: { color: colors.textSecondary, fontFamily: fonts.sansMedium, fontSize: 9, letterSpacing: 1.8, marginBottom: 4 },
  cardTitle: { color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 24 },
  removeBtn: {
    alignItems: 'center',
    backgroundColor: warm[100],
    borderRadius: 999,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  removeText: { color: colors.textSecondary, fontFamily: fonts.sansMedium, fontSize: 11, letterSpacing: 1 },
  photoSection: { alignItems: 'center', flexDirection: 'row', gap: 16, marginBottom: 8 },
  photoWrap: { alignItems: 'center', justifyContent: 'center' },
  photoPlaceholder: {
    alignItems: 'center',
    backgroundColor: stone[700],
    borderColor: 'rgba(115, 84, 4, 0.25)',
    borderRadius: 22,
    borderWidth: 2,
    height: 84,
    justifyContent: 'center',
    width: 84,
  },
  photoPreview: { borderRadius: 22, height: 84, width: 84 },
  photoInitial: { color: gold[300], fontFamily: fonts.serifMedium, fontSize: 34 },
  photoCopy: { flex: 1 },
  fieldLabel: { color: colors.textSecondary, fontFamily: fonts.sansMedium, fontSize: 9, letterSpacing: 1.5, marginBottom: 6, marginTop: 14 },
  helperText: { color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, lineHeight: 17, marginBottom: 10 },
  input: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.textPrimary,
    fontFamily: fonts.sans,
    fontSize: 15,
    padding: 14,
  },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choicePill: {
    backgroundColor: warm[50],
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  choicePillActive: { backgroundColor: sage[700], borderColor: sage[700] },
  choiceText: { color: colors.textSecondary, fontFamily: fonts.sansMedium, fontSize: 12 },
  choiceTextActive: { color: '#FFFFFF' },
  textArea: { minHeight: 98 },
  uploadBtn: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.dark,
    borderRadius: 999,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  uploadBtnText: { fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 1.2 },
  selectedFile: { color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: 8 },
  uploadPanel: {
    backgroundColor: '#F9F5EE',
    borderColor: 'rgba(212,168,58,0.2)',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  uploadPanelTitle: { color: colors.textPrimary, fontFamily: fonts.sansMedium, fontSize: 13, marginBottom: 4 },
  uploadPanelText: { color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, lineHeight: 17 },
  vaccineNote: { color: stone[600], fontFamily: fonts.sans, fontSize: 11, lineHeight: 16, marginTop: 8 },
});
