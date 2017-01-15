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
