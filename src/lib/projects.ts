import type { ImageMetadata } from 'astro';
import { getCollection } from 'astro:content';
import defaultCover from '../assets/default-cover.png';
import { fetchMarketplaceStats, fetchGitHubStats, type MarketplaceStats, type GitHubStats } from './marketplace-stats';

// Import all cover images from project directories
const coverImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/projects/**/cover.png',
  { eager: true }
);

export type ProjectWithImage = Awaited<ReturnType<typeof getCollection<'projects'>>>[number] & {
  resolvedImage: ImageMetadata;
  marketplaceStats?: MarketplaceStats;
  githubStats?: GitHubStats;
};

/**
 * Get a project's cover image, falling back to cover.png in the project directory,
 * then to the default cover image
 */
export function getProjectImage(project: Awaited<ReturnType<typeof getCollection<'projects'>>>[number]): ImageMetadata {
  if (project.data.image) {
    return project.data.image;
  }

  const coverPath = `/src/content/projects/${project.id}/cover.png`;
  const coverModule = coverImages[coverPath];

  return coverModule?.default ?? defaultCover;
}

/**
 * Get all projects with resolved cover images
 */
export async function getProjectsWithImages(): Promise<ProjectWithImage[]> {
  const projects = await getCollection('projects');
  return projects.map(project => ({
    ...project,
    resolvedImage: getProjectImage(project),
  }));
}

/**
 * Get all projects with resolved cover images AND marketplace/GitHub stats
 * Use this for pages that need live data
 */
export async function getProjectsWithStats(): Promise<ProjectWithImage[]> {
  const projects = await getCollection('projects');

  // Fetch all stats in parallel
  const projectsWithStats = await Promise.all(
    projects.map(async (project) => {
      // Fetch marketplace and GitHub stats in parallel
      const [marketplaceStats, githubStats] = await Promise.all([
        project.data.marketplace
          ? fetchMarketplaceStats(project.data.marketplace.url, project.data.marketplace.type)
          : Promise.resolve(undefined),
        fetchGitHubStats(project.data.repoUrl),
      ]);

      return {
        ...project,
        resolvedImage: getProjectImage(project),
        marketplaceStats,
        githubStats,
      };
    })
  );

  return projectsWithStats;
}

/**
 * Get the slug from a project ID (removes /index suffix if present)
 */
export function getProjectSlug(id: string): string {
  return id.replace(/\/index$/, '');
}

/**
 * Get Tailwind classes for status badge colors
 */
export function getStatusColor(status: 'active' | 'maintained' | 'archived' | 'experimental'): string {
  const colors = {
    active: 'bg-green-500/20 text-green-400',
    maintained: 'bg-blue-500/20 text-blue-400',
    archived: 'bg-gray-500/20 text-gray-400',
    experimental: 'bg-yellow-500/20 text-yellow-400',
  };
  return colors[status];
}

/**
 * Format download/star counts with K/M suffix
 */
export function formatCount(count: number | undefined): string {
  if (count === undefined) return '';
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}
