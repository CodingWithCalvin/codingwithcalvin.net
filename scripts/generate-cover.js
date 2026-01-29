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
  // Blue shades
  blue: "#3B8DBD",
  darkBlue: "#1a5a7a",
  darkerBlue: "#0d3d54",
  darkestBlue: "#0a2a3a",
  // Orange (for accents and backgrounds)
  orange: "#FFB833",
  darkOrange: "#F0A020",
  darkerOrange: "#E08C10",
  darkestOrange: "#D07800",
  // Purple shades (for alternate styles)
  purple: "#9B59B6",
  darkPurple: "#7D3C98",
  darkerPurple: "#5B2C6F",
  darkestPurple: "#3D1F4A",
  // Green shades (for alternate styles)
  green: "#27AE60",
  darkGreen: "#1E8449",
  darkerGreen: "#196F3D",
  darkestGreen: "#145A32",
  // Slate shades (for alternate styles)
  slate: "#6B7B8C",
  darkSlate: "#556270",
  darkerSlate: "#434F5A",
  darkestSlate: "#343D46",
  // Accent variations
  gold: "#FFCC00",
  amber: "#FFA500",
  // Neutrals
  white: "#FFFFFF",
  gray: "#6D6E71",
};

// Style definitions
const STYLES = [
  {
    name: "Classic",
    angle: -15,
    direction: "ltr", // left to right
    calvinPosition: "right",
    primary: "blue",
    accent: COLORS.orange,
  },
  {
    name: "Reversed",
    angle: 15,
    direction: "rtl", // right to left
    calvinPosition: "left",
    primary: "blue",
    accent: COLORS.orange,
  },
  {
    name: "Steep",
    angle: -25,
    direction: "ltr",
    calvinPosition: "right",
    primary: "blue",
    accent: COLORS.gold,
  },
  {
    name: "Steep Reversed",
    angle: 25,
    direction: "rtl",
    calvinPosition: "left",
    primary: "blue",
    accent: COLORS.gold,
  },
  {
    name: "Gentle",
    angle: -8,
    direction: "ltr",
    calvinPosition: "right",
    primary: "blue",
    accent: COLORS.amber,
  },
  {
    name: "Gentle Reversed",
    angle: 8,
    direction: "rtl",
    calvinPosition: "left",
    primary: "blue",
    accent: COLORS.amber,
  },
  {
    name: "Purple",
    angle: -15,
    direction: "ltr",
    calvinPosition: "right",
    primary: "purple",
    accent: COLORS.orange,
  },
  {
    name: "Purple Reversed",
    angle: 15,
    direction: "rtl",
    calvinPosition: "left",
    primary: "purple",
    accent: COLORS.orange,
  },
  {
    name: "Purple Steep",
    angle: -25,
    direction: "ltr",
    calvinPosition: "right",
    primary: "purple",
    accent: COLORS.gold,
  },
  {
    name: "Purple Steep Reversed",
    angle: 25,
    direction: "rtl",
    calvinPosition: "left",
    primary: "purple",
    accent: COLORS.gold,
  },
  {
    name: "Purple Gentle",
    angle: -8,
    direction: "ltr",
    calvinPosition: "right",
    primary: "purple",
    accent: COLORS.amber,
  },
  {
    name: "Purple Gentle Reversed",
    angle: 8,
    direction: "rtl",
    calvinPosition: "left",
    primary: "purple",
    accent: COLORS.amber,
  },
  {
    name: "Green",
    angle: -15,
    direction: "ltr",
    calvinPosition: "right",
    primary: "green",
    accent: COLORS.orange,
  },
  {
    name: "Green Reversed",
    angle: 15,
    direction: "rtl",
    calvinPosition: "left",
    primary: "green",
    accent: COLORS.orange,
  },
  {
    name: "Green Steep",
    angle: -25,
    direction: "ltr",
    calvinPosition: "right",
    primary: "green",
    accent: COLORS.gold,
  },
  {
    name: "Green Steep Reversed",
    angle: 25,
    direction: "rtl",
    calvinPosition: "left",
    primary: "green",
    accent: COLORS.gold,
  },
  {
    name: "Green Gentle",
    angle: -8,
    direction: "ltr",
    calvinPosition: "right",
    primary: "green",
    accent: COLORS.amber,
  },
  {
    name: "Green Gentle Reversed",
    angle: 8,
    direction: "rtl",
    calvinPosition: "left",
    primary: "green",
    accent: COLORS.amber,
  },
  {
    name: "Orange",
    angle: -15,
    direction: "ltr",
    calvinPosition: "right",
    primary: "orange",
    accent: COLORS.blue,
  },
  {
    name: "Orange Reversed",
    angle: 15,
    direction: "rtl",
    calvinPosition: "left",
    primary: "orange",
    accent: COLORS.blue,
  },
  {
    name: "Orange Gentle",
    angle: -8,
    direction: "ltr",
    calvinPosition: "right",
    primary: "orange",
    accent: COLORS.blue,
  },
  {
    name: "Orange Gentle Reversed",
    angle: 8,
    direction: "rtl",
    calvinPosition: "left",
    primary: "orange",
    accent: COLORS.blue,
  },
  {
    name: "Slate",
    angle: -15,
    direction: "ltr",
    calvinPosition: "right",
    primary: "slate",
    accent: COLORS.orange,
  },
  {
    name: "Slate Reversed",
    angle: 15,
    direction: "rtl",
    calvinPosition: "left",
    primary: "slate",
    accent: COLORS.orange,
  },
  {
    name: "Slate Steep",
    angle: -25,
    direction: "ltr",
    calvinPosition: "right",
    primary: "slate",
    accent: COLORS.orange,
  },
  {
    name: "Slate Steep Reversed",
    angle: 25,
    direction: "rtl",
    calvinPosition: "left",
    primary: "slate",
    accent: COLORS.orange,
  },
  {
    name: "Slate Gentle",
    angle: -8,
    direction: "ltr",
    calvinPosition: "right",
    primary: "slate",
    accent: COLORS.orange,
  },
  {
    name: "Slate Gentle Reversed",
    angle: 8,
    direction: "rtl",
    calvinPosition: "left",
    primary: "slate",
    accent: COLORS.orange,
  },
];

