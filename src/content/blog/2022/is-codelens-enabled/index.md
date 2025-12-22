---
title: "Is CodeLens Enabled?"
date: "2022-06-08T12:20:36-05:00"
categories: [csharp, dotnet, extensibility]
description: "What this did, however, is gave us cause for figuring out if CodeLens is enabled in Visual Studio at all (our provider doesn't do much good if everything is disabled)."
image: ./cover.png
---

In the CodeStream extension for Visual Studio, we recently added our own CodeLens provider ([I blogged a little about THAT problem in another post](https://www.codingwithcalvin.net/extending-visual-studio-codelens-functionality/)) that provides information from New Relics observability platform / agents. The idea being that you could see at the method level, what the average duration, throughput, or errors, have been recorded over a certain timeframe. More on that that some other time 😊.

What this did, however, is gave us cause for figuring out if CodeLens is enabled in Visual Studio at all (our provider doesn't do much good if everything is disabled).

The questions are / become -

- Is CodeLens Enabled?
- Is our custom CodeLens provider enabled?

If either of them is "false", then we can provide some markup in the extension to explain how to turn it on, etc. I.e., "if you want to use this feature, you must turn on "this" and "that". Go to "this settings page to enable", etc.

Okay, so problem explained. Now, how do we solve it?

Well, turns out there is some magic (of course, it is Visual Studio extensibility!), but also not extremely difficult to get working either.

I'm not going to go into great detail about the service provider, MEF, or COM, but if you're doing any kind of VS extensibility, you're probably somewhat familiar with this.

First, I created a new interface and service, because DI / IOC / MEF / etc. -

```csharp
public interface IVsSettings
{
    bool IsCodeLevelMetricsEnabled();
    bool IsCodeLensEnabled();
}

[Export(typeof(IVsSettings))]
[PartCreationPolicy(CreationPolicy.Shared)]
public class VsSettings : IVsSettings
{
    private readonly ISettingsManager _roamingSettingsManager;

    [ImportingConstructor]
    public VsSettings([Import(typeof(SVsServiceProvider))] IServiceProvider serviceProvider)
    {
        _roamingSettingsManager = serviceProvider.GetService(typeof(SVsSettingsPersistenceManager)) as ISettingsManager;
    }
}
```

We need to inject the service provider here, so that we can resolve the settings manager - and here is why - the type `SVsSettingsPersistenceManager` is in an internal assembly that we can't access without declaring our own "version" of it.

Adding to our definitions above, we now have this -

```csharp
public interface IVsSettings
{
    bool IsCodeLevelMetricsEnabled();
    bool IsCodeLensEnabled();
}

[Export(typeof(IVsSettings))]
[PartCreationPolicy(CreationPolicy.Shared)]
public class VsSettings : IVsSettings
{
    private readonly ISettingsManager _settingsManager;

    //      THIS PART HERE
    [Guid("9B164E40-C3A2-4363-9BC5-EB4039DEF653")]
    private class SVsSettingsPersistenceManager { }

    [ImportingConstructor]
    public VsSettings([Import(typeof(SVsServiceProvider))] IServiceProvider serviceProvider)
    {
        _settingsManager = serviceProvider.GetService(typeof(SVsSettingsPersistenceManager)) as ISettingsManager;
    }
}
```

Now, I can't really explain how / what / why that's needed - or what that GUID even matches to, honestly. I was led into this solution by [reading the source for the `Settings Store Explorer`](https://github.com/pharring/SettingsStoreExplorer) extension - which is a FANTASTIC extension for figuring out all the settings and their values for Visual Studio.

Once that's done, I added a (generic) method to obtain a setting from the store -

```csharp
public interface IVsSettings
{
    bool IsCodeLevelMetricsEnabled();
    bool IsCodeLensEnabled();
}

[Export(typeof(IVsSettings))]
[PartCreationPolicy(CreationPolicy.Shared)]
public class VsSettings : IVsSettings
{
    private readonly ISettingsManager _settingsManager;

    [Guid("9B164E40-C3A2-4363-9BC5-EB4039DEF653")]
    private class SVsSettingsPersistenceManager { }

    [ImportingConstructor]
    public VsSettings([Import(typeof(SVsServiceProvider))] IServiceProvider serviceProvider)
    {
        _settingsManager = serviceProvider.GetService(typeof(SVsSettingsPersistenceManager)) as ISettingsManager;
    }

    //     THIS PART
    public T GetSetting<T>(string settingPath)
    {
        return _settingsManager.TryGetValue(settingPath, out T value); // could throw an exception
    }
}
```

Now you can inject an `IVsSettings` into some other class / service, and utilize it like so -

```csharp
[ImportingConstructor]
public SomeOtherService(IVsSettings vsSettings)
{
    var isCodeLensEnabled = vsSettings.GetSetting<bool>("TextEditorGlobalOptions.IsCodeLensEnabled");
    var disabledCodeLensProviders = vsSettings.GetSetting<string[]>("TextEditorGlobalOptions.CodeLensDisabledProviders");
}
```

---

If you made it this far, thank you! I hope you enjoyed or learned something from the various trials and tribulations I’ve been through over the past week trying to get this working.

Until next time, friends!
