/** @type {import('tailwindcss').Config} */
export default {
  // Prefijo para evitar colisiones al embeber en sitios externos
  prefix: 'zl-',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        zoologic: {
          blue:    '#1a56db',
          dark:    '#0f2fa8',
          deep:    '#0c1f6e',
          light:   '#3b82f6',
          muted:   '#eef2ff',
          surface: '#f8fafd',
        },
        ink: {
          DEFAULT: '#0f172a',
          2: '#334155',
          3: '#64748b',
          4: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'widget': '20px',
        'bubble': '18px',
      },
      boxShadow: {
        'widget': '0 20px 48px rgba(26, 86, 219, 0.18), 0 8px 24px rgba(15, 23, 42, 0.10)',
        'btn':    '0 4px 14px rgba(26, 86, 219, 0.40)',
        'msg':    '0 1px 3px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
