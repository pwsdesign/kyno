import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ensureWalletPassUrl } from '../services/membershipService';
import MembershipCard from '../components/MembershipCard';

export default function MembershipPage() {
  const { profile, refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const fromSignup = searchParams.get('fromSignup') === '1';
  const [walletUrl, setWalletUrl] = useState(profile?.wallet_pass_url || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fromSignup || !walletUrl) {
      setLoading(true);
      ensureWalletPassUrl()
        .then(res => {
          setWalletUrl(res.walletPassUrl);
          refreshProfile();
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <div>
      {!fromSignup && <Link to="/dashboard/settings" className="k-auth__back">&larr; Settings</Link>}

      {fromSignup && (
        <div className="k-text-center k-mb-lg">
          <div style={{ fontSize: 40, marginBottom: 12, color: 'var(--k-accent-sage)' }}>{'\u2713'}</div>
          <h1 className="k-heading k-heading--xl" style={{ marginBottom: 4 }}>Welcome to Kyno</h1>
          <p className="k-body">Your membership is active.</p>
        </div>
      )}

      {!fromSignup && <h1 className="k-heading k-heading--xl k-mb-lg">Membership</h1>}

      <MembershipCard profile={profile} />

      <div className="k-mt-lg">
        {loading ? (
          <div className="k-caption k-text-center">Setting up your wallet pass...</div>
        ) : walletUrl ? (
          <a href={walletUrl} target="_blank" rel="noopener noreferrer" className="k-btn k-btn--dark k-btn--full" style={{ textDecoration: 'none' }}>
            Add to Apple Wallet
          </a>
        ) : (
          <div className="k-caption k-text-center">Wallet pass not available yet.</div>
        )}
      </div>

      {fromSignup && (
        <Link to="/dashboard" className="k-btn k-btn--primary k-btn--full k-mt-lg" style={{ textDecoration: 'none' }}>
          Go to Dashboard
        </Link>
      )}
    </div>
  );
}
