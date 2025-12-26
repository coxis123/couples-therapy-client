/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm Sanctuary color palette
        sanctuary: {
          50: '#FFFBF7',   // Warmest white (backgrounds)
          100: '#FFF5EB',  // Cream
          200: '#FFECD8',  // Light peach
        },
        earth: {
          100: '#F5F0E8',  // Warm beige
          200: '#E8DFD3',  // Sand
          300: '#D4C5B3',  // Warm tan
          400: '#BDA893',  // Muted tan
          500: '#9A8570',  // Taupe
          600: '#7D6B57',  // Earth brown
          700: '#635445',  // Deep earth
          800: '#4A3F35',  // Dark brown
          900: '#352D26',  // Darkest earth
        },
        terracotta: {
          50: '#FDF6F3',   // Lightest coral
          100: '#FAEBE4',  // Light coral
          200: '#F5D4C8',  // Pale coral
          300: '#E9A998',  // Soft coral
          400: '#DD8B73',  // Medium coral
          500: '#D27B63',  // Warm coral (primary accent)
          600: '#B85E45',  // Deep coral (hover)
          700: '#994B38',  // Rich terracotta
          800: '#7A3D2E',  // Dark terracotta
          900: '#5C2E23',  // Darkest terracotta
        },
        sage: {
          100: '#E8EDE5',  // Lightest sage
          200: '#D4DFD0',  // Pale sage
          300: '#B8CCAE',  // Light sage
          400: '#9DB393',  // Soft sage
          500: '#7E9874',  // Connected state
          600: '#647A5B',  // Medium sage
          700: '#4D5E47',  // Deep sage
        },
        // Speaker-specific colors for message bubbles
        speaker: {
          trainee: {
            bg: '#F5EDE5',
            text: '#6B5B4D',
            border: '#D9C9B8',
          },
          partnerA: {
            bg: '#F0E6D8',
            text: '#7A6248',
            accent: '#C9A66B',
            border: '#D9C4A5',
          },
          partnerB: {
            bg: '#E8E0D5',
            text: '#6B6358',
            accent: '#A89B8C',
            border: '#C5B9A8',
          },
        },
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'heading': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
        'subheading': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'speaking': 'speaking 1s ease-in-out infinite',
        'message-appear': 'message-appear 0.4s ease-out',
        'breathe': 'breathe 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        speaking: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'message-appear': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.3' },
          '50%': { transform: 'scale(1.15)', opacity: '0.5' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(154, 133, 112, 0.15)',
        'warm-lg': '0 10px 40px -4px rgba(154, 133, 112, 0.2)',
        'inner-warm': 'inset 0 2px 4px 0 rgba(154, 133, 112, 0.1)',
        'glow-terracotta': '0 0 20px rgba(210, 123, 99, 0.3)',
        'glow-sage': '0 0 20px rgba(126, 152, 116, 0.3)',
      },
      borderRadius: {
        'organic': '40% 60% 60% 40% / 60% 30% 70% 40%',
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #FFFBF7 0%, #FFF5EB 50%, #FFECD8 100%)',
        'gradient-earth': 'linear-gradient(135deg, #F5F0E8 0%, #E8DFD3 100%)',
        'gradient-terracotta': 'linear-gradient(135deg, #D27B63 0%, #B85E45 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
      transitionTimingFunction: {
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
