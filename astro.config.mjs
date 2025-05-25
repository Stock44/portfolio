import { defineConfig } from 'astro/config';
import alpinejs from '@astrojs/alpinejs';
import tailwindcss from '@tailwindcss/vite';
import rehypeShiftHeading from 'rehype-shift-heading';

import mdx from '@astrojs/mdx';

export default defineConfig({
	integrations: [alpinejs(), mdx()],
	vite: {
		plugins: [tailwindcss()],
	},
	markdown: {
		rehypePlugins: [[rehypeShiftHeading, { shift: 1 }]],
	},
});
