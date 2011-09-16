
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
	x : 'x',
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
	"'" : ',',
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

// http://utf8-characters.com/braille-patterns/
var BRAILLE_UPPERCASE_PREFIX = '⠨';

var BRAILLE_TABLE = {
	a : '⠁',
	b : '⠃',
	c : '⠉',
	d : '⠙',
	e : '⠑',
	f : '⠋',
	g : '⠛',
	h : '⠓',
	i : '⠊',
	j : '⠚',
	k : '⠅',
	l : '⠇',
	m : '⠍',
	n : '⠝',
	o : '⠕',
	p : '⠏',
	q : '⠟',
	r : '⠗',
	s : '⠎',
	t : '⠞',
	u : '⠥',
	v : '⠧',
	w : '⠺',
	x : '⠭',
	y : '⠽',
	z : '⠵',
	1 : '⠠⠡',
	2 : '⠠⠣',
	3 : '⠠⠩',
	4 : '⠠⠹',
	5 : '⠠⠱',
	6 : '⠠⠫',
	7 : '⠠⠻',
	8 : '⠠⠳',
	9 : '⠠⠪',
	0 : '⠠⠼',
	'.' : '⠲',
	',' : '⠂',
	'?' : '⠢',
	';' : '⠆',
	'!' : '⠖',
	'(' : '⠦',
	')' : '⠴',
	'"' : '⠶',
	'-' : '⠤',
   '\'' : '⠄',
	'/' : '⠌',
	'@' : '⠜',
	'*' : '⠔',
	'^' : '⠈',
	'§' : '⠐⠏',
	'&' : '⠐⠿',
	'¥' : '⠘⠽',
	'€' : '⠘⠑',
	'$' : '⠘⠎',
	'£' : '⠘⠇',
	'©' : '⠐⠉',
	'®' : '⠐⠗',
	'™' : '⠐⠞',
	'%' : '⠐⠬',
	'‰' : '⠐⠬⠬',
	'‱' : '⠐⠬⠬⠬',
	// Math Symbols
	'+' : '⠠⠖',
	//'-' : '⠠⠤', // already as a symbol
	//'*' : '⠠???', // already as a symbol
	//'/' : '⠠???', // already as a symbol
	'=' : '⠠⠶',
};

var LEET_SPEAK_TABLE = {
	a : [ "4", "/\\", "∂", "/-\\" ],
	b : [ "8", "ß", "|:", "|3" ],
	c : [ "c", "[", "¢", "<", "©" ],
	d : [ ")", "|o", "|)", "</" ],
	e : [ "3", "€", "ë", "[-" ],
	f : [ "|=", "ƒ", "|#", "/=" ],
	g : [ "6", "&", "(_+", "(γ," ],
	h : [ "#", "[-]", "|-|", "}-{" ],
	i : [ "1", "!", "|", "][" ],
	j : [ "_|", "_/", "¿", "(/" ],
	k : [ "K", "X", "|<", "|{", "ɮ" ],
	l : [ "1", "£", "1_", "|_" ],
	m : [ "|v|", "|\\/|", "(V)", "/^^\\" ],
	n : [ "^/", "/\/", "{\}", "₪" ],
	o : [ "0", "()", "¤", "([])" ],
	p : [ "P", "|*", "|º", "|>", "[]D" ],
	q : [ "(_,)", "()_", "°|", "0." ],
	r : [ "2", "|?", "Я", "|2"],
	s : [ "5", "$", "§", "_/¯" ],
	t : [ "7", "+", "†", "¯|¯" ],
	u : [ "u", "(_)", "|_|", "µ", "L|" ],
	v : [ "\/", "1/", "|/", "'/" ],
	w : [ "\/\/", "vv", "\X/", "\_:_/" ],
	x : [ "><", "Ж", "×", "}{"],
	y : [ "j", "`/", "λ", "¥" ],
	z : [ "≥", "2", "=/=", ">_"],
};

var MORSE_TABLE = {
	a : '._',
	b : '_...',
	c : '_._.',
	d : '_..',
	e : '.',
	f : '.._.',
	g : '__.',
	h : '....',
	i : '..',
	j : '.___',
	k : '_._',
	l : '._..',
	m : '__',
	n : '_.',
	o : '___',
	p : '.__.',
	q : '__._',
	r : '._.',
	s : '...',
	t : '_',
	u : '.._',
	v : '..._',
	w : '.__',
	x : '_.._',
	y : '_.__',
	z : '__..',
	1 : '.____',
	2 : '..___',
	3 : '...__',
	4 : '...._',
	5 : '.....',
	6 : '_....',
	7 : '__...',
	8 : '___..',
	9 : '____.',
	0 : '_____',
  ' ' : '&nbsp;&nbsp;&nbsp;',
};


(function( $ ){
	$.fn.emptyResult = function() {
		this.empty().html("<div class='void'>ø</div> Type something on the desired field below...</div>").addClass("empty");
		return this;
	};
	
	$.fn.withResult = function() {
		this.empty().removeClass("empty");
		return this;
	};

})(jQuery);

