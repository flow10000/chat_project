var plugin_path = "../node_modules/";
function Get_Plugin_Path(plugin_name)
{
	return plugin_path+plugin_name;
}

var flatiron = require(Get_Plugin_Path('flatiron')),
    path = require('path'),
    app = flatiron.app,
	fs = require("fs"),
	connect = require('connect');


var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    server = new Server('localhost', 27017, {auto_reconnect: true, safe:true}),
    db = new Db('chatouilles', server);
	

eval(fs.readFileSync('routes.js', encoding = "utf-8"));
eval(fs.readFileSync('client.js', encoding = "utf-8"));
eval(fs.readFileSync('chatroom.js', encoding = "utf-8"));
eval(fs.readFileSync('bot.js', encoding = "utf-8"));
eval(fs.readFileSync('message.js', encoding = "utf-8"));

//eval(fs.readFileSync('dbentity.js', encoding = "utf-8"));

//app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

//app.use(flatiron.plugins.http);

/*
app.router.get('/', function () {
  this.res.json({ 'hello': 'world' })
});
*/
//var dbEntity = new dbEntity(mongodb);

var clients = new Array();
var chatRoom = new ChatRoom(/*dbEntity*/);

app.start(3000);

var io = require('socket.io').listen(app.server, { log: false });

io.sockets.on('connection', function(socket)
{
	console.log("new client: " + socket.id);
	clients[socket.id] = new Client(socket);
	
	// connect client to chatroom
	chatRoom.NewClient(socket.id, clients[socket.id]);
	
	socket.on('new_message', function(content)
	{
		chatRoom.NewMessage(socket.id, content);
	});
	
	socket.on('nickname', function(n)
	{
		var old = clients[socket.id].nickName;
		clients[socket.id].nickName = n;
		chatRoom.UserChangeNickName(old, n);
	});

	socket.on('disconnect', function()
	{
		// disconect client from chatroom
		chatRoom.ClientDisconnect(socket.id);
		
		delete clients[socket.id];
		clients.splice(socket.id, 1);
	});
});




