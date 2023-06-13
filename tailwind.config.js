/** @type {import('tailwindcss').Config} */
export default {
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
          "secondary": "#00a8e1",
          "accent": "#ffc600",
          "success": "#95c63d",
          "neutral": "#475569",
        },
      },
    ],
  },
  plugins: [
    require("daisyui"),
    require("tailwindcss-animate")
  ]
}

