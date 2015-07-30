var runtime = chrome.runtime && chrome.runtime.sendMessage ?
    'runtime' : 'extension';

// Getting current full url
var article_url = window.location.hostname + window.location.pathname;
// Getting current domain with suffix
var site_url = window.location.hostname;

//Checking the current URL and if it matches getting the real url
switch (site_url) {
    case 'www.stern.de':
        article_url = $('meta[property=og\\:url]').attr("content");
        break;
    case 'www.zeit.de':
        article_url = $('meta[property=og\\:url]').attr("content");
        break;
    case 'www.faz.net':
        article_url = $('meta[property=og\\:url]').attr("content");
        break;
    case 'www.focus.de':
        article_url = $('meta[property=og\\:url]').attr("content");
        break;
    case 'www.n-tv.de':
        article_url = $('meta[property=og\\:url]').attr("content");
        break;
    case 'www.spiegel.de':
        article_url = $('meta[property=og\\:url]').attr("content");
        break;
    case 'www.sueddeutsche.de':
        article_url = $('meta[property=og\\:url]').attr("content");
        break;
    case 'www.rp-online.de':
        article_url = $('meta[property=og\\:url]').attr("content");
        break;
    case 'www.bild.de':
        article_url = $('meta[name=og\\:url]').attr("content");
        break;
}

//setting the xml feed url in our database
//var feed_url = 'http://dev.newsdiffs.de/feed/article-history/?url=' + article_url;
var feed_url = 'http://moreno-gummich.com/feed/article-history/?url=' + article_url;

//Sends a message in the extension framework, can be catched with lookup_page
function send_feed_url() {
    chrome[runtime].sendMessage({
        'action': 'lookup_page',
        'url': feed_url
    });
}

//Checks if an xml file exists for the current url, if yes then it executes send_feed_url()
function check_feed_url() {
    $.get(feed_url, function(data, textStatus, jqXHR) {
        if ($(data).find('entry').length > 0) {
            send_feed_url();
        }
    }, 'xml');
}

// function for user authentication
function make_base_auth(user, password) {
  var tok = user + ':' + password;
  var hash = btoa(tok);
  return "Basic " + hash;
}

//The getText() function makes the diff
function getText(ur) {
    $.ajax({
        type: "GET",
        url: ur,
        dataType: "html",
        data: '{}',
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', make_base_auth("nduser", "NewsdiffsDE2015"));
        },
        success: function(data){
            //preparing the site to include the diff text from newsdiffs
            vorbereitungen(site_url);

            var script = data.substring(data.indexOf("var text1 = '"), data.length);
            script = script.substring(0, script.indexOf("</script>"));
            eval(script);
            $("#ueberschrift").append("<h2>Newsdiffs.de - Vergleich</h2>");
        }
    });
}
//Checks the url and defines the div which should be used to replace the text
function vorbereitungen(url){
    var website = url;
    switch(website) {
        case "www.zeit.de":
            articleDiv = $('#main');
            break;
        case "www.bild.de":
            articleDiv = $("article");
            break;
        case "www.faz.net":
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
        case "www.rp-online.de":
            articleDiv = $('article');
            break;
        case "www.nytimes.com":
            articleDiv = $('#story');
            break;
    }
    //gets the custom stylesheet for every site
    var cssFile = website.split(".")[1];
    $('head').append('<link rel="stylesheet" href="'+chrome.extension.getURL('css/'+cssFile+'.css')+'" type="text/css" />');
    //clears the current text from the site
    articleDiv.empty();
    //fill the site with the compared text from newsdiffs
    articleDiv.append("<div id='compare'></div>");
    $("<div id='ueberschrift'></div>").insertBefore("#compare");
}

check_feed_url();

//Listener waiting for a message from the popup.js to execute getText()
chrome[runtime].onMessage.addListener(function(request, sender, sendResponse) {

    if (request.action === 'get_text') {
        var url = request.url;
        getText(url);

    }
});

//Listiner waiting for a message from the popup.js. If it catches a message it reloads the page
chrome[runtime].onMessage.addListener(function(request, sender, sendResponse) {

    if (request.action === 'reload') {
        location.reload();
    }
});
