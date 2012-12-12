eval(fs.readFileSync('utils.js', encoding = "utf-8"));
var html_path = "/public/";

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.http, {
	onError: function (err) {
		var self = this;
		fs.readFile(__dirname + html_path+ '/views/404.html','utf-8', function (error, page404) {
			self.res.writeHead(err.status || 404, { 'Content-Type': 'text/html;charset=utf-8' });
			self.res.end(page404,'utf-8');
		});
		
	},
	before : [connect.static("public")]
});

app.router.get('/', function () {
    var self = this ;
    fs.readFile(__dirname + html_path+'index.html','utf-8', function (err, html) {
        if (err) {
            self.res.writeHead(404);
            return self.res.end('La page demandée est introuvable');
        }
        self.res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
        self.res.end(html,'utf-8');

    });
});


app.router.get('/discussion/:address', function (address) {
    var self = this ;
    fs.readFile(__dirname + html_path+ '/views/discussion.html','utf-8', function (err, html) {

		/*talks.find({name:address}).toArray(function(err, results) {
			if (results.length>0)
			{
				console.log(results[0].messages);
				http_code= 200;
				content.content = "j'aime la merde";
				html = plates.bind(html,content);
				self.res.writeHead(http_code,{'Content-Type': 'text/html;charset=utf-8'});
				self.res.end(html,'utf-8');
			}
			else
			{
				fs.readFile(__dirname + html_path+ '/views/404.html','utf-8', function (error, page404) {
					self.res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
					self.res.end(page404,'utf-8');
				});
			}
        });*/
		
		dbMgr.Exec(function()
		{
			db.collection('talks', function(err, collection)
			{
		
				collection.findOne({name:address}, function(err, data)
				{
					if (data)
					{
						var previous_talk = "";
						var next_talk = "";
						
						collection.find({}, {_id: 1, name:1}, {sort: {_id: 1}}).toArray(function(err, result) {
							for(var i = 0; i < result.length; i++) {
								if(String(result[i]._id) == String(data._id)) {
									if(result[i - 1]) {
										previous_talk = result[i - 1].name;
										
									}
									if(result[i + 1]) {
										next_talk = result[i + 1].name;
									}
									break;
								}
							}
							
						html = Build_Dicussion_Page(data,previous_talk, next_talk, html);
						self.res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
						self.res.end(html,'utf-8');
							
						});
					}
					else
					{
						fs.readFile(__dirname + html_path+ '/views/404.html','utf-8', function (error, page404) {
							self.res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
							self.res.end(page404,'utf-8');
						});
					}
				
				});
			});
		});
		});
});