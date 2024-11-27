/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: ["Cooper Hewitt", "Sans"],
    },
    extend: {
      borderWidth: {
        16: "16px",
      },
      colors: {
        magenta: {
          50: "#fff7fa",
          100: "#ffcddb",
          200: "#ff91b5",
          300: "#ef0b7a",
          400: "#be1962",
          500: "#921d4d",
          600: "#611a34",
          700: "#391520",
          800: "#2a1219",
          900: "#16090c",
          950: "#070203",
        },
      },
    },
  },
  plugins: [],
};
