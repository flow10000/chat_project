/*
Classe ChatRoom
Va gérer les interractions entre les utilisateurs connectés à la chatroom ainsi que divers évenements 
(insertion des messages et des discutions en base, connection, déconnection d'utilisateurs...)
*/

var ChatRoom = function(tag)
{
	this.tag = tag;
	this.clients = new Array();
	this.blankTime = 0; // temps en seconde durant lequel personne ne parle
	this.talk = new Array();
	this.bot = new Bot(tag, 'MrChatouille');
	this.tweetMgr = new TweetMgr(this.tag);
	
	var _this = this;
	setInterval(function()
	{
		if(_this.talk.length > 0)
		{
			_this.blankTime++;
			
			//if(_this.blankTime > 20) // 20 secondes pour les tests
			if(_this.blankTime > 300) // 5 minutes en conditions réelles
			{
				var tlk = new Talk(_this.talk);
				_this.ArchiveTalk(tlk, function()
				{
					_this.talk = new Array();
					_this.bot.Talk("Retrouvez cette discution ici : <a href='http://localhost:3000/discussion/" + tlk.name + "' target='blank'>http://localhost:3000/discussion/" + tlk.name + "</a>", _this.clients);
				});
			}
		}
	}, 1000);
	
	if(_this.tag != 'general')
	{
		setInterval(function()
		{
			_this.tweetMgr.Get(function(tweets)
			{
				_this.NewTweets(tweets);
			});
		}, 10000);
	}
}


ChatRoom.prototype.NewClient = function(id, client)
{
	this.clients[id] = client;
	this.SendConnectedUsers();
	
	if(this.talk.length > 0)
		this.DisplayTalk(id);
		
	this.bot.Talk(client.nickName + " s'est connecté.", this.clients);
}

ChatRoom.prototype.DisplayTalk = function(id)
{
	for(var t in this.talk)
		this.clients[id].socket.emit('new_message', this.talk[t]);
		//this.clients[id].socket.emit('new_message', {tag:this.tag, content:this.talk[t].nickName + ' : ' + this.talk[t].content});
}

ChatRoom.prototype.ClientQuit = function(id)
{
	if(this.clients[id])
	{
		var nickname = this.clients[id].nickName;
		delete this.clients[id];
		this.clients.splice(id, 1);
		this.SendConnectedUsers();
		this.bot.Talk(nickname + " à quitté le salon.", this.clients);
	}
}

ChatRoom.prototype.ClientDisconnect = function(id)
{
	if(this.clients[id])
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
}

ChatRoom.prototype.NewMessage = function(clientId, content)
{
	//var txtmessage = this.clients[clientId].nickName + ' : ' + content;
	
	
	var mess = new Message(this.tag, this.clients[clientId].nickName, content);
	this.DispatchMessage(mess);
	
	/*
	for(var c in this.clients)
		this.clients[c].socket.emit('new_message', mess);
		//this.clients[c].socket.emit('new_message', {tag:this.tag, content:txtmessage});
	
	this.SaveMessage(mess);
	this.blankTime = 0;
	
	if(this.talk.length > 0 || content.split(' ').length >= 5)
		this.talk.push(mess);
		*/
}

ChatRoom.prototype.NewTweets = function(tweets)
{
	for(var t in tweets)
	{
		var mess = tweets[t];
		this.DispatchMessage(mess);
	}
}

ChatRoom.prototype.DispatchMessage = function(message)
{
	for(var c in this.clients)
		this.clients[c].socket.emit('new_message', message);
		
	this.SaveMessage(message);
	this.blankTime = 0;
	
	if(this.talk.length > 0 || message.content.split(' ').length >= 5)
		this.talk.push(message);
}

ChatRoom.prototype.UserChangeNickName = function(old, n)
{
	this.bot.Talk(old + " est maintenant connu sous le pseudonyme " + n, this.clients);
	this.SendConnectedUsers();
}

ChatRoom.prototype.SaveMessage = function(message)
{
	dbMgr.Exec(function()
	{
		db.collection('messages', function(err, collection)
		{
			collection.insert(message, function(err, result)
			{
			});
		});
	});
}

ChatRoom.prototype.ArchiveTalk = function(tlk, cb)
{
	dbMgr.Exec(function()
	{
		db.collection('talks', function(err, collection)
		{
			collection.insert(tlk, function(err, result)
			{
				cb();
			});
		});
	});
}

ChatRoom.prototype.SendConnectedUsers = function()
{
	var connected_users = new Array();
	connected_users.push(this.bot.name);
	for(var c in this.clients)
			connected_users.push(this.clients[c].nickName);

	for(var c in this.clients)
		this.clients[c].socket.emit('connected_users', {tag:this.tag, users:connected_users});
		
	
}