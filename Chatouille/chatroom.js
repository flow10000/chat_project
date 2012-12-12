/*
Chatroom Object
*/


var ChatRoom = function()
{
	this.clients = new Array();
}

ChatRoom.prototype.NewClient = function(id, client)
{
	this.clients[id] =  client;
}

ChatRoom.prototype.ClientDisconnect = function(id)
{
	if(clients[id])
	{
		delete this.clients[id];
		this.clients.splice(id, 1);
	}
}

ChatRoom.prototype.NewMessage = function(clientId, content)
{
	var message = this.clients[clientId].nickName + ' : ' + content;
	for(var c in this.clients)
	{
		this.clients[c].socket.emit('newMessage', content);
	}
}