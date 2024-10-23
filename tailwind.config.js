/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
	  "./index.html",
	  "./src/**/*.{js,ts,jsx,tsx}",
	  "./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
	  extend: {
		borderRadius: {
		  lg: 'var(--radius)',
		  md: 'calc(var(--radius) - 2px)',
		  sm: 'calc(var(--radius) - 4px)',
		},
		colors: {
		  // Map your custom colors to Zinc
		  background: 'hsl(var(--background, 0 0% 98%))',  // Example: Zinc-50
		  foreground: 'hsl(var(--foreground, 0 0% 20%))',  // Example: Zinc-900
		  card: {
			DEFAULT: 'hsl(var(--card, 0 0% 95%))',  // Example: Zinc-100
			foreground: 'hsl(var(--card-foreground, 0 0% 20%))',  // Example: Zinc-900
		  },
		  popover: {
			DEFAULT: 'hsl(var(--popover, 0 0% 95%))',  // Example: Zinc-100
			foreground: 'hsl(var(--popover-foreground, 0 0% 20%))',  // Example: Zinc-900
		  },
		  primary: {
			DEFAULT: 'hsl(var(--primary, 0 0% 20%))',  // Example: Zinc-900
			foreground: 'hsl(var(--primary-foreground, 0 0% 98%))',  // Example: Zinc-50
		  },
		  secondary: {
			DEFAULT: 'hsl(var(--secondary, 0 0% 40%))',  // Example: Zinc-500
			foreground: 'hsl(var(--secondary-foreground, 0 0% 98%))',  // Example: Zinc-50
		  },
		  muted: {
			DEFAULT: 'hsl(var(--muted, 0 0% 80%))',  // Example: Zinc-300
			foreground: 'hsl(var(--muted-foreground, 0 0% 50%))',  // Example: Zinc-600
		  },
		  accent: {
			DEFAULT: 'hsl(var(--accent, 0 0% 60%))',  // Example: Zinc-400
			foreground: 'hsl(var(--accent-foreground, 0 0% 98%))',  // Example: Zinc-50
		  },
		  destructive: {
			DEFAULT: 'hsl(var(--destructive, 0 0% 20%))',  // Example: Zinc-900
			foreground: 'hsl(var(--destructive-foreground, 0 0% 98%))',  // Example: Zinc-50
		  },
		  border: 'hsl(var(--border, 0 0% 80%))',  // Example: Zinc-300
		  input: 'hsl(var(--input, 0 0% 95%))',  // Example: Zinc-100
		  ring: 'hsl(var(--ring, 0 0% 80%))',  // Example: Zinc-300
		  chart: {
			'1': 'hsl(var(--chart-1, 0 0% 20%))',  // Example: Zinc-900
			'2': 'hsl(var(--chart-2, 0 0% 40%))',  // Example: Zinc-500
			'3': 'hsl(var(--chart-3, 0 0% 60%))',  // Example: Zinc-400
			'4': 'hsl(var(--chart-4, 0 0% 80%))',  // Example: Zinc-300
			'5': 'hsl(var(--chart-5, 0 0% 98%))',  // Example: Zinc-50
		  }
		}
	  }
	},
	plugins: [require("tailwindcss-animate")],
  }
  