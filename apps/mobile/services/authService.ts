import type { Session } from '@supabase/supabase-js';

import { getSupabaseClient } from './supabase';
import type { Database } from '../types/database';

export type UserProfile = Database['public']['Tables']['profiles']['Row'];
export type UserDog = Database['public']['Tables']['dogs']['Row'];

export interface DogProfileInput {
  id?: string;
  alteredStatus?: string;
  breed?: string;
  careNotes?: string;
  dob?: string;
  name: string;
  personality?: string;
  profilePhotoData?: string | null;
  profilePhotoName?: string | null;
  sex?: string;
  vaccineHistoryName?: string | null;
  vaccineHistoryNote?: string | null;
  weight?: string;
}

export interface OwnerProfileInput {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface AuthBootstrapState {
  dogs: UserDog[];
  profile: UserProfile | null;
  session: Session | null;
}

export interface CreateAccountData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dogs: DogProfileInput[];
}

function formatAuthError(error: unknown) {
  if (!(error instanceof Error)) {
    return 'Something went wrong. Please try again.';
  }

  const message = error.message.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password.';
  }

  if (message.includes('email not confirmed')) {
    return 'Email confirmation is still enabled in Supabase Auth. Disable it if you want direct sign-in and use Resend only for transactional emails.';
  }

  if (message.includes('user already registered')) {
    return 'An account with this email already exists.';
  }

  if (message.includes('password should be at least')) {
    return 'Use a password with at least 8 characters.';
  }

  return error.message;
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const client = getSupabaseClient();
  const userId = await getCurrentUserId({ allowMissing: true });

  if (!userId) {
    return null;
  }

  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(formatAuthError(error));
  }

  return data;
}

export async function getCurrentDogs(): Promise<UserDog[]> {
  const client = getSupabaseClient();
  const userId = await getCurrentUserId({ allowMissing: true });

  if (!userId) {
    return [];
  }

  const { data, error } = await client
    .from('dogs')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(formatAuthError(error));
  }

  return data ?? [];
}

async function getCurrentUserId(options: { allowMissing: true }): Promise<string | null>;
async function getCurrentUserId(options?: { allowMissing?: false }): Promise<string>;
async function getCurrentUserId({ allowMissing = false }: { allowMissing?: boolean } = {}) {
  const client = getSupabaseClient();
  const {
    data: { session },
    error,
  } = await client.auth.getSession();

  if (error) {
    throw new Error(formatAuthError(error));
  }

  if (!session?.user.id) {
    if (allowMissing) {
      return null;
    }

    throw new Error('You need to be signed in to continue.');
  }

  return session.user.id;
}

export async function getAuthBootstrapState(): Promise<AuthBootstrapState> {
  const client = getSupabaseClient();
  const {
    data: { session },
    error,
  } = await client.auth.getSession();

  if (error) {
    throw new Error(formatAuthError(error));
  }

  if (!session) {
    return {
      session: null,
      profile: null,
      dogs: [],
    };
  }

  const [profile, dogs] = await Promise.all([getCurrentProfile(), getCurrentDogs()]);

  return {
    session,
    profile,
    dogs,
  };
}

export async function createAccount(data: CreateAccountData): Promise<void> {
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

    if (error) {
      throw error;
    }

    const userId = authData.session?.user.id;

    if (!userId) {
      throw new Error(
        'No active session was returned after sign-up. Make sure email confirmation is disabled in Supabase Auth.'
      );
    }

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

      if (dogInsertError) {
        throw dogInsertError;
      }
    }
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
}

export async function signIn(email: string, password: string): Promise<void> {
  try {
    const client = getSupabaseClient();
    const { error } = await client.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
}

export async function signOut(): Promise<void> {
  try {
    const client = getSupabaseClient();
    const { error } = await client.auth.signOut();

    if (error) {
      throw error;
    }
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
}

export async function updateCurrentProfile(data: OwnerProfileInput): Promise<UserProfile> {
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

    if (error) {
      throw error;
    }

    return updatedProfile;
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
}

export async function saveCurrentDogs(dogs: DogProfileInput[]): Promise<UserDog[]> {
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
      .filter((dogId): dogId is string => Boolean(dogId && existingDogIds.has(dogId)));

    const deletedDogIds = existingDogs
      .map(dog => dog.id)
      .filter(dogId => !keptExistingIds.includes(dogId));

    if (deletedDogIds.length > 0) {
      const { error } = await client
        .from('dogs')
        .delete()
        .eq('user_id', userId)
        .in('id', deletedDogIds);

      if (error) {
        throw error;
      }
    }

    for (const dog of trimmedDogs.filter(value => value.id && existingDogIds.has(value.id))) {
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
        .eq('id', dog.id as string)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }
    }

    const newDogs = trimmedDogs
      .filter(value => !value.id || !existingDogIds.has(value.id))
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

      if (error) {
        throw error;
      }
    }

    return getCurrentDogs();
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
}
