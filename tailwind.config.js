/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: { DEFAULT: '#F4F1EA', dark: '#12141A' },
        ink: { DEFAULT: '#16161D', soft: '#5B5A63' },
        line: {
          core: '#E4322B',     // Computer Science core — red line
          math: '#1F6FEB',     // Mathematics — blue line
          gen: '#14946B',      // General education — green line
          elective: '#F2A900', // Electives — amber line
          lang: '#8B4FD8',     // Languages & communication — violet line
        },
      },
      boxShadow: {
        ticket: '0 1px 0 rgba(22,22,29,.08), 0 8px 24px -12px rgba(22,22,29,.25)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        flip: {
          '0%': { transform: 'rotateX(90deg)', opacity: '0' },
          '100%': { transform: 'rotateX(0)', opacity: '1' },
        },
        dash: { to: { strokeDashoffset: '0' } },
        rise: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 1.8s ease-out infinite',
        flip: 'flip .45s ease-out both',
        dash: 'dash 2.2s ease-out forwards',
        rise: 'rise .5s ease-out both',
      },
    },
  },
  plugins: [],
}
