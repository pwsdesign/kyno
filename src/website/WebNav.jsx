import { colors } from '../styles/tokens';

export default function WebNav() {
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
          <span className="web-nav-link" onClick={() => scrollTo('owners')}>Dog Owners</span>
          <span className="web-nav-link" onClick={() => scrollTo('providers')}>Providers</span>
          <span className="web-nav-link" onClick={() => scrollTo('partners')}>Partners</span>
        </div>

        {/* CTA */}
        <div className="web-nav-actions">
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
            Get Early Access
          </button>
        </div>
      </div>
    </nav>
  );
}
