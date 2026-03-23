import { Link, useSearchParams } from 'react-router-dom';

export default function WelcomePage() {
  const [searchParams] = useSearchParams();
  const intent = searchParams.get('intent');
  const intentSuffix = intent ? `?intent=${encodeURIComponent(intent)}` : '';

  return (
    <div className="k-auth k-auth--dark">
      <div className="k-auth__container k-text-center">
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--k-font-serif)', fontSize: 56, color: 'var(--k-accent)', marginBottom: 8 }}>K</div>
          <div style={{ fontFamily: 'var(--k-font-serif)', fontSize: 28, letterSpacing: 10, color: 'var(--k-warm-200)' }}>KYNO</div>
          <div style={{ fontSize: 11, letterSpacing: 4, color: 'var(--k-stone-500)', textTransform: 'uppercase', marginTop: 12 }}>
            Elevated dog care
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 48 }}>
          <Link to={`/auth/create-account${intentSuffix}`} className="k-btn k-btn--primary k-btn--full" style={{ textDecoration: 'none' }}>
            Create Account
          </Link>
          <Link to={`/auth/sign-in${intentSuffix}`} className="k-btn k-btn--secondary k-btn--full" style={{ borderColor: 'var(--k-stone-600)', color: 'var(--k-warm-200)', textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
