$(document).ready(function () {
	var vm = function() {
		console.log('ViewModel initiated...');
		//---Variáveis locais
        var self = this;
        var url = window.location.href;
		var playerID = url.split("=")[1];
		var baseUri = 'http://192.168.160.28/football/api/players/'+playerID;
		self.className = 'Player';
		self.description = 'This page serves to view the specific player.';
		self.error = ko.observable();
        self.player = ko.observableArray([]);
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
			console.log('CALL: getPlayer...');
			ajaxHelper(baseUri, 'GET').done(function(data) {
				self.player(data);
			});
		};
		//--- Initial call
		self.getMatch();
		
	};
	ko.applyBindings(vm);
});

