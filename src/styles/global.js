import { colors } from './tokens';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .kyno-root {
    min-height: 100vh;
    background: #1C1A18;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    padding: 32px 16px;
  }

  .phone-frame {
    width: 390px;
    height: 844px;
    background: ${colors.sand};
    border-radius: 52px;
    overflow: hidden;
    position: relative;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.06),
      0 40px 120px rgba(0,0,0,0.7),
      0 0 0 12px #111,
      inset 0 0 0 2px #2A2825;
    display: flex;
    flex-direction: column;
  }

  .status-bar {
    height: 52px;
    background: ${colors.sand};
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 0 28px 8px;
    flex-shrink: 0;
  }

  .status-time {
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 15px;
    color: ${colors.charcoal};
    letter-spacing: -0.3px;
  }

  .status-icons {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .screen {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .screen::-webkit-scrollbar { display: none; }

  /* ── BOTTOM NAV ─────────────────────────── */
  .bottom-nav {
    height: 82px;
    background: ${colors.sand};
    border-top: 1px solid rgba(122,127,109,0.15);
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
    padding-top: 12px;
    flex-shrink: 0;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 12px;
    transition: all 0.15s ease;
    min-width: 48px;
  }

  .nav-icon { font-size: 20px; line-height: 1; }

  .nav-label {
    font-size: 9px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    font-weight: 500;
    color: ${colors.olive};
    transition: color 0.15s;
  }

  .nav-item.active .nav-label { color: ${colors.espresso}; }
  .nav-item:not(.active) .nav-icon { opacity: 0.45; }

  .nav-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${colors.brass};
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
  }

  .nav-icon-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ── SHARED ─────────────────────────────── */
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 28px 28px 14px;
  }

  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 400;
    color: ${colors.charcoal};
    letter-spacing: -0.3px;
  }

  .section-link {
    font-size: 11px;
    color: ${colors.olive};
    letter-spacing: 0.5px;
    font-weight: 400;
    cursor: pointer;
  }

  /* ── ANIMATIONS ─────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fade-up   { animation: fadeUp 0.35s ease forwards; }
  .fade-up-1 { animation-delay: 0.05s; opacity: 0; }
  .fade-up-2 { animation-delay: 0.10s; opacity: 0; }
  .fade-up-3 { animation-delay: 0.15s; opacity: 0; }
  .fade-up-4 { animation-delay: 0.20s; opacity: 0; }
  .fade-up-5 { animation-delay: 0.25s; opacity: 0; }
  .fade-up-6 { animation-delay: 0.30s; opacity: 0; }
`;

export default globalStyles;
