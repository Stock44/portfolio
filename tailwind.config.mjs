/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: ["Cooper Hewitt", "Sans"]
    },
    extend: {
      borderWidth: {
        16: "16px"
      },
      colors: {
        magenta: {
          "50": "#FFDBED",
          "100": "#FFB2D9",
          "200": "#FF85C3",
          "300": "#FF50A9",
          "400": "#FF0082",
          "500": "#DF0375",
          "600": "#AE085E",
          "700": "#730940",
          "800": "#410826",
          "900": "#210614"
        }
      }
    }
  },
  plugins: []
};
