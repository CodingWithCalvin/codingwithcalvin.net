---
title: "Creating a default Fiddler rule for Localhost traffic only"
categories: [programming, fiddler]
---

Fiddler is a fantastic tool for assisting in debugging HTTP request/responses.

However, god forbid you try to scan the activity list for a specific request when other applications are constantly making outbound HTTP/S calls.  Within a matter of seconds, the result view is chock full of crap.

I toyed around with the "custom rules" in Fiddler before, but lost them somewhere along the way - upgrades, new machines, etc.

Today, I decided to finally tackle it again.  However, I wanted to add the rule as an option in the menu that is enabled by default, so that as soon as I launch Fiddler, it is automatically filtering the request output.

Start by launching Fiddler, and going to ```Rules | Customize Rules``` in the menu bar.

This will launch the Fiddler ScriptEditor.

Inside of the ```Handlers``` class, add the following code, which sets up a new menu item under "Rules", called "Show Localhost Only", with a default of true:

```csharp
public static RulesOption("Show Localhost Only")
var m_ShowLocalhostOnly: boolean = true;
```

Now, scroll down until you find the ```OnBeforeRequest``` method.  Looks like this:

```csharp
static function OnBeforeRequest(oSession: Session) {        
```

Inside of that method, add the following conditional:

```csharp
if (m_ShowLocalhostOnly && oSession.host.indexOf("localhost.com") == -1) {
	oSession["ui-hide"] = "true";
} 
```

Locally, when I'm developing, I have hostnames setup for all of my sites using localhost.com as the TLD.  If you utilize something a little different, just modify the ```indexOf``` method inside of the if block.

Now, when I launch Fiddler, all of my requests are filtered out, by default, except for entries to *.localhost.com (Except for the Fiddler update check, because apparently that happens before the rule gets applied).

And, if I *need* to look at the other crap being logged, I can just toggle the menu item and turn it off for the duration of that Fiddler session.
