import { getSupabaseClient } from './supabase';

function formatAuthError(error) {
  if (!(error instanceof Error)) {
    return 'Something went wrong. Please try again.';
  }
  const message = error.message.toLowerCase();
  if (message.includes('invalid login credentials')) return 'Invalid email or password.';
  if (message.includes('email not confirmed')) return 'Email confirmation is still enabled in Supabase Auth. Disable it for direct sign-in.';
  if (message.includes('user already registered')) return 'An account with this email already exists.';
  if (message.includes('password should be at least')) return 'Use a password with at least 8 characters.';
  return error.message;
}

async function getCurrentUserId(allowMissing = false) {
  const client = getSupabaseClient();
  const { data: { session }, error } = await client.auth.getSession();
  if (error) throw new Error(formatAuthError(error));
  if (!session?.user.id) {
    if (allowMissing) return null;
    throw new Error('You need to be signed in to continue.');
  }
  return session.user.id;
}

export async function getCurrentProfile() {
  const client = getSupabaseClient();
  const userId = await getCurrentUserId(true);
  if (!userId) return null;
  const { data, error } = await client.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw new Error(formatAuthError(error));
  return data;
}

export async function getCurrentDogs() {
  const client = getSupabaseClient();
  const userId = await getCurrentUserId(true);
  if (!userId) return [];
  const { data, error } = await client.from('dogs').select('*').order('created_at', { ascending: true });
  if (error) throw new Error(formatAuthError(error));
  return data ?? [];
}

export async function getAuthBootstrapState() {
  const client = getSupabaseClient();
  const { data: { session }, error } = await client.auth.getSession();
  if (error) throw new Error(formatAuthError(error));
  if (!session) return { session: null, profile: null, dogs: [] };
  const [profile, dogs] = await Promise.all([getCurrentProfile(), getCurrentDogs()]);
  return { session, profile, dogs };
}

export async function createAccount(data) {
  try {
    const client = getSupabaseClient();
    const { data: authData, error } = await client.auth.signUp({
      email: data.email.trim().toLowerCase(),
      password: data.password,
      options: {
        data: {
          first_name: data.firstName.trim(),
          last_name: data.lastName.trim(),
          phone: data.phone.trim(),
        },
      },
    });
    if (error) throw error;

    const userId = authData.session?.user.id;
    if (!userId) throw new Error('No active session after sign-up. Make sure email confirmation is disabled in Supabase Auth.');

    const dogsToInsert = data.dogs
      .map(dog => ({
        altered_status: dog.alteredStatus?.trim() || null,
        breed: dog.breed?.trim() || null,
        care_notes: dog.careNotes?.trim() || null,
        dob: dog.dob?.trim() || null,
        name: dog.name.trim(),
        personality: dog.personality?.trim() || null,
        profile_photo_data: dog.profilePhotoData ?? null,
        profile_photo_name: dog.profilePhotoName ?? null,
        sex: dog.sex?.trim() || null,
        user_id: userId,
        vaccine_history_name: dog.vaccineHistoryName ?? null,
        vaccine_history_note: dog.vaccineHistoryNote?.trim() || null,
        weight: dog.weight?.trim() || null,
      }))
      .filter(dog => dog.name.length > 0);

    if (dogsToInsert.length > 0) {
      const { error: dogInsertError } = await client.from('dogs').insert(dogsToInsert);
      if (dogInsertError) throw dogInsertError;
    }
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
}

export async function signIn(email, password) {
  try {
    const client = getSupabaseClient();
    const { error } = await client.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error) throw error;
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
}

export async function signOut() {
  try {
    const client = getSupabaseClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
}

export async function updateCurrentProfile(data) {
  try {
    const client = getSupabaseClient();
    const userId = await getCurrentUserId();
    const { data: updatedProfile, error } = await client
      .from('profiles')
      .update({
        address_line1: data.addressLine1?.trim() || null,
        address_line2: data.addressLine2?.trim() || null,
        city: data.city?.trim() || null,
        emergency_contact_name: data.emergencyContactName?.trim() || null,
        emergency_contact_phone: data.emergencyContactPhone?.trim() || null,
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        phone: data.phone.trim() || null,
      })
      .eq('id', userId)
      .select('*')
      .single();
    if (error) throw error;
    return updatedProfile;
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
}

export async function saveCurrentDogs(dogs) {
  try {
    const client = getSupabaseClient();
    const userId = await getCurrentUserId();
    const existingDogs = await getCurrentDogs();
    const existingDogIds = new Set(existingDogs.map(dog => dog.id));
    const trimmedDogs = dogs
      .map(dog => ({
        altered_status: dog.alteredStatus?.trim() || null,
        breed: dog.breed?.trim() || null,
        care_notes: dog.careNotes?.trim() || null,
        dob: dog.dob?.trim() || null,
        id: dog.id,
        name: dog.name.trim(),
        personality: dog.personality?.trim() || null,
        profile_photo_data: dog.profilePhotoData ?? null,
        profile_photo_name: dog.profilePhotoName ?? null,
        sex: dog.sex?.trim() || null,
        vaccine_history_name: dog.vaccineHistoryName ?? null,
        vaccine_history_note: dog.vaccineHistoryNote?.trim() || null,
        weight: dog.weight?.trim() || null,
      }))
      .filter(dog => dog.name.length > 0);

    const keptExistingIds = trimmedDogs
      .map(dog => dog.id)
      .filter(dogId => dogId && existingDogIds.has(dogId));

    const deletedDogIds = existingDogs
      .map(dog => dog.id)
      .filter(dogId => !keptExistingIds.includes(dogId));

    if (deletedDogIds.length > 0) {
      const { error } = await client.from('dogs').delete().eq('user_id', userId).in('id', deletedDogIds);
      if (error) throw error;
    }

    for (const dog of trimmedDogs.filter(d => d.id && existingDogIds.has(d.id))) {
      const { error } = await client
        .from('dogs')
        .update({
          altered_status: dog.altered_status,
          breed: dog.breed,
          care_notes: dog.care_notes,
          dob: dog.dob,
          name: dog.name,
          personality: dog.personality,
          profile_photo_data: dog.profile_photo_data,
          profile_photo_name: dog.profile_photo_name,
          sex: dog.sex,
          vaccine_history_name: dog.vaccine_history_name,
          vaccine_history_note: dog.vaccine_history_note,
          weight: dog.weight,
        })
        .eq('id', dog.id)
        .eq('user_id', userId);
      if (error) throw error;
    }

    const newDogs = trimmedDogs
      .filter(d => !d.id || !existingDogIds.has(d.id))
      .map(dog => ({
        altered_status: dog.altered_status,
        breed: dog.breed,
        care_notes: dog.care_notes,
        dob: dog.dob,
        name: dog.name,
        personality: dog.personality,
        profile_photo_data: dog.profile_photo_data,
        profile_photo_name: dog.profile_photo_name,
        sex: dog.sex,
        user_id: userId,
        vaccine_history_name: dog.vaccine_history_name,
        vaccine_history_note: dog.vaccine_history_note,
        weight: dog.weight,
      }));

    if (newDogs.length > 0) {
      const { error } = await client.from('dogs').insert(newDogs);
      if (error) throw error;
    }

    return getCurrentDogs();
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
}
