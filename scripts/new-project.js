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
  return now.toISOString().split("T")[0];
}

// Category options matching the schema
const CATEGORIES = [
  { value: "vs-extension", label: "Visual Studio Extension" },
  { value: "vscode-extension", label: "VS Code Extension" },
  { value: "github-action", label: "GitHub Action" },
  { value: "cli-tool", label: "CLI Tool" },
  { value: "nuget-package", label: "NuGet Package" },
  { value: "desktop-app", label: "Desktop App" },
  { value: "documentation", label: "Documentation" },
];

// Status options matching the schema
const STATUSES = [
  { value: "active", label: "Active (actively developed)" },
  { value: "maintained", label: "Maintained (bug fixes, no new features)" },
  { value: "experimental", label: "Experimental (work in progress)" },
  { value: "archived", label: "Archived (no longer maintained)" },
];

// Marketplace type options
const MARKETPLACE_TYPES = [
  { value: "vs-marketplace", label: "Visual Studio Marketplace" },
  { value: "nuget", label: "NuGet" },
  { value: "npm", label: "npm" },
  { value: "other", label: "Other" },
];

async function selectOption(prompt, options, defaultIndex = 0) {
  console.log(`\n${prompt}`);
  options.forEach((opt, i) => {
    const marker = i === defaultIndex ? "*" : " ";
    console.log(`  ${marker}${i + 1}. ${opt.label}`);
  });
  console.log();

  const choice = await ask(`Select (1-${options.length}) [${defaultIndex + 1}]: `);

  if (!choice) {
    return options[defaultIndex].value;
  }

  const index = parseInt(choice, 10) - 1;
  if (index >= 0 && index < options.length) {
    return options[index].value;
  }

  console.log("Invalid selection, using default.");
  return options[defaultIndex].value;
}

async function generateCover(projectDir) {
  return new Promise((resolve, reject) => {
    const scriptPath = join(__dirname, "generate-project-cover.js");
    const child = spawn("node", [scriptPath, projectDir], {
      stdio: "inherit",
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Cover generation failed with code ${code}`));
    });
  });
}

async function main() {
  console.log("\n  New Open Source Project\n");

  // Required: Title
  const title = await ask("Title (required): ");
  if (!title) {
    console.log("Title is required.");
    rl.close();
    return;
  }

  // Slug (default: slugified title)
  const defaultSlug = slugify(title);
  const slugInput = await ask(`Slug [${defaultSlug}]: `);
  const slug = slugInput || defaultSlug;

  // Required: Description
  const description = await ask("Description (required): ");
  if (!description) {
    console.log("Description is required.");
    rl.close();
    return;
  }

  // Optional: Long description
  const longDescription = await ask("Long description (optional): ");

  // Category (select from enum)
  const category = await selectOption("Category:", CATEGORIES, 0);

  // Required: Repository URL
  const repoUrl = await ask("Repository URL (required): ");
  if (!repoUrl) {
    console.log("Repository URL is required.");
    rl.close();
    return;
  }

  // Optional URLs
  const demoUrl = await ask("Demo URL (optional): ");
  const docsUrl = await ask("Docs URL (optional): ");

  // Tech stack (comma-separated)
  const techStackInput = await ask("Tech stack (comma-separated, e.g. C#, .NET, VSIX): ");
  const techStack = techStackInput
    ? techStackInput.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  // Required: Language
  const language = await ask("Primary language (required): ");
  if (!language) {
    console.log("Language is required.");
    rl.close();
    return;
  }

  // Status (select from enum, default: active)
  const status = await selectOption("Status:", STATUSES, 0);

  // Start date (default: today)
  const defaultDate = getISODate();
  const startDateInput = await ask(`Start date [${defaultDate}]: `);
  const startDate = startDateInput || defaultDate;

  // Optional: GitHub stars
  const starsInput = await ask("GitHub stars (optional): ");
  const stars = starsInput ? parseInt(starsInput, 10) : null;

  // Optional: Marketplace
  const hasMarketplace = await ask("Has marketplace listing? (y/N): ");
  let marketplace = null;
  if (hasMarketplace.toLowerCase() === "y") {
    const marketplaceType = await selectOption("Marketplace type:", MARKETPLACE_TYPES, 0);
    const marketplaceUrl = await ask("Marketplace URL: ");
    if (marketplaceUrl) {
      marketplace = { type: marketplaceType, url: marketplaceUrl };
    }
  }

  // Cover image
  const includeCover = await ask("Generate cover image? (y/N): ");
  const wantsCover = includeCover.toLowerCase() === "y";

  rl.close();

  const dir = `src/content/projects/${slug}`;

  if (existsSync(dir)) {
    console.log(`\n  Directory already exists: ${dir}`);
    return;
  }

  // Build frontmatter
  const frontmatter = [
    "---",
    `title: "${title}"`,
    `description: "${description}"`,
  ];

  if (longDescription) {
    frontmatter.push(`longDescription: "${longDescription}"`);
  }

  frontmatter.push(`category: "${category}"`);
  frontmatter.push(`repoUrl: "${repoUrl}"`);

  if (demoUrl) {
    frontmatter.push(`demoUrl: "${demoUrl}"`);
  }

  if (docsUrl) {
    frontmatter.push(`docsUrl: "${docsUrl}"`);
  }

  frontmatter.push(`techStack: [${techStack.map((t) => `"${t}"`).join(", ")}]`);
  frontmatter.push(`language: "${language}"`);
  frontmatter.push(`status: "${status}"`);
  frontmatter.push(`startDate: "${startDate}"`);

  if (stars !== null && !isNaN(stars)) {
    frontmatter.push(`stars: ${stars}`);
  }

  if (marketplace) {
    frontmatter.push(`marketplace:`);
    frontmatter.push(`  type: "${marketplace.type}"`);
    frontmatter.push(`  url: "${marketplace.url}"`);
  }

  frontmatter.push("---", "", "Your content here...", "");

  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/index.md`, frontmatter.join("\n"));

  console.log(`\n  Created: ${dir}/index.md`);

  if (wantsCover) {
    console.log(`\n  Generating cover image...`);
    try {
      await generateCover(dir);
    } catch (err) {
      console.log(`  Cover generation failed: ${err.message}`);
      console.log(`  You can run 'npm run cover:project' later to generate it.`);
    }
  }

  console.log("\nDone!");
}

main();
