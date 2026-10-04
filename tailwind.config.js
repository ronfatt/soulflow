/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          950: '#070810',
          900: '#0c0e1a',
          850: '#111425',
          800: '#171b32',
          750: '#1e2341',
          700: '#272d53',
        },
        purple: {
          muted: '#8077b8',
          soft: '#a599e0',
          glow: '#c4b5fd',
        },
        gold: {
          muted: '#c5a059',
          warm: '#dfb76c',
          bright: '#f3cf7a',
          dark: '#9d7c38',
        },
        sand: {
          50: '#faf8f5',
          100: '#f5f0eb',
          200: '#eae2d7',
          300: '#dcd2c3',
          400: '#c0b4a1',
        },
        wellness: {
          bg: '#0a0c16',
          card: '#121526',
          cardBorder: 'rgba(255, 255, 255, 0.08)',
          glass: 'rgba(18, 21, 38, 0.75)',
          goldAccent: '#d4af37',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
        serif: ['"Playfair Display"', '"Noto Serif SC"', '"Songti SC"', 'STSong', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Noto Serif SC"', 'serif'],
      },
      boxShadow: {
        'soft-glow': '0 8px 32px 0 rgba(144, 135, 197, 0.15)',
        'gold-glow': '0 8px 24px 0 rgba(212, 175, 55, 0.2)',
        'card-elevated': '0 12px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
    },
  },
  plugins: [],
}
