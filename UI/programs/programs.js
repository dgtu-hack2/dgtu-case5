'use strict';

var programs = angular.module('myApp.programs', ['ngRoute']);

programs.controller('ProgramsCtrl', function ($scope, programService, $location, $q) {
    getPrograms();

    $scope.lookProgram = function (program) {
        localStorage.setItem('program', JSON.stringify(program));
        $location.path('program');
    };

    function getPrograms() {
        programService.getPrograms().then(function (response) {
            var data = response;

            if (data[0].Progs) {
                $scope.programs = data[0].Progs;
                var programs = [];
                angular.forEach($scope.programs, function(prog){
                    programs.push(prog)
                })
                $scope.programs = programs;
            }
        });
    }
});