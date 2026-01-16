import { createInterface } from "readline";
import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getISODate() {
  const now = new Date();
  const offset = -now.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const pad = (n) => String(Math.abs(n)).padStart(2, "0");
  const offsetStr = `${sign}${pad(Math.floor(offset / 60))}:${pad(offset % 60)}`;
  return now.toISOString().replace("Z", "").split(".")[0] + offsetStr;
}

async function generateCover(postDir) {
  return new Promise((resolve, reject) => {
    const scriptPath = join(__dirname, "generate-cover.js");
    const child = spawn("node", [scriptPath, postDir], {
      stdio: "inherit",
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Cover generation failed with code ${code}`));
    });
  });
}

async function main() {
  console.log("\n📝 New Blog Post\n");

  const title = await ask("Title: ");
  if (!title) {
    console.log("Title is required.");
    rl.close();
    return;
  }

  const defaultSlug = slugify(title);
  const slugInput = await ask(`Slug [${defaultSlug}]: `);
  const slug = slugInput || defaultSlug;

  const categoriesInput = await ask("Categories (comma-separated): ");
  const categories = categoriesInput
    ? categoriesInput.split(",").map((c) => c.trim().toLowerCase())
    : [];

  const description = await ask("Description (optional): ");

  const includeCover = await ask("Generate cover image? (y/N): ");
  const wantsCover = includeCover.toLowerCase() === "y";

  let subtitle = "";
  if (wantsCover) {
    subtitle = await ask("Cover subtitle (optional): ");
  }

  rl.close();

  const year = new Date().getFullYear();
  const dir = `src/content/blog/${year}/${slug}`;

  if (existsSync(dir)) {
    console.log(`\n❌ Directory already exists: ${dir}`);
    return;
  }

  const frontmatter = [
    "---",
    `title: "${title}"`,
    `date: "${getISODate()}"`,
    `categories: [${categories.join(", ")}]`,
  ];

  if (description) {
    frontmatter.push(`description: "${description}"`);
  }

  if (subtitle) {
    frontmatter.push(`subtitle: "${subtitle}"`);
  }

  frontmatter.push("---", "", "Your content here...", "");

  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/index.md`, frontmatter.join("\n"));

  console.log(`\n✅ Created: ${dir}/index.md`);

  if (wantsCover) {
    console.log(`\n🎨 Generating cover image...`);
    try {
      await generateCover(dir);
    } catch (err) {
      console.log(`⚠️  Cover generation failed: ${err.message}`);
      console.log(`   You can run 'npm run cover' later to generate it.`);
    }
  }
}

main();
