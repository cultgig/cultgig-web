import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        plum: {
          DEFAULT: '#6A2E62',
          primary: '#6A2E62',
          hover: '#54234E',
          active: '#421A3D',
          soft: '#F8F3F7',
          tint: '#EEDFEA',
          border: '#DFC9DA',
        },
        canvas: '#FCFAFB',
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#FBF9FA',
          muted: '#F4EFF2',
        },
        ink: {
          primary: '#20151E',
          secondary: '#5C4E58',
          muted: '#84747F',
          dark: '#181016',
        },
        line: {
          light: '#F0E8EE',
          DEFAULT: '#E5DCE2',
          strong: '#CBBEC8',
        },
        semantic: {
          success: '#2B7A58',
          'success-bg': '#EEF7F2',
          warning: '#A8681E',
          'warning-bg': '#FDF6EC',
          error: '#B02A37',
          'error-bg': '#FDF2F3',
          info: '#26689A',
          'info-bg': '#EDF5FB',
        },
        ochre: {
          DEFAULT: '#B88E52',
          bg: '#FAF5ED',
        },
      },
      fontFamily: {
        sans: ['"Lexend"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['"Lexend"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        soft: '0 2px 10px rgba(32, 21, 30, 0.04)',
        card: '0 6px 20px rgba(32, 21, 30, 0.06)',
        elevated: '0 14px 36px rgba(32, 21, 30, 0.10)',
      },
    },
  },
  plugins: [],
} satisfies Config;
