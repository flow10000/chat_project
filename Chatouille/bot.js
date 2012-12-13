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
	content = this.name + ' : ' + content;
	for(var c in clients)
		clients[c].socket.emit('new_message', {tag:this.tag, content:content});
}