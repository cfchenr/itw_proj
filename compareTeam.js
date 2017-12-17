$(document).ready(function () {
	$('#navbar').load('navbar.html', function () {
		$("#tNav").addClass("active");
	});
	var vm = function () {
		//console.log('ViewModel initiated...');
		//---Variáveis locais
        var self = this;
        var url = window.location.href;
		var team = url.split("=")[1];
		var baseUri = 'http://192.168.160.28/football/api/teams/search?srcStr=';
		self.className = 'Teams';
		self.description = 'This page serves to search teams.';
        self.error = ko.observable();
        self.search = ko.observable();
        self.teams = ko.observableArray([]);
        self.team = ko.observable();
        self.team(team);
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
		self.getTeams = function () {
            //console.log('CALL: getTeams...');
            self.search($("#name").val());
			ajaxHelper(baseUri+self.search(), 'GET').done(function (data) {
                self.teams(data);
			});
        };
        self.reset = function() {
            //console.log('CALL: resetTeams...');
            self.search($("#name").val());
			self.teams(null);
		}
		self.reset();
		
	};
	ko.applyBindings(vm);
});