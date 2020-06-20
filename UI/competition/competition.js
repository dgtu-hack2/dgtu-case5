'use strict';

var comp = angular.module('myApp.competition', ['ngRoute']);

comp.controller('CompCtrl', function ($scope, programService, $q) {

    var competition = JSON.parse(localStorage.getItem('competition'));
    $scope.competition = competition;

});