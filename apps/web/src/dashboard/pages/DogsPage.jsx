import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveCurrentDogs } from '../services/authService';
import DogProfileFormCard, { createDraftDog } from '../components/DogProfileFormCard';

function dbDogToFormDog(dog) {
  return {
    id: dog.id,
    name: dog.name || '',
    breed: dog.breed || '',
    dob: dog.dob || '',
    weight: dog.weight || '',
    sex: dog.sex || '',
    alteredStatus: dog.altered_status || '',
    personality: dog.personality || '',
    careNotes: dog.care_notes || '',
    profilePhotoData: dog.profile_photo_data || null,
    profilePhotoName: dog.profile_photo_name || null,
    vaccineHistoryName: dog.vaccine_history_name || null,
    vaccineHistoryNote: dog.vaccine_history_note || null,
  };
}

export default function DogsPage() {
  const { dogs: dbDogs, refreshProfile } = useAuth();
  const [dogs, setDogs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (dbDogs.length > 0) {
      setDogs(dbDogs.map(dbDogToFormDog));
    } else {
      setDogs([createDraftDog()]);
    }
  }, [dbDogs]);

  function updateDog(index, updated) { setDogs(prev => prev.map((d, i) => i === index ? updated : d)); setSaved(false); }
  function removeDog(index) { setDogs(prev => prev.filter((_, i) => i !== index)); setSaved(false); }
  function addDog() { setDogs(prev => [...prev, createDraftDog()]); setSaved(false); }

  async function handleSave() {
    setSaving(true);
    try {
      await saveCurrentDogs(dogs.filter(d => d.name.trim()));
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
      <h1 className="k-heading k-heading--xl k-mb-lg">Dog Profiles</h1>

      {dogs.map((dog, i) => (
        <DogProfileFormCard
          key={dog.id || i}
          dog={dog}
          index={i}
          onChange={updated => updateDog(i, updated)}
          onRemove={dogs.length > 1 ? () => removeDog(i) : undefined}
        />
      ))}

      <button className="k-btn k-btn--secondary k-btn--full k-mb-md" onClick={addDog}>+ Add another dog</button>
      <button className="k-btn k-btn--primary k-btn--full" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
      </button>
    </div>
  );
}
