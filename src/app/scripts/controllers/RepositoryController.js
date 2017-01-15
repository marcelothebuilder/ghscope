(function() {
    'use strict';
    angular.module("marcelothebuilder.ghbangle").controller("RepositoryController", RepositoryController);

    RepositoryController.$inject = ['GithubService', '$log', '$anchorScroll', '$location', '$routeParams'];

    function RepositoryController(githubService, $log, $anchorScroll, $location, $routeParams) {
        var vm = this;
        vm.user = null;
        vm.repository = null;

        if ($routeParams) {
            vm.user = $routeParams.user;
            vm.repository = $routeParams.repository;
        }
    }
}());
