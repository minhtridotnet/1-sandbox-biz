/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sandbox: {
          navy: '#020817',
          midnight: '#031B3F',
          royal: '#062B78',
          card: '#071A33',
          elevated: '#0B2447',
          blue: '#1463FF',
          cyan: '#00D9FF',
          aqua: '#14F1D9',
          gold: '#FFC72C',
          amber: '#FFB000',
          text: '#F8FAFC',
          softText: '#B8C7E0',
          muted: '#7F94B5',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at 20% 20%, rgba(20,99,255,0.28), transparent 32%), radial-gradient(circle at 85% 75%, rgba(0,217,255,0.22), transparent 30%), linear-gradient(135deg, #020817 0%, #031B3F 45%, #062B78 100%)',
        'card-premium':
          'linear-gradient(145deg, rgba(11,36,71,0.92), rgba(3,14,35,0.96))',
        'cta-gold':
          'linear-gradient(135deg, #FFC72C 0%, #FFB000 45%, #FF8A00 100%)',
        'cta-ai': 'linear-gradient(135deg, #1463FF 0%, #00D9FF 100%)',
      },
      boxShadow: {
        card: '0 18px 48px rgba(0,0,0,0.35)',
        'glow-gold': '0 0 28px rgba(255,199,44,0.32)',
        'glow-cyan': '0 0 28px rgba(0,217,255,0.28)',
        'glow-gold-soft': '0 0 18px rgba(255,199,44,0.18)',
        'glow-cyan-soft': '0 0 18px rgba(0,217,255,0.18)',
      },
      borderColor: {
        cyanish: 'rgba(0,217,255,0.16)',
        divider: 'rgba(148,163,184,0.18)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        draw: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        'pulse-glow': {
          '0%,100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        draw: 'draw 1.2s ease-out forwards',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
