/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mint: {
          300: '#4ef5bb',
          400: '#1bf0a7',
          500: '#00e599',
          600: '#00c985',
          700: '#00a36c'
        },
        forest: {
          950: '#030806',
          900: '#050e0b',
          850: '#071511',
          800: '#091b16',
          750: '#0e261f',
          700: '#14352b',
          600: '#1d4a3d'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
