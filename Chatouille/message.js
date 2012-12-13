/* 
Classe Message
Représente un message
*/

var Message = function(t, nick, ct)
{
	this.from = 'user'; // ou tweeter
	this.tag = t;
	this.nickName = nick;
	this.content = ct;
	this.time = new Date();
}