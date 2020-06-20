'use strict';

var analyse = angular.module('myApp.analyse', ['ngRoute']);

analyse.controller('AnalyseCtrl', function ($scope, programService, $q) {
    getPrograms();

    function getPrograms() {
        programService.getPrograms().then(function (response) {
            var data = response;

            if (data[0].Progs) {
                $scope.programs = data[0].Progs;
            }
        });
    }
});