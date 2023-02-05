/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#171717',
        'light': '#FFF',
        'primary': '#0284c7',
        'muted': '#78716c',
        'component': '#262626'
      },
      screens: {
        'mobile': {
          max: '768px'
        }
      }
    },
  },
  plugins: [],
}
