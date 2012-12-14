/*
Classe ChatRoom
Va gérer les interractions entre les utilisateurs connectés à la chatroom ainsi que divers évenements 
(insertion des messages et des discutions en base, connection, déconnection d'utilisateurs...)
*/

var ChatRoom = function(tag)
{
	this.tag = tag;
	this.clients = new Array();
	this.c_count = 0;
	this.blankTime = 0; // temps en seconde durant lequel personne ne parle
	this.talk = new Array();
	this.bot = new Bot(tag, 'MrChatouille');
	this.tweetMgr = new TweetMgr(this.tag);
	this.roles = new Array();
	
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
				_this.ArchiveTalk(tlk, function(archive)
				{
					delete _this.talk;
					_this.talk = new Array();
					if(archive)
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
	this.c_count++;
	
	if(this.c_count <= 1)
		this.roles[id] = 'admin';
	else
		this.roles[id] = 'user';
		
	this.SendConnectedUsers();
	
	if(this.talk.length > 0)
		this.DisplayTalk(id);
		
	this.bot.Talk(client.nickName + " s'est connecté.", this.clients);
}

ChatRoom.prototype.DisplayTalk = function(id)
{
	for(var t in this.talk)
		this.clients[id].socket.emit('new_message', this.talk[t]);
}

ChatRoom.prototype.ClientQuit = function(id)
{
	if(this.clients[id])
		this.ExitClient(id, this.clients[id].nickName + " a quitté le salon.");
}

ChatRoom.prototype.ClientDisconnect = function(id)
{
	if(this.clients[id])
		this.ExitClient(id, this.clients[id].nickName + " s'est déconnecté.");
}

ChatRoom.prototype.ExitClient = function(id, message)
{
	var nickname = this.clients[id].nickName;
	var role = this.roles[id];
	
	delete this.clients[id];
	this.clients.splice(id, 1);
	delete this.roles[id]; 
	this.roles.splice(id, 1);
	
	this.c_count--;
	if(role == 'admin' && this.c_count > 0)
	{
		// relativement sale mais je ne vois pas comment faire autrement
		for(var r in this.roles)
		{
			this.roles[r] = 'admin';
			break;
		}
	}
	
	this.SendConnectedUsers();
	this.bot.Talk(message, this.clients);
}

ChatRoom.prototype.NewMessage = function(clientId, content)
{
	if(this.clients[clientId])
	{
		if(this.bot.Listen(clientId, new Date()))
			this.Kick(clientId);
		else
			this.DispatchMessage(new Message(this.tag, this.clients[clientId].nickName, content));
	}
}

ChatRoom.prototype.Kick = function(id)
{
	this.clients[id].socket.emit('kick', this.tag);
}

ChatRoom.prototype.KickEnd = function(id)
{
	if(this.clients[id])
		this.ExitClient(id, "J'ai kické " + this.clients[id].nickName + " car il floodait. Bien fait pour sa gueule.");
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
	if(tlk.messages.length < 10)
	{
		cb(false);
		return;
	}
	
	var messages = tlk.messages;
	var chaters = new Array();
	var moreThanOneChater = false;
	for(var m in messages)
	{
		if(messages[m].from == 'user')
		{
			if(chaters.length > 0 && chaters[0] != messages[m].nickName)
			{
				moreThanOneChater = true;
				break;
			}
			chaters.push(messages[m].nickName);
		}
	}
	if(!moreThanOneChater)	
	{
		cb(false);
		return;
	}
	
	dbMgr.Exec(function()
	{
		db.collection('talks', function(err, collection)
		{
			collection.insert(tlk, function(err, result)
			{
				cb(true);
			});
		});
	});
}

ChatRoom.prototype.SendConnectedUsers = function()
{
	var connected_users = new Array();
	
	connected_users.push({nickname: this.bot.name, role: 'bot'});
	for(var c in this.clients)
		connected_users.push({nickname: this.clients[c].nickName, role: this.roles[c]});
		
	for(var c in this.clients)
		this.clients[c].socket.emit('connected_users', {tag:this.tag, users:connected_users});
}




