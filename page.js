var jaiqueray = jQuery.noConflict();

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.action == "insert-character") {
		var activeElement = document.activeElement;
		if (! activeElement) {
			return;
		}
		
		var editable;
		if (activeElement.nodeName == "IFRAME") {
			// TODO Check if name exists, if not, maybe try with id
			// TODO Make it work for iframe inside iframe inside...
			editable = window.frames[activeElement.name].document.activeElement;
		}
		else {
			// TODO Check this is an input or a textarea
			editable = activeElement;
		}
		
		
		if (editable && editable.value == "") {
			editable.value = request.content;
		}
		else if (editable) {
			var oldtext = editable.value;
			var curpos = editable.selectionStart;
			pretext = oldtext.substring(0, curpos);
			posttest = oldtext.substring(curpos,oldtext.length);
			editable.value = pretext + request.content + posttest;
		}
		
		// TODO Maybe add a highlight effect?
		
	}
	else if (request.action == "get-font") {
		sendResponse( { 
			action : "get-font", 
			fontFamily: jaiqueray("body").css("fontFamily"),
			fontSize: jaiqueray("body").css("fontSize")
		} );
	}
	
	
});
