/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f84565',
          50: '#fff0f2',
          100: '#ffe1e5',
          200: '#ffc8cf',
          300: '#ffa3b0',
          400: '#ff7489',
          500: '#fd4d6a',
          600: '#f84565',
          700: '#d7284b',
          800: '#b42441',
          900: '#96233a',
        },
      },
    },
  },
  plugins: [],
}