function prepareSolutionTips(tips) {
	tips.find(".currentFont").text("This IS SPARTAX: " + $("body").css("font-family"))
}

$().ready(function() {
	var custom_characters = /*JSON.parse(localStorage["characters"])*/ [];

	$(".result.tools, .result.encryption").emptyResult();
	
	prepareSolutionTips($("#solution-tips"));
	
	$("ul.tabs li").click(function() {
		var sectionId = $(this).attr("rel");
		
		$("ul.tabs li").not("[rel=" + sectionId + "]").removeClass('current');
		$("section").not("#" + sectionId).removeClass('current');
		
		$(this).addClass('current');
        $("section#" + sectionId).addClass('current');
	});
	
	$("#solution").qtip({
		content: {
			text: function(api) {
				var tips = $("#solution-tips").clone();
				
				prepareSolutionTips(tips);
				
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
			delay: 1000,
	   }
	});

	$("section.characters span").click(function() {
		appendCharacter($(this).text());
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

		$(".result.tools").withResult().html(result);
	});

	$("#braille").bind("click keyup", function() {
		var value = $(this).val();

		if (! value) {
			$(".result.tools").emptyResult();
			return;
		}
		
		var result = toBraille(value);

		$(".result.tools").withResult().html(result);
	});

	$("#morse").bind("click keyup", function() {
		var value = $(this).val();

		if (! value) {
			$(".result.tools").emptyResult();
			return;
		}
		
		var result = toMorse(value);

		$(".result.tools").withResult().html(result);
	});

	$("#rounded").bind("click keyup", function() {
		var value = $(this).val();

		if (! value) {
			$(".result.tools").emptyResult();
			return;
		}
		
		var result = toRounded(value);

		$(".result.tools").withResult().html(result);
			
	});

	$("#md5").bind("click keyup", function() {
		var value = $(this).val();

		if (! value) {
			$(".result.encryption").emptyResult();
			return;
		}
		
		var result = toMd5(value);

		$(".result.encryption").withResult().html(result);
			
	});

	$("#sha1").bind("click keyup", function() {
		var value = $(this).val();

		if (! value) {
			$(".result.encryption").emptyResult();
			return;
		}
		
		var result = toSha1(value);

		$(".result.encryption").withResult().html(result);
			
	});

	$("#rot13").bind("click keyup", function() {
		var value = $(this).val();

		if (! value) {
			$(".result.encryption").emptyResult();
			return;
		}
		
		var result = toRot13(value);

		$(".result.encryption").withResult().html(result);
			
	});
	
	$("#leetSpeak").keyup(refreshLeetSpeakResult);
	$("#leetSpeakCoding :radio").click(refreshLeetSpeakResult);
	
	$("a").click(function() {
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

function refreshLeetSpeakResult() {
	var value = $("#leetSpeak").val();

	if (! value) {
		$(".result.tools").emptyResult();
		return;
	}
	
	var result = toLeetSpeak(value, $("#leetSpeakCoding :radio:checked").val());

	$(".result.tools").withResult().html(result);
}

function toLeetSpeak(value, coding) {

	var result = "";
	for (var i = 0; i < value.length; ++i) {
		var c = value.charAt(i);
		
		if (c >= 'A' && c <= 'Z') {
			c = c.toLowerCase();
		}

		var charValues = LEET_SPEAK_TABLE[c];
		var r;
		if (charValues != undefined) {
			if (coding < charValues.length) {
				r = charValues[coding];
			}
			else {
				r = charValues[charValues.length - 1];
			}
		}
		else {
			 r = c;
		}
		
		result += r;
	}
	
	return result;
}


function toFlip(value) {
	value = value.toLowerCase();
	
	var last = value.length - 1;
	var result = new Array(value.length);
	for (var i = last; i >= 0; --i) {
		var c = value.charAt(i);
		c = c.toLowerCase();
		var r = FLIP_TABLE[c];
		result[last - i] = r != undefined ? r : c;
	}
	
	return result.join("");
}

function toMorse(value) {
	value = value.toLowerCase();

	var result = "";
	for (var i = 0; i < value.length; ++i) {
		var c = value.charAt(i);
		
		var r = MORSE_TABLE[c];
		if (result) {
			result += " ";
		}
		result += (r != undefined) ? r : '';
	}
	
	return result;
}

function toBraille(value) {

	var result = "";
	for (var i = 0; i < value.length; ++i) {
		var c = value.charAt(i);
		
		var r;
		if (c >= 'A' && c <= 'Z') {
			r = BRAILLE_UPPERCASE_PREFIX + BRAILLE_TABLE[c.toLowerCase()];
		}
		else {
			r = BRAILLE_TABLE[c];
		}
		
		result += (r != undefined) ? r : c;
	}
	
	return result;
}

function toRounded(value) {
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

	return result;
}

function toRot13(str) {
	return str.replace(/[a-zA-Z]/g, function(c) {
		return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
	});
}

function toMd5(value) {
	return MD5(value);
}

function toSha1(value) {
	return SHA1(value);
}

function appendCharacter(character) {
	chrome.tabs.getSelected(null, function(tab) {
		//$("body").append("Clicked on " + character);
	    chrome.tabs.sendRequest(tab.id, { content : character});
	});
}



/**
*
*  MD5 (Message-Digest Algorithm)
*  http://www.webtoolkit.info/
*
**/
 
var MD5 = function (string) {
 
	function RotateLeft(lValue, iShiftBits) {
		return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	}
 
	function AddUnsigned(lX,lY) {
		var lX4,lY4,lX8,lY8,lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
 	}
 
 	function F(x,y,z) { return (x & y) | ((~x) & z); }
 	function G(x,y,z) { return (x & z) | (y & (~z)); }
 	function H(x,y,z) { return (x ^ y ^ z); }
	function I(x,y,z) { return (y ^ (x | (~z))); }
 
	function FF(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function GG(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function HH(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function II(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1=lMessageLength + 8;
		var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
		var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
		var lWordArray=Array(lNumberOfWords-1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while ( lByteCount < lMessageLength ) {
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount-(lByteCount % 4))/4;
		lBytePosition = (lByteCount % 4)*8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
		lWordArray[lNumberOfWords-2] = lMessageLength<<3;
		lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
		return lWordArray;
	};
 
	function WordToHex(lValue) {
		var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
		for (lCount = 0;lCount<=3;lCount++) {
			lByte = (lValue>>>(lCount*8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
		}
		return WordToHexValue;
	};
 
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	};
 
	var x=Array();
	var k,AA,BB,CC,DD,a,b,c,d;
	var S11=7, S12=12, S13=17, S14=22;
	var S21=5, S22=9 , S23=14, S24=20;
	var S31=4, S32=11, S33=16, S34=23;
	var S41=6, S42=10, S43=15, S44=21;
 
	string = Utf8Encode(string);
 
	x = ConvertToWordArray(string);
 
	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
 
	for (k=0;k<x.length;k+=16) {
		AA=a; BB=b; CC=c; DD=d;
		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
		d=GG(d,a,b,c,x[k+10],S22,0x2441453);
		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
		b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
		b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
		c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
		a=II(a,b,c,d,x[k+0], S41,0xF4292244);
		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
		c=II(c,d,a,b,x[k+6], S43,0xA3014314);
		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
		b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
		a=AddUnsigned(a,AA);
		b=AddUnsigned(b,BB);
		c=AddUnsigned(c,CC);
		d=AddUnsigned(d,DD);
	}
 
	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
 
	return temp.toLowerCase();
};

/**
*
*  Secure Hash Algorithm (SHA1)
*  http://www.webtoolkit.info/
*
**/
 
function SHA1 (msg) {
 
	function rotate_left(n,s) {
		var t4 = ( n<<s ) | (n>>>(32-s));
		return t4;
	};
 
	function lsb_hex(val) {
		var str="";
		var i;
		var vh;
		var vl;
 
		for( i=0; i<=6; i+=2 ) {
			vh = (val>>>(i*4+4))&0x0f;
			vl = (val>>>(i*4))&0x0f;
			str += vh.toString(16) + vl.toString(16);
		}
		return str;
	};
 
	function cvt_hex(val) {
		var str="";
		var i;
		var v;
 
		for( i=7; i>=0; i-- ) {
			v = (val>>>(i*4))&0x0f;
			str += v.toString(16);
		}
		return str;
	};
 
 
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	};
 
	var blockstart;
	var i, j;
	var W = new Array(80);
	var H0 = 0x67452301;
	var H1 = 0xEFCDAB89;
	var H2 = 0x98BADCFE;
	var H3 = 0x10325476;
	var H4 = 0xC3D2E1F0;
	var A, B, C, D, E;
	var temp;
 
	msg = Utf8Encode(msg);
 
	var msg_len = msg.length;
 
	var word_array = new Array();
	for( i=0; i<msg_len-3; i+=4 ) {
		j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
		msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
		word_array.push( j );
	}
 
	switch( msg_len % 4 ) {
		case 0:
			i = 0x080000000;
		break;
		case 1:
			i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
		break;
 
		case 2:
			i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
		break;
 
		case 3:
			i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8	| 0x80;
		break;
	}
 
	word_array.push( i );
 
	while( (word_array.length % 16) != 14 ) word_array.push( 0 );
 
	word_array.push( msg_len>>>29 );
	word_array.push( (msg_len<<3)&0x0ffffffff );
 
 
	for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
 
		for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
		for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
 
		A = H0;
		B = H1;
		C = H2;
		D = H3;
		E = H4;
 
		for( i= 0; i<=19; i++ ) {
			temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
 
		for( i=20; i<=39; i++ ) {
			temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
 
		for( i=40; i<=59; i++ ) {
			temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
 
		for( i=60; i<=79; i++ ) {
			temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
 
		H0 = (H0 + A) & 0x0ffffffff;
		H1 = (H1 + B) & 0x0ffffffff;
		H2 = (H2 + C) & 0x0ffffffff;
		H3 = (H3 + D) & 0x0ffffffff;
		H4 = (H4 + E) & 0x0ffffffff;
 
	}
 
	var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
 
	return temp.toLowerCase();
 
};

