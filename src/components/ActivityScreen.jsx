import { colors } from '../styles/tokens';

const PAST_ACTIVITIES = [
  {
    id: 1,
    icon: '🦮',
    title: 'Morning Walk',
    provider: 'Carlos M. · Brickell',
    date: '20',
    month: 'Feb',
    time: '8:00 AM · 60 min',
  },
  {
    id: 2,
    icon: '✂️',
    title: 'Grooming',
    provider: 'Paw Palace · Coral Gables',
    date: '10',
    month: 'Feb',
    time: '11:00 AM · 90 min',
  },
  {
    id: 3,
    icon: '🩺',
    title: 'Annual Checkup',
    provider: 'Brickell Animal Hospital',
    date: '28',
    month: 'Jan',
    time: '2:00 PM · 30 min',
  },
  {
    id: 4,
    icon: '🦮',
    title: 'Evening Walk',
    provider: 'Carlos M. · Brickell',
    date: '15',
    month: 'Jan',
    time: '5:00 PM · 60 min',
  },
];

export default function ActivityScreen() {
  return (
    <div className="screen">
      {/* Header */}
      <div className="home-header fade-up fade-up-1">
        <div>
          <div className="greeting-label">History</div>
          <div className="greeting-name">Activity</div>
        </div>
      </div>

      {/* Activity list */}
      <div style={{ padding: '8px 0 24px' }}>
        {PAST_ACTIVITIES.map((item, i) => (
          <div
            key={item.id}
            className={`fade-up fade-up-${i + 2}`}
            style={{ margin: '0 28px 10px' }}
          >
            <div style={{
              background: colors.clayDark,
              borderRadius: 18,
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}>
              {/* Date block */}
              <div style={{
                background: colors.clay,
                borderRadius: 12,
                padding: '8px 10px',
                textAlign: 'center',
                minWidth: 44,
                flexShrink: 0,
              }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontWeight: 400,
                  color: colors.charcoal,
                  lineHeight: 1,
                }}>{item.date}</div>
                <div style={{
                  fontSize: 8,
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: colors.olive,
                  marginTop: 2,
                }}>{item.month}</div>
              </div>

              {/* Details */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 3,
                }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 16,
                    color: colors.charcoal,
                    fontWeight: 500,
                  }}>{item.title}</div>
                </div>
                <div style={{
                  fontSize: 11,
                  color: colors.olive,
                  fontWeight: 300,
                }}>{item.provider}</div>
              </div>

              {/* Right side */}
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: 10,
                  color: colors.olive,
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}>{item.time}</div>
                <div style={{
                  marginTop: 6,
                  fontSize: 8,
                  fontWeight: 600,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  color: colors.espresso,
                  background: colors.brassLight,
                  borderRadius: 20,
                  padding: '3px 8px',
                  display: 'inline-block',
                }}>Done</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
