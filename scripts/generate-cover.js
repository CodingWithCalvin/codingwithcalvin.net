import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Dimensions
const WIDTH = 1920;
const HEIGHT = 1080;

// Brand colors
const COLORS = {
  blue: "#3B8DBD",
  darkBlue: "#1a5a7a",
  darkerBlue: "#0d3d54",
  darkestBlue: "#0a2a3a",
  orange: "#FFB833",
  white: "#FFFFFF",
  gray: "#6D6E71",
};

// Load image as base64
function loadImageBase64(filename) {
  const imagePath = join(__dirname, "assets", filename);
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

function loadFontLoraItalic() {
  const fontPath = join(__dirname, "assets", "lora-italic.woff");
  return readFileSync(fontPath);
}

// Create the cover template
function createTemplate(title, subtitle, logoBase64, calvinBase64) {
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
        backgroundColor: COLORS.darkestBlue,
      },
      children: [
        // Background layers (angled shapes)
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
            },
            children: [
              // Darkest layer (base)
              {
                type: "div",
                props: {
                  style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: COLORS.darkestBlue,
                  },
                },
              },
              // Dark blue angled layer
              {
                type: "div",
                props: {
                  style: {
                    position: "absolute",
                    top: 0,
                    left: "15%",
                    width: "100%",
                    height: "100%",
                    backgroundColor: COLORS.darkerBlue,
                    transform: "skewX(-15deg)",
                  },
                },
              },
              // Medium blue angled layer
              {
                type: "div",
                props: {
                  style: {
                    position: "absolute",
                    top: 0,
                    left: "30%",
                    width: "100%",
                    height: "100%",
                    backgroundColor: COLORS.darkBlue,
                    transform: "skewX(-15deg)",
                  },
                },
              },
              // Light blue angled layer
              {
                type: "div",
                props: {
                  style: {
                    position: "absolute",
                    top: 0,
                    left: "45%",
                    width: "100%",
                    height: "100%",
                    backgroundColor: COLORS.blue,
                    transform: "skewX(-15deg)",
                  },
                },
              },
            ],
          },
        },
        // Decorative code brackets
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 840,
              fontWeight: 700,
              color: COLORS.white,
              opacity: 0.06,
              letterSpacing: -10,
            },
            children: "</>",
          },
        },
        // Content container
        {
          type: "div",
          props: {
            style: {
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              padding: 60,
            },
            children: [
              // Title section (top)
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    paddingLeft: 20,
                  },
                  children: [
                    // Main title (max 2 lines to avoid overlapping Calvin)
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: 92,
                          fontWeight: 700,
                          color: COLORS.white,
                          lineHeight: 1.1,
                          maxWidth: "90%",
                          textShadow: "0 4px 12px rgba(0,0,0,0.4)",
                        },
                        children: title,
                      },
                    },
                    // Subtitle (can wrap to multiple lines, width constrained to avoid Calvin)
                    subtitle
                      ? {
                          type: "div",
                          props: {
                            style: {
                              fontSize: 78,
                              fontWeight: 400,
                              color: COLORS.orange,
                              lineHeight: 1.2,
                              maxWidth: "85%",
                              textShadow: "0 3px 6px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.5)",
                            },
                            children: subtitle,
                          },
                        }
                      : null,
                  ].filter(Boolean),
                },
              },
              // Logo (bottom left)
              {
                type: "img",
                props: {
                  src: logoBase64,
                  width: 320,
                  height: 166,
                  style: {
                    objectFit: "contain",
                    opacity: 0.4,
                  },
                },
              },
            ],
          },
        },
        // Calvin mascot (absolute positioned, bottom right)
        {
          type: "img",
          props: {
            src: calvinBase64,
            width: 700,
            height: 875,
            style: {
              position: "absolute",
              bottom: -40,
              right: 0,
              objectFit: "contain",
              transform: "scaleX(-1)",
            },
          },
        },
      ],
    },
  };
}

