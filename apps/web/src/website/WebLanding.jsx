import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { colors } from '../styles/tokens';
import {
  darkCardSurfaceStyle,
  darkShellSurfaceStyle,
  lightCardSurfaceStyle,
  lightPanelSurfaceStyle,
  lightShellSurfaceStyle,
} from './surfaces';
import { t } from './translations';

const AUDIENCE_PATHS = {
  owners: '/',
  providers: '/providers',
  partners: '/partners',
};

function getPalette(isDark) {
  return isDark
    ? {
        pageSurface: darkShellSurfaceStyle,
        heroSurface: darkShellSurfaceStyle,
        cardSurface: darkCardSurfaceStyle,
        softCardSurface: { background: 'rgba(247,241,230,0.04)' },
        sectionSurface: {
          background: 'rgba(18,17,14,0.38)',
          borderTop: '1px solid rgba(212,168,58,0.08)',
          borderBottom: '1px solid rgba(212,168,58,0.08)',
        },
        footerSurface: {
          background: 'rgba(14,13,11,0.82)',
          borderTop: '1px solid rgba(212,168,58,0.1)',
        },
        title: colors.sandLight,
        text: colors.sandLight,
        muted: 'rgba(247,241,230,0.72)',
        note: 'rgba(169,164,151,0.86)',
        label: colors.brass,
        border: 'rgba(212,168,58,0.14)',
        chipBg: 'rgba(247,241,230,0.05)',
        inputBg: 'rgba(247,241,230,0.06)',
        inputText: colors.sandLight,
        inputBorder: 'rgba(212,168,58,0.16)',
        cardShadow: '0 32px 80px rgba(0,0,0,0.22)',
      }
    : {
        pageSurface: lightShellSurfaceStyle,
        heroSurface: lightShellSurfaceStyle,
        cardSurface: lightCardSurfaceStyle,
        softCardSurface: lightPanelSurfaceStyle,
        sectionSurface: {
          ...lightPanelSurfaceStyle,
          borderTop: '1px solid rgba(53,50,44,0.06)',
          borderBottom: '1px solid rgba(53,50,44,0.06)',
        },
        footerSurface: {
          background: 'rgba(255,248,239,0.94)',
          borderTop: '1px solid rgba(53,50,44,0.08)',
        },
        title: colors.espresso,
        text: colors.charcoal,
        muted: 'rgba(53,50,44,0.74)',
        note: 'rgba(92,85,74,0.76)',
        label: colors.brass,
        border: 'rgba(53,50,44,0.1)',
        chipBg: 'rgba(255,255,255,0.62)',
        inputBg: 'rgba(255,255,255,0.84)',
        inputText: colors.charcoal,
        inputBorder: 'rgba(53,50,44,0.1)',
        cardShadow: '0 28px 70px rgba(75,57,24,0.08)',
      };
}

function surfaceCardStyle(surface, palette, extra = {}) {
  return {
    ...surface,
    border: `1px solid ${palette.border}`,
    boxShadow: palette.cardShadow,
    ...extra,
  };
}

function inputStyle(palette, overrides = {}) {
  return {
    background: palette.inputBg,
    border: `1px solid ${palette.inputBorder}`,
    borderRadius: 14,
    padding: '13px 16px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: palette.inputText,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    ...overrides,
  };
}

function buttonStyle(submitting) {
  return {
    background: colors.brass,
    color: colors.espresso,
    border: 'none',
    borderRadius: 14,
    padding: '14px',
    width: '100%',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: 'uppercase',
    cursor: submitting ? 'default' : 'pointer',
    opacity: submitting ? 0.7 : 1,
    transition: 'background 0.15s, opacity 0.15s',
  };
}

function SuccessMsg({ text, palette }) {
  return (
    <div className="lp-feedback">
      <div className="lp-feedback-icon">✓</div>
      <span style={{ color: palette.note }}>{text}</span>
    </div>
  );
}

function ErrorMsg({ text }) {
  return <div className="lp-error-msg">{text}</div>;
}

async function postSignup(payload) {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Submission failed');
  }
}

