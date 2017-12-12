$(document).ready(function () {
	var vm = function() {
		console.log('ViewModel initiated...');
		//---Variáveis locais
		var self = this;
		var url = window.location.href;
		var leagueID = url.split("=")[1];
		var baseUri = 'http://192.168.160.28/football/api/leagues/'+ leagueID;
		self.className = 'League';
		self.description = 'This page serves to view league details.';
		self.error = ko.observable();
		self.league = ko.observableArray([]);
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
		self.getLeague = function() {
			console.log('CALL: getLeague...');
			ajaxHelper(baseUri, 'GET').done(function(data) {
				self.className = data.countryName + " | " + data.name;
				self.league(data);
				console.log(data)
			});
		};
		//--- Initial call
		self.getLeague();
	};
	ko.applyBindings(vm);
});