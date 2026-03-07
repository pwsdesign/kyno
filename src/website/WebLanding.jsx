import { useState } from 'react';
import { colors } from '../styles/tokens';

function SignupForm({ dark }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

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
          You're on the list. We'll be in touch soon.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <input
        type="email"
        placeholder="your@email.com"
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
        Notify me
      </button>
    </form>
  );
}

const SERVICES = [
  { index: '01', name: 'Walks', sub: 'GPS-tracked, certified' },
  { index: '02', name: 'Grooming', sub: 'Studio & mobile' },
  { index: '03', name: 'Dog Hotels', sub: 'Boutique boarding' },
  { index: '04', name: 'Vets', sub: 'Checkups & care' },
  { index: '05', name: 'Shop', sub: 'Curated goods' },
  { index: '06', name: 'Emergency', sub: '24/7 urgent care' },
];

const PARTNERSHIP_TYPES = [
  { title: 'Product Placement', desc: 'Featured visibility with premium dog owners.' },
  { title: 'Co-branded Services', desc: 'Joint offerings under both brands.' },
  { title: 'Delivery Integration', desc: 'Connect your fulfillment to our platform.' },
  { title: 'Sponsored Content', desc: 'Reach owners in-app, in email, in print.' },
];

export default function WebLanding() {
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
          }}>Premium dog care · Coming soon to Miami</div>

          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 26,
            fontWeight: 400,
            color: 'rgba(240,233,224,0.65)',
            lineHeight: 1.5,
            marginBottom: 52,
            letterSpacing: -0.3,
          }}>
            Walks, grooming, hotels, vets —<br />everything your dog deserves, in one place.
          </div>

          <SignupForm dark />

          <div style={{
            marginTop: 20, fontSize: 10,
            color: 'rgba(122,127,109,0.55)', letterSpacing: 0.5,
          }}>No spam. Early access only.</div>
        </div>

        <div style={{
          position: 'absolute', bottom: 36,
          fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase',
          color: 'rgba(196,164,107,0.3)', zIndex: 1,
        }}>↓ Learn more</div>
      </section>

      {/* ── FOR DOG OWNERS ────────────────────── */}
      <section id="owners" style={{ background: colors.sand, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

            <div>
              <div style={{
                fontSize: 9, letterSpacing: 3, textTransform: 'uppercase',
                color: colors.brass, fontWeight: 500, marginBottom: 16,
              }}>For dog owners</div>

              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 48, fontWeight: 400, color: colors.charcoal,
                letterSpacing: -1.2, lineHeight: 1.1, marginBottom: 20,
              }}>Everything your dog deserves, handled.</div>

              <div style={{
                fontSize: 14, color: colors.olive, fontWeight: 300,
                lineHeight: 1.8, marginBottom: 40,
              }}>
                Kyno brings together the best walkers, groomers, hotels, and vets in Miami — all bookable in minutes. Trusted providers, seamless scheduling, and real-time updates for every appointment.
              </div>

              <SignupForm dark={false} />
            </div>

            {/* Service cards — brass index numbers, no emoji */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {SERVICES.map(s => (
                <div key={s.name} style={{
                  background: colors.clayDark,
                  borderRadius: 16,
                  padding: '22px 20px',
                }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 13, color: colors.brass, fontWeight: 400,
                    letterSpacing: 1, marginBottom: 14,
                  }}>{s.index}</div>
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

            {/* Benefit cards — brass numerals, no emoji */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { num: '01', title: 'Steady clients', desc: 'A growing base of engaged dog owners actively booking quality care — no cold outreach.' },
                { num: '02', title: 'Flexible schedule', desc: 'Set your own availability and manage bookings on your terms from a simple dashboard.' },
                { num: '03', title: 'Fair pay', desc: 'Transparent pricing, fast payouts, flat commission. You keep what you earn.' },
              ].map(b => (
                <div key={b.num} style={{
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
                  }}>{b.num}</div>
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
              }}>For providers</div>

              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 48, fontWeight: 400, color: colors.sandLight,
                letterSpacing: -1.2, lineHeight: 1.1, marginBottom: 20,
              }}>Join the Kyno network.</div>

              <div style={{
                fontSize: 14, color: colors.oliveLight, fontWeight: 300,
                lineHeight: 1.8, marginBottom: 40,
              }}>
                Whether you walk, groom, board, or care for dogs — Kyno gives you the clients, tools, and support to grow your practice in Miami.
              </div>

              <SignupForm dark />

              <div style={{ marginTop: 16, fontSize: 11, color: 'rgba(122,127,109,0.45)', lineHeight: 1.6 }}>
                For walkers · groomers · dog hotels · vets · emergency care
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
              }}>For partners</div>

              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 48, fontWeight: 400, color: colors.charcoal,
                letterSpacing: -1.2, lineHeight: 1.1, marginBottom: 20,
              }}>Grow with Kyno.</div>

              <div style={{
                fontSize: 14, color: colors.olive, fontWeight: 300,
                lineHeight: 1.8, marginBottom: 40,
              }}>
                Partner with a premium dog care platform reaching engaged, brand-loyal pet owners in Miami. From product placements to co-branded services — we build partnerships that feel right for both brands.
              </div>

              <SignupForm dark={false} />

              <div style={{ marginTop: 16, fontSize: 11, color: colors.olive, lineHeight: 1.6 }}>
                Currently working with Chewy &amp; The Farmer's Dog
              </div>
            </div>

            {/* Partnership type cards — no emoji, brass short rule accent */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {PARTNERSHIP_TYPES.map(p => (
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
          © 2025 Kyno · Miami, FL
        </span>
      </footer>

    </div>
  );
}
