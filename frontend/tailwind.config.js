/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          500: '#598CBC',
        },
        indigo: {
          400: '#7AA5DA',
        },
        rose: {
          700: '#AF2E38',
        },
        red: {
          400: '#CF606A',
        },
        zinc: {
          300: '#D9D9D9',
        },
        stone: {
          50: '#FBFAF7',
        },
        'Icon-Default-Default': '#1E1E1E',
        'Color': '#AF2E38',
        'Color-2': '#598CBC',
        'Color-3': '#FBFAF7',
        'Color-4': '#F9EEEC',
        'Color-5': '#F2BEBE',
      },
      fontFamily: {
        'sans': ['Geologica', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
