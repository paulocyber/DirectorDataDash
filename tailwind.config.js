/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      screens: {
        "small-screen": { max: "385px" },
        "medium-screen": { max: "1051px" },
      },
    },
  },
  plugins: [],
};
