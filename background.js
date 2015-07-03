var feed_url =  "http://moreno-gummich.com/feed/article-history/"+(window.location.href).replace("http://","");
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
		    click: function(){getText(sTitle+"");}
		    })).prependTo('#main');
			i--;	
	    	});
	  },
	  error: function() {}
	});
}
function getText(ur) {
    $('#main').empty();
$('#main').prepend("<style type='text/css'>  del {    background-color: #ffa0a0;  }  ins {    background-color: #a0ffa0;  }  </style>");
    $('#main').append("<div id='compare'></div>");
   $.ajax({
	    type: "GET",
	    url: ur,
	    dataType: "html",
	    success: function(data){
		var script = data.substring(data.indexOf("var text1 = '"), data.length);
		script = script.substring(0, script.indexOf("</script>"));
		eval(script);
	    }
    });
}
