var runtime = chrome.runtime && chrome.runtime.sendMessage ?
    'runtime' : 'extension';

var feed_url= localStorage.var;

get_feed();

    function get_feed() {
                $.ajax({
                type: "GET",
                url: feed_url,
                dataType: "xml",
                success: function(xml){
                    var i = $(xml).find('entry').length;
                    $('<li>').html($('<a>',{
                        text: "Aktuellen Artikel anzeigen",
                        title: 'Original',
                        href:"#",
                        click: function(){
                            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                                chrome.tabs.sendMessage(tabs[0].id, {
                                    'action': "reload"
                                });
                            });}
                    })).prependTo(main);
                    $(xml).find('entry').each(function(){
                        var sTitle = $(this).find('id').text();
                        $('<li>').html($('<a>',{
                            text: "Version "+i+" vs. Version "+(i+1),
                            title: 'Versionsvergleich',
                            href:"#",
                            click: function () {
                                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                                    chrome.tabs.sendMessage(tabs[0].id, {
                                        'action': "get_text",
                                        'url': sTitle
                                    });
                                });
                            }
                        })).prependTo(main);
                        i--;
                    });
                },
                error: function() {}
            });
    }