import type { ImageMetadata } from 'astro';
import { getCollection } from 'astro:content';
import defaultCover from '../assets/default-cover.png';

// Import all cover images from blog directories
const coverImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/blog/**/cover.png',
  { eager: true }
);

export type PostWithImage = Awaited<ReturnType<typeof getCollection<'blog'>>>[number] & {
  resolvedImage: ImageMetadata;
};

/**
 * Get a post's cover image, falling back to cover.png in the post directory,
 * then to the default cover image
 */
export function getPostImage(post: Awaited<ReturnType<typeof getCollection<'blog'>>>[number]): ImageMetadata {
  if (post.data.image) {
    return post.data.image;
  }

  const coverPath = `/src/content/blog/${post.id}/cover.png`;
  const coverModule = coverImages[coverPath];

  return coverModule?.default ?? defaultCover;
}

/**
 * Get all posts with resolved cover images
 */
export async function getPostsWithImages(): Promise<PostWithImage[]> {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    ...post,
    resolvedImage: getPostImage(post),
  }));
}

/**
 * Get the slug from a post ID (e.g., "2024/slug-name" -> "slug-name")
 */
export function getSlug(id: string): string {
  return id.split('/').pop() || id;
}
