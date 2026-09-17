/**
 * Cultgig Design Tokens
 * 
 * Strict specifications from Section 6, 7, and 8:
 * - Brand Plum: #6A2E62 (supersedes all prior variants)
 * - Predominantly light/white surfaces (70-75%)
 * - Neutral text and borders (15-18%)
 * - Brand interactive elements (5-7%)
 * - Semantic states (3-5%)
 * - Accent (1-2%)
 * - Typography: Lexend only, weights 400, 500, 600, 700 (no 800/900)
 * - Strict type scale: H1 (24px/700), H2 (20px/700), H3 (17px/600), H4 (15px/600),
 *   Body Large (16px/400), Body (14px/400), Body Small (13px/400),
 *   Label (13px/600), Label Small (11.5px/600), Buttons (15px/600)
 * - Sentence case everywhere
 */

export const colors = {
  brand: {
    primary: '#6A2E62',      // Plum primary
    hover: '#54234E',        // Darker plum for hover
    active: '#421A3D',       // Deepest plum
    soft: '#F8F3F7',         // Very soft tint for card backgrounds
    tint: '#EEDFEA',         // Soft plum tint for borders / subtle tags
    border: '#DFC9DA',       // Plum-tinted border
  },
  neutral: {
    white: '#FFFFFF',
    canvas: '#FCFAFB',       // Base near-white screen background (70-75% screen presence)
    surface: '#FFFFFF',      // Card surfaces
    surfaceRaised: '#FBF9FA',// Slightly offset surface
    surfaceMuted: '#F4EFF2', // Tinted neutral surface
    borderLight: '#F0E8EE',  // Very soft border
    border: '#E5DCE2',       // Standard structural border
    borderStrong: '#CBBEC8', // High contrast border
    textMuted: '#84747F',    // Tertiary text / captions / hints
    textSecondary: '#5C4E58',// Secondary descriptive copy
    textPrimary: '#20151E',  // Primary heading and body copy
    dark: '#181016',         // Dark container background
  },
  semantic: {
    success: '#2B7A58',
    successBg: '#EEF7F2',
    warning: '#A8681E',
    warningBg: '#FDF6EC',
    error: '#B02A37',
    errorBg: '#FDF2F3',
    info: '#26689A',
    infoBg: '#EDF5FB',
  },
  accent: {
    warm: '#B88E52',         // Subtle warm ochre accent (1-2%)
    warmBg: '#FAF5ED',
  }
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
