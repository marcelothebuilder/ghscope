(function() {
    'use strict';
    angular.module("marcelothebuilder.ghbangle").controller("UserController", UserController);

    UserController.$inject = ['$scope', 'GithubService', '$log', '$anchorScroll', '$location', 'githubUser'];

    function UserController($scope, githubService, $log, $anchorScroll, $location, githubUser) {
        var vm = this;
        vm.perfil = {};
        vm.repositorios = [];

        vm.primeiroNome = primeiroNome;
        vm.criarUrlRepositorio = criarUrlRepositorio;

        vm.repositorios = [];
        vm.linguagensPorLinhas = [];

        vm.exibirLinguagensPorLinhaDeCodigo = exibirLinguagensPorLinhaDeCodigo;
        vm.exibeLinguagensPorLinhaDeCodigo = false;


        vm.perfil = githubUser;
        buscarRepositoriosDoUsuario(vm.perfil);

        function primeiroNome() {
            if (!vm.perfil || !vm.perfil.name) {
                return "Unknown";
            }

            var primeiroNome = vm.perfil.name.split(' ')[0];

            return primeiroNome;
        }

        function buscarUsuario(nomeUsuario) {
            githubService.buscarUsuario(nomeUsuario)
                .then(function(usuario) {
                    vm.perfil = usuario;
                    console.log(usuario);
                    buscarRepositoriosDoUsuario(usuario);
                    return usuario;
                }).catch($log.error);
        }

        function buscarRepositoriosDoUsuario(usuario) {
            var promise = githubService.buscarRepositorios(usuario)
                .then(function(repositorios) {

                    vm.repositorios = repositorios;
                    return repositorios;
                })
                .catch($log.error);
        }

        function getDetalhesDeLinguagens(repositorios) {
            return githubService.getDetalhesDeLinguagensDosRepositorios(repositorios);
        }

        function defineLinguagensPorLinhas(detalhesDeLinguagens) {
            vm.linguagensPorLinhas = detalhesDeLinguagens;
        }

        function procuraLinguagemMaisUsada(repositorios) {
            var linguagemMaisUsadaIndex = vm.charts.simple.data.indexOf(Math.max.apply(null, vm.charts.simple.data));
            vm.linguagemMaisUsada = vm.charts.simple.labels[linguagemMaisUsadaIndex];
            return repositorios;
        }

        function criarUrlRepositorio(repositorio) {
            return '#/repository/' + vm.perfil.login + '/' + repositorio.name;
        }

        function exibirLinguagensPorLinhaDeCodigo() {
            getDetalhesDeLinguagens(vm.repositorios)
                .then(defineLinguagensPorLinhas);

            vm.exibeLinguagensPorLinhaDeCodigo = true;
        }
    }
}());
