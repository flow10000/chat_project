function trim(str, chars) {
	return ltrim(rtrim(str, chars), chars);
}

function ltrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
 
function rtrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.chunk = function(size) {
    return [].concat.apply([],
        this.split('').map(function(x,i){ return i%size ? [] : this.slice(i,i+size) }, this)
    )
}

function Get_Emoticon(content)
{
	var path="";
	var emotes = [
		[':\\\)', 'smile.png'],
		[':\\\(', 'frown.png'],
		[':-\\\)', 'smile.png'],
		[':-\\\(', 'frown.png'],
		[';\\\)', 'wink.png'],
		[';-\\\)', 'wink.png'],
		['^\\\^\\\^', 'lol.png'],
		['-_\\\-', 'boring.png'],
		[':\\\o', 'oh.png'],
		[':-D', 'biggrin.png'],
		[':-d', 'biggrin.png'],
		[':d', 'biggrin.png'],
		[':D', 'biggrin.png'],
		[':\\\\', 'neutral.png'],
		[':p', 'winktongue.png'],
		[':-p', 'winktongue.png'],
		['xd', 'olol.png'],
		['xD', 'olol.png'],
		[':s', 'confused.png'],
		[':-s', 'confused.png'],
		[':S', 'confused.png'],
		[':-S', 'confused.png']
		
	];

	for(var i = 0; i < emotes.length; i++){
		content = content.replace(new RegExp(emotes[i][0], 'gi'), '<img src="/img/emotes/' + emotes[i][1] + '">');
	}
	
	return content;
}