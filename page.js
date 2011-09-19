var jaiqueray = jQuery.noConflict();

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.action == "insert-character") {
		document.activeElement.value = document.activeElement.value + request.content;
	}
	else if (request.action == "get-font") {
		sendResponse( { 
			action : "get-font", 
			fontFamily: jaiqueray("body").css("fontFamily"),
			fontSize: jaiqueray("body").css("fontSize")
		} );
	}
	
	
});
