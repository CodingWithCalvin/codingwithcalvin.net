---
title: "What's the Difference Anyway?! Class, Struct, Record, oh my!"
date: "2021-12-25T12:00:00-05:00"
categories: [dotnet,csharp]
description: "In this post, we'll talk briefly about the differences between a class, struct, and a record in C#."
subtitle: "Understanding C# type fundamentals!"
---

> This blog post is part of the 2021 C# Advent Calendar (the fifth year!). [Please check out all of the other awesome posts in this years C# Advent.](https://www.csadvent.christmas/)

You keep hearing about records in C# these days, and keep thinking to yourself, "how are those different from just a regular 'ole class?" or, "how is a record different from a struct?", or, "what the crap are these things anyway?"

Let's talk about `class` first, because that's probably what the majority of folx are familiar with.

First, some `class` highlights -

1. A `class` is a _reference type_ and an instance can be created by using the `new` operator or assign a compatible type.
2. When an object is created from the type, memory is allocated on the managed heap, and the variable contains a _reference_ to the instance of the type.
3. Classes support _inheritance_ from one base class (but that base class may inherit from another base class of its own, and so on).
4. Uses _reference equality_, which means two instances refer to the _same underlying object_.

Now, a simple example of a "person" class.  It has two auto-implemented readonly properties, and an overridden ToString method to formulate a "full name" -

```csharp
using System;

public class Person
{
    public string FirstName { get; }
    public string LastName { get; }

    public Person(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName
    }
}
```

Now that your type is defined, you can create an instance of it -

```csharp
using System;

public class Program
{
    public static void Main()
    {
        var person1 = new Person("Calvin", "Allen");
        Console.WriteLine(person1.FirstName);
        Console.WriteLine(person1.LastName);
    }
}
```

Now let's talk about the `struct`.  A `struct` looks very similar to a `class`, but instead of being a _reference type_, a `struct` is considered a _value type_.  Struct types are typically used for small, data-centric types that provide little to NO behavior.  If behavior is important, then consider using a `class` instead.

Highlights!

1. A `struct` is a _value type_ and an instance can be created by using the `new` operator or assign a compatible type.
2. When an object is created from the type, the variable contains an instance of the type (no memory is allocated on the managed heap).
3. Structs implicitly inherit from `System.ValueType` (which inherit from `object`), but you can not have them inherit from your own base object (they can implement interfaces, however).
4. Uses _value equality_, which means two objects share the same type, and contain the same value or values.

Since my previous example doesn't have any behavior, let's design it as a `struct` instead of a `class`

```csharp
using System;

public struct Person
{
    public string FirstName { get; }
    public string LastName { get; }

    public Person(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName
    }
}
```

Now that your type is defined, you can create an instance of it -

```csharp
using System;

public class Program
{
    public static void Main()
    {
        var person1 = new Person("Calvin", "Allen");
        Console.WriteLine(person1.FirstName);
        Console.WriteLine(person1.LastName);
    }
}
```

The *ONLY* difference between the two examples is the declaration, and changing `public class Person` to `public struct Person`.  

In my experience, most folx / companies use `class` more often than not, and the `struct` type is usually non-existant in the codebase.  Having said that, your mileage may definitely vary depending on the type of application you're building.

What about those new `record` types (introduced in C# 9, and enhanced again in C# 10 - I'm using C# 10 conventions in this post)?  Well, they're a lot like everything else we've seen so far - in fact, a `record` is really a `class` or `struct` "under the hood", that just provides special syntax and behavior.

Let's look at some highlights / differences between the other two first -

1. A `record class` is a _reference type_, and a `record struct` is a _value type_. An instance can be created by using the `new` operator or assign a compatible type.
2. Using `positional parameters` in a `record class` creates immutable properties.  However, in a `record struct`, those same `positional parameters` would be entirely mutable.  You can work around that by declaring your `record struct` as a `readonly record struct`.
3. A `record class` can inherit from another record, but not from a class.  Likewise, a class can't inherit from a record.  A `record struct` does not allow for inheritance like a traditional `struct`.
4. Both `record class` and `record struct` use _value equality_, which means two objects must share the same type, and contain the same value or values.

Now, let's look at an example (using `positional parameters`)-

```csharp
using System;

public record Person(string FirstName, string LastName);
```

Now that your type is defined, you can create an instance of it -

```csharp
using System;

public class Program
{
    public static void Main()
    {
        var person1 = new Person("Calvin", "Allen");
        Console.WriteLine(person1.FirstName);
        Console.WriteLine(person1.LastName);
    }
}
```

Can you use a `record` instead of a `class`?  Maybe.  
Can you use a `struct` instead of a `record`? Maybe.
Can you use a `class` instead of a `struct`? Maybe.

The answer depends on the style you and your team utilize.  
The answer depends on the version of C# you're currently able to target.  
The answer depends on how you feel about immutability.

And, since a lot of C#'ers also use Entity Framework, you cannot use a `struct`, `record class`, or `record struct` for your entities, since Entity Framework depends on _reference equality_, and these types utilize _value equality_.

Hopefully, though, after seeing some of the similarities and some of the differences, you have a better idea of when you can use one over the other.

I try not to "prescribe" specific solutions to you here, but simply provide enough data to help you make informed decisions.  And, to be honest, there are more similarities and more differences the deeper you go - but I'll leave that learning exercise to you :)

* [Class](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/class)
* [Struct](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/struct)
* [Records](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/record)

Thank you, dear reader, for following along on this years C# Advent.  I sincerely hope you have a great holiday (whichever one you observe), a great New Year, and a fantastic 2022.
