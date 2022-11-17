---
title: "Storing Images in Azure Blog Storage with Ease"
categories: [azure, csharp, dotnet]
---

On a recent project, we had a need to integrate Azure blob storage with our web application (also hosted on Azure) to store images. What we found, is that it’s so easy!

Let’s take a look at what we had to do (and how LITTLE code we had to write) to successfully store our images ‘in the cloud’.

The first thing you’ll need to do is login to the management portal and create your storage account.  Then, create your container. I won’t go over how to accomplish these two steps, as they are fairly trivial
with plenty of walk-throughs out there already.

Now, to connect to your container, you’re going to need three pieces of information from the Azure website:

* AccountName – this is what you called the account when you initially set-up the storage account. Mine is called, ‘asdfasdfadsf’. Pretty memorable, huh?
* Container Name – this is just the name of the container you created in the second step. I called mine ‘blobs’.
* AccountKey – At the bottom of the management portal while looking at your storage account, there is an item called ‘Manage Keys’. Click it to open the dialog that will have your key. It will be a long string of random characters.

Aside from that, there is a connection string template that you’ll use the AccountName and the AccountKey in.  The format for that is as follows:
```
DefaultEndpointsProtocol=https;AccountName={ACCOUNT_NAME};AccountKey={ACCOUNT_KEY}
```

With this information in hand, we can switch over to Visual Studio while I describe the remainder of the process. Please note, I’ll be using Visual Studio 2012 for this, but you can also use 2010.

You can create any type of project you want, but I’ve wrapped up my Azure blob storage logic into a separate Class Library for easy reuse.

For this project, you’ll need to download two packages from NuGet:
* Windows Azure Configuration Manager
* Windows Azure Storage

Note that if you grab the Windows Azure Storage package first, it will download the other AS it directly depends on it. You can use the Package Manager console, with the following statement to install the packages:

```
install-package WindowsAzure.Storage
```

Once you have these packages in your project, add two using statements to the top of your class file.

```csharp
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
```

In my class, I’ve utilized the constructor, and four methods: Delete, Update, Create, and Get.

We need some class level variables to start with, so we’ll add:
```csharp
private readonly CloudStorageAccount _storageAccount;
private readonly CloudBlobContainer _container;
```

Now let’s move on to the constructor, which will utilize the private class level variables we declared above

```csharp
public AzureFileService() {
    try {
        _storageAccount = CloudStorageAccount.Parse("<CONNECTION STRING>");

        CloudBlobClient blobClient = _storageAccount.CreateCloudBlobClient();
        _container = blobClient.GetContainerReference("<CONTAINER NAME>");
        _container.CreateIfNotExist();
    } catch (Exception) { 
        
    }
}
```

Essentially, what this does, is connects us up to our container for our Azure Storage account. It the container doesn’t exist – it creates it. (Or will try to, sometimes that fails.) I recommend storing your connection string and container name off in a config file somewhere, and fleshing out the Catch block for proper error handling.

Moving on to the methods, we’ll start with the Create:

```csharp
public Guid Create(byte[] content) {
    Guid blobAddressUri = Guid.NewGuid();
    CloudBlob blob = _container.GetBlobReference(blobAddressUri.ToString());
    blob.UploadByteArray(content);
    
    return blobAddressUri;
}
```

Our method takes a byte array as a parameter, which, in our case, are the bytes of the image we want to store. Each ‘blob’ that gets stored in your container needs a unique name, declared as a string. For our purposes, we just used a GUID, which we store in a relational database table back in our applications database. Now, there are additional properties on the CloudBlob object, such as type, which you can set to various things, like, `application/octet-stream` OR `image/jpeg`. All of ours are images, so we opted to ignore this. Azure will assume, by default, that it is ‘application/octet-stream’ – but it doesn’t really matter in the end as long as you know what the correct type is. All of ours are images, so we left the default.

Guess what? That’s ALL the code there is to storing an image in Azure Storage!

For the sake of completeness, however, I’ll show you the other methods, which are actually shorter than the Create method.

The `Get` method is simple. Give it the name of the blob you want, and it’ll give you back a byte array:
```csharp
public byte[] Get(Guid id) {
    var blob = _container.GetBlobReference(id.ToString());
    return blob.DownloadByteArray();
}
```

For the `Delete` method, we again only need the name of the blob (a GUID IN our case), and call the Delete method on the blob object:
```csharp
public void Delete(Guid imageId) { 
    CloudBlob blob = _container.GetBlobReference(imageId.ToString());
    blob.Delete();
}
```

The `Update` method needs a couple of parameters to be successful. One thing it needs is the blob name of the item you want to update, plus the byte array of the new image. Granted, you could omit the `Update` statement, and rely on the `Delete` and `Create` commands, but we wanted were matching methods to HTTP verbs in a RESTful API.
```csharp
public void Update(Guid imageId, byte[] content) {
    CloudBlob blob = _container.GetBlobReference(imageId.ToString());
    blob.UploadByteArray(content);
}
```

That’s ALL the code I had to implement to make storing images in Azure Storage work. I was surprised at how little effort was required, and it makes me love Azure even more.

To be absolutely sure you have all the code correct, here is the entire class file:

```csharp
using System;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;

namespace AzureStorage {
    public class Blobs {
        private readonly CloudStorageAccount _storageAccount;
        private readonly CloudBlobContainer _container;
        
        public AzureFileService() {
            try {
                _storageAccount = CloudStorageAccount.Parse(<CONNECTION STRING>);
                CloudBlobClient blobClient = _storageAccount.CreateCloudBlobClient();
                _container = blobClient.GetContainerReference(<CONTAINER NAME>);
                _container.CreateIfNotExist();
            } catch (Exception) {

            }
        }
        
        public void Delete(Guid imageId) {
            CloudBlob blob = _container.GetBlobReference(imageId.ToString());
            blob.Delete();
        }
        
        public void Update(Guid imageId, byte[] content) {
            CloudBlob blob = _container.GetBlobReference(imageId.ToString());
            blob.UploadByteArray(content);
        }
        
        public Guid Create(byte[] content) {
            Guid blobAddressUri = Guid.NewGuid();
            CloudBlob blob = _container.GetBlobReference(blobAddressUri.ToString());
            blob.UploadByteArray(content);
            
            return blobAddressUri;
        }
        
        public byte[] Get(Guid id) {
            var blob = _container.GetBlobReference(id.ToString());
            
            return blob.DownloadByteArray();
        }
    }
}
```

All that beautiful functionality in less than 60 lines of code. I don’t know how you feel about it, but I think the Azure team is doing wonderful things.
