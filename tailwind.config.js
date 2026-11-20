// Every colour is a CSS custom property set by src/themes/themes.ts,
// so one class (e.g. text-accent) works in all four themes.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: token('ink'),
        soft: token('soft'),
        accent: token('accent'),
        accent2: token('accent-2'),
        'accent-ink': token('accent-ink'),
        surface: token('surface'),
        line: token('line'),
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 4px rgb(var(--accent) / 0.2)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(14px, -30px, 0) scale(1.3)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 14s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.6s ease-out infinite',
      },
    },
  },
  plugins: [],
};
