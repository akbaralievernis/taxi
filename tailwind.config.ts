import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '475px',
      },
      colors: {
        // Основной — индиго/фиолетовый (премиум, современно)
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Акцент — cyan (для иконок, подсветок)
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Золотой палитра для премиум-класса (бизнес-класса)
        gold: {
          50: '#fffdf5',
          100: '#fef7da',
          200: '#fdeca7',
          300: '#fbda6c',
          400: '#f9c53d',
          500: '#f5aa1a',
          600: '#d7890f',
          700: '#b2650f',
          800: '#915013',
          900: '#774113',
          950: '#452105',
        },
        // Графитовые оттенки для премиального темного фона
        graphite: {
          50: '#f6f6f7',
          100: '#eef0f2',
          200: '#dadfe5',
          300: '#b8c3d0',
          400: '#90a1b6',
          500: '#70849e',
          600: '#586b85',
          700: '#47566c',
          800: '#3c485a',
          900: '#343d4c',
          950: '#050508', // очень глубокий черный
        },
        // Mint для success-кнопок и подтверждений
        mint: {
          50: '#ecfdf5',
          100: '#d1fae5',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        // Розовый акцент (для редких выделений)
        pink: {
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
        // Поверхности (используются через CSS-переменные)
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          elevated: 'rgb(var(--surface-elevated) / <alpha-value>)',
          muted: 'rgb(var(--surface-muted) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
          subtle: 'rgb(var(--ink-subtle) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--border) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Cabinet Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-sm': 'floatSm 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'glow-breathe': 'glowBreathe 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'marquee': 'marquee 40s linear infinite',
        'text-shimmer': 'textShimmer 3s ease infinite',
        'radar-ping': 'radarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatSm: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        glowBreathe: {
          '0%, 100%': { opacity: '0.4', filter: 'brightness(0.9) drop-shadow(0 0 10px rgba(99, 102, 241, 0.2))' },
          '50%': { opacity: '1', filter: 'brightness(1.1) drop-shadow(0 0 25px rgba(99, 102, 241, 0.5))' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        textShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        radarPing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-1': 'radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.35) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(265, 98%, 61%, 0.30) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(190, 98%, 56%, 0.30) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(295, 98%, 61%, 0.25) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(238, 98%, 71%, 0.30) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 0.20) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow': '0 0 40px rgba(99, 102, 241, 0.4)',
        'glow-lg': '0 0 60px rgba(99, 102, 241, 0.5)',
        'glow-accent': '0 0 40px rgba(6, 182, 212, 0.4)',
        'glow-gold': '0 0 40px rgba(245, 170, 26, 0.4)',
        'glow-neon': '0 0 30px rgba(6, 182, 212, 0.35)',
        'depth-sm': '0 2px 8px rgba(0, 0, 0, 0.2)',
        'depth-md': '0 8px 30px rgba(0, 0, 0, 0.3)',
        'inner-lg': 'inset 0 2px 8px 0 rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
    },
  },
  plugins: [],
};

export default config;
