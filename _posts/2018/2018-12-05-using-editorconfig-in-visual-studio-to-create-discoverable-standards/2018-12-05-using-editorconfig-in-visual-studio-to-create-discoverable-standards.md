---
title: "Using .editorconfig in Visual Studio to create discoverable standards"
categories: [dotnet, csharp, visualstudio, csadvent]
description: "Using .editorconfig in Visual Studio to create discoverable standards"
---

> My contribution to this year's CSAdvent, hosted by my buddy Matt Groves, is all about trying to surface your coding and naming standards right in Visual Studio.  Visit [https://crosscuttingconcerns.com/The-Second-Annual-C-Advent](https://crosscuttingconcerns.com/The-Second-Annual-C-Advent) to see the full calendar of posts!

Starting in Visual Studio 2017, we have the option of using an ".editorconfig" file to define tons of editor standards - from basic things, such as "Tabs versus Spaces":

```
[*.{cs,vb}]
indent_style = tab //TABS RULE
indent_size = 4
```
to more advanced items like, "prefer curly braces to surround code blocks" (with an associated severity)
```
[*.cs]
csharp_prefer_braces = true:none //"PREFER" them, but don't highlight the code in the editor
```

Backing up a bit, the .editorconfig file/format is [an open standard](https://editorconfig.org/) that Microsoft has adopted as a first class citizen in Visual Studio.  The open standard doesn't define specific coding styles/standards (like we see above with `csharp_prefer_braces`), so those only apply to plugins or tools that know about them (i.e., Visual Studio - and I would expect, eventually, VSCode as well)

The greatest part about this, to me, is the ability to define various standards and what severity to surface them, all __without third-party tooling__ (such as ReSharper).

I am able to define this rules in a plain-text file, and simply check it into my repository.

There are tons of rules you can apply, such as `csharp_prefer_braces`, to specifying the exact order you prefer your modifiers in:

```
# CSharp and Visual Basic code style settings:
[*.{cs,vb}]
dotnet_style_require_accessibility_modifiers = always:suggestion

# CSharp code style settings:
[*.cs]
csharp_preferred_modifier_order = public,private,protected,internal,static,extern,new,virtual,abstract,sealed,override,readonly,unsafe,volatile,async:suggestion

# Visual Basic code style settings:
[*.vb]
visual_basic_preferred_modifier_order = Partial,Default,Private,Protected,Public,Friend,NotOverridable,Overridable,MustOverride,Overloads,Overrides,MustInherit,NotInheritable,Static,Shared,Shadows,ReadOnly,WriteOnly,Dim,Const,WithEvents,Widening,Narrowing,Custom,Async:suggestion
```
And, as you can see, VB.NET is also supported.  The rule name itself indicates the targeting:
```
dotnet_*
csharp_*
visual_basic_*
```

You might be thinking, "That's great, Calvin, but how does that make them any more discoverable?".  Wonderful question.  The "discoverability", lies in the severity ratings that most (not all) of the rules can accept:


| Severity | Description |
|----------|-------------|
|none|Does not show anything to the user when the rule is violated.  Rules with this severity never appear in the Quick Actions or Refactoring menus.|
|silent/refactoring|Does not showing anything to the user when the rule is violated, however, these rules will show up in the Quick Actions or Refactoring menus.|
|suggestion|When this style rule is violated, show as gray dots under the first two characters.|
|warning|When this style rule is violated, show it to the user as a compiler warning|
|error|When this style rules is violated, show it to the user as a compiler error|

As you can see, picking the proper severity will help surface these rules to your developers, right inside the IDE.

I have started leaning towards the warning severity, as the suggestion style is difficult to see (in my opinion).

We've only discussed stylistic standards up to this point, but what about your good 'ole fashion naming standards?  We need that private variable to start with an underscore, no exceptions!  Well, you can do that, too!

Granted, naming standards get a little more involved, so let's look at an example.

Here is an example that defines that all Local Functions are named using PascalCase:

```
[*.{cs,vb}]
dotnet_naming_rule.local_functions_should_be_pascal_case.severity = suggestion
dotnet_naming_rule.local_functions_should_be_pascal_case.symbols = local_functions
dotnet_naming_rule.local_functions_should_be_pascal_case.style = local_function_style

dotnet_naming_symbols.local_functions.applicable_kinds = local_function

dotnet_naming_style.local_function_style.capitalization = pascal_case
```

This block defines a variety of things, but ultimately says that any "local_function" (applicable kinds) is "suggested" (severity) to be in "pascal_case" (capitalization).  

These types of rules are a little more difficult to wrap your head around, so I suggest looking over [the Visual Studio documentation](https://docs.microsoft.com/en-us/visualstudio/ide/editorconfig-naming-conventions?view=vs-2017) to get a better understanding.

If you have any questions or comments, feel free to leave them below, and I'll try to help in any way I can!
