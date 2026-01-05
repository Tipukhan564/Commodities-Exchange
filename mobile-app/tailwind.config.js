/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk Theme
        'cyber-dark': '#0a0e17',
        'cyber-darker': '#050806',
        'cyber-surface': '#111827',
        'cyber-surface-light': '#1e293b',

        // Neon Colors
        'neon-cyan': '#0dccf2',
        'neon-green': '#00ffa3',
        'neon-electric': '#13ec5b',
        'neon-purple': '#8c25f4',
        'neon-pink': '#ff007a',
        'neon-red': '#ff3b3b',

        // Trading Colors
        'profit-green': '#10B981',
        'loss-red': '#EF4444',
      },
      fontFamily: {
        'space': ['"Space Grotesk"', 'sans-serif'],
        'noto': ['"Noto Sans"', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(13, 204, 242, 0.5), 0 0 40px rgba(13, 204, 242, 0.2)',
        'neon-green': '0 0 20px rgba(0, 255, 163, 0.5), 0 0 40px rgba(0, 255, 163, 0.2)',
        'neon-purple': '0 0 20px rgba(140, 37, 244, 0.5), 0 0 40px rgba(140, 37, 244, 0.2)',
        'neon-red': '0 0 20px rgba(255, 59, 59, 0.5), 0 0 40px rgba(255, 59, 59, 0.2)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'rotate-slow': 'rotate 10s linear infinite',
        'pulse-ring': 'pulseRing 1.5s ease-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(13, 204, 242, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(13, 204, 242, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.33)', opacity: '0.8' },
          '80%, 100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'cyber-grid': `radial-gradient(circle at 50% 50%, rgba(13, 204, 242, 0.03) 0%, transparent 50%),
          linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .02) 25%, rgba(255, 255, 255, .02) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .02) 75%, rgba(255, 255, 255, .02) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .02) 25%, rgba(255, 255, 255, .02) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .02) 75%, rgba(255, 255, 255, .02) 76%, transparent 77%, transparent)`,
        'radial-cyan': 'radial-gradient(circle at 50% 0%, rgba(0, 255, 163, 0.08) 0%, rgba(5, 8, 6, 0) 70%)',
        'gradient-cyan': 'linear-gradient(135deg, #0dccf2 0%, #0066ff 100%)',
        'gradient-green': 'linear-gradient(135deg, #00ffa3 0%, #00dc82 100%)',
        'gradient-purple': 'linear-gradient(135deg, #8c25f4 0%, #6b21a8 100%)',
      },
    },
  },
  plugins: [],
}
