const {fontFamily, screens} = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '475px',
      ...screens,
    },
    fontSize: {
      xxs: ['12px', '125%'],
      xs: ['14px', '125%'],
      sm: ['16px', '125%'],
      '2sm': ['18px', '125%'],
      base: ['20px', '125%'],
      md: ['20px', '125%'],
      lg: ['24px', '125%'],
      xl: ['30px', '125%'],
      '2xl': ['36px', '125%'],
      '3xl': ['48px', '125%'],
      '4xl': ['60px', '125%'], // "Uber"
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      screens: {
        betterhover: {raw: '(hover: hover)'},
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'primary-lighter-3': {
          DEFAULT: 'hsl(var(--primary-lighter-3))',
          foreground: 'hsl(var(--primary-lighter-3-foreground))',
        },
        'primary-lighter-2': {
          DEFAULT: 'hsl(var(--primary-lighter-2))',
          foreground: 'hsl(var(--primary-lighter-2-foreground))',
        },
        'primary-lighter-1': {
          DEFAULT: 'hsl(var(--primary-lighter-1))',
          foreground: 'hsl(var(--primary-lighter-1-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        'primary-darker-1': {
          DEFAULT: 'hsl(var(--primary-darker-1))',
          foreground: 'hsl(var(--primary-darker-1-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          200: 'var(--secondary-200)',
          // foreground: "hsl(var(--secondary-foreground))",
        },
        'tertiary-a': {
          DEFAULT: 'hsl(var(--secondary-300))',
          300: 'var(--tertiary-a-300)',
          // foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: {height: 0},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: 0},
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('tailwindcss-animate')],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
