---
title: "Uploading Files with HttpClient in .NET 6"
date: "2022-04-12T12:00:00-05:00"
categories: [dotnet,csharp,httpclient]
description: "I recently needed to figure out a way to send files to a third-party 'document manager' system using `HttpClient` in .NET 6.0. This 'document manager' system already had an API for uploading files, which we had previously gotten working in our teams Postman collection."
---

### The Problem

I recently needed to figure out a way to send files to a third-party "document manager" system using `HttpClient` in .NET 6.0. This "document manager" system already had an API for uploading files, which we had previously gotten working in our teams Postman collection.

Before we dive in, there are two interesting things to note about our requirements / use case -

* The files I needed to upload, were being uploaded to our system first (we were essentially a pass-through)
* Each file that we uploaded to the document manager needed a SECOND file that included necessary meta-data about the original file.

In Postman, you can view the code a particular request would generate, in a variety of languages and frameworks. However, it currently only offers C# with `RestSharp`, and we're doing everything natively with `HttpClient`.  It gave me a starting point, at the very least- since I knew if `RestSharp` could do it - it must be possible, right?

After digging around in the `RestSharp` source and finding a couple other blogs that were doing something very similar ([https://makolyte.com/csharp-how-to-send-a-file-with-httpclient](https://makolyte.com/csharp-how-to-send-a-file-with-httpclient)), I was able to piece together a solution. Luckily, since we were already taking in an `IFormFile` into our controller action, it ended up being fairly straightforward to "forward" that file on to the third-party document manager.

### The Solution Steps

First, to upload a file with `HttpClient`, we need to create the necessary content for the request. In this case, we need a `MultipartFormDataContent` (`System.Net.Http`), add some `StreamContent`, and add to the form content -

```csharp
public async Task<IActionResult> Upload(IFormFile file) 
{
    var content = new MultipartFormDataContent();
    var fileContent = new StreamContent(file.OpenReadStream());
    fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(file.ContentType);
  
    content.Add(fileContent, "file", file.FileName);
}
```

Since we're working with an `IFormFile` already, we're able to harness all the properties off of that to create the necessary content we need for our Http request.<

This worked fine and dandy, but remember I mentioned that we need another file to go along with it (in JSON format) that describes the metadata. Luckily, we're already able to deduce the metadata from this specific upload page, so we'll reuse some of that to create a new "file" -

Let's start from the point of having the proper JSON in memory and go from there -

```json
{
    "key": "newFile",
    "metadata": [
        {
            "name": "uploaded-by",
            "value": "user123"
        },
        {
            "name": "document-type",
            "value": "work-order"
        }
    ]
}
```

Now, with that JSON in mind, let's assign it to a string variable and create this secondary payload (adding to our first block of code) -

```csharp
public async Task<IActionResult> Upload(IFormFile file) 
{
    var content = new MultipartFormDataContent();
    var fileContent = new StreamContent(file.OpenReadStream());
    fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(file.ContentType);
  
    content.Add(fileContent, "file", file.FileName);
  
    var jsonPayload = "that payload from the above sample";
    var jsonBytes = Encoding.UTF8.GetBytes(jsonPayload);
    var jsonContent = new StreamContent(new MemoryStream(jsonBytes));
    jsonContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
  
    content.Add(jsonContent, "metadata", "metadata.json");
}
```

It should be noted that our use of the strings, `"file"` and `"metadata"` are the property names that the third-party API requires the files to be called as we make the request. Those could theoretically be anything, but any proper API documentation should tell you. Each "file" needs a "filename", and as you can see - we use the `file.FileName` property for the "actual" file, and then hard-code `"metadata.json"` for the secondary file because it doesn't have a real name - and its somewhat irrelevant to the API we're calling - it just "has to be there".

At this point, you can make your `POST` request to the API, and send along `content`!

```csharp
public async Task<IActionResult> Upload(IFormFile file, CancellationToken cancellationToken) 
{
    var content = new MultipartFormDataContent();
    var fileContent = new StreamContent(file.OpenReadStream());
    fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(file.ContentType);
  
    content.Add(fileContent, "file", file.FileName);
  
    var jsonPayload = "that payload from the above sample";
    var jsonBytes = Encoding.UTF8.GetBytes(jsonPayload);
    var jsonContent = new StreamContent(new MemoryStream(jsonBytes));
    jsonContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
  
    content.Add(jsonContent, "metadata", "metadata.json");
  
    var response = await _httpClient.PostAsync("<The API URI>", content, cancellationToken);
  
    return Ok();
}
```

Of course, you'll want to do "something" with `response` to make sure your request was successful and maybe let the user know as well 😊.

### Summary

And that, friends, is how you upload TWO files to a third-party API using `HttpClient`, when one of those files is being uploaded by a user of your web application and the other is (at the very least) able to be created in-memory as needed!

The code samples above are "fairly" close to production ready but [be sure to utilize `HttpClient` properly](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests) and mind your `using` statements on those disposable objects!
