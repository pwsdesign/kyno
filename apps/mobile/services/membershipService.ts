import { getSupabaseClient } from './supabase';

const webUrl = process.env.EXPO_PUBLIC_WEB_URL;

function getWebUrl() {
  if (!webUrl) {
    throw new Error('Missing EXPO_PUBLIC_WEB_URL in apps/mobile/.env.local.');
  }

  return webUrl.replace(/\/$/, '');
}

export async function ensureWalletPassUrl() {
  const client = getSupabaseClient();
  const {
    data: { session },
    error,
  } = await client.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.access_token) {
    throw new Error('You need to be signed in to register a Wallet pass.');
  }

  const response = await fetch(`${getWebUrl()}/api/membership-pass`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || 'Unable to register the Wallet pass.');
  }

  return payload as {
    membershipId: string | null;
    ok: true;
    walletPassUrl: string | null;
  };
}
