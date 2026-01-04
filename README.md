# 👨‍💻 Coding With Calvin

[![License](https://img.shields.io/github/license/CodingWithCalvin/codingwithcalvin.net?style=for-the-badge)](LICENSE)

Personal blog of Calvin Allen — software development thoughts, tutorials, and experiences.

🌐 **Live at:** [codingwithcalvin.net](https://www.codingwithcalvin.net)

## ✨ Features

- 📝 Markdown-based blog posts with frontmatter
- 🏷️ Category tagging and filtering
- 📰 RSS feed for subscribers
- 🎨 Dark theme with custom styling
- 📱 Fully responsive design
- ⚡ Lightning-fast static site generation
- ☁️ Deployed on Cloudflare Pages

## 🛠️ Tech Stack

- [Astro](https://astro.build) - Static site generator
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [TypeScript](https://typescriptlang.org) - Type safety

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📄 Creating a New Post

```bash
npm run new-post "Your Post Title Here"
```

This creates a new markdown file in `src/content/blog/` with the current date and frontmatter template.

## 📁 Project Structure

```
src/
├── components/     # Reusable Astro components
├── content/blog/   # Markdown blog posts
├── layouts/        # Page layouts
├── pages/          # Routes and pages
└── styles/         # Global styles
```

## 📜 License

Content © Calvin Allen. Code is MIT licensed.
