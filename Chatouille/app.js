/*
	App.js
	contient une liste des clients connecté et une chatroom.
	se charge de récupérer les entrées
*/
var flatiron = require('flatiron'),
    path = require('path'),
    app = flatiron.app,
	fs = require("fs"),
	plates = require('plates'),
	connect = require('connect'),
	sanitizer = require('sanitizer');


var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    server = new Server('localhost', 27017, {auto_reconnect: true, safe:true}),
    db = new Db('chatouilles', server);
	

var http = require('http');

eval(fs.readFileSync('dbmgr.js', encoding = "utf-8"));
var dbMgr = new DbMgr();
	
eval(fs.readFileSync('routes.js', encoding = "utf-8"));
eval(fs.readFileSync('client.js', encoding = "utf-8"));
eval(fs.readFileSync('chatroom.js', encoding = "utf-8"));
eval(fs.readFileSync('bot.js', encoding = "utf-8"));
eval(fs.readFileSync('message.js', encoding = "utf-8"));
eval(fs.readFileSync('talk.js', encoding = "utf-8"));
eval(fs.readFileSync('tweetMgr.js', encoding = "utf-8"));


var clients = new Array();
var chatRooms = new Array();
chatRooms['general'] = new ChatRoom('general');

app.start(3000);

var io = require('socket.io').listen(app.server, { log: false });

io.sockets.on('connection', function(socket)
{
	console.log("new client: " + socket.id);
	clients[socket.id] = new Client(socket, RdmNickname());
	
	// connect client to chatroom general
	chatRooms['general'].NewClient(socket.id, clients[socket.id]);
	
	socket.on('new_message', function(data)
	{
		data.content = sanitizer.escape(data.content);
		if(chatRooms[data.tag])
			chatRooms[data.tag].NewMessage(socket.id, data.content);
	});
	
	socket.on('join', function(chan)
	{
		if(!chatRooms[chan])
			chatRooms[chan] = new ChatRoom(chan);

		chatRooms[chan].NewClient(socket.id, clients[socket.id]);
	});
	
	socket.on('chanquit', function(chan)
	{
		if(chatRooms[chan])
			chatRooms[chan].ClientQuit(socket.id);
	});
	
	socket.on('kickend', function(chan)
	{
		if(chatRooms[chan])
			chatRooms[chan].KickEnd(socket.id);
	});
	
	socket.on('nickname', function(n)
	{
		if(NickNameAvalaible(n))
		{
			var old = clients[socket.id].nickName;
			clients[socket.id].nickName = n;
			for(var c in chatRooms)
				chatRooms[c].UserChangeNickName(old, n);
		}
	});

	socket.on('disconnect', function()
	{
		// disconect client from chatroom
		for(var c in chatRooms)
		{
			chatRooms[c].ClientDisconnect(socket.id);
			if(c != 'general' && chatRooms[c].clients.length <= 0)
			{
				console.log('delete chanel');
				delete chatRooms[c];
				chatRooms.splice(c, 1);	
			}
		}
		
		delete clients[socket.id];
		clients.splice(socket.id, 1);
	});
	
	
});

function NickNameAvalaible(nick)
{
	if(nick == 'MrChatouille')
		return false;
		
	for(var c in clients)
		if(clients[c].nickName == nick)
			return false;
	
	return true;
}

function RdmNickname()
{
	var nick;
	while(!NickNameAvalaible(nick = ('guest' + (Math.floor(Math.random()*11111111)).toString())))
	{}
	return nick;
}

