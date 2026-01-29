import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const blogDir = join(__dirname, "..", "src", "content", "blog");

// Compression settings
const PNG_QUALITY = 80; // 1-100, lower = smaller file
const PNG_COMPRESSION = 9; // 0-9, higher = more compression (slower)
const MIN_SAVINGS_PERCENT = 5; // Only replace if we save at least this much

async function findImages(dir) {
  const images = [];

  async function scan(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if ([".png", ".jpg", ".jpeg"].includes(ext)) {
          images.push(fullPath);
        }
      }
    }
  }

  await scan(dir);
  return images;
}

async function compressImage(imagePath) {
  const ext = extname(imagePath).toLowerCase();
  const originalStats = await stat(imagePath);
  const originalSize = originalStats.size;

  let pipeline = sharp(imagePath);
  const metadata = await pipeline.metadata();

  // Skip if already very small
  if (originalSize < 10000) {
    return { skipped: true, reason: "already small" };
  }

  let outputBuffer;

  if (ext === ".png") {
    // For PNGs: use palette-based compression when possible
    outputBuffer = await sharp(imagePath)
      .png({
        compressionLevel: PNG_COMPRESSION,
        palette: true,
        quality: PNG_QUALITY,
        effort: 10, // max effort for smallest size
      })
      .toBuffer();
  } else if (ext === ".jpg" || ext === ".jpeg") {
    outputBuffer = await sharp(imagePath)
      .jpeg({
        quality: 85,
        mozjpeg: true,
      })
      .toBuffer();
  }

  const newSize = outputBuffer.length;
  const savingsPercent = ((originalSize - newSize) / originalSize) * 100;

  if (savingsPercent >= MIN_SAVINGS_PERCENT) {
    await sharp(outputBuffer).toFile(imagePath);
    return {
      compressed: true,
      originalSize,
      newSize,
      savingsPercent: savingsPercent.toFixed(1),
    };
  }

  return {
    skipped: true,
    reason: `savings too small (${savingsPercent.toFixed(1)}%)`,
  };
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

async function main() {
  const args = process.argv.slice(2);
  let targetDir = blogDir;

  // Allow passing a specific directory
  if (args[0]) {
    targetDir = args[0];
  }

  console.log(`\nScanning for images in: ${targetDir}\n`);

  const images = await findImages(targetDir);
  console.log(`Found ${images.length} images\n`);

  let totalOriginal = 0;
  let totalNew = 0;
  let compressedCount = 0;
  let skippedCount = 0;

  for (const imagePath of images) {
    const relativePath = imagePath.replace(blogDir, "").replace(/^[/\\]/, "");
    process.stdout.write(`Processing: ${relativePath}... `);

    try {
      const result = await compressImage(imagePath);

      if (result.compressed) {
        console.log(
          `✓ ${formatBytes(result.originalSize)} → ${formatBytes(result.newSize)} (-${result.savingsPercent}%)`
        );
        totalOriginal += result.originalSize;
        totalNew += result.newSize;
        compressedCount++;
      } else {
        console.log(`⊘ skipped (${result.reason})`);
        skippedCount++;
      }
    } catch (err) {
      console.log(`✗ error: ${err.message}`);
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`Compressed: ${compressedCount} images`);
  console.log(`Skipped: ${skippedCount} images`);

  if (compressedCount > 0) {
    const totalSavings = totalOriginal - totalNew;
    const totalPercent = ((totalSavings / totalOriginal) * 100).toFixed(1);
    console.log(
      `Total savings: ${formatBytes(totalSavings)} (${totalPercent}%)`
    );
  }

  console.log();
}

main().catch(console.error);