// Get colors for a style's primary color scheme
function getStyleColors(style) {
  if (style.primary === "purple") {
    return {
      lightest: COLORS.purple,
      light: COLORS.darkPurple,
      dark: COLORS.darkerPurple,
      darkest: COLORS.darkestPurple,
    };
  }
  if (style.primary === "green") {
    return {
      lightest: COLORS.green,
      light: COLORS.darkGreen,
      dark: COLORS.darkerGreen,
      darkest: COLORS.darkestGreen,
    };
  }
  if (style.primary === "orange") {
    return {
      lightest: COLORS.orange,
      light: COLORS.darkOrange,
      dark: COLORS.darkerOrange,
      darkest: COLORS.darkestOrange,
    };
  }
  if (style.primary === "slate") {
    return {
      lightest: COLORS.slate,
      light: COLORS.darkSlate,
      dark: COLORS.darkerSlate,
      darkest: COLORS.darkestSlate,
    };
  }
  return {
    lightest: COLORS.blue,
    light: COLORS.darkBlue,
    dark: COLORS.darkerBlue,
    darkest: COLORS.darkestBlue,
  };
}

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

// Create background layers based on style
function createBackgroundLayers(style, colors) {
  const { angle, direction } = style;
  const skew = `skewX(${angle}deg)`;

  // For RTL, we flip the starting positions
  const positions = direction === "ltr"
    ? ["15%", "30%", "45%"]
    : ["85%", "70%", "55%"];

  // For RTL, layers come from the right, so we adjust with right positioning
  const positionProp = direction === "ltr" ? "left" : "right";

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
              backgroundColor: colors.darkest,
            },
          },
        },
        // Dark angled layer
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              [positionProp]: positions[0],
              width: "100%",
              height: "100%",
              backgroundColor: colors.dark,
              transform: skew,
            },
          },
        },
        // Medium angled layer
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              [positionProp]: positions[1],
              width: "100%",
              height: "100%",
              backgroundColor: colors.light,
              transform: skew,
            },
          },
        },
        // Lightest angled layer
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              [positionProp]: positions[2],
              width: "100%",
              height: "100%",
              backgroundColor: colors.lightest,
              transform: skew,
            },
          },
        },
      ],
    },
  };
}

