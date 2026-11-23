import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

/**
 * Tailwind reads every colour from the CSS variables in src/styles/globals.css (see DESIGN.md).
 * No hex values live here. Channel-triplet variables support alpha modifiers (e.g. bg-brand/10).
 */
const c = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;
const raw = (name: string) => `var(--${name})`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        /* shadcn/ui semantic tokens (aliases of the brand tokens) */
        border: raw('color-border'),
        input: raw('color-border-control'),
        ring: c('ring'),
        background: c('background'),
        foreground: c('foreground'),
        primary: { DEFAULT: c('primary'), foreground: c('primary-foreground') },
        secondary: { DEFAULT: c('secondary'), foreground: c('secondary-foreground') },
        destructive: { DEFAULT: c('destructive'), foreground: c('destructive-foreground') },
        muted: { DEFAULT: c('muted'), foreground: c('muted-foreground') },
        accent: { DEFAULT: c('accent'), foreground: c('accent-foreground') },
        popover: { DEFAULT: c('popover'), foreground: c('popover-foreground') },
        card: { DEFAULT: c('card'), foreground: c('card-foreground') },

        /* Cultgig product tokens */
        brand: {
          DEFAULT: c('color-brand-primary'),
          hover: c('color-brand-primary-hover'),
          pressed: c('color-brand-primary-pressed'),
          subtle: c('color-brand-primary-subtle'),
          light: c('color-brand-light'),
          'light-hover': c('color-brand-light-hover'),
          'light-subtle': c('color-brand-light-subtle'),
          ink: c('color-brand-ink'),
          tertiary: c('color-brand-tertiary'),
        },
        page: c('color-page'),
        surface: {
          DEFAULT: c('color-surface'),
          low: c('color-surface-low'),
          container: c('color-surface-container'),
          high: c('color-surface-container-high'),
        },
        ink: {
          DEFAULT: c('color-text-primary'),
          strong: c('color-text-strong'),
          secondary: c('color-text-secondary'),
          muted: c('color-text-muted'),
          inverse: c('color-text-inverse'),
        },
        line: {
          DEFAULT: raw('color-border'),
          subtle: raw('color-border-subtle'),
          strong: c('color-border-strong'),
          control: raw('color-border-control'),
          focus: c('color-border-focus'),
          selected: c('color-border-selected'),
        },
        overlay: {
          warm: raw('color-overlay-warm'),
          '04': raw('color-overlay-black-04'),
          '08': raw('color-overlay-black-08'),
          '20': raw('color-overlay-black-20'),
          '40': raw('color-overlay-black-40'),
          'white-70': raw('color-overlay-white-70'),
        },
        status: {
          success: c('color-success'),
          'success-soft': c('color-success-soft'),
          'success-border': c('color-success-border'),
          warning: c('color-warning'),
          'warning-soft': c('color-warning-soft'),
          'warning-border': c('color-warning-border'),
          error: c('color-error'),
          'error-soft': c('color-error-soft'),
          'error-border': c('color-error-border'),
          info: c('color-info'),
          'info-soft': c('color-info-soft'),
          'info-border': c('color-info-border'),
        },
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
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        brand: 'var(--shadow-brand)',
      },
      zIndex: {
        header: '40',
        overlay: '50',
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
