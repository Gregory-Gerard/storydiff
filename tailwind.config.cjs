const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      boxShadow: {
        outline: 'inset 0 0 0 1px hsl(0deg 0% 100% / 10%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        '2xs': ['0.6rem', '0.8rem'],
      },
      borderRadius: {
        DEFAULT: defaultTheme.borderRadius.lg,
      },
      colors: {
        brand: colors.indigo,
      },
    },
  },

  plugins: [require('@tailwindcss/forms')],
};
