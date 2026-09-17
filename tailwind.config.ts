import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6A2E62',
          primary: '#6A2E62',
          hover: '#54234E',
          active: '#421A3D',
          soft: '#F8F3F7',
          tint: '#EEDFEA',
          border: '#DFC9DA',
        },
        cultgig: {
          plum: '#6A2E62',
          'plum-hover': '#54234E',
          'plum-deep': '#421A3D',
          'plum-soft': '#F8F3F7',
          'plum-light': '#F2E8F0',
          bg: '#FCFAFB',
          text: '#20151E',
          'text-secondary': '#5C4E58',
          muted: '#84747F',
          border: '#E5DCE2',
          'border-light': '#F0E8EE',
          blush: '#EEDFEA',
          warm: '#B88E52',
          dark: '#181016',
        },
        neutral: {
          canvas: 'var(--cultgig-bg, #FCFAFB)',
          surface: '#FFFFFF',
          textPrimary: 'var(--cultgig-text, #20151E)',
          textSecondary: 'var(--cultgig-text-secondary, #5C4E58)',
          textMuted: 'var(--cultgig-muted, #84747F)',
          border: 'var(--cultgig-border, #E5DCE2)',
          borderLight: 'var(--cultgig-border-light, #F0E8EE)',
        },
        semantic: {
          success: '#2E7D32',
          warning: '#B88E52',
          error: '#C62828',
        },
      },
      fontFamily: {
        heading: ['Lexend', 'sans-serif'],
        sans: ['Lexend', 'sans-serif'],
      },
      fontSize: {
        'h1': ['24px', { lineHeight: '30px', letterSpacing: '-0.2px', fontWeight: '700' }],
        'h2': ['20px', { lineHeight: '26px', letterSpacing: '-0.1px', fontWeight: '700' }],
        'h3': ['17px', { lineHeight: '22px', letterSpacing: '0px', fontWeight: '600' }],
        'h4': ['15px', { lineHeight: '20px', letterSpacing: '0px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '0px', fontWeight: '400' }],
        'body-base': ['14px', { lineHeight: '21px', letterSpacing: '0px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '19px', letterSpacing: '0px', fontWeight: '400' }],
        'label-base': ['13px', { lineHeight: '18px', letterSpacing: '0.1px', fontWeight: '600' }],
        'label-sm': ['11.5px', { lineHeight: '16px', letterSpacing: '0.12px', fontWeight: '600' }],
        'button-base': ['15px', { lineHeight: '20px', letterSpacing: '0px', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
} satisfies Config;

