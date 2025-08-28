/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F2EBFF",
          100: "#E6DBFF",
          200: "#CABAFD",
          300: "#A892FF",
          400: "#8D6BFF",
          500: "#6A42FF", // sidebar purple
          600: "#5A38E0",
          700: "#4A2FC2",
          800: "#3B27A3",
          900: "#2D1F85"
        },
        sand: {
          50: "#F5ECE6", // page background beige
          100: "#EADFD6",
          200: "#E3D6CC"
        },
        success: "#33C58C",
        warning: "#F5C042",
        danger: "#FF6B6B"
      },
      borderRadius: {
        xl: "14px",
        '2xl': "20px"
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.06)"
      }
    }
  },
  plugins: []
};



