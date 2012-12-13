/*
Classe TweetMgr
Va permettre de gérer les twwets selon un tag
*/


var TweetMgr = function(tag)
{
	this.tag = tag;
	this.lastid = 0;
	this.GetLastId(function()
	{});
}

TweetMgr.prototype.Get = function(cb)
{
	var _this = this;
	_this.GetLastId(function()
	{
		var data = '';
		http.get("http://search.twitter.com/search.json?q="+_this.tag+"&lang=fr&result_type=recent&since_id="+_this.lastid, function(req)
		{
			req.setEncoding('utf8');
			req.on('data', function(result) {
				data += result;
			});
			
			req.on('end',function()
			{
				var tweets = new Array();
				var obj = JSON.parse(data);
				var results = obj.results;
				
				for(var t in results)
				{
					var tweet = new Message(_this.tag, results[t].from_user_name, results[t].text);
					tweet.from = 'tweeter';
					tweet.time = results[t].created_at;
					tweets.push(tweet);
				}
					
				cb(tweets);
			});
		});
	});
}

TweetMgr.prototype.GetLastId = function(cb)
{
	var _this = this;
	
	var data = '';
	http.get("http://search.twitter.com/search.json?q="+_this.tag+"&lang=fr&result_type=recent&rpp=1&page=1", function(req) 
	{
		req.setEncoding('utf8');
		req.on('data', function(result) {
			data += result;
		});
		
		req.on('end',function()
		{
			var obj = JSON.parse(data);
			
			if(_this.lastid != obj.max_id)
			{
				cb();
				_this.lastid = obj.max_id;
			}
		});
	});
}