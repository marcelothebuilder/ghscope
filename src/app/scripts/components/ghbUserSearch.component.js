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
