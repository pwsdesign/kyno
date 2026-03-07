import { services } from '../data/services';

export default function ServicesScreen({ onProviderTap }) {
  return (
    <div className="screen">
      <div className="services-screen fade-up fade-up-1">
        <div className="services-screen-title">Services</div>
        <div className="services-screen-sub">Everything Mango needs, in one place.</div>

        {services.map((s, i) => (
          <div
            key={s.id}
            className={`service-full-card fade-up fade-up-${i + 1} ${s.isEmergency ? 'emerg-card' : ''}`}
            onClick={() => onProviderTap(s.id)}
          >
            <div className="service-full-inner">
              <div className="service-full-icon-wrap">{s.icon}</div>
              <div className="service-full-info">
                <div className="service-full-name">{s.name}</div>
                <div className="service-full-desc">{s.desc}</div>
              </div>
              <div className="service-full-arrow">→</div>
            </div>
            <div className="service-full-meta">
              <div className="service-full-count">{s.count}</div>
              <div className="service-full-range">{s.range}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
