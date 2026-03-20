import { useRef } from 'react';

const SEX_OPTIONS = ['Male', 'Female'];
const ALTERED_OPTIONS = ['Spayed', 'Neutered', 'Intact', 'Unknown'];

export function createDraftDog() {
  return { name: '', breed: '', dob: '', weight: '', sex: '', alteredStatus: '', personality: '', careNotes: '', profilePhotoData: null, profilePhotoName: null, vaccineHistoryName: null, vaccineHistoryNote: null };
}

export default function DogProfileFormCard({ dog, onChange, onRemove, index }) {
  const photoRef = useRef(null);
  const vaccineRef = useRef(null);

  function handleField(field, value) {
    onChange({ ...dog, [field]: value });
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ ...dog, profilePhotoData: reader.result, profilePhotoName: file.name });
    };
    reader.readAsDataURL(file);
  }

  function handleVaccine(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange({ ...dog, vaccineHistoryName: file.name, vaccineHistoryNote: `Uploaded: ${file.name}` });
  }

  return (
    <div className="k-dog-form">
      <div className="k-dog-form__header">
        <div className="k-flex" style={{ alignItems: 'center', gap: 16 }}>
          <div className="k-dog-form__photo-btn" onClick={() => photoRef.current?.click()}>
            {dog.profilePhotoData ? (
              <img src={dog.profilePhotoData} alt="" />
            ) : (
              <span>+</span>
            )}
          </div>
          <input type="file" accept="image/*" ref={photoRef} style={{ display: 'none' }} onChange={handlePhoto} />
          <div>
            <div className="k-heading k-heading--sm">{dog.name || `Dog ${(index || 0) + 1}`}</div>
            <div className="k-caption">Tap photo to upload</div>
          </div>
        </div>
        {onRemove && (
          <button className="k-btn k-btn--ghost" onClick={onRemove} style={{ color: 'var(--k-emergency-accent)', fontSize: 12 }}>
            Remove
          </button>
        )}
      </div>

      <div className="k-form-grid k-gap-md">
        <div className="k-input-group">
          <label className="k-input-label">Name *</label>
          <input className="k-input" placeholder="Dog's name" value={dog.name} onChange={e => handleField('name', e.target.value)} />
        </div>

        <div className="k-form-grid k-form-grid--2col">
          <div className="k-input-group">
            <label className="k-input-label">Breed</label>
            <input className="k-input" placeholder="e.g. Golden Retriever" value={dog.breed || ''} onChange={e => handleField('breed', e.target.value)} />
          </div>
          <div className="k-input-group">
            <label className="k-input-label">Date of birth</label>
            <input className="k-input" placeholder="e.g. May 14, 2022" value={dog.dob || ''} onChange={e => handleField('dob', e.target.value)} />
          </div>
        </div>

        <div className="k-form-grid k-form-grid--2col">
          <div className="k-input-group">
            <label className="k-input-label">Weight</label>
            <input className="k-input" placeholder="e.g. 68 lb" value={dog.weight || ''} onChange={e => handleField('weight', e.target.value)} />
          </div>
          <div className="k-input-group">
            <label className="k-input-label">Sex</label>
            <div className="k-sex-options">
              {SEX_OPTIONS.map(s => (
                <div key={s} className={`k-sex-option ${dog.sex === s ? 'k-sex-option--selected' : ''}`} onClick={() => handleField('sex', s)}>{s}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="k-input-group">
          <label className="k-input-label">Altered status</label>
          <div className="k-altered-options">
            {ALTERED_OPTIONS.map(a => (
              <div key={a} className={`k-altered-option ${dog.alteredStatus === a ? 'k-altered-option--selected' : ''}`} onClick={() => handleField('alteredStatus', a)}>{a}</div>
            ))}
          </div>
        </div>

        <div className="k-input-group">
          <label className="k-input-label">Personality</label>
          <input className="k-input" placeholder="e.g. Friendly, playful, social" value={dog.personality || ''} onChange={e => handleField('personality', e.target.value)} />
        </div>

        <div className="k-input-group">
          <label className="k-input-label">Care notes</label>
          <textarea className="k-input" rows={2} placeholder="Allergies, medications, special needs..." value={dog.careNotes || ''} onChange={e => handleField('careNotes', e.target.value)} />
        </div>

        <div className="k-input-group">
          <label className="k-input-label">Vaccine records</label>
          <div className="k-vaccine-upload" onClick={() => vaccineRef.current?.click()}>
            {dog.vaccineHistoryName || 'Upload PDF or photo'}
          </div>
          <input type="file" accept="application/pdf,image/*" ref={vaccineRef} style={{ display: 'none' }} onChange={handleVaccine} />
        </div>
      </div>
    </div>
  );
}
