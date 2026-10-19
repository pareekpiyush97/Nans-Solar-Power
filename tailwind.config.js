/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F3F8F4',
        'bg-tint': '#E9F3EC',
        surface: '#FFFFFF',
        'surface-2': '#EEF4F0',
        border: '#E1EAE4',
        'border-strong': '#CEDBD3',
        fg: '#0F1B16',
        'fg-soft': '#2C3A33',
        muted: '#5E6E66',
        'muted-2': '#7A8A82',
        green: {
          DEFAULT: '#15A24A',
          50: '#E6F6ED',
          600: '#128A3E',
          700: '#0E6E32',
        },
        sky: {
          DEFAULT: '#0EA5E9',
          50: '#E2F4FD',
          600: '#0284C7',
        },
        amber: {
          DEFAULT: '#F59E0B',
          50: '#FEF3DF',
        },
        star: '#F6B01E',
      },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
        body: ['Figtree', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        xl2: '18px',
      },
      boxShadow: {
        sm2: '0 1px 2px rgba(15,40,28,.05),0 1px 1px rgba(15,40,28,.03)',
        md2: '0 10px 28px -12px rgba(15,50,30,.18),0 2px 6px rgba(15,50,30,.05)',
        lg2: '0 30px 70px -24px rgba(15,60,35,.28)',
      },
      maxWidth: {
        wrap: '1200px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'fade-up': 'fade-up .6s cubic-bezier(.22,.61,.36,1) both',
      },
    },
  },
  plugins: [],
}
