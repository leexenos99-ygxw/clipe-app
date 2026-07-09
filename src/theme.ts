export const colors = {
  primary: {
    50: '#F2FCFC',
    100: '#E3F7F7',
    200: '#CFEFEF',
    300: '#A7E4E4',
    400: '#63D5D6',
    500: '#06B2B5',
    600: '#04999C',
    700: '#028081',
    800: '#02696A',
    900: '#024D4E',
  },
  accent: {
    blue: '#23455A',
  },
  neutral: {
    background: '#FFFFFF',
    surface: '#F8FAFB',
    card: '#FCFDFD',
    border: '#E7ECEF',
    divider: '#EDF2F4',
    title: '#1F2937',
    body: '#4B5563',
    secondary: '#6B7280',
    placeholder: '#9CA3AF',
    disabled: '#D1D5DB',
  },
  functional: {
    success: '#22C55E',
    warning: '#F5A623',
    error: '#EF4444',
    info: '#38BDF8',
  },
}

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
}

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
}

export const shadows = {
  sm: '0 1px 3px rgba(2, 128, 129, 0.06)',
  md: '0 4px 12px rgba(2, 128, 129, 0.08)',
  lg: '0 4px 20px rgba(2, 128, 129, 0.08)',
  xl: '0 8px 32px rgba(2, 128, 129, 0.1)',
}

export const typography = {
  fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
    loose: '1.8',
  },
}

export const theme = {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
}