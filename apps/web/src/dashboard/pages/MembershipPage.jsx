import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ensureWalletPassUrl } from '../services/membershipService';
import {
  UPGRADE_REQUEST_NOTE_MAX_LENGTH,
  getLatestUpgradeRequest,
  getMembershipPlanLabel,
  getUpgradeRequestStatusLabel,
  isKynoPlusPlan,
  submitUpgradeRequest,
} from '../services/kynoPlusService';
import MembershipCard from '../components/MembershipCard';

const plusBenefits = [
  'Members-only live community chat',
  'Priority access to premium launches and events',
  'A sharper membership layer inside the Kyno portal',
];

function formatRequestMessage(request) {
  if (!request?.status) {
    return 'Tell us how you would use KYNO+ and we will review your request manually.';
  }

  if (request.status === 'pending') {
    return 'Your KYNO+ request is in review. Access turns on as soon as the premium plan is activated on your profile.';
  }

  if (request.status === 'approved') {
    return 'Your request has been approved. We are just waiting on the manual plan activation step.';
  }

  if (request.status === 'declined') {
    return 'Your previous request was declined. You can submit another request with more context.';
  }

  return 'Your request status has been updated.';
}

function formatTimestamp(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function MembershipPage() {
  const { profile, refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const fromSignup = searchParams.get('fromSignup') === '1';
  const [walletUrl, setWalletUrl] = useState(profile?.wallet_pass_url || null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [request, setRequest] = useState(null);
  const [requestNote, setRequestNote] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const isPlus = isKynoPlusPlan(profile);
  const canSubmitRequest = !isPlus && request?.status !== 'pending' && request?.status !== 'approved';

  useEffect(() => {
    refreshProfile().catch(() => {});
    getLatestUpgradeRequest().then(setRequest).catch(() => {});
  }, []);

  useEffect(() => {
    setWalletUrl(profile?.wallet_pass_url || null);
  }, [profile?.wallet_pass_url]);

  useEffect(() => {
    if (!fromSignup && walletUrl) return;

    setWalletLoading(true);
    ensureWalletPassUrl()
      .then((res) => {
        setWalletUrl(res.walletPassUrl);
        return refreshProfile();
      })
      .catch(() => {})
      .finally(() => setWalletLoading(false));
  }, []);

  async function handleUpgradeRequest(event) {
    event.preventDefault();
    if (!canSubmitRequest || requestLoading) return;

    setRequestLoading(true);
    setRequestError('');

    try {
      const createdRequest = await submitUpgradeRequest(requestNote);
      setRequest(createdRequest);
      setRequestNote('');
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Unable to submit your KYNO+ request.');
    } finally {
      setRequestLoading(false);
    }
  }

  return (
    <div>
      {!fromSignup && <Link to="/dashboard/settings" className="k-auth__back">&larr; Settings</Link>}

      {fromSignup && (
        <div className="k-text-center k-mb-lg">
          <div style={{ fontSize: 40, marginBottom: 12, color: 'var(--k-accent-sage)' }}>{'\u2713'}</div>
          <h1 className="k-heading k-heading--xl" style={{ marginBottom: 4 }}>Welcome to Kyno</h1>
          <p className="k-body">Your membership is live. KYNO+ can be requested anytime from this page.</p>
        </div>
      )}

      {!fromSignup && <h1 className="k-heading k-heading--xl k-mb-lg">Membership</h1>}

      <MembershipCard profile={profile} />

      <div className="k-card k-mt-lg">
        <div className="k-flex-between" style={{ alignItems: 'center', gap: 16 }}>
          <div>
            <div className="k-label k-mb-sm">Current plan</div>
            <div className="k-heading k-heading--md">{getMembershipPlanLabel(profile)}</div>
          </div>
          <span className={`k-plan-pill ${isPlus ? 'k-plan-pill--plus' : ''}`}>
            {getMembershipPlanLabel(profile)}
          </span>
        </div>
      </div>

      <div className="k-mt-lg">
        {walletLoading ? (
          <div className="k-caption k-text-center">Setting up your wallet pass...</div>
        ) : walletUrl ? (
          <a href={walletUrl} target="_blank" rel="noopener noreferrer" className="k-btn k-btn--dark k-btn--full" style={{ textDecoration: 'none' }}>
            Add to Apple Wallet
          </a>
        ) : (
          <div className="k-caption k-text-center">Wallet pass not available yet.</div>
        )}
      </div>

      {isPlus ? (
        <div className="k-card k-card--dark k-mt-lg">
          <div className="k-label k-mb-sm" style={{ color: 'var(--k-accent)' }}>KYNO+ active</div>
          <h2 className="k-heading k-heading--lg" style={{ color: 'var(--k-warm-100)', marginBottom: 10 }}>
            Premium access is turned on for this account.
          </h2>
          <p className="k-body" style={{ color: 'var(--k-warm-200)' }}>
            The members-only community chat is live now. Use it for recommendations, travel planning, and owner-to-owner context that stays inside Kyno.
          </p>
          <div className="k-flex" style={{ gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
            {plusBenefits.map((benefit) => (
              <span key={benefit} className="k-membership-chip">{benefit}</span>
            ))}
          </div>
          <Link to="/dashboard/community" className="k-btn k-btn--primary k-mt-lg" style={{ textDecoration: 'none' }}>
            Open Community
          </Link>
        </div>
      ) : (
        <div className="k-card k-mt-lg">
          <div className="k-label k-mb-sm" style={{ color: 'var(--k-accent)' }}>Upgrade to KYNO+</div>
          <h2 className="k-heading k-heading--lg" style={{ marginBottom: 10 }}>
            Unlock the premium membership layer.
          </h2>
          <p className="k-body">
            KYNO+ adds the members-only community chat and priority access to premium owner experiences. Requests are reviewed manually at launch.
          </p>

          <div className="k-flex" style={{ gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
            {plusBenefits.map((benefit) => (
              <span key={benefit} className="k-membership-chip">{benefit}</span>
            ))}
          </div>

          <div className="k-card k-mt-lg" style={{ padding: 18, background: 'var(--k-surface-raised)' }}>
            <div className="k-flex-between" style={{ alignItems: 'center', gap: 16 }}>
              <div>
                <div className="k-label k-mb-sm">Request status</div>
                <div className="k-heading k-heading--sm">{getUpgradeRequestStatusLabel(request)}</div>
              </div>
              {request?.status && <span className={`k-badge k-badge--${request.status}`}>{request.status}</span>}
            </div>
            <p className="k-body k-mt-md">{formatRequestMessage(request)}</p>
            {request?.created_at && (
              <div className="k-caption k-mt-sm">Latest update: {formatTimestamp(request.created_at)}</div>
            )}
          </div>

          <form onSubmit={handleUpgradeRequest} className="k-form-grid k-mt-lg">
            <div className="k-input-group">
              <label className="k-input-label">Why do you want KYNO+?</label>
              <textarea
                className="k-input"
                rows="4"
                value={requestNote}
                onChange={(event) => setRequestNote(event.target.value.slice(0, UPGRADE_REQUEST_NOTE_MAX_LENGTH))}
                placeholder="Optional: tell us what kind of community, recommendations, or premium access would be most useful."
                disabled={!canSubmitRequest}
                style={{ resize: 'vertical', minHeight: 112 }}
              />
              <div className="k-caption">{requestNote.length}/{UPGRADE_REQUEST_NOTE_MAX_LENGTH}</div>
            </div>

            {requestError && <div className="k-error-text">{requestError}</div>}

            <button type="submit" className="k-btn k-btn--primary k-btn--full" disabled={!canSubmitRequest || requestLoading}>
              {requestLoading ? 'Submitting...' : request?.status === 'declined' ? 'Request KYNO+ Again' : 'Request KYNO+'}
            </button>
          </form>
        </div>
      )}

      {fromSignup && (
        <Link to="/dashboard" className="k-btn k-btn--secondary k-btn--full k-mt-lg" style={{ textDecoration: 'none' }}>
          Continue to Dashboard
        </Link>
      )}
    </div>
  );
}
