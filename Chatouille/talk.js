/*
Classe Talk
Repr�sente une discution archiv�e
*/

var Talk = function(messages)
{
	this.messages = messages;
	
	var firstMessage = messages[0].content;
	firstMessage = firstMessage.replace(/�|�|�|�/g, 'e').replace(/�|�/g, 'a').replace(/�|�/g, 'i').replace(/�|�/g, 'o').replace(/�|�|�/g, 'u').replace(/�/g, 'c');
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