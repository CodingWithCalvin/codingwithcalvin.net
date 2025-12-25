import { createInterface } from "readline";
import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";

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
  const includeCover = await ask("Include cover image? (y/N): ");

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

  const wantsCover = includeCover.toLowerCase() === "y";
  if (wantsCover) {
    frontmatter.push("image: ./cover.png");
  }

  frontmatter.push("---", "", "Your content here...", "");

  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/index.md`, frontmatter.join("\n"));

  console.log(`\n✅ Created: ${dir}/index.md`);
  if (wantsCover) {
    console.log(`📷 Don't forget to add cover.png to ${dir}/`);
  }
}

main();
