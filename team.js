$(document).ready(function () {
	var vm = function() {
		console.log('ViewModel initiated...');
		//---Variáveis locais
		var self = this;
		var url = window.location.href;
		var teamID = url.split("=")[1];
		var baseUri = 'http://192.168.160.28/football/api/teams/'+ teamID;
		self.className = 'League';
		self.description = 'This page serves to view team details.';
		self.error = ko.observable();
		self.team = ko.observableArray([]);
		self.seasons = ko.observableArray([]);
		self.seasonsIdx = ko.observableArray([]);
		self.idTEAM = teamID;
		//--- Internal functions
		function ajaxHelper(uri, method, data) {
			self.error(''); //Clear error message
			return $.ajax({
				type: method,
				url: uri,
				dataType: 'json',
				contentType: 'application/json',
				data: data ? JSON.stringify(data) : null,
				error: function(jqXHR, textStatus, errorThrown) {
					console.log("AJAX Call [" + uri + "] Fail...");
					self.error(errorThrown);
				}
			})
		}
		//--- External functions (accessible outside)
		self.getTeam = function() {
			console.log('CALL: getTeam...');
			ajaxHelper(baseUri, 'GET').done(function(data) {
				console.log(data);							
				self.team(data);
				console.log('CALL: getSeasons...');
				var baseUri = 'http://192.168.160.28/football/api/teams/seasons/'+ teamID;
				ajaxHelper(baseUri, 'GET').done(function(data) {
					self.seasons(data);
					var aux = "[";
					for(var i = 0; i < self.seasons().length; i++) {
						aux +='{"season":"'+self.seasons()[i].Label.split("/")[1].charAt(2) + self.seasons()[i].Label.split("/")[1].charAt(3)+'","team_fifa_api_id":"'+self.team().team_fifa_api_id+'"}';
						if(i < self.seasons().length-1) aux += ",";
					}
					aux += "]"
					self.seasonsIdx(JSON.parse(aux));
					makeChartScript(seasons);		
				});
			});
		};
		//--- Initial call
		self.getTeam();
	};
	ko.applyBindings(vm);
});
function makeChartScript (seasons) {
	console.log(self.seasons());
	for (var i = 0; i < self.seasons().length; i++) {
		if (self.seasons()[i].Attributes != null) {
			var chart = AmCharts.makeChart( "chartdiv", {
				"type": "radar",
				"theme": "light",
				"dataProvider": [ {
						"attribute": "Dribbling (" + self.seasons()[0].Attributes.buildupplaydribbling + ")",
						"value": self.seasons()[0].Attributes.buildupplaydribbling,
						"color": "#fdd400"					}, {
						"attribute": "Passing (" + self.seasons()[0].Attributes.buildupplaypassing + ")",
						"value": self.seasons()[0].Attributes.buildupplaypassing,
						"color": "#fdd400"
					}, {
						"attribute": "Speed (" + self.seasons()[0].Attributes.buildupplayspeed + ")",
						"value": self.seasons()[0].Attributes.buildupplayspeed,
						"color": "#fdd400"
					}, {
						"attribute": "Chance creation by crossing (" + self.seasons()[0].Attributes.chancecreationcrossing + ")",
						"value": self.seasons()[0].Attributes.chancecreationcrossing,
						"color": "#cc4748"
					}, {
						"attribute": "Chance creation by passing (" + self.seasons()[0].Attributes.chancecreationpassing + ")",
						"value": self.seasons()[0].Attributes.chancecreationpassing,
						"color": "#cc4748"
					}, {
						"attribute": "Chance creation by shooting (" + self.seasons()[0].Attributes.chancecreationshooting + ")",
						"value": self.seasons()[0].Attributes.chancecreationshooting,
						"color": "#cc4748"
					}, {
						"attribute": "Defence agression (" + self.seasons()[0].Attributes.defenceaggression + ")",
						"value": self.seasons()[0].Attributes.defenceaggression,
						"color": "#67b7dc"
					}, {
						"attribute": "Defence pressure (" + self.seasons()[0].Attributes.defencepressure + ")",
						"value": self.seasons()[0].Attributes.defencepressure,
						"color": "#67b7dc"
					}, {
						"attribute": "Defence team width (" + self.seasons()[0].Attributes.defenceteamwidth + ")",
						"value": self.seasons()[0].Attributes.defenceteamwidth,
						"color": "#67b7dc"
				} ],
				"valueAxes": [ {
					"axisTitleOffset": 20,
					"minimum": 0,
					"axisAlpha": 0.15,
				} ],
				"startDuration": 0,
				"graphs": [ {
					"balloonText": "[[value]] value of attribute",
					"bullet": "round",
					"lineThickness": 2,
					"valueField": "value",
					"fillAlphas": 0.3
				} ],
				"categoryField": "attribute",
				"listeners": [{
					"event": "rendered",
					"method": updateLabels
				}, {
					"event": "resized",
					"method": updateLabels
				}],
				"export": {
					"enabled": false
				}
			} )
			function updateLabels(event) {
				var labels = event.chart.chartDiv.getElementsByClassName("amcharts-axis-title");
				for (var i = 0; i < labels.length; i++) {
					var color = event.chart.dataProvider[i].color;
					if (color !== undefined) {
						labels[i].setAttribute("fill", color);
					}
				}
			}
			document.getElementById("chartdiv").children[0].children[0].removeChild(document.getElementById("chartdiv").children[0].children[0].children[1]);
			var node = document.getElementById("chartdiv");
			var cloneNode = node.cloneNode(true);
			console.log(document.getElementById("chartdiv"+i));
			document.getElementById("chartdiv"+i).appendChild(cloneNode);
		}		
	}
	document.getElementById("chartdiv").parentNode.removeChild(document.getElementById("chartdiv"));
}
