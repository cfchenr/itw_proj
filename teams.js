$(document).ready(function () {
	$('#navbar').load('navbar.html', function () {
		$("#tNav").addClass("active");
	});
	var vm = function () {
		//console.log('ViewModel initiated...');
		//---Variáveis locais
		var self = this;
		var baseUri = 'http://192.168.160.28/football/api/teams/search?srcStr=';
		var url = window.location.href;
		var page = url.split("=")[1];
		if(page == "") page = 1;
		self.className = 'Teams';
		self.description = 'This page serves to search teams.';
        self.error = ko.observable();
        self.search = ko.observable();
		self.teams = ko.observableArray([]);
		self.initTeams = ko.observableArray([]);
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
			ajaxHelper("http://192.168.160.28/football/api/teams?page="+(self.page()+1)+"&pageSize=20", 'GET').done(function (data) {
				self.initTeams(data);
				self.page(self.page()+1);
				self.reset();
			});
		};
		self.prevPage = function() {
			ajaxHelper("http://192.168.160.28/football/api/teams?page="+(self.page()-1)+"&pageSize=20", 'GET').done(function (data) {
				self.initTeams(data);
				self.page(self.page()-1);
				self.reset();
			});
		};

		var globalTimeout = null;  
		$('#name').keyup(function(){
		  if(globalTimeout != null) clearTimeout(globalTimeout);  
		  globalTimeout =setTimeout(getTeams,1000);  
		});

		self.init = function() {
			ajaxHelper("http://192.168.160.28/football/api/teams?page="+page+"&pageSize=20", 'GET').done(function (data) {
				self.initTeams(data);
				self.reset();
			});
		}

		//--- External functions (accessible outside)
		self.getTeams = function () {
            //console.log('CALL: getTeams...');
            self.search($("#name").val());
			ajaxHelper(baseUri+self.search(), 'GET').done(function (data) {
				self.teams(data);
				self.initTeams(null);
				
			});
        };
        self.reset = function() {
            //console.log('CALL: resetTeams...');
            self.search($("#name").val());
			self.teams(null);
		}
		self.init();
		
	};
	ko.applyBindings(vm);
});