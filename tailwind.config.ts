import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      borderRadius: {
        squircle: '30px'
      },
      boxShadow: {
        crystal: '0 18px 40px rgba(7, 15, 35, 0.24)',
        soft: '0 10px 26px rgba(0, 0, 0, 0.2)'
      }
    }
  },
  plugins: []
};

export default config;
