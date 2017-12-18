$(document).ready(function () {
	$('#navbar').load('navbar.html', function () {
		$("#iNav").addClass("active");
	});
	var vm = function () {
		//console.log('ViewModel initiated...');
		//---Variáveis locais
		var self = this;
		var url = window.location.href;
		var baseUri1 = 'http://192.168.160.28/football/api/teams/teamsCount';
		var baseUri2 = 'http://192.168.160.28/football/api/players/playersCount';
		var baseUri3 = 'http://192.168.160.28/football/api/countries';
		var baseUri4 = 'http://192.168.160.28/football/api/leagues';
		var baseUri5 = 'http://192.168.160.28/football/api/seasons';
		var baseUri6 = 'http://192.168.160.28/football/api/matches';
		var baseUriPlayers = 'http://192.168.160.28/football/api/players/search?srcStr=';
		var baseUriTeams = 'http://192.168.160.28/football/api/teams/search?srcStr=';

		self.className = 'Index';
		self.description = 'This page serves to view many details.';
		self.error = ko.observable();
		self.countTeams = ko.observable();
		self.countPlayers = ko.observable();
		self.countCountries = ko.observable();
		self.countLeagues = ko.observable();
		self.countSeasons = ko.observable();
		self.search = ko.observable();
		self.players = ko.observableArray([]);
		self.teams = ko.observableArray([]);

		var globalTimeout = null;  
		$('#name').keyup(function(){
		  if(globalTimeout != null) clearTimeout(globalTimeout);  
		  globalTimeout =setTimeout(getTeams,1000);  
		});

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
		self.getCountTeams = function () {
			//console.log('CALL: getCountTeams...');
			ajaxHelper(baseUri1, 'GET').done(function (data) {
				self.countTeams(data);
			});
		};
		self.getCountPlayers = function () {
			//console.log('CALL: getCountPlayers...');
			ajaxHelper(baseUri2, 'GET').done(function (data) {
				self.countPlayers(data);
			});
		};
		self.getCountCountries = function () {
			//console.log('CALL: getCountCountries...');
			ajaxHelper(baseUri3, 'GET').done(function (data) {
				self.countCountries(data.length);
			});
		};
		self.getCountLeagues = function () {
			//console.log('CALL: getCountLeagues...');
			ajaxHelper(baseUri4, 'GET').done(function (data) {
				self.countLeagues(data.length);
			});
		};
		self.getCountSeasons = function () {
			//console.log('CALL: getCountSeasons...');
			ajaxHelper(baseUri5, 'GET').done(function (data) {
				self.countSeasons(data.length);
			});
		};
		self.getPlayers = function () {
			//console.log('CALL: getPlayers...');
			self.search($("#name").val());
			ajaxHelper(baseUriPlayers + self.search(), 'GET').done(function (data) {
				self.players(data);
			});
		};
		self.getTeams = function () {
			//console.log('CALL: getTeams...');
			self.search($("#name").val());
			ajaxHelper(baseUriTeams + self.search(), 'GET').done(function (data) {
				self.teams(data);
				self.getPlayers()
			});
		};
		self.reset = function () {
			//console.log('CALL: resetSearch...');
			self.search($("#name").val());
			self.players(null);
			self.teams(null);
		}
		//--- Initial call
		self.getCountTeams();
		self.getCountPlayers();
		self.getCountCountries();
		self.getCountLeagues();
		self.getCountSeasons();
		self.reset();		
	};
	ko.applyBindings(vm);
});