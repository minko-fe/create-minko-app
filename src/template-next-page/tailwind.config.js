const { center } = require('@minko-fe/postcss-config/tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    // pc first
    screens: {
      '2xl': { max: '1535px' },
      // => @media (max-width: 1535px) { ... }

      'xl': { max: '1279px' },
      // => @media (max-width: 1279px) { ... }

      'lg': { max: '1023px' },
      // => @media (max-width: 1023px) { ... }

      'md': { max: '767px' },
      // => @media (max-width: 767px) { ... }

      'sm': { max: '576px' },
      // => @media (max-width: 576px) { ... }
    },
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        link: 'var(--color-primary)',
      },
      fontFamily: 'var(--font-family)',
    },
  },
  important: '#body',
  corePlugins: {
    preflight: false,
  },
  plugins: [center],
}
