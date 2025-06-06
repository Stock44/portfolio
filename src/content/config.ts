// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';
// 2. Define your collection(s)
const postsCollection = defineCollection({
	type: 'content',
	schema: z.object({
		id: z.number().int(),
		title: z.string(),
		subtitle: z.string(),
		publishDate: z.date(),
		lastUpdated: z.date(),
		tags: z.array(z.string()),
	}),
});
// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
	posts: postsCollection,
};
