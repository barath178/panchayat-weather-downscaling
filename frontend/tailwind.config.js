/** @type {import('tailwindcss').Config} */
module.exports = {
  // Wrap every hover: variant in @media (hover: hover), so touch screens don't get stuck hover states after a tap.
  future: { hoverOnlyWhenSupported: true },
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Brand tokens – defined as CSS variables in globals.css
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        surface2: 'rgb(var(--surface-2) / <alpha-value>)',
        raised: 'rgb(var(--raised) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        ink2: 'rgb(var(--ink-2) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-ink': 'rgb(var(--accent-ink) / <alpha-value>)',
        sky: 'rgb(var(--sky) / <alpha-value>)',
        sun: 'rgb(var(--sun) / <alpha-value>)',
        alert: 'rgb(var(--alert) / <alpha-value>)',
        frost: 'rgb(var(--frost) / <alpha-value>)',
        // Status (fixed; always paired with icon + label)
        good: '#2FB344',
        warn: '#F2B01E',
        bad: '#E5484D',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        // "Field instrument" language: tight, machined corners
        card: '14px',
      },
      boxShadow: {
        card: '0 1px 0 rgb(255 255 255 / 0.04) inset, 0 20px 40px -24px rgb(0 0 0 / 0.7)',
        pop: '0 24px 60px -12px rgb(0 0 0 / 0.75)',
        glow: '0 0 0 1px rgb(var(--accent) / 0.35), 0 8px 30px -6px rgb(var(--accent) / 0.35)',
      },
      gridTemplateColumns: {
        14: 'repeat(14, minmax(0, 1fr))',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'rise': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 220ms ease-out both',
        rise: 'rise 600ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
        'pulse-ring': 'pulse-ring 1.8s ease-out infinite',
      },
    },
  },
  plugins: [],
};
