/**
 * Generate an OG image for the Projects listing page
 * Features a collage of category icons with the page title
 */

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Render at higher resolution for crisp icons, then downscale
const RENDER_WIDTH = 1920;
const RENDER_HEIGHT = 1008; // Maintains 1200:630 aspect ratio
const OUTPUT_WIDTH = 1200;
const OUTPUT_HEIGHT = 630;

// Category icons to display
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

// Create the template
function createTemplate(iconImages) {
  // Gradient colors - using a nice purple/blue blend
  const gradientStart = "#1a1a2e";
  const gradientMid = "#16213e";
  const gradientEnd = "#0f3460";

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
              backgroundColor: gradientStart,
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
              backgroundColor: gradientMid,
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
              backgroundColor: gradientEnd,
              transform: "skewX(-15deg)",
            },
          },
        },
        // Decorative circles (scaled 1.6x for high-res render)
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
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              padding: 96,
            },
            children: [
              // Left side - Text content (scaled 1.6x for high-res render)
              {
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
                          fontSize: 115,
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
                          fontSize: 115,
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
                    // Author line
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          marginTop: 64,
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
                  ],
                },
              },
              // Right side - Icon grid (scaled 1.6x for high-res render)
              {
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
              },
            ],
          },
        },
      ],
    },
  };
}

async function main() {
  console.log("\nGenerating Projects page OG image...\n");

  // Load fonts
  const fontRegular = loadFont();
  const fontBold = loadFontBold();

  // Load category icons
  const iconImages = CATEGORY_ICONS.map((cat) => loadImageBase64(cat.icon));

  // Create template
  const template = createTemplate(iconImages);

  // Render with satori at high resolution
  const svg = await satori(template, {
    width: RENDER_WIDTH,
    height: RENDER_HEIGHT,
    fonts: [
      {
        name: "Inter",
        data: fontRegular,
        weight: 400,
        style: "normal",
      },
      {
        name: "Inter",
        data: fontBold,
        weight: 700,
        style: "normal",
      },
    ],
  });

  // Convert to PNG at high resolution
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: RENDER_WIDTH },
  });
  const pngData = resvg.render();
  const highResPng = pngData.asPng();

  // Downscale to final output size for crisp result
  const pngBuffer = await sharp(highResPng)
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: "fill" })
    .png()
    .toBuffer();

  // Save to public/images
  const outputPath = join(__dirname, "..", "public", "images", "projects-og.png");
  writeFileSync(outputPath, pngBuffer);

  console.log(`Generated: ${outputPath}`);
  console.log("Done!\n");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
