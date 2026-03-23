import { colors } from './tokens';

const websiteStyles = `
  /* ── RESET & BASE ───────────────────────── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${colors.sand};
    font-family: 'DM Sans', sans-serif;
    color: ${colors.charcoal};
    -webkit-font-smoothing: antialiased;
  }

  /* ── LAYOUT ─────────────────────────────── */
  .web-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 48px;
  }

  .web-page {
    min-height: 100vh;
    padding-top: 64px;
  }

  /* ── NAV ────────────────────────────────── */
  .web-nav {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    min-height: 76px;
    background: rgba(61,43,31,0.96);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    z-index: 100;
    border-bottom: 1px solid rgba(196,164,107,0.12);
  }

  .web-nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 14px 48px;
    gap: 16px;
  }

  .web-nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    margin-right: 16px;
    flex-shrink: 0;
  }

  .web-nav-logo-mark {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: ${colors.brass};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 500;
    color: ${colors.espresso};
  }

  .web-nav-wordmark {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 400;
    color: ${colors.sandLight};
    letter-spacing: -0.3px;
  }

  .web-nav-links {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  .web-nav-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: rgba(232,223,212,0.65);
    cursor: pointer;
    padding: 10px 14px;
    border-radius: 999px;
    transition: all 0.15s ease;
    text-decoration: none;
    white-space: nowrap;
  }

  .web-nav-link:hover,
  .web-nav-link.active {
    color: ${colors.sandLight};
    background: rgba(196,164,107,0.12);
  }

  .web-nav-divider {
    width: 1px;
    height: 18px;
    background: rgba(196,164,107,0.2);
    margin: 0 12px;
    flex-shrink: 0;
  }

  .web-nav-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .web-theme-toggle {
    border-radius: 999px;
    padding: 9px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    cursor: pointer;
  }

  .web-lang-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    border-radius: 999px;
  }

  .web-lang-toggle button {
    border: none;
    border-radius: 999px;
    padding: 7px 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .web-nav-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: ${colors.clay};
    border: 1.5px solid rgba(196,164,107,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px;
    color: ${colors.espresso};
    cursor: pointer;
  }

  /* ── SECTIONS ───────────────────────────── */
  .web-section {
    padding: 80px 0;
  }

  .web-section-dark {
    background: ${colors.espresso};
    padding: 80px 0;
  }

  .web-section-charcoal {
    background: ${colors.charcoal};
    padding: 80px 0;
  }

  .web-section-clay {
    background: ${colors.clay};
    padding: 80px 0;
  }

  .web-section-label {
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: ${colors.brass};
    font-weight: 500;
    margin-bottom: 16px;
  }

  .web-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 44px;
    font-weight: 400;
    color: ${colors.charcoal};
    letter-spacing: -1px;
    line-height: 1.1;
    margin-bottom: 14px;
  }

  .web-section-title-light {
    font-family: 'Cormorant Garamond', serif;
    font-size: 44px;
    font-weight: 400;
    color: ${colors.sandLight};
    letter-spacing: -1px;
    line-height: 1.1;
    margin-bottom: 14px;
  }

  .web-section-sub {
    font-size: 14px;
    color: ${colors.olive};
    font-weight: 300;
    line-height: 1.7;
    max-width: 480px;
    margin-bottom: 48px;
  }

  .web-section-sub-light {
    font-size: 14px;
    color: ${colors.oliveLight};
    font-weight: 300;
    line-height: 1.7;
    max-width: 480px;
    margin-bottom: 48px;
  }

  /* ── GRIDS ──────────────────────────────── */
  .web-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .web-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .web-grid-services {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  /* ── CARDS ──────────────────────────────── */
  .web-card {
    background: ${colors.clayDark};
    border-radius: 20px;
    padding: 28px;
    transition: transform 0.2s ease;
  }

  .web-card:hover { transform: translateY(-2px); }

  .web-card-dark {
    background: rgba(232,223,212,0.06);
    border: 1px solid rgba(196,164,107,0.12);
    border-radius: 20px;
    padding: 28px;
  }

  .web-service-card {
    background: ${colors.clayDark};
    border-radius: 20px;
    padding: 28px 24px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
    text-decoration: none;
    display: block;
  }

  .web-service-card:hover {
    border-color: rgba(196,164,107,0.3);
    transform: translateY(-2px);
  }

  .web-service-card.emergency-card {
    background: ${colors.emergencyBgDark};
  }

  .web-service-icon {
    font-size: 36px;
    margin-bottom: 16px;
    display: block;
  }

  .web-service-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 500;
    color: ${colors.charcoal};
    margin-bottom: 6px;
    letter-spacing: -0.3px;
  }

  .web-service-card.emergency-card .web-service-name { color: ${colors.sandLight}; }

  .web-service-desc {
    font-size: 12px;
    color: ${colors.olive};
    font-weight: 300;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .web-service-card.emergency-card .web-service-desc { color: ${colors.emergencyAccent}; }

  .web-service-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid rgba(122,127,109,0.15);
  }

  .web-service-count {
    font-size: 10px;
    color: ${colors.olive};
    letter-spacing: 0.5px;
  }

  .web-service-range {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    color: ${colors.brass};
  }

  /* ── BUTTONS ────────────────────────────── */
  .web-btn-primary {
    background: ${colors.brass};
    color: ${colors.espresso};
    border: none;
    border-radius: 12px;
    padding: 14px 32px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-block;
    text-decoration: none;
  }

  .web-btn-primary:hover { background: ${colors.brassLight}; transform: translateY(-1px); }
  .web-btn-primary:active { transform: scale(0.98); }

  .web-btn-ghost {
    background: transparent;
    color: ${colors.sandLight};
    border: 1px solid rgba(196,164,107,0.35);
    border-radius: 12px;
    padding: 14px 32px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-block;
    text-decoration: none;
  }

  .web-btn-ghost:hover {
    background: rgba(196,164,107,0.1);
    border-color: ${colors.brass};
  }

  .web-btn-dark {
    background: ${colors.charcoal};
    color: ${colors.sand};
    border: none;
    border-radius: 12px;
    padding: 14px 32px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-block;
    text-decoration: none;
  }

  .web-btn-dark:hover { background: ${colors.espresso}; transform: translateY(-1px); }

  /* ── FORMS ──────────────────────────────── */
  .web-input {
    background: rgba(232,223,212,0.08);
    border: 1px solid rgba(196,164,107,0.2);
    border-radius: 10px;
    padding: 14px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: ${colors.sandLight};
    width: 100%;
    outline: none;
    transition: border-color 0.15s;
  }

  .web-input::placeholder { color: rgba(157,160,144,0.6); }
  .web-input:focus { border-color: ${colors.brass}; }

  .web-input-light {
    background: white;
    border: 1px solid ${colors.clay};
    border-radius: 10px;
    padding: 14px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: ${colors.charcoal};
    width: 100%;
    outline: none;
    transition: border-color 0.15s;
  }

  .web-input-light::placeholder { color: ${colors.olive}; }
  .web-input-light:focus { border-color: ${colors.brass}; }

  .web-select {
    background: white;
    border: 1px solid ${colors.clay};
    border-radius: 10px;
    padding: 14px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: ${colors.charcoal};
    width: 100%;
    outline: none;
    appearance: none;
    cursor: pointer;
  }

  .web-form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }

  .web-form-label {
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${colors.olive};
    font-weight: 500;
  }

  /* ── HERO ───────────────────────────────── */
  .web-hero {
    background: ${colors.espresso};
    padding: 120px 0 100px;
    position: relative;
    overflow: hidden;
  }

  .web-hero-texture {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 80% 20%, rgba(196,164,107,0.16) 0%, transparent 55%),
      radial-gradient(ellipse at 15% 80%, rgba(30,20,12,0.9) 0%, transparent 50%);
    pointer-events: none;
  }

  /* ── PAGE HEADER ────────────────────────── */
  .web-page-header {
    padding: 56px 0 40px;
    border-bottom: 1px solid rgba(122,127,109,0.15);
    margin-bottom: 48px;
  }

  .web-page-label {
    font-size: 9px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: ${colors.brass};
    font-weight: 500;
    margin-bottom: 10px;
  }

  .web-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px;
    font-weight: 400;
    color: ${colors.charcoal};
    letter-spacing: -0.8px;
    line-height: 1.1;
  }

  .web-page-sub {
    font-size: 13px;
    color: ${colors.olive};
    font-weight: 300;
    margin-top: 8px;
    letter-spacing: 0.2px;
  }

  /* ── UPCOMING CARDS ─────────────────────── */
  .web-upcoming-card {
    background: ${colors.clayDark};
    border-radius: 16px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .web-upcoming-card:hover { transform: translateX(4px); }

  /* ── FOOTER ─────────────────────────────── */
  .web-footer {
    background: ${colors.charcoal};
    padding: 60px 0 40px;
  }

  .web-footer-inner {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr;
    gap: 48px;
    margin-bottom: 48px;
  }

  .web-footer-brand {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .web-footer-tagline {
    font-size: 12px;
    color: ${colors.olive};
    font-weight: 300;
    line-height: 1.6;
    max-width: 240px;
  }

  .web-footer-col-title {
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${colors.brass};
    font-weight: 500;
    margin-bottom: 16px;
  }

  .web-footer-link {
    display: block;
    font-size: 13px;
    color: rgba(232,223,212,0.55);
    font-weight: 300;
    text-decoration: none;
    margin-bottom: 10px;
    cursor: pointer;
    transition: color 0.15s;
  }

  .web-footer-link:hover { color: ${colors.sandLight}; }

  .web-footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 28px;
    border-top: 1px solid rgba(122,127,109,0.12);
  }

  .web-footer-legal {
    font-size: 10px;
    color: rgba(122,127,109,0.6);
    letter-spacing: 0.5px;
  }

  .web-footer-legal-links {
    display: flex;
    gap: 20px;
  }

  /* ── BOOKING PAGE ───────────────────────── */
  .web-book-layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 32px;
    align-items: start;
  }

  .web-provider-card {
    background: ${colors.clayDark};
    border-radius: 16px;
    padding: 18px 20px;
    cursor: pointer;
    border: 1.5px solid transparent;
    transition: all 0.15s ease;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .web-provider-card:hover { border-color: rgba(196,164,107,0.25); }

  .web-provider-card.selected {
    background: ${colors.charcoal};
    border-color: ${colors.brass};
  }

  .web-provider-icon {
    font-size: 28px;
    width: 52px;
    height: 52px;
    background: ${colors.clay};
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .web-provider-card.selected .web-provider-icon { background: rgba(232,223,212,0.08); }

  .web-provider-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    color: ${colors.charcoal};
    font-weight: 500;
  }

  .web-provider-card.selected .web-provider-name { color: ${colors.sandLight}; }

  .web-provider-meta {
    font-size: 11px;
    color: ${colors.olive};
    margin-top: 3px;
  }

  .web-provider-card.selected .web-provider-meta { color: ${colors.oliveLight}; }

  .web-provider-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    color: ${colors.brass};
    margin-left: auto;
    flex-shrink: 0;
  }

  .web-sticky-panel {
    position: sticky;
    top: 84px;
    background: ${colors.clayDark};
    border-radius: 20px;
    padding: 28px;
  }

  .web-date-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    margin-bottom: 20px;
  }

  .web-date-chip {
    background: ${colors.clay};
    border-radius: 12px;
    padding: 10px 8px;
    text-align: center;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.15s;
  }

  .web-date-chip.selected {
    background: ${colors.charcoal};
    border-color: ${colors.brass};
  }

  .web-date-chip-day {
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${colors.olive};
    font-weight: 500;
  }

  .web-date-chip.selected .web-date-chip-day { color: ${colors.oliveLight}; }

  .web-date-chip-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    color: ${colors.charcoal};
    font-weight: 400;
    line-height: 1.2;
  }

  .web-date-chip.selected .web-date-chip-num { color: ${colors.sand}; }

  .web-time-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 24px;
  }

  .web-time-chip {
    background: ${colors.clay};
    border-radius: 20px;
    padding: 9px 12px;
    font-size: 12px;
    color: ${colors.charcoal};
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid transparent;
    text-align: center;
  }

  .web-time-chip.selected {
    background: ${colors.brass};
    color: ${colors.espresso};
    font-weight: 500;
  }

  /* ── ACTIVITY PAGE ──────────────────────── */
  .web-filter-row {
    display: flex;
    gap: 8px;
    margin-bottom: 28px;
  }

  .web-filter-chip {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.5px;
    padding: 7px 16px;
    border-radius: 20px;
    cursor: pointer;
    border: 1px solid ${colors.clay};
    background: transparent;
    color: ${colors.olive};
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }

  .web-filter-chip.active {
    background: ${colors.charcoal};
    border-color: ${colors.charcoal};
    color: ${colors.sand};
  }

  /* ── PROFILE PAGE ───────────────────────── */
  .web-profile-layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 28px;
    align-items: start;
  }

  .web-user-card {
    background: ${colors.clayDark};
    border-radius: 20px;
    padding: 28px;
    position: sticky;
    top: 84px;
  }

  /* ── BENEFIT CARD ───────────────────────── */
  .web-benefit-card {
    padding: 28px;
    border-radius: 20px;
    background: rgba(232,223,212,0.06);
    border: 1px solid rgba(196,164,107,0.12);
  }

  .web-benefit-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;
    color: ${colors.brass};
    font-weight: 400;
    line-height: 1;
    margin-bottom: 16px;
  }

  .web-benefit-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    color: ${colors.sandLight};
    font-weight: 400;
    margin-bottom: 10px;
    letter-spacing: -0.2px;
  }

  .web-benefit-desc {
    font-size: 12px;
    color: ${colors.oliveLight};
    font-weight: 300;
    line-height: 1.7;
  }

  /* ── STEP CARD ──────────────────────────── */
  .web-step {
    display: flex;
    gap: 20px;
    align-items: flex-start;
    margin-bottom: 28px;
  }

  .web-step-num {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: ${colors.brass};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    color: ${colors.espresso};
    flex-shrink: 0;
  }

  .web-step-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    color: ${colors.charcoal};
    font-weight: 500;
    margin-bottom: 4px;
  }

  .web-step-desc {
    font-size: 12px;
    color: ${colors.olive};
    font-weight: 300;
    line-height: 1.6;
  }

  /* ── PARTNER TYPES ──────────────────────── */
  .web-partner-card {
    background: ${colors.clayDark};
    border-radius: 16px;
    padding: 24px;
    border: 1px solid transparent;
    transition: border-color 0.15s;
  }

  .web-partner-card:hover { border-color: rgba(196,164,107,0.25); }

  .web-partner-icon {
    font-size: 28px;
    margin-bottom: 14px;
  }

  .web-partner-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    color: ${colors.charcoal};
    font-weight: 500;
    margin-bottom: 8px;
  }

  .web-partner-desc {
    font-size: 12px;
    color: ${colors.olive};
    font-weight: 300;
    line-height: 1.6;
  }

  /* ── LANDING PAGE LAYOUT ────────────────── */
  .lp-page {
    min-height: 100vh;
  }

  .lp-shell {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 48px;
  }

  .lp-hero-shell {
    padding: 56px 0 72px;
  }

  .lp-hero-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.02fr) minmax(360px, 0.98fr);
    gap: 42px;
    align-items: start;
  }

  .lp-hero-copy {
    padding-top: 24px;
  }

  .lp-kicker {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 18px;
  }

  .lp-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 76px;
    line-height: 0.97;
    letter-spacing: -2.2px;
    max-width: 760px;
  }

  .lp-hero-body {
    margin-top: 20px;
    max-width: 610px;
    font-size: 16px;
    line-height: 1.8;
  }

  .lp-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 28px 0 32px;
  }

  .lp-chip {
    border: 1px solid transparent;
    border-radius: 999px;
    padding: 10px 14px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.4px;
    text-transform: uppercase;
  }

  .lp-form-card,
  .lp-spotlight-card,
  .lp-stat-card,
  .lp-card,
  .lp-step-panel,
  .lp-switch-panel,
  .lp-switch-card {
    border-radius: 26px;
  }

  .lp-form-card {
    padding: 26px;
    max-width: 520px;
  }

  .lp-form-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    line-height: 1.1;
    margin-bottom: 18px;
  }

  .lp-form-stack {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .lp-form-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 8px;
  }

  .lp-form-section:first-of-type {
    padding-top: 0;
  }

  .lp-form-section-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .lp-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .lp-form-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .lp-form-field-label {
    font-size: 11px;
    font-weight: 600;
    line-height: 1.4;
  }

  .lp-form-help {
    font-size: 11px;
    line-height: 1.6;
    margin-top: -2px;
  }

  .lp-form-note {
    margin-top: 14px;
    font-size: 11px;
    line-height: 1.6;
  }

  .lp-feedback {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    font-size: 13px;
    line-height: 1.6;
  }

  .lp-feedback-icon {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${colors.brass};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.espresso};
    font-size: 11px;
    flex-shrink: 0;
  }

  .lp-error-msg {
    font-size: 11px;
    color: ${colors.emergencyAccent};
    margin-top: 2px;
  }

  .lp-hero-aside {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .lp-spotlight-card {
    padding: 28px;
  }

  .lp-spotlight-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 34px;
    line-height: 1.05;
    letter-spacing: -0.9px;
  }

  .lp-spotlight-body {
    margin-top: 14px;
    font-size: 14px;
    line-height: 1.8;
  }

  .lp-spotlight-footer {
    margin-top: 16px;
    font-size: 11px;
    line-height: 1.6;
  }

  .lp-stat-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .lp-stat-card {
    padding: 22px 18px;
  }

  .lp-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 34px;
    line-height: 1;
    letter-spacing: -1px;
  }

  .lp-stat-label {
    margin-top: 8px;
    font-size: 11px;
    line-height: 1.6;
  }

  .lp-card-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .lp-card {
    padding: 22px 20px;
  }

  .lp-card-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 14px;
  }

  .lp-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    line-height: 1.1;
    margin-bottom: 8px;
  }

  .lp-card-body {
    font-size: 13px;
    line-height: 1.7;
  }

  .lp-plus-shell {
    padding: 0 0 24px;
  }

  .lp-plus-panel {
    padding: 32px;
  }

  .lp-plus-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(340px, 0.96fr);
    gap: 28px;
    align-items: start;
  }

  .lp-plus-copy .lp-section-body {
    max-width: 560px;
  }

  .lp-plus-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 24px;
  }

  .lp-plus-primary,
  .lp-plus-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 0 18px;
    border-radius: 999px;
    border: 1px solid transparent;
    text-decoration: none;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.4px;
    text-transform: uppercase;
  }

  .lp-plus-note {
    margin-top: 16px;
    font-size: 11px;
    line-height: 1.7;
    max-width: 520px;
  }

  .lp-checkbox-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .lp-checkbox-card {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 13px 14px;
    border: 1px solid transparent;
    border-radius: 16px;
    cursor: pointer;
    transition: border-color 0.15s ease, transform 0.15s ease;
  }

  .lp-checkbox-card:hover {
    transform: translateY(-1px);
  }

  .lp-checkbox-card input {
    width: 16px;
    height: 16px;
    margin-top: 2px;
    accent-color: ${colors.brass};
    flex-shrink: 0;
  }

  .lp-checkbox-label {
    font-size: 12px;
    line-height: 1.5;
  }

  .lp-section-shell {
    padding: 72px 0;
  }

  .lp-section-layout {
    display: grid;
    grid-template-columns: minmax(0, 0.88fr) minmax(320px, 1.12fr);
    gap: 36px;
    align-items: start;
  }

  .lp-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 48px;
    line-height: 1.02;
    letter-spacing: -1.2px;
    max-width: 700px;
  }

  .lp-section-body {
    margin-top: 18px;
    max-width: 620px;
    font-size: 14px;
    line-height: 1.8;
  }

  .lp-step-panel {
    padding: 28px;
  }

  .lp-step-row {
    display: grid;
    grid-template-columns: 52px 1fr;
    gap: 16px;
    align-items: start;
  }

  .lp-step-row + .lp-step-row {
    margin-top: 22px;
    padding-top: 22px;
    border-top: 1px solid rgba(122,127,109,0.16);
  }

  .lp-step-index {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: ${colors.brass};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.espresso};
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    line-height: 1;
  }

  .lp-step-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    line-height: 1.1;
    margin-bottom: 8px;
  }

  .lp-step-body {
    font-size: 13px;
    line-height: 1.8;
  }

  .lp-switch-panel {
    margin-top: 24px;
    padding: 28px;
  }

  .lp-switch-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 0.9fr);
    gap: 20px;
    align-items: end;
  }

  .lp-switch-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 22px;
  }

  .lp-switch-card {
    text-decoration: none;
    padding: 22px 20px;
    transition: transform 0.15s ease, border-color 0.15s ease;
  }

  .lp-switch-card:hover {
    transform: translateY(-2px);
  }

  .lp-switch-card.is-active {
    border-color: ${colors.brass} !important;
  }

  .lp-switch-card-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .lp-switch-card-body {
    font-size: 13px;
    line-height: 1.7;
  }

  .lp-footer {
    padding: 28px 0 32px;
  }

  .lp-footer-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }

  .lp-footer-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .lp-footer-mark {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    background: ${colors.brass};
    color: ${colors.espresso};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
  }

  .lp-footer-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    line-height: 1;
  }

  .lp-footer-tagline {
    margin-top: 4px;
    font-size: 11px;
    line-height: 1.5;
  }

  .lp-footer-links {
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
  }

  .lp-footer-links a {
    text-decoration: none;
    font-size: 12px;
    font-weight: 600;
  }

  .lp-footer-legal {
    font-size: 11px;
    line-height: 1.5;
  }

  /* ── RESPONSIVE ─────────────────────────── */
  @media (max-width: 1024px) {
    .web-book-layout { grid-template-columns: 1fr; }
    .web-sticky-panel { position: static; }
    .web-profile-layout { grid-template-columns: 1fr; }
    .web-user-card { position: static; }
  }

  @media (max-width: 768px) {
    .web-container { padding: 0 24px; }
    .web-grid-3 { grid-template-columns: 1fr; }
    .web-grid-2 { grid-template-columns: 1fr; }
    .web-grid-services { grid-template-columns: 1fr 1fr; }
    .web-footer-inner { grid-template-columns: 1fr; }
    .web-section { padding: 56px 0; }
    .web-section-dark { padding: 56px 0; }
    .web-section-title,
    .web-section-title-light { font-size: 34px; }
    .web-nav-inner { padding: 12px 20px; }
    .web-nav-links {
      order: 3;
      width: 100%;
      justify-content: space-between;
      overflow-x: auto;
      padding-bottom: 2px;
    }
    .web-nav-actions {
      margin-left: auto;
    }
    .lp-nav-cta { display: none; }

    .lp-shell { padding: 0 24px; }
    .lp-hero-shell { padding: 36px 0 56px; }
    .lp-hero-layout,
    .lp-plus-layout,
    .lp-section-layout,
    .lp-switch-header,
    .lp-switch-grid,
    .lp-stat-grid,
    .lp-card-grid,
    .lp-form-grid,
    .lp-checkbox-grid {
      grid-template-columns: 1fr;
    }
    .lp-hero-title { font-size: 52px; letter-spacing: -1.4px; }
    .lp-section-title { font-size: 36px; letter-spacing: -0.8px; }
    .lp-step-row { grid-template-columns: 44px 1fr; }
    .lp-step-index { width: 44px; height: 44px; font-size: 20px; }
    .lp-footer-inner { align-items: flex-start; }
  }
`;

export default websiteStyles;
