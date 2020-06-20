'use strict';

var analyseProgram = angular.module('myApp.analyseProgram', ['ngRoute']);

analyseProgram.controller('AnalyseProgCtrl', function ($scope, analyseService, $q) {
    
    $scope.compare = function(){
        compare();
    }
    
    function compare() {
        if($scope.urlForComparison){
            var url = {
                'url':$scope.urlForComparison
            }
            analyseService.compareTo(url).then(function (response) {
            var data = response;
            
            console.log(data);
        });
        } else {
            alert("bad url")
        }
        
    }
});