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
      colors: {
        // Refined Indian Heritage Meets Global Travel Palette
        ivory: {
          DEFAULT: '#F7F4EC',
          50: '#FDFAF4',
          100: '#F7F4EC',
          200: '#EFE9DC',
          300: '#E2D9C8',
        },
        cream: {
          DEFAULT: '#EFE9DC',
          light: '#F5F1E8',
          dark: '#E2D9C8',
        },
        saffron: {
          DEFAULT: '#FF9933',
          light: '#FFAA4D',
          dark: '#E68222',
        },
        terracotta: {
          DEFAULT: '#B85C38',
          light: '#C86E4B',
          dark: '#9A4928',
        },
        forest: {
          DEFAULT: '#174B37',
          light: '#23634B',
          dark: '#0F3426',
        },
        navy: {
          50: '#f0f4ff',
          100: '#e0e8ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#1e3a5f',
          600: '#172e4a',
          700: '#0f1f35',
          800: '#0a1628',
          900: '#060e1a',
          950: '#030711',
          deep: '#14243A',
        },
        cyan: {
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
          950: '#083344',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        sos: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
