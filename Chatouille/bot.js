/*
Classe Bot
*/

var Bot = function(tag, bname)
{
	this.tag = tag;
	this.name = bname;
}

Bot.prototype.Talk = function(content, clients)
{
	var message = new Message(this.tag, this.name, content);
	
	for(var c in clients)
		clients[c].socket.emit('new_message', message);
}