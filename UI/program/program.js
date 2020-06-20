'use strict';

var prog = angular.module('myApp.program', ['ngRoute']);

prog.controller('ProgCtrl', function ($scope, programService, $q) {

    var program = JSON.parse(localStorage.getItem('program'));
    $scope.program = program;
    
    
});