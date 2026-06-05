/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './**/*.{ts,tsx}',
    '!./node_modules/**',
    '!./area-do-aluno/**',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F3EFE6',
          dark: '#EAE3D5',
          deep: '#DDD4BF',
        },
        ink: {
          DEFAULT: '#17130E',
          mid: '#3A3025',
          light: '#6B5E50',
        },
        navy: {
          DEFAULT: '#0C1824',
          mid: '#122030',
        },
        gold: {
          DEFAULT: '#A87828',
          light: '#C8983C',
          pale: '#EDE0C0',
        },
        white: '#FDFBF7',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      maxWidth: {
        container: '1240px',
      },
      spacing: {
        section: '6rem',
      },
    },
  },
  plugins: [],
};
