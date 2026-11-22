import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#051315',
          card: '#1B1818',
          elevated: '#0D1C1E',
          row: '#142123',
        },
        accent: {
          DEFAULT: '#D11F68',
          hover: '#B51758',
          active: '#981249',
          soft: '#FDF1F8',
          border: '#F3D5E7',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#FAFAFA',
          muted: '#F5F5F5',
        },
        ink: {
          DEFAULT: '#051315',
          secondary: '#646A6B',
          muted: '#889091',
          inverse: '#FFFFFF',
        },
        hairline: {
          DEFAULT: '#EDEDED',
          dark: 'rgba(255, 255, 255, 0.12)',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['"Poppins"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
        panel: '14px',
      },
      boxShadow: {
        pill: '0 6px 24px rgba(5, 19, 21, 0.08)',
        card: '0 10px 30px rgba(5, 19, 21, 0.06)',
        elevated: '0 20px 50px rgba(5, 19, 21, 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config;
