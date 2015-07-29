var runtime = chrome.runtime && chrome.runtime.sendMessage ?
    'runtime' : 'extension';

var article_url = window.location.hostname + window.location.pathname;
//if(window.location.hostname == "www.stern.de"){
//    article_url = $('meta[property=og\\:url]').attr("content");
//}
var feed_url = 'http://dev.newsdiffs.de/feed/article-history/?url=http://' + article_url;

function send_feed_url() {
    chrome[runtime].sendMessage({
        'action': 'lookup_page',
        'url': feed_url
    });
}

var test = window.location.hostname;

function getText(ur) {
    $.ajax({
        type: "GET",
        url: ur,
        dataType: "html",
        success: function(data){
            vorbereitungen(test);
            var script = data.substring(data.indexOf("var text1 = '"), data.length);
            script = script.substring(0, script.indexOf("</script>"));
            eval(script);
        }
    });
}
function vorbereitungen(url){
    var website = url;
    switch(website) {
        case "www.zeit.de":
            articleDiv = $('#main');
            break;
        case "www.bild.de":
            articleDiv = $("article");
            break;
        case "www.faz.de":
            articleDiv = $('.FAZArtikelContent');
            break;
        case "www.focus.de":
            articleDiv = $('#content');
            break;
        case "www.n-tv.de":
            articleDiv = $('.content');
            break;
        case "www.spiegel.de":
            articleDiv = $('#content-main');
            break;
        case "www.stern.de":
            articleDiv = $('.article');
            break;
        case "www.sueddeutsche.de":
            articleDiv = $('#sitecontent');
            break;
        case "www.welt.de":
            articleDiv = $('.storyBody');
            break;
        case "www.rp-online.de/":
            articleDiv = $('article');
            break;
        case "www.nytimes.com":
            articleDiv = $('#story');
            break;
    }

    articleDiv.empty();
    articleDiv.append("<div id='compare'></div>");
    $("<div id='ueberschrift'></div>").insertBefore("#compare");
    articleDiv.prepend("<style type='text/css'>  del {    background-color: #ffa0a0;  }  ins {    background-color: #a0ffa0;  }  </style>");
}

send_feed_url();

chrome[runtime].onMessage.addListener(function(request, sender, sendResponse) {

    if (request.action === 'get_text') {
        var url = request.url;
        getText(url);

    }
});

chrome[runtime].onMessage.addListener(function(request, sender, sendResponse) {

    if (request.action === 'reload') {
        location.reload();
    }
});