/*
Classe Talk
Représente une discution archivée
*/

var Talk = function(messages)
{
	this.messages = messages;
	this.date = new Date();
	this.name = this.CleanStr(messages[0].tag) + '_' + this.CleanStr(messages[0].nickName) + '_' + this.CleanStr(messages[0].content);
}

Talk.prototype.CleanStr = function(str)
{
	str = str.replace(/é|è|ê|ë/g, 'e').replace(/à|â/g, 'a').replace(/î|ï/g, 'i').replace(/ô|ö/g, 'o').replace(/û|ü|ù/g, 'u').replace(/ç/g, 'c').replace(/[^a-zA-Z0-9_' ]/g, '').replace(/'/g, '-');
	var old = '';
	while(old != str)
    {
        old = str;
        str = str.replace(/  /g, ' ');
    }
	str = str.trim().replace(/ /g, '-');
	return str;
}