(function() {
    'use strict';
    angular.module("marcelothebuilder.ghbangle").service("HttpService", HttpService);

    HttpService.$inject = ['$http'];

    function HttpService($http) {
        var self = this;

        self.get = get;

        function get(url, config) {
            return $http.get(url, config).then(function(response) {
                return response.data;
            });
        }
    }
}());
