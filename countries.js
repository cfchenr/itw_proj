$(document).ready(function () {
	var vm = function() {
		console.log('ViewModel initiated...');
		//---Variáveis locais
		var self = this;
		var url = window.location.href;
		var countryID = url.split("/")[1];
		var baseUri = 'http://192.168.160.28/football/api/countries/'+countryID;
		self.className = 'Countries';
		self.description = '';
		self.error = ko.observable();
		self.countries = ko.observableArray([]);
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
		self.getCountries = function() {
			console.log('CALL: getCountries...');
			ajaxHelper(baseUri, 'GET').done(function(data) {
				self.countries(data);
			});
		};
		//--- Initial call
		self.getCountries();
	};
	ko.applyBindings(vm);
});