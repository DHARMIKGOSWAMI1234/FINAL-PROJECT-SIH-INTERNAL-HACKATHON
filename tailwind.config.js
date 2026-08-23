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
        // AGRISENSE Stitch Obsidian & Precision Dark Palette
        obsidian: {
          DEFAULT: '#080C0E',     // Base Obsidian Canvas
          canvas: '#080C0E',      // Deepest background
          lowest: '#040708',      // Level 0 container
          low: '#0B1115',         // Level 1 surface
          card: '#0F161A',        // Standard telemetry card
          high: '#151E24',        // Elevated panel
          highest: '#1D2A32',     // Hover / active surface
          bright: '#1C2730',      // Highlight surface
        },
        // Backward-compatible charcoal alias
        charcoal: {
          base: '#080C0E',
          secondary: '#0B1115',
          card: '#0F161A',
          elevated: '#151E24',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.04)',
        },
        // Semantic Precision Multi-Color System
        growth: {
          DEFAULT: '#10B981',     // Emerald (Agriculture, Growth, Optimal)
          emerald: '#10B981',
          light: '#34D399',
          dark: '#064E3B',
        },
        tech: {
          DEFAULT: '#06B6D4',     // Cyan (AI Tech, Weather, Sensors)
          cyan: '#06B6D4',
          light: '#38BDF8',
          dark: '#164E63',
        },
        intel: {
          DEFAULT: '#8B5CF6',     // Violet (Intelligence, Gemini Insights)
          violet: '#8B5CF6',
          light: '#A78BFA',
          dark: '#4C1D95',
        },
        nutrient: {
          DEFAULT: '#F59E0B',     // Amber (NPK Nutrients, Warning/Moderate)
          amber: '#F59E0B',
          light: '#FBBF24',
          dark: '#78350F',
        },
        critical: {
          DEFAULT: '#EF4444',     // Red (Deficiencies, Alerts)
          red: '#EF4444',
          light: '#F87171',
          dark: '#7F1D1D',
        },
        // Agri semantic aliases
        agri: {
          emerald: '#10B981',     // Growth Emerald Primary
          cyan: '#06B6D4',        // Atmospheric & Tech Cyan
          blue: '#2563EB',        // Deep Royal Blue
          violet: '#8B5CF6',      // Neural Violet
          amber: '#F59E0B',       // Nutrient Amber
          terracotta: '#EF4444',  // Critical Warning
        },
        // Typography & Text Tokens
        'text-primary': '#F8FAFC',
        'text-muted': '#94A3B8',
        warmwhite: '#F8FAFC',
        mutedgray: '#94A3B8',
        // Light Mode Surface Tokens (Warm Off-White, Premium, Calm)
        lightbg: {
          DEFAULT: '#F2F1EC',
          base: '#F2F1EC',
          secondary: '#EAEAE4',
          card: '#F8F8F4',
          elevated: '#FCFCF9',
          border: '#D6D8D3',
          text: '#17212B',
          sub: '#596773',
          muted: '#77838D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'Noto Sans Devanagari', 'Noto Sans Gujarati', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.28)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.28)',
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.28)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.28)',
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.28)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.55)',
        'glass-light': '0 8px 30px 0 rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}

