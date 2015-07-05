chrome.tabs.query({
    active: true,
    currentWindow: true
}, function(tabs) {
    var tabURL = tabs[0].url;

    var feed_url =  "http://moreno-gummich.com/feed/article-history/"+(tabURL).replace("http://","");

    get_feed();

    function get_feed() {
    $.ajax({
        type: "GET",
        url: feed_url,
        dataType: "xml",
        success: function(xml){
            var i = $(xml).find('entry').length;
            $(xml).find('entry').each(function(){
                var sTitle = $(this).find('id').text();
                $('<li>').html($('<a>',{
                    text: "Version "+i+" vs. Version "+(i+1),
                    title: 'Versionsvergleich',
                    click: function () {
                        window.open(sTitle);
                    }
                })).prependTo('#main');
                i--;
            });
        },
        error: function() {}
    });
}


});