import { colors } from '../styles/tokens';
import { t } from './translations';

export default function WebNav({ lang, setLang }) {
  const tx = t[lang].nav;

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="web-nav">
      <div className="web-nav-inner">
        {/* Logo */}
        <div
          className="web-nav-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ cursor: 'pointer' }}
        >
          <div className="web-nav-logo-mark">K</div>
          <span className="web-nav-wordmark">Kyno</span>
        </div>

        {/* Anchor links */}
        <div className="web-nav-links">
          <span className="web-nav-link" onClick={() => scrollTo('owners')}>{tx.owners}</span>
          <span className="web-nav-link" onClick={() => scrollTo('providers')}>{tx.providers}</span>
          <span className="web-nav-link" onClick={() => scrollTo('partners')}>{tx.partners}</span>
        </div>

        {/* CTA + Language toggle */}
        <div className="web-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* EN / ES toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(196,164,107,0.12)',
            borderRadius: 20,
            padding: 3,
            gap: 2,
          }}>
            {['en', 'es'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  background: lang === l ? colors.brass : 'transparent',
                  color: lang === l ? colors.espresso : colors.brass,
                  border: 'none',
                  borderRadius: 16,
                  padding: '4px 10px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              background: colors.brass,
              color: colors.espresso,
              border: 'none',
              borderRadius: 8,
              padding: '8px 18px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 1.8,
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = colors.brassLight}
            onMouseLeave={e => e.currentTarget.style.background = colors.brass}
          >
            {tx.cta}
          </button>
        </div>
      </div>
    </nav>
  );
}
