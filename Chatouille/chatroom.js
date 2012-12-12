/*
Chatroom Object
*/


var ChatRoom = function(/*db*/)
{
	//this.dbEntity = db;
	this.clients = new Array();
	this.blankTime = 0; // time in second where nobody talks
	this.talk = new Array();
	this.bot = new Bot('MrChatouille');
	
	var _this = this;
	setInterval(function()
	{
		if(_this.talk.length > 0)
		{
			_this.blankTime++;
			if(_this.blankTime > 300)
				_this.ArchiveTalk();
		}
	}, 1000);
}

ChatRoom.prototype.NewClient = function(id, client)
{
	this.clients[id] = client;
	this.SendConnectedUsers();
	this.bot.Talk(client.nickName + " s'est connecté.", this.clients);
}

ChatRoom.prototype.ClientDisconnect = function(id)
{
	var nickname = this.clients[id].nickName;
	if(this.clients[id])
	{
		delete this.clients[id];
		this.clients.splice(id, 1);
	}
	
	this.SendConnectedUsers();
	this.bot.Talk(nickname + " s'est déconnecté.", this.clients);
}

ChatRoom.prototype.NewMessage = function(clientId, content)
{
	var txtmessage = this.clients[clientId].nickName + ' : ' + content;
	for(var c in this.clients)
	{
		this.clients[c].socket.emit('new_message', txtmessage);
	}
	
	var mess = new Message('general', this.clients[c].nickName, content);
	
	// TODO on enregistre le message en base
	this.SaveMessage(mess);
	this.blankTime = 0;
	
	if(this.talk > 0 || content.split(' ').lenght >= 5)
		this.talk.push(mess);
}

ChatRoom.prototype.UserChangeNickName = function(old, n)
{
	this.bot.Talk(old + " s'apelle maintenant " + n, this.clients);
	this.SendConnectedUsers();
}

ChatRoom.prototype.SaveMessage = function(message)
{
	db.open(function (err, db) 
	{
		if(!err) 
		{
			db.collection('messages', function(err, collection)
			{
				collection.insert(message, function(err, result)
				{
					console.log('message enregistré');
					db.close();
				});
			});
		}
		else
			console.log(err);
	});
            
}

ChatRoom.prototype.ArchiveTalk = function()
{
	// on archive la conversation
	
	
	this.talk = new Array();
}

ChatRoom.prototype.SendConnectedUsers = function()
{
	var connected_users = new Array();
	connected_users.push(this.bot.name);
	for(var c in this.clients)
			connected_users.push(this.clients[c].nickName);

	for(var c in this.clients)
		this.clients[c].socket.emit('connected_users', connected_users);
}





