$(document).ready(function () {
	$('#navbar').load('navbar.html', function () {
		$("#pNav").addClass("active");
	});
	var vm = function () {
		console.log('ViewModel initiated...');
		//---Variáveis locais
		var self = this;
		var baseUri = 'http://192.168.160.28/football/api/players/search?srcStr=';
		self.className = 'Players';
		self.description = 'This page serves to search players.';
        self.error = ko.observable();
        self.search = ko.observable();
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
				error: function (jqXHR, textStatus, errorThrown) {
					console.log("AJAX Call [" + uri + "] Fail...");
					self.error(errorThrown);
				}
			})
		}
		//--- External functions (accessible outside)
		self.getPlayers = function () {
            console.log('CALL: getPlayers...');
            self.search($("#name").val());
			ajaxHelper(baseUri+self.search(), 'GET').done(function (data) {
                self.players(data);
			});
        };
        self.reset = function() {
            console.log('CALL: resetPlayers...');
            self.search($("#name").val());
			self.players(null);
        }
		
	};
	ko.applyBindings(vm);
});