/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all of your component files.
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
	],
	presets: [require("nativewind/preset")],
	theme: {
		colors: {
			text: "#e4ece9",
			background: "#1D2025",
			primary: "#96d4be",
			secondary: "#278262",
			accent: "#31d39a",
		},
		extend: {},
	},
	plugins: [],
}
