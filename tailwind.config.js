/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./docs/**/*.{md,mdx}",
    "./blog/**/*.{md,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx,md,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}