---
title: "The Software Developers' Dictionary - Boxing"
categories: [dictionary,sdd]
description: "Let's take a look at the definition, and some examples, of what 'Boxing' really means"
---

For our first dictionary entry, we're going to take a look at the term, "Boxing".

<!--more-->

Boxing can be described as the process of converting a value type (integer, decimal, char, etc.) to the `object` type, or to any interface type that the value type implements.

The act of "boxing" is implicit (it is possible to box explicitly as well, but not required), whereas the act of "unboxing" is explicit.

Take a look at the following example code that boxes the `unboxedInt` into the object `boxedInt`:

```csharp
int unboxedInt = Int32.Max;

object boxedInt = unboxedInt;
```

Boxing is a fairly expensive process, as a new object, `boxedInt`, is created on the stack, which then references a copy of the `unboxedInt` value on the heap (which allows for garbage collection).