function OwnerForm({ lang, palette }) {
  const tx = t[lang].form;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  if (status === 'success') {
    return <SuccessMsg text={tx.success} palette={palette} />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus('submitting');

    try {
      await postSignup({ type: 'owner', name: name.trim(), email: email.trim() });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="lp-form-stack">
      <input
        type="text"
        placeholder={tx.namePlaceholder}
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        style={inputStyle(palette)}
      />
      <input
        type="email"
        placeholder={tx.placeholder}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        style={inputStyle(palette)}
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={buttonStyle(status === 'submitting')}
        onMouseEnter={(event) => {
          if (status !== 'submitting') event.currentTarget.style.background = colors.brassLight;
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.background = colors.brass;
        }}
      >
        {status === 'submitting' ? tx.submitting : tx.button}
      </button>
      {status === 'error' && <ErrorMsg text={tx.error} />}
    </form>
  );
}

function ProviderForm({ lang, palette }) {
  const tx = t[lang].form;
  const providerTx = tx.providerApplication;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    serviceCategory: '',
    primaryNeighborhood: '',
    instagram: '',
    website: '',
    yearsInBusiness: '',
    aboutBusiness: '',
    credentials: [],
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (status === 'success') {
    return <SuccessMsg text={tx.providerSuccess} palette={palette} />;
  }

  const updateField = (field) => (event) => {
    const value = event.target.value;
    setFormData((current) => ({ ...current, [field]: value }));
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const toggleCredential = (credential) => {
    setFormData((current) => {
      const credentials = current.credentials.includes(credential)
        ? current.credentials.filter((item) => item !== credential)
        : [...current.credentials, credential];

      return { ...current, credentials };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    if (!formData.instagram.trim() && !formData.website.trim()) {
      setErrorMessage(providerTx.onlinePresenceError);
      return;
    }

    setStatus('submitting');

    try {
      await postSignup({
        type: 'provider',
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.trim(),
        providerApplication: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          businessName: formData.businessName.trim(),
          serviceCategory: formData.serviceCategory,
          primaryNeighborhood: formData.primaryNeighborhood,
          instagram: formData.instagram.trim(),
          website: formData.website.trim(),
          yearsInBusiness: formData.yearsInBusiness,
          aboutBusiness: formData.aboutBusiness.trim(),
          credentials: formData.credentials,
        },
      });
      setStatus('success');
    } catch {
      setStatus('idle');
      setErrorMessage(tx.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="lp-form-stack">
      <div className="lp-form-section">
        <div className="lp-form-section-title" style={{ color: palette.label }}>{providerTx.aboutYou}</div>
        <div className="lp-form-grid">
          <label className="lp-form-field">
            <span className="lp-form-field-label" style={{ color: palette.note }}>{providerTx.firstNameLabel}</span>
            <input
              type="text"
              placeholder={providerTx.firstNamePlaceholder}
              value={formData.firstName}
              onChange={updateField('firstName')}
              required
              style={inputStyle(palette)}
            />
          </label>
          <label className="lp-form-field">
            <span className="lp-form-field-label" style={{ color: palette.note }}>{providerTx.lastNameLabel}</span>
            <input
              type="text"
              placeholder={providerTx.lastNamePlaceholder}
              value={formData.lastName}
              onChange={updateField('lastName')}
              required
              style={inputStyle(palette)}
            />
          </label>
        </div>
        <div className="lp-form-grid">
          <label className="lp-form-field">
            <span className="lp-form-field-label" style={{ color: palette.note }}>{providerTx.emailLabel}</span>
            <input
              type="email"
              placeholder={providerTx.emailPlaceholder}
              value={formData.email}
              onChange={updateField('email')}
              required
              style={inputStyle(palette)}
            />
          </label>
          <label className="lp-form-field">
            <span className="lp-form-field-label" style={{ color: palette.note }}>{providerTx.phoneLabel}</span>
            <input
              type="tel"
              placeholder={providerTx.phonePlaceholder}
              value={formData.phone}
              onChange={updateField('phone')}
              required
              style={inputStyle(palette)}
            />
          </label>
        </div>
      </div>

      <div className="lp-form-section">
        <div className="lp-form-section-title" style={{ color: palette.label }}>{providerTx.yourBusiness}</div>
        <label className="lp-form-field">
          <span className="lp-form-field-label" style={{ color: palette.note }}>{providerTx.businessNameLabel}</span>
          <input
            type="text"
            placeholder={providerTx.businessNamePlaceholder}
            value={formData.businessName}
            onChange={updateField('businessName')}
            required
            style={inputStyle(palette)}
          />
        </label>
        <div className="lp-form-grid">
          <label className="lp-form-field">
            <span className="lp-form-field-label" style={{ color: palette.note }}>{providerTx.serviceCategoryLabel}</span>
            <select
              value={formData.serviceCategory}
              onChange={updateField('serviceCategory')}
              required
              style={inputStyle(palette, { appearance: 'none', cursor: 'pointer' })}
            >
              <option value="">{providerTx.serviceCategoryPlaceholder}</option>
              {providerTx.serviceCategoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="lp-form-field">
            <span className="lp-form-field-label" style={{ color: palette.note }}>{providerTx.primaryNeighborhoodLabel}</span>
            <select
              value={formData.primaryNeighborhood}
              onChange={updateField('primaryNeighborhood')}
              required
              style={inputStyle(palette, { appearance: 'none', cursor: 'pointer' })}
            >
              <option value="">{providerTx.primaryNeighborhoodPlaceholder}</option>
              {providerTx.primaryNeighborhoodOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="lp-form-section">
        <div className="lp-form-section-title" style={{ color: palette.label }}>{providerTx.onlinePresence}</div>
        <div className="lp-form-help" style={{ color: palette.note }}>{providerTx.onlinePresenceHint}</div>
        <div className="lp-form-grid">
          <label className="lp-form-field">
            <span className="lp-form-field-label" style={{ color: palette.note }}>{providerTx.instagramLabel}</span>
            <input
              type="text"
              placeholder={providerTx.instagramPlaceholder}
              value={formData.instagram}
              onChange={updateField('instagram')}
              style={inputStyle(palette)}
            />
          </label>
          <label className="lp-form-field">
            <span className="lp-form-field-label" style={{ color: palette.note }}>{providerTx.websiteLabel}</span>
            <input
              type="url"
              placeholder={providerTx.websitePlaceholder}
              value={formData.website}
              onChange={updateField('website')}
              style={inputStyle(palette)}
            />
          </label>
        </div>
      </div>

      <div className="lp-form-section">
        <div className="lp-form-section-title" style={{ color: palette.label }}>{providerTx.experience}</div>
        <label className="lp-form-field">
          <span className="lp-form-field-label" style={{ color: palette.note }}>{providerTx.yearsInBusinessLabel}</span>
          <select
            value={formData.yearsInBusiness}
            onChange={updateField('yearsInBusiness')}
            required
            style={inputStyle(palette, { appearance: 'none', cursor: 'pointer' })}
          >
            <option value="">{providerTx.yearsInBusinessPlaceholder}</option>
            {providerTx.yearsInBusinessOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="lp-form-section">
        <div className="lp-form-section-title" style={{ color: palette.label }}>{providerTx.aboutBusiness}</div>
        <label className="lp-form-field">
          <span className="lp-form-field-label" style={{ color: palette.note }}>{providerTx.aboutBusinessLabel}</span>
          <textarea
            placeholder={providerTx.aboutBusinessPlaceholder}
            value={formData.aboutBusiness}
            onChange={updateField('aboutBusiness')}
            required
            rows={5}
            style={inputStyle(palette, { minHeight: 132, resize: 'vertical' })}
          />
        </label>
      </div>

      <div className="lp-form-section">
        <div className="lp-form-section-title" style={{ color: palette.label }}>{providerTx.credentials}</div>
        <div className="lp-checkbox-grid">
          {providerTx.credentialsOptions.map((credential) => (
            <label
              key={credential}
              className="lp-checkbox-card"
              style={{
                background: palette.inputBg,
                borderColor: palette.inputBorder,
                color: palette.inputText,
              }}
            >
              <input
                type="checkbox"
                checked={formData.credentials.includes(credential)}
                onChange={() => toggleCredential(credential)}
              />
              <span className="lp-checkbox-label">{credential}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        style={buttonStyle(status === 'submitting')}
        onMouseEnter={(event) => {
          if (status !== 'submitting') event.currentTarget.style.background = colors.brassLight;
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.background = colors.brass;
        }}
      >
        {status === 'submitting' ? tx.submitting : tx.providerButton}
      </button>
      {errorMessage && <ErrorMsg text={errorMessage} />}
    </form>
  );
}

function PartnerForm({ lang, palette }) {
  const tx = t[lang].form;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('idle');

  if (status === 'success') {
    return <SuccessMsg text={tx.partnerSuccess} palette={palette} />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus('submitting');

    try {
      await postSignup({ type: 'partner', name: name.trim(), email: email.trim(), company: company.trim() });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="lp-form-stack">
      <input
        type="text"
        placeholder={tx.namePlaceholder}
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        style={inputStyle(palette)}
      />
      <input
        type="email"
        placeholder={tx.placeholder}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        style={inputStyle(palette)}
      />
      <input
        type="text"
        placeholder={tx.companyPlaceholder}
        value={company}
        onChange={(event) => setCompany(event.target.value)}
        style={inputStyle(palette)}
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={buttonStyle(status === 'submitting')}
        onMouseEnter={(event) => {
          if (status !== 'submitting') event.currentTarget.style.background = colors.brassLight;
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.background = colors.brass;
        }}
      >
        {status === 'submitting' ? tx.submitting : tx.partnerButton}
      </button>
      {status === 'error' && <ErrorMsg text={tx.error} />}
    </form>
  );
}

function getAudienceContent(audience, tx) {
  if (audience === 'providers') {
    return {
      key: 'providers',
      form: ProviderForm,
      label: tx.providers.label,
      title: tx.providers.title,
      body: tx.providers.body,
      formHeading: tx.providers.formHeading,
      note: tx.providers.note,
      highlights: tx.providers.highlights,
      stats: tx.providers.stats,
      spotlightLabel: tx.providers.spotlightLabel,
      spotlightTitle: tx.providers.spotlightTitle,
      spotlightBody: tx.providers.spotlightBody,
      sectionTitle: tx.providers.sectionTitle,
      sectionBody: tx.providers.sectionBody,
      cards: tx.providers.benefits.map((item, index) => ({
        eyebrow: `0${index + 1}`,
        title: item.title,
        body: item.desc,
      })),
      steps: tx.providers.steps,
      switchBody: tx.providers.switchBody,
      footer: tx.providers.footer,
    };
  }

  if (audience === 'partners') {
    return {
      key: 'partners',
      form: PartnerForm,
      label: tx.partners.label,
      title: tx.partners.title,
      body: tx.partners.body,
      note: tx.partners.note,
      highlights: tx.partners.highlights,
      stats: tx.partners.stats,
      spotlightLabel: tx.partners.spotlightLabel,
      spotlightTitle: tx.partners.spotlightTitle,
      spotlightBody: tx.partners.spotlightBody,
      sectionTitle: tx.partners.sectionTitle,
      sectionBody: tx.partners.sectionBody,
      cards: tx.partners.types.map((item, index) => ({
        eyebrow: `0${index + 1}`,
        title: item.title,
        body: item.desc,
      })),
      steps: tx.partners.steps,
      switchBody: tx.partners.switchBody,
      footer: tx.partners.footer,
    };
  }

  return {
    key: 'owners',
    form: OwnerForm,
    label: tx.owners.label,
    title: tx.owners.title,
    body: tx.owners.body,
    note: tx.owners.note,
    highlights: tx.owners.highlights,
    stats: tx.owners.stats,
    spotlightLabel: tx.owners.spotlightLabel,
    spotlightTitle: tx.owners.spotlightTitle,
    spotlightBody: tx.owners.spotlightBody,
    sectionTitle: tx.owners.sectionTitle,
    sectionBody: tx.owners.sectionBody,
    cards: tx.services.map((item, index) => ({
      eyebrow: `0${index + 1}`,
      title: item.name,
      body: item.sub,
    })),
    steps: tx.owners.steps,
    switchBody: tx.owners.switchBody,
  };
}

function AudienceSwitchCard({ audienceKey, currentAudience, lang, palette }) {
  const tx = t[lang];
  const path = AUDIENCE_PATHS[audienceKey];
  const isActive = audienceKey === currentAudience;

  const descriptions = {
    owners: tx.owners.switchBody,
    providers: tx.providers.switchBody,
    partners: tx.partners.switchBody,
  };

  const labels = {
    owners: tx.nav.owners,
    providers: tx.nav.providers,
    partners: tx.nav.partners,
  };

  return (
    <Link
      to={path}
      className={`lp-switch-card ${isActive ? 'is-active' : ''}`}
      style={surfaceCardStyle(isActive ? palette.cardSurface : palette.softCardSurface, palette)}
    >
      <div className="lp-switch-card-label" style={{ color: palette.label }}>
        {labels[audienceKey]}
      </div>
      <div className="lp-switch-card-body" style={{ color: palette.muted }}>
        {descriptions[audienceKey]}
      </div>
    </Link>
  );
}

function KynoPlusSection({ lang, palette }) {
  const plusTx = t[lang].owners.plus;

  return (
    <section className="lp-plus-shell" style={palette.sectionSurface}>
      <div className="lp-shell">
        <div className="lp-plus-panel" data-reveal="scale" style={surfaceCardStyle(palette.cardSurface, palette)}>
          <div className="lp-plus-layout">
            <div className="lp-plus-copy">
              <div className="lp-kicker" style={{ color: palette.label }}>
                {plusTx.label}
              </div>
              <h2 className="lp-section-title" style={{ color: palette.title }}>
                {plusTx.title}
              </h2>
              <p className="lp-section-body" style={{ color: palette.muted }}>
                {plusTx.body}
              </p>

              <div className="lp-plus-actions">
                <Link
                  to="/auth/create-account?intent=kyno-plus"
                  className="lp-plus-primary"
                  style={{
                    background: colors.brass,
                    color: colors.espresso,
                    borderColor: 'transparent',
                  }}
                >
                  {plusTx.primaryCta}
                </Link>
                <Link
                  to="/auth/sign-in?intent=kyno-plus"
                  className="lp-plus-secondary"
                  style={{
                    color: palette.text,
                    borderColor: palette.border,
                    background: palette.chipBg,
                  }}
                >
                  {plusTx.secondaryCta}
                </Link>
              </div>

              <div className="lp-plus-note" style={{ color: palette.note }}>
                {plusTx.note}
              </div>
            </div>

            <div className="lp-card-grid">
              {plusTx.benefits.map((item, index) => (
                <div key={item.title} className="lp-card" style={surfaceCardStyle(palette.softCardSurface, palette)}>
                  <div className="lp-card-eyebrow" style={{ color: palette.label }}>
                    0{index + 1}
                  </div>
                  <div className="lp-card-title" style={{ color: palette.title }}>
                    {item.title}
                  </div>
                  <div className="lp-card-body" style={{ color: palette.muted }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WebLanding({ audience = 'owners', lang, isDark }) {
  const tx = t[lang];
  const palette = getPalette(isDark);
  const content = getAudienceContent(audience, tx);
  const FormComponent = content.form;

  useScrollReveal();

  const heroRef = useRef(null);
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onScroll = () => {
      const y = window.scrollY;
      if (isDarkRef.current) {
        hero.style.backgroundPosition = `calc(100% + 90px) ${-90 + y * 0.12}px, center`;
      } else {
        hero.style.backgroundPosition = `100% ${y * 0.10}px, center`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="lp-page" style={{ ...palette.pageSurface }}>
      <section ref={heroRef} className="lp-hero-shell" style={palette.heroSurface}>
        <div className="lp-shell">
          <div className="lp-hero-layout">
            <div className="lp-hero-copy">
              <div className="lp-kicker" data-reveal="fade" style={{ color: palette.label }}>
                {content.label}
              </div>
              <h1 className="lp-hero-title" data-reveal data-reveal-delay="1" style={{ color: palette.title }}>
                {content.title}
              </h1>
              <p className="lp-hero-body" data-reveal data-reveal-delay="2" style={{ color: palette.muted }}>
                {content.body}
              </p>

              <div className="lp-chip-row" data-reveal data-reveal-delay="3">
                {content.highlights.map((item) => (
                  <span
                    key={item}
                    className="lp-chip"
                    style={{ color: palette.text, background: palette.chipBg, borderColor: palette.border }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div
                id="join"
                className="lp-form-card"
                data-reveal="scale"
                data-reveal-delay="4"
                style={surfaceCardStyle(
                  palette.cardSurface,
                  palette,
                  content.key === 'providers' ? { maxWidth: '100%' } : {}
                )}
              >
                <div className="lp-form-heading" style={{ color: palette.title }}>
                  {content.formHeading ?? tx.shared.formHeading}
                </div>
                <FormComponent lang={lang} palette={palette} />
                <div className="lp-form-note" style={{ color: palette.note }}>
                  {content.note}
                </div>
              </div>
            </div>

            <div className="lp-hero-aside">
              <div className="lp-spotlight-card" data-reveal="scale" style={surfaceCardStyle(palette.softCardSurface, palette)}>
                <div className="lp-kicker" style={{ color: palette.label }}>
                  {content.spotlightLabel}
                </div>
                <div className="lp-spotlight-title" style={{ color: palette.title }}>
                  {content.spotlightTitle}
                </div>
                <p className="lp-spotlight-body" style={{ color: palette.muted }}>
                  {content.spotlightBody}
                </p>
                {content.footer ? (
                  <div className="lp-spotlight-footer" style={{ color: palette.note }}>
                    {content.footer}
                  </div>
                ) : null}
              </div>

              <div className="lp-stat-grid">
                {content.stats.map((stat, index) => (
                  <div key={stat.label} className="lp-stat-card" data-reveal data-reveal-delay={String(index + 1)} style={surfaceCardStyle(palette.cardSurface, palette)}>
                    <div className="lp-stat-value" style={{ color: palette.title }}>
                      {stat.value}
                    </div>
                    <div className="lp-stat-label" style={{ color: palette.note }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="lp-card-grid">
                {content.cards.map((card, index) => (
                  <div key={card.title} className="lp-card" data-reveal data-reveal-delay={String((index % 5) + 1)} style={surfaceCardStyle(palette.softCardSurface, palette)}>
                    <div className="lp-card-eyebrow" style={{ color: palette.label }}>
                      {card.eyebrow}
                    </div>
                    <div className="lp-card-title" style={{ color: palette.title }}>
                      {card.title}
                    </div>
                    <div className="lp-card-body" style={{ color: palette.muted }}>
                      {card.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {content.key === 'owners' ? <KynoPlusSection lang={lang} palette={palette} /> : null}

      <section className="lp-section-shell" style={palette.sectionSurface}>
        <div className="lp-shell">
          <div className="lp-section-layout">
            <div>
              <div className="lp-kicker" data-reveal="fade" style={{ color: palette.label }}>
                {tx.shared.detailLabel}
              </div>
              <h2 className="lp-section-title" data-reveal data-reveal-delay="1" style={{ color: palette.title }}>
                {content.sectionTitle}
              </h2>
              <p className="lp-section-body" data-reveal data-reveal-delay="2" style={{ color: palette.muted }}>
                {content.sectionBody}
              </p>
            </div>

            <div className="lp-step-panel" data-reveal="scale" style={surfaceCardStyle(palette.cardSurface, palette)}>
              {content.steps.map((step, index) => (
                <div key={step.title} className="lp-step-row">
                  <div className="lp-step-index">{index + 1}</div>
                  <div>
                    <div className="lp-step-title" style={{ color: palette.title }}>
                      {step.title}
                    </div>
                    <div className="lp-step-body" style={{ color: palette.muted }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lp-switch-panel" data-reveal style={surfaceCardStyle(palette.softCardSurface, palette)}>
            <div className="lp-kicker" style={{ color: palette.label }}>
              {tx.shared.audienceSwitchLabel}
            </div>
            <div className="lp-switch-header">
              <h2 className="lp-section-title" style={{ color: palette.title }}>
                {tx.shared.audienceSwitchTitle}
              </h2>
              <p className="lp-section-body" style={{ color: palette.muted }}>
                {tx.shared.audienceSwitchBody}
              </p>
            </div>

            <div className="lp-switch-grid">
              <AudienceSwitchCard audienceKey="owners" currentAudience={content.key} lang={lang} palette={palette} />
              <AudienceSwitchCard audienceKey="providers" currentAudience={content.key} lang={lang} palette={palette} />
              <AudienceSwitchCard audienceKey="partners" currentAudience={content.key} lang={lang} palette={palette} />
            </div>
          </div>
        </div>
      </section>

      <footer className="lp-footer" style={palette.footerSurface}>
        <div className="lp-shell lp-footer-inner">
          <div className="lp-footer-brand">
            <div className="lp-footer-mark">K</div>
            <div>
              <div className="lp-footer-name" style={{ color: palette.title }}>
                Kyno
              </div>
              <div className="lp-footer-tagline" style={{ color: palette.note }}>
                {tx.shared.footerTagline}
              </div>
            </div>
          </div>

          <div className="lp-footer-links">
            <Link to="/" style={{ color: palette.muted }}>
              {tx.nav.owners}
            </Link>
            <Link to="/providers" style={{ color: palette.muted }}>
              {tx.nav.providers}
            </Link>
            <Link to="/partners" style={{ color: palette.muted }}>
              {tx.nav.partners}
            </Link>
            <Link to="/privacy" style={{ color: palette.muted }}>
              {tx.footerLinks.privacy}
            </Link>
            <Link to="/terms" style={{ color: palette.muted }}>
              {tx.footerLinks.terms}
            </Link>
          </div>

          <div className="lp-footer-legal" style={{ color: palette.note }}>
            {tx.footer}
          </div>
        </div>
      </footer>
    </div>
  );
}
