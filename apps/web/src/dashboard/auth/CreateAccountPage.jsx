import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const intent = searchParams.get('intent');
  const intentSuffix = intent ? `?intent=${encodeURIComponent(intent)}` : '';
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })); }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.firstName.trim() || !form.lastName.trim()) { setError('First and last name are required.'); return; }
    if (!form.email.trim()) { setError('Email is required.'); return; }
    if (!form.phone.trim()) { setError('Phone number is required.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    navigate(`/auth/add-dog${intentSuffix}`, { state: form });
  }

  return (
    <div className="k-auth">
      <div className="k-auth__container">
        <Link to={`/auth/welcome${intentSuffix}`} className="k-auth__back">&larr; Back</Link>
        <h1 className="k-heading k-heading--lg" style={{ marginBottom: 4 }}>Create your account</h1>
        <p className="k-body k-mb-lg">Step 1 of 2</p>

        <form onSubmit={handleSubmit} className="k-form-grid k-gap-md">
          <div className="k-form-grid k-form-grid--2col">
            <div className="k-input-group">
              <label className="k-input-label">First name</label>
              <input className="k-input" value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Andrea" />
            </div>
            <div className="k-input-group">
              <label className="k-input-label">Last name</label>
              <input className="k-input" value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Leon" />
            </div>
          </div>
          <div className="k-input-group">
            <label className="k-input-label">Phone</label>
            <input className="k-input" type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="(305) 555-0100" />
          </div>
          <div className="k-input-group">
            <label className="k-input-label">Email</label>
            <input className="k-input" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="andrea@email.com" />
          </div>
          <div className="k-input-group">
            <label className="k-input-label">Password</label>
            <input className="k-input" type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="8+ characters" />
          </div>
          {error && <div className="k-error-text">{error}</div>}
          <button type="submit" className="k-btn k-btn--primary k-btn--full k-mt-md">Continue</button>
        </form>

        <p className="k-caption k-text-center k-mt-lg">
          Already have an account? <Link to={`/auth/sign-in${intentSuffix}`} style={{ color: 'var(--k-accent)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
