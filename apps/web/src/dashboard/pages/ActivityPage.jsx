import { useState, useEffect } from 'react';
import { listBookings } from '../services/bookingService';
import IconBadge from '../components/IconBadge';

export default function ActivityPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listBookings().then(setBookings).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="k-spinner" />;

  return (
    <div>
      <h1 className="k-heading k-heading--xl k-mb-lg">Activity</h1>

      {bookings.length === 0 ? (
        <div className="k-card k-text-center" style={{ padding: 40 }}>
          <p className="k-body">No bookings yet</p>
          <p className="k-caption k-mt-sm">Book a service to see your activity here.</p>
        </div>
      ) : (
        <div className="k-flex-col k-gap-sm">
          {bookings.map(b => (
            <div key={b.id} className="k-card">
              <div className="k-flex" style={{ alignItems: 'center', gap: 14 }}>
                <IconBadge label={b.service_id?.[0]?.toUpperCase() || '?'} size={42} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{b.provider_name}</div>
                  <div className="k-caption">
                    {new Date(b.scheduled_for).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    {' · '}
                    {new Date(b.scheduled_for).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                  {b.provider_category && <div className="k-caption" style={{ fontSize: 11 }}>{b.provider_category}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`k-badge k-badge--${b.status || 'confirmed'}`}>{b.status || 'confirmed'}</span>
                  {b.price_label && <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>{b.price_label}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
