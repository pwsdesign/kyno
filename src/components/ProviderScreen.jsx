import { useEffect, useMemo, useState } from 'react';
import { colors } from '../styles/tokens';
import { providerDirectory, services } from '../data/services';

const DATES = [
  { day: "Thu", date: "27" },
  { day: "Fri", date: "28" },
  { day: "Sat", date: "1"  },
  { day: "Sun", date: "2"  },
  { day: "Mon", date: "3"  },
];

const TIMES = ["7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "4:00 PM", "5:00 PM"];

export default function ProviderScreen({ serviceId = 'walk', onBack }) {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(0);

  const providers = useMemo(
    () => providerDirectory[serviceId] || providerDirectory.walk,
    [serviceId]
  );

  const selectedService = useMemo(
    () => services.find((service) => service.id === serviceId),
    [serviceId]
  );

  useEffect(() => {
    setSelectedProvider(0);
  }, [serviceId]);

  const currentProvider = providers[selectedProvider] || providers[0];

  if (!currentProvider) {
    return null;
  }

  return (
    <div className="screen">
      <div className="provider-screen">
        {/* Hero */}
        <div className="provider-hero fade-up fade-up-1">
          <div className="provider-hero-texture" />
          <div className="provider-back" onClick={onBack}>←</div>
          <div className="provider-hero-emoji">{currentProvider.icon || selectedService?.icon || '🐕'}</div>
        </div>

        <div className="provider-body">
          <div className="fade-up fade-up-2">
            <div className="provider-section-title provider-picker-title">
              Choose {selectedService?.name || 'Provider'}
            </div>
            <div className="provider-picker-row">
              {providers.map((provider, index) => (
                <div
                  key={provider.name}
                  className={`provider-picker-card ${selectedProvider === index ? 'selected' : ''}`}
                  onClick={() => setSelectedProvider(index)}
                >
                  <div className="provider-picker-top">
                    <span className="provider-picker-icon">{provider.icon || '🐾'}</span>
                    {provider.brandBadge && (
                      <span className="provider-brand-badge">{provider.brandBadge}</span>
                    )}
                  </div>
                  <div className="provider-picker-name">{provider.name}</div>
                  <div className="provider-picker-meta">{provider.category}</div>
                  <div className="provider-picker-price">{provider.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="fade-up fade-up-3">
            <div className="provider-header">
              <div>
                <div className="provider-name">{currentProvider.name}</div>
                <div className="provider-category">{currentProvider.category}</div>
              </div>
              <div className="provider-rating">
                <span className="provider-stars">★★★★★</span>
                <span className="provider-rating-num">{currentProvider.rating}</span>
              </div>
            </div>
            <div className="provider-tags">
              {currentProvider.tags.map(tag => (
                <span key={tag} className="provider-tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* Date picker */}
          <div className="fade-up fade-up-4">
            <div className="provider-section-title">Select a date</div>
            <div className="availability-row">
              {DATES.map((d, i) => (
                <div
                  key={i}
                  className={`avail-slot ${selectedDate === i ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(i)}
                >
                  <div className="avail-day">{d.day}</div>
                  <div className="avail-date">{d.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Time picker */}
          <div className="fade-up fade-up-5">
            <div className="provider-section-title">Select a time</div>
            <div className="time-row">
              {TIMES.map((t, i) => (
                <div
                  key={i}
                  className={`time-chip ${selectedTime === i ? 'selected' : ''}`}
                  onClick={() => setSelectedTime(i)}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Book CTA */}
          <button className="book-btn fade-up fade-up-5">
            <span>Book {selectedService?.name || 'Service'}</span>
            <span className="book-price">{currentProvider.price}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
