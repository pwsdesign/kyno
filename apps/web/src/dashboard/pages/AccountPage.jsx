import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateCurrentProfile } from '../services/authService';

export default function AccountPage() {
  const { profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', city: '', addressLine1: '', addressLine2: '', emergencyContactName: '', emergencyContactPhone: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone || '',
        city: profile.city || '',
        addressLine1: profile.address_line1 || '',
        addressLine2: profile.address_line2 || '',
        emergencyContactName: profile.emergency_contact_name || '',
        emergencyContactPhone: profile.emergency_contact_phone || '',
      });
    }
  }, [profile]);

  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })); setSaved(false); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCurrentProfile(form);
      await refreshProfile();
      setSaved(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Link to="/dashboard/settings" className="k-auth__back">&larr; Settings</Link>
      <h1 className="k-heading k-heading--xl k-mb-lg">Owner Profile</h1>

      <form onSubmit={handleSave} className="k-form-grid k-gap-md">
        <div className="k-form-grid k-form-grid--2col">
          <div className="k-input-group">
            <label className="k-input-label">First name</label>
            <input className="k-input" value={form.firstName} onChange={e => update('firstName', e.target.value)} />
          </div>
          <div className="k-input-group">
            <label className="k-input-label">Last name</label>
            <input className="k-input" value={form.lastName} onChange={e => update('lastName', e.target.value)} />
          </div>
        </div>

        <div className="k-input-group">
          <label className="k-input-label">Email</label>
          <input className="k-input" value={profile?.email || ''} disabled style={{ opacity: 0.6 }} />
        </div>

        <div className="k-input-group">
          <label className="k-input-label">Phone</label>
          <input className="k-input" type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} />
        </div>

        <div className="k-input-group">
          <label className="k-input-label">City</label>
          <input className="k-input" placeholder="Miami" value={form.city} onChange={e => update('city', e.target.value)} />
        </div>

        <div className="k-input-group">
          <label className="k-input-label">Address</label>
          <input className="k-input" placeholder="Street address" value={form.addressLine1} onChange={e => update('addressLine1', e.target.value)} />
          <input className="k-input k-mt-sm" placeholder="Apt, suite, etc." value={form.addressLine2} onChange={e => update('addressLine2', e.target.value)} />
        </div>

        <div className="k-label k-mt-md">Emergency Contact</div>
        <div className="k-form-grid k-form-grid--2col">
          <div className="k-input-group">
            <label className="k-input-label">Name</label>
            <input className="k-input" value={form.emergencyContactName} onChange={e => update('emergencyContactName', e.target.value)} />
          </div>
          <div className="k-input-group">
            <label className="k-input-label">Phone</label>
            <input className="k-input" type="tel" value={form.emergencyContactPhone} onChange={e => update('emergencyContactPhone', e.target.value)} />
          </div>
        </div>

        <button type="submit" className="k-btn k-btn--primary k-btn--full k-mt-md" disabled={saving}>
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
