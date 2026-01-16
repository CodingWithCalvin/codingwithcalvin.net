---
title: "Introducing the 'Git Ranger' Visual Studio extension!"
date: "2026-01-16T12:00:00-05:00"
categories: [dotnet, csharp, extensibility, visualstudio]
description: "Git Ranger brings enhanced Git tooling to Visual Studio 2022 and 2026. See who modified each line, when, and why - right in your editor. Inline annotations, gutter margins, author color coding, age heat maps, and more. Inspired by GitLens for VS Code."
subtitle: "Enhanced Git tooling for Visual Studio!"
blueskyPostId: "3mckvtkhclt2u"
---

Introducing "[Git Ranger](https://marketplace.visualstudio.com/items?itemName=CodingWithCalvin.VS-GitRanger)", an extension for Visual Studio 2022 (and 2026!) that brings enhanced Git tooling directly into your editor. If you've ever used GitLens in VS Code, this extension draws inspiration from that experience and aims to bring similar capabilities to Visual Studio.

## The Vision

Git Ranger is designed to be a comprehensive Git companion for Visual Studio developers. The goal is to surface Git information where you need it, when you need it - without breaking your flow or switching context.

## Current Features

The initial release focuses on inline Git information:

- **Inline Annotations** - See who last modified each line, when, and why - right in your editor
- **Gutter Margin** - A visual indicator in the left margin showing commit history at a glance
- **Theme-Adaptive Colors** - 12 vibrant colors that automatically adjust for dark and light themes
- **Author Color Coding** - Each contributor gets their own distinctive color
- **Age Heat Map Mode** - Optional visualization showing relative age of changes
- **Interactive Tooltips** - Hover to see full commit details
- **Copy Commit SHA** - Quick access to commit hashes via click or menu command

## Customization

Git Ranger is highly configurable. Head to **Tools → Options → Git Ranger** where you can adjust display options, color modes, date formats, caching behavior, and more.

## What's Coming

The roadmap is packed with planned features:

- **Git CodeLens** for methods and classes
- **File History** and **Line History** tool windows
- **Visual Git Graph** with styling and interactions
- **Status bar indicator**
- **Branch and Tag management** tool windows
- **Commit Details** and **Contributors** views
- **Diff integration**
- **Remote provider integrations** (GitHub, GitLab, etc.)
- **Git Command Palette**
- **Stash management**
- **Interactive rebase editor**
- **AI-powered commit message generation**

You can check out the full [issue list on GitHub](https://github.com/CodingWithCalvin/VS-GitRanger/issues) to see everything that's planned and track progress.

## Get It Now

Feel free to check it out on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=CodingWithCalvin.VS-GitRanger), and let me know if you have any suggestions! It's [open source on GitHub](https://github.com/CodingWithCalvin/VS-GitRanger), so issues and PRs are happily accepted if you're into that sort of thing.
