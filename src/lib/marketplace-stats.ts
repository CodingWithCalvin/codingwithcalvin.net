/**
 * Fetch marketplace statistics at build time
 */

export interface MarketplaceStats {
  downloads?: number;
  installs?: number;
  rating?: number;
  ratingCount?: number;
  lastUpdated?: string;
}

export interface GitHubRelease {
  version: string;
  publishedAt: string;
  url: string;
}

export interface GitHubStats {
  stars: number;
  forks: number;
  openIssues: number;
  latestRelease?: GitHubRelease;
}

/**
 * Extract owner/repo from GitHub URL
 */
function parseGitHubUrl(repoUrl: string): { owner: string; repo: string } | null {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

/**
 * Fetch GitHub repository stats including stars, forks, and latest release
 */
export async function fetchGitHubStats(repoUrl: string): Promise<GitHubStats | undefined> {
  try {
    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) return undefined;

    const { owner, repo } = parsed;

    // Use GITHUB_TOKEN if available to avoid rate limits
    const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'codingwithcalvin.net',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Fetch repo info and latest release in parallel
    const [repoResponse, releaseResponse] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, { headers })
    ]);

    if (!repoResponse.ok) {
      console.warn(`GitHub API error for ${repoUrl}: ${repoResponse.status}`);
      return undefined;
    }

    const repoData = await repoResponse.json();

    let latestRelease: GitHubRelease | undefined;
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
    console.warn(`Failed to fetch GitHub stats for ${repoUrl}:`, error);
    return undefined;
  }
}

/**
 * Fetch VS Marketplace extension stats
 */
export async function fetchVSMarketplaceStats(extensionId: string): Promise<MarketplaceStats> {
  try {
    // extensionId format: "CodingWithCalvin.VS-MCPServer"
    const [publisher, extension] = extensionId.split('.');

    const response = await fetch('https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json;api-version=7.1-preview.1',
      },
      body: JSON.stringify({
        filters: [{
          criteria: [
            { filterType: 7, value: extensionId }
          ]
        }],
        flags: 914 // Include statistics
      })
    });

    if (!response.ok) {
      console.warn(`VS Marketplace API error for ${extensionId}: ${response.status}`);
      return {};
    }

    const data = await response.json();
    const ext = data?.results?.[0]?.extensions?.[0];

    if (!ext) {
      console.warn(`Extension not found: ${extensionId}`);
      return {};
    }

    const stats = ext.statistics || [];
    const getStatValue = (name: string) => {
      const stat = stats.find((s: any) => s.statisticName === name);
      return stat?.value;
    };

    return {
      installs: getStatValue('install'),
      downloads: getStatValue('downloadCount'),
      rating: getStatValue('averagerating'),
      ratingCount: getStatValue('ratingcount'),
      lastUpdated: ext.lastUpdated,
    };
  } catch (error) {
    console.warn(`Failed to fetch VS Marketplace stats for ${extensionId}:`, error);
    return {};
  }
}

/**
 * Fetch NuGet package stats using the search API
 */
export async function fetchNuGetStats(packageId: string): Promise<MarketplaceStats & { downloads?: number }> {
  try {
    // Use the search API which is more reliable
    const searchUrl = `https://azuresearch-usnc.nuget.org/query?q=packageid:${packageId}&prerelease=true&take=1`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
      console.warn(`NuGet API error for ${packageId}: ${response.status}`);
      return {};
    }

    const data = await response.json();
    const pkg = data?.data?.[0];

    if (!pkg) {
      console.warn(`NuGet package not found: ${packageId}`);
      return {};
    }

    return {
      downloads: pkg.totalDownloads,
      lastUpdated: pkg.versions?.[pkg.versions.length - 1]?.version,
    };
  } catch (error) {
    console.warn(`Failed to fetch NuGet stats for ${packageId}:`, error);
    return {};
  }
}

/**
 * Extract extension/package ID from marketplace URL
 */
export function extractMarketplaceId(url: string, type: string): string | null {
  if (type === 'vs-marketplace') {
    // https://marketplace.visualstudio.com/items?itemName=CodingWithCalvin.VS-MCPServer
    const match = url.match(/itemName=([^&]+)/);
    return match?.[1] || null;
  } else if (type === 'nuget') {
    // https://www.nuget.org/packages/VsixSdk
    const match = url.match(/packages\/([^\/]+)/);
    return match?.[1] || null;
  }
  return null;
}

/**
 * Fetch stats based on marketplace type
 */
export async function fetchMarketplaceStats(
  url: string,
  type: 'vs-marketplace' | 'nuget' | 'npm' | 'other'
): Promise<MarketplaceStats> {
  const id = extractMarketplaceId(url, type);
  if (!id) return {};

  switch (type) {
    case 'vs-marketplace':
      return fetchVSMarketplaceStats(id);
    case 'nuget':
      return fetchNuGetStats(id);
    default:
      return {};
  }
}
