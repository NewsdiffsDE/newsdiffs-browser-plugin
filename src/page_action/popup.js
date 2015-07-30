var runtime = chrome.runtime && chrome.runtime.sendMessage ?
    'runtime' : 'extension';

//accesing the feed url from local storage
var feed_url= localStorage.var;

get_feed();
function make_base_auth(user, password) {
  var tok = user + ':' + password;
  var hash = btoa(tok);
  return "Basic " + hash;
}

//function for reloading or including the diffview
    function get_feed() {
                //gets the xml file from newsdiffs
                $.ajax({
                type: "GET",
                url: feed_url,
                dataType: "xml",
                data: '{}',
                beforeSend: function (xhr){
                    xhr.setRequestHeader('Authorization', make_base_auth("nduser", "NewsdiffsDE2015"));
                },
                success: function(xml){
                    var i = $(xml).find('entry').length;
                    $('<li>').html($('<a>',{
                        text: "Aktuellen Artikel anzeigen",
                        title: 'Original',
                        href:"#",
                        //executing a sendMessage to content.js if its clicked. The listener will look for reload
                        click: function(){
                            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                                chrome.tabs.sendMessage(tabs[0].id, {
                                    'action': "reload"
                                });
                            });}
                    })).prependTo(original);
                    //function that will parse the xml file from newsdiffs
                    $(xml).find('entry').each(function(){
                        //Will show all the entrys from the xml
                        var sTitle = $(this).find('id').text();
                        $('<li>').html($('<a>',{
                            text: "Version "+i+" vs. Version "+(i+1),
                            title: 'Versionsvergleich',
                            href:"#",
                            //if clicked it will send a message to the content.js. The listener will look for get_text
                            click: function () {
                                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                                    chrome.tabs.sendMessage(tabs[0].id, {
                                        'action': "get_text",
                                        'url': sTitle
                                    });
                                });
                            }
                        })).prependTo(version);
                        i--;
                    });
                },
                error: function() {}
            });
    }