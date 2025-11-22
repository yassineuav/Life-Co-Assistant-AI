import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        accent: '#22C55E',
        dark: '#0F172A',
        light: '#F8FAFC',
      },
    },
  },
  plugins: [],
}
export default config
