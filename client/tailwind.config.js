/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1720px',
      '4xl': '1820px',
    },
    extend: {
      
      spacing: {
        '108': '26rem',
        '128': '30rem', // equivalent to 512px
        '144': '34rem', // equivalent to 576px
        '160': '40rem', // equivalent to 640px
      },
      
      colors: {
      "primary": "#1476ff",
      "secondary": "#f3f5ff",
      "light": "#f9faff",
    },
    },
  },
  plugins: [],
}

