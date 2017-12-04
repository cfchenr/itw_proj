document.getElementById("menuLeagues").addEventListener('click', function() {
	var length = $("#content").children().length;
	for(var i = 0; i < length; i++) {
		$("#content").children()[0].remove();
	}
	$.ajax({
		url: "http://192.168.160.28/football/api/leagues/",
		success: function(data) {
			var table = document.createElement("table");
			for(var i = 0; i < data.length; i++) {
				var tr = document.createElement("tr");
				var td = document.createElement("td");
				var a  = document.createElement("a");
				a.setAttribute("href", "#leagues/"+data[i].id);
				a.setAttribute("id", "team");
				a.innerText = data[i].name;
				td.appendChild(a);
				tr.appendChild(td);
				table.appendChild(tr);
			}
			document.getElementById("content").appendChild(table);
		},
		error: function() {
			alert("Error!");
		}
	})
})
document.getElementById("team").addEventListener('click', function() {
	console.log("THERE");
	var length = $("#content").children().length;
	for(var i = 0; i < length; i++) {
		$("#content").children()[0].remove();
	}
	console.log($(this).attr("href"));
});