import { colors } from './tokens';

const componentStyles = `
  /* ── HOME SCREEN ────────────────────────── */
  .home-header {
    padding: 12px 28px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .greeting-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${colors.olive};
  }

  .greeting-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 400;
    color: ${colors.charcoal};
    letter-spacing: -0.3px;
    margin-top: 2px;
    line-height: 1.1;
  }

  .header-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: ${colors.clay};
    border: 2px solid ${colors.clayDark};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    color: ${colors.espresso};
    font-weight: 500;
  }

  /* ── DOG PROFILE CARD ───────────────────── */
  .dog-card {
    margin: 20px 28px 0;
    background: ${colors.espresso};
    border-radius: 24px;
    padding: 22px 24px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .dog-card:active { transform: scale(0.98); }

  .dog-card-texture {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 80% 20%, rgba(196,164,107,0.15) 0%, transparent 60%),
      radial-gradient(ellipse at 20% 80%, rgba(61,43,31,0.8) 0%, transparent 50%);
    pointer-events: none;
  }

  .dog-card-label {
    font-size: 9px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: ${colors.brass};
    font-weight: 500;
    margin-bottom: 16px;
    opacity: 0.9;
  }

  .dog-card-main {
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
    z-index: 1;
  }

  .dog-avatar {
    width: 68px;
    height: 68px;
    border-radius: 18px;
    background: ${colors.clay};
    border: 2px solid rgba(196,164,107,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    flex-shrink: 0;
  }

  .dog-info { flex: 1; }

  .dog-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 400;
    color: ${colors.sandLight};
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .dog-breed {
    font-size: 12px;
    color: ${colors.clay};
    font-weight: 300;
    margin-top: 4px;
    opacity: 0.8;
  }

  .dog-stats {
    display: flex;
    gap: 0;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(196,164,107,0.15);
    position: relative;
    z-index: 1;
    align-items: center;
  }

  .dog-profile-grid {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(196,164,107,0.15);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  .dog-profile-item,
  .dog-profile-row {
    background: rgba(232,223,212,0.06);
    border: 1px solid rgba(196,164,107,0.12);
    border-radius: 12px;
    padding: 10px 12px;
    position: relative;
    z-index: 1;
  }

  .dog-profile-row {
    margin-top: 10px;
  }

  .dog-profile-key {
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${colors.olive};
    font-weight: 500;
    margin-bottom: 5px;
  }

  .dog-profile-value {
    font-size: 12px;
    color: ${colors.sandLight};
    line-height: 1.45;
    font-weight: 400;
  }

  .dog-vaccine-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .dog-vaccine-chip {
    font-size: 9px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: ${colors.espresso};
    background: ${colors.brassLight};
    border-radius: 12px;
    padding: 4px 8px;
    font-weight: 600;
  }

  .dog-stat { text-align: center; }

  .dog-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 400;
    color: ${colors.brassLight};
    line-height: 1;
  }

  .dog-stat-label {
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${colors.olive};
    margin-top: 3px;
    font-weight: 400;
  }

  .dog-stat-divider {
    width: 1px;
    height: 32px;
    background: rgba(196,164,107,0.15);
    margin: 0 20px;
  }

  .dog-card-arrow {
    position: absolute;
    top: 22px;
    right: 22px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid rgba(196,164,107,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.brass};
    font-size: 12px;
    z-index: 1;
  }

  /* ── SERVICE GRID (HOME) ────────────────── */
  .services-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 0 28px;
  }

  .service-card {
    background: ${colors.clayDark};
    border-radius: 18px;
    padding: 18px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    border: 1px solid transparent;
  }

  .service-card:active {
    transform: scale(0.97);
    border-color: rgba(196,164,107,0.3);
  }

  .service-card.featured {
    grid-column: span 2;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: ${colors.charcoal};
  }

  .service-card.emergency { background: ${colors.emergencyBg}; }

  .service-icon {
    font-size: 26px;
    display: block;
    margin-bottom: 12px;
  }

  .service-card.featured .service-icon {
    font-size: 36px;
    margin-bottom: 0;
    flex-shrink: 0;
  }

  .service-card.featured .service-text { flex: 1; }

  .service-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    font-weight: 500;
    color: ${colors.charcoal};
    line-height: 1.2;
    letter-spacing: -0.2px;
  }

  .service-card.featured .service-name,
  .service-card.emergency .service-name { color: ${colors.sandLight}; font-size: 18px; }

  .service-sub {
    font-size: 10px;
    color: ${colors.olive};
    margin-top: 3px;
    font-weight: 300;
    letter-spacing: 0.3px;
  }

  .service-card.featured .service-sub { color: ${colors.oliveLight}; }
  .service-card.emergency .service-sub { color: ${colors.emergencyAccent}; }

  .service-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: ${colors.brass};
    color: ${colors.espresso};
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 3px 7px;
    border-radius: 20px;
  }

  /* ── UPCOMING ───────────────────────────── */
  .upcoming-card {
    margin: 0 28px;
    background: ${colors.clayDark};
    border-radius: 18px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
  }

  .upcoming-date-block {
    background: ${colors.brass};
    border-radius: 12px;
    padding: 8px 10px;
    text-align: center;
    min-width: 44px;
    flex-shrink: 0;
  }

  .upcoming-day {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 400;
    color: ${colors.espresso};
    line-height: 1;
  }

  .upcoming-month {
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${colors.espresso};
    opacity: 0.7;
    margin-top: 2px;
  }

  .upcoming-details { flex: 1; }

  .upcoming-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    color: ${colors.charcoal};
    font-weight: 500;
  }

  .upcoming-provider {
    font-size: 11px;
    color: ${colors.olive};
    margin-top: 3px;
    font-weight: 300;
  }

  .upcoming-time {
    font-size: 11px;
    color: ${colors.olive};
    font-weight: 400;
    text-align: right;
    line-height: 1.6;
  }

  /* ── SERVICES SCREEN ────────────────────── */
  .services-screen { padding: 16px 28px 20px; }

  .services-screen-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 400;
    color: ${colors.charcoal};
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }

  .services-screen-sub {
    font-size: 12px;
    color: ${colors.olive};
    font-weight: 300;
    margin-bottom: 24px;
    letter-spacing: 0.3px;
  }

  .service-full-card {
    background: ${colors.clayDark};
    border-radius: 20px;
    margin-bottom: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .service-full-card:active { transform: scale(0.98); }

  .service-full-inner {
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .service-full-icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: ${colors.sand};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    flex-shrink: 0;
  }

  .service-full-info { flex: 1; }

  .service-full-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 500;
    color: ${colors.charcoal};
    letter-spacing: -0.2px;
  }

  .service-full-desc {
    font-size: 11px;
    color: ${colors.olive};
    margin-top: 3px;
    font-weight: 300;
    line-height: 1.5;
  }

  .service-full-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px 16px;
    border-top: 1px solid rgba(122,127,109,0.1);
  }

  .service-full-count {
    font-size: 10px;
    color: ${colors.olive};
    letter-spacing: 0.5px;
  }

  .service-full-range {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px;
    color: ${colors.charcoal};
  }

  .service-full-arrow { color: ${colors.brass}; font-size: 16px; }

  .service-full-card.emerg-card { background: ${colors.emergencyBgDark}; }
  .service-full-card.emerg-card .service-full-name { color: ${colors.sandLight}; }
  .service-full-card.emerg-card .service-full-icon-wrap { background: #3D2020; }

  /* ── PROVIDER SCREEN ────────────────────── */
  .provider-screen { padding-bottom: 20px; }

  .provider-hero {
    height: 200px;
    background: ${colors.espresso};
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .provider-hero-texture {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 70% 30%, rgba(196,164,107,0.2) 0%, transparent 60%);
  }

  .provider-hero-emoji {
    font-size: 80px;
    position: relative;
    z-index: 1;
  }

  .provider-back {
    position: absolute;
    top: 18px;
    left: 20px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(232,223,212,0.15);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
    font-size: 16px;
    color: ${colors.sand};
  }

  .provider-body { padding: 22px 24px; }

  .provider-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .provider-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 400;
    color: ${colors.charcoal};
    letter-spacing: -0.5px;
    line-height: 1.1;
  }

  .provider-rating {
    display: flex;
    align-items: center;
    gap: 5px;
    background: ${colors.clay};
    border-radius: 20px;
    padding: 5px 10px;
    margin-top: 4px;
  }

  .provider-rating-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px;
    color: ${colors.charcoal};
    font-weight: 500;
  }

  .provider-stars { font-size: 10px; letter-spacing: 1px; color: ${colors.brass}; }

  .provider-category {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${colors.olive};
    margin-bottom: 16px;
    font-weight: 400;
  }

  .provider-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .provider-tag {
    font-size: 10px;
    background: ${colors.clay};
    color: ${colors.charcoal};
    padding: 5px 11px;
    border-radius: 20px;
    font-weight: 400;
    letter-spacing: 0.3px;
  }

  .provider-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    color: ${colors.charcoal};
    font-weight: 500;
    margin-bottom: 12px;
    letter-spacing: -0.2px;
  }

  .provider-picker-title {
    margin-bottom: 10px;
  }

  .provider-picker-row {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    margin-bottom: 18px;
    padding-bottom: 4px;
    scrollbar-width: none;
  }

  .provider-picker-card {
    min-width: 168px;
    background: ${colors.clay};
    border-radius: 14px;
    padding: 12px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .provider-picker-card.selected {
    background: ${colors.charcoal};
    border-color: ${colors.brass};
  }

  .provider-picker-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .provider-picker-icon {
    font-size: 18px;
    line-height: 1;
  }

  .provider-brand-badge {
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    background: ${colors.brass};
    color: ${colors.espresso};
    border-radius: 12px;
    padding: 4px 7px;
    white-space: nowrap;
  }

  .provider-picker-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px;
    color: ${colors.charcoal};
    line-height: 1.2;
  }

  .provider-picker-meta {
    margin-top: 3px;
    font-size: 10px;
    line-height: 1.4;
    color: ${colors.olive};
  }

  .provider-picker-price {
    margin-top: 8px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    color: ${colors.espresso};
  }

  .provider-picker-card.selected .provider-picker-name,
  .provider-picker-card.selected .provider-picker-price {
    color: ${colors.sand};
  }

  .provider-picker-card.selected .provider-picker-meta {
    color: ${colors.oliveLight};
  }

  .provider-picker-card.selected .provider-brand-badge {
    background: ${colors.sand};
  }

  .availability-row {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .avail-slot {
    background: ${colors.clay};
    border-radius: 12px;
    padding: 10px 14px;
    text-align: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s ease;
    border: 1px solid transparent;
  }

  .avail-slot.selected {
    background: ${colors.charcoal};
    border-color: ${colors.brass};
  }

  .avail-day {
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${colors.olive};
    font-weight: 500;
  }

  .avail-date {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    color: ${colors.charcoal};
    line-height: 1.2;
    font-weight: 400;
  }

  .avail-slot.selected .avail-day  { color: ${colors.oliveLight}; }
  .avail-slot.selected .avail-date { color: ${colors.sand}; }

  .time-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }

  .time-chip {
    background: ${colors.clay};
    border-radius: 20px;
    padding: 7px 14px;
    font-size: 12px;
    color: ${colors.charcoal};
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid transparent;
    font-weight: 400;
  }

  .time-chip.selected {
    background: ${colors.brass};
    color: ${colors.espresso};
    font-weight: 500;
  }

  .book-btn {
    width: 100%;
    background: ${colors.charcoal};
    color: ${colors.sand};
    border: none;
    border-radius: 18px;
    padding: 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .book-btn:active {
    background: ${colors.espresso};
    transform: scale(0.99);
  }

  .book-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    color: ${colors.brass};
    font-weight: 400;
  }
`;

export default componentStyles;
