$(document).ready(function () {
    $('#navbar').load('navbar.html', function () {
        $("#tNav").addClass("active");
    });
    var vm = function () {
        //console.log('ViewModel initiated...');
        //---Variáveis locais
        var self = this;
        var url = window.location.href;
        var teams = url.split("=")[1];
        self.firstTeam = teams.split("&")[0];
        self.secondTeam = teams.split("&")[1];
        self.className = 'vsTeam';
        self.description = 'This page serves to compare two teams.';
        self.error = ko.observable();
        self.firstTeamid = ko.observable();
        self.secondTeamid = ko.observable();
        self.firstTeam1 = ko.observable();
        self.secondTeam1 = ko.observable();
        self.firstTeamName = ko.observable();
        self.secondTeamName = ko.observable();
        self.attributesHome = ko.observableArray([]);
        self.attributesAway = ko.observableArray([]);
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
        self.getFirstTeam = function () {
            console.log('CALL: getFirstTeam...');
            ajaxHelper('http://192.168.160.28/football/api/teams/seasons/' + self.firstTeam, 'GET').done(function (data) {
                for (var k = 0; k < data.length; k++) {
                    if (data[k].Label.substr(7, 2) == 16) {
                        self.attributesHome(data[k].Attributes);
                    }
                }
                getFirstTeam1();

            });
        };
        self.getFirstTeam1 = function () {
            //console.log('CALL: getFirstTeam1...');
            ajaxHelper('http://192.168.160.28/football/api/teams/' + self.firstTeam, 'GET').done(function (data) {
                self.firstTeam1(data.team_fifa_api_id);
                self.firstTeamid(data.id);                
                self.firstTeamName(data.team_long_name);
                
            });
        };
        self.getSecondTeam = function () {
            //console.log('CALL: getSecondTeam...');
            ajaxHelper('http://192.168.160.28/football/api/teams/seasons/' + self.secondTeam, 'GET').done(function (data) {
                for (var k = 0; k < data.length; k++) {
                    if (data[k].Label.substr(7, 2) == 16) {
                        self.attributesAway(data[k].Attributes);
                    }
                }
                getSecondTeam1();

            });
        };
        self.getSecondTeam1 = function () {
            //console.log('CALL: getSecondTeam1...');
            ajaxHelper('http://192.168.160.28/football/api/teams/' + self.secondTeam, 'GET').done(function (data) {
                self.secondTeam1(data.team_fifa_api_id);
                self.secondTeamid(data.id);
                self.secondTeamName(data.team_long_name);
                
            });
        };
        //--- Initial call
        self.getFirstTeam();
        self.getSecondTeam();
    };
    ko.applyBindings(vm);
});

