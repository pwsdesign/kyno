import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import DogProfileFormCard, { createDraftDog } from '../components/DogProfileFormCard';
import { createAccount } from '../services/authService';

export default function AddDogPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const intent = searchParams.get('intent');
  const intentSuffix = intent ? `?intent=${encodeURIComponent(intent)}` : '';
  const accountData = location.state;
  const [dogs, setDogs] = useState([createDraftDog()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!accountData) {
    return (
        <div className="k-auth">
        <div className="k-auth__container k-text-center">
          <p className="k-body">Session expired.</p>
          <Link to={`/auth/create-account${intentSuffix}`} className="k-btn k-btn--primary k-mt-md">Start over</Link>
        </div>
      </div>
    );
  }

  function updateDog(index, updated) {
    setDogs(prev => prev.map((d, i) => i === index ? updated : d));
  }

  function removeDog(index) {
    if (dogs.length <= 1) return;
    setDogs(prev => prev.filter((_, i) => i !== index));
  }

  function addDog() {
    setDogs(prev => [...prev, createDraftDog()]);
  }

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      const validDogs = dogs.filter(d => d.name.trim().length > 0);
      await createAccount({ ...accountData, dogs: validDogs });
      navigate('/dashboard/membership?fromSignup=1', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSkip() {
    setError('');
    setLoading(true);
    try {
      await createAccount({ ...accountData, dogs: [] });
      navigate(intent === 'kyno-plus' ? '/dashboard/membership?fromSignup=1' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="k-auth" style={{ justifyContent: 'flex-start', paddingTop: 40 }}>
      <div className="k-auth__container">
        <Link to={`/auth/create-account${intentSuffix}`} className="k-auth__back">&larr; Back</Link>
        <h1 className="k-heading k-heading--lg" style={{ marginBottom: 4 }}>Add your dog</h1>
        <p className="k-body k-mb-lg">Step 2 of 2</p>

        {dogs.map((dog, i) => (
          <DogProfileFormCard
            key={i}
            dog={dog}
            index={i}
            onChange={updated => updateDog(i, updated)}
            onRemove={dogs.length > 1 ? () => removeDog(i) : undefined}
          />
        ))}

        <button className="k-btn k-btn--secondary k-btn--full k-mb-md" onClick={addDog}>+ Add another dog</button>

        {error && <div className="k-error-text k-mb-md">{error}</div>}

        <button className="k-btn k-btn--primary k-btn--full k-mb-md" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <button className="k-btn k-btn--ghost k-btn--full" onClick={handleSkip} disabled={loading}>
          Skip for now
        </button>
      </div>
    </div>
  );
}
