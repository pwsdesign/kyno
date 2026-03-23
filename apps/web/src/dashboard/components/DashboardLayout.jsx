import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home', icon: '\u2302' },
  { to: '/dashboard/services', label: 'Services', icon: '\u25C8' },
  { to: '/dashboard/activity', label: 'Activity', icon: '\u25F7' },
  { to: '/dashboard/community', label: 'Community', icon: '\u2736' },
  { to: '/dashboard/profile', label: 'Profile', icon: '\u25CB' },
];

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="k-layout">
      {/* Sidebar (desktop) */}
      <aside className="k-sidebar">
        <div className="k-sidebar__logo" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="k-sidebar__logo-k">K</span>
            <span className="k-sidebar__logo-text">KYNO</span>
          </div>
          <button className="k-theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme === 'dark' ? '\u2600' : '\u263E'}
          </button>
        </div>
        <nav className="k-sidebar__nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `k-sidebar__item ${isActive ? 'k-sidebar__item--active' : ''}`
              }
            >
              <span className="k-sidebar__item-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="k-sidebar__bottom">
          <button
            className="k-sidebar__item"
            onClick={() => navigate('/dashboard/settings')}
          >
            <span className="k-sidebar__item-icon">{'\u2699'}</span>
            Settings
          </button>
          {profile && (
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--k-text-tertiary)' }}>
              {profile.first_name} {profile.last_name}
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="k-main">
        {children}
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="k-bottomnav">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `k-bottomnav__item ${isActive ? 'k-bottomnav__item--active' : ''}`
            }
          >
            <span className="k-bottomnav__icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <button className="k-bottomnav__item" onClick={toggleTheme}>
          <span className="k-bottomnav__icon">{theme === 'dark' ? '\u2600' : '\u263E'}</span>
          Theme
        </button>
      </nav>
    </div>
  );
}
