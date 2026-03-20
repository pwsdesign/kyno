import { useState } from 'react';
import { colors } from '../styles/tokens';
import { darkCardSurfaceStyle, darkShellSurfaceStyle } from './surfaces';
import { t } from './translations';

// ── Shared helpers ────────────────────────────────────────────────────────────

function inputStyle(dark) {
  return {
    background: dark ? 'rgba(232,223,212,0.08)' : 'white',
    border: `1px solid ${dark ? 'rgba(196,164,107,0.25)' : colors.clay}`,
    borderRadius: 10,
    padding: '13px 18px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: dark ? colors.sandLight : colors.charcoal,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };
}

function SuccessMsg({ text, dark }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0' }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        background: colors.brass, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 11, color: colors.espresso, flexShrink: 0,
      }}>✓</div>
      <span style={{ fontSize: 13, color: dark ? colors.oliveLight : colors.olive, fontWeight: 300 }}>
        {text}
      </span>
    </div>
  );
}

async function postSignup(payload) {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Submission failed');
}

function btnStyle(submitting) {
  return {
    background: colors.brass,
    color: colors.espresso,
    border: 'none',
    borderRadius: 10,
    padding: '14px',
    width: '100%',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 2,
    textTransform: 'uppercase',
    cursor: submitting ? 'default' : 'pointer',
    opacity: submitting ? 0.7 : 1,
    transition: 'background 0.15s, opacity 0.15s',
  };
}

function ErrorMsg({ text }) {
  return (
    <div style={{ fontSize: 11, color: colors.emergencyAccent, marginTop: 2 }}>{text}</div>
  );
}

// ── Owner Form (hero + owners sections) ──────────────────────────────────────

function OwnerForm({ dark, lang }) {
  const tx = t[lang].form;
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  if (status === 'success') return <SuccessMsg text={tx.success} dark={dark} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus('submitting');
    try {
      await postSignup({ type: 'owner', name: name.trim(), email: email.trim() });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <input
        type="text"
        placeholder={tx.namePlaceholder}
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={inputStyle(dark)}
      />
      <input
        type="email"
        placeholder={tx.placeholder}
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={inputStyle(dark)}
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={btnStyle(status === 'submitting')}
        onMouseEnter={e => { if (status !== 'submitting') e.currentTarget.style.background = colors.brassLight; }}
        onMouseLeave={e => { e.currentTarget.style.background = colors.brass; }}
      >
        {status === 'submitting' ? tx.submitting : tx.button}
      </button>
      {status === 'error' && <ErrorMsg text={tx.error} />}
    </form>
  );
}

// ── Provider Form ─────────────────────────────────────────────────────────────

