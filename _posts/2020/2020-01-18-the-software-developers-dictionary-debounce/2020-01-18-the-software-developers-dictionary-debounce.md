---
title: "The Software Developers' Dictionary - Debounce"
categories: [sdd,dictionary]
description: "Let's take a look at the definition of 'debounce', a term used in software development, that doesn't exist in modern language dictionaries."
---

In the software development world, we sometimes have a need to "debounce" an input field.

If you're new to the industry, you may be thinking, "de-what?", and trying to find the answer online.  Unfortunately, you'll only find "incorrect" (incorrect as it relates to software development) definitions on traditional dictionary sites.  And, sometimes, we don't even know "debounce" is what we're trying to do in the first place!

<!--more-->

An example requirement where you may need to understand this term:

> Add a search field to the top of the page that queries the server API in real-time for results, and displays them in the grid.  

Woah, after every single keystroke, you want me to make an API call?

Usually, no, that's not what anyone wants, but it may not be clear.

What you need to do, is "debounce" the input.  If you add "debouncing" to the requirement, it may start to read like this:

> Add a search field to the top of the page that queries the server after the user hasn't typed anything for 1 second, queries the server API for results, and displays them in the grid.

At its essence, "debounce" (or the act of "debouncing") is simply to ignore performing any action until a specified time has passed AFTER the user has finished typing.

Here's an example.  Let's say we have a pet adoption website with a "breed" search field.  As a user, I come into the site and want to search for "Labrador".  Since I am certain of what I'm searching for, and can type it relatively quickly, I don't want you to search each letter as I type them.  Wait until I stop for 500 milliseconds / 1 second, etc.  

If I type "L" into the search box, and you immediately go off to search for any dog breed that contains the letter "L", you're going to make me wait and present results that I am not interested in.  Similar issue as I type "A", then you're off searching for any dog breed that contains the letters, "LA", and again, may not present what I want and have me waiting.  Simply wait until I type, "LAB", and I stop.  Then you can search for any dog breed that contains the letters, "LAB", which is going to (more than likely) get me the results I want, with only one search.  The time in which you wait AFTER the user stops is up for debate on your individual product / requirements, and must be balanced appropriately.  Normally, 500 milliseconds to 1 second is sufficient and doesn't result in the user waiting too long for the results.

I want you, dear reader, to know these words and the definitions for your journey - knowing how to implement a "debounce" will depend on your technology stack, but knowing what to search for when you need it?  Priceless.

And, finally, one thing to note, "debounce" is not the same as "throttle", which I'll get into in the next SDD entry.

I hope this helps, but please reach out if you need some extra guidance (publically or privately).
