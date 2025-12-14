import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        card: '#111111',
        'card-foreground': '#ffffff',
        primary: '#3b82f6',
        'primary-foreground': '#ffffff',
        secondary: '#1a1a1a',
        'secondary-foreground': '#a0a0a0',
        muted: '#262626',
        'muted-foreground': '#666666',
        accent: '#3b82f6',
        'accent-foreground': '#ffffff',
        destructive: '#ef4444',
        border: '#262626',
        input: '#262626',
        ring: '#3b82f6',
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config
