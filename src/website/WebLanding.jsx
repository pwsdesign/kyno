import { useState } from 'react';
import { colors } from '../styles/tokens';
import { t } from './translations';

function SignupForm({ dark, lang }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const tx = t[lang].form;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setDone(true);
  };

  if (done) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0' }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          background: colors.brass, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 11, color: colors.espresso, flexShrink: 0,
        }}>✓</div>
        <span style={{ fontSize: 13, color: dark ? colors.oliveLight : colors.olive, fontWeight: 300 }}>
          {tx.success}
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <input
        type="email"
        placeholder={tx.placeholder}
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          background: dark ? 'rgba(232,223,212,0.08)' : 'white',
          border: `1px solid ${dark ? 'rgba(196,164,107,0.25)' : colors.clay}`,
          borderRadius: 10,
          padding: '13px 18px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: dark ? colors.sandLight : colors.charcoal,
          outline: 'none',
          flex: 1,
          minWidth: 0,
        }}
      />
      <button
        type="submit"
        style={{
          background: colors.brass,
          color: colors.espresso,
          border: 'none',
          borderRadius: 10,
          padding: '13px 28px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 2,
          textTransform: 'uppercase',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = colors.brassLight}
        onMouseLeave={e => e.currentTarget.style.background = colors.brass}
      >
        {tx.button}
      </button>
    </form>
  );
}

export default function WebLanding({ lang }) {
  const tx = t[lang];

  return (
    <div>

      {/* ── HERO ──────────────────────────────── */}
      <section style={{
        background: colors.espresso,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 48px 100px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse at 70% 20%, rgba(196,164,107,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 25% 80%, rgba(20,12,6,0.85) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 88,
            fontWeight: 400,
            color: colors.sandLight,
            letterSpacing: -3,
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

          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 26,
            fontWeight: 400,
            color: 'rgba(240,233,224,0.65)',
            lineHeight: 1.5,
            marginBottom: 52,
            letterSpacing: -0.3,
          }}>
            {tx.hero.headline1}<br />{tx.hero.headline2}
          </div>

          <SignupForm dark lang={lang} />

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
      <section id="owners" style={{ background: colors.sand, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

            <div>
              <div style={{
                fontSize: 9, letterSpacing: 3, textTransform: 'uppercase',
                color: colors.brass, fontWeight: 500, marginBottom: 16,
              }}>{tx.owners.label}</div>

              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 48, fontWeight: 400, color: colors.charcoal,
                letterSpacing: -1.2, lineHeight: 1.1, marginBottom: 20,
              }}>{tx.owners.title}</div>

              <div style={{
                fontSize: 14, color: colors.olive, fontWeight: 300,
                lineHeight: 1.8, marginBottom: 40,
              }}>
                {tx.owners.body}
              </div>

              <SignupForm dark={false} lang={lang} />
            </div>

            {/* Service cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {tx.services.map((s, i) => (
                <div key={s.name} style={{
                  background: colors.clayDark,
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
                    fontSize: 18, fontWeight: 500, color: colors.charcoal, marginBottom: 4,
                  }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: colors.olive, fontWeight: 300 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR PROVIDERS ─────────────────────── */}
      <section id="providers" style={{ background: colors.charcoal, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

            {/* Benefit cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tx.providers.benefits.map((b, i) => (
                <div key={b.title} style={{
                  background: 'rgba(232,223,212,0.05)',
                  border: '1px solid rgba(196,164,107,0.1)',
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

              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 48, fontWeight: 400, color: colors.sandLight,
                letterSpacing: -1.2, lineHeight: 1.1, marginBottom: 20,
              }}>{tx.providers.title}</div>

              <div style={{
                fontSize: 14, color: colors.oliveLight, fontWeight: 300,
                lineHeight: 1.8, marginBottom: 40,
              }}>
                {tx.providers.body}
              </div>

              <SignupForm dark lang={lang} />

              <div style={{ marginTop: 16, fontSize: 11, color: 'rgba(122,127,109,0.45)', lineHeight: 1.6 }}>
                {tx.providers.footer}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR PARTNERS ──────────────────────── */}
      <section id="partners" style={{ background: colors.sand, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

            <div>
              <div style={{
                fontSize: 9, letterSpacing: 3, textTransform: 'uppercase',
                color: colors.brass, fontWeight: 500, marginBottom: 16,
              }}>{tx.partners.label}</div>

              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 48, fontWeight: 400, color: colors.charcoal,
                letterSpacing: -1.2, lineHeight: 1.1, marginBottom: 20,
              }}>{tx.partners.title}</div>

              <div style={{
                fontSize: 14, color: colors.olive, fontWeight: 300,
                lineHeight: 1.8, marginBottom: 40,
              }}>
                {tx.partners.body}
              </div>

              <SignupForm dark={false} lang={lang} />

              <div style={{ marginTop: 16, fontSize: 11, color: colors.olive, lineHeight: 1.6 }}>
                {tx.partners.footer}
              </div>
            </div>

            {/* Partnership type cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {tx.partners.types.map(p => (
                <div key={p.title} style={{
                  background: colors.clayDark,
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
                    fontSize: 16, fontWeight: 500, color: colors.charcoal, marginBottom: 8,
                  }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: colors.olive, fontWeight: 300, lineHeight: 1.6 }}>
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
        background: colors.charcoal,
        padding: '44px 48px',
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
