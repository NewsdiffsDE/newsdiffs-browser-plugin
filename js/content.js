var runtime = chrome.runtime && chrome.runtime.sendMessage ?
    'runtime' : 'extension';

var article_url = window.location.hostname + window.location.pathname;
var feed_url = 'http://moreno-gummich.com/feed/article-history/' + article_url,
    page_url = 'http://moreno-gummich.com/article-history/' + article_url;

function getURL(){
	return page_url;
}
function send_message() {
    chrome[runtime].sendMessage({
        'action': 'lookup_page',
        'url': page_url
    });
}

function get_feed() {
    $.get(feed_url, function(data, textStatus, jqXHR) {
        if ($(data).find('entry').length > 0) {
            lscache.set(article_url, true, 1440);
            send_message();
        } else {
            lscache.set(article_url, false, 60);
        }
    }, 'xml');
}

if (window.location.pathname.length > 1) {
    var cached = lscache.get(article_url);
    if (cached !== false) {
        if (cached) {
            send_message();
        } else {
            $.ajax({
                url: feed_url,
                type: 'head',
                success: get_feed,
                error: function() {
                    lscache.set(article_url, false, 60);
                }
            });
        }
    }
}
