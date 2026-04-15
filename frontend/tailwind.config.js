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
          500: '#5985BC',
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
      },
      fontFamily: {
        'sans': ['Geologica', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
