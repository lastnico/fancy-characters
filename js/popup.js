
(function( $ ){
	$.fn.emptyResult = function() {
		this.empty().html("<div class='void'>√∏</div>" + chrome.i18n.getMessage("empty_result") + "</div>").addClass("empty");
		return this;
	};
	
	$.fn.withResult = function(content) {
		this.empty().removeClass("empty");
		if (content) {
			this.html(content);
		}
		
		resizeSections(false);

		return this;
	};
	
	$.fn.characterTip = function() {
		this.qtip({
			content: {
				text: function(api) {
					return "<div class='tipAdd'>" + chrome.i18n.getMessage("insert_character") + " <span class='character'>" + $(this).text() + "</span>" + ( ($(this).attr("data-name")) ? "<div class='character-description'>" + $(this).attr("data-name") + ".</div>" : ".") + "</div>";
				}
			},
			show: {
				delay: 1500,
				effect: function(offset) {
					$(this).slideDown(200);
				}
			},
			position: {
				my: 'center left',
				at: 'center right',
				viewport: $("article"),
			},
			style: {
				classes: "ui-tooltip-shadow ui-tooltip-rounded"
			},
		});
	};

})(jQuery);

var SYMBOL_FONT_FAMILY;
var SYMBOL_FONT_SIZE;

var INITIALIZED = false;

var sections = {};

function showSection(sectionId) {
	// Do not refresh current section
	if ($("section#" + sectionId).is(".current")) {
		return;
	}
	
	$("ul.tabs li").not("[rel=" + sectionId + "]").removeClass('current');
	$("section.current").removeClass('current').fadeOut();
	
	$("ul.tabs li[rel=" + sectionId + "]").addClass("current");
    $("section#" + sectionId).addClass('current').fadeIn();
    
    if (INITIALIZED)
    	resizeSections(false);
    else
    	resizeSections(true);
    
    localStorage["currentTab"] = sectionId;

}

