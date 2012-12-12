/*
Classe Talk
Représente une discution archivée
*/

var Talk = function(messages)
{
	this.messages = messages;
	
	var firstMessage = messages[0].content;
	firstMessage = firstMessage.replace(/é|è|ê|ë/g, 'e').replace(/à|â/g, 'a').replace(/î|ï/g, 'i').replace(/ô|ö/g, 'o').replace(/û|ü|ù/g, 'u').replace(/ç/g, 'c');
	firstMessage = firstMessage.replace(/[^a-zA-Z0-9_' ]/g, '').replace(/'/g, '-');
	var old = '';
    while(old != firstMessage)
    {
        old = firstMessage;
        firstMessage = firstMessage.replace(/  /g, ' ');
    }
	firstMessage = firstMessage.trim();
	
	
	// name : tag_pseudo_les-premiers-mots-de-la-discution
	this.name = messages[0].tag + '_' + messages[0].nickName + '_' + firstMessage.replace(/ /g, '-');
	this.date = new Date();
}