// Vercel serverless function — POST /api/signup
// Logs every submission and optionally emails the founder via Resend.
//
// Required env vars (set in Vercel dashboard or .env.local for local dev):
//   RESEND_API_KEY      — from resend.com (free tier: 3k emails/month)
//   KYNO_NOTIFY_EMAIL   — hello@kyno.pet

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

  const { type, name, email, service, company } = body || {};

  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ ok: false, message: 'Name and email are required' });
  }

  const typeLabel = { owner: 'Dog Owner', provider: 'Provider', partner: 'Partner' }[type] ?? type;
  const extras = [
    service  && `Service:  ${service}`,
    company  && `Company:  ${company}`,
  ].filter(Boolean).join('\n');

  // Always log — visible in Vercel function logs even without Resend
  console.log(`[kyno/signup] ${typeLabel} | ${name} | ${email}${extras ? '\n' + extras : ''}`);

  const apiKey     = process.env.RESEND_API_KEY;
  const notifyTo   = process.env.KYNO_NOTIFY_EMAIL;

  if (apiKey && notifyTo) {
    const emailBody =
      `New Kyno signup\n\n` +
      `Type:     ${typeLabel}\n` +
      `Name:     ${name}\n` +
      `Email:    ${email}\n` +
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
        subject: `[Kyno] New ${typeLabel} signup — ${name}`,
        text: emailBody,
      }),
    }).catch(err => console.error('[kyno/signup] Resend error:', err.message));
  }

  return res.status(200).json({ ok: true });
}
