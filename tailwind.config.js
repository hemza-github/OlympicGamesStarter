/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Chemin vers tes fichiers Angular
  ],
  theme: {
    extend: {
      colors: {
        "perso-emerald": "#04838f",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light", // Thème clair
      "dark", // Thème sombre
      "cupcake", // Exemples de thèmes DaisyUI
    ],
  }, // Ajout de DaisyUI
};
