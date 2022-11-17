---
title: "My Blogging Process - Part 1"
categories: [meta,blogging]
description: "Somewhat of a 'meta' post, but here's how I get new blog posts into the world!"
---

After a conversation about "how we blog" in a Slack channel I'm part of, I decided it may be best to just blog it.  Nothing more meta than blogging about your blog, right?

My entire blogging process encompasses a variety of technologies:

1. [Jekyll](https://www.jekyllrb.com)
2. [GitHub](https://github.com)
3. [Netlify](https://www.netlify.com)
4. Microsoft Power Automate (previously "Flow")
5. Azure Functions
6. Azure CosmosDB
7. Rebrandly

I'm going to split this into two posts given the length of the list above, so in this post, we'll only be covering items 1-3.

## The Technology Stack

### [Jekyll](https://www.jekyllrb.com)

It all starts with [Jekyll, a static site generator written in Ruby](https://www.jekyllrb.com).  For the most part, its a basic Jekyll site, but I do have two custom plugins associated with it that do some "magic".  I also don't post pages that have future dates, which allows me to stage articles and push them to the repository ahead of time (yes, they would be visible in the repo, just not live on the site - I'm okay with that).

Let's talk about the plugins.

#### [./_plugins/file_exists.rb](https://github.com/CalvinAllen/codingwithcalvin.net/blob/master/_plugins/file_exists.rb)

This plugin gives me a [custom liquid tag](https://jekyllrb.com/docs/liquid/tags/) I can use in my templates to see if a given file exists on disk.  I use this for "cover image" on posts.  The general idea being, for a given post, I can add a `cover.jpg` file alongside the post, and it gets used in social media cards.  If the file doesn't exist, I fall back to a generic image (my headshot), so I will *always* have a cover image - just maybe not a custom one for the post.

I use it, like so, in my [atom.xml](https://github.com/CalvinAllen/codingwithcalvin.net/blob/master/atom.xml) file:

{% raw %}
```xml
{% assign cover_image = post.path | prepend: '/' | prepend: site.source %}
{% capture cover_image_exists %}{% cover_exists {{ cover_image }} %}{% endcapture %}

{% if post.image and cover_image_exists == "true" %}
    <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="{{ site.url }}{{ post.url }}{{ post.image }}" />
{% else %}
    <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="{{ site.url }}/images/social/headshot.jpg" />
{% endif %}
```
{% endraw %}

and like this, in the [head.html](https://github.com/CalvinAllen/codingwithcalvin.net/blob/master/_includes/head.html) file (which gets applied to every single page of the site, not just the posts themselves):

{% raw %}
```xml
{% assign cover_image = page.path | prepend: '/' | prepend: site.source %}
{% capture cover_image_exists %}{% cover_exists {{ cover_image }} %}{% endcapture %}

{% if page.image and cover_image_exists == "true" %}
    <meta property="og:image" content="{{ site.url }}{{ page.url }}{{ page.image }}" />
{% else %}
    <meta property="og:image" content="{{ site.url }}/images/social/headshot.jpg" />
{% endif %}
```
{% endraw %}

#### [./_plugins/postfiles.rb](https://github.com/CalvinAllen/codingwithcalvin.net/blob/master/_plugins/postfiles.rb)

This one is a little more involved, but the gist is this:

When I add a new post to my blog, I create a folder with a specific naming convention in a folder that designates the year:
> `/_posts/2020/2020-01-21-my-blogging-process/`

Inside of that folder goes the post file itself, with the same name as the folder:
> `/_posts/2020/2020-01-21-my-blogging-process/2020-01-21-my-blogging-process.md`

When I want to add a custom cover image to a specific post, that folder is where I would drop the `cover.jpg`, so you end up with:

> `/_posts/2020/2020-01-21-my-blogging-process/`  
> `-    2020-01-21-my-blogging-process.md`  
> `-    cover.jpg`

This plugin, `postfiles.rb`, handles moving that `cover.jpg` from the `_posts` staging folder to the REAL FOLDER when the site is compiled.  By default, in Jekyll, that operation would not work, unfortunately.  This allows me to place any screenshots related to a specific post into that same directory as the post, and not in some generic location at the root of the site, like, `codingwithcalvin.net/images/`, which takes more effort to maintain, in my opinion.

Now, you might say, "but creating all those folders and files is annoying", and you'd be right.  That's why I have a rake task in the repo that asks me a couple of questions, and then creates the folder, markdown file, and then launches it in my editor ([Visual Studio Code](https://code.visualstudio.com)).  The only "manual" step after that is dropping in a `cover.jpg` file, if necessary

### [GitHub](https://www.github.com/CalvinAllen/codingwithcalvin.net)

Every bit of my site is git-controlled on GitHub, and is completely "open source".  I have an `edit` link configured on each post that allows a viewer to create a quick edit and pull request on GitHub if they were to see a problem with a post and wanted to suggest the fix.  Now, even though I use Jekyll, I am NOT using "[GitHub Pages](https://pages.github.com/)", [because they do not support the custom/unsupported plugins](https://help.github.com/en/github/working-with-github-pages/about-github-pages-and-jekyll#plugins), which I have / use (mentioned in the previous section).  And, because of that, we go into the hosting section with Netlify.

### [Netlify](https://www.netlify.com)

[Netlify](https://www.netlify.com) offers free building and hosting, plus TLS certificates from [Let's Encrypt](https://www.letsencrypt.org) (AND AUTO RENEWALS!), and it all gets triggered when I push to the `master` branch of my sites repository (mentioned above).

## Conclusion

That sums up the basic workflow I have of "adding a new post" and getting it deployed.  Items 4-7 are all about getting that new post "socialized", and we'll discuss all of those, coming up in Part 2.
