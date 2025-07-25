/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
const { appColors } = require('./utils/colors');
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}', 
    './stores/**/*.{js,ts,jsx,tsx}', 
    './modules/**/*.{js,ts,jsx,tsx}', 
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors:  {...appColors},

    },
  },
  plugins: [],
};