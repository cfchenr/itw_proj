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
		self.matches = ko.observableArray([]);
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
				console.log('CALL: getMatches...');
				var baseUri = 'http://192.168.160.28/football/api/teams/seasons/'+ teamID;
				ajaxHelper(baseUri, 'GET').done(function(data) {
					self.matches(data);
				});
			});
		};
		//--- Initial call
		self.getTeam();
	};
	ko.applyBindings(vm);
});