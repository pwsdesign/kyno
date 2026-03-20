import { getSupabaseClient } from './supabase';
import type { Database } from '../types/database';

export type BookingRecord = Database['public']['Tables']['bookings']['Row'];

export interface CreateBookingInput {
  dogId?: string | null;
  notes?: string;
  priceLabel?: string | null;
  providerCategory?: string | null;
  providerName: string;
  scheduledFor: string;
  serviceId: string;
}

export interface ListBookingsOptions {
  limit?: number;
  upcomingOnly?: boolean;
}

function formatBookingError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to save your booking right now.';
}

async function requireUserId() {
  const client = getSupabaseClient();
  const {
    data: { session },
    error,
  } = await client.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (!session?.user.id) {
    throw new Error('Sign in to manage bookings.');
  }

  return session.user.id;
}

export async function createBooking(input: CreateBookingInput): Promise<BookingRecord> {
  try {
    const client = getSupabaseClient();
    const userId = await requireUserId();
    const { data, error } = await client
      .from('bookings')
      .insert({
        user_id: userId,
        dog_id: input.dogId ?? null,
        notes: input.notes?.trim() || null,
        price_label: input.priceLabel ?? null,
        provider_category: input.providerCategory ?? null,
        provider_name: input.providerName,
        scheduled_for: input.scheduledFor,
        service_id: input.serviceId,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    throw new Error(formatBookingError(error));
  }
}

export async function listBookings(options: ListBookingsOptions = {}): Promise<BookingRecord[]> {
  try {
    const client = getSupabaseClient();
    await requireUserId();

    let query = client
      .from('bookings')
      .select('*')
      .order('scheduled_for', { ascending: options.upcomingOnly ?? false });

    if (options.upcomingOnly) {
      query = query.gte('scheduled_for', new Date().toISOString());
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data ?? [];
  } catch (error) {
    throw new Error(formatBookingError(error));
  }
}
