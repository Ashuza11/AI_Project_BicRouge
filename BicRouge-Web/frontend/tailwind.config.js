/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'openSans': ['Open Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#D32F2F',
          dark:'#A81212',
          isActive: '#FCF4F3',
        },    
        secondary:{
          DEFAULT: '#424242', 
          dark: '#3B3434',
        },
        accent: {
          DEFAULT:'#FECEC3',
          dark: '#FA9E92',
        },    
        background: '#FCFBFA', 
        border: '#AFADAD',
        surface: {
          DEFAULT: '#FFFFFF', 
        },
        dashboardSecondary: {
          DEFAULT: colors.neutral[200],
          hover: colors.neutral[300],
          boder: colors.neutral[400],
          text: colors.neutral[500],
          dark: colors.neutral[800],
          ["dark-hover"]: colors.neutral[900],
        }    
      },
    },
  },
  plugins: [],
}