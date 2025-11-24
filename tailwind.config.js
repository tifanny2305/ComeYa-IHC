/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-yellow': '#FFC107', // El amarillo de tu logo 'C'
        'brand-green': '#4CAF50',  // El verde de los botones
        'bg-gray': '#F5F5F5',      // El fondo gris claro
      }
    },
  },
  plugins: [],
}