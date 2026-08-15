/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A227',
          light: '#E5C76B',
          dark: '#8A6D1B',
        },
        onyx: {
          DEFAULT: '#0B0B0B',
          light: '#141414',
          card: '#1B1B1B',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 0 24px rgba(201, 162, 39, 0.25)',
      },
    },
  },
  plugins: [],
};
