import { CollectionEntry } from 'astro:content';

export function compareByPublishDates(
	a: CollectionEntry<'posts'>,
	b: CollectionEntry<'posts'>,
) {
	const { publishDate: aDate } = a.data;
	const { publishDate: bDate } = b.data;

	if (aDate < bDate) return -1;
	if (aDate > bDate) return 1;
	return 0;
}
