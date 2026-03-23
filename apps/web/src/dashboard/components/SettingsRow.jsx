export default function SettingsRow({ label, value, onClick }) {
  return (
    <div className={`k-settings-row ${onClick ? 'k-settings-row--action' : ''}`} onClick={onClick}>
      <span className="k-settings-row__label">{label}</span>
      <span className="k-settings-row__value">
        {value && <span>{value}</span>}
        {onClick && <span className="k-settings-row__chevron">&rsaquo;</span>}
      </span>
    </div>
  );
}
