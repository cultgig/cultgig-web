import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#05AC5F',
          'green-dark': '#048A4C',
          mint: '#DAF3E7',
          'mint-pale': '#D2ECDE',
          ink: '#0C0C0C',
        },
        green: {
          600: '#05AC5F',
          700: '#048A4C',
        },
        mint: {
          100: '#DAF3E7',
          200: '#D2ECDE',
        },
        ink: '#0C0C0C',
        grey: {
          50: '#F9FAFC',
          100: '#F4F6F8',
          200: '#E8ECEF',
          500: '#5B6470',
        },
        border: '#E8ECEF',
      },
      fontFamily: {
        heading: ['"League Spartan"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        'faq': '12px',
        'stat': '16px',
        'card': '20px',
        'frame': '24px',
        'panel': '32px',
      },
      boxShadow: {
        'card-soft': '0 8px 24px rgba(12, 12, 12, 0.06)',
        'dropdown': '0 12px 32px rgba(12, 12, 12, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;

