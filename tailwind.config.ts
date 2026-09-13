import type { Config } from 'tailwindcss';
export default { content: ['./index.html', './src/**/*.{ts,tsx}'], theme: { extend: { fontFamily: { heading: ['Lexend', 'sans-serif'], sans: ['Lexend', 'sans-serif'] } } }, plugins: [] } satisfies Config;
