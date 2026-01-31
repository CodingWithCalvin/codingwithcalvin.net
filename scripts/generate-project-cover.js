import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Dimensions
const WIDTH = 1920;
const HEIGHT = 1080;

// Category configuration with colors and icons
const CATEGORY_CONFIG = {
  "vs-extension": {
    name: "Visual Studio Extension",
    colors: { primary: "#68217A", secondary: "#9B4DCA", accent: "#FFFFFF" },
    icon: "vs-logo.png",
    gradient: { start: "#68217A", mid: "#8B3FA8", end: "#A855C7" },
  },
  "vscode-extension": {
    name: "VS Code Extension",
    colors: { primary: "#007ACC", secondary: "#1E90FF", accent: "#FFFFFF" },
    icon: "vscode-logo.png",
    gradient: { start: "#007ACC", mid: "#1A8FE3", end: "#3AA5F7" },
  },
  "github-action": {
    name: "GitHub Action",
    colors: { primary: "#238636", secondary: "#2EA043", accent: "#FFFFFF" },
    icon: "github-logo.png",
    gradient: { start: "#238636", mid: "#2E9848", end: "#3DAA5B" },
  },
  "cli-tool": {
    name: "CLI Tool",
    colors: { primary: "#0D7377", secondary: "#14A3A8", accent: "#FFFFFF" },
    icon: "terminal-icon.png",
    gradient: { start: "#0D7377", mid: "#14A3A8", end: "#32B8BD" },
  },
  "nuget-package": {
    name: "NuGet Package",
    colors: { primary: "#3D4752", secondary: "#4A5568", accent: "#FFFFFF" },
    icon: "nuget-logo.png",
    gradient: { start: "#3D4752", mid: "#4A5568", end: "#5A6778" },
  },
  "desktop-app": {
    name: "Desktop App",
    colors: { primary: "#FF6B35", secondary: "#FF8C5A", accent: "#FFFFFF" },
    icon: "desktop-icon.png",
    gradient: { start: "#FF6B35", mid: "#FF7D4D", end: "#FF9566" },
  },
  documentation: {
    name: "Documentation",
    colors: { primary: "#5C6BC0", secondary: "#7986CB", accent: "#FFFFFF" },
    icon: "book-icon.png",
    gradient: { start: "#5C6BC0", mid: "#6E7BD0", end: "#8090DD" },
  },
};

// Load image as base64
function loadImageBase64(filename) {
  const imagePath = join(__dirname, "assets", filename);
  if (!existsSync(imagePath)) {
    console.warn(`Warning: Asset not found: ${filename}`);
    return null;
  }
  const buffer = readFileSync(imagePath);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

// Load fonts from local files
function loadFont() {
  const fontPath = join(__dirname, "assets", "inter-regular.woff");
  return readFileSync(fontPath);
}

function loadFontBold() {
  const fontPath = join(__dirname, "assets", "inter-bold.woff");
  return readFileSync(fontPath);
}

// Parse frontmatter from markdown file
function parseFrontmatter(content) {
  const normalizedContent = content.replace(/\r\n/g, "\n");
  const match = normalizedContent.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatter = {};
  const lines = match[1].split("\n");
  let currentKey = null;
  let inArray = false;

  for (const line of lines) {
    // Check for array start
    if (line.match(/^\s*-\s+/)) {
      if (currentKey && inArray) {
        let value = line.replace(/^\s*-\s+/, "").trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        frontmatter[currentKey].push(value);
      }
      continue;
    }

    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Handle inline arrays: [item1, item2]
      if (value.startsWith("[") && value.endsWith("]")) {
        value = value
          .slice(1, -1)
          .split(",")
          .map((v) => {
            v = v.trim();
            if (v.startsWith('"') && v.endsWith('"')) {
              v = v.slice(1, -1);
            }
            return v;
          });
        frontmatter[key] = value;
        inArray = false;
        currentKey = null;
      } else if (value === "") {
        // Possible start of multi-line array
        frontmatter[key] = [];
        currentKey = key;
        inArray = true;
      } else {
        // Remove quotes
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        frontmatter[key] = value;
        inArray = false;
        currentKey = null;
      }
    }
  }

  return frontmatter;
}

