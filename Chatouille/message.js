/* 
Classe Message
Repr�sente un message
*/

var Message = function(t, nick, ct)
{
	this.tag = t;
	this.nickName = nick;
	this.content = ct;
	this.time = new Date();
}