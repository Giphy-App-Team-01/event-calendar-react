import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [daisyui],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        secondary: '#f97316',
        danger: '#ef4444',
        success: '#22c55e',
      },
      container: {
        center: true,
        padding: '2rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
};
