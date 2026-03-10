import { Platform } from 'react-native';

export const colors = {
  background: '#0A0A0A',
  surface: '#1A1A1A',
  surfaceLight: '#2A2A2A',
  accent: '#C8A97E',
  accentMuted: '#8B7355',
  textPrimary: '#F5F0EB',
  textSecondary: '#8A8A8A',
  error: '#D4453A',
  errorBg: 'rgba(212, 69, 58, 0.12)',
} as const;

export const typography = {
  screenTitle: {
    fontSize: 32,
    fontWeight: '200' as const,
    letterSpacing: 6,
    textTransform: 'uppercase' as const,
    color: colors.textPrimary,
  },
  button: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
  },
  body: {
    fontSize: 15,
    fontWeight: '300' as const,
    letterSpacing: 0.5,
    color: colors.textPrimary,
  },
  mono: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.textSecondary,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
