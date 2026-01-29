// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import rehypeImageLinks from './src/plugins/rehype-image-links.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.codingwithcalvin.net',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    },
    rehypePlugins: [rehypeImageLinks]
  }
});