// Generate the cover image
async function generateCover(title, subtitle) {
  const font = loadFont();
  const fontBold = loadFontBold();
  const fontLoraItalic = loadFontLoraItalic();
  const logoBase64 = loadImageBase64("logo.png");
  const calvinBase64 = loadImageBase64("calvin.png");

  const template = createTemplate(title, subtitle, logoBase64, calvinBase64);

  const svg = await satori(template, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: "Inter", data: font, weight: 400, style: "normal" },
      { name: "Inter", data: fontBold, weight: 700, style: "normal" },
      { name: "Lora", data: fontLoraItalic, weight: 400, style: "italic" },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
  });

  return Buffer.from(resvg.render().asPng());
}

// Parse frontmatter from markdown file
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatter = {};
  const lines = match[1].split("\n");

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

// Find all blog posts
function findBlogPosts() {
  const blogDir = join(process.cwd(), "src", "content", "blog");
  const posts = [];

  const years = readdirSync(blogDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const year of years) {
    const yearDir = join(blogDir, year);
    const slugs = readdirSync(yearDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const slug of slugs) {
      const postDir = join(yearDir, slug);
      const indexPath = join(postDir, "index.md");

      if (existsSync(indexPath)) {
        posts.push({
          year,
          slug,
          path: postDir,
          indexPath,
        });
      }
    }
  }

  return posts;
}

// Interactive post selection
async function selectPost(posts) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (q) =>
    new Promise((resolve) => rl.question(q, (a) => resolve(a.trim())));

  console.log("\nAvailable posts without cover images:\n");

  const postsWithoutCover = posts.filter(
    (p) => !existsSync(join(p.path, "cover.png"))
  );

  if (postsWithoutCover.length === 0) {
    console.log("All posts have cover images!");
    rl.close();
    return null;
  }

  postsWithoutCover.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.year}/${p.slug}`);
  });

  console.log(`\n  0. Generate for a specific path`);
  console.log(`  a. Generate all missing covers\n`);

  const choice = await ask("Select an option: ");
  rl.close();

  if (choice.toLowerCase() === "a") {
    return postsWithoutCover;
  }

  const index = parseInt(choice, 10);
  if (index === 0) {
    return "manual";
  }

  if (index > 0 && index <= postsWithoutCover.length) {
    return [postsWithoutCover[index - 1]];
  }

  return null;
}

// Generate cover for a single post
async function generateForPost(post) {
  const content = readFileSync(post.indexPath, "utf-8");
  const frontmatter = parseFrontmatter(content);

  if (!frontmatter.title) {
    console.log(`  Skipping ${post.slug}: No title found`);
    return false;
  }

  // Use title as-is, optional subtitle from frontmatter
  const title = frontmatter.title;
  const subtitle = frontmatter.subtitle || null;

  console.log(`  Generating: ${post.year}/${post.slug}`);
  console.log(`    Title: ${title}`);
  if (subtitle) console.log(`    Subtitle: ${subtitle}`);

  const png = await generateCover(title, subtitle);
  const outputPath = join(post.path, "cover.png");
  writeFileSync(outputPath, png);

  console.log(`    Saved: ${outputPath}\n`);
  return true;
}

// Main CLI
async function main() {
  const args = process.argv.slice(2);

  // Direct path provided
  if (args[0]) {
    const postPath = args[0];
    const indexPath = join(postPath, "index.md");

    if (!existsSync(indexPath)) {
      console.error(`Error: No index.md found at ${postPath}`);
      process.exit(1);
    }

    const post = {
      path: postPath,
      indexPath,
      slug: postPath.split(/[/\\]/).pop(),
      year: postPath.split(/[/\\]/).slice(-2)[0],
    };

    await generateForPost(post);
    return;
  }

  // Interactive mode
  const posts = findBlogPosts();
  const selection = await selectPost(posts);

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
      rl.question("Enter post path: ", resolve)
    );
    rl.close();

    const indexPath = join(path, "index.md");
    if (!existsSync(indexPath)) {
      console.error(`Error: No index.md found at ${path}`);
      process.exit(1);
    }

    await generateForPost({
      path,
      indexPath,
      slug: path.split(/[/\\]/).pop(),
      year: path.split(/[/\\]/).slice(-2)[0],
    });
    return;
  }

  // Generate for selected posts
  console.log(`\nGenerating ${selection.length} cover(s)...\n`);

  for (const post of selection) {
    await generateForPost(post);
  }

  console.log("Done!");
}

// Export for use in new-post.js
export { generateCover, parseFrontmatter };

main().catch(console.error);
