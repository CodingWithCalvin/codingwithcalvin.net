---
title: "Accessing Nested Project Items using PowerShell in a Nuget Package"
categories: [nuget, powershell]
redirect_from:
  - /archive/2013/02/16/accessing-nested-project-items-using-powershell-in-a-nuget-package
---

Recently a need arose to have a few project-level items added to a project via a NuGet package. While this was no big deal, we ran into an issue of having the items marked as `Copy if Newer` for the `Copy to Output Directory` action, and couldn’t manage to find a way to change these properties. 

After a bit of research, we determined that an `install.ps1` PowerShell script (as part of the NuGet package installation) could access the project items and set the properties of them.

A script was written to handle the three files added to the project:

```powershell
    param($installPath, $toolsPath, $package, $project)

    $file1 = $project.ProjectItems.Item(\"FolderItem.exe\")
    $file2 = $project.ProjectItems.Item(\"FolderItem.exe.config\")
    $file1.Properties.Item(\"CopyToOutputDirectory\").Value = [int]2
    $file2.Properties.Item(\"CopyToOutputDirectory\").Value = [int]2
```

Unfortunately, the script didn’t work. Why, you ask? Well, after some more digging, it turns out you can only access top-level items using the above syntax, so you have to chain the commands together to properly access the items:

```powershell
    param($installPath, $toolsPath, $package, $project)
    
    $file1 = $project.ProjectItems.Item(\"Folder\").ProjectItems.Item(\"Item.exe\")
    $file2 = $project.ProjectItems.Item(\"Folder\").ProjectItems.Item(\"Item.exe.config\")
    $file1.Properties.Item(\"CopyToOutputDirectory\").Value = [int]2
    $file2.Properties.Item(\"CopyToOutputDirectory\").Value = [int]2
```