$(document).ready(function () {
	$('#navbar').load('navbar.html', function () {
		$("#pNav").addClass("active");
	});
	var vm = function () {
		//console.log('ViewModel initiated...');
		//---Variáveis locais
		var self = this;
		var baseUri = 'http://192.168.160.28/football/api/players/search?srcStr=';
		self.className = 'Players';
		self.description = 'This page serves to search players.';
        self.error = ko.observable();
        self.search = ko.observable();
		self.players = ko.observableArray([]);
		self.initPlayers = ko.observableArray([]);
		self.page = ko.observable();
		self.page(1);
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

		self.nextPage = function() {
			console.log(self.page()+1);
			ajaxHelper("http://192.168.160.28/football/api/players?page="+(self.page()+1)+"&pageSize=20", 'GET').done(function (data) {
				self.initPlayers(data);
				self.page(self.page()+1);
				self.reset();
			});
		};
		self.prevPage = function() {
			ajaxHelper("http://192.168.160.28/football/api/players?page="+(self.page()-1)+"&pageSize=20", 'GET').done(function (data) {
				self.initPlayers(data);
				self.page(self.page()-1);
				self.reset();
			});
		};

		var globalTimeout = null;  
		$('#name').keyup(function(){
		  if(globalTimeout != null) clearTimeout(globalTimeout);  
		  globalTimeout =setTimeout(getPlayers,1000);  
		});

		self.init = function() {
			ajaxHelper("http://192.168.160.28/football/api/players?page="+page+"&pageSize=20", 'GET').done(function (data) {
				self.initPlayers(data);
				self.reset();
			});
		}

		//--- External functions (accessible outside)
		self.getPlayers = function () {
            //console.log('CALL: getPlayers...');
            self.search($("#name").val());
			ajaxHelper(baseUri+self.search(), 'GET').done(function (data) {
				self.players(data);
				self.initPlayers(null);
			});
        };
        self.reset = function() {
            //console.log('CALL: resetPlayers...');
            self.search($("#name").val());
			self.players(null);
			ajaxHelper("http://192.168.160.28/football/api/players?page="+page+"&pageSize=20", 'GET').done(function (data) {
				self.initPlayers(data);
			});
        }
		self.init();		
	};
	ko.applyBindings(vm);
});