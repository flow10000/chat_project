/*
Classe DbMgr
Va gérer les acces à la base de donner et ainsi eviter certains conflits
*/

var DbMgr = function()
{
	this.ExecFifo = new Array();
	this.isOpen = false;
	
	var _this = this;
	setInterval(function()
	{
		_this.ExecFirstInFifo();
	}, 50);
}

DbMgr.prototype.ExecFirstInFifo = function()
{
	if(this.ExecFifo.length > 0 && !this.lock)
	{
		var tmp = this.ExecFifo.shift();
		this.Exec(tmp);
	}
}

DbMgr.prototype.Exec = function(query)
{
	var _this = this;
	if(!_this.isOpen)
	{
		_this.isOpen = true;
		db.open(function(err, db)
		{
			if(!err)
			{
				query();
				db.close();
				_this.isOpen = false;
			}
			else
			{
				_this.ExecFifo.push(new Query(query, cb));
				_this.isOpen = false;
			}
		});
	}
	else
		_this.ExecFifo.push(query);
}