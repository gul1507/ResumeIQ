/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#05070B',
          900: '#070A10',
          850: '#0B1019',
          800: '#0F1623',
          750: '#141D2E',
          700: '#1A263C',
          600: '#283955',
          500: '#3D5377'
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ff5c00', // Electric Vermilion Flame
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        indigo: {
          400: '#fb923c',
          500: '#ff5c00',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        radar: {
          cyan: '#00C9FF',
          teal: '#00F5A0',
          amber: '#FFA133',
          crimson: '#FF2E63',
          violet: '#A855F7',
        },
        accent: {
          teal: '#00F5A0',
          emerald: '#10b981',
          cyan: '#00C9FF',
          violet: '#a855f7',
          amber: '#FFA133',
          rose: '#FF2E63'
        },
        surface: {
          50: '#0B1019',
          100: '#0F1623',
          200: '#141D2E',
          300: '#1A263C',
          800: '#070A10',
          900: '#05070B'
        },
        match: {
          strong: '#00F5A0',   // Signal Emerald
          moderate: '#FFA133', // Electric Amber
          weak: '#FF2E63'      // Hot Crimson
        }
      },
      boxShadow: {
        'glow-brand': '0 0 30px -4px rgba(255, 92, 0, 0.35)',
        'glow-indigo': '0 0 30px -4px rgba(255, 92, 0, 0.35)',
        'glow-teal': '0 0 30px -4px rgba(0, 245, 160, 0.3)',
        'glow-cyan': '0 0 30px -4px rgba(0, 201, 255, 0.3)',
        'glow-emerald': '0 0 30px -4px rgba(0, 245, 160, 0.3)',
        'tactile-card': '0 12px 40px -10px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'card-lift': '0 12px 35px -8px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(ellipse at top, rgba(255, 92, 0, 0.12), transparent 70%)',
        'radial-glow-hero': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255, 92, 0, 0.15), rgba(7, 10, 16, 0))',
        'gradient-dark-card': 'linear-gradient(180deg, rgba(15, 22, 35, 0.75) 0%, rgba(7, 10, 16, 0.85) 100%)'
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Syne', 'Outfit', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'orb-drift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(35px, -25px) scale(1.06)' },
          '66%': { transform: 'translate(-25px, 15px) scale(0.96)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 92, 0, 0.2)' },
          '50%': { boxShadow: '0 0 45px rgba(255, 92, 0, 0.4), 0 0 90px rgba(255, 92, 0, 0.15)' },
        },
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'gradient-x': 'gradient-x 4s ease infinite',
        'orb': 'orb-drift 18s ease-in-out infinite',
        shimmer: 'shimmer 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'radar-sweep': 'radar-sweep 8s linear infinite'
      }
    },
  },
  plugins: [],
}
