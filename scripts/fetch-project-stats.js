/**
 * Pre-build script to fetch all project stats from GitHub, VS Marketplace, and NuGet
 * Run this before the Astro build to bake stats into the static site
 *
 * Stats fetched by category:
 * - nuget-package: GitHub + NuGet
 * - vs-extension: GitHub + VS Marketplace
 * - vscode-extension: GitHub + VS Marketplace
 * - cli-tool: GitHub only
 * - desktop-app: GitHub only
 * - documentation: GitHub only
 * - github-action: GitHub only (marketplace stats could be added later)
 */

import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { parse } from "yaml";

const PROJECTS_DIR = "src/content/projects";
const STATS_OUTPUT = "src/data/project-stats.json";

/**
 * Parse frontmatter from markdown file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  return parse(match[1]);
}

/**
 * Extract owner/repo from GitHub URL
 */
function parseGitHubUrl(repoUrl) {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

/**
 * Fetch GitHub repository stats
 */
async function fetchGitHubStats(repoUrl) {
  try {
    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) return null;

    const { owner, repo } = parsed;
    const token = process.env.GITHUB_TOKEN;

    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "codingwithcalvin.net",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Fetch repo info and latest release in parallel
    const [repoResponse, releaseResponse] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
        headers,
      }),
    ]);

    if (!repoResponse.ok) {
      console.warn(`  GitHub API error for ${repoUrl}: ${repoResponse.status}`);
      return null;
    }

    const repoData = await repoResponse.json();

    let latestRelease = null;
    if (releaseResponse.ok) {
      const releaseData = await releaseResponse.json();
      latestRelease = {
        version: releaseData.tag_name,
        publishedAt: releaseData.published_at,
        url: releaseData.html_url,
      };
    }

    return {
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      openIssues: repoData.open_issues_count,
      latestRelease,
    };
  } catch (error) {
    console.warn(`  Failed to fetch GitHub stats for ${repoUrl}:`, error.message);
    return null;
  }
}

/**
 * Fetch VS Marketplace extension stats
 */
async function fetchVSMarketplaceStats(extensionId) {
  try {
    const response = await fetch(
      "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;api-version=7.1-preview.1",
        },
        body: JSON.stringify({
          filters: [
            {
              criteria: [{ filterType: 7, value: extensionId }],
            },
          ],
          flags: 914, // Include statistics
        }),
      }
    );

    if (!response.ok) {
      console.warn(`  VS Marketplace API error for ${extensionId}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const ext = data?.results?.[0]?.extensions?.[0];

    if (!ext) {
      console.warn(`  Extension not found: ${extensionId}`);
      return null;
    }

    const stats = ext.statistics || [];
    const getStatValue = (name) => {
      const stat = stats.find((s) => s.statisticName === name);
      return stat?.value;
    };

    return {
      installs: getStatValue("install"),
      downloads: getStatValue("downloadCount"),
      rating: getStatValue("averagerating"),
      ratingCount: getStatValue("ratingcount"),
      lastUpdated: ext.lastUpdated,
    };
  } catch (error) {
    console.warn(`  Failed to fetch VS Marketplace stats for ${extensionId}:`, error.message);
    return null;
  }
}

/**
 * Fetch NuGet package stats
 */
async function fetchNuGetStats(packageId) {
  try {
    const searchUrl = `https://azuresearch-usnc.nuget.org/query?q=packageid:${packageId}&prerelease=true&take=1`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
      console.warn(`  NuGet API error for ${packageId}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const pkg = data?.data?.[0];

    if (!pkg) {
      console.warn(`  NuGet package not found: ${packageId}`);
      return null;
    }

    return {
      downloads: pkg.totalDownloads,
      latestVersion: pkg.versions?.[pkg.versions.length - 1]?.version,
    };
  } catch (error) {
    console.warn(`  Failed to fetch NuGet stats for ${packageId}:`, error.message);
    return null;
  }
}

/**
 * Extract extension/package ID from marketplace URL
 */
function extractMarketplaceId(url, type) {
  if (type === "vs-marketplace") {
    const match = url.match(/itemName=([^&]+)/);
    return match?.[1] || null;
  } else if (type === "nuget") {
    const match = url.match(/packages\/([^\/]+)/);
    return match?.[1] || null;
  }
  return null;
}

/**
 * Determine what stats to fetch based on project category
 */
function getStatsToFetch(category) {
  switch (category) {
    case "nuget-package":
      return { github: true, marketplace: "nuget" };
    case "vs-extension":
    case "vscode-extension":
      return { github: true, marketplace: "vs-marketplace" };
    case "cli-tool":
    case "desktop-app":
    case "documentation":
    case "github-action":
    default:
      return { github: true, marketplace: null };
  }
}

async function main() {
  console.log("\nFetching project stats...\n");

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    console.log("Using GITHUB_TOKEN for API requests\n");
  } else {
    console.warn("Warning: GITHUB_TOKEN not set, may hit rate limits\n");
  }

  // Read all project directories
  const projectDirs = await readdir(PROJECTS_DIR);
  const stats = {};

  for (const dir of projectDirs) {
    const indexPath = join(PROJECTS_DIR, dir, "index.md");
    if (!existsSync(indexPath)) continue;

    console.log(`Processing: ${dir}`);

    const content = await readFile(indexPath, "utf-8");
    const frontmatter = parseFrontmatter(content);
    if (!frontmatter) {
      console.warn(`  Could not parse frontmatter`);
      continue;
    }

    const projectStats = {
      slug: dir,
      github: null,
      marketplace: null,
    };

    const category = frontmatter.category;
    const statsConfig = getStatsToFetch(category);

    console.log(`  Category: ${category} → GitHub: ${statsConfig.github}, Marketplace: ${statsConfig.marketplace || "none"}`);

    // Fetch GitHub stats (all projects)
    if (statsConfig.github && frontmatter.repoUrl) {
      console.log(`  Fetching GitHub stats...`);
      projectStats.github = await fetchGitHubStats(frontmatter.repoUrl);
      if (projectStats.github) {
        console.log(`    Stars: ${projectStats.github.stars}, Forks: ${projectStats.github.forks}`);
      }
    }

    // Fetch marketplace stats based on category
    if (statsConfig.marketplace && frontmatter.marketplace?.url) {
      const { url, type } = frontmatter.marketplace;
      const id = extractMarketplaceId(url, type);

      if (id) {
        if (statsConfig.marketplace === "nuget" && type === "nuget") {
          console.log(`  Fetching NuGet stats for ${id}...`);
          projectStats.marketplace = await fetchNuGetStats(id);
        } else if (statsConfig.marketplace === "vs-marketplace" && type === "vs-marketplace") {
          console.log(`  Fetching VS Marketplace stats for ${id}...`);
          projectStats.marketplace = await fetchVSMarketplaceStats(id);
        }

        if (projectStats.marketplace) {
          const downloads = projectStats.marketplace.downloads ?? projectStats.marketplace.installs;
          if (downloads) {
            console.log(`    Downloads/Installs: ${downloads}`);
          }
          if (projectStats.marketplace.rating) {
            console.log(`    Rating: ${projectStats.marketplace.rating.toFixed(1)}`);
          }
        }
      }
    }

    stats[dir] = projectStats;
  }

  // Ensure output directory exists
  const outputDir = "src/data";
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  // Write stats to JSON file
  const output = {
    generatedAt: new Date().toISOString(),
    projects: stats,
  };

  await writeFile(STATS_OUTPUT, JSON.stringify(output, null, 2));

  console.log(`\nStats written to ${STATS_OUTPUT}`);
  console.log(`Total projects processed: ${Object.keys(stats).length}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
