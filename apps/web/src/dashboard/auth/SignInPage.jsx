import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { signIn } from '../services/authService';

export default function SignInPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const intent = searchParams.get('intent');
  const intentSuffix = intent ? `?intent=${encodeURIComponent(intent)}` : '';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) { setError('Email and password are required.'); return; }
    setLoading(true);
    try {
      await signIn(email, password);
      navigate(intent === 'kyno-plus' ? '/dashboard/membership' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="k-auth">
      <div className="k-auth__container">
        <Link to={`/auth/welcome${intentSuffix}`} className="k-auth__back">&larr; Back</Link>
        <h1 className="k-heading k-heading--lg" style={{ marginBottom: 4 }}>Welcome back</h1>
        <p className="k-body k-mb-lg">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="k-form-grid k-gap-md">
          <div className="k-input-group">
            <label className="k-input-label">Email</label>
            <input className="k-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="andrea@email.com" />
          </div>
          <div className="k-input-group">
            <label className="k-input-label">Password</label>
            <input className="k-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" />
          </div>
          {error && <div className="k-error-text">{error}</div>}
          <button type="submit" className="k-btn k-btn--primary k-btn--full k-mt-md" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="k-caption k-text-center k-mt-lg">
          Don't have an account? <Link to={`/auth/create-account${intentSuffix}`} style={{ color: 'var(--k-accent)' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
