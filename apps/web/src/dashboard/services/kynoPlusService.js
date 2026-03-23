import { getSupabaseClient } from './supabase';

export const KYNO_PLUS_PLAN = 'kyno_plus';
export const COMMUNITY_MESSAGE_MAX_LENGTH = 280;
export const UPGRADE_REQUEST_NOTE_MAX_LENGTH = 240;

function formatSupabaseError(error) {
  if (!(error instanceof Error)) return 'Something went wrong. Please try again.';
  if (error.message.toLowerCase().includes('membership_upgrade_requests_one_pending_idx')) {
    return 'You already have a pending KYNO+ request.';
  }
  return error.message;
}

async function getCurrentUserId() {
  const client = getSupabaseClient();
  const {
    data: { session },
    error,
  } = await client.auth.getSession();

  if (error) throw new Error(formatSupabaseError(error));
  if (!session?.user?.id) throw new Error('You need to be signed in to continue.');
  return session.user.id;
}

export function isKynoPlusPlan(profile) {
  return profile?.membership_plan === KYNO_PLUS_PLAN;
}

export function getMembershipPlanLabel(profile) {
  return isKynoPlusPlan(profile) ? 'KYNO+' : 'Free';
}

export function getUpgradeRequestStatusLabel(request) {
  if (!request?.status) return 'No request yet';
  if (request.status === 'pending') return 'Request pending';
  if (request.status === 'approved') return 'Approved';
  if (request.status === 'declined') return 'Declined';
  return request.status;
}

export async function getLatestUpgradeRequest() {
  const client = getSupabaseClient();
  const userId = await getCurrentUserId();
  const { data, error } = await client
    .from('membership_upgrade_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(formatSupabaseError(error));
  return data;
}

export async function submitUpgradeRequest(note) {
  const client = getSupabaseClient();
  const userId = await getCurrentUserId();
  const trimmedNote = note?.trim() || null;
  const { data, error } = await client
    .from('membership_upgrade_requests')
    .insert({
      note: trimmedNote,
      requested_plan: KYNO_PLUS_PLAN,
      status: 'pending',
      user_id: userId,
    })
    .select('*')
    .single();

  if (error) throw new Error(formatSupabaseError(error));
  return data;
}

export async function listCommunityMessages(limit = 50) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('community_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(formatSupabaseError(error));
  return [...(data ?? [])].reverse();
}

export async function sendCommunityMessage(body) {
  const client = getSupabaseClient();
  const userId = await getCurrentUserId();
  const trimmedBody = body.trim();
  const { data, error } = await client
    .from('community_messages')
    .insert({
      body: trimmedBody,
      user_id: userId,
    })
    .select('*')
    .single();

  if (error) throw new Error(formatSupabaseError(error));
  return data;
}

export function subscribeToCommunityMessages(onInsert) {
  const client = getSupabaseClient();
  const channel = client
    .channel(`community_messages:${Math.random().toString(36).slice(2)}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'community_messages' },
      (payload) => onInsert(payload.new)
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}
