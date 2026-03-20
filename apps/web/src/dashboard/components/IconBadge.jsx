import { colors } from '../constants/colors';

export default function IconBadge({ label, size = 40, bg, fg, emergency }) {
  const bgColor = emergency ? colors.emergencyBg : (bg || colors.gold[50]);
  const fgColor = emergency ? colors.emergencyAccent : (fg || colors.accent);
  return (
    <div
      className="k-icon-badge"
      style={{
        width: size, height: size, fontSize: size * 0.4,
        background: bgColor, color: fgColor,
      }}
    >
      {label}
    </div>
  );
}
