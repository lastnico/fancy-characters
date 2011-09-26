function findActiveElement(activeDocument) {
	if (! activeDocument) {
		return null;
	}
	
	var activeElement = activeDocument.activeElement;
	if (! activeElement) {
		return null;
	}
	
	// If iframe, we have to go deeper in the DOM
	if (activeElement.nodeName == "IFRAME") {
		var frame = activeElement;
		var newDocument = frame.contentDocument;
			
		return findActiveElement(newDocument);
	}
	else if (activeElement.nodeName == "INPUT" || activeElement.nodeName == "TEXTAREA") {
		return { "activeElement": activeElement, "activeDocument": activeDocument };
	}
	else if (activeElement.contentEditable && activeElement.contentEditable != "inherit") {
		return { "activeElement": activeElement, "activeDocument": activeDocument };
	}
	// http://www.w3.org/TR/2008/WD-html5-20080610/editing.html#contenteditable0
	else if (activeElement.contentEditable && activeElement.contentEditable == "inherit") {
		if ($(activeElement).parents().is("[contentEditable=true]")) {
			return { "activeElement": activeElement, "activeDocument": activeDocument };
		}
	}

	return null;

};

function insertInContentEditable(text, activeDocument) {
	var selection = activeDocument.getSelection();
	var range;
	try {
		range = selection.getRangeAt(0);
	} catch(e) {
		return false;
	}

	var node = activeDocument.createTextNode(text);

	if (selection.type == "Range") {
		range.deleteContents();
	}

	range.insertNode(node);
	
	// see http://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
	// Create a range (a range is a like the selection but invisible)
    range = activeDocument.createRange();
    // Select the entire contents of the element with the range
    range.selectNodeContents(node);
    // collapse the range to the end point. false means collapse to end rather than the start
    range.collapse(false);
    // get the selection object (allows you to change selection)
    selection = activeDocument.getSelection();
    // remove any selections already made
    selection.removeAllRanges();
    // make the range you have just created the visible selection
    selection.addRange(range);
    
    return true;
}

function insertInInput(editable, character) {
	
	if (! editable.value) {
		editable.value = character;
	}
	else {
		var oldtext = editable.value;
		var leftCursor = editable.selectionStart;
		
		pretext = oldtext.substring(0, editable.selectionStart);
		posttest = oldtext.substring(editable.selectionEnd, oldtext.length);
		editable.value = pretext + character + posttest;
		
		editable.selectionStart = leftCursor + character.length;
		editable.selectionEnd = leftCursor + character.length;
	}

	return true;
}

function insertCharacter(character) {
	var result = this.findActiveElement(document);
	
	if (! result) {
		return false;
	}
	
	var editable = result.activeElement;
	var activeDocument = result.activeDocument;
	
	if (editable.nodeName == "INPUT" || editable.nodeName == "TEXTAREA") {
		var success = insertInInput(editable, character);
		if (! success) {
			return false;
		}
		
		$(editable).stop(true, true).effect("highlight", {}, 500);
		
		return true;
	}
	else if (editable.contentEditable) {
		var success = insertInContentEditable(character, activeDocument);
		if (! success) {
			return false;
		}
		
		$(editable).stop(true, true).effect("highlight", {}, 500);

		return true;
	}

	return false;	
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.action == "insert-character") {
		var result = insertCharacter(request.content);
		sendResponse(result);
	}
	else if (request.action == "get-font") {
		sendResponse( {
			fontFamily: $("body").css("fontFamily"),
			fontSize: $("body").css("fontSize")
		} );
	}
	
	
});
