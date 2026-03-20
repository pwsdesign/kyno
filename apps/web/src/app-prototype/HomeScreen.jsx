import { useEffect, useState } from 'react';
import { colors } from '../styles/tokens';
import { fetchCareInsights } from '../services/aiService';

export default function HomeScreen({ onServiceTap, onProviderTap }) {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetchCareInsights().then(setInsights);
  }, []);

  return (
    <div className="screen">
      {/* Header */}
      <div className="home-header fade-up fade-up-1">
        <div>
          <div className="greeting-label">Good morning</div>
          <div className="greeting-name">Sofia</div>
        </div>
        <div className="header-avatar">S</div>
      </div>

      {/* Services */}
      <div className="section-header fade-up fade-up-2">
        <div className="section-title">Services</div>
        <div className="section-link" onClick={onServiceTap}>See all →</div>
      </div>

      <div className="services-grid fade-up fade-up-2">
        <div className="service-card featured" onClick={() => onProviderTap('walk')}>
          <div className="service-icon">🦮</div>
          <div className="service-text">
            <div className="service-name">Walkers</div>
            <div className="service-sub">6 available near you</div>
          </div>
          <div style={{ color: colors.brass, fontSize: 20 }}>→</div>
        </div>

        <div className="service-card" onClick={() => onProviderTap('groom')}>
          <span className="service-badge">Popular</span>
          <span className="service-icon">✂️</span>
          <div className="service-name">Groomers</div>
          <div className="service-sub">4 available</div>
        </div>

        <div className="service-card" onClick={() => onProviderTap('hotel')}>
          <span className="service-icon">🏡</span>
          <div className="service-name">Hotels</div>
          <div className="service-sub">3 dog hotels</div>
        </div>

        <div className="service-card" onClick={() => onProviderTap('vet')}>
          <span className="service-icon">🩺</span>
          <div className="service-name">Vets</div>
          <div className="service-sub">2 vet hospitals</div>
        </div>

        <div className="service-card" onClick={() => onProviderTap('shop')}>
          <span className="service-icon">🛍️</span>
          <div className="service-name">Shop</div>
          <div className="service-sub">Chewy + Farmer's Dog</div>
        </div>

        <div className="service-card emergency" onClick={() => onProviderTap('emergency')}>
          <span className="service-icon">🚨</span>
          <div className="service-name">Emergency</div>
          <div className="service-sub">24/7 urgent care</div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="section-header fade-up fade-up-3">
        <div className="section-title">AI Insights</div>
        <div style={{ fontSize: 9, color: colors.brass, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
          For Mango
        </div>
      </div>

      <div className="ai-card fade-up fade-up-3">
        <div className="ai-card-glow" />
        <div className="ai-card-label">
          <span>◆</span>
          <span>Kyno AI · Care Intelligence</span>
        </div>

        {!insights ? (
          <div>
            <div className="ai-loading-bar" style={{ width: '100%' }} />
            <div className="ai-loading-bar" style={{ width: '82%' }} />
            <div className="ai-loading-bar" style={{ width: '66%' }} />
          </div>
        ) : (
          insights.map((insight, i) => (
            <div key={i} className="ai-insight-item">
              <span className="ai-insight-dot">◆</span>
              <span className="ai-insight-text">{insight}</span>
            </div>
          ))
        )}
      </div>

      {/* Upcoming */}
      <div className="section-header fade-up fade-up-4">
        <div className="section-title">Upcoming</div>
        <div className="section-link">View all →</div>
      </div>

      <div className="upcoming-card fade-up fade-up-4">
        <div className="upcoming-date-block">
          <div className="upcoming-day">28</div>
          <div className="upcoming-month">Feb</div>
        </div>
        <div className="upcoming-details">
          <div className="upcoming-title">Morning Walk</div>
          <div className="upcoming-provider">Carlos M. · Brickell</div>
        </div>
        <div className="upcoming-time">8:00 AM<br />60 min</div>
      </div>

      <div style={{ height: 24 }} />
    </div>
  );
}
