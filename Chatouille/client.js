/*
Classe Client
Représente un client connecté sur le chat
*/

var Client = function(sock, nick)
{
	this.socket = sock;
	this.nickName = nick;
}