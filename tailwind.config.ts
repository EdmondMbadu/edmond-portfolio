import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      },
      colors: {
        brand: {
          100: '#e0f2ff',
          300: '#7cc3ff',
          500: '#2d8fff',
          700: '#1b6dde',
          900: '#0f3c82'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