// Create decorative background with layered solid colors (satori compatible)
function createBackgroundPattern(config) {
  const { gradient } = config;

  return {
    type: "div",
    props: {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        overflow: "hidden",
      },
      children: [
        // Base layer (darkest color)
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: gradient.start,
            },
          },
        },
        // Middle gradient layer (angled)
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: "30%",
              width: "100%",
              height: "100%",
              backgroundColor: gradient.mid,
              transform: "skewX(-15deg)",
            },
          },
        },
        // Light gradient layer (angled)
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: "55%",
              width: "100%",
              height: "100%",
              backgroundColor: gradient.end,
              transform: "skewX(-15deg)",
            },
          },
        },
        // Decorative circle top-right
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: -200,
              right: -200,
              width: 600,
              height: 600,
              borderRadius: 300,
              backgroundColor: "rgba(255,255,255,0.05)",
            },
          },
        },
        // Decorative circle bottom-left
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: -150,
              left: -150,
              width: 500,
              height: 500,
              borderRadius: 250,
              backgroundColor: "rgba(255,255,255,0.05)",
            },
          },
        },
      ],
    },
  };
}

// Create tech stack badge
function createBadge(text, accentColor) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 35,
        padding: "20px 40px",
        marginRight: 24,
        marginBottom: 24,
        border: "2px solid rgba(255,255,255,0.3)",
      },
      children: [
        {
          type: "span",
          props: {
            style: {
              color: accentColor,
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: 1,
            },
            children: text,
          },
        },
      ],
    },
  };
}

// Create the card-based project template
function createProjectTemplate(
  title,
  category,
  techStack,
  logoBase64,
  categoryIconBase64
) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG["vs-extension"];
  const { colors, name: categoryName } = config;

  // Create tech badges
  const badges = (techStack || []).slice(0, 5).map((tech) => createBadge(tech, colors.accent));

  return {
    type: "div",
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      },
      children: [
        // Background with gradient and pattern
        createBackgroundPattern(config),
        // Main content container
        {
          type: "div",
          props: {
            style: {
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              padding: 60,
            },
            children: [
              // Central card
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    borderRadius: 50,
                    width: 1760,
                    height: 920,
                    padding: "60px 0",
                    border: "3px solid rgba(255,255,255,0.15)",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
                  },
                  children: [
                    // Top section: Icon, Title, and Badges
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        },
                        children: [
                          // Category icon
                          categoryIconBase64
                            ? {
                                type: "img",
                                props: {
                                  src: categoryIconBase64,
                                  width: 220,
                                  height: 220,
                                  style: {
                                    objectFit: "contain",
                                    marginBottom: 40,
                                  },
                                },
                              }
                            : {
                                type: "div",
                                props: {
                                  style: {
                                    width: 220,
                                    height: 220,
                                    marginBottom: 40,
                                    borderRadius: 40,
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 100,
                                    color: colors.accent,
                                  },
                                  children: "?",
                                },
                              },
                          // Project title
                          {
                            type: "div",
                            props: {
                              style: {
                                fontSize: 96,
                                fontWeight: 700,
                                color: "#FFFFFF",
                                textAlign: "center",
                                lineHeight: 1.2,
                                marginBottom: 40,
                                textShadow: "0 4px 12px rgba(0,0,0,0.4)",
                                maxWidth: 1500,
                              },
                              children: title,
                            },
                          },
                          // Tech stack badges
                          badges.length > 0
                            ? {
                                type: "div",
                                props: {
                                  style: {
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    maxWidth: 1400,
                                  },
                                  children: badges,
                                },
                              }
                            : null,
                        ].filter(Boolean),
                      },
                    },
                    // Middle spacer
                    {
                      type: "div",
                      props: {
                        style: { flex: 1 },
                      },
                    },
                    // Category label with divider
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: 30,
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                width: 100,
                                height: 4,
                                backgroundColor: "rgba(255,255,255,0.4)",
                              },
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: {
                                fontSize: 48,
                                fontWeight: 400,
                                color: "rgba(255,255,255,0.8)",
                                textTransform: "uppercase",
                                letterSpacing: 5,
                              },
                              children: categoryName,
                            },
                          },
                          {
                            type: "div",
                            props: {
                              style: {
                                width: 100,
                                height: 4,
                                backgroundColor: "rgba(255,255,255,0.4)",
                              },
                            },
                          },
                        ],
                      },
                    },
                  ].filter(Boolean),
                },
              },
            ],
          },
        },
      ].filter(Boolean),
    },
  };
}

