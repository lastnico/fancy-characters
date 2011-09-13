/*
chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    port.postMessage({counter: msg.counter+1});
  });
});
*/

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	document.activeElement.value = document.activeElement.value + request.content;
	
	//sendResponse({counter: request.counter+1});
});
