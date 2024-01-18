/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dune: {
          50: "#feefec80",
          100: "#fef2f2",
          150: "#fee2e2",
          200: "#fddfd8",
          300: "#fab09f",
          600: "#dc5638",
        },
        dblue: {
          200: "#DEEBFF",
        },
        placeholder: "hsl(0, 0%, 50%)",
      },
      zIndex: {
        "10000": "10000",
      },
    },
  },
  plugins: [],
};
