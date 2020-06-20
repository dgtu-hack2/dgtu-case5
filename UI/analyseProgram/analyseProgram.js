'use strict';

var analyseProgram = angular.module('myApp.analyseProgram', ['ngRoute']);

analyseProgram.controller('AnalyseProgCtrl', function ($scope, analyseService, $q) {
    compare();

    function compare() {
        analyseService.compareTo($scope.urlForComparison).then(function (response) {
            var data = response;

            if (data[0].Progs) {
                console.log(data[0].Progs)
                $scope.programs = data[0].Progs;
            }
        });
    }
});