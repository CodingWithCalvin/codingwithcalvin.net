---
title: "Remove DRM From Google Play Music"
categories: [python, drm, google]
---

I purchase all of my music through Google Play, and I primarily use their web application to listen to it. As a precaution, I also use the Music Manager application to keep a local backup of all of this music on my NAS.

Recently, I wanted to switch to a new Google Account because I was changing primary email addresses. Before doing this, I made sure the music manager had downloaded any purchased music to my NAS because I will be deleting the old Google Account permanently.

Once I had verified the music had been downloaded, I logged out in the Music Manager application, and logged in under my new account. At this point, I had to wait for ALL of my music to be re-uploaded to Google’s servers.

After the music had uploaded, there were 17 songs that could not be uploaded because I had purchased them under a different account. (Apparently not of all the music contains DRM?)

You can see the error in the troubleshooter – 
> “Song was purchased with another Google Play account”

A little digging led me understand that Google hides their DRM in a hidden ID3 tag that is not easily removable by conventional means. This digging, however, also led me to a Python utility that could do it – and so, into the world of Python.

First, I had to install Python, which was dead easy – [https://www.python.org/downloads/](https://www.python.org/downloads/)
*Note: I am on a Windows machine, and the utility I will show you apparently requires version 2.7 of Python, so get that one :)

During the installation, I let the installer add `python.exe` to my PATH variable.

Once the installation was complete, I launched a command prompt and installed ‘eyeD3‘ using pip:
```
eyeD3-install
```

Now, navigate to your music directory (mine is on my NAS, mapped to my computer as “M:”)
```
cd /d M:
```

Execute one simple command, and let it run (depending on how much music you have, it could take a while)
```
python -m eyed3.main --remove-frame PRIV ./
```

You should now see a lot of text flowing through your console output. That’s eyeD3 doing its thing. Let it run. Go grab a snack.

Once completed, the Google Music Manager picked up on the fact that the files had changed on disk, and started to re-upload them – without error I might add!
