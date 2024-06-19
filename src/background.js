chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostContains: 'youtube' }
                })
            ],
            actions: [ new chrome.declarativeContent.ShowPageAction() ]
        }]);
    });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var url = 'http://localhost:3000/download?';
    var queryString = Object.keys(message).map(key => key + '=' + encodeURIComponent(message[key])).join('&');
    url += queryString;

    console.log(url);

    chrome.downloads.download({
        url: url,
        filename: "YoutubeDownloader/" + message.filename + '.' + message.format
    }, function(downloadId) {
        if (downloadId) {
            chrome.downloads.show(downloadId);
        } else {
            console.error('Download failed');
        }
    });
});
