import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { getProjectImage, getProjectSlug } from '../lib/projects';

const parser = new MarkdownIt();

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
  const projects = await getCollection('projects');
  // Sort by GitHub stars (highest first)
  const sortedProjects = projects.sort((a, b) => (b.data.stars ?? 0) - (a.data.stars ?? 0));
  const site = context.site!.toString().replace(/\/$/, '');

  return rss({
    title: 'Coding With Calvin - Open Source Projects',
    description: 'Open source projects created and maintained by Calvin Allen',
    site: context.site!,
    items: sortedProjects.map((project) => {
      const slug = getProjectSlug(project.id);
      const item: Record<string, unknown> = {
        title: project.data.title,
        pubDate: project.data.startDate,
        description: project.data.description,
        link: `/projects/${slug}/`,
        categories: [project.data.category, ...project.data.techStack],
        content: sanitizeHtml(parser.render(project.body ?? ''), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        }),
      };

      const image = getProjectImage(project);
      const imageUrl = `${site}${image.src}`;
      const imageType = getMimeType(image.src);

      item.enclosure = {
        url: imageUrl,
        type: imageType,
        length: 0,
      };

      // Add media:content and project-specific metadata
      let customData = `<media:content url="${imageUrl}" type="${imageType}" medium="image" />`;
      customData += `<project:category>${project.data.category}</project:category>`;
      customData += `<project:language>${project.data.language}</project:language>`;
      customData += `<project:status>${project.data.status}</project:status>`;
      customData += `<project:repoUrl>${project.data.repoUrl}</project:repoUrl>`;
      if (project.data.stars) {
        customData += `<project:stars>${project.data.stars}</project:stars>`;
      }
      item.customData = customData;

      return item;
    }),
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
      project: 'https://codingwithcalvin.net/ns/project',
    },
    customData: `<language>en-us</language>`,
  });
}