$().ready(function() {
	
	l10n();
	
	var currentTab = localStorage["currentTab"] || "symbols";
	showSection(currentTab);

	$(".result.tools, .result.encryption").emptyResult();
	
	new Favorites().refreshBlock();
	refreshCustomCharacters();
	
	$(".characters:not(#custom, #favorite) span").characterTip();
	
	SYMBOL_FONT_FAMILY = $("div.characters span").css("font-family");
	SYMBOL_FONT_SIZE = $("div.characters span").css("font-size");
	
	$("ul.tabs li").click(function() {
		hideTips();
		
		var sectionId = $(this).attr("rel");
		showSection(sectionId);
	});
	
	$("#solution").qtip({
		content: {
			text: function(api) {
				prepareSolutionTips($("#solution-tips"));
				var tips = $("#solution-tips").clone();
			
				return tips;
			}
		},
		style: {
			classes: 'ui-tooltip-shadow ui-tooltip-rounded'
		},
		position: {
			my: 'bottom right',
			at: 'top middle',
		},
		hide: {
			fixed: true,
			delay: 400,
		}
	});

	$(".characters span").live("click", function() {
		appendCharacter($(this).text());
	});
	
	$(".changeFont").live("click", function() {
		var fontFamily = $(this).css("fontFamily");
		var fontSize = $(this).css("fontSize");
		
		$("div.characters span").css({ "fontFamily" : fontFamily, "fontSize" : fontSize });
		$(".result.tools, .result.encryption").css({ "fontFamily" : fontFamily, "fontSize" : fontSize });

	});

	$(".characters span").live("mouseover mouseout", function() {
		$(this).parents("section").filter(":first").find(".preview").text($(this).text());
	});
	
	$("#customCharactersForm, #newCharacters").bind("submit keyup", function() {
		var newCharacters = $("#newCharacters").val();
		
		newCharacters = newCharacters.replace(/\s/, "");
		
		var characters = getCustoms();
		for (var i = 0; i < newCharacters.length; ++i) {
			var newCharacter = newCharacters[i];
			if (characters.indexOf(newCharacter) == -1) {
				characters += newCharacter;
			}
		}
		
		localStorage['customCharacters'] = characters;
		refreshCustomCharacters();
		
		$("#newCharacters").val("");
		
		return false;
	});
	
	$("#removeCustom").click(function() {
		localStorage['customCharacters'] = "";
		refreshCustomCharacters();
	});

	$("#removeFavorite").click(function() {
		var favorites = new Favorites();
		favorites.empty();
		favorites.store();
	});

	$(".insert-result").click(function() {
		var result = $(this).parent().find(".result");
		if (result.hasClass("empty")) {
			return;
		}
		
		appendCharacter(result.text());
	});

	$(".select-result").click(function() {
		var result = $(this).parent().find(".result");
		if (result.hasClass("empty")) {
			return;
		}

		result = result.get(0);
		
	    var range = document.createRange();
	    range.selectNodeContents(result);
	    selection = window.getSelection();
	    selection.removeAllRanges();
	    selection.addRange(range);

	});

	
	$("section#tools label.tool").qtip({
		content: {
			text: function(api) {
				var value = $(this).text();
				
				value = value.replace(/\:/, "");
				
				var result = "";
				if ($(this).attr("for") == "flip")
					result = toFlip(value);
				else if ($(this).attr("for") == "leetSpeak")
					result = toLeetSpeak(value, 0);
				else if ($(this).attr("for") == "rounded")
					result = toRounded(value);
				else if ($(this).attr("for") == "braille")
					result = toBraille(value);
				else if ($(this).attr("for") == "morse")
					result = toMorse(value);
				
				return "<div class='tool-teasing'>" + result + "</div>";
			}
		},
		style: {
			classes: 'ui-tooltip-dark ui-tooltip-rounded'
		},
		position: {
			my: 'center left',
			at: 'center right',
		},
	});

	$("#flip").bind("click keyup", function() {
		var value = $(this).val();

		if (! value) {
			$(".result.tools").emptyResult();
			return;
		}
		
		var result = toFlip(value);

		$(".result.tools").withResult(result);
	});

	$("#braille").bind("click keyup", function() {
		var value = $(this).val();

		if (! value) {
			$(".result.tools").emptyResult();
			return;
		}
		
		var result = toBraille(value);

		$(".result.tools").withResult(result);
	});

	$("#morse").bind("click keyup", function() {
		var value = $(this).val();

		if (! value) {
			$(".result.tools").emptyResult();
			return;
		}
		
		var result = toMorse(value);

		$(".result.tools").withResult(result);
	});

	$("#rounded").bind("click keyup", function() {
		var value = $(this).val();

		if (! value) {
			$(".result.tools").emptyResult();
			return;
		}
		
		var result = toRounded(value);

		$(".result.tools").withResult(result);
			
	});
	
	$("#leetSpeak").bind("click keyup", refreshLeetSpeakResult);
	$("#leetSpeakCoding :radio").click(refreshLeetSpeakResult);
	
	$("a").click(function() {
		chrome.tabs.create({ url: $(this).attr("href")});
	});
	

	$("#md5").bind("click keyup", function() {
		var value = $(this).val();

		if (! value) {
			$(".result.encryption").emptyResult();
			return;
		}
		
		var result = toMd5(value);

		$(".result.encryption").withResult(result);
			
	});

	$("#sha1").bind("click keyup", function() {
		var value = $(this).val();

		if (! value) {
			$(".result.encryption").emptyResult();
			return;
		}
		
		var result = toSha1(value);

		$(".result.encryption").withResult(result);
			
	});
	
	$("section#encryption .crypting").click(function() {
		var isDecrypt = $(this).hasClass("decrypt");
		if (isDecrypt) {
			$(this).removeClass("enabled").fadeOut();
			$(this).parent().find(".encrypt").addClass("enabled").fadeIn();
		}
		else {
			$(this).removeClass("enabled").fadeOut();
			$(this).parent().find(".decrypt").addClass("enabled").fadeIn();
			
		}
		
		refreshBase64Result();
	});
	
	$("#base64").bind("click keyup", refreshBase64Result);


	$("#rot13").bind("click keyup", function() {
		var value = $(this).val();

		if (! value) {
			$(".result.encryption").emptyResult();
			return;
		}
		
		var result = toRot13(value);

		$(".result.encryption").withResult(result);
			
	});
	
	INITIALIZED = true;
	
});


