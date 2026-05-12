/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
      },
      colors: {
        ink: "#172033",
        muted: "#667085",
        brand: {
          50: "#eff8ff",
          100: "#d1e9ff",
          600: "#1570ef",
          700: "#175cd3",
          900: "#194185",
        },
        success: "#067647",
        danger: "#b42318",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
