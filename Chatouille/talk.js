/*
Talk Object
*/

var Talk = function(mess)
{
	this.messages = mess;
	// name : tag_pseudo_les-premiers-mots-de-la-discution
	this.name = mess[0].tag + '_' + mess[0].nickName + '_' + mess[0].content.replace(' ', '-');
}