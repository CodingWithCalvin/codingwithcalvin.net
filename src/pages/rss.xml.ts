import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { getPostImage } from '../lib/posts';

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

      const image = getPostImage(post);
      const imageUrl = `${site}${image.src}`;
      const imageType = getMimeType(image.src);

      item.enclosure = {
        url: imageUrl,
        type: imageType,
        length: 0,
      };

      // Add media:content, subtitle, and optional bluesky post ID
      let customData = `<media:content url="${imageUrl}" type="${imageType}" medium="image" />`;
      if (post.data.subtitle) {
        customData += `<subtitle>${post.data.subtitle}</subtitle>`;
      }
      if (post.data.blueskyPostId) {
        customData += `<bluesky:postId>${post.data.blueskyPostId}</bluesky:postId>`;
      }
      item.customData = customData;

      return item;
    }),
    xmlns: {
      bluesky: 'https://bsky.app/ns',
      media: 'http://search.yahoo.com/mrss/',
    },
    customData: `<language>en-us</language>`,
  });
}
