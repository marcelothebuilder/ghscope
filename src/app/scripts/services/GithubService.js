(function() {
    'use strict';
    angular.module("marcelothebuilder.ghbangle").service("GithubService", GithubService);

    GithubService.$inject = ['HttpService', '$log', '$q'];

    function GithubService($http, $log, $q) {
        var self = this;

        self.buscarUsuario = buscarUsuario;
        self.buscarRepositorios = buscarRepositorios;
        self.getEstatisticasLinguagens = getEstatisticasLinguagens;
        self.getDetalhesDeLinguagensDoRepositorio = getDetalhesDeLinguagensDoRepositorio;
        self.getDetalhesDeLinguagensDosRepositorios = getDetalhesDeLinguagensDosRepositorios;

        function buscarUsuario(nomeUsuario) {
            var promise = $http.get("https://api.github.com/users/" + nomeUsuario);
            return promise;
        }

        function buscarRepositorios(usuario) {
            var promise = $http.get(usuario.repos_url);
            return promise;
        }

        function getEstatisticasLinguagens(repositorios) {
            var linguagensInfo = repositorios.reduce(_ocorrenciasLinguagensNoRepositorio, {});
            return linguagensInfo;
        }

        function getDetalhesDeLinguagensDoRepositorio(repositorio) {
            var promise = $http.get(repositorio.languages_url, {
                cache: true
            });
            return promise;
        }

        function getDetalhesDeLinguagensDosRepositorios(repositorios) {
          var promises = [];
          repositorios.forEach(function(rep) {
              if (!rep.fork) {
                  var promise = self.getDetalhesDeLinguagensDoRepositorio(rep);
                  promises.push(promise);
              }
          });
          var promiseAll = $q.all(promises);
          return promiseAll;
        }

        function _ocorrenciasLinguagensNoRepositorio(linguagensInfo, repositorio) {
            var linguagem = repositorio.language;

            if (linguagem === null) {
                return linguagensInfo;
            }

            linguagensInfo[linguagem] = linguagensInfo[linguagem] || {};

            linguagensInfo[linguagem].contagem = linguagensInfo[linguagem].contagem || 0;
            linguagensInfo[linguagem].contagem++;

            return linguagensInfo;
        }
    }
}());
