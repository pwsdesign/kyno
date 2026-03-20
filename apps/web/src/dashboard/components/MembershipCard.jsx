export default function MembershipCard({ profile }) {
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '';

  return (
    <div className="k-membership">
      <div className="k-membership__glow" />
      <div className="k-flex-between" style={{ marginBottom: 32, position: 'relative' }}>
        <div className="k-flex" style={{ alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--k-font-serif)', fontSize: 22, color: 'var(--k-accent-light)' }}>K</span>
          <span style={{ fontFamily: 'var(--k-font-serif)', fontSize: 14, letterSpacing: 4, color: 'var(--k-warm-200)' }}>KYNO</span>
        </div>
        <span style={{ fontSize: 9, letterSpacing: 2, color: 'var(--k-accent)', textTransform: 'uppercase' }}>Member</span>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ fontFamily: 'var(--k-font-serif)', fontSize: 17, color: 'var(--k-warm-100)', marginBottom: 4 }}>
          {profile?.first_name} {profile?.last_name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--k-stone-500)', letterSpacing: 1 }}>
          {profile?.membership_id || 'KYN-2026-0001'} · Since {memberSince}
        </div>
      </div>
    </div>
  );
}
