import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/authService';
import { getMembershipPlanLabel } from '../services/kynoPlusService';
import SettingsRow from '../components/SettingsRow';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();

  useEffect(() => {
    refreshProfile().catch(() => {});
  }, []);

  async function handleSignOut() {
    if (!window.confirm('Are you sure you want to sign out?')) return;
    await signOut();
    navigate('/auth/welcome', { replace: true });
  }

  return (
    <div>
      <h1 className="k-heading k-heading--xl k-mb-lg">Settings</h1>

      <div className="k-settings-group">
        <div className="k-settings-group__title">Account</div>
        <SettingsRow label="Owner Profile" onClick={() => navigate('/dashboard/account')} />
        <SettingsRow label="Email" value={profile?.email} />
        <SettingsRow label="Phone" value={profile?.phone} />
        <SettingsRow label="Dog Profiles" onClick={() => navigate('/dashboard/dogs')} />
      </div>

      <div className="k-settings-group">
        <div className="k-settings-group__title">Membership</div>
        <SettingsRow label="Plan" value={getMembershipPlanLabel(profile)} onClick={() => navigate('/dashboard/membership')} />
        <SettingsRow label="Membership Card" onClick={() => navigate('/dashboard/membership')} />
        <SettingsRow label="Community Chat" value={profile?.membership_plan === 'kyno_plus' ? 'Open' : 'KYNO+ only'} onClick={() => navigate('/dashboard/community')} />
      </div>

      <div className="k-settings-group">
        <div className="k-settings-group__title">Support</div>
        <SettingsRow label="Contact" value="hello@kyno.pet" />
      </div>

      <div className="k-settings-group">
        <div className="k-settings-group__title">Legal</div>
        <SettingsRow label="Terms of Service" onClick={() => window.open('/terms', '_blank')} />
        <SettingsRow label="Privacy Policy" onClick={() => window.open('/privacy', '_blank')} />
      </div>

      <button className="k-btn k-btn--secondary k-btn--full k-mt-lg" onClick={handleSignOut} style={{ color: 'var(--k-emergency-accent)', borderColor: 'var(--k-emergency-accent)' }}>
        Sign Out
      </button>

      <div className="k-caption k-text-center k-mt-lg" style={{ color: 'var(--k-text-tertiary)' }}>
        Kyno v0.1.0
      </div>
    </div>
  );
}
