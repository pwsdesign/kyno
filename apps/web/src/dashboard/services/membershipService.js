import { getSupabaseClient } from './supabase';

export async function ensureWalletPassUrl() {
  const client = getSupabaseClient();
  const { data: { session }, error } = await client.auth.getSession();
  if (error) throw error;
  if (!session?.access_token) throw new Error('You need to be signed in to register a Wallet pass.');

  const baseUrl = window.location.origin;
  const response = await fetch(`${baseUrl}/api/membership-pass`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || 'Unable to register the Wallet pass.');
  return payload;
}
