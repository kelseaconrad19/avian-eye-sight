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
				// New warm, nature-loving palette
				brand: {
					50: '#faf9f6',   // lightest cream
					100: '#f5f2eb',  // cream
					200: '#ede6d8',  // warm cream
					300: '#e0d2c4',  // blush
					400: '#d1b8a7',  // deeper blush
					500: '#bc9a86',  // terracotta
					600: '#a67c65',  // deeper terracotta
					700: '#8b5a3c',  // deep chestnut for headings
					800: '#6b4529',  // darker brown
					900: '#4a2f1a',  // deepest brown
				},
				leaf: {
					50: '#f4f7f1',
					100: '#e7efdc',
					200: '#d0dfbe',
					300: '#b3ca94',
					400: '#98b56f',
					500: '#7a9b4d',  // main leafy green accent
					600: '#5f7a3a',
					700: '#4b5e2f',
					800: '#3e4d28',
					900: '#354024',
				},
				sky: {
					50: '#f0f9ff',   // pale sky blue for backgrounds
					100: '#e0f2fe',
					200: '#bae6fd',
					300: '#7dd3fc',
					400: '#38bdf8',
					500: '#0ea5e9',
					600: '#0284c7',
					700: '#0369a1',
					800: '#075985',
					900: '#0c4a6e',
				},
				// Keep existing colors for compatibility
				maroon: {
					50: '#fbf0f2',
					100: '#f7e2e5',
					200: '#efc5cb',
					300: '#e29da8',
					400: '#d16c7d',
					500: '#ba3f55',
					600: '#a52e46',
					700: '#8a2239',
					800: '#74203a',
					900: '#5f1e2e',
				},
				earth: {
					50: '#f6f5f0',
					100: '#e9e6d8',
					200: '#d5cdb5',
					300: '#bbac8a',
					400: '#a18f69',
					500: '#8e795a',
					600: '#76614a',
					700: '#5d4c3d',
					800: '#4b3e35',
					900: '#3d332f',
				},
				nature: {
					50: '#f5f9e9',
					100: '#e9f2d0',
					200: '#d5e5a3',
					300: '#b9d16d',
					400: '#a3c14a',
					500: '#84ab2e',
					600: '#648023',
					700: '#4d7c0f',
					800: '#3a5815',
					900: '#2a4212',
				},
				azure: {
					50: '#edfcff',
					100: '#d6f5fe',
					200: '#b5ebfd',
					300: '#83dcfb',
					400: '#48c5f3',
					500: '#22aceb',
					600: '#0891b2',
					700: '#0e74a1',
					800: '#145c84',
					900: '#154d6f',
				}
			},
			fontFamily: {
				sans: ['Nunito', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
				body: ['Nunito', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
				display: ['Merriweather Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				card: '1rem',  // generous 1rem radius for cards
			},
			boxShadow: {
				card: '0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',  // soft, diffuse shadow
				'card-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'zoom-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'zoom-in': 'zoom-in 0.4s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
