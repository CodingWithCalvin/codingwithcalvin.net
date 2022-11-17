---
title: "Quick Tip: Using Visual Studio Code from the Command-Line on macOS"
categories: [vscode,macos,commandline]
description: "I recently needed to automate launching VSCode from a rake task on my Macbook..  This post shows the steps necessary to allow this to work."
---

As part of my new job, I had to get (and learn!) a new Macbook.

Luckily, most of the applications I need are cross-platform these days, including Visual Studio Code (my favorite all around text editor).  In fact, I'm using it right now to write this post.

I installed Visual Studio Code, as per usual (following the instructions on the website).  I tried to launch it from the terminal, just like I do all the time on my Windows-based machines, but it wouldn't work!  VSCode wouldn't launch and I received an error that the command wasn't understood.  But why not, I thought to myself?  It's been installed, machine has been restarted (as a result of other installations / configurations), why couldn't it find it?

I do what every developer does, I open up a browser and hit my favorite search engine - BING, and FINALLY, uncovered it...

Installing Visual Studio Code on a Mac, by default, does NOT add the installation directory to the PATH.  Great, so what's the answer, you ask?

1. Launch VSCode
2. Open the Command Palette (`View | Command Palette` or CMD + SHIFT + P)
3. Type `shell command`, which should bring you to `Shell Command: Install 'code' command in PATH`
4. Hit enter, and you're done.

Restart any open terminal windows to pick up the PATH change, and you can use `code` directly from the terminal now!

Enjoy!
