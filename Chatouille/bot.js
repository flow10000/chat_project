/*
Classe Bot
*/

var Bot = function(bname)
{
	this.name = bname;
}

Bot.prototype.Talk = function(content, clients)
{
	content = this.name + ' : ' + content;
	for(var c in clients)
		clients[c].socket.emit('new_message', content);
}