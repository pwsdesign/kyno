import { colors } from '../styles/tokens';
import { t } from './translations';

export default function WebNav({ lang, setLang, isDark, toggleTheme }) {
  const tx = t[lang].nav;

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className="web-nav"
      style={{
        background: isDark ? 'rgba(28,26,23,0.92)' : 'rgba(253,251,247,0.94)',
        borderBottom: `1px solid ${isDark ? 'rgba(196,164,107,0.12)' : 'rgba(28,26,23,0.08)'}`,
      }}
    >
      <div className="web-nav-inner">
        {/* Logo */}
        <div
          className="web-nav-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ cursor: 'pointer' }}
        >
          <div className="web-nav-logo-mark" style={{ color: isDark ? colors.brass : colors.espresso }}>K</div>
          <span className="web-nav-wordmark" style={{ color: isDark ? colors.sandLight : colors.espresso }}>Kyno</span>
        </div>

        {/* Anchor links */}
        <div className="web-nav-links">
          <span className="web-nav-link" style={{ color: isDark ? 'rgba(232,223,212,0.72)' : 'rgba(28,26,23,0.72)' }} onClick={() => scrollTo('owners')}>{tx.owners}</span>
          <span className="web-nav-link" style={{ color: isDark ? 'rgba(232,223,212,0.72)' : 'rgba(28,26,23,0.72)' }} onClick={() => scrollTo('providers')}>{tx.providers}</span>
          <span className="web-nav-link" style={{ color: isDark ? 'rgba(232,223,212,0.72)' : 'rgba(28,26,23,0.72)' }} onClick={() => scrollTo('partners')}>{tx.partners}</span>
        </div>

        {/* CTA + Language toggle */}
        <div className="web-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={toggleTheme}
            style={{
              background: isDark ? 'rgba(232,223,212,0.08)' : 'rgba(28,26,23,0.06)',
              color: isDark ? colors.sandLight : colors.espresso,
              border: `1px solid ${isDark ? 'rgba(196,164,107,0.2)' : 'rgba(28,26,23,0.08)'}`,
              borderRadius: 999,
              padding: '8px 12px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {isDark ? '☾ Dark' : '☼ Light'}
          </button>

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
            className="lp-nav-cta"
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
