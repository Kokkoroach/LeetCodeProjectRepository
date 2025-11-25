/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mta-blue': '#0039A6',
        'mta-red': '#EE352E',
        'mta-yellow': '#FCCC0A',
        'mta-green': '#00933C',
        'mta-orange': '#FF6319',
        'mta-purple': '#B933AD',
      },
    },
  },
  plugins: [],
}