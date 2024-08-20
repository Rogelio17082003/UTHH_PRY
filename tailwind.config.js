/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
    'node_modules/flowbite-react/lib/esm/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#009944',
        secondary: '#23262d',
      },
      
      
      // Asegúrate de incluir configuraciones para hover si es necesario
      backgroundColor: theme => ({
        ...theme('colors'),
        'primary-hover': '#23262d', // Un color diferente para hover, por ejemplo
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('flowbite/plugin'),
  ],
};
