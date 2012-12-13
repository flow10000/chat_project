/*
Classe Talk
Repr�sente une discution archiv�e
*/

var Talk = function(messages)
{
	this.messages = messages;
	this.date = new Date();
	this.name = this.CleanStr(messages[0].tag) + '_' + this.CleanStr(messages[0].nickName) + '_' + this.CleanStr(messages[0].content);
}

Talk.prototype.CleanStr = function(str)
{
	str = str.replace(/�|�|�|�/g, 'e').replace(/�|�/g, 'a').replace(/�|�/g, 'i').replace(/�|�/g, 'o').replace(/�|�|�/g, 'u').replace(/�/g, 'c').replace(/[^a-zA-Z0-9_' ]/g, '').replace(/'/g, '-');
	var old = '';
	while(old != str)
    {
        old = str;
        str = str.replace(/  /g, ' ');
    }
	str = str.trim().replace(/ /g, '-');
	return str;
}