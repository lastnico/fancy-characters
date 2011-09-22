var fancyQuery = jQuery.noConflict();

function findActiveElement(activeWindow, activeDocument) {
	var activeElement = activeDocument.activeElement;
	if (! activeElement) {
		return null;
	}
	
	// If iframe, we have to go deeper in the DOM
	if (activeElement.nodeName == "IFRAME") {
		var newWindow = null;
		var newDocument = null;
		
		// Try with the name
		if (activeElement.name) {
			var frame = activeWindow.frames[activeElement.name];
			if (frame) {
				newWindow = frame.window;
				newDocument = frame.document;
			}
		}
		// Try with the id
		else if (activeElement.id) {
			var frame = document.getElementById(activeElement.id);
			if (frame) {
				newWindow = frame.contentWindow;
				newDocument = frame.contentDocument;
			}
		}
		
		return findActiveElement(newWindow, newDocument);
	}
	else if (activeElement.contentEditable ||
			activeElement.nodeName == "INPUT" || 
			activeElement.nodeName == "TEXTAREA") {
		return { "activeElement": activeElement, "activeWindow": activeWindow, "activeDocument": activeDocument };
	}

	return null;

};

// TODO Insert / replace / reposition caret
function insertTextAtCursor(text, cWindow, cDocument) {
   var sel, range, html;
   if (cWindow.getSelection) {
       sel = cWindow.getSelection();
       if (sel.getRangeAt && sel.rangeCount) {
           range = sel.getRangeAt(0);
           range.insertNode( cDocument.createTextNode(text) );
       }
   } else if (cDocument.selection && cDocument.selection.createRange) {
       range = cDocument.selection.createRange();
       range.pasteHTML(text);
   }
}

function insertCharacter(character) {
	var result = this.findActiveElement(window, document);
	
	if (! result) {
		return;
	}
	
	var editable = result.activeElement;
	var activeWindow = result.activeWindow;
	var activeDocument = result.activeDocument;
	
	if (activeElement.nodeName == "INPUT" || activeElement.nodeName == "TEXTAREA") {
		
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
		
		fancyQuery(editable).stop(true, true).effect("highlight", {}, 500);
	}
	else {
		insertTextAtCursor(character, activeWindow, activeDocument);
		
		fancyQuery(editable).stop(true, true).effect("highlight", {}, 500);
	}

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
