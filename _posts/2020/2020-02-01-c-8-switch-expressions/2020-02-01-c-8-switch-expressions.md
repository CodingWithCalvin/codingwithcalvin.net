---
title: "C# 8.0 - Switch Expressions"
categories: [csharp,dotnet]
description: "Switch 'expressions' are a more concise version of a switch 'statement' that was released in C# 8.0.  Let's take a look!"
youtube: "https://www.youtube.com/embed/yLJl4bJtoMQ"
---

In C# 8.0, a new form of "switch" was introduced.  While similar, you'll find that this new "switch expression" is more concise than it's "switch statement" counterpart as it does not require all the various keywords (`case`, `break`, `default`, etc.).

Take this, albeit a contrived, example, starting with this enum of car makes in our pretend application:

```csharp
public enum CarMake
{
    Chevrolet,
    Ford,
    Dodge,
    Tesla
}
```

With that enum, we can create a specific "car manufacturing service".  Before C# 8.0, that would have looked something like this:

```csharp
public ICarService CarMakeFactory(CarMake make)
{
    switch (make)
    {
        case CarMake.Chevrolet:
            return new ChevroletService();
        case CarMake.Ford:
            return new FordService();
        case CarMake.Dodge:
            return new DodgeService();
        case CarMake.Tesla:
            return new TeslaService();
        default:
            throw new ArgumentException(message: "Invalid value for CarMake", paramName: nameof(make));    
    }
}
```

In C# 8.0, we can make this a little more concise, and, in my opinion, easier to read:

```csharp
public ICarService CarMakeFactory(CarMake make)
{
    return make switch
    {
        CarMake.Chevrolet   => new ChevroletService(),
        CarMake.Ford        => new FordService(),
        CarMake.Dodge       => new DodgeService(),
        CarMake.Tesla       => new TeslaService(),
        _                   => throw new ArgumentException(message: "Invalid value for CarMake", paramName: nameof(make))
    };
}
```

This new expression has a few syntax improvements, such as:

1. The variable comes BEFORE the `switch` keyword.  This is a sure sign you're looking at an expression, instead of the statement.
2. The `case` and `:` are gone, in favor of `=>`, which is more intuitive.
3. The discard variable, `_`, replaces the `default` case we're used to seeing.
4. Finally, the bodies are expressions themselves, instead of statements.

Let me know what you think about this new (and improved!) way of writing switch ~~stateme~~...expressions in the comments!

---

> This post, "C# 8.0 - Switch Expressions", first appeared at [https://www.codingwithcalvin.net/c-8-switch-expressions](https://www.codingwithcalvin.net/c-8-switch-expressions)
