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

function Build_Index_Page(result, html)
{
	console.log(result);
	var last_ten = "<ul>";
	result.forEach(function(index) {
		var link_name = (index.name).split("_")[2];
		link_name = link_name.replace(/-/g," ");
		link_name = link_name.chunk(30)[0];
		last_ten += "<li><a href='/discussion/"+index.name+"' target='blank'/>"+link_name+"...</a></li>"
	});
	last_ten += "</ul>";
	html = plates.bind(html, {"ten_last_content" : last_ten});
	
	return html;
}

String.prototype.chunk = function(size) {
    return [].concat.apply([],
        this.split('').map(function(x,i){ return i%size ? [] : this.slice(i,i+size) }, this)
    )
}