function fontPreview(element, currentFontFamily, currentFontSize) {
	element.empty();
	
	var text = currentFontFamily + " (" + currentFontSize + ")";
	element.text(text)
		.css("fontFamily", currentFontFamily)
		.css("fontSize", currentFontSize);
}

function prepareSolutionTips(tips) {

	fontPreview(tips.find(".currentFont"), SYMBOL_FONT_FAMILY, SYMBOL_FONT_SIZE);
	
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, { action: "get-font"}, function(response) {
	    	fontPreview($(".websiteFont"), response.fontFamily, response.fontSize);
		});
	});
	
}

function resizeSections(immediate) {
    var height = $("section.current").outerHeight();
    
    if (height != $("#sections").height()) {
    	if (immediate)
    		$("#sections").css({ "height" : height + "px"  });
    	else
        	$("#sections").stop(true).animate({ "height" : height + "px"  }, 'slow');
    }
} 


function removeCustomCharacter() {
	var character = $(this).attr("rel");
	var characters = getCustoms();
	
	// Make this work, whatever character is (including regex keywords)
	characters = characters.replace(character + "", "");
	
	var characterSelector = character;
	if (character == '"') {
		characterSelector = '\\"';
	}

	$(".characters#custom span[rel=\"" + characterSelector + "\"]").qtip("toggle", false);
	
	localStorage['customCharacters'] = characters;
	refreshCustomCharacters();

	return false;
}

function refreshCustomCharacters() {
	var characters = getCustoms();

	$(".characters#custom").empty();
	
	for (var i = 0; character = characters[i]; ++i) {
		var spanCharacter = $("<span></span>").attr("rel", character).text(character)
			.qtip({
				content: {
					text: function(api) {
						var tip = $("<div></div>").addClass("tipAdd").append("Insert <span class='character'>" + $(this).text() + "</span>.")
							.append($("<span></span>").addClass("link removeCharacter").attr("rel", $(this).text()).append("Remove From List").click(removeCustomCharacter))
							.append(".");
						
						return tip;
					}
				},
				show: {
					delay: 750
				},
				hide: {
					fixed: true,
					delay: 1000,
				},
				position: {
					my: 'center left',
					at: 'center right',
					viewport: $("article")
				},
				style: {
					classes: 'ui-tooltip-shadow ui-tooltip-rounded'
				},
			});
		
		$(".characters#custom").append(spanCharacter).append(" ");
	}
	
		

}

function refreshLeetSpeakResult() {
	var value = $("#leetSpeak").val();

	if (! value) {
		$(".result.tools").emptyResult();
		return;
	}
	
	var result = toLeetSpeak(value, $("#leetSpeakCoding :radio:checked").val());

	$(".result.tools").withResult(result);
}

function refreshBase64Result() {
	var value = $("#base64").val();
	
	if (! value) {
		$(".result.encryption").emptyResult();
		return;
	}

	var isDecrypt = $("#base64").parent().find(".crypting.enabled").hasClass("decrypt");
	
	var result;
	if (isDecrypt)
		result = fromBase64(value);
	else
		result = toBase64(value);
		

	$(".result.encryption").withResult(result);
}

