import { Link, NavLink, useLocation } from 'react-router-dom';
import { colors } from '../styles/tokens';
import { t } from './translations';

function getAudience(pathname) {
  if (pathname.startsWith('/providers')) return 'providers';
  if (pathname.startsWith('/partners')) return 'partners';
  return 'owners';
}

export default function WebNav({ lang, setLang, isDark, toggleTheme }) {
  const { pathname } = useLocation();
  const audience = getAudience(pathname);
  const tx = t[lang];
  const ctaLabel = tx.nav.cta[audience];
  const inactiveLinkColor = isDark ? 'rgba(247,241,230,0.72)' : 'rgba(53,50,44,0.68)';
  const activeLinkColor = isDark ? colors.sandLight : colors.espresso;
  const activeLinkBackground = isDark ? 'rgba(212,168,58,0.14)' : 'rgba(224,205,172,0.48)';

  const jumpToForm = () => {
    document.getElementById('join')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className="web-nav"
      style={{
        background: isDark ? 'rgba(22,20,17,0.84)' : 'rgba(255,250,243,0.84)',
        borderBottom: `1px solid ${isDark ? 'rgba(212,168,58,0.12)' : 'rgba(53,50,44,0.08)'}`,
      }}
    >
      <div className="web-nav-inner">
        <Link className="web-nav-logo" to="/">
          <div className="web-nav-logo-mark" style={{ color: colors.espresso }}>K</div>
          <span className="web-nav-wordmark" style={{ color: isDark ? colors.sandLight : colors.espresso }}>Kyno</span>
        </Link>

        <div className="web-nav-links">
          <NavLink
            end
            to="/"
            className={({ isActive }) => `web-nav-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              color: isActive ? activeLinkColor : inactiveLinkColor,
              background: isActive ? activeLinkBackground : 'transparent',
            })}
          >
            {tx.nav.owners}
          </NavLink>
          <NavLink
            to="/providers"
            className={({ isActive }) => `web-nav-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              color: isActive ? activeLinkColor : inactiveLinkColor,
              background: isActive ? activeLinkBackground : 'transparent',
            })}
          >
            {tx.nav.providers}
          </NavLink>
          <NavLink
            to="/partners"
            className={({ isActive }) => `web-nav-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              color: isActive ? activeLinkColor : inactiveLinkColor,
              background: isActive ? activeLinkBackground : 'transparent',
            })}
          >
            {tx.nav.partners}
          </NavLink>
        </div>

        <div className="web-nav-actions">
          <button
            type="button"
            onClick={toggleTheme}
            className="web-theme-toggle"
            style={{
              background: isDark ? 'rgba(247,241,230,0.08)' : 'rgba(53,50,44,0.06)',
              color: isDark ? colors.sandLight : colors.espresso,
              border: `1px solid ${isDark ? 'rgba(212,168,58,0.16)' : 'rgba(53,50,44,0.08)'}`,
            }}
          >
            {isDark ? 'Dark' : 'Light'}
          </button>

          <div
            className="web-lang-toggle"
            style={{
              background: isDark ? 'rgba(247,241,230,0.06)' : 'rgba(53,50,44,0.05)',
              border: `1px solid ${isDark ? 'rgba(212,168,58,0.14)' : 'rgba(53,50,44,0.07)'}`,
            }}
          >
            {['en', 'es'].map((locale) => (
              <button
                key={locale}
                type="button"
                onClick={() => setLang(locale)}
                style={{
                  background: lang === locale ? colors.brass : 'transparent',
                  color: lang === locale ? colors.espresso : isDark ? colors.sandLight : colors.charcoal,
                }}
              >
                {locale}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="lp-nav-cta"
            onClick={jumpToForm}
            style={{
              appearance: 'none',
              background: colors.brass,
              color: colors.espresso,
              border: 'none',
              borderRadius: 999,
              padding: '10px 18px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 26px rgba(102,75,20,0.12)',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = colors.brassLight;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = colors.brass;
            }}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </nav>
  );
}
