(function() {
    'use strict';
    angular.module("marcelothebuilder.ghbangle").controller("MainController", MainController);

    MainController.$inject = ['GithubService', '$log', '$anchorScroll', '$location'];

    function MainController(githubService, $log, $anchorScroll, $location) {
        var vm = this;
        vm.perfil = {};
        vm.repositorios = [];
        vm.buscarUsuario = buscarUsuario;
        vm.chart = {};
        vm.chart.labels = [];
        vm.chart.data = [];

        function buscarUsuario(nomeUsuario) {
            githubService.buscarUsuario(nomeUsuario)
                .then(function(usuario) {
                    vm.perfil = usuario;
                    buscarRepositoriosDoUsuario(usuario);
                    console.log(usuario);
                    return usuario;
                }).catch($log.error);
        }

        function buscarRepositoriosDoUsuario(usuario) {
            var promise = githubService.buscarRepositorios(usuario)
                .then(function(repositorios) {
                    vm.repositorios = repositorios;

                    $location.hash('nome-usuario');
                    $anchorScroll();

                    var linguagensStats = githubService.getEstatisticasLinguagens(repositorios);

                    vm.chart.labels = [];
                    vm.chart.data = [];

                    Object.keys(linguagensStats).forEach(function(linguagem) {
                        vm.chart.labels.push(linguagem);
                        vm.chart.data.push(linguagensStats[linguagem].contagem);
                    });
                    return repositorios;
                }).catch($log.error);
        }
    }
}());
