import { colors } from '../styles/tokens';

export default function HomeScreen({ onServiceTap, onProviderTap }) {
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

      {/* Upcoming */}
      <div className="section-header fade-up fade-up-3">
        <div className="section-title">Upcoming</div>
        <div className="section-link">View all →</div>
      </div>

      <div className="upcoming-card fade-up fade-up-3">
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
