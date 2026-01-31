/**
 * Generate OG images for main site pages (Home, Blog, Categories)
 * Uses high-res rendering with downscale for crisp results
 */

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Render at higher resolution for crisp results, then downscale
const RENDER_WIDTH = 1920;
const RENDER_HEIGHT = 1008;
const OUTPUT_WIDTH = 1200;
const OUTPUT_HEIGHT = 630;

// Category icons for projects page
const CATEGORY_ICONS = [
  { icon: "vs-logo.png", color: "#68217A" },
  { icon: "vscode-logo.png", color: "#007ACC" },
  { icon: "github-logo.png", color: "#238636" },
  { icon: "nuget-logo.png", color: "#004880" },
  { icon: "terminal-icon.png", color: "#0D7377" },
  { icon: "desktop-icon.png", color: "#FF6B35" },
];

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

// Load fonts
function loadFont() {
  const fontPath = join(__dirname, "assets", "inter-regular.woff");
  return readFileSync(fontPath);
}

function loadFontBold() {
  const fontPath = join(__dirname, "assets", "inter-bold.woff");
  return readFileSync(fontPath);
}

// Create base template with gradient background
function createBaseTemplate(children, gradientColors) {
  const { start, mid, end } = gradientColors;

  return {
    type: "div",
    props: {
      style: {
        width: RENDER_WIDTH,
        height: RENDER_HEIGHT,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Inter",
      },
      children: [
        // Background
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: start,
            },
          },
        },
        // Gradient overlay - diagonal stripes
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: "-30%",
              width: "80%",
              height: "100%",
              backgroundColor: mid,
              transform: "skewX(-15deg)",
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: "-50%",
              width: "70%",
              height: "100%",
              backgroundColor: end,
              transform: "skewX(-15deg)",
            },
          },
        },
        // Decorative circles
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: -160,
              right: -160,
              width: 640,
              height: 640,
              borderRadius: 320,
              backgroundColor: "rgba(255,255,255,0.03)",
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: -128,
              left: -128,
              width: 480,
              height: 480,
              borderRadius: 240,
              backgroundColor: "rgba(255,255,255,0.03)",
            },
          },
        },
        // Main content
        {
          type: "div",
          props: {
            style: {
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              padding: 96,
            },
            children,
          },
        },
      ],
    },
  };
}

// Home page template
function createHomeTemplate(logoBase64, caricatureBase64) {
  const gradientColors = { start: "#2a2a3e", mid: "#26314e", end: "#1f4470" };

  const leftContent = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
      },
      children: [
        // Title
        {
          type: "div",
          props: {
            style: {
              fontSize: 100,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.1,
              marginBottom: 32,
              textShadow: "0 6px 19px rgba(0,0,0,0.3)",
            },
            children: "Coding With Calvin",
          },
        },
        // Subtitle
        {
          type: "div",
          props: {
            style: {
              fontSize: 42,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.4,
              maxWidth: 900,
            },
            children: "Software Development Blog & Open Source Projects",
          },
        },
        // URL line
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              marginTop: "auto",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: 6,
                    height: 48,
                    backgroundColor: "#e94560",
                    marginRight: 26,
                    borderRadius: 3,
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 38,
                    color: "rgba(255,255,255,0.6)",
                  },
                  children: "codingwithcalvin.net",
                },
              },
            ],
          },
        },
      ].filter(Boolean),
    },
  };

  const rightContent = caricatureBase64
    ? {
        type: "div",
        props: {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          children: [
            {
              type: "img",
              props: {
                src: caricatureBase64,
                width: 850,
                height: 850,
                style: { objectFit: "contain", transform: "scaleX(-1)" },
              },
            },
          ],
        },
      }
    : null;

  const children = [
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
        },
        children: [leftContent, rightContent].filter(Boolean),
      },
    },
  ];

  return createBaseTemplate(children, gradientColors);
}