function appendContent(character) {
	chrome.tabs.getSelected(null, function(tab) {
	    chrome.tabs.sendRequest(tab.id, { action: "insert-character", content : character}, function(response) {
	    	if (! response) {
	    		if ($("#insertion-failed").length != 0) {
	    			$("#insertion-failed").stop(true).fadeIn("fast");
	    		}
	    		else {
		    		$("footer").append($("<div></div>")
		    				.css("display", "none")
		    				.attr("id", "insertion-failed")
		    				.text(chrome.i18n.getMessage("insertion_failed"))
		    				.fadeIn("fast"));
	    		}
	    		

	    		if (insertionFailedTimeout) {
	    			window.clearTimeout(insertionFailedTimeout);
	    		}
	    		insertionFailedTimeout = window.setTimeout(function() {
	    			$("#insertion-failed").fadeOut();
	    		}, 4000);
	    	}
		});
	});

}

var insertionFailedTimeout = null;
function appendCharacter(character) {
	appendContent(character);
	
	var favorites = new Favorites();
	favorites.useCharacter(character);
	favorites.store();
	
	hideTips();
}

function hideTips() {
	$('.qtip.ui-tooltip').qtip('hide');
}

function l10n() {
	$("#instructions").text(chrome.i18n.getMessage("instructions"));
	$("ul.tabs li").text(function(index) {
		return chrome.i18n.getMessage("tab_" + $(this).attr("rel"));
	});
	
	$("section#symbols h1").text(chrome.i18n.getMessage("title_symbols"));
	$("section#math h1").text(chrome.i18n.getMessage("title_math"));
	$("section#shapes h1").text(chrome.i18n.getMessage("title_shapes"));

	$("h1#customTitle").text(chrome.i18n.getMessage("title_custom"));
	$("#removeCustom").text(chrome.i18n.getMessage("remove_custom"));
	$("#newCharactersLabel").text(chrome.i18n.getMessage("new_characters"));
	$("#suggestionSee").text(chrome.i18n.getMessage("suggestion_see"));
	$("#suggestionLink").text(chrome.i18n.getMessage("suggestion_link"));
	$("#suggestionLink").attr("title", chrome.i18n.getMessage("suggestion_link_title"));

	$("h1#favoriteTitle").text(chrome.i18n.getMessage("title_favorite"));
	$("#removeFavorite").text(chrome.i18n.getMessage("remove_favorite"));
	
	$(".insert-result").text(chrome.i18n.getMessage("insert_result"));
	$(".select-result").text(chrome.i18n.getMessage("select_result"));
	
	$("section#tools h1").text(chrome.i18n.getMessage("title_tools"));
	$("section#tools label[for=rounded]").text(chrome.i18n.getMessage("tool_rounded"));
	$("section#tools label[for=flip]").text(chrome.i18n.getMessage("tool_flip"));
	$("section#tools label[for=braille]").text(chrome.i18n.getMessage("tool_braille"));
	$("section#tools label[for=leetSpeak]").text(chrome.i18n.getMessage("tool_leet_speak"));
	$("section#tools label[for=leetSpeakCoding]").text(chrome.i18n.getMessage("tool_leet_speak_coding"));
	$("section#tools label[for=leetSpeakBasic]").text(chrome.i18n.getMessage("leet_speak_coding_basic"));
	$("section#tools label[for=leetSpeakLight]").text(chrome.i18n.getMessage("leet_speak_coding_light"));
	$("section#tools label[for=leetSpeakMedium]").text(chrome.i18n.getMessage("leet_speak_coding_medium"));
	$("section#tools label[for=leetSpeakHigh]").text(chrome.i18n.getMessage("leet_speak_coding_high"));
	$("section#tools label[for=morse]").text(chrome.i18n.getMessage("tool_morse"));

	// Encryption
	$("section#encryption h1").text(chrome.i18n.getMessage("title_encryption"));
	
	$("section#encryption label[for=md5]").text(chrome.i18n.getMessage("encryption_md5"));
	$("section#encryption label[for=sha1]").text(chrome.i18n.getMessage("encryption_sha1"));
	$("section#encryption label[for=rot13] a").text(chrome.i18n.getMessage("encryption_rot13"));
	$("section#encryption label[for=base64] a").text(chrome.i18n.getMessage("encryption_base64"));
	$("section#encryption .crypting.encrypt").text(chrome.i18n.getMessage("encryption_encrypt"));
	$("section#encryption .crypting.decrypt").text(chrome.i18n.getMessage("encryption_decrypt"));

	// Solution
	$("#ugly").text(chrome.i18n.getMessage("troubleshooting_ugly"));
	$("#solution").text(chrome.i18n.getMessage("troubleshooting_solution"));

	$("#solution-tips .p1").text(chrome.i18n.getMessage("solution_tip_p1"));
	$("#solution-tips .p2").text(chrome.i18n.getMessage("solution_tip_p2"));
	$("#solution-tips .p3").text(chrome.i18n.getMessage("solution_tip_p3"));
	$("#solution-tips .p4").text(chrome.i18n.getMessage("solution_tip_p4"));

	// Footer
	$("#twitter").attr("title", chrome.i18n.getMessage("twitter_title"));
	$("#donate").attr("title", chrome.i18n.getMessage("donate_title"));
	$("#email").attr("title", chrome.i18n.getMessage("email_title"));
	$("#extensionLink").text(chrome.i18n.getMessage("extension_link"));
	$("#unicodeLink").text(chrome.i18n.getMessage("unicode_link"));

}

