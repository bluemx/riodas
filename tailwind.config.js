/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        recrea: {
          "primary": "#e7004c",
          "secondary": "#A52829",
          "accent": "#ffc600",
          "success": "#95c63d",
          "neutral": "#004a98",
          "base-100": "#7b868d",
          "info": "#a4ede2",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
  plugins: [
    require("daisyui"),
    require("tailwindcss-animate")
  ]
}