// Blog page template
function createBlogTemplate(caricatureBase64) {
  const gradientColors = { start: "#4d3520", mid: "#5a4028", end: "#6a4830" };

  const leftContent = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
      },
      children: [
        // Title
        {
          type: "div",
          props: {
            style: {
              fontSize: 100,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.1,
              marginBottom: 48,
              textShadow: "0 6px 19px rgba(0,0,0,0.3)",
            },
            children: "Blog",
          },
        },
        // Subtitle
        {
          type: "div",
          props: {
            style: {
              fontSize: 42,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.4,
              maxWidth: 900,
            },
            children: "Articles on .NET, Visual Studio, DevOps & Software Development",
          },
        },
        // Author line
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              marginTop: "auto",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: 6,
                    height: 48,
                    backgroundColor: "#e94560",
                    marginRight: 26,
                    borderRadius: 3,
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 38,
                    color: "rgba(255,255,255,0.6)",
                  },
                  children: "codingwithcalvin.net/blog",
                },
              },
            ],
          },
        },
      ],
    },
  };

  const rightContent = caricatureBase64
    ? {
        type: "div",
        props: {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          children: [
            {
              type: "img",
              props: {
                src: caricatureBase64,
                width: 850,
                height: 850,
                style: { objectFit: "contain", transform: "scaleX(-1)" },
              },
            },
          ],
        },
      }
    : null;

  const children = [
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
        },
        children: [leftContent, rightContent].filter(Boolean),
      },
    },
  ];

  return createBaseTemplate(children, gradientColors);
}

// Categories page template
function createCategoriesTemplate(caricatureBase64) {
  const gradientColors = { start: "#2a3f2a", mid: "#2e4a3e", end: "#1d3f2f" };

  // Sample category badges
  const categories = [".NET", "Visual Studio", "DevOps", "C#", "Open Source", "...And More!"];

  const badges = categories.map((cat, i) => ({
    type: "div",
    props: {
      style: {
        display: "flex",
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 50,
        padding: "20px 40px",
        marginRight: 20,
        marginBottom: 20,
        border: "3px solid rgba(255,255,255,0.2)",
      },
      children: [
        {
          type: "span",
          props: {
            style: {
              color: "#FFFFFF",
              fontSize: 32,
              fontWeight: 600,
            },
            children: cat,
          },
        },
      ],
    },
  }));

  const leftContent = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
      },
      children: [
        // Title
        {
          type: "div",
          props: {
            style: {
              fontSize: 100,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.1,
              marginBottom: 48,
              textShadow: "0 6px 19px rgba(0,0,0,0.3)",
            },
            children: "Categories",
          },
        },
        // Badge grid
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexWrap: "wrap",
              maxWidth: 900,
            },
            children: badges,
          },
        },
        // Author line
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              marginTop: "auto",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: 6,
                    height: 48,
                    backgroundColor: "#e94560",
                    marginRight: 26,
                    borderRadius: 3,
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 38,
                    color: "rgba(255,255,255,0.6)",
                  },
                  children: "codingwithcalvin.net/categories",
                },
              },
            ],
          },
        },
      ],
    },
  };

  const rightContent = caricatureBase64
    ? {
        type: "div",
        props: {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          children: [
            {
              type: "img",
              props: {
                src: caricatureBase64,
                width: 850,
                height: 850,
                style: { objectFit: "contain", transform: "scaleX(-1)" },
              },
            },
          ],
        },
      }
    : null;

  const children = [
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
        },
        children: [leftContent, rightContent].filter(Boolean),
      },
    },
  ];

  return createBaseTemplate(children, gradientColors);
}

