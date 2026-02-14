import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			cozy: '0 2px 12px 0 rgba(212, 135, 143, 0.12)',
  			'cozy-lg': '0 4px 24px 0 rgba(212, 135, 143, 0.16)',
  			'cozy-glow': '0 0 20px 4px rgba(245, 197, 184, 0.25)',
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			cozy: {
  				sage: '#B5C5B8',
  				lavender: '#C9BDD4',
  				peach: '#F5C5B8',
  				apricot: '#F0DDD6',
  			}
  		},
  		keyframes: {
  			'cozy-float': {
  				'0%, 100%': { transform: 'translateY(0)' },
  				'50%': { transform: 'translateY(-6px)' },
  			},
  			'cozy-breathe': {
  				'0%, 100%': { transform: 'scale(1)', opacity: '1' },
  				'50%': { transform: 'scale(1.04)', opacity: '0.9' },
  			},
  			'cozy-blob-drift': {
  				'0%, 100%': { transform: 'translate(0, 0) scale(1)' },
  				'33%': { transform: 'translate(20px, -15px) scale(1.05)' },
  				'66%': { transform: 'translate(-10px, 10px) scale(0.95)' },
  			},
  			'cozy-fade-in': {
  				from: { opacity: '0', transform: 'translateY(8px)' },
  				to: { opacity: '1', transform: 'translateY(0)' },
  			},
  			'cozy-pulse-ring': {
  				'0%': { transform: 'scale(1)', opacity: '0.6' },
  				'100%': { transform: 'scale(1.5)', opacity: '0' },
  			},
  		},
  		animation: {
  			'cozy-float': 'cozy-float 4s ease-in-out infinite',
  			'cozy-breathe': 'cozy-breathe 5s ease-in-out infinite',
  			'cozy-blob-drift': 'cozy-blob-drift 12s ease-in-out infinite',
  			'cozy-fade-in': 'cozy-fade-in 0.5s ease-out forwards',
  			'cozy-pulse-ring': 'cozy-pulse-ring 2s ease-out infinite',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
