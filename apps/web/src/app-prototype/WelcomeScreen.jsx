import { colors } from '../styles/tokens';

export default function WelcomeScreen({ onGetStarted }) {
  return (
    <div style={{
      flex: 1,
      background: colors.espresso,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 40px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at 75% 15%, rgba(196,164,107,0.2) 0%, transparent 55%),
          radial-gradient(ellipse at 25% 85%, rgba(30,20,12,0.9) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
      }} />

      {/* Paw icon */}
      <div style={{
        fontSize: 64,
        marginBottom: 32,
        position: 'relative',
        zIndex: 1,
      }}>🐾</div>

      {/* Brand name */}
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 56,
        fontWeight: 400,
        color: colors.sandLight,
        letterSpacing: -1.5,
        lineHeight: 1,
        marginBottom: 14,
        position: 'relative',
        zIndex: 1,
      }}>Kyno</div>

      {/* Tagline */}
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: colors.brass,
        fontWeight: 400,
        marginBottom: 72,
        position: 'relative',
        zIndex: 1,
      }}>Premium care for your dog</div>

      {/* Get Started button */}
      <button
        onClick={onGetStarted}
        style={{
          background: colors.brass,
          color: colors.espresso,
          border: 'none',
          borderRadius: 18,
          padding: '16px 52px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 2.5,
          textTransform: 'uppercase',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 1,
          transition: 'all 0.2s ease',
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Get Started
      </button>

      {/* Bottom hint */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 9,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: colors.brass,
        opacity: 0.4,
        zIndex: 1,
      }}>For Mango</div>
    </div>
  );
}
