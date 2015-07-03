$(document).ready(function() {
  var trollface = chrome.extension.getURL("images/trollface.jpg");
  $('#content article img').each(function(index, image){
    $(image).attr('src', trollface);
  });
});
