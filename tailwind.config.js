/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Demiland Brand Colors
        demiland: {
          50: '#faf8ff',
          100: '#f3f0ff',
          200: '#e9e3ff',
          300: '#d9d0ff',
          400: '#c4b5ff',
          500: '#b8a4d9', // Primary Demiland Purple
          600: '#a689c9',
          700: '#9270b8',
          800: '#7a5c98',
          900: '#634a7a',
        },
        charcoal: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#b0b0b0',
          500: '#8a8a8a',
          600: '#5a5a5a', // Demiland Gray
          700: '#4a4a4a',
          800: '#3a3a3a',
          900: '#2a2a2a',
        },
        purple: {
          50: '#faf8ff',
          100: '#f3f0ff',
          200: '#e9e3ff',
          300: '#d9d0ff',
          400: '#c4b5ff',
          500: '#b8a4d9',
          600: '#a689c9',
          700: '#9270b8',
          800: '#7a5c98',
          900: '#634a7a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'Cambria', 'serif'],
        luxury: ['Cormorant Garamond', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'luxury-gradient': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'rose-gold': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'iridescent': 'linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
        'shimmer': 'linear-gradient(110deg, rgba(227, 229, 233, 0) 0%, rgba(227, 229, 233, 0) 40%, rgba(227, 229, 233, 0.5) 50%, rgba(227, 229, 233, 0) 60%, rgba(227, 229, 233, 0) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-gentle': 'bounceGentle 3s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 10s linear infinite',
        'scale-pulse': 'scalePulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(236, 72, 153, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(236, 72, 153, 0.8), 0 0 30px rgba(139, 92, 246, 0.6)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scalePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'luxury': '0 20px 40px -12px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 20px rgba(236, 72, 153, 0.5)',
        'glow-lg': '0 0 40px rgba(236, 72, 153, 0.6)',
        'neumorphism': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
        'neumorphism-inset': 'inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff',
      },
      backdropBlur: {
        xs: '2px',
      },
      blur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}