---
title: "Real-Time UI Updates with Postgres and SignalR"
date: "2021-05-16T15:19:28-04:00"
categories: [postgres,signalr,dotnet]
description: "In this post, I'll discuss how I sent new database records to the UI with Postgres and SignalR."
image: ./cover.png
---

In one of my web applications at work, we provide a (Google) map and then set markers at various GPS coordinates.  

Those GPS coordinates are obtained through third-party vendor APIs on a schedule, and the results are stored in our database.  Since the webpage that shows this map and markers can be opened for an extended period of time, its possible that we will receive new GPS coordinates that never get presented on the page, unless the user refreshes.

Naturally, it was only a matter of time before the question came in - "can we automatically update those map pins when we get new data"?  

By combining some features of Postgres, background workers, and SignalR, we were able to accomplish the request.  I won't go into excruciating detail, instead let's consider this the "thirty-thousand foot view".

First, I created a new .NET 5 web project to host the SignalR bits.  I needed to do this because our web project was still running .NET Core 2.1, and SignalR wasn't compatible with that version.  This new web project is, more or less, a bare bones MVC application.  In our `Startup.cs` class, we map our SignalR Hubs as usual / per documentation.  

```csharp
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<GpsHub>("/signalr/endpoint");
}
```

Each hub handles registration from the client, and adding the connection to groups based on the data that person is allowed to access.  That's all the hub does.

Now that we have our project and our hub(s), we need to be able to send new data to the clients that have been added to those groups.  We did this by taking advantage of ASP.NET Core [Hosted Services](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-5.0&tabs=visual-studio), and listening to specific channels from the database for updates.

We can open a connection to the database and listen to a channel like so -

```csharp
protected override async Task ExecuteAsync(CancellationToken stoppingToken)
{
    _connection = new NpgsqlConnection(_configuration.ConnectionString);
    _connection.Open();
    _connection.Notification += ConnectionOnNotification;

    using var command = new NpgsqlCommand("LISTEN <channel_name>", _connection);
    command.ExecuteNonQuery();

    while (!stoppingToken.IsCancellationRequested)
    {
        await _connection.WaitAsync();
    }

    await Task.CompletedTask;
}
```

Postgres has functionality built in for [notify](https://www.postgresql.org/docs/current/sql-notify.html) (to generate a notification on a chanell) and [listen](https://www.postgresql.org/docs/current/sql-listen.html) (receive a notification from a channel).  We wrapped the notify functionality behind a trigger and procedure, so that when a new GPS entry is recorded, the trigger will fire and execute the procedure, which will take the full payload of the GPS entry and send it to our channel.

The trigger is pretty basic -

```sql
DROP TRIGGER IF EXISTS trigger_name ON table_name;

CREATE TRIGGER trigger_name AFTER INSERT OR UPDATE ON table_name
    FOR EACH ROW
    EXECUTE PROCEDURE procedure_to_call();
```

The procedure does a little more work to create a JSON payload, but ultimately sends the notify command -

```sql
PERFORM pg_notify('<channel_name>', payload);
```

In this case, `<channel_name>` here must match the channel you're listening to in your background worker.

The background services are always listening for updates on the same channel, and can act on the notification by deserializing the event data (the full payload of the GPS entry).  Once we've deserialized the data, we make a couple small modifications to it and then serialize it again.  Then, we can use SignalR's functionality to send the data through the hub context to any clients awaiting updates. This maps to the event we added in the background service, `ConnectionOnNotification`, where you can respond to the new notification -

```csharp
private void ConnectionOnNotification(object sender, NpgsqlNotificationEventArgs e)
{
    try
    {
        var data = JsonConvert.DeserializeObject<SomeObjectYouHave>(e.Payload);

        data.UpdatedOn = DateTime.Now.FormatPrettyForUsers();

        _hubContext.Clients.Group(group_id).SendAsync("<the SignalR event the front-end is waiting for>", JsonConvert.SerializeObject(data));
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, $"Error in ConnectionOnNotification - Information [{e.Payload}]");
    }
}
```

On the front-end, which is a Vue 3 app, we just wait for the notification from the hub context and add the payload data to our existing data object.

That looks a little bit like this -

```javascript
var connection = new signalR
    .HubConnectionBuilder()
    .withUrl(`${baseSignalRUrl}/endpoint`) // < Matches the hub endpoint from Startup.cs
    .withAutomaticReconnect()
    .build();

connection.on("<the SignalR event the front-end is waiting for>", function(payload) {
    // do something with the payload
});
```

Again, this is the "thirty-thousand foot view", and it's difficult to tease apart production code for a blog post, so there may be bits missing here.  Please let me know if you have any questions, more than happy to help!
