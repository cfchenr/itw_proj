$(document).ready(function () {
	var vm = function() {
		console.log('ViewModel initiated...');
		//---Variáveis locais
        var self = this;
        var url = window.location.href;
		var matchID = url.split("=")[1];
		var baseUri = 'http://192.168.160.28/football/api/matches/'+matchID;
		self.className = 'Match';
		self.description = 'This page serves to view the specific match.';
		self.error = ko.observable();
        self.match = ko.observableArray([]);
		self.seasonsIdx = ko.observableArray([]);
		self.players = ko.observableArray([]);
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
		self.getMatch = function() {
			console.log('CALL: getMatch...');
			ajaxHelper(baseUri, 'GET').done(function(data) {
                var seasonValue = '[{ "season": "' + data.season.split("/")[1].charAt(2) + data.season.split("/")[1].charAt(3) + '"}]';
                self.seasonsIdx(JSON.parse(seasonValue));
				self.match(data);
				console.log('CALL: getPlayers...');
				for(var i = 0; i < self.match().Home_player.length; i++) {
					idP = self.match().Home_player[i].id;
					ajaxHelper('http://192.168.160.28/football/api/players/'+idP, 'GET').done(function(data) {
						self.players(self.players().concat(data));
					});
				}
				for(var i = 0; i < self.match().Away_player.length; i++) {
					idP = self.match().Away_player[i].id;
					ajaxHelper('http://192.168.160.28/football/api/players/'+idP, 'GET').done(function(data) {
						self.players(self.players().concat(data));
					});
				}
			});
		};
		//--- Initial call
		self.getMatch();
	};
	ko.applyBindings(vm);
});

