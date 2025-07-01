/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        card: '#1b1b1b',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};