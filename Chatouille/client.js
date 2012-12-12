/*
Classe Client
Représente un client connecté sur le chat
*/

var Client = function(sock)
{
	this.socket = sock;
	this.nickName = 'anonyme';
}