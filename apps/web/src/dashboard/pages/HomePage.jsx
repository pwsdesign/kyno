import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { services } from '../constants/services';
import { fetchCareInsights } from '../services/aiService';
import { listBookings } from '../services/bookingService';
import IconBadge from '../components/IconBadge';

export default function HomePage() {
  const { profile, dogs } = useAuth();
  const [insights, setInsights] = useState([]);
  const [upcoming, setUpcoming] = useState(null);

  useEffect(() => {
    fetchCareInsights().then(setInsights).catch(() => {});
    listBookings({ upcomingOnly: true, limit: 1 }).then(bookings => {
      if (bookings.length > 0) setUpcoming(bookings[0]);
    }).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = profile?.first_name || 'there';
  const dogName = dogs[0]?.name;

  return (
    <div>
      <h1 className="k-heading k-heading--xl" style={{ marginBottom: 4 }}>
        {greeting},<br />{firstName}
      </h1>
      <p className="k-caption k-mb-lg">Miami, FL</p>

      {/* Upcoming booking */}
      {upcoming && (
        <div className="k-card k-mb-lg">
          <div className="k-label k-mb-sm" style={{ color: 'var(--k-accent)' }}>Next booking</div>
          <div className="k-flex" style={{ alignItems: 'center', gap: 12 }}>
            <IconBadge label={upcoming.service_id?.[0]?.toUpperCase() || 'W'} size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{upcoming.provider_name}</div>
              <div className="k-caption">
                {new Date(upcoming.scheduled_for).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                {' · '}
                {new Date(upcoming.scheduled_for).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </div>
            </div>
            <span className={`k-badge k-badge--${upcoming.status || 'confirmed'}`}>{upcoming.status || 'Confirmed'}</span>
          </div>
        </div>
      )}

      {/* Services grid */}
      <div className="k-flex-between k-mb-md">
        <span className="k-label">Services</span>
        <Link to="/dashboard/services" style={{ fontSize: 12, color: 'var(--k-accent)' }}>See all</Link>
      </div>
      <div className="k-services-grid k-mb-lg">
        {services.map((svc, i) => (
          <Link
            key={svc.id}
            to={`/dashboard/booking/${svc.id}`}
            className={`k-service-card ${i === 0 ? 'k-service-card--featured' : ''} ${svc.isEmergency ? 'k-service-card--emergency' : ''}`}
          >
            <div className="k-flex" style={{ alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <IconBadge label={svc.icon} size={36} emergency={svc.isEmergency} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 500, color: svc.isEmergency ? '#FCA5A5' : 'var(--k-text)' }}>{svc.name}</div>
                <div style={{ fontSize: 12, color: svc.isEmergency ? 'rgba(252,165,165,0.7)' : 'var(--k-text-tertiary)' }}>{svc.sub}</div>
              </div>
            </div>
            <div className="k-flex-between" style={{ fontSize: 11, color: svc.isEmergency ? 'rgba(252,165,165,0.6)' : 'var(--k-text-tertiary)' }}>
              <span>{svc.count}</span>
              <span>{svc.range}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* AI Insights */}
      {insights.length > 0 && dogName && (
        <div className="k-card k-card--dark">
          <div className="k-label k-mb-md" style={{ color: 'var(--k-accent)' }}>AI Insights for {dogName}</div>
          {insights.map((insight, i) => (
            <div key={i} className="k-flex" style={{ gap: 10, marginBottom: i < insights.length - 1 ? 12 : 0 }}>
              <span style={{ color: 'var(--k-accent)', flexShrink: 0 }}>{'\u25C6'}</span>
              <span style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--k-warm-200)' }}>{insight}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
