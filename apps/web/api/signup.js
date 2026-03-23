// Vercel serverless function — POST /api/signup
// Logs every submission and optionally emails the founder via Resend.
//
// Required env vars (set in Vercel dashboard or .env.local for local dev):
//   RESEND_API_KEY      — from resend.com (free tier: 3k emails/month)
//   KYNO_NOTIFY_EMAIL   — hello@kyno.pet

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function line(label, value) {
  return value ? `${label}: ${value}` : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  // Vercel auto-parses JSON bodies; fall back to manual parse just in case
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch {
      return res.status(400).json({ ok: false, message: 'Invalid JSON' });
    }
  }

  const { type, name, email, service, company, providerApplication } = body || {};
  const normalizedEmail = clean(email);
  const normalizedName = clean(name);
  const provider =
    providerApplication && typeof providerApplication === 'object'
      ? {
          firstName: clean(providerApplication.firstName),
          lastName: clean(providerApplication.lastName),
          email: clean(providerApplication.email),
          phone: clean(providerApplication.phone),
          businessName: clean(providerApplication.businessName),
          serviceCategory: clean(providerApplication.serviceCategory),
          primaryNeighborhood: clean(providerApplication.primaryNeighborhood),
          instagram: clean(providerApplication.instagram),
          website: clean(providerApplication.website),
          yearsInBusiness: clean(providerApplication.yearsInBusiness),
          aboutBusiness: clean(providerApplication.aboutBusiness),
          credentials: Array.isArray(providerApplication.credentials)
            ? providerApplication.credentials.map(clean).filter(Boolean)
            : [],
        }
      : null;
  const displayName =
    normalizedName || [provider?.firstName, provider?.lastName].filter(Boolean).join(' ');

  if (!displayName || !normalizedEmail) {
    return res.status(400).json({ ok: false, message: 'Name and email are required' });
  }

  if (type === 'provider') {
    const hasRequiredProviderFields =
      provider?.firstName &&
      provider?.lastName &&
      provider?.phone &&
      provider?.businessName &&
      provider?.serviceCategory &&
      provider?.primaryNeighborhood &&
      provider?.yearsInBusiness &&
      provider?.aboutBusiness;
    const hasOnlinePresence = provider?.instagram || provider?.website;

    if (!hasRequiredProviderFields || !hasOnlinePresence) {
      return res.status(400).json({ ok: false, message: 'Provider application is incomplete' });
    }
  }

  const typeLabel = { owner: 'Dog Owner', provider: 'Provider', partner: 'Partner' }[type] ?? type;
  const extras = [
    line('Service', clean(service)),
    line('Company', clean(company)),
    provider && line('First name', provider.firstName),
    provider && line('Last name', provider.lastName),
    provider && line('Phone', provider.phone),
    provider && line('Business name', provider.businessName),
    provider && line('Service category', provider.serviceCategory),
    provider && line('Primary neighborhood', provider.primaryNeighborhood),
    provider && line('Instagram', provider.instagram),
    provider && line('Website', provider.website),
    provider && line('Years in business', provider.yearsInBusiness),
    provider && line('About business', provider.aboutBusiness),
    provider?.credentials?.length ? `Credentials: ${provider.credentials.join(', ')}` : null,
  ].filter(Boolean).join('\n');

  // Always log — visible in Vercel function logs even without Resend
  console.log(`[kyno/signup] ${typeLabel} | ${displayName} | ${normalizedEmail}${extras ? '\n' + extras : ''}`);

  const apiKey     = process.env.RESEND_API_KEY;
  const notifyTo   = process.env.KYNO_NOTIFY_EMAIL;

  if (apiKey && notifyTo) {
    const emailBody =
      `New Kyno signup\n\n` +
      `Type:     ${typeLabel}\n` +
      `Name:     ${displayName}\n` +
      `Email:    ${normalizedEmail}\n` +
      (extras ? extras + '\n' : '');

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kyno Signups <onboarding@resend.dev>',
        to:   notifyTo,
        subject: `[Kyno] New ${typeLabel} signup — ${displayName}`,
        text: emailBody,
      }),
    }).catch(err => console.error('[kyno/signup] Resend error:', err.message));
  }

  return res.status(200).json({ ok: true });
}
