---
title: "Introducing the 'Breakpoint Notifier' Visual Studio extension!"
date: "2023-04-08T21:22:49-04:00"
categories: [dotnet, csharp, extensibility, visualstudio]
description: "Another new Visual Studio extension based on a request from a friend. Take a look, let me know what you think!"
---

Introducing "[Breakpoint Notifier](https://marketplace.visualstudio.com/items?itemName=coding-with-calvin.BreakpointNotifier)", an extension for Visual Studio 2022 and up that tosses up a messagebox when a breakpoint is hit while you're debugging. A potentially useful extension if you like to go watch YouTube videos while you wait for a long running process to finally get to that breakpoint.

For now, theres nothing you need to do, outside of installing it. Then, while you're debugging, as soon as a breakpoint is hit - boom, messagebox in your face. This has the secondary effect (at least, on my machine) of bringing Visual Studio to the front. Great, if you're not paying attention 😉

Now, let's talk about this extensions giant downfall. No configuration, no "formulas" for **WHEN** to do this. That means, it will show the messagebox for every breakpoint while you're debugging - whether you want it to or not. With that said, I wanted to get it out and make sure it actually works for people, and hopefully get some ideas on how we can make it better / configurable / skippable / etc.

Thanks for reading! Please check it out, and let me know if you have any suggestions for it - I think somebody should have some at least!

And, of course, [it's open source](https://github.com/CodingWithCalvin/VS-BreakpointNotifier) and issues / PRs are happily accepted, too, if you're into that sort of thing 😉.