// Generate the cover image
async function generateProjectCover(title, category, techStack) {
  const font = loadFont();
  const fontBold = loadFontBold();
  const logoBase64 = loadImageBase64("logo.png");

  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG["vs-extension"];
  const categoryIconBase64 = loadImageBase64(config.icon);

  console.log(`    Category: ${config.name}`);
  console.log(`    Tech Stack: ${techStack?.join(", ") || "none"}`);

  const template = createProjectTemplate(
    title,
    category,
    techStack,
    logoBase64,
    categoryIconBase64
  );

  const svg = await satori(template, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: "Inter", data: font, weight: 400, style: "normal" },
      { name: "Inter", data: fontBold, weight: 700, style: "normal" },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
  });

  return Buffer.from(resvg.render().asPng());
}

// Find all projects
function findProjects() {
  const projectsDir = join(process.cwd(), "src", "content", "projects");
  const projects = [];

  if (!existsSync(projectsDir)) {
    console.error("Error: Projects directory not found at src/content/projects");
    return projects;
  }

  const dirs = readdirSync(projectsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const slug of dirs) {
    const projectDir = join(projectsDir, slug);
    const indexPath = join(projectDir, "index.md");

    if (existsSync(indexPath)) {
      projects.push({
        slug,
        path: projectDir,
        indexPath,
      });
    }
  }

  return projects;
}

// Interactive project selection
async function selectProject(projects) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (q) =>
    new Promise((resolve) => rl.question(q, (a) => resolve(a.trim())));

  console.log("\nAvailable projects without cover images:\n");

  const projectsWithoutCover = projects.filter(
    (p) => !existsSync(join(p.path, "cover.png"))
  );

  if (projectsWithoutCover.length === 0) {
    console.log("All projects have cover images!");
    rl.close();
    return null;
  }

  projectsWithoutCover.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.slug}`);
  });

  console.log(`\n  0. Generate for a specific path`);
  console.log(`  a. Generate all missing covers\n`);

  const choice = await ask("Select an option: ");
  rl.close();

  if (choice.toLowerCase() === "a") {
    return projectsWithoutCover;
  }

  const index = parseInt(choice, 10);
  if (index === 0) {
    return "manual";
  }

  if (index > 0 && index <= projectsWithoutCover.length) {
    return [projectsWithoutCover[index - 1]];
  }

  return null;
}

// Generate cover for a single project
async function generateForProject(project) {
  const content = readFileSync(project.indexPath, "utf-8");
  const frontmatter = parseFrontmatter(content);

  if (!frontmatter.title) {
    console.log(`  Skipping ${project.slug}: No title found`);
    return false;
  }

  const title = frontmatter.title;
  const category = frontmatter.category || "vs-extension";
  const techStack = frontmatter.techStack || [];

  console.log(`  Generating: ${project.slug}`);
  console.log(`    Title: ${title}`);

  const png = await generateProjectCover(title, category, techStack);
  const outputPath = join(project.path, "cover.png");
  writeFileSync(outputPath, png);

  console.log(`    Saved: ${outputPath}\n`);
  return true;
}

// Main CLI
async function main() {
  const args = process.argv.slice(2);
  const postPath = args[0];

  // Direct path provided
  if (postPath) {
    const indexPath = join(postPath, "index.md");

    if (!existsSync(indexPath)) {
      console.error(`Error: No index.md found at ${postPath}`);
      process.exit(1);
    }

    const project = {
      path: postPath,
      indexPath,
      slug: postPath.split(/[/\\]/).pop(),
    };

    await generateForProject(project);
    return;
  }

  // Interactive mode
  const projects = findProjects();

  if (projects.length === 0) {
    console.log("No projects found.");
    return;
  }

  const selection = await selectProject(projects);

  if (!selection) {
    console.log("No selection made.");
    return;
  }

  if (selection === "manual") {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const path = await new Promise((resolve) =>
      rl.question("Enter project path: ", resolve)
    );
    rl.close();

    const indexPath = join(path, "index.md");
    if (!existsSync(indexPath)) {
      console.error(`Error: No index.md found at ${path}`);
      process.exit(1);
    }

    await generateForProject({
      path,
      indexPath,
      slug: path.split(/[/\\]/).pop(),
    });
    return;
  }

  // Generate for selected projects
  console.log(`\nGenerating ${selection.length} cover(s)...\n`);

  for (const project of selection) {
    await generateForProject(project);
  }

  console.log("Done!");
}

// Export for use in new-project.js
export { generateProjectCover, parseFrontmatter };

main().catch(console.error);
