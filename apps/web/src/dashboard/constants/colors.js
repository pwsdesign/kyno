// Kyno brand identity color system — v1.0 March 2026

export const gold = {
  50: '#FDF8EF', 100: '#F9EDCE', 200: '#F2D98E', 300: '#E8C25A',
  400: '#D4A83A', 500: '#B8902E', 600: '#966F1F', 700: '#6E5018',
  800: '#4A3610', 900: '#2C200A',
};

export const sage = {
  50: '#F4F7F2', 100: '#E2EBD9', 200: '#C5D5B2', 300: '#A3BB87',
  400: '#7A9E5E', 500: '#5E7F47', 600: '#4A6638', 700: '#364A29',
  800: '#23311B', 900: '#141D10',
};

export const warm = {
  50: '#FDFBF7', 100: '#F7F1E6', 200: '#EDE1CC', 300: '#E0CDAC',
  400: '#C4A882', 500: '#A68B62', 600: '#8A6F48', 700: '#645033',
  800: '#433522', 900: '#271E13',
};

export const stone = {
  50: '#F8F7F5', 100: '#EDEBE6', 200: '#DBD8D0', 300: '#C5C1B6',
  400: '#A9A497', 500: '#8D877A', 600: '#6E695E', 700: '#504C44',
  800: '#35322C', 900: '#1C1A17',
};

export const colors = {
  background: warm[50],
  surface: '#FFFFFF',
  surfaceRaised: stone[50],
  textPrimary: stone[800],
  textSecondary: stone[500],
  textTertiary: stone[400],
  accent: gold[400],
  accentLight: gold[300],
  accentSage: sage[400],
  dark: stone[900],
  border: stone[200],
  borderSubtle: stone[100],
  emergencyBg: '#3B1515',
  emergencyAccent: '#EF6B6B',
  gold, sage, warm, stone,
};

export const fonts = {
  serif: "'Playfair Display', serif",
  serifMedium: "'Playfair Display', serif",
  sans: "'DM Sans', sans-serif",
  sansLight: "'DM Sans', sans-serif",
  sansMedium: "'DM Sans', sans-serif",
  sansBold: "'DM Sans', sans-serif",
};
