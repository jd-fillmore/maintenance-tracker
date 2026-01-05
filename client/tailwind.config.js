/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: "#af0e0e",
        "primary-dark": "#8c0b0b",
        secondary: "#ffc821",
        darkbg: "#1c1c1c",
        darkcard: "#242424",
        darktext: "#f5f5f5",
        darkinput: "#2a2a2a",
      },
    },
  },
  plugins: [],
};
