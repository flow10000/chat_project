/*
Classe Client
Repr�sente un client connect� sur le chat
*/

var Client = function(sock, nick)
{
	this.socket = sock;
	this.nickName = nick;
}