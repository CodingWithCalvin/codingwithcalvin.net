import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

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
        pubDate: post.data.date,
        description: post.data.description || '',
        link: `/${slug}/`,
        categories: post.data.categories,
      };
    }),
    customData: `<language>en-us</language>`,
  });
}
