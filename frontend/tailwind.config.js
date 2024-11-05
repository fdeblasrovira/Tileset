
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*",
    "index.html"
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'tileset-red': '#e63946',
      'tileset-red-1': '#b82e38',
      'tileset-full-white': '#fff',
      'tileset-white': '#f4f3ee',
      'tileset-light-blue': '#a8dadc',
      'tileset-blue': '#457b9d',
      'tileset-blue-1': '#325871',
      'tileset-dark-blue': '#1d3557',
      'tileset-green': '#49a078',
      'tileset-green-1': '#397d5e',
      'tileset-black': '#1f2421',
      'tileset-yellow': '#e9c46a',
      'tileset-yellow-1': '#ba9d55',
      'tileset-brown': '#a98467',
      'tileset-purple': '#be95c4',
      'tileset-grey-1': '#e9ecef',
      'tileset-grey-2': '#dee2e6',
      'tileset-grey-3': '#ced4da',
      'tileset-grey-4': '#adb5bd',
      'tileset-grey-5': '#6c757d',
      'tileset-grey-6': '#444444'
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
