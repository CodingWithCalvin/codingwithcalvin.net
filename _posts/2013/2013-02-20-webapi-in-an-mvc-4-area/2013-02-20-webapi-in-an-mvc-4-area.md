---
title: "WebAPI in an MVC 4 Area"
categories: [dotnet, csharp, webapi, mvc]
---

Alright, you have your MVC 4 website up and running, and you realize you need to add some WebAPI support – not necessarily for the website, but potential external consumers. Your site is configured using Areas for everything, so you decide it would be best to put the WebAPI layer in an Area as well. Makes sense, right? Right. You quickly find out that it isn’t just as simple as right-clicking, add new area, name it API, pat self on back, etc. That’s where this trick comes in.

Now, by default in an MVC 4 project, your `Global.asax` file calls out to another class to configure WebAPI. It will look something like this:

```csharp
WebApiConfig.Register(GlobalConfiguration.Configuration);
```

Guess what? Comment that line out. The file this utilizes is in the App_Start directory, aptly named `WebApiConfig.cs`. You can leave it, or delete it. You’re call.

Now, head over to your area, we need to make some routing changes.

Look for `APIAreaRegistration.cs` and open it up.

Bring in another namespace:

```csharp
using System.Web.Http;
```

Now, you see that route down below? It needs two minor tweaks to work with WebAPI. Basically, change the method call from:

```csharp
    context.MapRoute(
        "API_default",
        "API/{controller}/{action}/{id}",
        new { action = "Index", id = UrlParameter.Optional }
    );
```            
to

```csharp
    context.Routes.MapHttpRoute(
        "API_default",
        "API/{controller}/{id}",
        new { id = UrlParameter.Optional }
    );
```
In a nutshell, we changed the route to register an `HttpRoute`, and got rid of the `{action}` part of the route.

Boom. You’re done.

Keep in mind that this is THE WebAPI layer for your application – with the changes we’ve made, you can’t have any other WebAPI controllers outside of your area. If you find you need the ability for the Area and others, there are a couple methods that others have posted to make it work. I didn’t need anything like that, so this worked well for me.
