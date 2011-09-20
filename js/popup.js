
(function( $ ){
	$.fn.emptyResult = function() {
		this.empty().html("<div class='void'>ø</div> Type something on the desired field below...</div>").addClass("empty");
		return this;
	};
	
	$.fn.withResult = function(content) {
		this.empty().removeClass("empty");
		if (content) {
			this.html(content);
		}
		
		resizeSections();

		return this;
	};
	
	$.fn.characterTip = function() {
		this.qtip({
			content: {
				text: function(api) {
					return "<span class='tipAdd'>Insert <span class='character'>" + $(this).text() + "</span>.</span>";
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

$().ready(function() {
	
	l10n();
	
	var currentTab = localStorage["currentTab"] || "symbols";
	$("ul.tabs li[rel=" + currentTab + "]").addClass("current");
	$("section#" + currentTab).addClass('current').show();
	resizeSections();
	
	$(".result.tools, .result.encryption").emptyResult();
	
	new Favorites().refreshBlock();
	refreshCustomCharacters();
	
	SYMBOL_FONT_FAMILY = $("div.characters span").css("font-family");
	SYMBOL_FONT_SIZE = $("div.characters span").css("font-size");
	
	$("ul.tabs li").click(function() {
		hideTips();
		
		var sectionId = $(this).attr("rel");
		
		$("ul.tabs li").not("[rel=" + sectionId + "]").removeClass('current');
		$("section").not("#" + sectionId).removeClass('current').fadeOut();
		
		$(this).addClass('current');
        $("section#" + sectionId).addClass('current').fadeIn();
        resizeSections();
        
        localStorage["currentTab"] = sectionId;
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
	});

	$(".characters span").live("mouseover mouseout", function() {
		$(this).parents("section").filter(":first").find(".preview").text($(this).text());
	});
	
	$(".characters:not(#custom, #favorite) span").characterTip();
	
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
	
	$("#removeCustoms").click(function() {
		localStorage['customCharacters'] = "";
		refreshCustomCharacters();
	});

	$("#removeFavorites").click(function() {
		var favorites = new Favorites();
		favorites.empty();
		favorites.store();
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

	$("#rot13").bind("click keyup", function() {
		var value = $(this).val();

		if (! value) {
			$(".result.encryption").emptyResult();
			return;
		}
		
		var result = toRot13(value);

		$(".result.encryption").withResult(result);
			
	});
	
	$("#leetSpeak").keyup(refreshLeetSpeakResult);
	$("#leetSpeakCoding :radio").click(refreshLeetSpeakResult);
	
	$("a").click(function() {
		chrome.tabs.create({ url: $(this).attr("href")});
	});
	
	
	
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

function resizeSections() {
    var height = $("section.current").outerHeight();
    
    if (height != $("#sections").height()) {
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

function appendCharacter(character) {
	chrome.tabs.getSelected(null, function(tab) {
	    chrome.tabs.sendRequest(tab.id, { action: "insert-character", content : character});
	});
	
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
			usageString = "once";
		}
		else if (usage == 2) {
			usageString = "twice";
		}
		else {
			usageString = usage + " times";
		}

		
		var spanCharacter = $("<span></span>").text("" + character)
			.qtip({
				content: {
					text: $("<div></div>").addClass("tipAdd").append("Insert <span class='character'>" + character + "</span>")
							.append(" <strong>(used " + usageString + ")</strong>.")
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
