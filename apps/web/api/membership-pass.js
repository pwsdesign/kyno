import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';

import { Template, constants } from '@destinationstransfers/passkit';
import { createClient } from '@supabase/supabase-js';

const iconPath = new URL('../../mobile/assets/icon.png', import.meta.url);

function getServerSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function readMultilineEnv(name) {
  const value = process.env[name];
  return value ? value.replace(/\\n/g, '\n') : undefined;
}

function getBaseUrl(req) {
  const explicitBaseUrl = process.env.KYNO_PUBLIC_WEB_URL;

  if (explicitBaseUrl) {
    return explicitBaseUrl.replace(/\/$/, '');
  }

  const forwardedProto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;

  if (host) {
    return `${forwardedProto}://${host}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  throw new Error('Unable to determine the public web URL.');
}

function getBearerToken(req) {
  const authorization = req.headers.authorization || req.headers.Authorization;

  if (!authorization || typeof authorization !== 'string') {
    return null;
  }

  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

async function getUserFromAccessToken(accessToken) {
  const supabase = getServerSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    throw new Error('Unable to verify the current user.');
  }

  return { supabase, user };
}

function buildWalletPassUrl(req, walletPassToken) {
  return `${getBaseUrl(req)}/api/membership-pass?token=${walletPassToken}`;
}

async function ensureWalletPassRegistration(req, res) {
  try {
    const accessToken = getBearerToken(req);

    if (!accessToken) {
      return res.status(401).json({ ok: false, message: 'Missing bearer token.' });
    }

    const { supabase, user } = await getUserFromAccessToken(accessToken);
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('Unable to load the member profile.');
    }

    const walletPassToken = profile.wallet_pass_token || crypto.randomBytes(24).toString('hex');
    const walletPassUrl = buildWalletPassUrl(req, walletPassToken);

    const {
      data: updatedProfile,
      error: updateError,
    } = await supabase
      .from('profiles')
      .update({
        wallet_pass_token: walletPassToken,
        wallet_pass_url: walletPassUrl,
      })
      .eq('id', user.id)
      .select('*')
      .single();

    if (updateError || !updatedProfile) {
      throw new Error('Unable to save the Wallet pass URL on the profile.');
    }

    return res.status(200).json({
      ok: true,
      membershipId: updatedProfile.membership_id,
      walletPassUrl: updatedProfile.wallet_pass_url,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : 'Unable to register the Wallet pass.',
    });
  }
}

async function generateMembershipPass(req, res) {
  try {
    const token = typeof req.query.token === 'string' ? req.query.token : null;

    if (!token) {
      return res.status(400).json({ ok: false, message: 'Missing pass token.' });
    }

    const supabase = getServerSupabase();
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_pass_token', token)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ ok: false, message: 'Pass not found.' });
    }

    const { data: dogs, error: dogsError } = await supabase
      .from('dogs')
      .select('name,breed')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: true })
      .limit(2);

    if (dogsError) {
      throw new Error('Unable to load the dog profiles for this pass.');
    }

    const passTypeIdentifier = process.env.APPLE_WALLET_PASS_TYPE_IDENTIFIER;
    const teamIdentifier = process.env.APPLE_WALLET_TEAM_IDENTIFIER;
    const certificate = readMultilineEnv('APPLE_WALLET_PASS_CERT_PEM');
    const privateKey = readMultilineEnv('APPLE_WALLET_PASS_KEY_PEM');
    const privateKeyPassword = process.env.APPLE_WALLET_PASS_KEY_PASSWORD;

    if (!passTypeIdentifier || !teamIdentifier || !certificate || !privateKey) {
      return res.status(503).json({
        ok: false,
        message: 'Apple Wallet signing is not configured yet.',
      });
    }

    const iconBuffer = await readFile(iconPath);
    const template = new Template('generic', {
      backgroundColor: 'rgb(28,26,23)',
      description: 'Kyno Membership Card',
      foregroundColor: 'rgb(247,241,230)',
      labelColor: 'rgb(212,168,58)',
      logoText: 'KYNO',
      organizationName: 'Kyno',
      passTypeIdentifier,
      sharingProhibited: true,
      teamIdentifier,
    });

    template.setCertificate(certificate);
    template.setPrivateKey(privateKey, privateKeyPassword || undefined);

    await template.images.add('icon', iconBuffer);
    await template.images.add('icon', iconBuffer, '2x');
    await template.images.add('logo', iconBuffer);
    await template.images.add('logo', iconBuffer, '2x');

    const displayName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Kyno Member';
    const primaryDog = dogs?.[0];

    const pass = template.createPass({
      description: 'Kyno Membership Card',
      organizationName: 'Kyno',
      serialNumber: profile.membership_id || profile.id,
    });

    pass.barcodes = [
      {
        altText: profile.membership_id || profile.id,
        format: constants.barcodeFormat.QR,
        message: profile.membership_id || profile.id,
        messageEncoding: 'iso-8859-1',
      },
    ];

    pass.primaryFields.add({
      key: 'member_name',
      label: 'MEMBER',
      value: displayName,
    });
    pass.secondaryFields.add({
      key: 'membership_id',
      label: 'MEMBERSHIP ID',
      value: profile.membership_id || 'Pending',
    });
    pass.auxiliaryFields.setDateTime('member_since', 'SINCE', new Date(profile.created_at), {
      dateStyle: constants.dateTimeFormat.MEDIUM,
      timeStyle: constants.dateTimeFormat.NONE,
    });

    if (primaryDog?.name) {
      pass.backFields.add({
        key: 'dog_name',
        label: 'PRIMARY DOG',
        value: primaryDog.breed ? `${primaryDog.name} · ${primaryDog.breed}` : primaryDog.name,
      });
    }

    if (profile.phone) {
      pass.backFields.add({
        key: 'owner_phone',
        label: 'OWNER PHONE',
        value: profile.phone,
      });
    }

    if (profile.email) {
      pass.backFields.add({
        key: 'owner_email',
        label: 'OWNER EMAIL',
        value: profile.email,
      });
    }

    const buffer = await pass.asBuffer();

    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition', `attachment; filename="${profile.membership_id || 'kyno-member'}.pkpass"`);
    res.setHeader('Cache-Control', 'private, no-store');

    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : 'Unable to generate the Wallet pass.',
    });
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return ensureWalletPassRegistration(req, res);
  }

  if (req.method === 'GET') {
    return generateMembershipPass(req, res);
  }

  return res.status(405).json({ ok: false, message: 'Method not allowed.' });
}
