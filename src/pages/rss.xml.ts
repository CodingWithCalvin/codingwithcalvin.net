import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

// Get the date portion in Eastern time and return a Date at noon UTC
// This ensures the pubDate displays the correct calendar date regardless of timezone
function normalizeDateForRss(date: Date): Date {
  const eastern = date.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  const [year, month, day] = eastern.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Coding With Calvin',
    description: 'Software development thoughts, tutorials, and experiences by Calvin Allen',
    site: context.site!,
    items: sortedPosts.map((post) => {
      const slug = post.id.split('/').pop() || post.id;
      return {
        title: post.data.title,
        pubDate: normalizeDateForRss(post.data.date),
        description: post.data.description || '',
        link: `/${slug}/`,
        categories: post.data.categories,
      };
    }),
    customData: `<language>en-us</language>`,
  });
}
