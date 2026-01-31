import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.coerce.date(),
    categories: z.array(z.string()),
    description: z.string().optional(),
    image: image().optional(),
    youtube: z.string().optional(),
    blueskyPostId: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/index.md", base: "./src/content/projects" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    longDescription: z.string().optional(),
    category: z.enum([
      'vs-extension',
      'vscode-extension',
      'github-action',
      'cli-tool',
      'nuget-package',
      'desktop-app',
      'documentation',
    ]),
    repoUrl: z.string().url(),
    demoUrl: z.string().url().optional(),
    docsUrl: z.string().url().optional(),
    techStack: z.array(z.string()),
    language: z.string(),
    status: z.enum(['active', 'maintained', 'archived', 'experimental']),
    featured: z.boolean().default(false),
    startDate: z.coerce.date(),
    lastUpdated: z.coerce.date().optional(),
    image: image().optional(),
    marketplace: z.object({
      type: z.enum(['vs-marketplace', 'nuget', 'npm', 'other']),
      url: z.string().url(),
    }).optional(),
    stars: z.number().optional(),
    downloads: z.number().optional(),
  }),
});

export const collections = { blog, projects };
