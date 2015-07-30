
var runtime = chrome.runtime && chrome.runtime.sendMessage ?
    'runtime' : 'extension';

var urls = {};

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  delete urls[tabId];
});

//Listener for message. When message arrives it will show the popup icon
chrome[runtime].onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'lookup_page') {
    chrome.pageAction.show(sender.tab.id);
    // urls[sender.tab.id] = request.url;
    //saves the url trasmitted from the content.js in a local storage so the popup.js can access it
    localStorage["var"]=request.url;
    }
});