function ProviderForm({ dark, lang }) {
  const tx = t[lang].form;
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [service, setService] = useState('');
  const [status, setStatus]   = useState('idle');

  if (status === 'success') return <SuccessMsg text={tx.providerSuccess} dark={dark} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus('submitting');
    try {
      await postSignup({ type: 'provider', name: name.trim(), email: email.trim(), service });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <input
        type="text"
        placeholder={tx.namePlaceholder}
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={inputStyle(dark)}
      />
      <input
        type="email"
        placeholder={tx.placeholder}
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={inputStyle(dark)}
      />
      <select
        value={service}
        onChange={e => setService(e.target.value)}
        style={{ ...inputStyle(dark), appearance: 'none', cursor: 'pointer' }}
      >
        <option value="">{tx.serviceLabel}</option>
        {tx.serviceOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={btnStyle(status === 'submitting')}
        onMouseEnter={e => { if (status !== 'submitting') e.currentTarget.style.background = colors.brassLight; }}
        onMouseLeave={e => { e.currentTarget.style.background = colors.brass; }}
      >
        {status === 'submitting' ? tx.submitting : tx.providerButton}
      </button>
      {status === 'error' && <ErrorMsg text={tx.error} />}
    </form>
  );
}

// ── Partner Form ──────────────────────────────────────────────────────────────

function PartnerForm({ dark, lang }) {
  const tx = t[lang].form;
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus]   = useState('idle');

  if (status === 'success') return <SuccessMsg text={tx.partnerSuccess} dark={dark} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus('submitting');
    try {
      await postSignup({ type: 'partner', name: name.trim(), email: email.trim(), company: company.trim() });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <input
        type="text"
        placeholder={tx.namePlaceholder}
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={inputStyle(dark)}
      />
      <input
        type="email"
        placeholder={tx.placeholder}
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={inputStyle(dark)}
      />
      <input
        type="text"
        placeholder={tx.companyPlaceholder}
        value={company}
        onChange={e => setCompany(e.target.value)}
        style={inputStyle(dark)}
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={btnStyle(status === 'submitting')}
        onMouseEnter={e => { if (status !== 'submitting') e.currentTarget.style.background = colors.brassLight; }}
        onMouseLeave={e => { e.currentTarget.style.background = colors.brass; }}
      >
        {status === 'submitting' ? tx.submitting : tx.partnerButton}
      </button>
      {status === 'error' && <ErrorMsg text={tx.error} />}
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WebLanding({ lang, isDark }) {
  const tx = t[lang];
  const pageSurface = isDark ? darkShellSurfaceStyle : { background: colors.sand };
  const cardSurface = isDark ? darkCardSurfaceStyle : { background: colors.clayDark };
  const bodyText = isDark ? colors.oliveLight : colors.olive;
  const headingColor = isDark ? colors.sandLight : colors.charcoal;

  return (
    <div>

      {/* ── HERO ──────────────────────────────── */}
      <section className="lp-hero" style={{
        ...(isDark ? darkShellSurfaceStyle : { background: colors.espresso }),
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: isDark
            ? 'linear-gradient(180deg, rgba(28,26,23,0.06) 0%, rgba(28,26,23,0.18) 100%)'
            : `
              radial-gradient(ellipse at 70% 20%, rgba(196,164,107,0.18) 0%, transparent 55%),
              radial-gradient(ellipse at 25% 80%, rgba(20,12,6,0.85) 0%, transparent 50%)
            `,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, width: '100%' }}>
          <div className="lp-hero-wordmark" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            color: colors.sandLight,
            lineHeight: 1,
            marginBottom: 24,
          }}>Kyno</div>

          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: 3.5,
            textTransform: 'uppercase',
            color: colors.brass,
            fontWeight: 400,
            marginBottom: 32,
          }}>{tx.hero.tagline}</div>

          <div className="lp-hero-sub" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            color: 'rgba(240,233,224,0.65)',
            lineHeight: 1.5,
            marginBottom: 52,
          }}>
            {tx.hero.headline1}<br />{tx.hero.headline2}
          </div>

          <OwnerForm dark lang={lang} />

          <div style={{
            marginTop: 20, fontSize: 10,
            color: 'rgba(122,127,109,0.55)', letterSpacing: 0.5,
          }}>{tx.hero.noSpam}</div>
        </div>

        <div style={{
          position: 'absolute', bottom: 36,
          fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase',
          color: 'rgba(196,164,107,0.3)', zIndex: 1,
        }}>{tx.hero.learnMore}</div>
      </section>

      {/* ── FOR DOG OWNERS ────────────────────── */}
      <section id="owners" className="lp-section" style={{ ...pageSurface }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="lp-grid">

            <div>
              <div style={{
                fontSize: 9, letterSpacing: 3, textTransform: 'uppercase',
                color: colors.brass, fontWeight: 500, marginBottom: 16,
              }}>{tx.owners.label}</div>

              <div className="lp-section-heading" style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400, color: headingColor,
                lineHeight: 1.1, marginBottom: 20,
              }}>{tx.owners.title}</div>

              <div style={{
                fontSize: 14, color: bodyText, fontWeight: 300,
                lineHeight: 1.8, marginBottom: 40,
              }}>
                {tx.owners.body}
              </div>

              <OwnerForm dark={isDark} lang={lang} />
            </div>

            {/* Service cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {tx.services.map((s, i) => (
                <div key={s.name} style={{
                  ...cardSurface,
                  border: isDark ? '1px solid rgba(196,164,107,0.12)' : 'none',
                  borderRadius: 16,
                  padding: '22px 20px',
                }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 13, color: colors.brass, fontWeight: 400,
                    letterSpacing: 1, marginBottom: 14,
                  }}>0{i + 1}</div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 18, fontWeight: 500, color: headingColor, marginBottom: 4,
                  }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: bodyText, fontWeight: 300 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR PROVIDERS ─────────────────────── */}
      <section id="providers" className="lp-section" style={isDark ? { ...darkShellSurfaceStyle } : { background: colors.charcoal }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="lp-grid">

            {/* Benefit cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tx.providers.benefits.map((b, i) => (
                <div key={b.title} style={{
                  ...(isDark ? darkCardSurfaceStyle : { background: 'rgba(232,223,212,0.05)' }),
                  border: `1px solid ${isDark ? 'rgba(196,164,107,0.12)' : 'rgba(196,164,107,0.1)'}`,
                  borderRadius: 16,
                  padding: '22px 24px',
                  display: 'flex',
                  gap: 20,
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 24, color: colors.brass, fontWeight: 400,
                    lineHeight: 1, flexShrink: 0, marginTop: 2,
                  }}>0{i + 1}</div>
                  <div>
                    <div style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 18, color: colors.sandLight, fontWeight: 400, marginBottom: 6,
                    }}>{b.title}</div>
                    <div style={{ fontSize: 12, color: colors.oliveLight, fontWeight: 300, lineHeight: 1.7 }}>
                      {b.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div style={{
                fontSize: 9, letterSpacing: 3, textTransform: 'uppercase',
                color: colors.brass, fontWeight: 500, marginBottom: 16,
              }}>{tx.providers.label}</div>

              <div className="lp-section-heading" style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400, color: colors.sandLight,
                lineHeight: 1.1, marginBottom: 20,
              }}>{tx.providers.title}</div>

              <div style={{
                fontSize: 14, color: colors.oliveLight, fontWeight: 300,
                lineHeight: 1.8, marginBottom: 40,
              }}>
                {tx.providers.body}
              </div>

              <ProviderForm dark lang={lang} />

              <div style={{ marginTop: 16, fontSize: 11, color: 'rgba(122,127,109,0.45)', lineHeight: 1.6 }}>
                {tx.providers.footer}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR PARTNERS ──────────────────────── */}
      <section id="partners" className="lp-section" style={{ ...pageSurface }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="lp-grid">

            <div>
              <div style={{
                fontSize: 9, letterSpacing: 3, textTransform: 'uppercase',
                color: colors.brass, fontWeight: 500, marginBottom: 16,
              }}>{tx.partners.label}</div>

              <div className="lp-section-heading" style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400, color: headingColor,
                lineHeight: 1.1, marginBottom: 20,
              }}>{tx.partners.title}</div>

              <div style={{
                fontSize: 14, color: bodyText, fontWeight: 300,
                lineHeight: 1.8, marginBottom: 40,
              }}>
                {tx.partners.body}
              </div>

              <PartnerForm dark={isDark} lang={lang} />

              <div style={{ marginTop: 16, fontSize: 11, color: bodyText, lineHeight: 1.6 }}>
                {tx.partners.footer}
              </div>
            </div>

            {/* Partnership type cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {tx.partners.types.map(p => (
                <div key={p.title} style={{
                  ...cardSurface,
                  border: isDark ? '1px solid rgba(196,164,107,0.12)' : 'none',
                  borderRadius: 16,
                  padding: '24px 20px',
                }}>
                  <div style={{
                    width: 24, height: 2,
                    background: colors.brass,
                    borderRadius: 2,
                    marginBottom: 16,
                  }} />
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 16, fontWeight: 500, color: headingColor, marginBottom: 8,
                  }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: bodyText, fontWeight: 300, lineHeight: 1.6 }}>
                    {p.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────── */}
      <footer style={{
        ...(isDark ? darkShellSurfaceStyle : { background: colors.charcoal }),
        padding: '44px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: colors.brass, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif",
            fontSize: 16, fontWeight: 500, color: colors.espresso,
          }}>K</div>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18, color: colors.sandLight, letterSpacing: -0.3,
          }}>Kyno</span>
        </div>

        <span style={{ fontSize: 10, color: 'rgba(122,127,109,0.45)', letterSpacing: 0.5 }}>
          {tx.footer}
        </span>
      </footer>

    </div>
  );
}
