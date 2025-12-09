/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    "bg-red-500",
    "text-white",
    "text-3xl",
    "p-4",
    "min-h-screen",
    "bg-base-100",
    "text-base-content",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark", "synthwave", "lofi"],
  },
};
