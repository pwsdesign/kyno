import { colors } from '../styles/tokens';

const DOG_PROFILE = {
  name: 'Mango',
  dob: 'May 14, 2022',
  vaccines: ['Rabies', 'DHPP', 'Bordetella', 'Leptospirosis'],
  breed: 'Golden Retriever',
  weight: '68 lb',
  personality: 'Friendly, playful, social, food-motivated',
  gender: 'Male',
  alteredStatus: 'Neutered',
  preferredFood: "The Farmer's Dog — Turkey Recipe",
  insurance: 'Healthy Paws · Policy #HP-482901 · Active',
};

export default function ProfileScreen() {
  return (
    <div className="screen">
      {/* Header */}
      <div className="home-header fade-up fade-up-1">
        <div>
          <div className="greeting-label">Account</div>
          <div className="greeting-name">Sofia</div>
        </div>
        <div className="header-avatar">S</div>
      </div>

      {/* Dog Profile Card */}
      <div className="dog-card fade-up fade-up-2">
        <div className="dog-card-texture" />
        <div className="dog-card-label">Dog Profile — Active</div>
        <div className="dog-card-main">
          <div className="dog-avatar">🐕</div>
          <div className="dog-info">
            <div className="dog-name">{DOG_PROFILE.name}</div>
            <div className="dog-breed">{DOG_PROFILE.breed} · {DOG_PROFILE.gender}</div>
          </div>
        </div>

        <div className="dog-profile-grid">
          <div className="dog-profile-item">
            <div className="dog-profile-key">DOB</div>
            <div className="dog-profile-value">{DOG_PROFILE.dob}</div>
          </div>
          <div className="dog-profile-item">
            <div className="dog-profile-key">Weight</div>
            <div className="dog-profile-value">{DOG_PROFILE.weight}</div>
          </div>
          <div className="dog-profile-item">
            <div className="dog-profile-key">Gender</div>
            <div className="dog-profile-value">{DOG_PROFILE.gender}</div>
          </div>
          <div className="dog-profile-item">
            <div className="dog-profile-key">Status</div>
            <div className="dog-profile-value">{DOG_PROFILE.alteredStatus}</div>
          </div>
        </div>

        <div className="dog-profile-row">
          <div className="dog-profile-key">Personality</div>
          <div className="dog-profile-value">{DOG_PROFILE.personality}</div>
        </div>

        <div className="dog-profile-row">
          <div className="dog-profile-key">Preferred Food</div>
          <div className="dog-profile-value">{DOG_PROFILE.preferredFood}</div>
        </div>

        <div className="dog-profile-row">
          <div className="dog-profile-key">Vaccines</div>
          <div className="dog-vaccine-list">
            {DOG_PROFILE.vaccines.map((vaccine) => (
              <span key={vaccine} className="dog-vaccine-chip">{vaccine}</span>
            ))}
          </div>
        </div>

        <div className="dog-profile-row">
          <div className="dog-profile-key">Insurance</div>
          <div className="dog-profile-value">{DOG_PROFILE.insurance}</div>
        </div>
      </div>

      <div style={{ height: 24 }} />
    </div>
  );
}
