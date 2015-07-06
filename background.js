get_feed();
function get_feed() {
	var feed_url =  "http://moreno-gummich.com/feed/article-history/";
	var article_url = (window.location.href).replace("http://","");	
	if(window.location.hostname == "www.stern.de"){
		article_url = $('meta[property=og\\:url]').attr("content");
	}
	feed_url += article_url;
	$.ajax({
	    type: "GET",
	    url: feed_url,
	    dataType: "xml",
	    success: function(xml){
		vorbereitungen();
		var i = $(xml).find('entry').length;
		$('<li>').html($('<a>',{
			    text: "Aktuellen Artikel anzeigen",
			    title: 'Original',
			    href:"#",
			    click: function(){location.reload();}
			    })).prependTo(auswahl);
	    	$(xml).find('entry').each(function(){
			var sTitle = $(this).find('id').text();
			$('<li>').html($('<a>',{
			    text: "Version "+i+" vs. Version "+(i+1),
			    title: 'Versionsvergleich',
			    href:"#",
			    click: function(){getText(sTitle+"");}
			    })).prependTo(auswahl);
				i--;	
	    	});
	  },
	  error: function() {}
	});
}
function getText(ur) {

   $.ajax({
	    type: "GET",
	    url: ur,
	    dataType: "html",
	    success: function(data){
		$("#ueberschrift").html("<h2>NewsDiffs</h2>");
		var script = data.substring(data.indexOf("var text1 = '"), data.length);
		script = script.substring(0, script.indexOf("</script>"));
		eval(script);				
	    }
    });
}
function vorbereitungen(){
	var website = window.location.hostname;
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
	}
	

	articleDiv.append("<div id='compare'></div>");
	articleDiv.children().appendTo("#compare");
	articleDiv.prepend("<div id='newsDiffsAuswahl'></div>");
	$("<div id='ueberschrift'></div>").insertBefore("#compare");
	auswahl = $("#newsDiffsAuswahl");
	inhalt = $("#compare");
	articleDiv.prepend("<style type='text/css'>  del {    background-color: #ffa0a0;  }  ins {    background-color: #a0ffa0;  }  </style>");
	auswahl.css("border-style", "solid");
	auswahl.css("border-color", "red");
	auswahl.css("border-bottom-color", "#33CC33");
	auswahl.css("border-right-color", "#33CC33");
	auswahl.css("margin-bottom", "50px");
	auswahl.css("padding", "20px");

	inhalt.css("margin-top", "50px");
}
