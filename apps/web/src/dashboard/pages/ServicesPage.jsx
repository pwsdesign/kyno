import { Link } from 'react-router-dom';
import { services } from '../constants/services';
import IconBadge from '../components/IconBadge';

export default function ServicesPage() {
  return (
    <div>
      <h1 className="k-heading k-heading--xl k-mb-sm">Services</h1>
      <p className="k-body k-mb-lg">Premium care in Miami</p>

      <div className="k-flex-col k-gap-md">
        {services.map(svc => (
          <Link
            key={svc.id}
            to={`/dashboard/booking/${svc.id}`}
            className={`k-card ${svc.isEmergency ? 'k-card--emergency' : ''}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div className="k-flex" style={{ alignItems: 'center', gap: 16 }}>
              <IconBadge label={svc.icon} size={48} emergency={svc.isEmergency} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: svc.isEmergency ? '#FCA5A5' : 'var(--k-text)' }}>{svc.name}</div>
                <div style={{ fontSize: 13, color: svc.isEmergency ? 'rgba(252,165,165,0.7)' : 'var(--k-text-secondary)', marginTop: 2 }}>{svc.desc}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 12, color: svc.isEmergency ? 'rgba(252,165,165,0.6)' : 'var(--k-text-tertiary)' }}>{svc.count}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: svc.isEmergency ? '#FCA5A5' : 'var(--k-accent)', marginTop: 2 }}>{svc.range}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