function getCustoms() {
	if (! localStorage['customCharacters'])
		return "";
	else
		return localStorage['customCharacters'];
}



function Favorites() {
	if (! localStorage['favoriteCharacters'])
		this.favorites = [ ];
	else {
		try {
			this.favorites = JSON.parse(localStorage['favoriteCharacters']);
			
			// Compatibility with old stored data
			if (! (this.favorites instanceof Array)) {
				this.favorites = [];
			}
		} catch(e) {
			this.favorites = [ ];
		}
	}

}

Favorites.prototype.find = function(character) {
	for (var index = 0; index < this.favorites.length; ++index) {
		var favorite = this.favorites[index];
		
		if (favorite.character == character) {
			return favorite;
		}
	}
	
	return null;
};

Favorites.prototype.useCharacter = function(character) {
	var favorite = this.find(character);
	if (favorite) {
		favorite.usage = favorite.usage + 1;
	}
	else {
		this.favorites.push( { "character" : character, "usage" : 1} );
	}
	
	// Never store more than 60 elements
	while (this.favorites.length > 60) {
		this.favorites.pop();
	}
	
	// Sort
	this.favorites.sort(function(a,b) {
		return b["usage"] - a["usage"];
	});

};

Favorites.prototype.store = function() {
	localStorage['favoriteCharacters'] = JSON.stringify(this.favorites);
	this.refreshBlock();
};

Favorites.prototype.datas = function() {
	return this.favorites;
};

Favorites.prototype.empty = function() {
	this.favorites = [];
};

Favorites.prototype.refreshBlock = function() {
	$(".characters#favorite").empty();
	
	for (var index = 0; index < this.favorites.length; ++index) {
		var favorite = this.favorites[index]; 
		var character = favorite.character;
		var usage = favorite.usage;

		var usageString;
		if (usage == 1) {
			usageString = chrome.i18n.getMessage("used_once");
		}
		else if (usage == 2) {
			usageString = chrome.i18n.getMessage("used_twice");
		}
		else {
			usageString = chrome.i18n.getMessage("used_n_times", [ usage ]);
		}

		
		var spanCharacter = $("<span></span>").text("" + character)
			.qtip({
				content: {
					text: $("<div></div>").addClass("tipAdd").append(chrome.i18n.getMessage("insert_character") + " <span class='character'>" + character + "</span>")
							.append(" <strong>" + usageString + "</strong>.")
				},
				show: {
					delay: 750
				},
				position: {
					my: 'center left',
					at: 'center right',
					viewport: $("article")
				},
				style: {
					classes: 'ui-tooltip-shadow ui-tooltip-rounded'
				},
			});
		
		$(".characters#favorite").append(spanCharacter).append(" ");
	}
		
};
