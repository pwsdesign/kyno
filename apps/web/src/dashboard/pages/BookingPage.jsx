import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { services, providerDirectory } from '../constants/services';
import { computeMatchScore } from '../services/aiService';
import { createBooking } from '../services/bookingService';
import IconBadge from '../components/IconBadge';

const TIME_SLOTS = ['7:00 AM', '9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

function getNextDays(count) {
  const days = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      full: d.toISOString().split('T')[0],
    });
  }
  return days;
}

export default function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { dogs } = useAuth();
  const service = services.find(s => s.id === serviceId) || services[0];
  const providers = providerDirectory[serviceId] || [];
  const dates = getNextDays(5);

  const [selectedProvider, setSelectedProvider] = useState(0);
  const [selectedDog, setSelectedDog] = useState(dogs[0]?.id || null);
  const [selectedDate, setSelectedDate] = useState(dates[0]?.full);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[4]);
  const [loading, setLoading] = useState(false);

  async function handleBook() {
    if (!providers[selectedProvider]) return;
    setLoading(true);
    try {
      const provider = providers[selectedProvider];
      const [hours, rest] = selectedTime.split(':');
      const [mins, ampm] = rest.split(' ');
      let h = parseInt(hours);
      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      const scheduledFor = new Date(`${selectedDate}T${String(h).padStart(2, '0')}:${mins}:00`).toISOString();

      await createBooking({
        serviceId,
        providerName: provider.name,
        providerCategory: provider.category,
        priceLabel: provider.price,
        dogId: selectedDog,
        scheduledFor,
      });
      alert('Booking confirmed!');
      navigate('/dashboard/activity');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="k-flex" style={{ alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <IconBadge label={service.icon} size={48} emergency={service.isEmergency} />
        <div>
          <h1 className="k-heading k-heading--lg">{service.name}</h1>
          <p className="k-caption">{service.sub}</p>
        </div>
      </div>

      {/* Providers */}
      <div className="k-label k-mb-sm">Choose a provider</div>
      <div className="k-provider-scroll k-mb-lg">
        {providers.map((p, i) => {
          const score = computeMatchScore(p);
          return (
            <div
              key={i}
              className={`k-provider-card ${i === selectedProvider ? 'k-provider-card--selected' : ''}`}
              onClick={() => setSelectedProvider(i)}
            >
              <div className="k-flex" style={{ gap: 12, marginBottom: 12 }}>
                <IconBadge label={p.icon} size={44} bg="var(--k-surface-raised)" fg="var(--k-text-secondary)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
                  <div className="k-caption">{p.category}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--k-accent)' }}>{score}%</div>
                  <div style={{ fontSize: 11, color: 'var(--k-text-tertiary)' }}>match</div>
                </div>
              </div>
              <div className="k-flex-between" style={{ marginBottom: 8 }}>
                <div className="k-flex" style={{ gap: 4 }}>
                  <span style={{ color: 'var(--k-accent)', fontSize: 12 }}>{'*'.repeat(5)}</span>
                  <span style={{ fontSize: 12, color: 'var(--k-text-secondary)' }}>{p.rating}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{p.price}</span>
              </div>
              <div className="k-flex" style={{ gap: 6, flexWrap: 'wrap' }}>
                {p.tags.map(tag => (
                  <span key={tag} style={{ padding: '3px 8px', borderRadius: 100, border: '1px solid var(--k-border)', fontSize: 10, color: 'var(--k-text-tertiary)' }}>{tag}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dog selector */}
      {dogs.length > 0 && (
        <>
          <div className="k-label k-mb-sm">Select dog</div>
          <div className="k-dog-chips k-mb-lg">
            {dogs.map(d => (
              <div
                key={d.id}
                className={`k-dog-chip ${selectedDog === d.id ? 'k-dog-chip--selected' : ''}`}
                onClick={() => setSelectedDog(d.id)}
              >{d.name}</div>
            ))}
          </div>
        </>
      )}

      {/* Date picker */}
      <div className="k-label k-mb-sm">Date</div>
      <div className="k-date-scroll k-mb-lg">
        {dates.map(d => (
          <div
            key={d.full}
            className={`k-date-chip ${selectedDate === d.full ? 'k-date-chip--selected' : ''}`}
            onClick={() => setSelectedDate(d.full)}
          >
            <div style={{ fontSize: 10, textTransform: 'uppercase' }}>{d.label}</div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>{d.date}</div>
          </div>
        ))}
      </div>

      {/* Time picker */}
      <div className="k-label k-mb-sm">Time</div>
      <div className="k-time-grid k-mb-lg">
        {TIME_SLOTS.map(t => (
          <div
            key={t}
            className={`k-time-chip ${selectedTime === t ? 'k-time-chip--selected' : ''}`}
            onClick={() => setSelectedTime(t)}
          >{t}</div>
        ))}
      </div>

      <button className="k-btn k-btn--primary k-btn--full" onClick={handleBook} disabled={loading || providers.length === 0}>
        {loading ? 'Booking...' : `Book ${providers[selectedProvider]?.name || 'Provider'}`}
      </button>
    </div>
  );
}
