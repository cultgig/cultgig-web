/**
 * Cultgig Design Tokens
 *
 * Colour System (Granola-derived olive & warm neutral palette):
 * - Brand Primary / Action Olive: #5B6F00 (hover #435300, pressed #354200, subtle #F0F2E5)
 * - Brand Light Olive: #B2C248 (hover #A5B43D, subtle #F5F6E9, olive ink #788C15, tertiary #E0C976)
 * - Surfaces: #FFFFFF (page), #F7F7F2 (warm snow), #EAEBE5 (mist), #D5D5D2 (silver)
 * - Ink: #292929 (primary graphite), #0E0F0C (strong charcoal), #72726E (secondary slate), #ACADA8 (muted)
 * - Inverse: #FCFCF8 (on dark/olive surfaces)
 * - Status: #356B3D/#EDF5EC, #805B12/#FBF4E4, #A33A32/#FBEFED, #365F78/#EDF4F7
 */

export const colors = {
  brand: {
    primary: '#5B6F00',      // Primary action olive
    hover: '#435300',        // Primary hover olive
    active: '#354200',       // Primary pressed / deep olive
    soft: '#F0F2E5',         // Subtle primary tint (selected rows, soft surfaces)
    tint: '#B2C248',         // Light olive highlight (pair with dark ink or dark surfaces)
    border: '#D5D5D2',       // Strong neutral / olive-compatible boundary
    light: '#B2C248',        // Light olive highlight
    lightHover: '#A5B43D',   // Light olive hover
    lightSubtle: '#F5F6E9',  // Very soft light-olive highlight surface
    ink: '#788C15',          // Olive ink (large text / focus / non-text accents)
    tertiary: '#E0C976',     // Restrained warm tertiary accent
  },
  neutral: {
    white: '#FFFFFF',
    canvas: '#FFFFFF',       // Base page surface
    surface: '#FFFFFF',      // Card surfaces
    surfaceRaised: '#F7F7F2',// Warm off-white / alternate section band
    surfaceMuted: '#EAEBE5', // Container / inset mist surface
    snow: '#F7F7F2',
    mist: '#EAEBE5',
    silver: '#D5D5D2',
    gray: '#ACADA8',
    slate: '#72726E',
    graphite: '#292929',
    charcoal: '#0E0F0C',
    black: '#000000',
    inverse: '#FCFCF8',      // Text/icon on dark/olive surfaces
    borderLight: 'rgba(0, 0, 0, 0.06)',
    border: 'rgba(0, 0, 0, 0.10)',
    borderSubtle: 'rgba(71, 67, 42, 0.20)',
    borderControl: 'rgba(41, 41, 41, 0.18)',
    borderStrong: '#D5D5D2',
    borderFocus: '#788C15',
    textMuted: '#ACADA8',    // Disabled / non-essential metadata only
    textSecondary: '#72726E',// Accessible secondary copy
    textPrimary: '#292929',  // Primary body copy and headings
    textStrong: '#0E0F0C',   // High-emphasis headings and foreground
    dark: '#0E0F0C',         // Deep charcoal container background
  },
  semantic: {
    success: '#356B3D',
    successBg: '#EDF5EC',
    successBorder: '#C9DEC8',
    warning: '#805B12',
    warningBg: '#FBF4E4',
    warningBorder: '#E9D7A8',
    error: '#A33A32',
    errorBg: '#FBEFED',
    errorBorder: '#EBC8C4',
    info: '#365F78',
    infoBg: '#EDF4F7',
    infoBorder: '#C9DCE5',
  },
  accent: {
    warm: '#E0C976',         // Restrained warm tertiary highlight
    warmBg: '#F5F6E9',
  },
  shadows: {
    none: 'none',
    xs: '0 1px 2px rgba(14, 15, 12, 0.06)',
    sm: '0 2px 8px rgba(14, 15, 12, 0.06)',
    md: '0 8px 24px rgba(14, 15, 12, 0.08)',
    lg: '0 16px 40px rgba(14, 15, 12, 0.10)',
    brand: '0 4px 14px rgba(91, 111, 0, 0.14)',
  },
  overlays: {
    warm: 'rgba(98, 90, 34, 0.06)',
    black04: 'rgba(0, 0, 0, 0.04)',
    black08: 'rgba(0, 0, 0, 0.08)',
    black20: 'rgba(0, 0, 0, 0.20)',
    black40: 'rgba(0, 0, 0, 0.40)',
    white70: 'rgba(255, 255, 255, 0.70)',
  },
  gradients: {
    sun: '#FEBE29',
    pink: '#FF91E0',
    lavender: '#CEBEF8',
    blue: '#D2E4F8',
    brandArt: 'linear-gradient(115deg, #FEBE29 0%, #FF91E0 34%, #CEBEF8 68%, #D2E4F8 100%)',
  },
} as const;

export const spacing = {
  4: '4px',
  8: '8px',
  12: '12px',
  16: '16px',
  20: '20px',
  24: '24px',
  32: '32px',
  40: '40px',
  48: '48px',
  64: '64px',
  80: '80px',
  96: '96px',
} as const;

export const typography = {
  fontFamily: 'Lexend, sans-serif',
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  scale: {
    h1: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: '30px',
      letterSpacing: '-0.2px',
    },
    h2: {
      fontSize: '20px',
      fontWeight: 700,
      lineHeight: '26px',
      letterSpacing: '-0.1px',
    },
    h3: {
      fontSize: '17px',
      fontWeight: 600,
      lineHeight: '22px',
      letterSpacing: '0px',
    },
    h4: {
      fontSize: '15px',
      fontWeight: 600,
      lineHeight: '20px',
      letterSpacing: '0px',
    },
    bodyLarge: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
      letterSpacing: '0px',
    },
    body: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '21px',
      letterSpacing: '0px',
    },
    bodySmall: {
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: '19px',
      letterSpacing: '0px',
    },
    label: {
      fontSize: '13px',
      fontWeight: 600,
      lineHeight: '18px',
      letterSpacing: '0.1px',
    },
    labelSmall: {
      fontSize: '11.5px',
      fontWeight: 600,
      lineHeight: '16px',
      letterSpacing: '0.12px',
    },
    button: {
      fontSize: '15px',
      fontWeight: 600,
      lineHeight: '20px',
      letterSpacing: '0px',
    },
  },
} as const;
