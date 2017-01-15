(function() {
    'use strict';
    var module = angular.module("marcelothebuilder.ghbangle");
    module.component("ghbLinguagensPorRepositorio", {
        templateUrl: 'app/scripts/components/ghbLinguagensPorRepositorio.html',
        controller: GhbLinguagensPorRepositorioController,
        controllerAs: 'model',
        bindings: {
            repositorios: "<"
        }
    });

    GhbLinguagensPorRepositorioController.$inject = ['HttpService', '$log'];

    function GhbLinguagensPorRepositorioController(http, $log) {
        var model = this;
        model.carregado = true;
        model.labels = [];
        model.data = [];

        model.$onChanges = _changeHandler;

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

        function _changeHandler(changes) {
            if (changes.repositorios) {
                _changeHandlerRepositorios(changes.repositorios.currentValue);
            }
        }

        function _changeHandlerRepositorios(repositorios) {
            if (repositorios && repositorios.length) {
                var linguagensStats = repositorios.reduce(_ocorrenciasLinguagensNoRepositorio, {});

                Object.keys(linguagensStats).forEach(function(linguagem) {
                    model.labels.push(linguagem);
                    model.data.push(linguagensStats[linguagem].contagem);
                });
            }
        }
    }
}());
