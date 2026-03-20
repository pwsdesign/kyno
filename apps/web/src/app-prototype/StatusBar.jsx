import { colors } from '../styles/tokens';

export default function StatusBar() {
  return (
    <div className="status-bar">
      <span className="status-time">9:41</span>
      <div className="status-icons">
        {/* Signal */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <rect x="0" y="4" width="3" height="8" rx="1" fill={colors.charcoal} opacity="0.4"/>
          <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill={colors.charcoal} opacity="0.6"/>
          <rect x="9" y="0.5" width="3" height="11.5" rx="1" fill={colors.charcoal}/>
          <rect x="13.5" y="3" width="2" height="6" rx="1" fill={colors.charcoal} opacity="0.3"/>
        </svg>
        {/* WiFi */}
        <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
          <path d="M7.5 2C9.8 2 11.9 3 13.4 4.7L14.5 3.5C12.7 1.4 10.2 0 7.5 0C4.8 0 2.3 1.4 0.5 3.5L1.6 4.7C3.1 3 5.2 2 7.5 2Z" fill={colors.charcoal} opacity="0.4"/>
          <path d="M7.5 5C9 5 10.4 5.7 11.4 6.8L12.5 5.7C11.2 4.2 9.5 3.3 7.5 3.3C5.5 3.3 3.8 4.2 2.5 5.7L3.6 6.8C4.6 5.7 6 5 7.5 5Z" fill={colors.charcoal} opacity="0.7"/>
          <circle cx="7.5" cy="9.5" r="2" fill={colors.charcoal}/>
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={colors.charcoal} strokeOpacity="0.35"/>
          <rect x="2" y="2" width="16" height="8" rx="2" fill={colors.charcoal}/>
          <path d="M23 4v4a2 2 0 0 0 0-4z" fill={colors.charcoal} opacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}
