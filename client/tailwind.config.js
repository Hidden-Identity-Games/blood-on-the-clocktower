/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    spacing: {
      0: "0",
      ".5": "4px",
      1: "8px",
      2: "16px",
      3: "24px",
      4: "32px",
      5: "40px",
      6: "48px",
    },
    extend: {},
  },
  plugins: [],
};
