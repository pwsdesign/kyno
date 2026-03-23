import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  COMMUNITY_MESSAGE_MAX_LENGTH,
  getLatestUpgradeRequest,
  getUpgradeRequestStatusLabel,
  isKynoPlusPlan,
  listCommunityMessages,
  sendCommunityMessage,
  subscribeToCommunityMessages,
} from '../services/kynoPlusService';

function formatTimestamp(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function mergeMessage(current, next) {
  if (current.some((message) => message.id === next.id)) {
    return current;
  }

  return [...current, next].slice(-50);
}

export default function CommunityPage() {
  const { profile, refreshProfile } = useAuth();
  const isPlus = isKynoPlusPlan(profile);
  const [messages, setMessages] = useState([]);
  const [request, setRequest] = useState(null);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    refreshProfile().catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    let cleanup = null;

    setError('');
    setLoading(true);

    if (!isPlus) {
      setMessages([]);
      getLatestUpgradeRequest()
        .then((nextRequest) => {
          if (active) setRequest(nextRequest);
        })
        .catch(() => {})
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }

    Promise.all([listCommunityMessages(), getLatestUpgradeRequest().catch(() => null)])
      .then(([nextMessages, nextRequest]) => {
        if (!active) return;
        setMessages(nextMessages);
        setRequest(nextRequest);
      })
      .catch((nextError) => {
        if (active) {
          setError(nextError instanceof Error ? nextError.message : 'Unable to load the community right now.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    cleanup = subscribeToCommunityMessages((message) => {
      if (!active) return;
      setMessages((current) => mergeMessage(current, message));
    });

    return () => {
      active = false;
      cleanup?.();
    };
  }, [isPlus]);

  useEffect(() => {
    if (!messages.length) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  async function handleSend(event) {
    event.preventDefault();
    const trimmedDraft = draft.trim();
    if (!trimmedDraft || sending) return;

    setSending(true);
    setError('');

    try {
      await sendCommunityMessage(trimmedDraft);
      setDraft('');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to send your message.');
    } finally {
      setSending(false);
    }
  }

  if (!isPlus) {
    return (
      <div>
        <Link to="/dashboard/membership" className="k-auth__back">&larr; Membership</Link>
        <h1 className="k-heading k-heading--xl k-mb-lg">Community</h1>

        <div className="k-card k-card--dark k-mb-lg">
          <div className="k-label k-mb-sm" style={{ color: 'var(--k-accent)' }}>KYNO+ only</div>
          <h2 className="k-heading k-heading--lg" style={{ color: 'var(--k-warm-100)', marginBottom: 10 }}>
            The members room unlocks with KYNO+.
          </h2>
          <p className="k-body" style={{ color: 'var(--k-warm-200)' }}>
            Premium members get access to one live community room for travel tips, service recommendations, and owner-to-owner advice.
          </p>
        </div>

        <div className="k-card">
          <div className="k-flex-between k-mb-md" style={{ alignItems: 'center' }}>
            <div>
              <div className="k-label k-mb-sm">Upgrade status</div>
              <div className="k-heading k-heading--md">{getUpgradeRequestStatusLabel(request)}</div>
            </div>
            {request?.status && <span className={`k-badge k-badge--${request.status}`}>{request.status}</span>}
          </div>
          <p className="k-body">
            {request?.status === 'pending'
              ? 'Your request is already in review. We will activate KYNO+ directly on your account once it is approved.'
              : request?.status === 'approved'
              ? 'Your request has been approved. Access opens as soon as the plan is activated on your profile.'
              : request?.status === 'declined'
              ? 'Your last request was declined. You can submit a new request from the membership page when you are ready.'
              : 'Start from the membership page to request KYNO+ and unlock the members-only chat.'}
          </p>
          {request?.created_at && (
            <div className="k-caption k-mt-md">Latest request: {formatTimestamp(request.created_at)}</div>
          )}
          <Link to="/dashboard/membership" className="k-btn k-btn--primary k-mt-lg" style={{ textDecoration: 'none' }}>
            Go to Membership
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="k-flex-between k-mb-lg" style={{ alignItems: 'center' }}>
        <div>
          <div className="k-label k-mb-sm" style={{ color: 'var(--k-accent)' }}>KYNO+ Community</div>
          <h1 className="k-heading k-heading--xl">Members Chat</h1>
        </div>
        <Link to="/dashboard/membership" className="k-btn k-btn--secondary k-btn--sm" style={{ textDecoration: 'none' }}>
          Membership
        </Link>
      </div>

      <div className="k-card k-mb-lg">
        <p className="k-body">
          One live room for premium members. Use it for care recommendations, travel planning, and calm owner-to-owner questions.
        </p>
      </div>

      <div className="k-card">
        {loading ? (
          <div className="k-spinner" />
        ) : (
          <>
            <div className="k-community-thread">
              {messages.length === 0 ? (
                <div className="k-community-empty">
                  <div className="k-heading k-heading--md k-mb-sm">No messages yet</div>
                  <div className="k-body">Be the first member to start the room.</div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={message.id}
                    className="k-community-message fade-up"
                    style={{ animationDelay: `${Math.min(index, 8) * 0.04}s`, opacity: 0 }}
                  >
                    <div className="k-community-message__meta">
                      <span className="k-community-message__author">{message.author_label}</span>
                      <span>{formatTimestamp(message.created_at)}</span>
                    </div>
                    <div className="k-community-message__body">{message.body}</div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="k-community-form">
              <textarea
                className="k-input k-community-form__input"
                value={draft}
                onChange={(event) => setDraft(event.target.value.slice(0, COMMUNITY_MESSAGE_MAX_LENGTH))}
                placeholder="Share a recommendation, ask a question, or post a helpful tip."
              />
              <div className="k-flex-between" style={{ alignItems: 'center', marginTop: 12 }}>
                <div className="k-caption">{draft.length}/{COMMUNITY_MESSAGE_MAX_LENGTH}</div>
                <button type="submit" className="k-btn k-btn--primary" disabled={sending || !draft.trim()}>
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </>
        )}

        {error && <div className="k-error-text k-mt-md">{error}</div>}
      </div>
    </div>
  );
}
