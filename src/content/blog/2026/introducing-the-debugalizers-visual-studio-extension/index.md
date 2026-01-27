---
title: "Introducing the 'Debugalizers' Visual Studio extension!"
date: "2026-01-27T12:00:00-05:00"
categories: [dotnet, csharp, extensibility, visualstudio]
description: "Stop squinting at minified JSON in the debugger. I built an extension that gives you beautiful, formatted views of your string data while debugging!"
subtitle: "Beautiful debug visualizers for Visual Studio!"
blueskyPostId: "3mdgmpph3sm2h"
---

If you've ever found yourself debugging an application and hovering over a string variable that contains a massive blob of minified JSON, XML, or some other structured data - you know the pain. You squint at the DataTip, try to make sense of the wall of text, maybe copy it out to a separate tool to format it, and by then you've lost your debugging flow entirely.

I decided to fix that problem for myself, and now I'm sharing it with you!

Introducing "[Debugalizers](https://marketplace.visualstudio.com/items?itemName=CodingWithCalvin.Debugalizers)", a Visual Studio extension that provides beautiful, formatted debug visualizers for over 30 different data formats.

## What Does It Do?

When you're debugging and hover over a string variable, you'll see that little magnifying glass icon in the DataTip. Click it, select your Debugalizer of choice, and boom - a proper window pops up with your content beautifully formatted, syntax highlighted, and ready to explore.

The extension supports a wide variety of formats across five categories:

**Data Formats**
- JSON, XML, HTML, YAML, TOML (with formatted, tree, and raw views)
- CSV, TSV, INI (table and raw views)
- Markdown (rendered and raw)
- SQL, GraphQL (syntax highlighted)

**Encoded Data**
- Base64 (decoded, hex, and raw views)
- Base64 Images (actual image preview!)
- URL Encoded, HTML Entities, Unicode Escape
- Hex Strings, GZip, and Deflate (decompressed)

**Security & Authentication**
- JWT tokens (claims table with token breakdown)
- SAML (XML tree with claim parsing)
- X.509 Certificates (detailed information table)

**Structured Strings**
- Connection Strings (parsed key-value table)
- URIs/URLs (parsed components and query parameters)
- Query Strings, Regex patterns
- Cron expressions (human-readable schedules)

**Binary & Low-Level**
- Hex Dump (with ASCII sidebar)
- GUID/UUID (format and version info)
- Unix Timestamps (human-readable conversion)
- IP Addresses (IPv4/IPv6 with CIDR info)

## Interactive Features

It's not just about formatting, though. Each visualizer window gives you:

- **Search** - Hit Ctrl+F to find content within your data
- **Copy** - Grab the raw content or the formatted version
- **Export** - Save to a file for later analysis
- **Word Wrap** - Toggle it on or off as needed
- **Validation** - Visual feedback showing whether your content is valid
- **Statistics** - Line count, character count, byte count at a glance

## How To Use It

1. Install the extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=CodingWithCalvin.Debugalizers)
2. Start debugging your application
3. Hover over any string variable
4. Click the magnifying glass icon in the DataTip
5. Select the appropriate Debugalizer from the list
6. Enjoy actually being able to read your data!

The extension supports Visual Studio 2022 (version 17.8 or later), and it's completely zero-configuration - just install and go.

## Why I Built This

I got tired of the dance: hover, squint, copy, paste into an online formatter, lose context, go back to Visual Studio, repeat. Every. Single. Time. With Debugalizers, everything stays right there in Visual Studio where you need it. Your debugging flow stays intact, and you can actually understand what you're looking at without leaving the IDE.

Feel free to check it out, and let me know if you have any suggestions for it - I know there are probably more formats people would love to see visualizers for! PRs accepted, too, if you're into that sort of thing.

And, of course, [it's open source](https://github.com/CodingWithCalvin/VS-Debugalizers), so feel free to peruse the source code, create issues, and have discussions on ways we can make this tool even better!
