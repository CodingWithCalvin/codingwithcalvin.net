---
title: "Reflecting on 2025"
date: "2025-12-31T12:00:00-05:00"
categories: [meta, retrospective]
description: "A year of highs and lows - from a promotion to a career pivot, health challenges, and a burst of open source work to close out the year."
---

2025 was a year of change. Some of it planned, some of it not. Looking back, it feels like I lived through two or three different years packed into one.

## The Career Rollercoaster

I started the year at New Relic, continuing to work on [CodeStream](https://newrelic.com/codestream) - a product I genuinely loved. There's something special about building developer tools for other developers, and CodeStream was exactly that. In July, I was promoted to Lead Software Engineer - a milestone I was genuinely proud of.

But things started to shift. One by one, people on my team began leaving. Management got quiet and weird about the future of CodeStream. The writing was on the wall, even if nobody was saying it out loud. That uncertainty is exhausting in a way that's hard to describe - you show up every day not knowing if what you're building matters anymore.

So in November, I made the call and left. I joined [Centric Consulting](https://centricconsulting.com/) as an Agentic Systems Designer. It's a bit of a departure - consulting instead of product work, and a title that reflects just how much AI agents are reshaping our industry. I'm still getting my bearings, but I'm excited about the possibilities.

## Open Source and Side Projects

For most of 2025, I didn't ship much on the side project front. But December hit, and something clicked. Maybe it was the new job energy. Maybe I just needed to create something after months of uncertainty. Whatever the reason, I managed to cram a surprising amount of work into the last few weeks of the year.

### Three New Visual Studio Extensions

- **Project Renamifier** - for when you need to rename projects without losing your mind ([Marketplace](https://marketplace.visualstudio.com/items?itemName=CodingWithCalvin.VS-ProjectRenamifier) | [GitHub](https://github.com/CodingWithCalvin/VS-ProjectRenamifier))
- **Couchbase Explorer** - explore Couchbase from inside Visual Studio ([Marketplace](https://marketplace.visualstudio.com/items?itemName=CodingWithCalvin.VS-CouchbaseExplorer) | [GitHub](https://github.com/CodingWithCalvin/VS-CouchbaseExplorer))
- **Git Ranger** - Git tooling for Visual Studio ([Marketplace](https://marketplace.visualstudio.com/items?itemName=CodingWithCalvin.VS-GitRanger) | [GitHub](https://github.com/CodingWithCalvin/VS-GitRanger))

Plus the usual maintenance and updates to my existing extensions.

### NuGet Packages

I went deep on improving the VS extension development experience:

- **CodingWithCalvin.VsixSdk** - an MSBuild SDK that lets you use SDK-style projects for Visual Studio extension development. No more legacy `.csproj` files. I wrote about [how to create your own MSBuild SDK](/2025/creating-your-own-msbuild-sdk-it-s-easier-than-you-think/) if you're curious. ([NuGet](https://www.nuget.org/packages/CodingWithCalvin.VsixSdk) | [GitHub](https://github.com/CodingWithCalvin/VsixSdk))
- **CodingWithCalvin.Otel4Vsix** - adds OpenTelemetry support to Visual Studio extensions. Because even extensions deserve observability. ([NuGet](https://www.nuget.org/packages/CodingWithCalvin.Otel4Vsix) | [GitHub](https://github.com/CodingWithCalvin/Otel4Vsix))
- **CodingWithCalvin.VsixSdk.Templates** - templates built on top of the SDK to make getting started easier. ([NuGet](https://www.nuget.org/packages/CodingWithCalvin.VsixSdk.Templates) | [GitHub](https://github.com/CodingWithCalvin/VsixSdk.Templates))

If you're building VS extensions, I hope these make your life a little easier.

### dtvem

I also built **dtvem** - a cross-platform CLI tool for managing multiple programming language runtimes (Python, Node.js, Ruby, with more on the way). Think of it as one version manager to rule them all. It uses shims instead of shell configuration files, so there's no messing with `.bashrc` or `.zshrc`. And unlike most tools in this space, it was designed with first-class Windows support from day one. ([Website](https://dtvem.io/) | [GitHub](https://github.com/dtvem/dtvem))

### Visual Studio Toolbox

I've also been working on something new - a Windows application called Visual Studio Toolbox. It's not an extension or a NuGet package, but a standalone app. Still in the works, but I'm excited about where it's heading. ([GitHub](https://github.com/CodingWithCalvin/VSToolbox))

## The Hard Stuff

It wasn't all code and career moves. My wife had major surgery this year, and thankfully she's recovering well. My daughter had some health scares that, fortunately, turned out okay for now. And I've been working through my own mental health challenges - the kind that are easy to ignore when you're busy, until suddenly you can't anymore.

It's a reminder that none of this stuff - the code, the career, the projects - matters if you don't take care of yourself and the people you love.

## That's a Wrap

No grand plans for 2026 to share. No numbered goals or resolutions. Just gratitude for making it through a turbulent year, and hope that the next one brings a little more stability.

Thanks for reading, and for sticking with me through another year of this blog. See you on the other side.
