import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { dogs } = useAuth();

  return (
    <div>
      <div className="k-flex-between k-mb-lg">
        <h1 className="k-heading k-heading--xl">Dogs</h1>
        <Link to="/dashboard/dogs" className="k-btn k-btn--secondary k-btn--sm">Edit</Link>
      </div>

      {dogs.length === 0 ? (
        <div className="k-card k-text-center" style={{ padding: 40 }}>
          <p className="k-body">No dogs added yet</p>
          <Link to="/dashboard/dogs" className="k-btn k-btn--primary k-mt-md">Add a dog</Link>
        </div>
      ) : (
        <div className="k-flex" style={{ gap: 16, overflowX: 'auto', paddingBottom: 8, scrollSnapType: 'x mandatory' }}>
          {dogs.map(dog => (
            <div key={dog.id} className="k-dog-card">
              <div className="k-flex" style={{ gap: 16, marginBottom: 16 }}>
                <div className="k-dog-card__photo">
                  {dog.profile_photo_data ? (
                    <img src={dog.profile_photo_data} alt={dog.name} />
                  ) : (
                    dog.name?.[0]?.toUpperCase() || '?'
                  )}
                </div>
                <div>
                  <div className="k-heading k-heading--md">{dog.name}</div>
                  <div className="k-caption">{dog.breed || 'Breed not set'}</div>
                </div>
              </div>

              <div className="k-dog-detail-grid">
                <div className="k-dog-detail-row">
                  <span className="k-dog-detail-row__label">Date of birth</span>
                  <span className="k-dog-detail-row__value">{dog.dob || '—'}</span>
                </div>
                <div className="k-dog-detail-row">
                  <span className="k-dog-detail-row__label">Weight</span>
                  <span className="k-dog-detail-row__value">{dog.weight || '—'}</span>
                </div>
                <div className="k-dog-detail-row">
                  <span className="k-dog-detail-row__label">Sex</span>
                  <span className="k-dog-detail-row__value">{dog.sex || '—'}</span>
                </div>
                <div className="k-dog-detail-row">
                  <span className="k-dog-detail-row__label">Altered</span>
                  <span className="k-dog-detail-row__value">{dog.altered_status || '—'}</span>
                </div>
              </div>

              {dog.personality && (
                <div className="k-dog-detail-row k-mt-md">
                  <span className="k-dog-detail-row__label">Personality</span>
                  <span className="k-dog-detail-row__value">{dog.personality}</span>
                </div>
              )}
              {dog.care_notes && (
                <div className="k-dog-detail-row k-mt-sm">
                  <span className="k-dog-detail-row__label">Care notes</span>
                  <span className="k-dog-detail-row__value">{dog.care_notes}</span>
                </div>
              )}
              {dog.vaccine_history_name && (
                <div className="k-dog-detail-row k-mt-sm">
                  <span className="k-dog-detail-row__label">Vaccines</span>
                  <span className="k-dog-detail-row__value">{dog.vaccine_history_name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
