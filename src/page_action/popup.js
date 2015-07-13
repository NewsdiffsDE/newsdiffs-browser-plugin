var feed_url= localStorage.var;

console.log(feed_url);

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
                        click: function(){location.reload();}
                    })).prependTo(main);
                    $(xml).find('entry').each(function(){
                        var sTitle = $(this).find('id').text();
                        $('<li>').html($('<a>',{
                            text: "Version "+i+" vs. Version "+(i+1),
                            title: 'Versionsvergleich',
                            href:"#",
                            click: function () {
                                window.open(sTitle);
                            }
                        })).prependTo(main);
                        i--;
                    });
                },
                error: function() {}
            });
    }