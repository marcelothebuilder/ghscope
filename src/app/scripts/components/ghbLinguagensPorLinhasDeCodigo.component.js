(function() {
    'use strict';

    var module = angular.module("marcelothebuilder.ghbangle");

    module.component("ghbLinguagensPorLinhasDeCodigo", {
        controller: GhbLinguagensPorLinhasDeCodigoController,
        controllerAs: 'model',
        templateUrl: 'app/scripts/components/ghbLinguagensPorLinhasDeCodigo.html',
        bindings: {
            dadosLinguagens: "<"
        }
    });

    GhbLinguagensPorLinhasDeCodigoController.$inject = ['HttpService', '$log'];

    function GhbLinguagensPorLinhasDeCodigoController(http, $log) {
        var model = this;
        model.carregado = true;
        model.labels = [];
        model.data = [];

        model.$onChanges = _changeHandler;

        function calculaLinhasPorLinguagem(linguagens) {
            var linhasPorLinguagem = linguagens.reduce(function(infoGeral, linguagens) {
                for (var linguagem in linguagens) {
                    if (linguagens.hasOwnProperty(linguagem)) {
                        var nomeLinguagem = linguagem;
                        var linhasLinguagem = linguagens[nomeLinguagem];

                        if (!infoGeral[nomeLinguagem]) {
                            infoGeral[nomeLinguagem] = 0;
                        }

                        infoGeral[nomeLinguagem] += linhasLinguagem;
                    }
                }

                return infoGeral;
            }, {});

            return linhasPorLinguagem;
        }

        function insereLinhasPorLinguagemEmGrafico(linhasPorLinguagem) {
            for (var nomeLinguagem in linhasPorLinguagem) {
                if (linhasPorLinguagem.hasOwnProperty(nomeLinguagem)) {
                    var linhas = linhasPorLinguagem[nomeLinguagem];
                    model.labels.push(nomeLinguagem);
                    model.data.push(linhas);
                }
            }
        }

        function _changeHandler(changes) {
            if (changes.dadosLinguagens) {
                _changeHandlerDadosLinguagens(changes.dadosLinguagens.currentValue);
            }
        }

        function _changeHandlerDadosLinguagens(dadosLinguagens) {
            if (dadosLinguagens && dadosLinguagens.length) {
                var linhasPorLinguagem = calculaLinhasPorLinguagem(dadosLinguagens);
                insereLinhasPorLinguagemEmGrafico(linhasPorLinguagem);
            }
        }
    }
}());
