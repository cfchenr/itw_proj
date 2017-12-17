$(document).ready(function () {
	$('#navbar').load('navbar.html', function () {
		$("#tNav").addClass("active");
	});
	var vm = function () {
		//console.log('ViewModel initiated...');
		//---Variáveis locais
		var self = this;
		var url = window.location.href;
		var teamID = url.split("=")[1];
		var baseUri = 'http://192.168.160.28/football/api/teams/' + teamID;
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
				error: function (jqXHR, textStatus, errorThrown) {
					//console.log("AJAX Call [" + uri + "] Fail...");
					self.error(errorThrown);
				}
			})
		}
		//--- External functions (accessible outside)
		self.getTeam = function () {
			//console.log('CALL: getTeam...');
			ajaxHelper(baseUri, 'GET').done(function (data) {
				self.team(data);
				//console.log('CALL: getSeasons...');
				var baseUri = 'http://192.168.160.28/football/api/teams/seasons/' + teamID;
				ajaxHelper(baseUri, 'GET').done(function (data) {
					self.seasons(data);
					var aux = "[";
					for (var i = 0; i < self.seasons().length; i++) {
						aux += '{"season":"' + self.seasons()[i].Label.split("/")[1].charAt(2) + self.seasons()[i].Label.split("/")[1].charAt(3) + '","team_fifa_api_id":"' + self.team().team_fifa_api_id + '"}';
						if (i < self.seasons().length - 1) aux += ",";
					}
					aux += "]"
					self.seasonsIdx(JSON.parse(aux));
				});
			});
		};
		//--- Initial call
		self.getTeam();
	};
	ko.applyBindings(vm);
});