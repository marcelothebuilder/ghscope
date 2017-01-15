(function() {
    'use strict';
    angular.module("marcelothebuilder.ghbangle", ['ui.bootstrap', 'chart.js', 'ngRoute']);
}());

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
        $locationProvider.html5Mode({
            enabled: true
            // requireBase: false
        });
    }
}());

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

(function() {
    'use strict';
    var module = angular.module("marcelothebuilder.ghbangle");
    module.component("ghbNavbar", {
        templateUrl: 'app/scripts/components/ghbNavbar.html',
        controller: NavbarController,
        controllerAs: 'model'
    });

    NavbarController.$inject = [];

    function NavbarController() {
        var model = this;
    }

}());

(function() {
    'use strict';
    var module = angular.module("marcelothebuilder.ghbangle");
    module.component("ghbUserSearch", {
        templateUrl: 'app/scripts/components/ghbUserSearch.html',
        controller: GhbUserSearchController,
        controllerAs: 'model'
    });

    GhbUserSearchController.$inject = ['$log', '$location'];

    function GhbUserSearchController($log, $location) {
        var model = this;

        model.buscarUsuario = buscarUsuario;

        function buscarUsuario(nomeUsuario) {
            $location.url("/user/" + nomeUsuario.trim());
        }
    }

}());

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