// Create the cover template
function createTemplate(title, subtitle, logoBase64, calvinBase64, style = STYLES[0]) {
  const colors = getStyleColors(style);
  const calvinOnRight = style.calvinPosition === "right";

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
        backgroundColor: colors.darkest,
      },
      children: [
        // Background layers (angled shapes)
        createBackgroundLayers(style, colors),
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
                    paddingLeft: calvinOnRight ? 20 : 0,
                    paddingRight: calvinOnRight ? 0 : 20,
                    alignItems: calvinOnRight ? "flex-start" : "flex-end",
                    textAlign: calvinOnRight ? "left" : "right",
                  },
                  children: [
                    // Main title
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
                    // Subtitle
                    subtitle
                      ? {
                          type: "div",
                          props: {
                            style: {
                              fontSize: 78,
                              fontWeight: 400,
                              color: style.accent,
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
              // Logo (bottom, opposite side from Calvin)
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: calvinOnRight ? "flex-start" : "flex-end",
                  },
                  children: [
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
            ],
          },
        },
        // Calvin mascot (absolute positioned)
        {
          type: "img",
          props: {
            src: calvinBase64,
            width: 700,
            height: 875,
            style: {
              position: "absolute",
              bottom: -40,
              [calvinOnRight ? "right" : "left"]: 0,
              objectFit: "contain",
              ...(calvinOnRight ? { transform: "scaleX(-1)" } : {}),
            },
          },
        },
      ],
    },
  };
}

// Get a random style
function getRandomStyle() {
  const index = Math.floor(Math.random() * STYLES.length);
  return { style: STYLES[index], index: index + 1 };
}

// Get style by number (1-indexed)
function getStyleByNumber(num) {
  const index = num - 1;
  if (index >= 0 && index < STYLES.length) {
    return STYLES[index];
  }
  return null;
}

// Generate the cover image
async function generateCover(title, subtitle, styleNum = null) {
  const font = loadFont();
  const fontBold = loadFontBold();
  const fontLoraItalic = loadFontLoraItalic();
  const logoBase64 = loadImageBase64("logo.png");
  const calvinBase64 = loadImageBase64("calvin.png");

  let style;
  let styleIndex;

  if (styleNum !== null) {
    style = getStyleByNumber(styleNum);
    styleIndex = styleNum;
    if (!style) {
      console.error(`Invalid style number: ${styleNum}. Must be 1-${STYLES.length}.`);
      process.exit(1);
    }
  } else {
    const random = getRandomStyle();
    style = random.style;
    styleIndex = random.index;
  }

  console.log(`    Style: ${styleIndex}. ${style.name}`);

  const template = createTemplate(title, subtitle, logoBase64, calvinBase64, style);

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
  // Normalize line endings to handle both Windows (CRLF) and Unix (LF)
  const normalizedContent = content.replace(/\r\n/g, "\n");
  const match = normalizedContent.match(/^---\n([\s\S]*?)\n---/);
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
async function generateForPost(post, styleNum = null, outputSuffix = "") {
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

  const png = await generateCover(title, subtitle, styleNum);
  const filename = outputSuffix ? `cover-${outputSuffix}.png` : "cover.png";
  const outputPath = join(post.path, filename);
  writeFileSync(outputPath, png);

  console.log(`    Saved: ${outputPath}\n`);
  return true;
}

// Parse CLI arguments
function parseArgs(args) {
  const result = {
    path: null,
    style: null,
    allStyles: false,
  };

  for (const arg of args) {
    if (arg.startsWith("--style=")) {
      result.style = parseInt(arg.split("=")[1], 10);
    } else if (arg === "--all-styles") {
      result.allStyles = true;
    } else if (!arg.startsWith("--")) {
      result.path = arg;
    }
  }

  return result;
}

// Main CLI
async function main() {
  const args = process.argv.slice(2);
  const { path: postPath, style: styleNum, allStyles } = parseArgs(args);

  // Direct path provided
  if (postPath) {
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

    if (allStyles) {
      console.log(`\nGenerating all ${STYLES.length} style variations...\n`);
      for (let i = 1; i <= STYLES.length; i++) {
        await generateForPost(post, i, `style-${i}`);
      }
      console.log("Done! Generated all style variations.");
    } else {
      await generateForPost(post, styleNum);
    }
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
    }, styleNum);
    return;
  }

  // Generate for selected posts
  console.log(`\nGenerating ${selection.length} cover(s)...\n`);

  for (const post of selection) {
    await generateForPost(post, styleNum);
  }

  console.log("Done!");
}

// Export for use in new-post.js
export { generateCover, parseFrontmatter };

main().catch(console.error);
