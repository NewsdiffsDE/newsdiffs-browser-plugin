var runtime = chrome.runtime && chrome.runtime.sendMessage ?
    'runtime' : 'extension';

var article_url = window.location.hostname + window.location.pathname;
if(window.location.hostname == "www.stern.de"){
    article_url = $('meta[property=og\\:url]').attr("content");
}
var feed_url = 'http://moreno-gummich.com/feed/article-history/' + article_url;
var page_url = 'http://moreno-gummich.com/article-history/' + article_url;
var test = 'test';

chrome.storage.local.set({'channels': test});

function send_message() {
    chrome[runtime].sendMessage({
        'action': 'lookup_page',
        'url': feed_url
    });
}

send_message();