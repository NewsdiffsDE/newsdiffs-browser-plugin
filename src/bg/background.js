// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
/*chrome.extension.onMessage.addListener(
 function(request, sender, sendResponse) {
 chrome.pageAction.show(sender.tab.id);
 sendResponse();
 });*/

var runtime = chrome.runtime && chrome.runtime.sendMessage ?
    'runtime' : 'extension';

var urls = {};

chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({
    'index': tab.index + 1,
    'url': urls[tab.id]
  });
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  delete urls[tabId];
});

chrome[runtime].onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'lookup_page') {
    chrome.pageAction.show(sender.tab.id);
    // urls[sender.tab.id] = request.url;
  }
});