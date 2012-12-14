/*
Classe Bot
*/

var Bot = function(tag, bname)
{
	this.tag = tag;
	this.name = bname;
	this.listeners = new Object();
}

Bot.prototype.Talk = function(content, clients)
{
	var message = new Message(this.tag, this.name, content);
	
	for(var c in clients)
		clients[c].socket.emit('new_message', message);
}



Bot.prototype.Listen = function(user_id, date)
{
	if(!this.listeners[user_id])
		this.listeners[user_id] = new Array();
		
	this.listeners[user_id].push(date.getTime());
	
	this.CleanListener(user_id);
	
	if(this.listeners[user_id].length >= 4)
	{
		var average = this.GetAverage(user_id);
		
		if(this.listeners[user_id].length < 10)
		{
			if(this.GetAverage(user_id) < 2000)
				return true;
		}
		else if(this.listeners[user_id].length < 20)
		{
			if(this.GetAverage(user_id) < 5000)
				return true;
		}
		else if(this.listeners[user_id].length < 50)
		{
			if(this.GetAverage(user_id) < 15000)
				return true;
		}
		else
		{
			if(this.GetAverage(user_id) < 25000)
				return true;
		}
	}
	
	return false;
}

Bot.prototype.CleanListener = function(id) // pour virer les messages vieux de plus de 1 minutes
{
	var listener = this.listeners[id];
	currentTimestamp = new Date().getTime();
	
	var removeCount = 0;
	for(var t in listener)
	{
		if(currentTimestamp - listener[t] < 60000)
			break;
		removeCount++;
	}
	
	this.listeners[id].splice(0, removeCount);
}

Bot.prototype.GetAverage = function(id)
{
	var listener = this.listeners[id];
	
	var total = 0;
	var previous = listener[0];
	for(var t = 1; t < listener.length; t++)
	{
		total += listener[t] - previous;
		previous = listener[t]; 
	}
	
	return total / listener.length;
}
















