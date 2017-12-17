$(document).ready(function () {
    $('#navbar').load('navbar.html', function () {
        $("#pNav").addClass("active");
    });
    var vm = function () {
        console.log('ViewModel initiated...');
        //---Variáveis locais
        var self = this;
        var url = window.location.href;
        var players = url.split("=")[1];
        self.firstPlayer = players.split("&")[0];
        self.secondPlayer = players.split("&")[1];
        self.className = 'vsPlayer';
        self.description = 'This page serves to compare two players.';
        self.error = ko.observable();
        self.firstPlayerid = ko.observable();
        self.secondPlayerid = ko.observable();
        self.firstPlayer1 = ko.observable();
        self.secondPlayer1 = ko.observable();
        self.firstPlayerName = ko.observable();
        self.secondPlayerName = ko.observable();
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
                    console.log("AJAX Call [" + uri + "] Fail...");
                    self.error(errorThrown);
                }
            })
        }
        //--- External functions (accessible outside)
        self.getFirstPlayer = function () {
            console.log('CALL: getFirstPlayer...');
            ajaxHelper('http://192.168.160.28/football/api/players/' + self.firstPlayer, 'GET').done(function (data) {
                self.attributesHome(data.player_attributes);
                getFirstPlayer1();

            });
        };
        self.getFirstPlayer1 = function () {
            console.log('CALL: getFirstPlayer1...');
            ajaxHelper('http://192.168.160.28/football/api/players/' + self.firstPlayer, 'GET').done(function (data) {
                self.firstPlayer1(data.player_fifa_api_id);
                self.firstPlayerid(data.id);                
                self.firstPlayerName(data.player_name);
                
            });
        };
        self.getSecondPlayer = function () {
            console.log('CALL: getSecondPlayer...');
            ajaxHelper('http://192.168.160.28/football/api/players/' + self.secondPlayer, 'GET').done(function (data) {
                self.attributesAway(data.player_attributes);
                console.log(self.attributesAway());
                getSecondPlayer1();

            });
        };
        self.getSecondPlayer1 = function () {
            console.log('CALL: getSecondPlayer1...');
            ajaxHelper('http://192.168.160.28/football/api/players/' + self.secondPlayer, 'GET').done(function (data) {
                self.secondPlayer1(data.player_fifa_api_id);
                self.secondPlayerid(data.id);
                self.secondPlayerName(data.player_name);
                
            });
        };
        //--- Initial call
        self.getFirstPlayer();
        self.getSecondPlayer();
    };
    ko.applyBindings(vm);
});

