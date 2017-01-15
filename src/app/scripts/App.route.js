(function() {
    'use strict';

    var module = angular.module("marcelothebuilder.ghbangle");

    module.config(configLocationProvider)
        .config(configRouteProvider);

    configRouteProvider.$inject = ['$routeProvider'];

    function configRouteProvider($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "app/views/main.html"
            })
            .when("/user/:id", {
                templateUrl: "app/views/user.html",
                controller: "UserController",
                controllerAs: "vm",
                resolve: {
                    githubUser: ['GithubService', '$route', function(githubService, $route) {
                        return githubService.buscarUsuario($route.current.params.id);
                    }]
                }
            })
            .when("/repository/:username/:repository", {
                templateUrl: "app/views/repository.html",
                controller: "RepositoryController",
                controllerAs: "vm"
            })
            .otherwise({
                redirectTo: "/"
            });
    }

    function configLocationProvider($locationProvider) {
        $locationProvider.html5Mode(false);
    }
}());
