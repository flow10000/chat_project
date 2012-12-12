var html_path = "/public/";

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.http, { before : [connect.static("public")] });


app.router.get('/', function () {
    var self = this ;
    fs.readFile(__dirname + html_path+'index.html','utf-8', function (err, html) {
        if (err) {
            self.res.writeHead(404);
            return self.res.end('index.html introuvable');
        }
        self.res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
        self.res.end(html,'utf-8');

    });
});


