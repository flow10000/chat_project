function Build_Dicussion_Page(data, previous_talk, next_talk, html)
{
	var discussions = "";
	var date = "";
	var previous = "<<<<<<";
	var next=">>>>>>";
	var tag = "";
	
	var discussion = "<ul>";
	data.messages.forEach(function(message) {
		discussion += "<li><strong>" + message.nickName + "</strong> : " + message.content + "</li>";
		tag = message.tag;
    });
	discussion +="</ul>";
	date = "Chatroom : "+tag+"<br />Discussion du : "+ data.date.getDate() +"/"+((data.date).getMonth()+1)+"/"+data.date.getFullYear();
	if(previous_talk != "" && previous_talk != "undefined" )
		previous = "<a href='/discussion/"+previous_talk+"'/><<<<<<</a>";
	if(next_talk != "" && next_talk != "undefined")
		next = "<a href='/discussion/"+next_talk+"'/>>>>>>></a>";
	
	
	html = plates.bind(html, {"discussion" : discussion, "discussion_title" : date, "previous" : previous, "next": next});

	return html;
}