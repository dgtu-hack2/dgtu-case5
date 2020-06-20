'use strict';

var prog = angular.module('myApp.program', ['ngRoute']);

prog.controller('ProgCtrl', function ($scope, programService, $q) {

    var program = JSON.parse(localStorage.getItem('program'));
    $scope.program = program;
    getComps();
    var competitionList = [];

    function getComps() {
        programService.getCompetitionList().then(function (response) {
            competitionList = response[0].PKs;
        });
    }

    $scope.getComponent = function (url) {
        var out = "";
        angular.forEach(competitionList, function (cmp, index) {
            var urlShort = url.substring(url.indexOf('.'));
            try {
                out = eval('cmp' + urlShort);
                 
            } catch (ex) {
                out = "";
            }
            //console.log(eval(competitionsFull[index]+"."+indString))
        });
        //console.log(out)
        if(!out) out = "Не найден"
        return out;
    }


});