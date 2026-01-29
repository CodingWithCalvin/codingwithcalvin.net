import { readdir, copyFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const blogDir = join(__dirname, "..", "src", "content", "blog");
const outputDir = join(__dirname, "..", "public", "originals");

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

async function copyOriginals() {
  console.log("Copying original images to public/originals...\n");

  let copiedCount = 0;

  // Get all years
  const years = await readdir(blogDir, { withFileTypes: true });

  for (const year of years.filter((d) => d.isDirectory())) {
    const yearDir = join(blogDir, year.name);
    const slugs = await readdir(yearDir, { withFileTypes: true });

    for (const slug of slugs.filter((d) => d.isDirectory())) {
      const postDir = join(yearDir, slug.name);
      const files = await readdir(postDir, { withFileTypes: true });

      const images = files.filter(
        (f) =>
          f.isFile() && IMAGE_EXTENSIONS.includes(extname(f.name).toLowerCase())
      );

      if (images.length === 0) continue;

      // Create output directory for this post
      const postOutputDir = join(outputDir, year.name, slug.name);
      if (!existsSync(postOutputDir)) {
        await mkdir(postOutputDir, { recursive: true });
      }

      // Copy each image
      for (const image of images) {
        const src = join(postDir, image.name);
        const dest = join(postOutputDir, image.name);
        await copyFile(src, dest);
        copiedCount++;
      }
    }
  }

  console.log(`Copied ${copiedCount} original images.\n`);
}

copyOriginals().catch(console.error);
