/*
Classe Client
Repr�sente un client connect� sur le chat
*/

var Client = function(sock)
{
	this.socket = sock;
	this.nickName = 'anonyme';
}