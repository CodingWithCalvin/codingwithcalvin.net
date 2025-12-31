---
title: "Clean Coding in C# - Part I"
date: "2020-04-30T09:13:31-04:00"
categories: [csharp,dotnet]
description: "The first post in a new series about what I consider to be 'clean code' (using C#, of course). In this one, let's take a look at conditionals (if/else statements)"
---

One thing I've learned over the years is that being clever with your code is a waste of time and energy.  The simpler, the better.  Part of being "simpler", to me, falls into the paradigm of "clean code".  But - what does "clean code" actually mean?  In this post, we'll look at what I consider to be a "clean(er)" conditional statement that reduces cognitive complexity/overhead.

For example, consider a "simple" authorization check (contrived, of course):

```csharp
if(_authorizationService.HasClaim(Claims.Admin) || (_authorizationService.HasClaim(Claims.User) && _authorizationService.HasClaim(Claims.ModifyTimesheet))){
    // do something
}
```

That `if` statement is getting kinda hairy, huh?  Take into consideration new folks joining your team trying to make heads or tails of that, too.

Yes, within a few seconds we gleam that if your an Admin or a User that also has the ModifyTimesheet permission, you should be allowed to `//do something`, but what if we just gave those "things" actual names?

Consider this refactor:

```csharp
bool isAdmin = _authorizationService.HasClaim(Claims.Admin);
bool userHasPermission = _authorizationService.HasClaim(Claims.User) && _authorizationService.HasClaim(Claims.ModifyTimesheet);

if(isAdmin || userHasPermission){
    // do something
}
```

You can see we've introduced a couple of variables with very explicit names that we've swapped into the `if` statement.  Now when you scan that code and come across that `if` statement, you don't have to read into the logic to understand the condition that needs met.  If you *do care* about what those two things are, then you can easily scan up to the variable declarations and "dig in" a little more.

Happy clean coding, dear reader!
