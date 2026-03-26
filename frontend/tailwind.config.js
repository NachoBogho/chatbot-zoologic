/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'zl-',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pantera: {
          purple: '#7C3AED',
          dark:   '#6D28D9',
          deep:   '#5B21B6',
          light:  '#A78BFA',
          muted:  '#F5F3FF',
        },
        ink: {
          DEFAULT: '#1E1B2E',
          2: '#3D3756',
          3: '#6B6488',
          4: '#9E99B8',
          5: '#D4D1E5',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        widget: '24px',
        bubble: '16px',
      },
      boxShadow: {
        widget: '0 24px 48px rgba(28, 25, 23, 0.20), 0 8px 24px rgba(28, 25, 23, 0.12)',
        btn:    '0 4px 16px rgba(249, 115, 22, 0.50)',
        msg:    '0 1px 3px rgba(28, 25, 23, 0.08)',
      },
    },
  },
  plugins: [],
};
