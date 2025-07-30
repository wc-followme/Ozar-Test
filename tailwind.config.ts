import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        cyanwave: {
          main: '#00A8BF',
          light: '#00A8BF26',
        },
        yellowbrand: {
          DEFAULT: '#EBB402',
          100: '#EBB4021A',
          200: '#EBB40226',
        },
        greenbrand: {
          DEFAULT: '#34AD44',
          100: '#34AD4426',
        },
        bluebrand: {
          DEFAULT: '#1A57BF',
          100: '#1A57BF1A',
        },
        redbrand: {
          DEFAULT: '#D43232',
          100: '#D4323226',
        },
        limebrand: {
          DEFAULT: '#90C91D',
          100: '#90C91D26',
        },
        orangebrand: {
          DEFAULT: '#F58B1E',
          100: '#F58B1E1A',
        },
        purplebrand: {
          DEFAULT: '#9c88ff',
        },
        blueaccent: {
          DEFAULT: '#4c6ef5',
        },
        orangeaccent: {
          DEFAULT: '#fd7e14',
        },
        pinkbrand: {
          DEFAULT: '#ff6b6b',
        },
        graybrand: {
          DEFAULT: '#818181',
        },
        darkbrand: {
          DEFAULT: '#2D2D2D',
        },
        bordergray: {
          DEFAULT: '#BFBFBF',
        },
        borderlight: {
          DEFAULT: '#E8EAED',
        },
        placeholdergray: {
          DEFAULT: '#C0C6CD',
        },
        blueicon: {
          DEFAULT: '#24338C',
        },
        badgegray: {
          DEFAULT: '#F4F5F6',
        },
        modalred: {
          DEFAULT: '#D4323226',
        },
        buttonblue: {
          DEFAULT: '#263796',
        },
        sidebarpurple: {
          DEFAULT: '#6B77BF',
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      clipPath: {
        'concave-top-right':
          'path("M0,0 H0.85 A0.15,0.15 0 0 1 1,0.15 V1 H0 Z")',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      boxShadow: {
        custom: '0px 2px 8px 0px #0000001A',
        'card-hover': 'rgba(0, 0, 0, 0.1) 0px 10px 50px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),

    // ✅ FIXED: Properly typed custom plugin
    function ({ addUtilities }: any) {
      addUtilities(
        {
          '.border-image-custom': {
            borderWidth: '30px',
            borderStyle: 'solid',
            borderImage: "url('/images/border-img.png') 30 stretch",
          },
          // Custom grid-cols utilities
          '.grid-cols-autofit': {
            gridTemplateColumns: 'repeat(auto-fill, minmax(255px, 1fr))',
          },
          '.grid-cols-autofit-xl': {
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          },
        },
        {
          variants: ['responsive'], // optional
        }
      );
    },
  ],
};

export default config;
