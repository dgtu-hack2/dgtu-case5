'use strict';

var comps = angular.module('myApp.competitions', ['ngRoute']);

comps.controller('CompsCtrl', function ($scope, competitionsService, $location) {

    competitionsService.getAllCompetitions().then(function(response){
        if(response[0].PKs){
            $scope.competitions = response[0].PKs;  
            console.log($scope.competitions)
        }
    })
    
    $scope.openCompetition = function(comp){
        localStorage.setItem('competition', JSON.stringify(comp));
        $location.path('competition');
    }

});