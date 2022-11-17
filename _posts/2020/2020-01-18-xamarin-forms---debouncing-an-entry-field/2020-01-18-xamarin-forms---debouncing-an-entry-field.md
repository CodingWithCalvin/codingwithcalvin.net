---
title: "Xamarin Forms - Debouncing an Entry Field"
categories: [dotnet,xamarin,csharp]
description: "While adding a search-as-you-type input to our Xamarin.Forms application, I wanted to 'debounce' it to save network requests.  Read on to find out how I did it"
---

> Curious what "debounce" means?
>
>[Check out my previous entry to the Software Developers' Dictionary to find out!](https://www.codingwithcalvin.net/the-software-developers-dictionary-debounce/)

I recently had a requirement to add a search field to my Xamarin.Forms / Prism application at work.  This application has no local data, and for every search, hits an API endpoint that returns some JSON.  Getting the search to work was easy, but then it hit me - uh oh - I don't want to do that after *every* keystroke!

In comes the debounce...but how?  I'm familiar with doing this in JavaScript, but not in C#, Xamarin, etc.  Luckily for me, this was already a solved problem, and I can't take credit for the code I'm going to post here, as I discovered it after *multiple* GoogleBings.

Since I'm using Prism, I had my search field's `TextChanged` event bound to an `ICommand` in my View Model using Prism's `EventToCommandBehavior`, and the actual search term bound bi-directional with `SearchTerm`, also in my View Model.  All of this together looked something like this:

**SearchPageViewModel.cs**
```csharp
public class SearchPageViewModel : BindableBase, INavigateAware {

    private string _searchTerm;
    public string SearchTerm {
        get => _searchTerm;
        set => SetProperty(ref _searchTerm, value);
    }

    private IList<ApiResult> _results;
    public IList<ApiResult> Results {
        get => _results;
        set => SetProperty(ref _results, value);
    }

    private IApiService _apiService;
    public ICommand SearchCommand { get; }

    public SearchPageViewModel(IApiService apiService){
        _apiService = apiService;

        SearchCommand = new DelegateCommand(Search);
    }

    private void Search(){
        Results = _apiService.Search(SearchTerm);
    }
}
```

**SearchPage.xaml**
```xml
(more xaml)
...
<Entry Text="{Binding SearchTerm}">
    <Entry.Behaviors>
        <b:EventToCommandBehavior EventName="TextChanged" Command="{Binding SearchCommand}" />
    </Entry.Behaviors>
</Entry>
...
(more xaml)
```

Those two items combined formed a functioning search box, but it lagged everytime you typed a single character until the service call returned results.  Now, let's add a 500 millisecond debounce to it!

**SearchPageViewModel.cs**
```csharp
public class SearchPageViewModel : BindableBase, INavigateAware {

    private string _searchTerm;
    public string SearchTerm {
        get => _searchTerm;
        set => SetProperty(ref _searchTerm, value);
    }

    private IList<ApiResult> _results;
    public IList<ApiResult> Results {
        get => _results;
        set => SetProperty(ref _results, value);
    }

    private IApiService _apiService;
    
    public ICommand SearchCommand { get; }

    // ADD THIS:
    private CancellationTokenSource _throttleCts = new CancellationTokenSource();

    public SearchPageViewModel(IApiService apiService){
        _apiService = apiService;

        // CHANGE THE COMMAND TO USE THE NEW DEBOUNCEDSEARCH METHOD:
        SearchCommand = new DelegateCommand(async () => await DebouncedSearch().ConfigureAwait(false));
    }

    //CHANGE METHOD SIGNATURE
    private async Task Search(){
        Results = _apiService.Search(SearchTerm);
    }
    
    //ADD THIS METHOD
    private async Task DebouncedSearch()
    {
        try
        {
            Interlocked.Exchange(ref _throttleCts, new CancellationTokenSource()).Cancel();

            //NOTE THE 500 HERE - WHICH IS THE TIME TO WAIT
            await Task.Delay(TimeSpan.FromMilliseconds(500), _throttleCts.Token)

                //NOTICE THE "ACTUAL" SEARCH METHOD HERE
                .ContinueWith(async task => await Search(),
                    CancellationToken.None,
                    TaskContinuationOptions.OnlyOnRanToCompletion,
                    TaskScheduler.FromCurrentSynchronizationContext());
        }
        catch
        {
            //Ignore any Threading errors
        }
    }
}
```

For completeness, the XAML didn't change at all!

**SearchPage.xaml**
```xml
(more xaml)
...
<Entry Text="{Binding SearchTerm}">
    <Entry.Behaviors>
        <b:EventToCommandBehavior EventName="TextChanged" Command="{Binding SearchCommand}" />
    </Entry.Behaviors>
</Entry>
...
(more xaml)
```

This has been working splendidly, and I'm very happy with it.  Now, as I said, I did *not* author this code, but uncovered it online after many failed search attempts.  It is now unfortunate that I can no longer find that post.  

Please, dear reader, if you do run across it out there, please let me know so I can attribute it properly.  My main reason for posting it here is to hopefully elevate a working solution for other googlebingers in the future.
