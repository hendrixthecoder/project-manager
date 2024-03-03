/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
    "node_modules/tv-*/dist/tv-*.umd.min.js",
  ],
  darkMode: "class",
  theme: {
    extend: {},
    fontFamily: {
      body: ["Poppins", "sans-serif"],
    },
  },
  plugins: [],
}
