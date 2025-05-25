/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        xxs: ['10px', '10px'],
        xs: ['12px', '12px'],
        sm: ['14px', '14px'],
        base: ['16px', '16px'],
        md: ['20px', '20px'],

        lg: ['24px', '24px'],
        xl: ['30px', '30px'],
      },
      borderRadius: {
        DEFAULT: "30px",
      },
      screens: {
        sm: "576px",
        "sm-max": { max: "576px" },
        md: "768px",
        "md-max": { max: "768px" },
        lg: "992px",
        "lg-max": { max: "992px" },
        xl: "1200px",
        "xl-max": { max: "1200px" },
        "2xl": "1440px",
        "2xl-max": { max: "1440px" },
        "3xl": "1600px",
        "3xl-max": { max: "1600px" },
        "4xl": "1850px",
        "4xl-max": { max: "1850px" },
      },
      colors: () => ({
        black: "#000000",
        white: "#ffffff",
        darker: '#100F13',
        dark: "#1E1E1E",
        dark1: "#1C1B1F",
        dark2: '#242424',
        dark3: '#100F13',
        primary: "#CAF244",
        gray: {
          50: '#FFFFFF0C',
          100: '#FFFFFF19',
          150: '#FFFFFF26',
          200: '#FFFFFF33',
          300: '#FFFFFF4C',
          400: '#FFFFFF66',
          500: '#FFFFFF80',
          600: '#FFFFFF99',
        },
        red: {
          300: '#FF7B60',
          400: '#FF4949',
          500: '#E2895A',
        },
        blue: {
          300: '#59FFCB',
          400: '#84E4FF',
        },
        yellow: {
          300: '#FFCD60',
          400: '#FFC363',
          500: '#FFBF2F'
        },
        green: {
          300: '#A1FF59',
          400: '#CAF244',
          500: '#A2F263',
          600: '#4BC586',
        },
        purple: {
          300: '#A283FF',
        },
  
        shadow: {
          500: "rgba(112, 144, 176, 0.08)",
        },
      }),
    },
  },
  plugins: [require("tailwindcss-rtl")],
};
