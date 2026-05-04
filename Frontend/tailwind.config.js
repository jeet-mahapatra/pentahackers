/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ IMPORTANT
  ],
  theme: {
    extend: {
      colors: {
        primaryBg: "#070A1A", // your landing background
      },
    },
  },
  plugins: [],
};
