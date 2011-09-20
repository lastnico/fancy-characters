var fancyQuery = jQuery.noConflict();

function findActiveElement(activeElement) {
	if (! activeElement) {
		return null;
	}
	
	if (activeElement.nodeName == "IFRAME") {
		var editable = null;
		// Try with the name
		if (activeElement.name) {
			var frame = window.frames[activeElement.name];
			if (frame) {
				editable = frame.document.activeElement;
			}
		}
		// Try with the id
		else if (activeElement.id) {
			var frame = document.getElementById(activeElement.id);
			if (frame) {
				editable = frame.contentDocument.activeElement;
			}
		}
		
		return findActiveElement(editable);
	}
	else if (activeElement.nodeName == "INPUT" || activeElement.nodeName == "TEXTAREA") {
		return activeElement;
	}

	return null;

};

function insertCharacter(character) {
	var editable = this.findActiveElement(document.activeElement);
	
	if (! editable) {
		return;
	}
	
	if (! editable.value) {
		editable.value = character;
	}
	else {
		var oldtext = editable.value;
		var leftCursor = editable.selectionStart;
		
		pretext = oldtext.substring(0, editable.selectionStart);
		posttest = oldtext.substring(editable.selectionEnd, oldtext.length);
		editable.value = pretext + character + posttest;
		
		editable.selectionStart = leftCursor + 1;
		editable.selectionEnd = leftCursor + 1;
	}
	
	// TODO Maybe add a highlight effect?
	fancyQuery(editable).stop(true, true).effect("highlight", {}, 500);

}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.action == "insert-character") {
		insertCharacter(request.content);
	}
	else if (request.action == "get-font") {
		sendResponse( { 
			action : "get-font", 
			fontFamily: fancyQuery("body").css("fontFamily"),
			fontSize: fancyQuery("body").css("fontSize")
		} );
	}
	
	
});
