import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

/**
 * Cultgig design tokens.
 * Brand colours are authored once as CSS variables in src/styles/globals.css and
 * exposed here two ways:
 *  - brand scales (plum, ink, line, canvas, surface, semantic, ochre) used by product UI
 *  - shadcn/ui semantic tokens (primary, muted, border, ...) used by src/components/ui
 */
const v = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        // shadcn/ui semantic tokens
        border: v('border'),
        input: v('input'),
        ring: v('ring'),
        background: v('background'),
        foreground: v('foreground'),
        primary: { DEFAULT: v('primary'), foreground: v('primary-foreground') },
        secondary: { DEFAULT: v('secondary'), foreground: v('secondary-foreground') },
        destructive: { DEFAULT: v('destructive'), foreground: v('destructive-foreground') },
        muted: { DEFAULT: v('muted'), foreground: v('muted-foreground') },
        accent: { DEFAULT: v('accent'), foreground: v('accent-foreground') },
        popover: { DEFAULT: v('popover'), foreground: v('popover-foreground') },
        card: { DEFAULT: v('card'), foreground: v('card-foreground') },

        // Cultgig brand scales
        plum: {
          DEFAULT: '#6A2E62',
          primary: '#6A2E62',
          hover: '#54234E',
          active: '#421A3D',
          deep: '#421A3D',
          soft: '#F8F3F7',
          tint: '#EEDFEA',
          border: '#DFC9DA',
        },
        canvas: '#FCFAFB',
        surface: { DEFAULT: '#FFFFFF', raised: '#FBF9FA', muted: '#F4EFF2' },
        ink: { primary: '#20151E', secondary: '#5C4E58', muted: '#84747F', dark: '#181016' },
        line: { light: '#F0E8EE', DEFAULT: '#E5DCE2', strong: '#CBBEC8' },
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
        ochre: { DEFAULT: '#B88E52', bg: '#FAF5ED' },
      },
      fontFamily: {
        sans: ['"Lexend"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        heading: ['"Lexend"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      boxShadow: {
        soft: '0 2px 10px rgba(32, 21, 30, 0.04)',
        card: '0 6px 20px rgba(32, 21, 30, 0.06)',
        elevated: '0 14px 36px rgba(32, 21, 30, 0.10)',
      },
      zIndex: {
        header: '40',
        overlay: '50',
        modal: '50',
        toast: '100',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
