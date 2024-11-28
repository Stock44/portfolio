import { defineConfig } from "astro/config";
import alpinejs from "@astrojs/alpinejs";
import tailwind from "@astrojs/tailwind";
import rehypeShiftHeading from "rehype-shift-heading";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [alpinejs(), tailwind(), mdx()],
  markdown: {
    rehypePlugins: [[rehypeShiftHeading, { shift: 1 }]],
  },
});
