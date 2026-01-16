import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

// Get the date portion in Eastern time and return a Date at noon UTC
// This ensures the pubDate displays the correct calendar date regardless of timezone
function normalizeDateForRss(date: Date): Date {
  const eastern = date.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  const [year, month, day] = eastern.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function getMimeType(src: string): string {
  const ext = src.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    avif: 'image/avif',
  };
  return mimeTypes[ext || ''] || 'image/png';
}

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const site = context.site!.toString().replace(/\/$/, '');

  return rss({
    title: 'Coding With Calvin',
    description: 'Software development thoughts, tutorials, and experiences by Calvin Allen',
    site: context.site!,
    items: sortedPosts.map((post) => {
      const slug = post.id.split('/').pop() || post.id;
      const item: Record<string, unknown> = {
        title: post.data.title,
        pubDate: normalizeDateForRss(post.data.date),
        description: post.data.description || '',
        link: `/${slug}/`,
        categories: post.data.categories,
        content: sanitizeHtml(parser.render(post.body ?? ''), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        }),
      };

      if (post.data.image) {
        item.enclosure = {
          url: `${site}${post.data.image.src}`,
          type: getMimeType(post.data.image.src),
          length: 0,
        };
      }

      // Add custom data for bluesky post ID if present
      if (post.data.blueskyPostId) {
        item.customData = `<bluesky:postId>${post.data.blueskyPostId}</bluesky:postId>`;
      }

      return item;
    }),
    xmlns: {
      bluesky: 'https://bsky.app/ns',
    },
    customData: `<language>en-us</language>`,
  });
}