// Projects page template
function createProjectsTemplate(iconImages) {
  const gradientColors = { start: "#3a2a50", mid: "#4a3060", end: "#302545" };

  const leftContent = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
      },
      children: [
        // Title
        {
          type: "div",
          props: {
            style: {
              fontSize: 100,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.1,
              marginBottom: 32,
              textShadow: "0 6px 19px rgba(0,0,0,0.3)",
            },
            children: "Open Source",
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: 100,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.1,
              marginBottom: 48,
              textShadow: "0 6px 19px rgba(0,0,0,0.3)",
            },
            children: "Projects",
          },
        },
        // Subtitle
        {
          type: "div",
          props: {
            style: {
              fontSize: 45,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.4,
              maxWidth: 720,
            },
            children: "VS Extensions, GitHub Actions, CLI Tools, NuGet Packages & More",
          },
        },
        // URL line
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              marginTop: "auto",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: 6,
                    height: 48,
                    backgroundColor: "#e94560",
                    marginRight: 26,
                    borderRadius: 3,
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 38,
                    color: "rgba(255,255,255,0.6)",
                  },
                  children: "codingwithcalvin.net/projects",
                },
              },
            ],
          },
        },
      ],
    },
  };

  // Right side - Icon grid
  const rightContent = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "center",
      },
      children: [
        // Top row of icons
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              marginBottom: 32,
            },
            children: iconImages.slice(0, 3).map((img, i) => ({
              type: "div",
              props: {
                style: {
                  width: 192,
                  height: 192,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: i > 0 ? 32 : 0,
                  border: "3px solid rgba(255,255,255,0.15)",
                },
                children: img
                  ? {
                      type: "img",
                      props: {
                        src: img,
                        width: 112,
                        height: 112,
                        style: { objectFit: "contain" },
                      },
                    }
                  : null,
              },
            })),
          },
        },
        // Bottom row of icons
        {
          type: "div",
          props: {
            style: {
              display: "flex",
            },
            children: iconImages.slice(3, 6).map((img, i) => ({
              type: "div",
              props: {
                style: {
                  width: 192,
                  height: 192,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: i > 0 ? 32 : 0,
                  border: "3px solid rgba(255,255,255,0.15)",
                },
                children: img
                  ? {
                      type: "img",
                      props: {
                        src: img,
                        width: 112,
                        height: 112,
                        style: { objectFit: "contain" },
                      },
                    }
                  : null,
              },
            })),
          },
        },
      ],
    },
  };

  const children = [
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
        },
        children: [leftContent, rightContent],
      },
    },
  ];

  return createBaseTemplate(children, gradientColors);
}

async function generateImage(template, outputName, fonts) {
  // Render with satori at high resolution
  const svg = await satori(template, {
    width: RENDER_WIDTH,
    height: RENDER_HEIGHT,
    fonts,
  });

  // Convert to PNG at high resolution
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: RENDER_WIDTH },
  });
  const pngData = resvg.render();
  const highResPng = pngData.asPng();

  // Downscale to final output size
  const pngBuffer = await sharp(highResPng)
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: "fill" })
    .png()
    .toBuffer();

  // Save to public/images
  const outputPath = join(__dirname, "..", "public", "images", outputName);
  writeFileSync(outputPath, pngBuffer);

  console.log(`  Generated: ${outputName}`);
}

async function main() {
  const page = process.argv[2];

  console.log("\nGenerating page OG images...\n");

  // Load fonts
  const fontRegular = loadFont();
  const fontBold = loadFontBold();
  const fonts = [
    { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
    { name: "Inter", data: fontBold, weight: 700, style: "normal" },
  ];

  // Load images
  const logoBase64 = loadImageBase64("logo.png");
  const caricatureBase64 = loadImageBase64("calvin.png");
  const iconImages = CATEGORY_ICONS.map((cat) => loadImageBase64(cat.icon));

  const pages = {
    home: { template: createHomeTemplate(logoBase64, caricatureBase64), output: "home-og.png" },
    blog: { template: createBlogTemplate(caricatureBase64), output: "blog-og.png" },
    categories: { template: createCategoriesTemplate(caricatureBase64), output: "categories-og.png" },
    projects: { template: createProjectsTemplate(iconImages), output: "projects-og.png" },
  };

  if (page && pages[page]) {
    // Generate specific page
    await generateImage(pages[page].template, pages[page].output, fonts);
  } else if (!page || page === "all") {
    // Generate all pages
    for (const [name, config] of Object.entries(pages)) {
      await generateImage(config.template, config.output, fonts);
    }
  } else {
    console.log(`Unknown page: ${page}`);
    console.log(`Available pages: ${Object.keys(pages).join(", ")}, all`);
    process.exit(1);
  }

  console.log("\nDone!\n");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
