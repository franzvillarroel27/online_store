/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Primary: warm terracotta — kitchen showroom signature
        primary: {
          50:  '#FEF5EF',
          100: '#FDE9DB',
          200: '#FAD0B5',
          300: '#F5B088',
          400: '#ED885A',
          500: '#E0643A',
          600: '#C4522A',
          700: '#A34222',
          800: '#82351B',
          900: '#6A2A16',
        },
        // Sage: natural kitchen green for secondary accents
        sage: {
          50:  '#F2F5F3',
          100: '#E1EAE5',
          200: '#C2D4CA',
          300: '#9AB8AD',
          400: '#759B90',
          500: '#5C8076',
          600: '#4A6860',
          700: '#3B534C',
        },
        // Warm: parchment/linen — body background and cards
        warm: {
          50:  '#FEFCFA',
          100: '#F8F5F1',
          200: '#F0EBE3',
          300: '#E4DDD3',
          400: '#CBBFB3',
          500: '#A89A8E',
        },
        // Gold: premium accent for badges and highlights
        gold: {
          400: '#D4AC6A',
          500: '#C09850',
          600: '#A67F3C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'ios':    '0 2px 10px rgba(0,0,0,0.055), 0 1px 3px rgba(0,0,0,0.03)',
        'ios-md': '0 4px 20px rgba(0,0,0,0.08),  0 2px 6px rgba(0,0,0,0.04)',
        'ios-lg': '0 8px 32px rgba(0,0,0,0.10),  0 4px 12px rgba(0,0,0,0.05)',
      },
      borderRadius: {
        'ios':    '14px',
        'ios-lg': '20px',
        'ios-xl': '28px',
      },
    },
  },
  plugins: [],
};
