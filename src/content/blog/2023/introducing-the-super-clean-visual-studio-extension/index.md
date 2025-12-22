---
title: "Introducing the 'Super Clean' Visual Studio extension!"
date: "2023-04-03T09:54:52-04:00"
categories: [dotnet, csharp, extensibility, visualstudio]
description: "I released another new extension for Visual Studio, and I want you to know about it!"
image: ./cover.png
---

Introducing "[Super Clean](https://marketplace.visualstudio.com/items?itemName=coding-with-calvin.super-clean)", an extension for Visual Studio 2022 and up that actually removes those pesky `bin` and `obj` folders!

You can trigger this amazing cleanup routine from the Solution Explorer - either by right-clicking on the solution node itself, or right-clicking on an individual project. Performing the action at the solution level will recursively delete all the necessary folders from all active projects in the solution. Conversely, triggering it from a single project will only clean that individual project.

Feel free to check it out, and let me know if you have any suggestions for it - I realize it could seem like its "done", but you never know what ideas folks might have! PRs accepted, too, if you're into that sort of thing 😉.
