$(document).ready(function () {
	$('#navbar').load('navbar.html', function() {
		$("#cNav").addClass("active");
	});	
	var vm = function() {
		//console.log('ViewModel initiated...');
		//---Variáveis locais
		var self = this;
		var url = window.location.href;
		var countryID = url.split("=")[1];
		var baseUri = 'http://192.168.160.28/football/api/countries/'+ countryID;
		self.className = 'Countries';
		self.description = 'This page serves to view the list of soccer leagues in the country.';
		self.error = ko.observable();
		self.country = ko.observableArray([]);
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
					//console.log("AJAX Call [" + uri + "] Fail...");
					self.error(errorThrown);
				}
			})
		}
		//--- External functions (accessible outside)
		self.getCountry = function() {
			//console.log('CALL: getCountry...');
			ajaxHelper(baseUri, 'GET').done(function(data) {
				self.country(data);
				//console.log('CALL: getCountryLeagues...');
				baseUri = 'http://192.168.160.28/football/api/countries/countryLeagues/'+data.id;
				ajaxHelper(baseUri, 'GET').done(function(data) {
					self.league(data);
				});
			});
		};
		//--- Initial call
		self.getCountry();
	};
	ko.applyBindings(vm);
});