// Kyno brand identity color system — v1.0 March 2026

export const gold = {
  50: '#FDF8EF', 100: '#F9EDCE', 200: '#F2D98E', 300: '#E8C25A',
  400: '#D4A83A', 500: '#B8902E', 600: '#966F1F', 700: '#6E5018',
  800: '#4A3610', 900: '#2C200A',
} as const;

export const sage = {
  50: '#F4F7F2', 100: '#E2EBD9', 200: '#C5D5B2', 300: '#A3BB87',
  400: '#7A9E5E', 500: '#5E7F47', 600: '#4A6638', 700: '#364A29',
  800: '#23311B', 900: '#141D10',
} as const;

export const warm = {
  50: '#FDFBF7', 100: '#F7F1E6', 200: '#EDE1CC', 300: '#E0CDAC',
  400: '#C4A882', 500: '#A68B62', 600: '#8A6F48', 700: '#645033',
  800: '#433522', 900: '#271E13',
} as const;

export const stone = {
  50: '#F8F7F5', 100: '#EDEBE6', 200: '#DBD8D0', 300: '#C5C1B6',
  400: '#A9A497', 500: '#8D877A', 600: '#6E695E', 700: '#504C44',
  800: '#35322C', 900: '#1C1A17',
} as const;

// Semantic aliases (flat access for simpler style code)
export const colors = {
  background: warm[50],
  surface: '#FFFFFF',
  surfaceRaised: stone[50],
  textPrimary: stone[800],
  textSecondary: stone[500],
  textTertiary: stone[400],
  accent: gold[400],
  accentLight: gold[300],
  accentSage: sage[100],
  dark: stone[900],
  border: stone[200],
  borderSubtle: stone[100],
  emergencyBg: '#3B1515',
  emergencyAccent: '#EF6B6B',
  gold, sage, warm, stone,
} as const;

export const darkColors = {
  background: stone[900],
  surface: stone[800],
  surfaceRaised: stone[700],
  textPrimary: warm[100],
  textSecondary: stone[400],
  textTertiary: stone[500],
  accent: gold[300],
  accentLight: gold[400],
  accentSage: sage[300],
  dark: stone[900],
  border: stone[600],
  borderSubtle: stone[700],
  emergencyBg: '#3B1515',
  emergencyAccent: '#EF6B6B',
  gold, sage, warm, stone,
} as const;

export function getColors(isDark: boolean) {
  return isDark ? darkColors : colors;
}

export const fonts = {
  serif: 'PlayfairDisplay_400Regular',
  serifMedium: 'PlayfairDisplay_500Medium',
  sans: 'DMSans_400Regular',
  sansLight: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
  sansBold: 'DMSans_700Bold',
} as const;
