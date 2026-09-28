/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FCFCFB',
          100: '#FAFAF8',
          200: '#F4F4EE',
          300: '#ECECE4',
          400: '#E0E0D4',
        },
        charcoal: {
          900: '#0F1012',
          800: '#15171A',
          700: '#1E2126',
          600: '#2A2E35',
          500: '#404550',
          400: '#646B7A',
          300: '#949BA8',
          200: '#C8CDD6',
          100: '#E5E8ED',
        },
        gold: {
          50: '#FBF8F0',
          100: '#F6EEDD',
          200: '#ECDDBB',
          300: '#DFC48C',
          400: '#D4AF57',
          500: '#C5A059',
          600: '#AB853F',
          700: '#8E6B2C',
          800: '#6A4F1D',
        },
        diamond: {
          50: '#F4F8FA',
          100: '#E8F1F6',
          200: '#D2E3ED',
          300: '#B0CEE1',
          400: '#8AB4D2',
          500: '#6A9BC0',
        },
        emerald: {
          luxury: '#2E7D5B',
        },
        amber: {
          luxury: '#D9822B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'luxury': '0 10px 35px -5px rgba(21, 23, 26, 0.06), 0 5px 15px -3px rgba(21, 23, 26, 0.03)',
        'luxury-lg': '0 20px 50px -10px rgba(21, 23, 26, 0.09), 0 10px 20px -5px rgba(21, 23, 26, 0.04)',
        'gold-glow': '0 0 25px rgba(197, 160, 89, 0.25)',
        'diamond-glow': '0 0 30px rgba(138, 180, 210, 0.25)'
      },
      borderRadius: {
        'luxury': '16px',
        'luxury-lg': '20px'
      }
    },
  },
  plugins: [],
}
