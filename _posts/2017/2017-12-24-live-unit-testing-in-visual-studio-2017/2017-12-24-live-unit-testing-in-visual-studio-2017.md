---
title: "Live Unit Testing in Visual Studio 2017"
categories: [testing, visualstudio]
---

Welcome to the Christmas Eve edition (December 24th, 2017) of of the inaugural [C# Advent Calendar](https://crosscuttingconcerns.com/The-First-C-Advent-Calendar)!  Please go and check out the other 23 *awesome* posts in the series.

I hope you enjoy this post / find something useful from it, and then go forth and have a very Merry Christmas!

## Live Unit Testing
You may be curious what "live unit testing" means, so let's dive into that a little bit.

"Live" unit testing is simply the automated execution of unit tests that may have been impacted by a code change, and provides the results of that test run
back into the IDE (in this case, Visual Studio) in *real time*.

There are products out there that have provided this mechanism for quite some time - most notably, [NCrunch](http://www.ncrunch.net/), which is a fantastic tool.

However, Microsoft has recently given us this capability directly inside the Visual Studio IDE, without the need for external tooling/extensions!

## Live Unit Testing in Visual Studio
Before we get too far, let me preface this with a few caveats:

1. You must be using Visual Studio 2017 *Enterprise* edition.
2. The feature is only supported for C# and Visual Basic projects (Full .NET Framework, or .NET Core)
3. Using one of three supported frameworks (of which a minimum version is required)

Since the first two bullets are pretty self-explanatory, let me provide some more information on #3.

The three supported frameworks, and their editions (**as of this writing**) are:

|Framework|Framework Minimum Version        |Adapter Minimum Version                        |
|---------|---------------------------------|-----------------------------------------------|
|MSTest   |MSTest.TestFramework 1.05.preview|MSTest.TestAdapter 1.1.4-preview               |
|NUnit    |NUnit 3.5.0                      |NUnit3TestAdapter 3.5.1                        |
|xUnit    |xUnit 1.9.2                      |xUnit.Runner.VisualStudio 2.2.0-beta3-build1187|

If you're using a different framework, or not currently using one of the specified versions of that framework - you're going to miss out on some sweet, sweet, testing.

To configure the Live Unit Testing feature, you can find the settings in `Tools | Options | Live Unit Testing`:

![Live Unit Testing Settings Dialog](lut-configuration.png)

The new Microsoft docs platform has a great entry describing each of the settings on this dialog, which you can find at [https://docs.microsoft.com/en-us/visualstudio/test/live-unit-testing](https://docs.microsoft.com/en-us/visualstudio/test/live-unit-testing)  

## Example Time!

In this first screenshot, I have a very simple extension setup to convert a string to a possible boolean.  However, take note of the blue lines to the left of each line of code.

![Code with no tests](code-with-no-tests.png)

The line tells us that it isn't covered by a corresponding unit test, so let's add one!

Here you can see a very (very) simple test checking our "true" condition of our extension
![Test is passing!](passing-test.png)

And, now that our test is executing, we can go back to our extension code, and see that Live Unit Testing is now marking the line of code as covered AND passing!
![Sweet Code Coverage](lut-shows-passing.png)

Clicking the green check-mark will show you the test names of tests that execute that line of code:
![Cool!](hover-to-show-passing-details.png)

If we introduce a test that fails (since a "false" string should return false), such as:
![Uh oh](failing-test.png)

Back over to our actual code, we'll now see which lines of code are failing during that test:
![Not good](lut-shows-failing.png)

And, clicking the red X will show you the test names of tests that are currently failing:
![Ah, that's the one](hover-to-show-failing-details.png)

## Summary
Testing your code is great, but seeing it happen in real-time is pretty darn sweet.  This feature is ever-evolving as well, as Microsoft has updated the feature a variety of times already since the initial release.  Keep up to date over at https://docs.microsoft.com/en-us/visualstudio/test/live-unit-testing (and for even more information that I didn't touch on - like test exclusions (an absolute necessity for integration tests))

Check out the [2017 C# Advent](https://crosscuttingconcerns.com/The-First-C-Advent-Calendar) post for links to other great content!

Thanks for reading!
