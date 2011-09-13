
// First initialization
if (! localStorage['characters']) {
	
	localStorage['characters'] = JSON.stringify([ ]);
}


var CODE_ROUNDED_a = 0x24D0;
var CODE_a = 'a'.charCodeAt(0);

var CODE_ROUNDED_A = 0x24B6;
var CODE_A = 'A'.charCodeAt(0);

var CODE_ROUNDED_1 = 0x2460;
var CODE_1 = '1'.charCodeAt(0);

var CODE_ROUNDED_0 = 0x24EA;
var CODE_0 = '0'.charCodeAt(0);

var FLIP_TABLE = {
	a : '\u0250',
	b : 'q',
	c : '\u0254',
	d : 'p',
	e : '\u01DD',
	f : '\u025F',
	g : '\u0183',
	h : '\u0265',
	i : '\u0131',
	j : '\u027E',
	k : '\u029E',
	l : 'l',
	m : '\u026F',
	n : 'u',
	o : 'o',
	p : 'd',
	q : 'b',
	r : '\u0279',
	s : 's',
	t : '\u0287',
	u : 'n',
	v : '\u028C',
	w : '\u028D',
	y : '\u028E',
	z : 'z',
	0 : '0',
	1 : '\u21C2',
	2 : '\u1105',
	3 : '\u1110',
	4 : '\u3123',
	5 : '\u078E', /* or u03DB */
	6 : '9',
	7 : '\u3125',
	8 : '8',
	9 : '6',
	'.' : '\u02D9',
	',' : "\'",
	"\'" : ',',
	"\"" : ',,',
	"�" : ',',
	"`" : ',',
	';' : '\u061B',
	'!' : '\u00A1',
	'\u00A1' : '!',
	'?' : '\u00BF',
	'\u00BF' : '?',
	'[' : ']',
	']' : '[',
	'(' : ')',
	')' : '(',
	'{' : '}',
	'}' : '{',
	'<' : '>',
	'>' : '<',
	'_' : '\u203E',
	'\r' : '\n'
};

// Revert this table
for (i in FLIP_TABLE){
	FLIP_TABLE[FLIP_TABLE[i]] = i;
}


var BRAILLE_TABLE = {
	a : '⠁',
	b : '⠃',
	c : '⠉',
	d : '⠙',
	e : '⠑',
	f : '\u025F',
	g : '\u0183',
	h : '\u0265',
	i : '\u0131',
	j : '\u027E',
	k : '\u029E',
	l : 'l',
	m : '\u026F',
	n : 'u',
	o : 'o',
	p : 'd',
	q : 'b',
	r : '\u0279',
	s : 's',
	t : '\u0287',
	u : 'n',
	v : '\u028C',
	w : '\u028D',
	y : '\u028E',
	z : 'z',
	1 : '\u21C2',
	2 : '\u1105',
	3 : '\u1110',
	4 : '\u3123',
	5 : '\u078E', /* or u03DB */
	6 : '9',
	7 : '\u3125',
	8 : '8',
	9 : '6',
	0 : '0',
};


$().ready(function() {
	var custom_characters = /*JSON.parse(localStorage["characters"])*/ [];

	$("ul.tabs li").click(function() {
		var sectionId = $(this).attr("rel");
		
		$("section.characters").not("#" + sectionId).removeClass('current');
		
        $("section.characters#" + sectionId).addClass('current');
	});

	$("section.characters span").click(function() {
		appendCharacter($(this).text());
	});
	

	$("#flip").keyup(function() {
		var value = $(this).val().toLowerCase();

		if (! value) {
			$("#result").html("&nbsp;");
			return;
		}
		
		var last = value.length - 1;
		var result = new Array(value.length);
		for (var i = last; i >= 0; --i) {
			var c = value.charAt(i);
			var r = FLIP_TABLE[c];
			result[last - i] = r != undefined ? r : c;
		}

		$("#result").html(result.join(''));
	});

	$("#braille").keyup(function() {
		var value = $(this).val().toLowerCase();

		if (! value) {
			$("#result").html("&nbsp;");
			return;
		}
		
		var last = value.length - 1;
		var result = new Array(value.length);
		for (var i = last; i >= 0; --i) {
			var c = value.charAt(i);
			var r = BRAILLE_TABLE[c];
			result[last - i] = r != undefined ? r : c;
		}

		$("#result").html(result.join(''));
	});
	
	$("#rounded").keyup(function() {
		var value = $(this).val();

		if (! value) {
			$("#result").html("&nbsp;");
			return;
		}
		
		var result = "";
		for (var i = 0; i < value.length; ++i) {
			var charCode = value.charCodeAt(i);
			
			if (charCode >= CODE_a && charCode <= CODE_a + 26) {
				var roundedCharCode = CODE_ROUNDED_a + (charCode - CODE_a);
				result += "&#x" + roundedCharCode.toString(16) + ";";
			}
			else if (charCode >= CODE_A && charCode <= CODE_A + 26) {
				var roundedCharCode = CODE_ROUNDED_A + (charCode - CODE_A);
				result += "&#x" + roundedCharCode.toString(16) + ";";
			}
			else if (charCode >= CODE_1 && charCode <= CODE_1 + 8) {
				var roundedCharCode = CODE_ROUNDED_1 + (charCode - CODE_1);
				result += "&#x" + roundedCharCode.toString(16) + ";";
			}
			else if (charCode == CODE_0) {
				result += "&#x" + CODE_ROUNDED_0.toString(16) + ";";
			}
			else {
				result += value[i];
			}
			
		}

		$("#result").html(result);
			
	});
	
	$("footer a").click(function() {
		chrome.tabs.create({ url: $(this).attr("href")});
	});
	
	/*
	for (var i = 0; character = characters[i]; ++i) {
		$("section#misc").append($("<span></span>").append(character).click(function() {
			appendCharacter($(this).text());
		}));
	}
	*/
	
	
});

function appendCharacter(character) {
	chrome.tabs.getSelected(null, function(tab) {
		//$("body").append("Clicked on " + character);
	    chrome.tabs.sendRequest(tab.id, { content : character});
	});
}
