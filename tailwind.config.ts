
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom theme colors
				ethereum: {
					DEFAULT: '#627EEA',
					light: '#8BA3F9',
					dark: '#4058A8',
				},
				polygon: {
					DEFAULT: '#8247E5',
					light: '#A47EF2',
					dark: '#5F32A8',
				},
				teleport: {
					DEFAULT: '#00F6FF',
					light: '#7FFFFF',
					dark: '#00B0B8',
				},
				space: {
					DEFAULT: '#0D1021',
					light: '#1E2243',
					dark: '#070810',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'teleport': {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'50%': { transform: 'scale(0.8)', opacity: '0.5' },
					'100%': { transform: 'scale(0)', opacity: '0' }
				},
				'receive': {
					'0%': { transform: 'scale(0)', opacity: '0' },
					'50%': { transform: 'scale(0.8)', opacity: '0.5' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'pulse-glow': {
					'0%': { boxShadow: '0 0 5px 0 rgba(0, 246, 255, 0.4)' },
					'50%': { boxShadow: '0 0 20px 5px rgba(0, 246, 255, 0.7)' },
					'100%': { boxShadow: '0 0 5px 0 rgba(0, 246, 255, 0.4)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'teleport': 'teleport 1.5s ease-in-out',
				'receive': 'receive 1.5s ease-in-out',
				'pulse-glow': 'pulse-glow 2s infinite'
			},
			backgroundImage: {
				'space-gradient': 'radial-gradient(circle at center, #1E2243 0%, #0D1021 100%)',
				'ethereum-gradient': 'linear-gradient(135deg, #627EEA 0%, #4058A8 100%)',
				'polygon-gradient': 'linear-gradient(135deg, #8247E5 0%, #5F32A8 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
