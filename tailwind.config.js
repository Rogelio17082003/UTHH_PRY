/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}' /* src folder, for example */,
  "./public/index.html",
  'node_modules/flowbite-react/lib/esm/**/*.{js,jsx,ts,tsx}',
  ],
  plugins: [
    // ...
    require('flowbite/plugin'),
    require('twind'),
  ],
  theme: {
    extend: {
        colors: {
            primary: '#009944',
            secondary: '#23262d',
        },
    },
},
};